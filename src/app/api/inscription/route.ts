import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { erreurZod, inscriptionSchema } from "@/lib/validations"

// Route publique : creation d'un compte client depuis /inscription
export async function POST(req: Request) {
  const parsed = inscriptionSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const { site_web, password, prenom, nom, email, telephone, raisonSociale } = parsed.data
  // Champ piege rempli : robot, on ne cree rien
  if (site_web) return NextResponse.json({ ok: true }, { status: 201 })

  if (await prisma.user.findUnique({ where: { email } }))
    return NextResponse.json({ error: "Un compte existe déjà avec cet email. Connectez-vous." }, { status: 409 })

  // ponytail: pas de verification de l'email (lien de confirmation) ; a ajouter avec un service d'envoi de mails
  await prisma.client.create({
    data: {
      raisonSociale: raisonSociale ?? `${prenom} ${nom}`,
      telephone,
      user: { create: { email, prenom, nom, password: await bcrypt.hash(password, 10), role: "CLIENT" } },
    },
  })
  return NextResponse.json({ ok: true }, { status: 201 })
}
