import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ETAPES, STATUT_DEMANDE, TYPE_SERVICE } from "@/lib/constants"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = { title: "Tableau de bord" }

export default async function DashboardPage() {
  const [nbClients, dossiersEnCours, demandesOuvertes, dossiers, demandes, prospects] = await Promise.all([
    prisma.client.count(),
    prisma.dossier.count({ where: { statut: { in: ["EN_COURS", "DEPOSE"] } } }),
    prisma.demandeService.count({ where: { statut: { in: ["NOUVELLE", "EN_COURS"] } } }),
    prisma.dossier.findMany({
      where: { statut: { in: ["EN_COURS", "DEPOSE"] } },
      include: { client: { select: { raisonSociale: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.demandeService.findMany({
      where: { statut: { in: ["NOUVELLE", "EN_COURS"] } },
      include: { client: { select: { raisonSociale: true } } },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
    prisma.demandeContact.count({ where: { statut: "NOUVEAU" } }),
  ])

  const kpis = [
    { label: "Clients", valeur: nbClients, href: "/gestion/clients" },
    { label: "Créations d'entreprise en cours", valeur: dossiersEnCours, href: "/gestion/creation-entreprise" },
    { label: "Attestations à traiter", valeur: demandesOuvertes, href: "/gestion/attestations" },
    { label: "Nouvelles demandes de devis", valeur: prospects, href: "/gestion/prospects" },
  ]

  return (
    <>
      <PageHeader titre="Tableau de bord" description="Vue d'ensemble de l'activité du cabinet" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="rounded-xl border bg-card p-5 transition-colors hover:border-primary">
            <p className="text-sm text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{k.valeur}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Créations d&apos;entreprise actives</CardTitle>
          </CardHeader>
          <CardContent>
            {dossiers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun dossier en cours.</p>
            ) : (
              <ul className="divide-y">
                {dossiers.map((d) => (
                  <li key={d.id}>
                    <Link href={`/gestion/creation-entreprise/${d.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-primary">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{d.denomination}</span>
                        <span className="block truncate text-xs text-muted-foreground">{d.client.raisonSociale}</span>
                      </span>
                      <Badge variant="secondary">{ETAPES.find((e) => e.key === d.etape)?.label}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demandes les plus anciennes</CardTitle>
          </CardHeader>
          <CardContent>
            {demandes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
            ) : (
              <ul className="divide-y">
                {demandes.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{TYPE_SERVICE[d.type]}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {d.client.raisonSociale} · {formatDate(d.createdAt)}
                      </span>
                    </span>
                    <Badge variant={d.statut === "NOUVELLE" ? "default" : "secondary"}>{STATUT_DEMANDE[d.statut]}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
