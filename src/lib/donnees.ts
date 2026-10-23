import { prisma } from "./prisma"
import { bilan, compteResultat, cycle, seriesMensuelles, type Ligne } from "./compta"

/** Ecritures d'un client, Decimal Prisma -> number. */
export async function lignesClient(clientId: string): Promise<Ligne[]> {
  const rows = await prisma.ecriture.findMany({
    where: { clientId },
    select: { date: true, journal: true, compte: true, debit: true, credit: true },
    orderBy: { date: "asc" },
  })
  return rows.map((e) => ({ ...e, debit: Number(e.debit), credit: Number(e.credit) }))
}

/** Synthese comptable complete d'un client (tableaux de bord, rapport PDF, espace client). */
export async function syntheseClient(clientId: string) {
  const lignes = await lignesClient(clientId)
  return {
    nbEcritures: lignes.length,
    resultat: compteResultat(lignes),
    series: seriesMensuelles(lignes),
    bilan: bilan(lignes),
    cycle: cycle(lignes),
  }
}

export type Synthese = Awaited<ReturnType<typeof syntheseClient>>
