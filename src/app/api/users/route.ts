import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { erreurZod, userSchema } from "@/lib/validations"

// Creation des comptes du personnel (administrateur, conseiller) : reserve aux administrateurs
export async function POST(req: Request) {
  const { error } = await requireRole(["ADMIN"])
  if (error) return error
  const parsed = userSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const { password, ...data } = parsed.data

  if (await prisma.user.findUnique({ where: { email: data.email } }))
    return NextResponse.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 })

  const user = await prisma.user.create({
    data: { ...data, password: await bcrypt.hash(password, 10) },
    select: { id: true, email: true, nom: true, prenom: true, role: true },
  })
  return NextResponse.json(user, { status: 201 })
}
