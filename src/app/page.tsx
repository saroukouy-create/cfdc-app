import Image from "next/image"
import Link from "next/link"
import { Briefcase, Building2, Calculator, FileCheck2, GraduationCap, ShieldCheck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Horaires } from "@/components/horaires"
import { Reveal } from "@/components/reveal"

// Contenu issu du document "ACTIVITES CFDC" ; photos generees avec Canva (public/images)
const POLES = [
  {
    icon: Building2,
    titre: "Création d'entreprise",
    image: "/images/creation.jpg",
    alt: "Un entrepreneur signe les statuts de sa société avec une conseillère",
    points: ["Conseil et accompagnement dans le choix de la forme juridique", "Rédaction des statuts et formalités administratives"],
  },
  {
    icon: Briefcase,
    titre: "Gestion d'entreprise",
    image: "/images/gestion.jpg",
    alt: "Une comptable analyse des tableaux de bord financiers",
    points: [
      "Suivi comptable et financier",
      "Tableaux de bord et analyses de performance",
      "Conseils en gestion et optimisation des résultats",
      "Aide à la prise de décision stratégique",
    ],
  },
  {
    icon: GraduationCap,
    titre: "Formations professionnelles",
    image: "/images/formation.jpg",
    alt: "Un formateur explique Excel à des stagiaires",
    points: ["Secrétaire comptable", "Excel et Word", "Logiciel comptable Perfecto"],
  },
  {
    icon: Calculator,
    titre: "Assistance comptable, fiscale et sociale",
    points: [
      "Tenue de la comptabilité et comptes annuels",
      "Déclaration d'impôts et optimisation fiscale",
      "Gestion des paies et des déclarations sociales",
    ],
  },
  {
    icon: FileCheck2,
    titre: "Attestations et documents",
    points: [
      "Attestation fiscale, attestation CNSS",
      "Certificat de non faillite, quitus fiscal",
      "Attestation de domiciliation fiscale",
      "Réalisation d'inventaires et tous documents administratifs",
    ],
  },
]

const ATOUTS = [
  "Une équipe d'experts pluridisciplinaires à votre écoute",
  "Une approche personnalisée et adaptée à vos besoins",
  "Un suivi rigoureux et des conseils de qualité",
  "Un engagement de confidentialité et de respect des normes",
  "Un réseau de partenaires fiables pour tous vos projets",
]

function Logo({ className }: { className?: string }) {
  return <Image src="/images/logo-cfdc.png" alt="Cabinet CFDC" width={336} height={210} priority className={className} />
}

export default function Accueil() {
  const [phares, autres] = [POLES.filter((p) => p.image), POLES.filter((p) => !p.image)]
  return (
    <div className="min-h-dvh overflow-x-clip bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <Link href="/" className="entree-logo" aria-label="CFDC, accueil">
            <Logo className="vol h-14 w-auto" />
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "outline" })}>
            Espace client / collaborateur
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <div>
            <p className="entree-texte text-sm font-semibold tracking-wide text-marque uppercase">Bureau d&apos;études pluridisciplinaire</p>
            <h1 className="entree-titre mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
              Votre partenaire de confiance pour une création d&apos;entreprise réussie et une{" "}
              <span className="text-primary">gestion sereine</span>.
            </h1>
            <p className="entree-texte mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
              CFDC accompagne les entrepreneurs et les dirigeants de TPE/PME à toutes les étapes de la vie de leur entreprise.
              Notre mission : vous simplifier la vie entrepreneuriale.
            </p>
            <div className="entree-boutons mt-8 flex flex-wrap gap-3">
              <a href="#contact" className={buttonVariants({ size: "lg" })}>
                Demander un devis gratuit
              </a>
              <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Suivre mon dossier
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Aplat rouge decale : rappel des lettres du logo */}
            <div className="absolute -right-3 -bottom-3 h-2/3 w-2/3 rounded-3xl bg-marque/90 md:-right-5 md:-bottom-5" aria-hidden />
            <div className="entree-photo relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/images/hero.jpg"
                alt="Une entrepreneure et son conseiller CFDC étudient un dossier dans un bureau à Cotonou"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="zoom-lent object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight">Nos services</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Une gamme complète de services personnalisés, de la création à la gestion quotidienne de votre entreprise.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {phares.map(({ icon: Icon, titre, image, alt, points }, i) => (
                <Reveal key={titre} as="article" delai={i * 90} className="carte-vivante overflow-hidden rounded-2xl border bg-card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={image!} alt={alt!} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Icon className="size-5 text-marque" aria-hidden /> {titre}
                    </h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {autres.map(({ icon: Icon, titre, points }, i) => (
                <Reveal key={titre} as="article" delai={120 + i * 90} className="carte-vivante rounded-2xl border bg-card p-6">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Icon className="size-5 text-primary" aria-hidden /> {titre}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2" id="contact">
          <Reveal>
            <h2 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
              <ShieldCheck className="size-7 text-marque" aria-hidden /> Pourquoi choisir CFDC ?
            </h2>
            <ul className="mt-6 space-y-3">
              {ATOUTS.map((a) => (
                <li key={a} className="border-l-2 border-marque pl-3">
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-muted-foreground">
              Contactez-nous dès aujourd&apos;hui pour un devis gratuit ou pour nous faire part de vos besoins spécifiques.
              Nous sommes là pour vous aider à développer votre entreprise.
            </p>
          </Reveal>
          <Reveal delai={150} className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Nos horaires d&apos;ouverture</h2>
            <Horaires />
          </Reveal>
        </section>
      </main>

      <footer className="border-t bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center text-sm text-muted-foreground">
          <Logo className="h-12 w-auto" />
          <p>CFDC : bien plus qu&apos;un simple bureau d&apos;études, un véritable partenaire de confiance pour votre réussite.</p>
        </div>
      </footer>
    </div>
  )
}
