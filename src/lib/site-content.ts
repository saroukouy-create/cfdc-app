// Contenu du site public, issu des documents "ACTIVITES CFDC" et "CYCLE POUR LE BILAN".
// Photos generees avec Canva puis exportees en haute definition (public/images).

export type Service = {
  slug: string
  titre: string
  accroche: string
  image: string
  alt: string
  prestations: string[]
  deroule: { titre: string; texte: string }[]
}

export const SERVICES: Service[] = [
  {
    slug: "creation-entreprise",
    titre: "Création d'entreprise",
    accroche: "Du choix de la forme juridique à l'immatriculation, nous portons votre projet jusqu'à la naissance de votre entreprise.",
    image: "/images/creation.jpg",
    alt: "Un entrepreneur signe les statuts de sa société avec une conseillère",
    prestations: [
      "Conseil et accompagnement dans le choix de la forme juridique",
      "Rédaction des statuts",
      "Formalités administratives de création",
      "Suivi du dossier jusqu'à l'obtention du RCCM",
    ],
    deroule: [
      { titre: "Informations", texte: "Nous recueillons votre projet : activité, associés, capital, siège." },
      { titre: "Forme juridique", texte: "Nous comparons les options (EI, SARL, SA, SAS…) et choisissons avec vous." },
      { titre: "Pièces", texte: "Vous déposez vos justificatifs en ligne, dans votre espace client." },
      { titre: "Dépôt", texte: "Nous rédigeons les statuts et déposons le dossier auprès des services compétents." },
      { titre: "Suivi", texte: "Vous suivez chaque étape en ligne jusqu'à l'immatriculation." },
    ],
  },
  {
    slug: "gestion-entreprise",
    titre: "Gestion d'entreprise",
    accroche: "Des chiffres clairs pour décider sereinement : suivi financier, tableaux de bord et conseils de gestion.",
    image: "/images/gestion.jpg",
    alt: "Une comptable analyse des tableaux de bord financiers",
    prestations: [
      "Suivi comptable et financier",
      "Établissement de tableaux de bord et d'analyses de performance",
      "Conseils en gestion et optimisation des résultats",
      "Aide à la prise de décision stratégique",
    ],
    deroule: [
      { titre: "Diagnostic", texte: "Nous analysons votre activité, vos marges et votre trésorerie." },
      { titre: "Tableaux de bord", texte: "Vous accédez en ligne à vos indicateurs : trésorerie, produits, charges, résultat." },
      { titre: "Conseil", texte: "Nous identifions les leviers d'amélioration et vous accompagnons dans vos décisions." },
    ],
  },
  {
    slug: "assistance-comptable-fiscale-sociale",
    titre: "Assistance comptable, fiscale et sociale",
    accroche: "Votre comptabilité tenue avec rigueur, vos déclarations faites à temps, vos paies gérées sans souci.",
    image: "/images/assistance.jpg",
    alt: "Un conseiller fiscal explique une déclaration à deux commerçants",
    prestations: [
      "Tenue de la comptabilité et établissement des comptes annuels",
      "Déclaration d'impôts et optimisation fiscale",
      "Gestion des paies et des déclarations sociales",
    ],
    deroule: [
      { titre: "Enregistrement", texte: "Saisie au jour le jour : journaux, caisse, comptes des grands auxiliaires." },
      { titre: "Balance avant inventaire", texte: "Contrôle de l'équilibre des comptes." },
      { titre: "Inventaire et régularisations", texte: "Écritures d'inventaire et de régularisation, clôture des comptes." },
      { titre: "Balance après inventaire", texte: "Vérification finale avant les états financiers." },
      { titre: "États financiers", texte: "Bilan, compte de résultat et états annexes." },
    ],
  },
  {
    slug: "attestations-documents",
    titre: "Attestations et documents administratifs",
    accroche: "Obtenez rapidement vos attestations et documents officiels, sans perdre de temps dans les démarches.",
    image: "/images/attestations.jpg",
    alt: "Une assistante remet des documents officiels à un chef d'entreprise",
    prestations: [
      "Attestation fiscale",
      "Attestation CNSS",
      "Certificat de non faillite",
      "Attestation de domiciliation fiscale",
      "Quitus fiscal",
      "Réalisation d'inventaires",
      "Et tous autres documents administratifs",
    ],
    deroule: [
      { titre: "Demande", texte: "Vous faites votre demande en ligne ou au cabinet." },
      { titre: "Traitement", texte: "Nous constituons le dossier et effectuons les démarches." },
      { titre: "Remise", texte: "Vous êtes prévenu dès que votre document est prêt." },
    ],
  },
]

export const FORMATIONS = [
  {
    id: "secretaire-comptable",
    titre: "Secrétaire comptable",
    description: "Les bases de la comptabilité, la tenue des journaux, le classement des pièces et le secrétariat d'entreprise.",
    public: "Demandeurs d'emploi, assistants, personnes en reconversion",
  },
  {
    id: "excel",
    titre: "Excel",
    description: "Formules, tableaux, graphiques et tableaux croisés dynamiques pour gérer et analyser vos données.",
    public: "Tout public, du débutant au niveau avancé",
  },
  {
    id: "word",
    titre: "Word",
    description: "Mise en page professionnelle de courriers, rapports et documents administratifs.",
    public: "Tout public",
  },
  {
    id: "perfecto",
    titre: "Logiciel comptable Perfecto",
    description: "Prise en main du logiciel : paramétrage, saisie, éditions comptables et états de fin d'exercice.",
    public: "Comptables, aides-comptables, gérants de PME",
  },
] as const

export const ATOUTS = [
  { titre: "Une équipe pluridisciplinaire", texte: "Des experts à votre écoute en comptabilité, fiscalité, droit des affaires et gestion." },
  { titre: "Une approche personnalisée", texte: "Des solutions adaptées à votre activité, à votre taille et à vos besoins." },
  { titre: "Un suivi rigoureux", texte: "Des conseils de qualité et un suivi régulier de vos dossiers." },
  { titre: "Confidentialité", texte: "Un engagement de confidentialité et de respect des normes." },
  { titre: "Un réseau de partenaires", texte: "Des partenaires fiables pour vous accompagner dans tous vos projets." },
]

export const NAV_SITE = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/formations", label: "Formations" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
]
