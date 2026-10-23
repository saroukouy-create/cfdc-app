import { NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { prisma } from "@/lib/prisma"
import { clientIdOf, requireRole } from "@/lib/auth"
import { syntheseClient } from "@/lib/donnees"
import { nomSur } from "@/lib/uploads"
import { RapportPDF } from "@/components/pdf/rapport-pdf"

export async function GET(req: Request) {
  const { session, error } = await requireRole(["ADMIN", "CONSEILLER", "CLIENT"])
  if (error) return error

  // Un client ne telecharge que son propre rapport
  const clientId =
    session.user.role === "CLIENT" ? await clientIdOf(session.user.id) : new URL(req.url).searchParams.get("clientId")
  const client = clientId ? await prisma.client.findUnique({ where: { id: clientId } }) : null
  if (!client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 })

  const pdf = await renderToBuffer(
    <RapportPDF client={client} synthese={await syntheseClient(client.id)} date={new Date().toLocaleDateString("fr-FR")} />,
  )
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="rapport-${nomSur(client.raisonSociale)}.pdf"`,
    },
  })
}
