import { FilePlus2, RefreshCw, Trash2 } from "lucide-react"
import { formatDateHeure } from "@/lib/format"

export type EvenementDemarche = {
  id: string
  action: string
  acteur: string
  client?: string
  detail: string
  createdAt: Date
}

const ICONE = {
  CREATION: <FilePlus2 className="size-4" aria-hidden />,
  STATUT: <RefreshCw className="size-4" aria-hidden />,
  SUPPRESSION: <Trash2 className="size-4" aria-hidden />,
} as const
const LIBELLE = { CREATION: "Enregistrement", STATUT: "Changement de statut", SUPPRESSION: "Suppression" } as const

/** Historique horodate des operations sur les demarches : qui, quand, quoi (traçabilite). */
export function JournalDemarches({ evenements, vide = "Aucune opération enregistrée." }: { evenements: EvenementDemarche[]; vide?: string }) {
  if (evenements.length === 0) return <p className="text-sm text-muted-foreground">{vide}</p>
  return (
    <ol className="grid gap-0 border-l pl-4">
      {evenements.map((e) => {
        const action = e.action as keyof typeof LIBELLE
        return (
          <li key={e.id} className="relative pb-4 last:pb-0">
            <span className="absolute -left-[1.45rem] flex size-6 items-center justify-center rounded-full border bg-card text-muted-foreground">{ICONE[action]}</span>
            <p className="text-sm">
              <span className="font-medium">{LIBELLE[action]}</span>
              {e.client && <span className="text-muted-foreground"> · {e.client}</span>}
            </p>
            <p className="text-sm text-muted-foreground">{e.detail}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <time dateTime={e.createdAt.toISOString()}>{formatDateHeure(e.createdAt)}</time> · par {e.acteur}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
