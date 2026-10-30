import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { erreurZod } from "@/lib/validations"
import { livreSchema } from "@/lib/site-db"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole(["ADMIN"])
  if (error) return error
  const { id } = await params
  const parsed = livreSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const existe = await prisma.livreSite.findUnique({ where: { id }, select: { id: true } })
  if (!existe) return NextResponse.json({ error: "Livre introuvable" }, { status: 404 })
  const livre = await prisma.livreSite.update({ where: { id }, data: parsed.data })
  revalidatePath("/", "layout")
  return NextResponse.json(livre)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole(["ADMIN"])
  if (error) return error
  const { id } = await params
  await prisma.livreSite.deleteMany({ where: { id } })
  revalidatePath("/", "layout")
  return NextResponse.json({ ok: true })
}
