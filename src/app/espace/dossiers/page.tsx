import type { Metadata } from "next"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { clientCourant } from "@/lib/client-courant"
import { PageHeader } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { ETAPES, STATUT_DOSSIER } from "@/lib/constants"

export const metadata: Metadata = { title: "Mes dossiers" }

export default async function MesDossiersPage() {
  const client = await clientCourant()
  const dossiers = await prisma.dossier.findMany({ where: { clientId: client.id }, orderBy: { updatedAt: "desc" } })

  return (
    <>
      <PageHeader titre="Mes dossiers de création" description="Suivez chaque étape et déposez vos pièces justificatives" />
      {dossiers.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">Aucun dossier pour l&apos;instant</p>
          <p className="mt-1 text-sm text-muted-foreground">Vous créez votre entreprise ? Demandez un devis : votre conseiller ouvrira le dossier avec vous.</p>
          <Link href="/espace/demandes?type=DEVIS&sujet=Cr%C3%A9ation%20d%27entreprise#devis" className={buttonVariants({ className: "mt-4" })}>
            Demander un devis de création
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3">
          {dossiers.map((d) => {
            const n = ETAPES.findIndex((e) => e.key === d.etape) + 1
            return (
              <li key={d.id}>
                <Link href={`/espace/dossiers/${d.id}`} className="flex items-center justify-between gap-4 rounded-xl border p-4 hover:border-primary">
                  <span>
                    <span className="block font-medium">{d.denomination}</span>
                    <span className="block text-sm text-muted-foreground">
                      Étape {n}/5 · {ETAPES[n - 1].label}
                    </span>
                  </span>
                  <Badge variant="secondary">{STATUT_DOSSIER[d.statut]}</Badge>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
