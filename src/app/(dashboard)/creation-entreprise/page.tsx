import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ETAPES, STATUT_DOSSIER } from "@/lib/constants"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = { title: "Création d'entreprise" }

export default async function CreationEntreprisePage() {
  const dossiers = await prisma.dossier.findMany({
    include: { client: { select: { raisonSociale: true } }, _count: { select: { pieces: true } } },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <>
      <PageHeader titre="Création d'entreprise" description="Accompagnement du choix de la forme juridique jusqu'à l'immatriculation">
        <Link href="/creation-entreprise/nouveau" className={buttonVariants()}>
          Nouveau dossier
        </Link>
      </PageHeader>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dénomination</TableHead>
              <TableHead className="hidden md:table-cell">Client</TableHead>
              <TableHead>Étape</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">Pièces</TableHead>
              <TableHead className="hidden md:table-cell">Mis à jour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dossiers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Aucun dossier de création.
                </TableCell>
              </TableRow>
            )}
            {dossiers.map((d) => {
              const n = ETAPES.findIndex((e) => e.key === d.etape) + 1
              return (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">
                    <Link href={`/creation-entreprise/${d.id}`} className="hover:text-primary hover:underline">
                      {d.denomination}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{d.client.raisonSociale}</TableCell>
                  <TableCell>
                    {n}/5 · {ETAPES[n - 1].label}
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.statut === "TERMINE" ? "default" : "secondary"}>{STATUT_DOSSIER[d.statut]}</Badge>
                  </TableCell>
                  <TableCell className="hidden tabular-nums md:table-cell">{d._count.pieces}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(d.updatedAt)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
