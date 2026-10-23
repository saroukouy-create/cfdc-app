import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, STAFF } from "@/lib/auth"
import { dossierUpdateSchema, erreurZod } from "@/lib/validations"
import type { EtapeDossier } from "@prisma/client"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole(STAFF)
  if (error) return error
  const { id } = await params
  const parsed = dossierUpdateSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const { etape, ...data } = parsed.data
  try {
    const dossier = await prisma.dossier.update({
      where: { id },
      data: { ...data, etape: etape as EtapeDossier | undefined },
    })
    return NextResponse.json(dossier)
  } catch {
    return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 })
  }
}
