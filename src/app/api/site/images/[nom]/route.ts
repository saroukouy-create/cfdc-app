import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { UPLOAD_DIR } from "@/lib/uploads"

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" }

// Images du site public : accessibles a tous (contrairement aux pieces des dossiers)
export async function GET(_req: Request, { params }: { params: Promise<{ nom: string }> }) {
  const { nom } = await params
  const type = TYPES[nom.split(".").pop() ?? ""]
  if (!type || !/^[\w-]+\.\w+$/.test(nom)) return NextResponse.json({ error: "Image introuvable" }, { status: 404 })
  try {
    const contenu = await readFile(path.join(UPLOAD_DIR, "site", nom))
    return new Response(contenu, {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    })
  } catch {
    return NextResponse.json({ error: "Image introuvable" }, { status: 404 })
  }
}
