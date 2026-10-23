import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { PageBanner } from "@/components/site/page-banner"
import { SERVICES } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "Nos services",
  description: "Création d'entreprise, gestion, assistance comptable, fiscale et sociale, attestations et documents administratifs.",
}

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        titre="Nos services"
        texte="Une gamme complète de services personnalisés et adaptés à vos besoins, à toutes les étapes de la vie de votre entreprise."
        image="/images/equipe.jpg"
        alt="L'équipe CFDC en réunion"
        fil={[{ href: "/services", label: "Services" }]}
      />
      <div className="mx-auto grid max-w-6xl gap-16 px-4 py-16">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} as="article" className="grid items-center gap-8 md:grid-cols-2">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${i % 2 ? "md:order-2" : ""}`}>
              <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{s.titre}</h2>
              <p className="mt-3 text-muted-foreground">{s.accroche}</p>
              <ul className="mt-5 space-y-2">
                {s.prestations.slice(0, 4).map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 size-5 shrink-0 text-marque" aria-hidden /> {p}
                  </li>
                ))}
              </ul>
              <Link href={`/services/${s.slug}`} className="mt-6 inline-flex items-center gap-1 font-medium text-primary hover:underline">
                Découvrir ce service <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  )
}
