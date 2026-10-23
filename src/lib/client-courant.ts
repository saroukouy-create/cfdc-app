import { notFound, redirect } from "next/navigation"
import { getSession } from "./auth"
import { prisma } from "./prisma"

/** Fiche Client du compte CLIENT connecte (pages de l'espace client). */
export async function clientCourant() {
  const session = await getSession()
  if (!session) redirect("/connexion")
  const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
  if (!client) notFound()
  return client
}
