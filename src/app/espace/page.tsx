import type { Metadata } from "next"
import Link from "next/link"
import { FileDown } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { clientCourant } from "@/lib/client-courant"
import { lignesClient, syntheseClient } from "@/lib/donnees"
import { etatsFinanciers, exercices } from "@/lib/etats-financiers"
import { PageHeader } from "@/components/layout/app-shell"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CompteResultat, CycleComptable } from "@/components/compta/etats"
import { EtatsSyscohada } from "@/components/compta/etats-syscohada"
import { GraphiqueResultat, GraphiqueTresorerie } from "@/components/compta/graphiques"

export const metadata: Metadata = { title: "Mon espace" }

export default async function EspacePage() {
  const client = await clientCourant()
  const [synthese, lignes, dossiersActifs, demandesOuvertes] = await Promise.all([
    syntheseClient(client.id),
    lignesClient(client.id),
    prisma.dossier.count({ where: { clientId: client.id, statut: { in: ["EN_COURS", "DEPOSE"] } } }),
    prisma.demandeService.count({ where: { clientId: client.id, statut: { in: ["NOUVELLE", "EN_COURS", "PRETE"] } } }),
  ])

  return (
    <>
      <PageHeader titre={client.raisonSociale} description="Votre tableau de bord CFDC">
        {synthese.nbEcritures > 0 && (
          <a href="/api/rapports/pdf" target="_blank" className={buttonVariants()}>
            <FileDown aria-hidden /> Mon rapport de gestion (PDF)
          </a>
        )}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/espace/dossiers" className="rounded-xl border bg-card p-5 transition-colors hover:border-primary">
          <p className="text-sm text-muted-foreground">Créations d&apos;entreprise en cours</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{dossiersActifs}</p>
        </Link>
        <Link href="/espace/demandes" className="rounded-xl border bg-card p-5 transition-colors hover:border-primary">
          <p className="text-sm text-muted-foreground">Demandes en cours</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{demandesOuvertes}</p>
        </Link>
      </div>

      {synthese.nbEcritures === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Vos tableaux de bord apparaîtront ici dès que votre conseiller aura saisi votre comptabilité.
        </p>
      ) : (
        <div className="mt-6 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Avancement de votre comptabilité</CardTitle>
            </CardHeader>
            <CardContent>
              <CycleComptable cycle={synthese.cycle} />
            </CardContent>
          </Card>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trésorerie</CardTitle>
              </CardHeader>
              <CardContent>
                <GraphiqueTresorerie data={synthese.series} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Produits et charges</CardTitle>
              </CardHeader>
              <CardContent>
                <GraphiqueResultat data={synthese.series} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Synthèse du résultat</CardTitle>
            </CardHeader>
            <CardContent>
              <CompteResultat resultat={synthese.resultat} />
            </CardContent>
          </Card>
          <EtatsSyscohada etats={etatsFinanciers(lignes, exercices(lignes)[0])} entite={client.raisonSociale} ifu={client.ifu} />
        </div>
      )}
    </>
  )
}
