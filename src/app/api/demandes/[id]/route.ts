import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, STAFF } from "@/lib/auth"
import { demandeUpdateSchema, erreurZod } from "@/lib/validations"
import type { StatutDemande } from "@prisma/client"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole(STAFF)
  if (error) return error
  const { id } = await params
  const parsed = demandeUpdateSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  try {
    const demande = await prisma.demandeService.update({
      where: { id },
      data: { statut: parsed.data.statut as StatutDemande, reponse: parsed.data.reponse },
    })
    return NextResponse.json(demande)
  } catch {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 })
  }
}
