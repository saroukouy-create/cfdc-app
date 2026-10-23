import type { Dossier, Piece } from "@prisma/client"
import type { DossierVue } from "@/components/dossiers/dossier-stepper"

/** Dossier Prisma -> objet serialisable passe au stepper (composant client). */
export function versVue(d: Dossier & { pieces: Piece[] }): DossierVue {
  return {
    id: d.id,
    denomination: d.denomination,
    activite: d.activite,
    formeJuridique: d.formeJuridique,
    capital: d.capital,
    siege: d.siege,
    etape: d.etape,
    statut: d.statut,
    dateDepot: d.dateDepot?.toISOString() ?? null,
    numeroRccm: d.numeroRccm,
    notes: d.notes,
    pieces: d.pieces.map((p) => ({ id: p.id, nom: p.nom, taille: p.taille, createdAt: p.createdAt.toISOString() })),
  }
}
