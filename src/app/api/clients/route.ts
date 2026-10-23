import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { requireRole, STAFF } from "@/lib/auth"
import { clientSchema, erreurZod } from "@/lib/validations"

export async function GET(req: Request) {
  const { error } = await requireRole(STAFF)
  if (error) return error
  const q = new URL(req.url).searchParams.get("q")?.trim()
  const clients = await prisma.client.findMany({
    where: q
      ? { OR: [{ raisonSociale: { contains: q } }, { secteurActivite: { contains: q } }, { user: { email: { contains: q } } }] }
      : undefined,
    include: { user: { select: { email: true, nom: true, prenom: true } } },
    orderBy: { raisonSociale: "asc" },
  })
  return NextResponse.json(clients)
}

export async function POST(req: Request) {
  const { error } = await requireRole(STAFF)
  if (error) return error
  const parsed = clientSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const { prenom, nom, email, password, ...client } = parsed.data

  if (await prisma.user.findUnique({ where: { email } }))
    return NextResponse.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 })

  // Le compte CLIENT donne acces a l'espace client (/espace)
  const created = await prisma.client.create({
    data: {
      ...client,
      user: { create: { email, nom, prenom, password: await bcrypt.hash(password, 10), role: "CLIENT" } },
    },
  })
  return NextResponse.json(created, { status: 201 })
}
