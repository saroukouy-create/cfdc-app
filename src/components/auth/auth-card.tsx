import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/** Cadre commun des pages de connexion et d'inscription. */
export function AuthCard({
  titre,
  description,
  accueil = "/",
  pied,
  large,
  children,
}: {
  titre: string
  description: string
  accueil?: string
  pied?: React.ReactNode
  large?: boolean
  children: React.ReactNode
}) {
  return (
    <main id="contenu" tabIndex={-1} className="titres-serif flex min-h-dvh items-center justify-center bg-muted/40 p-4 outline-none">
      <div className={`w-full ${large ? "max-w-xl" : "max-w-sm"}`}>
        <Card>
          <CardHeader>
            <Link href={accueil} aria-label="CFDC, accueil" className="entree-logo w-fit">
              <Image src="/images/logo-cfdc.png" alt="Cabinet CFDC" width={336} height={210} priority className="h-16 w-auto" />
            </Link>
            <CardTitle>
              <h1>{titre}</h1>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        {pied && <div className="mt-4 text-center text-sm text-muted-foreground">{pied}</div>}
      </div>
    </main>
  )
}
