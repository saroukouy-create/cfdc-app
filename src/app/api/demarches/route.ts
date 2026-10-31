import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, STAFF } from "@/lib/auth"
import { demarcheSchema, erreurZod } from "@/lib/validations"

// Enregistrement d'une demarche faite pour un client sur une plateforme externe : equipe uniquement
export async function POST(req: Request) {
  const { error } = await requireRole(STAFF)
  if (error) return error
  const parsed = demarcheSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const { dateDemarche, montant, ...data } = parsed.data
  const date = new Date(dateDemarche)
  if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "dateDemarche : date invalide" }, { status: 400 })
  if (!(await prisma.client.findUnique({ where: { id: data.clientId }, select: { id: true } })))
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 })

  const demarche = await prisma.demarche.create({ data: { ...data, montant: montant ?? null, dateDemarche: date } })
  return NextResponse.json(demarche, { status: 201 })
}
