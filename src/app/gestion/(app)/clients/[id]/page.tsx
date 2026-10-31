import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FileDown } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { syntheseClient } from "@/lib/donnees"
import { PageHeader } from "@/components/layout/app-shell"
import { JournalDemarches } from "@/components/demarches/journal-demarches"
import { ListeDemarches } from "@/components/demarches/liste-demarches"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ETAPES, STATUT_DEMANDE, STATUT_DOSSIER, TYPE_SERVICE } from "@/lib/constants"
import { formatDate, formatFCFA } from "@/lib/format"

export const metadata: Metadata = { title: "Fiche client" }

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, nom: true, prenom: true } },
      dossiers: { orderBy: { updatedAt: "desc" } },
      demandes: { orderBy: { createdAt: "desc" }, take: 10 },
      demarches: { orderBy: { dateDemarche: "desc" }, take: 20 },
      journalDemarches: { orderBy: { createdAt: "desc" }, take: 30 },
    },
  })
  if (!client) notFound()
  const { resultat, nbEcritures } = await syntheseClient(id)

  const infos = [
    ["Forme juridique", client.formeJuridique],
    ["Secteur", client.secteurActivite],
    ["Chiffre d'affaires déclaré", client.chiffreAffaires != null ? formatFCFA(client.chiffreAffaires) : null],
    ["IFU", client.ifu],
    ["Dirigeant", `${client.user.prenom} ${client.user.nom}`],
    ["Email", client.user.email],
    ["Téléphone", client.telephone],
    ["Adresse", client.adresse],
  ]

  return (
    <>
      <PageHeader titre={client.raisonSociale} description={`Client depuis le ${formatDate(client.createdAt)}`}>
        <Link href={`/gestion/creation-entreprise/nouveau?clientId=${id}`} className={buttonVariants({ variant: "outline" })}>
          Nouveau dossier de création
        </Link>
        <Link href={`/gestion/comptabilite?clientId=${id}`} className={buttonVariants({ variant: "outline" })}>
          Comptabilité
        </Link>
        <a href={`/api/rapports/pdf?clientId=${id}`} target="_blank" className={buttonVariants()}>
          <FileDown aria-hidden /> Rapport PDF
        </a>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {infos.map(([label, valeur]) => (
                <div key={label}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium">{valeur || "—"}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résultat comptable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {nbEcritures === 0 ? (
              <p className="text-muted-foreground">
                Aucune écriture importée.{" "}
                <Link href={`/gestion/comptabilite?clientId=${id}`} className="font-medium text-primary hover:underline">
                  Importer un fichier CSV
                </Link>
              </p>
            ) : (
              <>
                <p className="flex justify-between"><span>Produits</span><span className="tabular-nums">{formatFCFA(resultat.produits)}</span></p>
                <p className="flex justify-between"><span>Charges</span><span className="tabular-nums">{formatFCFA(resultat.charges)}</span></p>
                <p className="flex justify-between border-t pt-2 font-semibold">
                  <span>{resultat.resultat >= 0 ? "Bénéfice" : "Perte"}</span>
                  <span className={`tabular-nums ${resultat.resultat < 0 ? "text-destructive" : ""}`}>{formatFCFA(resultat.resultat)}</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dossiers de création d&apos;entreprise</CardTitle>
          </CardHeader>
          <CardContent>
            {client.dossiers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun dossier.</p>
            ) : (
              <ul className="divide-y">
                {client.dossiers.map((d) => (
                  <li key={d.id}>
                    <Link href={`/gestion/creation-entreprise/${d.id}`} className="flex items-center justify-between gap-2 py-2.5 hover:text-primary">
                      <span className="font-medium">{d.denomination}</span>
                      <span className="flex gap-1.5">
                        <Badge variant="outline">{ETAPES.find((e) => e.key === d.etape)?.label}</Badge>
                        <Badge variant="secondary">{STATUT_DOSSIER[d.statut]}</Badge>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières demandes</CardTitle>
          </CardHeader>
          <CardContent>
            {client.demandes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune demande.</p>
            ) : (
              <ul className="divide-y text-sm">
                {client.demandes.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 py-2">
                    <span>{TYPE_SERVICE[d.type]}</span>
                    <Badge variant="secondary">{STATUT_DEMANDE[d.statut]}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Démarches (e-MECeF, impôts, Perfecto, MonEntreprise.bj)</CardTitle>
        </CardHeader>
        <CardContent>
          <ListeDemarches demarches={client.demarches.map((d) => ({ ...d, montant: d.montant != null ? Number(d.montant) : null }))} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Historique des démarches</CardTitle>
        </CardHeader>
        <CardContent>
          <JournalDemarches evenements={client.journalDemarches.map((j) => ({ id: j.id, action: j.action, acteur: j.acteur, detail: j.detail, createdAt: j.createdAt }))} />
        </CardContent>
      </Card>
    </>
  )
}
