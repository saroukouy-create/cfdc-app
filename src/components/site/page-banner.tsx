import Image from "next/image"
import Link from "next/link"

/** Bandeau d'en-tete des pages interieures : photo en fond, voile bleu, fil d'Ariane. */
export function PageBanner({
  titre,
  texte,
  image,
  alt,
  fil,
}: {
  titre: string
  texte?: string
  image: string
  alt: string
  fil?: { href: string; label: string }[]
}) {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <Image src={image} alt={alt} fill priority sizes="100vw" className="zoom-lent -z-10 object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/85 to-primary/40" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        {fil && (
          <nav aria-label="Fil d'Ariane" className="entree-texte mb-4 text-sm text-primary-foreground/75">
            <Link href="/" className="hover:underline">
              Accueil
            </Link>
            {fil.map((f) => (
              <span key={f.href}>
                {" / "}
                <Link href={f.href} className="hover:underline">
                  {f.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <h1 className="entree-titre max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-5xl">{titre}</h1>
        {texte && <p className="entree-texte mt-4 max-w-2xl text-lg text-primary-foreground/85 text-pretty">{texte}</p>}
        <div className="entree-boutons mt-6 h-1 w-16 rounded-full bg-marque" aria-hidden />
      </div>
    </section>
  )
}
