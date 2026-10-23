import type { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "./login-form"

export const metadata: Metadata = { title: "Connexion" }

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Link href="/" aria-label="CFDC, accueil" className="entree-logo w-fit">
            <Image src="/images/logo-cfdc.png" alt="Cabinet CFDC" width={336} height={210} priority className="h-16 w-auto" />
          </Link>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Espace collaborateurs et espace client</CardDescription>
        </CardHeader>
        <CardContent>
          {/* useSearchParams exige une frontiere Suspense pour le rendu statique */}
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}
