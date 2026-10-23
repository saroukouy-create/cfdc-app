import type { Metadata } from "next"
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
        <p className="text-muted-foreground">Aucun dossier pour l&apos;instant. Votre conseiller CFDC l&apos;ouvrira avec vous.</p>
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
