// Contenu du site public modifiable depuis /gestion/site : la base prime, les valeurs par defaut
// (site-content.ts, constants.ts) servent de repli si la base est vide ou injoignable.
import { z } from "zod"
import { prisma } from "./prisma"
import { CONTACT } from "./constants"
import { LIVRES, SERVICES, type Livre, type Service } from "./site-content"

const chiffres = (s: string) => s.replace(/\D/g, "")

export const contactSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  tel1: z.string().trim().min(8, "Numéro trop court"),
  tel2: z.string().trim().optional().default(""),
  whatsapp: z.string().trim().min(8, "Numéro trop court"),
})
export type ContactSite = z.infer<typeof contactSchema>

export const servicesSchema = z.record(
  z.string(),
  z.object({
    titre: z.string().trim().min(2).max(120),
    accroche: z.string().trim().min(2).max(400),
    prestations: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
  }),
)
export type ServicesSite = z.infer<typeof servicesSchema>

export const livreSchema = z.object({
  titre: z.string().trim().min(2, "Titre trop court").max(120),
  description: z.string().trim().min(2, "Description trop courte").max(500),
  prix: z.number().int().min(0).max(100_000_000).nullable(),
  // image du depot (/images/livres/...) ou envoyee depuis la gestion (/api/site/images/...)
  image: z.string().regex(/^\/(images\/livres|api\/site\/images)\/[\w.-]+$/, "Image invalide"),
  alt: z.string().trim().min(2).max(190),
  visible: z.boolean(),
  ordre: z.number().int().min(0).max(10_000),
})

async function lire(cle: string): Promise<unknown> {
  try {
    return (await prisma.reglageSite.findUnique({ where: { cle } }))?.valeur ?? null
  } catch {
    return null
  }
}

/** Valeurs de contact telles que saisies (pour le formulaire d'edition). */
export async function contactSaisi(): Promise<ContactSite> {
  const v = contactSchema.safeParse(await lire("contact"))
  if (v.success) return v.data
  return {
    email: CONTACT.email,
    tel1: CONTACT.telephones[0].affichage,
    tel2: CONTACT.telephones[1]?.affichage ?? "",
    whatsapp: CONTACT.whatsapp.affichage,
  }
}

/** Contact au meme format que la constante CONTACT. */
export async function contactSite() {
  const c = await contactSaisi()
  const tels = [c.tel1, c.tel2].filter(Boolean).map((t) => ({ affichage: t, lien: `+${chiffres(t)}` }))
  return {
    email: c.email,
    telephones: tels,
    whatsapp: {
      affichage: c.whatsapp,
      numero: chiffres(c.whatsapp),
      lien: `https://wa.me/${chiffres(c.whatsapp)}?text=` + encodeURIComponent("Bonjour CFDC, je souhaite des informations sur vos services."),
    },
  }
}

export async function servicesSite(): Promise<Service[]> {
  const v = servicesSchema.safeParse(await lire("services"))
  if (!v.success) return SERVICES
  return SERVICES.map((s) => ({ ...s, ...(v.data[s.slug] ?? {}) }))
}

export type LivreAffiche = Pick<Livre, "slug" | "titre" | "description" | "image" | "alt"> & { prix: number | null }

/** Livres a vendre : ceux de la base (visibles) ; liste par defaut tant que la base est vide. */
export async function livresSite(): Promise<LivreAffiche[]> {
  try {
    const lignes = await prisma.livreSite.findMany({ where: { visible: true }, orderBy: [{ ordre: "asc" }, { createdAt: "asc" }] })
    if ((await prisma.livreSite.count()) > 0)
      return lignes.map((l) => ({ slug: l.id, titre: l.titre, description: l.description, image: l.image, alt: l.alt, prix: l.prix }))
  } catch {
    // base injoignable : liste par defaut
  }
  return LIVRES.map((l) => ({ ...l, prix: null }))
}
