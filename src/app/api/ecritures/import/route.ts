import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, STAFF } from "@/lib/auth"
import { parseEcrituresCsv } from "@/lib/csv"

const MAX_CSV = 5 * 1024 * 1024

export async function POST(req: Request) {
  const { error } = await requireRole(STAFF)
  if (error) return error

  const form = await req.formData()
  const clientId = String(form.get("clientId") ?? "")
  const remplacer = form.get("remplacer") === "on"
  const file = form.get("fichier")

  if (!(await prisma.client.findUnique({ where: { id: clientId } })))
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 })
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Fichier CSV manquant" }, { status: 400 })
  if (file.size > MAX_CSV) return NextResponse.json({ error: "CSV trop volumineux (5 Mo max)" }, { status: 413 })

  const { ecritures, erreurs } = parseEcrituresCsv(await file.text())
  // Tout ou rien : un fichier avec des lignes invalides n'est pas importe a moitie
  if (erreurs.length) return NextResponse.json({ error: "Fichier refusé", erreurs: erreurs.slice(0, 20) }, { status: 400 })
  if (!ecritures.length) return NextResponse.json({ error: "Aucune écriture trouvée" }, { status: 400 })

  await prisma.$transaction([
    ...(remplacer ? [prisma.ecriture.deleteMany({ where: { clientId } })] : []),
    prisma.ecriture.createMany({ data: ecritures.map((e) => ({ ...e, clientId })) }),
  ])
  return NextResponse.json({ importees: ecritures.length }, { status: 201 })
}
