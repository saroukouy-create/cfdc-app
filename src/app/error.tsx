"use client"

import Link from "next/link"
import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"

// Erreur inattendue dans une page : message clair et possibilite de reessayer, sans perdre la navigation
export default function Erreur({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="contenu" className="flex min-h-[60dvh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto size-10 text-marque" aria-hidden />
        <h1 className="mt-4 text-2xl font-semibold">Un problème est survenu</h1>
        <p className="mt-2 text-muted-foreground">
          La page n&apos;a pas pu s&apos;afficher. Réessayez ; si le problème continue, contactez le cabinet.
          {error.digest && <span className="mt-2 block text-xs">Référence : {error.digest}</span>}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Réessayer</Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
