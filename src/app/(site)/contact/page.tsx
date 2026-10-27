import type { Metadata } from "next"
import { Reveal } from "@/components/reveal"
import { Horaires } from "@/components/horaires"
import { PageBanner } from "@/components/site/page-banner"
import { ContactForm } from "@/components/site/contact-form"
import { DemandeCTA } from "@/components/site/demande-cta"
import { SERVICES } from "@/lib/site-content"
import { CONTACT } from "@/lib/constants"
import { Mail, MessageCircle, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question pour CFDC ? Écrivez-nous. Pour un devis, créez votre espace client.",
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
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <DemandeCTA
            sujet={sujet}
            titre="Demande de devis gratuit"
            texte="Devis, inscription à une formation, attestation : toutes vos demandes se font depuis votre espace client, où vous en suivez l'avancement."
          />
        </Reveal>
        <Reveal delai={120} className="h-fit rounded-3xl bg-muted/50 p-6 md:p-8">
          <h2 className="mb-4 text-lg font-semibold">Nous joindre</h2>
          <ul className="mb-8 space-y-3">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 font-medium hover:text-primary">
                <Mail className="size-5 shrink-0 text-marque" aria-hidden /> {CONTACT.email}
              </a>
            </li>
            {CONTACT.telephones.map((t) => (
              <li key={t.lien}>
                <a href={`tel:${t.lien}`} className="flex items-center gap-3 font-medium tabular-nums hover:text-primary">
                  <Phone className="size-5 shrink-0 text-marque" aria-hidden /> {t.affichage}
                </a>
              </li>
            ))}
            <li>
              <a href={CONTACT.whatsapp.lien} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-medium tabular-nums hover:text-primary">
                <MessageCircle className="size-5 shrink-0 text-[#25D366]" aria-hidden /> WhatsApp : {CONTACT.whatsapp.affichage}
              </a>
            </li>
          </ul>
          <h2 className="mb-4 text-lg font-semibold">Nos horaires d&apos;ouverture</h2>
          <Horaires />
        </Reveal>
        <Reveal className="rounded-3xl border p-6 md:p-8 lg:col-span-2">
          <h2 className="text-2xl font-semibold tracking-tight">Une simple question ?</h2>
          <p className="mt-2 mb-6 text-muted-foreground">Écrivez-nous sans créer de compte, nous vous répondons par email ou par téléphone.</p>
          <ContactForm type="MESSAGE" sujets={[...SERVICES.map((s) => s.titre), "Formations", "Autre question"]} libelleSujet="Votre question concerne" />
        </Reveal>
      </section>
    </>
  )
}
