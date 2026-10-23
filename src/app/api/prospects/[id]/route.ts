import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, STAFF } from "@/lib/auth"
import { contactUpdateSchema, erreurZod } from "@/lib/validations"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole(STAFF)
  if (error) return error
  const { id } = await params
  const parsed = contactUpdateSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  try {
    return NextResponse.json(await prisma.demandeContact.update({ where: { id }, data: parsed.data }))
  } catch {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 })
  }
}
