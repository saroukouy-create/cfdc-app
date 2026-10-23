// Libelles d'affichage des enums Prisma (texte metier issu du document "ACTIVITES CFDC")

export const FORMES_JURIDIQUES = [
  "Entreprise individuelle",
  "SARL",
  "SARL unipersonnelle",
  "SA",
  "SAS",
  "SNC",
  "SCS",
  "GIE",
  "Association",
] as const

export const ETAPES = [
  { key: "INFORMATIONS", label: "Informations" },
  { key: "FORME_JURIDIQUE", label: "Forme juridique" },
  { key: "PIECES", label: "Pièces" },
  { key: "DEPOT", label: "Dépôt" },
  { key: "SUIVI", label: "Suivi" },
] as const

export type EtapeKey = (typeof ETAPES)[number]["key"]

export const STATUT_DOSSIER: Record<string, string> = {
  EN_COURS: "En cours",
  DEPOSE: "Déposé",
  TERMINE: "Terminé",
  ABANDONNE: "Abandonné",
}

export const TYPE_SERVICE: Record<string, string> = {
  ATTESTATION_FISCALE: "Attestation fiscale",
  ATTESTATION_CNSS: "Attestation CNSS",
  CERTIFICAT_NON_FAILLITE: "Certificat de non faillite",
  ATTESTATION_DOMICILIATION_FISCALE: "Attestation de domiciliation fiscale",
  QUITUS_FISCAL: "Quitus fiscal",
  INVENTAIRE: "Réalisation d'inventaire",
  DECLARATION_IMPOTS: "Déclaration d'impôts",
  PAIE_DECLARATIONS_SOCIALES: "Paie et déclarations sociales",
  FORMATION: "Formation professionnelle",
  AUTRE: "Autre document administratif",
}

export const STATUT_DEMANDE: Record<string, string> = {
  NOUVELLE: "Nouvelle",
  EN_COURS: "En cours",
  PRETE: "Prête",
  LIVREE: "Livrée",
  REJETEE: "Rejetée",
}

export const ROLES: Record<string, string> = {
  ADMIN: "Administrateur",
  CONSEILLER: "Conseiller",
  CLIENT: "Client",
}

export const JOURNAUX = ["ACHATS", "VENTES", "CAISSE", "BANQUE", "OD"] as const

// Pieces jointes des dossiers : limite volontairement basse (stockage Hostinger mutualise)
export const UPLOAD_MAX_BYTES = 10 * 1024 * 1024
export const UPLOAD_TYPES = ["application/pdf", "image/jpeg", "image/png"]

// Horaires d'ouverture (document ACTIVITES CFDC) ; index = Date.getDay(), 0 = dimanche
export const HORAIRES: { jour: string; ouverture?: string; fermeture?: string }[] = [
  { jour: "Dimanche" },
  { jour: "Lundi", ouverture: "08:00", fermeture: "19:00" },
  { jour: "Mardi", ouverture: "08:00", fermeture: "19:00" },
  { jour: "Mercredi", ouverture: "08:00", fermeture: "19:00" },
  { jour: "Jeudi", ouverture: "08:00", fermeture: "19:00" },
  { jour: "Vendredi", ouverture: "08:00", fermeture: "19:00" },
  { jour: "Samedi", ouverture: "08:00", fermeture: "12:00" },
]
