import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DemandeForm } from "@/components/services/demande-form"
import { DemandeStatut } from "@/components/services/demande-statut"
import { STATUT_DEMANDE, TYPE_SERVICE } from "@/lib/constants"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Attestations & services" }

const FILTRES = [
  { key: "ouvertes", label: "À traiter", statuts: ["NOUVELLE", "EN_COURS", "PRETE"] },
  { key: "toutes", label: "Toutes", statuts: undefined },
] as const

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ filtre?: string }> }) {
  const { filtre: f } = await searchParams
  const filtre = FILTRES.find((x) => x.key === f) ?? FILTRES[0]
  const [demandes, clients] = await Promise.all([
    prisma.demandeService.findMany({
      where: filtre.statuts ? { statut: { in: [...filtre.statuts] } } : undefined,
      include: { client: { select: { id: true, raisonSociale: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.client.findMany({ select: { id: true, raisonSociale: true }, orderBy: { raisonSociale: "asc" } }),
  ])

  return (
    <>
      <PageHeader
        titre="Attestations & services"
        description="Attestations fiscales et CNSS, non faillite, quitus, domiciliation, inventaires, paie, formations"
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <nav className="mb-3 flex gap-1" aria-label="Filtrer les demandes">
            {FILTRES.map((x) => (
              <Link
                key={x.key}
                href={`/gestion/attestations?filtre=${x.key}`}
                aria-current={x.key === filtre.key ? "page" : undefined}
                className={cn("rounded-lg px-3 py-1.5 text-sm", x.key === filtre.key ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
              >
                {x.label}
              </Link>
            ))}
          </nav>
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Demande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demandes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      Aucune demande.
                    </TableCell>
                  </TableRow>
                )}
                {demandes.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <span className="block font-medium">{TYPE_SERVICE[d.type]}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatDate(d.createdAt)}
                        {d.description ? ` · ${d.description}` : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/gestion/clients/${d.client.id}`} className="hover:text-primary hover:underline">
                        {d.client.raisonSociale}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={d.statut === "NOUVELLE" ? "default" : "secondary"}>{STATUT_DEMANDE[d.statut]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DemandeStatut demande={{ id: d.id, statut: d.statut, reponse: d.reponse, titre: `${TYPE_SERVICE[d.type]} · ${d.client.raisonSociale}` }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Enregistrer une demande</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length ? <DemandeForm clients={clients} /> : <p className="text-sm text-muted-foreground">Aucun client.</p>}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
