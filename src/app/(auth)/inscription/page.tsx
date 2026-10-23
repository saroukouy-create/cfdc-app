import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { AuthCard } from "@/components/auth/auth-card"
import { InscriptionForm } from "@/components/auth/inscription-form"

export const metadata: Metadata = { title: "Créer mon espace client" }

export default async function InscriptionPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams
  const connexion = callbackUrl ? `/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/connexion"
  return (
    <AuthCard
      large
      titre="Créer mon espace client"
      description="Un seul compte pour demander vos devis, attestations et formations, et suivre vos dossiers en ligne."
      pied={
        <>
          Déjà client ?{" "}
          <Link href={connexion} className="font-medium text-primary hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <Suspense>
        <InscriptionForm />
      </Suspense>
    </AuthCard>
  )
}
