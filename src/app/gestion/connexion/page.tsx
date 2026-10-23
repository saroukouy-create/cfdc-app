import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Gestion — connexion", robots: { index: false, follow: false } }

export default function ConnexionGestionPage() {
  return (
    <AuthCard
      titre="Espace de gestion"
      description="Réservé à l'équipe CFDC (administrateurs et conseillers)."
      pied="Vous êtes client ? Utilisez l'espace client depuis le site."
    >
      <Suspense>
        <LoginForm portail="gestion" />
      </Suspense>
    </AuthCard>
  )
}
