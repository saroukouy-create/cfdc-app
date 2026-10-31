import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, STAFF } from "@/lib/auth"
import { STATUT_DEMARCHE } from "@/lib/constants"
import { demarcheStatutSchema, erreurZod } from "@/lib/validations"

const nomActeur = (s: { user: { name?: string | null; email?: string | null } }) => s.user.name ?? s.user.email ?? "Equipe"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole(STAFF)
  if (error) return error
  const { id } = await params
  const parsed = demarcheStatutSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })

  const avant = await prisma.demarche.findUnique({ where: { id } })
  if (!avant) return NextResponse.json({ error: "Démarche introuvable" }, { status: 404 })
  if (avant.statut === parsed.data.statut) return NextResponse.json(avant)

  const [demarche] = await prisma.$transaction([
    prisma.demarche.update({ where: { id }, data: { statut: parsed.data.statut } }),
    prisma.journalDemarche.create({
      data: {
        demarcheId: id,
        clientId: avant.clientId,
        action: "STATUT",
        acteur: nomActeur(session),
        acteurId: session.user.id,
        detail: `${avant.objet} : statut ${STATUT_DEMARCHE[avant.statut]} -> ${STATUT_DEMARCHE[parsed.data.statut]}`,
      },
    }),
  ])
  return NextResponse.json(demarche)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole(STAFF)
  if (error) return error
  const { id } = await params
  const avant = await prisma.demarche.findUnique({ where: { id } })
  if (!avant) return NextResponse.json({ ok: true })

  // La trace de la suppression est conservee (objet, reference, montant) meme si la demarche disparait
  await prisma.$transaction([
    prisma.journalDemarche.create({
      data: {
        demarcheId: id,
        clientId: avant.clientId,
        action: "SUPPRESSION",
        acteur: nomActeur(session),
        acteurId: session.user.id,
        detail: `Supprimée : ${avant.objet}${avant.reference ? ` - réf. ${avant.reference}` : ""}${avant.montant != null ? ` - ${Number(avant.montant)} FCFA` : ""}`,
      },
    }),
    prisma.demarche.delete({ where: { id } }),
  ])
  return NextResponse.json({ ok: true })
}
