import { NextResponse } from "next/server"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"
import { prisma } from "@/lib/prisma"
import { clientIdOf, requireRole } from "@/lib/auth"
import { UPLOAD_MAX_BYTES, UPLOAD_TYPES } from "@/lib/constants"
import { nomSur, UPLOAD_DIR } from "@/lib/uploads"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole(["ADMIN", "CONSEILLER", "CLIENT"])
  if (error) return error
  const { id } = await params

  const dossier = await prisma.dossier.findUnique({ where: { id } })
  if (!dossier) return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 })
  if (session.user.role === "CLIENT" && dossier.clientId !== (await clientIdOf(session.user.id)))
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const file = (await req.formData()).get("fichier")
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 })
  if (file.size > UPLOAD_MAX_BYTES) return NextResponse.json({ error: "Fichier trop volumineux (10 Mo max)" }, { status: 413 })
  if (!UPLOAD_TYPES.includes(file.type))
    return NextResponse.json({ error: "Formats acceptés : PDF, JPEG, PNG" }, { status: 415 })

  const relatif = path.join(id, `${randomUUID()}-${nomSur(file.name)}`)
  await mkdir(path.join(UPLOAD_DIR, id), { recursive: true })
  await writeFile(path.join(UPLOAD_DIR, relatif), Buffer.from(await file.arrayBuffer()))

  const piece = await prisma.piece.create({
    data: { nom: file.name, chemin: relatif, taille: file.size, type: file.type, dossierId: id },
  })
  return NextResponse.json(piece, { status: 201 })
}
