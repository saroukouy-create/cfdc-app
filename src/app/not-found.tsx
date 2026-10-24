import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = { title: "Page introuvable" }

export default function PageIntrouvable() {
  return (
    <main id="contenu" className="titres-serif flex min-h-dvh items-center justify-center bg-muted/40 p-6">
      <div className="max-w-md text-center">
        <Image src="/images/logo-cfdc.png" alt="Cabinet CFDC" width={336} height={210} className="mx-auto h-16 w-auto" />
        <p className="mt-6 text-sm font-semibold tracking-wide text-marque uppercase">Erreur 404</p>
        <h1 className="mt-2 text-3xl font-semibold">Page introuvable</h1>
        <p className="mt-3 text-muted-foreground">Cette page n&apos;existe pas ou a été déplacée.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants()}>
            Accueil
          </Link>
          <Link href="/services" className={buttonVariants({ variant: "outline" })}>
            Nos services
          </Link>
          <Link href="/espace" className={buttonVariants({ variant: "outline" })}>
            Espace client
          </Link>
        </div>
      </div>
    </main>
  )
}
