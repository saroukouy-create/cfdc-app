import path from "node:path"

// Pieces jointes stockees hors de /public (servies via /api/pieces/[id] apres controle d'acces).
// Sur Hostinger, ce dossier doit survivre aux redeploiements : definir UPLOAD_DIR hors du depot.
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads")

export function nomSur(nom: string) {
  return nom.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w.-]+/g, "_").slice(-100)
}
