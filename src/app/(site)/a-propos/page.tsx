import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"
import { PageBanner } from "@/components/site/page-banner"
import { ATOUTS } from "@/lib/site-content"
import { servicesSite } from "@/lib/site-db"

export const metadata: Metadata = {
  title: "À propos",
  description: "CFDC, bureau d'études pluridisciplinaire au service des entrepreneurs et dirigeants de TPE/PME.",
}

// Document "CYCLE POUR LE BILAN"
const CYCLE = [
  "Enregistrement au jour le jour",
  "Balance avant inventaire",
  "Inventaire et écritures de régularisation",
  "Balance après inventaire",
  "États financiers : bilan, compte de résultat, annexes",
]

export default async function AProposPage() {
  const cycle = (await servicesSite()).find((s) => s.slug === "assistance-comptable-fiscale-sociale")!
  return (
    <>
      <PageBanner
        titre="Un partenaire de confiance pour votre réussite"
        texte="CFDC est un bureau d'études pluridisciplinaire spécialisé dans l'accompagnement des entrepreneurs et des dirigeants de TPE/PME."
        image="/images/equipe.jpg"
        alt="L'équipe pluridisciplinaire CFDC en réunion"
        fil={[{ href: "/a-propos", label: "À propos" }]}
      />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-marque uppercase">Notre mission</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance">Vous simplifier la vie entrepreneuriale</h2>
          <p className="mt-4 text-muted-foreground">
            Nous accompagnons les entreprises à toutes les étapes de leur vie : de la création à la gestion quotidienne,
            en passant par la comptabilité, la fiscalité, le social et les démarches administratives. Chaque client
            bénéficie d&apos;une gamme complète de services personnalisés et adaptés à ses besoins.
          </p>
        </Reveal>
        <Reveal delai={120} className="relative aspect-video overflow-hidden rounded-3xl">
          <Image src="/images/equipe.jpg" alt="L'équipe CFDC" fill sizes="(min-width: 768px) 50vw, 100vw" className="zoom-lent object-cover" />
        </Reveal>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight">Nos engagements</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ATOUTS.map((a, i) => (
              <Reveal key={a.titre} delai={i * 70} className="rounded-2xl border bg-card p-6">
                <CheckCircle2 className="size-6 text-marque" aria-hidden />
                <h3 className="mt-3 font-semibold">{a.titre}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.texte}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <p className="text-sm font-semibold tracking-wide text-marque uppercase">Notre méthode</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Le cycle comptable, jusqu&apos;au bilan</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Une démarche rigoureuse, étape par étape, que vous suivez en ligne depuis votre espace client.
          </p>
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {CYCLE.map((etape, i) => (
            <Reveal key={etape} as="li" delai={i * 90} className="relative rounded-2xl border-t-4 border-primary bg-card p-5 shadow-sm">
              {/* Numero decoratif (l'ordre est porte par la liste <ol>) ; contraste >= 3:1 pour le gros texte */}
              <span aria-hidden className="text-3xl font-bold text-primary/70 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-medium">{etape}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-10 flex flex-wrap gap-3">
          <Link href={`/services/${cycle.slug}`} className={buttonVariants()}>
            Notre assistance comptable
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
            Nous contacter
          </Link>
        </Reveal>
      </section>
    </>
  )
}
