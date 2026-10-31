import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { clientCourant } from "@/lib/client-courant"
import { PageHeader } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JournalDemarches } from "@/components/demarches/journal-demarches"
import { ListeDemarches } from "@/components/demarches/liste-demarches"

export const metadata: Metadata = { title: "Mes démarches" }

export default async function MesDemarchesPage() {
  const client = await clientCourant()
  const [demarches, journal] = await Promise.all([
    prisma.demarche.findMany({ where: { clientId: client.id }, orderBy: [{ dateDemarche: "desc" }, { createdAt: "desc" }] }),
    prisma.journalDemarche.findMany({ where: { clientId: client.id }, orderBy: { createdAt: "desc" }, take: 30 }),
  ])
  return (
    <>
      <PageHeader titre="Mes démarches" description="Factures normalisées, déclarations et paiements d'impôts, comptabilité et création d'entreprise réalisés pour vous par CFDC" />
      <Card>
        <CardContent>
          <ListeDemarches demarches={demarches.map((d) => ({ ...d, montant: d.montant != null ? Number(d.montant) : null }))} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Historique</CardTitle>
        </CardHeader>
        <CardContent>
          <JournalDemarches evenements={journal.map((j) => ({ id: j.id, action: j.action, acteur: "l'équipe CFDC", detail: j.detail, createdAt: j.createdAt }))} />
        </CardContent>
      </Card>
    </>
  )
}
