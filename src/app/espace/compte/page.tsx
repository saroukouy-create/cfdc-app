import type { Metadata } from "next"
import { PageHeader } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangerMotDePasse } from "@/components/auth/changer-mot-de-passe"

export const metadata: Metadata = { title: "Mon compte" }

export default function CompteClientPage() {
  return (
    <>
      <PageHeader titre="Mon compte" description="Sécurité de votre accès à l'espace client" />
      <Card>
        <CardHeader>
          <CardTitle>Changer mon mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangerMotDePasse />
        </CardContent>
      </Card>
    </>
  )
}
