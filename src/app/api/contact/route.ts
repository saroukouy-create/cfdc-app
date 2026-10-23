import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { contactSchema, erreurZod } from "@/lib/validations"

// Route publique : formulaires du site (devis, inscription formation, message)
export async function POST(req: Request) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: erreurZod(parsed.error) }, { status: 400 })
  const { site_web, ...data } = parsed.data
  // Robot (champ piege rempli) : on repond OK sans rien enregistrer
  if (site_web) return NextResponse.json({ ok: true }, { status: 201 })

  // ponytail: anti-spam limite au champ piege ; ajouter un captcha ou une limite par IP si le spam apparait
  await prisma.demandeContact.create({ data })
  return NextResponse.json({ ok: true }, { status: 201 })
}
