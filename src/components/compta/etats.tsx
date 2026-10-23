import { Check, Circle } from "lucide-react"
import type { Synthese } from "@/lib/donnees"
import { formatFCFA } from "@/lib/format"
import { cn } from "@/lib/utils"

// Composants serveur d'affichage des etats comptables, partages par le cabinet et l'espace client

export function CycleComptable({ cycle }: { cycle: Synthese["cycle"] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-5">
      {cycle.map((e, i) => (
        <li key={e.etape} className={cn("rounded-lg border p-3", e.fait && "border-primary/40 bg-primary/5")}>
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {e.fait ? <Check className="size-3.5 text-primary" aria-label="fait" /> : <Circle className="size-3.5" aria-label="à faire" />}
            Étape {i + 1}
          </p>
          <p className="mt-1 text-sm font-semibold">{e.etape}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{e.detail}</p>
        </li>
      ))}
    </ol>
  )
}

function Ligne({ label, valeur, total }: { label: string; valeur: number; total?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4 py-1.5 text-sm", total ? "border-t font-semibold" : "")}>
      <span>{label}</span>
      <span className={cn("tabular-nums", valeur < 0 && "text-destructive")}>{formatFCFA(valeur)}</span>
    </div>
  )
}

export function CompteResultat({ resultat }: { resultat: Synthese["resultat"] }) {
  return (
    <div>
      <Ligne label="Produits (classes 7 et HAO)" valeur={resultat.produits} />
      <Ligne label="Charges (classes 6 et HAO)" valeur={resultat.charges} />
      <Ligne label={resultat.resultat >= 0 ? "Bénéfice" : "Perte"} valeur={resultat.resultat} total />
    </div>
  )
}

export function Bilan({ bilan }: { bilan: Synthese["bilan"] }) {
  const { actif, passif } = bilan
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-1 text-sm font-semibold text-muted-foreground">Actif</h3>
        <Ligne label="Immobilisations nettes" valeur={actif.immobilisations} />
        <Ligne label="Stocks" valeur={actif.stocks} />
        <Ligne label="Créances" valeur={actif.creances} />
        <Ligne label="Trésorerie" valeur={actif.tresorerie} />
        <Ligne label="Total actif" valeur={bilan.totalActif} total />
      </div>
      <div>
        <h3 className="mb-1 text-sm font-semibold text-muted-foreground">Passif</h3>
        <Ligne label="Capitaux propres" valeur={passif.capitauxPropres} />
        <Ligne label="Résultat de l'exercice" valeur={passif.resultat} />
        <Ligne label="Dettes financières" valeur={passif.dettesFinancieres} />
        <Ligne label="Dettes" valeur={passif.dettes} />
        <Ligne label="Trésorerie passif" valeur={passif.tresoreriePassif} />
        <Ligne label="Total passif" valeur={bilan.totalPassif} total />
      </div>
      {Math.abs(bilan.totalActif - bilan.totalPassif) >= 1 && (
        <p role="alert" className="text-sm text-destructive md:col-span-2">
          Bilan déséquilibré : vérifiez que chaque pièce est saisie en partie double (total débit = total crédit).
        </p>
      )}
    </div>
  )
}
