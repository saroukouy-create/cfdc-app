import Papa from "papaparse"

// Format attendu (en-tete obligatoire, separateur ; ou , detecte) :
// date;journal;piece;compte;libelle;debit;credit
// Dates JJ/MM/AAAA ou AAAA-MM-JJ ; montants "1 250 000" ou "1250000,50".

export type EcritureCsv = {
  date: Date
  journal: string
  piece: string | null
  compte: string
  libelle: string
  debit: number
  credit: number
}

function montant(v: string | undefined) {
  if (!v || !v.trim()) return 0
  const n = Number(v.replace(/[\s  ]/g, "").replace(",", "."))
  return Number.isFinite(n) ? n : NaN
}

function date(v: string | undefined) {
  const s = (v ?? "").trim()
  const fr = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const [a, m, j] = fr ? [+fr[3], +fr[2], +fr[1]] : iso ? [+iso[1], +iso[2], +iso[3]] : [NaN, NaN, NaN]
  const d = new Date(Date.UTC(a, m - 1, j))
  // Date.UTC accepte 32/13 en debordant sur le mois suivant : on verifie que rien n'a bouge
  return d.getUTCDate() === j && d.getUTCMonth() === m - 1 ? d : null
}

export function parseEcrituresCsv(texte: string) {
  const { data } = Papa.parse<Record<string, string>>(texte.replace(/^﻿/, ""), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  })
  const ecritures: EcritureCsv[] = []
  const erreurs: string[] = []

  data.forEach((row, i) => {
    const ligne = i + 2 // +1 en-tete, +1 base 1
    const d = date(row.date)
    const debit = montant(row.debit)
    const credit = montant(row.credit)
    const compte = (row.compte ?? "").trim()
    if (!d) return erreurs.push(`Ligne ${ligne} : date invalide "${row.date ?? ""}"`)
    if (!/^\d{2,}$/.test(compte)) return erreurs.push(`Ligne ${ligne} : compte invalide "${compte}"`)
    if (Number.isNaN(debit) || Number.isNaN(credit) || debit < 0 || credit < 0)
      return erreurs.push(`Ligne ${ligne} : montant invalide`)
    if (debit === 0 && credit === 0) return erreurs.push(`Ligne ${ligne} : débit et crédit nuls`)
    ecritures.push({
      date: d,
      journal: (row.journal ?? "OD").trim().toUpperCase() || "OD",
      piece: row.piece?.trim() || null,
      compte,
      libelle: (row.libelle ?? "").trim() || "—",
      debit,
      credit,
    })
  })
  return { ecritures, erreurs }
}
