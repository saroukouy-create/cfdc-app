import { test } from "node:test"
import assert from "node:assert/strict"
import { balance, bilan, compteResultat, cycle, seriesMensuelles, type Ligne } from "./compta"
import { parseEcrituresCsv } from "./csv"

const L = (date: string, journal: string, compte: string, debit: number, credit: number): Ligne => ({
  date: new Date(date),
  journal,
  compte,
  debit,
  credit,
})

// Apport en capital, vente au comptant, achat, puis dotation aux amortissements (inventaire, OD)
const lignes: Ligne[] = [
  L("2026-01-05", "BANQUE", "521", 1_000_000, 0),
  L("2026-01-05", "BANQUE", "101", 0, 1_000_000),
  L("2026-01-20", "VENTES", "571", 500_000, 0),
  L("2026-01-20", "VENTES", "701", 0, 500_000),
  L("2026-02-10", "ACHATS", "601", 200_000, 0),
  L("2026-02-10", "ACHATS", "401", 0, 200_000),
  L("2026-12-31", "OD", "681", 50_000, 0),
  L("2026-12-31", "OD", "284", 0, 50_000),
]

test("balance equilibree", () => {
  const b = balance(lignes)
  assert.equal(b.reduce((s, x) => s + x.solde, 0), 0)
  assert.deepEqual(b.find((x) => x.compte === "401"), { compte: "401", debit: 0, credit: 200_000, solde: -200_000 })
})

test("compte de resultat", () => {
  assert.deepEqual(compteResultat(lignes), { produits: 500_000, charges: 250_000, resultat: 250_000 })
})

test("bilan : actif = passif", () => {
  const b = bilan(lignes)
  assert.equal(b.totalActif, b.totalPassif)
  assert.equal(b.passif.resultat, 250_000)
  assert.equal(b.actif.tresorerie, 1_500_000)
})

test("tresorerie cumulee par mois", () => {
  const s = seriesMensuelles(lignes)
  assert.deepEqual(s.map((m) => m.mois), ["2026-01", "2026-02", "2026-12"])
  assert.equal(s[0].tresorerie, 1_500_000)
  assert.equal(s[1].resultat, -200_000)
})

test("cycle comptable complet", () => {
  assert.ok(cycle(lignes).every((e) => e.fait))
  assert.equal(cycle(lignes.filter((l) => l.journal !== "OD"))[2].fait, false)
})

test("import CSV : formats FR et erreurs", () => {
  const csv = "﻿Date;Journal;Piece;Compte;Libelle;Debit;Credit\n05/01/2026;banque;B1;521;Apport;1 000 000;\n2026-01-05;BANQUE;B1;101;Apport;;1000000,50\n32/13/2026;OD;;601;X;10;\n05/01/2026;OD;;abc;X;10;\n"
  const { ecritures, erreurs } = parseEcrituresCsv(csv)
  assert.equal(ecritures.length, 2)
  assert.equal(ecritures[0].journal, "BANQUE")
  assert.equal(ecritures[0].debit, 1_000_000)
  assert.equal(ecritures[1].credit, 1_000_000.5)
  assert.equal(erreurs.length, 2)
})
