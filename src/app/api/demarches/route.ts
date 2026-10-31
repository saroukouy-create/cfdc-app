import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, STAFF } from "@/lib/auth"
import { demarcheSchema, erreurZod } from "@/lib/validations"
import { PLATEFORME_DEMARCHE, STATUT_DEMARCHE } from "@/lib/constants"

// Enregistrement d'une demarche faite pour un client sur une plateforme externe : equipe uniquement
export async function POST(req: Request) {
  const { session, error } = await requireRole(STAFF)
  if (error) return error
  const parsed = demarcheSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const { dateDemarche, montant, ...data } = parsed.data
  const date = new Date(dateDemarche)
  if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "dateDemarche : date invalide" }, { status: 400 })
  if (!(await prisma.client.findUnique({ where: { id: data.clientId }, select: { id: true } })))
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 })

  // Creation et trace dans la meme transaction : pas de demarche sans historique
  const demarche = await prisma.$transaction(async (tx) => {
    const d = await tx.demarche.create({ data: { ...data, montant: montant ?? null, dateDemarche: date } })
    await tx.journalDemarche.create({
      data: {
        demarcheId: d.id,
        clientId: d.clientId,
        action: "CREATION",
        acteur: session.user.name ?? session.user.email ?? "Equipe",
        acteurId: session.user.id,
        detail: `Enregistrée : ${d.objet} (${PLATEFORME_DEMARCHE[d.plateforme]})${d.reference ? ` - réf. ${d.reference}` : ""} - statut ${STATUT_DEMARCHE[d.statut]}`,
      },
    })
    return d
  })
  return NextResponse.json(demarche, { status: 201 })
}
