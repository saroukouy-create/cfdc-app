import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Connexion client" }

export default async function ConnexionClientPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams
  // La page d'inscription renvoie au meme endroit apres creation du compte
  const inscription = callbackUrl ? `/inscription?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/inscription"
  return (
    <AuthCard
      titre="Espace client"
      description="Connectez-vous pour faire vos demandes et suivre vos dossiers."
      pied={
        <>
          Pas encore client ?{" "}
          <Link href={inscription} className="font-medium text-primary hover:underline">
            Créer mon compte
          </Link>
        </>
      }
    >
      {/* useSearchParams exige une frontiere Suspense pour le rendu statique */}
      <Suspense>
        <LoginForm portail="client" />
      </Suspense>
    </AuthCard>
  )
}
