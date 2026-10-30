import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { changerMotDePasseSchema, erreurZod } from "@/lib/validations"

// Changement du mot de passe par l'utilisateur connecte (administrateur, conseiller ou client)
export async function PUT(req: Request) {
  const { session, error } = await requireRole(["ADMIN", "CONSEILLER", "CLIENT"])
  if (error) return error
  const parsed = changerMotDePasseSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { password: true } })
  if (!user || !(await bcrypt.compare(parsed.data.actuel, user.password)))
    return NextResponse.json({ error: "Le mot de passe actuel est incorrect" }, { status: 400 })

  await prisma.user.update({ where: { id: session.user.id }, data: { password: await bcrypt.hash(parsed.data.nouveau, 10) } })
  return NextResponse.json({ ok: true })
}
