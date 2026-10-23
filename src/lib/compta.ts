// Calculs comptables (plan SYSCOHADA) a partir des ecritures.
// Fonctions pures : testees dans compta.test.ts.

export type Ligne = { date: Date; journal: string; compte: string; debit: number; credit: number }

export type LigneBalance = { compte: string; debit: number; credit: number; solde: number }

const r = (n: number) => Math.round(n * 100) / 100

export function balance(lignes: Ligne[]): LigneBalance[] {
  const map = new Map<string, LigneBalance>()
  for (const l of lignes) {
    const b = map.get(l.compte) ?? { compte: l.compte, debit: 0, credit: 0, solde: 0 }
    b.debit += l.debit
    b.credit += l.credit
    map.set(l.compte, b)
  }
  return [...map.values()]
    .map((b) => ({ compte: b.compte, debit: r(b.debit), credit: r(b.credit), solde: r(b.debit - b.credit) }))
    .sort((a, b) => a.compte.localeCompare(b.compte))
}

// Classe 7 et HAO paires (82, 84, 86, 88) = produits ; classe 6 et HAO impaires (81..89) = charges
function nature(compte: string): "produit" | "charge" | null {
  if (compte.startsWith("7")) return "produit"
  if (compte.startsWith("6")) return "charge"
  if (compte.startsWith("8") && compte.length > 1) return Number(compte[1]) % 2 === 0 ? "produit" : "charge"
  return null
}

export function compteResultat(lignes: Ligne[]) {
  let produits = 0
  let charges = 0
  for (const l of lignes) {
    const n = nature(l.compte)
    if (n === "produit") produits += l.credit - l.debit
    if (n === "charge") charges += l.debit - l.credit
  }
  return { produits: r(produits), charges: r(charges), resultat: r(produits - charges) }
}

const mois = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`

/** Produits, charges et tresorerie (classe 5, cumulee) par mois, dans l'ordre chronologique. */
export function seriesMensuelles(lignes: Ligne[]) {
  const map = new Map<string, { produits: number; charges: number; flux: number }>()
  for (const l of lignes) {
    const m = map.get(mois(l.date)) ?? { produits: 0, charges: 0, flux: 0 }
    const n = nature(l.compte)
    if (n === "produit") m.produits += l.credit - l.debit
    if (n === "charge") m.charges += l.debit - l.credit
    if (l.compte.startsWith("5")) m.flux += l.debit - l.credit
    map.set(mois(l.date), m)
  }
  let cumul = 0
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([m, v]) => {
      cumul += v.flux
      return { mois: m, produits: r(v.produits), charges: r(v.charges), resultat: r(v.produits - v.charges), tresorerie: r(cumul) }
    })
}

/** Bilan simplifie a partir de la balance. Le resultat de l'exercice equilibre actif et passif. */
export function bilan(lignes: Ligne[]) {
  const bal = balance(lignes)
  const somme = (pred: (b: LigneBalance) => boolean, signe: 1 | -1) =>
    r(bal.filter(pred).reduce((s, b) => s + signe * b.solde, 0))
  const classe = (c: string) => (b: LigneBalance) => b.compte.startsWith(c)
  const deb = (b: LigneBalance) => b.solde > 0
  const cre = (b: LigneBalance) => b.solde < 0

  const actif = {
    immobilisations: somme(classe("2"), 1),
    stocks: somme(classe("3"), 1),
    creances: somme((b) => classe("4")(b) && deb(b), 1),
    tresorerie: somme((b) => classe("5")(b) && deb(b), 1),
  }
  const { resultat } = compteResultat(lignes)
  const passif = {
    capitauxPropres: somme((b) => /^1[0-5]/.test(b.compte), -1),
    resultat,
    dettesFinancieres: somme((b) => /^1[6-9]/.test(b.compte), -1),
    dettes: somme((b) => classe("4")(b) && cre(b), -1),
    tresoreriePassif: somme((b) => classe("5")(b) && cre(b), -1),
  }
  const totalActif = r(Object.values(actif).reduce((a, b) => a + b, 0))
  const totalPassif = r(Object.values(passif).reduce((a, b) => a + b, 0))
  return { actif, passif, totalActif, totalPassif }
}

/**
 * Etat d'avancement du cycle comptable (document "CYCLE POUR LE BILAN") :
 * enregistrement -> balance avant inventaire -> inventaire/regularisations -> balance apres inventaire -> etats financiers.
 * Les ecritures d'inventaire sont celles du journal OD.
 */
export function cycle(lignes: Ligne[]) {
  const total = (ls: Ligne[]) => ls.reduce((s, l) => ({ d: s.d + l.debit, c: s.c + l.credit }), { d: 0, c: 0 })
  const equilibre = (ls: Ligne[]) => {
    const t = total(ls)
    return ls.length > 0 && Math.abs(t.d - t.c) < 0.01
  }
  const avant = lignes.filter((l) => l.journal !== "OD")
  const inventaire = lignes.filter((l) => l.journal === "OD")
  const apres = equilibre(lignes) && inventaire.length > 0
  return [
    { etape: "Enregistrement", detail: `${avant.length} écritures (journaux, caisse, auxiliaires)`, fait: avant.length > 0 },
    { etape: "Balance avant inventaire", detail: equilibre(avant) ? "Équilibrée" : "Non équilibrée", fait: equilibre(avant) },
    { etape: "Inventaire et régularisations", detail: `${inventaire.length} écritures d'inventaire (OD)`, fait: inventaire.length > 0 },
    { etape: "Balance après inventaire", detail: apres ? "Équilibrée" : "En attente", fait: apres },
    { etape: "États financiers", detail: "Bilan, compte de résultat, annexes", fait: apres },
  ]
}
