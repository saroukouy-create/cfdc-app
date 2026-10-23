import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { clientCourant } from "@/lib/client-courant"
import { PageHeader } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DemandeForm } from "@/components/services/demande-form"
import { STATUT_DEMANDE, TYPE_SERVICE } from "@/lib/constants"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = { title: "Mes demandes" }

export default async function MesDemandesPage() {
  const client = await clientCourant()
  const demandes = await prisma.demandeService.findMany({ where: { clientId: client.id }, orderBy: { createdAt: "desc" } })

  return (
    <>
      <PageHeader titre="Mes demandes" description="Obtention rapide d'attestations et de documents administratifs" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid h-fit gap-3 lg:col-span-2">
          {demandes.length === 0 && <p className="text-muted-foreground">Aucune demande pour l&apos;instant.</p>}
          {demandes.map((d) => (
            <article key={d.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{TYPE_SERVICE[d.type]}</h2>
                  <p className="text-xs text-muted-foreground">Demandée le {formatDate(d.createdAt)}</p>
                </div>
                <Badge variant={d.statut === "PRETE" ? "default" : d.statut === "REJETEE" ? "destructive" : "secondary"}>
                  {STATUT_DEMANDE[d.statut]}
                </Badge>
              </div>
              {d.description && <p className="mt-2 text-sm">{d.description}</p>}
              {d.reponse && (
                <p className="mt-3 rounded-lg bg-muted p-3 text-sm">
                  <span className="font-medium">Réponse CFDC : </span>
                  {d.reponse}
                </p>
              )}
            </article>
          ))}
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Nouvelle demande</CardTitle>
          </CardHeader>
          <CardContent>
            <DemandeForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
