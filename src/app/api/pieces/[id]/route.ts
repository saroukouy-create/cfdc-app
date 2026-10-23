import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { prisma } from "@/lib/prisma"
import { clientIdOf, requireRole } from "@/lib/auth"
import { UPLOAD_DIR } from "@/lib/uploads"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole(["ADMIN", "CONSEILLER", "CLIENT"])
  if (error) return error
  const { id } = await params

  const piece = await prisma.piece.findUnique({ where: { id }, include: { dossier: { select: { clientId: true } } } })
  if (!piece) return NextResponse.json({ error: "Pièce introuvable" }, { status: 404 })
  if (session.user.role === "CLIENT" && piece.dossier.clientId !== (await clientIdOf(session.user.id)))
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  // chemin enregistre par le serveur lui-meme ; on verifie quand meme qu'il reste dans UPLOAD_DIR
  const absolu = path.resolve(UPLOAD_DIR, piece.chemin)
  if (!absolu.startsWith(path.resolve(UPLOAD_DIR) + path.sep))
    return NextResponse.json({ error: "Chemin invalide" }, { status: 400 })

  try {
    const contenu = await readFile(absolu)
    return new Response(contenu, {
      headers: {
        "Content-Type": piece.type,
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(piece.nom)}`,
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return NextResponse.json({ error: "Fichier absent du serveur" }, { status: 410 })
  }
}
