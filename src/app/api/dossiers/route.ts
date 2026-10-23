import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { clientIdOf, requireRole, STAFF } from "@/lib/auth"
import { dossierSchema, erreurZod } from "@/lib/validations"

export async function GET() {
  const { session, error } = await requireRole(["ADMIN", "CONSEILLER", "CLIENT"])
  if (error) return error
  // Un client ne voit que ses propres dossiers
  const clientId = session.user.role === "CLIENT" ? await clientIdOf(session.user.id) : undefined
  if (clientId === null) return NextResponse.json([])
  const dossiers = await prisma.dossier.findMany({
    where: clientId ? { clientId } : undefined,
    include: { client: { select: { raisonSociale: true } }, _count: { select: { pieces: true } } },
    orderBy: { updatedAt: "desc" },
  })
  return NextResponse.json(dossiers)
}

export async function POST(req: Request) {
  const { error } = await requireRole(STAFF)
  if (error) return error
  const parsed = dossierSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  if (!(await prisma.client.findUnique({ where: { id: parsed.data.clientId } })))
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 })
  const dossier = await prisma.dossier.create({ data: parsed.data })
  return NextResponse.json(dossier, { status: 201 })
}
