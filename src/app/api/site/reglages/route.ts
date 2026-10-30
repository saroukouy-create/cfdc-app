import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { erreurZod } from "@/lib/validations"
import { contactSchema, servicesSchema } from "@/lib/site-db"

// Contact et textes des services du site public : reserve aux administrateurs
const SCHEMAS = { contact: contactSchema, services: servicesSchema } as const

export async function PUT(req: Request) {
  const { error } = await requireRole(["ADMIN"])
  if (error) return error
  const body = await req.json().catch(() => null)
  const cle = body?.cle as keyof typeof SCHEMAS
  if (!SCHEMAS[cle]) return NextResponse.json({ error: "Réglage inconnu" }, { status: 400 })
  const parsed = SCHEMAS[cle].safeParse(body.valeur)
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })

  await prisma.reglageSite.upsert({ where: { cle }, create: { cle, valeur: parsed.data }, update: { valeur: parsed.data } })
  revalidatePath("/", "layout")
  return NextResponse.json({ ok: true })
}
