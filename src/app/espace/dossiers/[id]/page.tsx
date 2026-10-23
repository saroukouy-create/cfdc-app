import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { clientCourant } from "@/lib/client-courant"
import { versVue } from "@/lib/dossier-vue"
import { PageHeader } from "@/components/layout/app-shell"
import { DossierStepper } from "@/components/dossiers/dossier-stepper"

export const metadata: Metadata = { title: "Mon dossier" }

export default async function MonDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const client = await clientCourant()
  const { id } = await params
  // Filtre par clientId : un client ne peut pas ouvrir le dossier d'un autre en changeant l'URL
  const dossier = await prisma.dossier.findFirst({
    where: { id, clientId: client.id },
    include: { pieces: { orderBy: { createdAt: "asc" } } },
  })
  if (!dossier) notFound()

  return (
    <>
      <PageHeader titre={dossier.denomination} description="Cliquez sur une étape pour la consulter. Vos pièces se déposent à l'étape « Pièces »." />
      <DossierStepper dossier={versVue(dossier)} lectureSeule />
    </>
  )
}
