import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { versVue } from "@/lib/dossier-vue"
import { PageHeader } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { DossierStepper } from "@/components/dossiers/dossier-stepper"
import { STATUT_DOSSIER } from "@/lib/constants"

export const metadata: Metadata = { title: "Dossier de création" }

export default async function DossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dossier = await prisma.dossier.findUnique({
    where: { id },
    include: { pieces: { orderBy: { createdAt: "asc" } }, client: { select: { id: true, raisonSociale: true } } },
  })
  if (!dossier) notFound()

  return (
    <>
      <PageHeader titre={dossier.denomination}>
        <Badge variant="secondary">{STATUT_DOSSIER[dossier.statut]}</Badge>
      </PageHeader>
      <p className="-mt-4 mb-6 text-sm text-muted-foreground">
        Porteur de projet :{" "}
        <Link href={`/gestion/clients/${dossier.client.id}`} className="text-primary hover:underline">
          {dossier.client.raisonSociale}
        </Link>
      </p>
      <DossierStepper dossier={versVue(dossier)} />
    </>
  )
}
