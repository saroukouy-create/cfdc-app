import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { requireRole } from "@/lib/auth"
import { UPLOAD_DIR } from "@/lib/uploads"

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }
const MAX = 5 * 1024 * 1024

// Envoi d'une image du site (livres, etc.), stockee dans UPLOAD_DIR/site : reserve aux administrateurs
export async function POST(req: Request) {
  const { error } = await requireRole(["ADMIN"])
  if (error) return error
  const fichier = (await req.formData().catch(() => null))?.get("fichier")
  if (!(fichier instanceof File)) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 })
  const ext = TYPES[fichier.type]
  if (!ext) return NextResponse.json({ error: "Format accepté : JPEG, PNG ou WebP" }, { status: 400 })
  if (fichier.size > MAX) return NextResponse.json({ error: "Image trop lourde (5 Mo maximum)" }, { status: 400 })

  const nom = `${randomUUID()}.${ext}`
  await mkdir(path.join(UPLOAD_DIR, "site"), { recursive: true })
  await writeFile(path.join(UPLOAD_DIR, "site", nom), Buffer.from(await fichier.arrayBuffer()))
  return NextResponse.json({ url: `/api/site/images/${nom}` }, { status: 201 })
}
