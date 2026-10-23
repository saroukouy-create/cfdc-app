import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { contactSchema, erreurZod } from "@/lib/validations"

// - Visiteur sans compte : simple message uniquement (page Contact)
// - Client connecte : devis, inscription formation ou message, rattaches a sa fiche
export async function POST(req: Request) {
  const corps = (await req.json().catch(() => null)) ?? {}
  const session = await getSession()
  const client =
    session?.user.role === "CLIENT"
      ? await prisma.client.findUnique({ where: { userId: session.user.id }, include: { user: true } })
      : null

  // Les coordonnees d'un client connecte viennent de son compte, pas du formulaire
  const parsed = contactSchema.safeParse(
    client
      ? { ...corps, nom: `${client.user.prenom} ${client.user.nom}`, email: client.user.email, telephone: client.telephone ?? undefined, entreprise: client.raisonSociale }
      : corps,
  )
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const { site_web, ...data } = parsed.data
  // Robot (champ piege rempli) : on repond OK sans rien enregistrer
  if (site_web) return NextResponse.json({ ok: true }, { status: 201 })

  if (data.type !== "MESSAGE" && !client)
    return NextResponse.json({ error: "Connectez-vous ou créez votre espace client pour faire cette demande." }, { status: 401 })

  // ponytail: anti-spam limite au champ piege ; ajouter un captcha ou une limite par IP si le spam apparait
  await prisma.demandeContact.create({ data: { ...data, clientId: client?.id } })
  return NextResponse.json({ ok: true }, { status: 201 })
}
