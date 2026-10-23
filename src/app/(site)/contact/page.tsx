import type { Metadata } from "next"
import { Reveal } from "@/components/reveal"
import { Horaires } from "@/components/horaires"
import { PageBanner } from "@/components/site/page-banner"
import { ContactForm } from "@/components/site/contact-form"
import { SERVICES } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "Contact et devis",
  description: "Demandez un devis gratuit à CFDC ou faites-nous part de vos besoins spécifiques.",
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams
  const sujet = SERVICES.find((s) => s.slug === service)?.titre

  return (
    <>
      <PageBanner
        titre="Parlons de votre projet"
        texte="Contactez-nous dès aujourd'hui pour un devis gratuit ou pour plus d'informations. Nous sommes là pour vous aider à développer votre entreprise."
        image="/images/hero.jpg"
        alt="Une entrepreneure et son conseiller étudient un dossier"
        fil={[{ href: "/contact", label: "Contact" }]}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="rounded-3xl border p-6 md:p-8">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Demande de devis gratuit</h2>
          <ContactForm sujets={[...SERVICES.map((s) => s.titre), "Formation professionnelle", "Autre demande"]} sujet={sujet} />
        </Reveal>
        <Reveal delai={120} className="h-fit rounded-3xl bg-muted/50 p-6 md:p-8">
          <h2 className="mb-4 text-lg font-semibold">Nos horaires d&apos;ouverture</h2>
          <Horaires />
          <p className="mt-6 text-sm text-muted-foreground">
            Déjà client ? Suivez vos dossiers et demandez vos attestations depuis votre{" "}
            <a href="/login" className="font-medium text-primary hover:underline">
              espace client
            </a>
            .
          </p>
        </Reveal>
      </section>
    </>
  )
}
