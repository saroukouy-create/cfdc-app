import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth"
import { erreurZod } from "@/lib/validations"
import { livreSchema } from "@/lib/site-db"

export async function POST(req: Request) {
  const { error } = await requireRole(["ADMIN"])
  if (error) return error
  const parsed = livreSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const livre = await prisma.livreSite.create({ data: parsed.data })
  revalidatePath("/", "layout")
  return NextResponse.json(livre, { status: 201 })
}
