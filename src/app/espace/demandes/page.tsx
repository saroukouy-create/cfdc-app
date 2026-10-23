import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { clientCourant } from "@/lib/client-courant"
import { PageHeader } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DemandeForm } from "@/components/services/demande-form"
import { DevisForm } from "@/components/services/devis-form"
import { STATUT_CONTACT, STATUT_DEMANDE, TYPE_CONTACT, TYPE_SERVICE } from "@/lib/constants"
import { FORMATIONS, SERVICES } from "@/lib/site-content"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = { title: "Mes demandes" }

type Ligne = { id: string; titre: string; detail: string | null; statut: string; libelleStatut: string; reponse: string | null; date: Date }

export default async function MesDemandesPage({ searchParams }: { searchParams: Promise<{ type?: string; sujet?: string }> }) {
  const client = await clientCourant()
  const { type, sujet } = await searchParams
  const [attestations, devis] = await Promise.all([
    prisma.demandeService.findMany({ where: { clientId: client.id } }),
    prisma.demandeContact.findMany({ where: { clientId: client.id } }),
  ])

  // Attestations et devis/formations dans une seule liste, la plus recente en haut
  const lignes: Ligne[] = [
    ...attestations.map((d) => ({ id: d.id, titre: TYPE_SERVICE[d.type], detail: d.description, statut: d.statut, libelleStatut: STATUT_DEMANDE[d.statut], reponse: d.reponse, date: d.createdAt })),
    ...devis.map((d) => ({ id: d.id, titre: `${TYPE_CONTACT[d.type]}${d.sujet ? ` · ${d.sujet}` : ""}`, detail: d.message, statut: d.statut, libelleStatut: STATUT_CONTACT[d.statut], reponse: null, date: d.createdAt })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <>
      <PageHeader titre="Mes demandes" description="Devis, formations, attestations et documents administratifs" />
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="grid h-fit min-w-0 gap-3">
          {lignes.length === 0 && <p className="text-muted-foreground">Aucune demande pour l&apos;instant.</p>}
          {lignes.map((d) => (
            <article key={d.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-medium">{d.titre}</h2>
                  <p className="text-xs text-muted-foreground">Envoyée le {formatDate(d.date)}</p>
                </div>
                <Badge variant={["PRETE", "CONVERTI"].includes(d.statut) ? "default" : d.statut === "REJETEE" ? "destructive" : "secondary"}>
                  {d.libelleStatut}
                </Badge>
              </div>
              {d.detail && <p className="mt-2 text-sm break-words">{d.detail}</p>}
              {d.reponse && (
                <p className="mt-3 rounded-lg bg-muted p-3 text-sm">
                  <span className="font-medium">Réponse CFDC : </span>
                  {d.reponse}
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="grid h-fit gap-6">
          <Card id="devis">
            <CardHeader>
              <CardTitle>Devis ou formation</CardTitle>
            </CardHeader>
            <CardContent>
              <DevisForm
                services={SERVICES.map((s) => s.titre)}
                formations={FORMATIONS.map((f) => f.titre)}
                type={type === "FORMATION" ? "FORMATION" : "DEVIS"}
                sujet={sujet}
              />
            </CardContent>
          </Card>
          <Card id="attestation">
            <CardHeader>
              <CardTitle>Attestation ou document</CardTitle>
            </CardHeader>
            <CardContent>
              <DemandeForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
