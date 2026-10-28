import { AlertTriangle } from "lucide-react"
import type { EtatsFinanciers } from "@/lib/etats-financiers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

// Etats financiers SYSCOHADA revise (Systeme normal), partages par le cabinet et l'espace client.

const nombre = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
const m = (v: number) => (Math.round(v) === 0 ? "-" : nombre.format(Math.round(v)))

const num = "text-right tabular-nums"
const ligneClasse = (total: boolean) => cn(total && "bg-muted/50 font-semibold")

function Etat({ titre, entite, ifu, exercice, children }: { titre: string; entite: string; ifu: string | null; exercice: number; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titre}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {entite}
          {ifu ? ` - IFU ${ifu}` : ""} · Exercice clos le 31/12/{exercice} (12 mois) · Montants en francs CFA
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">{children}</CardContent>
    </Card>
  )
}

const Ref = ({ ref_ }: { ref_: string }) => <TableCell className="w-12 font-mono text-xs text-muted-foreground">{ref_}</TableCell>

export function EtatsSyscohada({ etats, entite, ifu }: { etats: EtatsFinanciers; entite: string; ifu: string | null }) {
  const { exercice, controles } = etats
  const prec = exercice - 1
  return (
    <div className="grid gap-6 [&>*]:min-w-0">
      <p className="text-sm text-muted-foreground">
        États établis selon le SYSCOHADA révisé (Acte uniforme OHADA relatif au droit comptable et à l&apos;information financière,
        applicable au Bénin), système normal. Les écritures du journal « AN » (à-nouveaux) sont rattachées à l&apos;ouverture de l&apos;exercice.
      </p>

      {(!controles.bilanEquilibre || !controles.fluxRapproches || controles.nonClasses.length > 0) && (
        <div role="alert" className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <ul className="grid gap-1">
            {!controles.bilanEquilibre && <li>Bilan déséquilibré : vérifiez que chaque pièce est saisie en partie double.</li>}
            {!controles.fluxRapproches && (
              <li>Le tableau des flux ne se rapproche pas de la trésorerie : vérifiez les écritures d&apos;immobilisations, de capital et de financement.</li>
            )}
            {controles.nonClasses.length > 0 && (
              <li>Comptes non reconnus par le plan SYSCOHADA, absents des états : {controles.nonClasses.join(", ")}.</li>
            )}
          </ul>
        </div>
      )}

      <Etat titre="Bilan - Actif" entite={entite} ifu={ifu} exercice={exercice}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Réf.</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead className="text-right">Brut</TableHead>
              <TableHead className="text-right">Amort. et dépréc.</TableHead>
              <TableHead className="text-right">Net {exercice}</TableHead>
              <TableHead className="text-right">Net {prec}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {etats.actif.map((l) => (
              <TableRow key={l.ref} className={ligneClasse(l.total)}>
                <Ref ref_={l.ref} />
                <TableCell>{l.libelle}</TableCell>
                <TableCell className={num}>{m(l.brut)}</TableCell>
                <TableCell className={num}>{m(l.amort)}</TableCell>
                <TableCell className={num}>{m(l.net)}</TableCell>
                <TableCell className={num}>{m(l.netPrec)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Etat>

      <Etat titre="Bilan - Passif" entite={entite} ifu={ifu} exercice={exercice}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Réf.</TableHead>
              <TableHead>Passif</TableHead>
              <TableHead className="text-right">Exercice {exercice}</TableHead>
              <TableHead className="text-right">Exercice {prec}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {etats.passif.map((l) => (
              <TableRow key={l.ref} className={ligneClasse(l.total)}>
                <Ref ref_={l.ref} />
                <TableCell>{l.libelle}</TableCell>
                <TableCell className={num}>{m(l.n)}</TableCell>
                <TableCell className={num}>{m(l.nPrec)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Etat>

      <Etat titre="Compte de résultat" entite={entite} ifu={ifu} exercice={exercice}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Réf.</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead className="text-right">Exercice {exercice}</TableHead>
              <TableHead className="text-right">Exercice {prec}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {etats.resultat.map((l) => (
              <TableRow key={l.ref} className={ligneClasse(l.total)}>
                <Ref ref_={l.ref} />
                <TableCell>{l.libelle}</TableCell>
                <TableCell className={num}>{m(l.n)}</TableCell>
                <TableCell className={num}>{m(l.nPrec)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-2 text-xs text-muted-foreground">Les charges sont présentées en négatif.</p>
      </Etat>

      <Etat titre="Tableau des flux de trésorerie (méthode indirecte)" entite={entite} ifu={ifu} exercice={exercice}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Réf.</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead className="text-right">Exercice {exercice}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {etats.flux.map((l) => (
              <TableRow key={l.ref} className={ligneClasse(l.total)}>
                <Ref ref_={l.ref} />
                <TableCell>{l.libelle}</TableCell>
                <TableCell className={num}>{m(l.valeur)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Etat>

      <Etat titre="État des variations des capitaux propres" entite={entite} ifu={ifu} exercice={exercice}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Libellé</TableHead>
              {etats.variations.colonnes.map((c) => (
                <TableHead key={c} className="text-right">
                  {c}
                </TableHead>
              ))}
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {etats.variations.lignes.map((l) => (
              <TableRow key={l.libelle} className={ligneClasse(l.total)}>
                <TableCell>{l.libelle}</TableCell>
                {l.valeurs.map((v, i) => (
                  <TableCell key={i} className={num}>
                    {m(v)}
                  </TableCell>
                ))}
                <TableCell className={cn(num, "font-semibold")}>{m(l.ensemble)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Etat>
    </div>
  )
}
