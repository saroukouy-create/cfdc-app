import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { PageBanner } from "@/components/site/page-banner"
import { DemandeCTA } from "@/components/site/demande-cta"
import { SERVICES } from "@/lib/site-content"
import { servicesSite } from "@/lib/site-db"

// Une page statique par service, generee au build
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = (await servicesSite()).find((x) => x.slug === slug)
  return s ? { title: s.titre, description: s.accroche } : {}
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tous = await servicesSite()
  const service = tous.find((s) => s.slug === slug)
  if (!service) notFound()
  const autres = tous.filter((s) => s.slug !== slug)

  return (
    <>
      <PageBanner
        titre={service.titre}
        texte={service.accroche}
        image={service.image}
        alt={service.alt}
        fil={[
          { href: "/services", label: "Services" },
          { href: `/services/${slug}`, label: service.titre },
        ]}
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Ce que nous faisons pour vous</h2>
          <ul className="mt-6 space-y-3">
            {service.prestations.map((p) => (
              <li key={p} className="flex gap-3 rounded-xl border bg-card p-4">
                <Check className="mt-0.5 size-5 shrink-0 text-marque" aria-hidden /> {p}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delai={120} className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto">
          <Image src={service.image} alt={service.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="zoom-lent object-cover" />
        </Reveal>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">Comment ça se passe</h2>
          </Reveal>
          <ol className="mt-8 grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
            {service.deroule.map((e, i) => (
              <Reveal key={e.titre} as="li" delai={i * 80} className="relative rounded-2xl border bg-card p-5">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">{i + 1}</span>
                <h3 className="mt-3 font-semibold">{e.titre}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{e.texte}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <DemandeCTA
            sujet={service.titre}
            titre="Demandez votre devis gratuit"
            texte="Depuis votre espace client, décrivez votre besoin : un conseiller CFDC vous recontacte rapidement avec une proposition adaptée."
          />
        </Reveal>
        <Reveal delai={100}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">Nos autres services</h3>
          <ul className="mt-3 space-y-2">
            {autres.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                  {s.titre} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  )
}
