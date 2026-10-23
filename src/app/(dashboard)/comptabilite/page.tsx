import type { Metadata } from "next"
import { FileDown } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { lignesClient } from "@/lib/donnees"
import { balance, bilan, compteResultat, cycle, seriesMensuelles } from "@/lib/compta"
import { formatFCFA } from "@/lib/format"
import { PageHeader } from "@/components/layout/app-shell"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NativeSelect } from "@/components/ui/native-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GraphiqueResultat, GraphiqueTresorerie } from "@/components/compta/graphiques"
import { ImportCsv } from "@/components/compta/import-csv"
import { Bilan, CompteResultat, CycleComptable } from "@/components/compta/etats"

export const metadata: Metadata = { title: "Comptabilité" }

export default async function ComptabilitePage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const clients = await prisma.client.findMany({ select: { id: true, raisonSociale: true }, orderBy: { raisonSociale: "asc" } })
  const { clientId: demande } = await searchParams
  const client = clients.find((c) => c.id === demande) ?? clients[0]

  if (!client)
    return (
      <>
        <PageHeader titre="Comptabilité" />
        <p className="text-muted-foreground">Aucun client : créez d&apos;abord une fiche client.</p>
      </>
    )

  const lignes = await lignesClient(client.id)
  const series = seriesMensuelles(lignes)
  const bal = balance(lignes)

  return (
    <>
      <PageHeader titre="Comptabilité" description="Suivi comptable et financier, du journal aux états financiers">
        <a href={`/api/rapports/pdf?clientId=${client.id}`} target="_blank" className={buttonVariants({ variant: "outline" })}>
          <FileDown aria-hidden /> Rapport PDF
        </a>
      </PageHeader>

      <form className="mb-6 flex max-w-md items-end gap-2">
        <label className="grid flex-1 gap-1.5 text-sm font-medium">
          Client
          <NativeSelect name="clientId" defaultValue={client.id}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.raisonSociale}
              </option>
            ))}
          </NativeSelect>
        </label>
        <button type="submit" className={buttonVariants({ variant: "outline" })}>
          Afficher
        </button>
      </form>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cycle comptable</CardTitle>
          </CardHeader>
          <CardContent>
            <CycleComptable cycle={cycle(lignes)} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Importer des écritures</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportCsv clientId={client.id} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Compte de résultat</CardTitle>
            </CardHeader>
            <CardContent>
              <CompteResultat resultat={compteResultat(lignes)} />
            </CardContent>
          </Card>
        </div>

        {lignes.length > 0 && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Trésorerie (cumul classe 5)</CardTitle>
                </CardHeader>
                <CardContent>
                  <GraphiqueTresorerie data={series} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Produits et charges par mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <GraphiqueResultat data={series} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bilan simplifié</CardTitle>
              </CardHeader>
              <CardContent>
                <Bilan bilan={bilan(lignes)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Balance générale</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Compte</TableHead>
                      <TableHead className="text-right">Débit</TableHead>
                      <TableHead className="text-right">Crédit</TableHead>
                      <TableHead className="text-right">Solde</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bal.map((b) => (
                      <TableRow key={b.compte}>
                        <TableCell className="font-mono">{b.compte}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatFCFA(b.debit)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatFCFA(b.credit)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatFCFA(b.solde)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
