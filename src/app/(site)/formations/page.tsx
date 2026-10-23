import type { Metadata } from "next"
import { BookOpen, Calculator, FileText, Sheet } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { PageBanner } from "@/components/site/page-banner"
import { DemandeCTA } from "@/components/site/demande-cta"
import { FORMATIONS } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "Formations professionnelles",
  description: "Formations secrétaire comptable, Excel, Word et logiciel comptable Perfecto.",
}

const ICONES = { "secretaire-comptable": BookOpen, excel: Sheet, word: FileText, perfecto: Calculator } as const

export default function FormationsPage() {
  return (
    <>
      <PageBanner
        titre="Formations professionnelles"
        texte="Des formations pratiques pour gagner en compétences et en employabilité, animées par des professionnels."
        image="/images/formation.jpg"
        alt="Un formateur explique Excel à des stagiaires"
        fil={[{ href: "/formations", label: "Formations" }]}
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {FORMATIONS.map((f, i) => {
            const Icone = ICONES[f.id]
            return (
              <Reveal key={f.id} as="article" delai={i * 80} className="carte-vivante rounded-2xl border bg-card p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-marque/10 text-marque">
                  <Icone className="size-6" aria-hidden />
                </span>
                <h2 className="mt-4 text-xl font-semibold">{f.titre}</h2>
                <p className="mt-2 text-muted-foreground">{f.description}</p>
                <p className="mt-4 text-sm">
                  <span className="font-medium">Public : </span>
                  {f.public}
                </p>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <Reveal>
            <DemandeCTA
              type="FORMATION"
              titre="S'inscrire à une formation"
              texte="Choisissez votre formation depuis votre espace client : nous vous recontactons pour les dates, le lieu et les modalités."
            />
          </Reveal>
        </div>
      </section>
    </>
  )
}
