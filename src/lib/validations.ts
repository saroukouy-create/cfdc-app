import { z } from "zod"
import { ETAPES, TYPE_SERVICE } from "./constants"

// Champs texte optionnels : "" -> undefined
const texte = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || undefined)

// Montant saisi en texte ("1 500 000") -> nombre
const montant = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? Number(v.replace(/[\s  ]/g, "").replace(",", ".")) : undefined))
  .refine((v) => v === undefined || (Number.isFinite(v) && v >= 0), "Montant invalide")

const motDePasse = z.string().min(8, "8 caractères minimum")

export const clientSchema = z.object({
  raisonSociale: z.string().trim().min(2, "Raison sociale requise"),
  formeJuridique: texte,
  secteurActivite: texte,
  chiffreAffaires: montant,
  telephone: texte,
  adresse: texte,
  ifu: texte,
  prenom: z.string().trim().min(1, "Prénom requis"),
  nom: z.string().trim().min(1, "Nom requis"),
  email: z.email("Email invalide").transform((v) => v.toLowerCase()),
  password: motDePasse,
})

export const dossierSchema = z.object({
  clientId: z.string().min(1, "Client requis"),
  denomination: z.string().trim().min(2, "Dénomination requise"),
  activite: texte,
  formeJuridique: texte,
  capital: montant,
  siege: texte,
})

const etapes = ETAPES.map((e) => e.key) as [string, ...string[]]

export const dossierUpdateSchema = z.object({
  denomination: z.string().trim().min(2).optional(),
  activite: texte,
  formeJuridique: texte,
  capital: montant,
  siege: texte,
  etape: z.enum(etapes).optional(),
  statut: z.enum(["EN_COURS", "DEPOSE", "TERMINE", "ABANDONNE"]).optional(),
  dateDepot: texte.transform((v) => (v ? new Date(v) : undefined)),
  numeroRccm: texte,
  notes: texte,
})

export const demandeSchema = z.object({
  type: z.enum(Object.keys(TYPE_SERVICE) as [string, ...string[]], "Type de service requis"),
  description: texte,
  clientId: z.string().optional(), // impose par le personnel ; deduit de la session pour un client
})

export const demandeUpdateSchema = z.object({
  statut: z.enum(["NOUVELLE", "EN_COURS", "PRETE", "LIVREE", "REJETEE"]),
  reponse: texte,
})

export const userSchema = z.object({
  prenom: z.string().trim().min(1, "Prénom requis"),
  nom: z.string().trim().min(1, "Nom requis"),
  email: z.email("Email invalide").transform((v) => v.toLowerCase()),
  password: motDePasse,
  role: z.enum(["ADMIN", "CONSEILLER"]),
})

export type ClientInput = z.input<typeof clientSchema>
export type DossierInput = z.input<typeof dossierSchema>
export type UserInput = z.input<typeof userSchema>

/** Premier message d'erreur Zod, pour une reponse 400 lisible. */
export function erreurZod(e: z.ZodError) {
  const i = e.issues[0]
  return i ? `${i.path.join(".") || "requête"} : ${i.message}` : "Données invalides"
}

// Formulaire public (devis, inscription formation, message). `site_web` est un piege a robots :
// un humain ne voit pas ce champ, il doit rester vide.
export const contactSchema = z.object({
  type: z.enum(["DEVIS", "FORMATION", "MESSAGE"]),
  nom: z.string().trim().min(2, "Nom requis").max(120),
  entreprise: texte,
  email: z.email("Email invalide").transform((v) => v.toLowerCase()),
  telephone: texte,
  sujet: texte,
  message: z.string().trim().max(3000, "3000 caractères maximum").optional().transform((v) => v || undefined),
  site_web: z.string().optional(),
})

export const contactUpdateSchema = z.object({
  statut: z.enum(["NOUVEAU", "CONTACTE", "CONVERTI", "CLOS"]),
  note: texte,
})

export type ContactInput = z.input<typeof contactSchema>

// Inscription d'un client depuis le site (cree un compte CLIENT et sa fiche)
export const inscriptionSchema = z
  .object({
    prenom: z.string().trim().min(1, "Prénom requis").max(80),
    nom: z.string().trim().min(1, "Nom requis").max(80),
    email: z.email("Email invalide").transform((v) => v.toLowerCase()),
    telephone: z.string().trim().min(8, "Téléphone requis").max(30),
    raisonSociale: texte, // facultatif : un porteur de projet n'a pas encore d'entreprise
    password: motDePasse,
    confirmation: z.string(),
    site_web: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmation, { path: ["confirmation"], message: "Les mots de passe ne correspondent pas" })

export type InscriptionInput = z.input<typeof inscriptionSchema>

export const changerMotDePasseSchema = z
  .object({
    actuel: z.string().min(1, "Mot de passe actuel requis"),
    nouveau: motDePasse,
    confirmation: z.string(),
  })
  .refine((d) => d.nouveau === d.confirmation, { path: ["confirmation"], message: "Les mots de passe ne correspondent pas" })
  .refine((d) => d.nouveau !== d.actuel, { path: ["nouveau"], message: "Choisissez un mot de passe différent de l'actuel" })
