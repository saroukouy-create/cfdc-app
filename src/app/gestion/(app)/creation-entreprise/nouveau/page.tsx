import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/layout/app-shell"
import { buttonVariants } from "@/components/ui/button"
import { DossierForm } from "@/components/dossiers/dossier-form"

export const metadata: Metadata = { title: "Nouveau dossier de création" }

export default async function NouveauDossierPage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const { clientId } = await searchParams
  const clients = await prisma.client.findMany({ select: { id: true, raisonSociale: true }, orderBy: { raisonSociale: "asc" } })

  return (
    <>
      <PageHeader titre="Nouveau dossier de création" description="Étape 1 : informations sur la future entreprise" />
      {clients.length === 0 ? (
        <p className="text-muted-foreground">
          Créez d&apos;abord la fiche du porteur de projet.{" "}
          <Link href="/gestion/clients/nouveau" className={buttonVariants({ variant: "link" })}>
            Nouveau client
          </Link>
        </p>
      ) : (
        <DossierForm clients={clients} clientId={clientId} />
      )}
    </>
  )
}
