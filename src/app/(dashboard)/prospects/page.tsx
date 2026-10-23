import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProspectStatut } from "@/components/prospects/prospect-statut"
import { STATUT_CONTACT, TYPE_CONTACT } from "@/lib/constants"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Demandes de devis" }

const FILTRES = [
  { key: "ouvertes", label: "À traiter", statuts: ["NOUVEAU", "CONTACTE"] },
  { key: "toutes", label: "Toutes", statuts: undefined },
] as const

export default async function ProspectsPage({ searchParams }: { searchParams: Promise<{ filtre?: string }> }) {
  const { filtre: f } = await searchParams
  const filtre = FILTRES.find((x) => x.key === f) ?? FILTRES[0]
  const demandes = await prisma.demandeContact.findMany({
    where: filtre.statuts ? { statut: { in: [...filtre.statuts] } } : undefined,
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <PageHeader titre="Demandes de devis" description="Devis, inscriptions aux formations et messages envoyés depuis le site" />
      <nav className="mb-3 flex gap-1" aria-label="Filtrer les demandes">
        {FILTRES.map((x) => (
          <Link
            key={x.key}
            href={`/prospects?filtre=${x.key}`}
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
              <TableHead>Demandeur</TableHead>
              <TableHead>Demande</TableHead>
              <TableHead className="hidden lg:table-cell">Message</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demandes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Aucune demande.
                </TableCell>
              </TableRow>
            )}
            {demandes.map((d) => (
              <TableRow key={d.id} className="align-top">
                <TableCell>
                  <span className="block font-medium">{d.nom}</span>
                  {d.entreprise && <span className="block text-xs text-muted-foreground">{d.entreprise}</span>}
                  <a href={`mailto:${d.email}`} className="block text-xs text-primary hover:underline">
                    {d.email}
                  </a>
                  {d.telephone && (
                    <a href={`tel:${d.telephone}`} className="block text-xs text-primary hover:underline">
                      {d.telephone}
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <span className="block">{TYPE_CONTACT[d.type]}</span>
                  <span className="block text-xs text-muted-foreground">
                    {d.sujet ?? "—"} · {formatDate(d.createdAt)}
                  </span>
                </TableCell>
                <TableCell className="hidden max-w-xs whitespace-normal text-sm text-muted-foreground lg:table-cell">
                  {d.message ?? "—"}
                  {d.note && <span className="mt-1 block text-xs text-foreground">Note : {d.note}</span>}
                </TableCell>
                <TableCell>
                  <Badge variant={d.statut === "NOUVEAU" ? "default" : "secondary"}>{STATUT_CONTACT[d.statut]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ProspectStatut prospect={{ id: d.id, statut: d.statut, note: d.note, titre: `${TYPE_CONTACT[d.type]} · ${d.nom}` }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
