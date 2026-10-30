import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, MessageCircle } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { PageBanner } from "@/components/site/page-banner"
import { buttonVariants } from "@/components/ui/button"
import { contactSite, livresSite, servicesSite } from "@/lib/site-db"

const lienAchat = (numero: string, titre: string) => `https://wa.me/${numero}?text=` + encodeURIComponent(`Bonjour CFDC, je souhaite acheter : ${titre}.`)
const fcfa = new Intl.NumberFormat("fr-FR")

export const metadata: Metadata = {
  title: "Nos services",
  description: "Création d'entreprise, gestion, assistance comptable, fiscale et sociale, attestations et documents administratifs, et vente de livres comptables.",
}

export default async function ServicesPage() {
  const [SERVICES, LIVRES, contact] = await Promise.all([servicesSite(), livresSite(), contactSite()])
  return (
    <>
      <PageBanner
        titre="Nos services"
        texte="Une gamme complète de services personnalisés et adaptés à vos besoins, à toutes les étapes de la vie de votre entreprise."
        image="/images/equipe.jpg"
        alt="L'équipe CFDC en réunion"
        fil={[{ href: "/services", label: "Services" }]}
      />
      <nav aria-label="Rubriques des services" className="mx-auto flex max-w-6xl flex-wrap gap-3 px-4 pt-10">
        <a href="#prestations" className={buttonVariants({ variant: "outline" })}>
          Nos prestations
        </a>
        <a href="#livres" className={buttonVariants({ variant: "outline" })}>
          Vente de livres comptables
        </a>
      </nav>
      <section id="prestations" aria-labelledby="titre-prestations" className="mx-auto grid max-w-6xl scroll-mt-24 gap-16 px-4 py-16">
        <h2 id="titre-prestations" className="text-3xl font-semibold tracking-tight">
          Nos prestations
        </h2>
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} as="article" className="grid items-center gap-8 md:grid-cols-2">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${i % 2 ? "md:order-2" : ""}`}>
              <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{s.titre}</h3>
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
      </section>

      <section id="livres" aria-labelledby="titre-livres" className="scroll-mt-24 border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 id="titre-livres" className="text-3xl font-semibold tracking-tight">
            Vente de livres comptables
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Des registres reliés, prêts à l&apos;emploi. Cliquez sur « Acheter sur WhatsApp » : votre message est déjà rédigé, il ne reste qu&apos;à l&apos;envoyer.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LIVRES.map((l) => (
              <li key={l.slug} className="flex flex-col overflow-hidden rounded-2xl border bg-card">
                <div className="relative aspect-[4/3]">
                  <Image src={l.image} alt={l.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold">{l.titre}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{l.description}</p>
                  {l.prix != null && <p className="mt-3 text-lg font-semibold tabular-nums">{fcfa.format(l.prix)} FCFA</p>}
                  <a
                    href={lienAchat(contact.whatsapp.numero, l.titre)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ className: "mt-4 w-full" })}
                  >
                    <MessageCircle aria-hidden /> {/autres/i.test(l.titre) ? "Commander sur WhatsApp" : "Acheter sur WhatsApp"}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
