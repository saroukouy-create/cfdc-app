import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PLATEFORME_DEMARCHE, STATUT_DEMARCHE } from "@/lib/constants"
import { formatDate, formatFCFA } from "@/lib/format"

export type DemarcheLigne = {
  id: string
  plateforme: string
  objet: string
  reference: string | null
  montant: number | null
  statut: string
  dateDemarche: Date
  note: string | null
}

/** Liste en lecture seule des demarches d'un client (fiche client de la gestion, espace client). */
export function ListeDemarches({ demarches }: { demarches: DemarcheLigne[] }) {
  if (demarches.length === 0) return <p className="text-sm text-muted-foreground">Aucune démarche enregistrée.</p>
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Plateforme</TableHead>
          <TableHead>Objet</TableHead>
          <TableHead>Référence</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {demarches.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="whitespace-nowrap">{formatDate(d.dateDemarche)}</TableCell>
            <TableCell>{PLATEFORME_DEMARCHE[d.plateforme]}</TableCell>
            <TableCell>
              {d.objet}
              {d.note && <span className="block text-xs text-muted-foreground">{d.note}</span>}
            </TableCell>
            <TableCell className="font-mono text-xs">{d.reference ?? "—"}</TableCell>
            <TableCell className="text-right tabular-nums">{d.montant != null ? formatFCFA(d.montant) : "—"}</TableCell>
            <TableCell>
              <Badge variant={d.statut === "TERMINEE" ? "default" : "secondary"}>{STATUT_DEMARCHE[d.statut]}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
