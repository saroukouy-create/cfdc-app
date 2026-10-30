import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"
import { ATOUTS } from "@/lib/site-content"
import { servicesSite } from "@/lib/site-db"

export default async function Accueil() {
  const SERVICES = await servicesSite()
  return (
    <>
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
            <Link href="/contact" className={buttonVariants({ size: "lg" })}>
              Demander un devis gratuit
            </Link>
            <Link href="/services" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Découvrir nos services
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
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Nos services</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Une gamme complète de services personnalisés, de la création à la gestion quotidienne de votre entreprise.
              </p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              Tous les services <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} as="article" delai={i * 80} className="carte-vivante group overflow-hidden rounded-2xl border bg-card">
                <Link href={`/services/${s.slug}`} className="block h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold group-hover:text-primary">{s.titre}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.accroche}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-marque">
                      En savoir plus <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image src="/images/formation.jpg" alt="Un formateur explique Excel à des stagiaires" fill sizes="(min-width: 768px) 50vw, 100vw" className="zoom-lent object-cover" />
        </Reveal>
        <Reveal delai={120}>
          <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-marque uppercase">
            <GraduationCap className="size-5" aria-hidden /> Formations professionnelles
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Développez vos compétences</h2>
          <p className="mt-4 text-muted-foreground">
            Secrétaire comptable, Excel, Word et logiciel comptable Perfecto : des formations pratiques pour être opérationnel rapidement.
          </p>
          <Link href="/formations" className={buttonVariants({ className: "mt-6" })}>
            Voir les formations
          </Link>
        </Reveal>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight">Pourquoi choisir CFDC ?</h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {ATOUTS.map((a, i) => (
              <Reveal key={a.titre} as="li" delai={i * 70}>
                <CheckCircle2 className="size-6 text-marque" aria-hidden />
                <h3 className="mt-3 font-semibold">{a.titre}</h3>
                <p className="mt-1 text-sm text-primary-foreground/80">{a.texte}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-balance">Un projet, une question ? Parlons-en.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Contactez-nous dès aujourd&apos;hui pour un devis gratuit ou pour nous faire part de vos besoins spécifiques.
          </p>
          <Link href="/contact" className={buttonVariants({ size: "lg", className: "mt-6" })}>
            Demander un devis gratuit
          </Link>
        </Reveal>
      </section>
    </>
  )
}
