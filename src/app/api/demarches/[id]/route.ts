import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, STAFF } from "@/lib/auth"
import { demarcheStatutSchema, erreurZod } from "@/lib/validations"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole(STAFF)
  if (error) return error
  const { id } = await params
  const parsed = demarcheStatutSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  try {
    return NextResponse.json(await prisma.demarche.update({ where: { id }, data: { statut: parsed.data.statut } }))
  } catch {
    return NextResponse.json({ error: "Démarche introuvable" }, { status: 404 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole(STAFF)
  if (error) return error
  const { id } = await params
  await prisma.demarche.deleteMany({ where: { id } })
  return NextResponse.json({ ok: true })
}
