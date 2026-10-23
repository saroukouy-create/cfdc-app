import Link from "next/link"
import { Briefcase, Building2, Calculator, FileCheck2, GraduationCap, ShieldCheck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Horaires } from "@/components/horaires"

// Contenu issu du document "ACTIVITES CFDC"
const POLES = [
  {
    icon: Building2,
    titre: "Création d'entreprise",
    points: ["Conseil et accompagnement dans le choix de la forme juridique", "Rédaction des statuts et formalités administratives"],
  },
  {
    icon: Briefcase,
    titre: "Gestion d'entreprise",
    points: [
      "Suivi comptable et financier",
      "Tableaux de bord et analyses de performance",
      "Conseils en gestion et optimisation des résultats",
      "Aide à la prise de décision stratégique",
    ],
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
  {
    icon: GraduationCap,
    titre: "Formations professionnelles",
    points: ["Secrétaire comptable", "Excel et Word", "Logiciel comptable Perfecto"],
  },
]

const ATOUTS = [
  "Une équipe d'experts pluridisciplinaires à votre écoute",
  "Une approche personnalisée et adaptée à vos besoins",
  "Un suivi rigoureux et des conseils de qualité",
  "Un engagement de confidentialité et de respect des normes",
  "Un réseau de partenaires fiables pour tous vos projets",
]

export default function Accueil() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-lg font-bold tracking-tight text-primary">CFDC</span>
          <Link href="/login" className={buttonVariants({ variant: "outline" })}>
            Espace client / collaborateur
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">Bureau d&apos;études pluridisciplinaire</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-5xl">
            Votre partenaire de confiance pour une création d&apos;entreprise réussie et une gestion sereine.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
            CFDC accompagne les entrepreneurs et les dirigeants de TPE/PME à toutes les étapes de la vie de leur entreprise.
            Notre mission : vous simplifier la vie entrepreneuriale.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className={buttonVariants({ size: "lg" })}>
              Demander un devis gratuit
            </a>
            <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Suivre mon dossier
            </Link>
          </div>
        </section>

        <section className="border-y bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-semibold tracking-tight">Nos services</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {POLES.map(({ icon: Icon, titre, points }) => (
                <article key={titre} className="rounded-xl border bg-card p-6">
                  <Icon className="size-6 text-primary" aria-hidden />
                  <h3 className="mt-4 font-semibold">{titre}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2" id="contact">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <ShieldCheck className="size-6 text-primary" aria-hidden /> Pourquoi choisir CFDC ?
            </h2>
            <ul className="mt-6 space-y-3">
              {ATOUTS.map((a) => (
                <li key={a} className="border-l-2 border-primary pl-3">
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-muted-foreground">
              Contactez-nous dès aujourd&apos;hui pour un devis gratuit ou pour nous faire part de vos besoins spécifiques.
              Nous sommes là pour vous aider à développer votre entreprise.
            </p>
          </div>
          <div className="rounded-xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Nos horaires d&apos;ouverture</h2>
            <Horaires />
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        CFDC : bien plus qu&apos;un simple bureau d&apos;études, un véritable partenaire de confiance pour votre réussite.
      </footer>
    </div>
  )
}
