import { test } from "node:test"
import assert from "node:assert/strict"
import type { Ligne } from "./compta"
import { etatsFinanciers, exercices } from "./etats-financiers"

const L = (date: string, journal: string, compte: string, debit: number, credit: number): Ligne => ({
  date: new Date(date + "T12:00:00"),
  journal,
  compte,
  debit,
  credit,
})

// Exercice 2025 : apport, achat de materiel, emprunt, ventes, achats a credit, salaires, dotation, impot
const a2025: Ligne[] = [
  L("2025-01-05", "BANQUE", "521", 5_000_000, 0),
  L("2025-01-05", "BANQUE", "101", 0, 5_000_000),
  L("2025-02-01", "BANQUE", "244", 2_000_000, 0),
  L("2025-02-01", "BANQUE", "521", 0, 2_000_000),
  L("2025-03-01", "BANQUE", "521", 3_000_000, 0),
  L("2025-03-01", "BANQUE", "162", 0, 3_000_000),
  L("2025-04-10", "VENTES", "411", 4_000_000, 0),
  L("2025-04-10", "VENTES", "706", 0, 4_000_000),
  L("2025-05-02", "BANQUE", "521", 1_500_000, 0),
  L("2025-05-02", "BANQUE", "411", 0, 1_500_000),
  L("2025-06-01", "ACHATS", "604", 1_000_000, 0),
  L("2025-06-01", "ACHATS", "401", 0, 1_000_000),
  L("2025-07-01", "OD", "661", 800_000, 0),
  L("2025-07-01", "OD", "571", 0, 800_000),
  L("2025-12-31", "OD", "6811", 400_000, 0),
  L("2025-12-31", "OD", "2844", 0, 400_000),
  L("2025-12-31", "OD", "891", 300_000, 0),
  L("2025-12-31", "OD", "441", 0, 300_000),
  L("2025-01-06", "CAISSE", "571", 1_000_000, 0),
  L("2025-01-06", "CAISSE", "521", 0, 1_000_000),
]

// Exercice 2026 : cession d'un materiel, remboursement d'emprunt, dividendes, ventes au comptant
const a2026: Ligne[] = [
  L("2026-02-01", "BANQUE", "521", 600_000, 0),
  L("2026-02-01", "BANQUE", "822", 0, 600_000),
  L("2026-02-01", "OD", "2844", 400_000, 0),
  L("2026-02-01", "OD", "812", 1_600_000, 0),
  L("2026-02-01", "OD", "244", 0, 2_000_000),
  L("2026-03-01", "BANQUE", "162", 500_000, 0),
  L("2026-03-01", "BANQUE", "521", 0, 500_000),
  L("2026-04-01", "BANQUE", "521", 2_000_000, 0),
  L("2026-04-01", "VENTES", "706", 0, 2_000_000),
  L("2026-06-01", "BANQUE", "121", 700_000, 0),
  L("2026-06-01", "BANQUE", "521", 0, 700_000),
]

const tous = [...a2025, ...a2026]
const valeur = (t: { ref: string }[], ref: string) => t.find((x) => x.ref === ref) as never as Record<string, number>

test("exercices detectes", () => {
  assert.deepEqual(exercices(tous), [2026, 2025])
})

test("2025 : bilan equilibre, resultat et flux rapproches", () => {
  const e = etatsFinanciers(tous, 2025)
  assert.deepEqual(e.controles.nonClasses, [])
  assert.ok(e.controles.bilanEquilibre)
  assert.ok(e.controles.fluxRapproches)
  const res = valeur(e.resultat, "XI")
  // CA 4 000 000 - achats 1 000 000 - personnel 800 000 - dotation 400 000 - impot 300 000
  assert.equal(valeur(e.resultat, "XB").n, 4_000_000)
  assert.equal(valeur(e.resultat, "XD").n, 2_200_000)
  assert.equal(res.n, 1_500_000)
  assert.equal(valeur(e.passif, "CH").n, 1_500_000)
  assert.equal(valeur(e.actif, "AM").brut, 2_000_000)
  assert.equal(valeur(e.actif, "AM").amort, 400_000)
  assert.equal(valeur(e.actif, "AM").net, 1_600_000)
})

test("2026 : report a nouveau, N-1, cession, dividendes et flux rapproches", () => {
  const e = etatsFinanciers(tous, 2026)
  assert.deepEqual(e.controles.nonClasses, [])
  assert.ok(e.controles.bilanEquilibre)
  assert.ok(e.controles.fluxRapproches)
  assert.equal(valeur(e.passif, "CG").n, 1_500_000 - 700_000) // resultat 2025 reporte, moins dividendes
  assert.equal(valeur(e.passif, "CH").nPrec, 1_500_000)
  assert.equal(valeur(e.flux, "FI").valeur, 600_000)
  assert.equal(valeur(e.flux, "FN").valeur, -700_000)
  assert.equal(valeur(e.flux, "FQ").valeur, -500_000)
  const cloture = e.variations.lignes.at(-1)!
  const ouverture = e.variations.lignes[0]
  assert.equal(cloture.ensemble, valeur(e.passif, "CP").n)
  assert.equal(ouverture.ensemble, valeur(e.passif, "CP").nPrec)
})

test("a-nouveaux (journal AN) : ouverture sans compter comme flux", () => {
  const ouverture = [L("2026-01-01", "AN", "521", 1_000_000, 0), L("2026-01-01", "AN", "101", 0, 1_000_000)]
  const e = etatsFinanciers([...ouverture, L("2026-03-01", "VENTES", "571", 300_000, 0), L("2026-03-01", "VENTES", "706", 0, 300_000)], 2026)
  assert.ok(e.controles.bilanEquilibre && e.controles.fluxRapproches)
  assert.equal(valeur(e.flux, "ZA").valeur, 1_000_000)
  assert.equal(valeur(e.flux, "ZH").valeur, 1_300_000)
  assert.equal(valeur(e.flux, "FK").valeur, 0)
})

test("compte inconnu signale", () => {
  const e = etatsFinanciers([L("2026-01-01", "OD", "999", 0, 0), L("2026-01-01", "OD", "6034", 10, 0), L("2026-01-01", "OD", "101", 0, 10)], 2026)
  assert.deepEqual(e.controles.nonClasses, ["6034"])
})
