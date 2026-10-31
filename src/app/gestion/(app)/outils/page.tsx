import type { Metadata } from "next"
import { Building2, Calculator, ExternalLink, FileText, Landmark } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/layout/app-shell"
import { RegistreDemarches } from "@/components/demarches/registre-demarches"
import { formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = { title: "Outils fiscaux et comptables" }
export const dynamic = "force-dynamic"

const OUTILS = [
  {
    titre: "e-MECeF : factures normalisées",
    texte: "Plateforme de la Direction générale des impôts pour émettre et gérer les factures normalisées des entreprises.",
    lien: "https://e-mecef.impots.bj/",
    bouton: "Ouvrir e-MECeF",
    icone: FileText,
  },
  {
    titre: "e-Services des impôts : déclarations et paiement",
    texte: "Espace de la Direction générale des impôts pour la gestion de l'impôt : déclarations, suivi du compte et paiement en ligne des entreprises.",
    lien: "https://e-services.impots.bj/login-facile",
    bouton: "Ouvrir e-Services",
    icone: Landmark,
  },
  {
    titre: "Perfecto : logiciel comptable",
    texte: "Logiciel de comptabilité, paie et stocks conforme au SYSCOHADA révisé, édité par Perfecto SARL au Bénin.",
    lien: "https://perfecto-africa.com/",
    bouton: "Ouvrir Perfecto",
    icone: Calculator,
  },
  {
    titre: "MonEntreprise.bj : création d'entreprise",
    texte: "Guichet électronique de l'APIEx pour créer et gérer une entreprise au Bénin : établissement individuel ou société (SARL, SA, SAS...).",
    lien: "https://monentreprise.bj/",
    bouton: "Ouvrir MonEntreprise.bj",
    icone: Building2,
  },
]

export default async function OutilsPage() {
  const [clients, demarches] = await Promise.all([
    prisma.client.findMany({ select: { id: true, raisonSociale: true }, orderBy: { raisonSociale: "asc" } }),
    prisma.demarche.findMany({ include: { client: { select: { raisonSociale: true } } }, orderBy: [{ dateDemarche: "desc" }, { createdAt: "desc" }], take: 30 }),
  ])
  return (
    <>
      <PageHeader titre="Outils fiscaux et comptables" description="Accès rapide aux plateformes utilisées pour la facturation, les impôts et la comptabilité des entreprises" />
      <div className="portail-cascade grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {OUTILS.map(({ titre, texte, lien, bouton, icone: Icone }) => (
          <Card key={lien} className="flex flex-col">
            <CardHeader>
              <Icone className="size-7 text-primary" aria-hidden />
              <CardTitle className="mt-2">{titre}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="flex-1 text-sm text-muted-foreground">{texte}</p>
              <a href={lien} target="_blank" rel="noopener noreferrer" className={buttonVariants({ className: "mt-5 w-full" })}>
                <ExternalLink aria-hidden /> {bouton}
                <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Démarches des clients</CardTitle>
          <p className="text-sm text-muted-foreground">
            Après une opération sur l&apos;une de ces plateformes, enregistrez-la ici : elle apparaît dans le compte du client (rubrique « Mes démarches ») et sur sa fiche.
          </p>
        </CardHeader>
        <CardContent>
          <RegistreDemarches
            clients={clients}
            lignes={demarches.map((d) => ({
              id: d.id,
              client: d.client.raisonSociale,
              plateforme: d.plateforme,
              objet: d.objet,
              reference: d.reference,
              montant: d.montant != null ? Number(d.montant) : null,
              statut: d.statut,
              date: formatDate(d.dateDemarche),
            }))}
          />
        </CardContent>
      </Card>
    </>
  )
}
