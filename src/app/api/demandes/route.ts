import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { clientIdOf, requireRole } from "@/lib/auth"
import { demandeSchema, erreurZod } from "@/lib/validations"
import type { TypeService } from "@prisma/client"

export async function POST(req: Request) {
  const { session, error } = await requireRole(["ADMIN", "CONSEILLER", "CLIENT"])
  if (error) return error
  const parsed = demandeSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })

  // Un client ne peut deposer une demande que pour lui-meme
  const clientId = session.user.role === "CLIENT" ? await clientIdOf(session.user.id) : parsed.data.clientId
  if (!clientId || !(await prisma.client.findUnique({ where: { id: clientId } })))
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 })

  const demande = await prisma.demandeService.create({
    data: { type: parsed.data.type as TypeService, description: parsed.data.description, clientId },
  })
  return NextResponse.json(demande, { status: 201 })
}
