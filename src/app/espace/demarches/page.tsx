import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { clientCourant } from "@/lib/client-courant"
import { PageHeader } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { ListeDemarches } from "@/components/demarches/liste-demarches"

export const metadata: Metadata = { title: "Mes démarches" }

export default async function MesDemarchesPage() {
  const client = await clientCourant()
  const demarches = await prisma.demarche.findMany({ where: { clientId: client.id }, orderBy: [{ dateDemarche: "desc" }, { createdAt: "desc" }] })
  return (
    <>
      <PageHeader titre="Mes démarches" description="Factures normalisées, déclarations et paiements d'impôts, comptabilité et création d'entreprise réalisés pour vous par CFDC" />
      <Card>
        <CardContent>
          <ListeDemarches demarches={demarches.map((d) => ({ ...d, montant: d.montant != null ? Number(d.montant) : null }))} />
        </CardContent>
      </Card>
    </>
  )
}
