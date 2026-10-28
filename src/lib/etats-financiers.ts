// Etats financiers annuels au format SYSCOHADA revise (Acte uniforme OHADA relatif au droit comptable
// et a l'information financiere, en vigueur au Benin) - Systeme normal :
// bilan, compte de resultat, tableau des flux de tresorerie, etat des variations des capitaux propres.
// Fonctions pures, testees dans etats-financiers.test.ts. Exercice = annee civile.
//
// Conventions :
// - les ecritures du journal "AN" (a-nouveaux) sont rattachees au 31/12 de l'exercice precedent ;
// - le resultat est calcule a partir des classes 6, 7 et 8 (pas d'ecritures de cloture a passer) ;
//   le resultat des exercices anterieurs est reporte automatiquement en report a nouveau (compte 12).
import type { Ligne } from "./compta"

const r = (n: number) => Math.round(n * 100) / 100 + 0 // + 0 : evite -0
const annee = (d: Date) => d.getFullYear()

type Regle = { ref: string; re: RegExp; si?: "D" | "C" }
type Poste = { ref: string; libelle: string; de?: string[] }

// ---------------------------------------------------------------- Bilan

// Ordre = priorite. "si" : sens du solde du compte (D = debiteur, C = crediteur).
const REGLES_ACTIF: Regle[] = [
  { ref: "AE", re: /^211/ },
  { ref: "AF", re: /^21[234]/ },
  { ref: "AG", re: /^21[56]/ },
  { ref: "AH", re: /^21[789]/ },
  { ref: "AJ", re: /^22/ },
  { ref: "AK", re: /^23[1237]/ },
  { ref: "AL", re: /^23[4589]/ },
  { ref: "AM", re: /^24[1-46-9]/ },
  { ref: "AN", re: /^245/ },
  { ref: "AP", re: /^25/ },
  { ref: "AR", re: /^26/ },
  { ref: "AS", re: /^27/ },
  { ref: "BV", re: /^478/, si: "D" },
  { ref: "BA", re: /^48/, si: "D" },
  { ref: "BB", re: /^3/ },
  { ref: "BI", re: /^40/, si: "D" },
  { ref: "BJ", re: /^41/, si: "D" },
  { ref: "BK", re: /^(18|4[2-7])/, si: "D" },
  { ref: "BQ", re: /^50/, si: "D" },
  { ref: "BR", re: /^51/, si: "D" },
  { ref: "BS", re: /^5[2-8]/, si: "D" },
]

const REGLES_PASSIF: Regle[] = [
  { ref: "CA", re: /^10[1-478]/ },
  { ref: "CB", re: /^109/ },
  { ref: "CC", re: /^105/ },
  { ref: "CD", re: /^106/ },
  { ref: "CE", re: /^11[1-3]/ },
  { ref: "CF", re: /^11[4-9]/ },
  { ref: "CG", re: /^12/ },
  { ref: "CH", re: /^13/ },
  { ref: "CJ", re: /^14/ },
  { ref: "CK", re: /^15/ },
  { ref: "DA", re: /^16/ },
  { ref: "DB", re: /^17/ },
  { ref: "DC", re: /^19/ },
  { ref: "DV", re: /^479/, si: "C" },
  { ref: "DH", re: /^48/, si: "C" },
  { ref: "DI", re: /^41/, si: "C" },
  { ref: "DJ", re: /^40/, si: "C" },
  { ref: "DK", re: /^4[2-4]/, si: "C" },
  { ref: "DN", re: /^499/ },
  { ref: "DM", re: /^(18|4[5-7])/, si: "C" },
  { ref: "DQ", re: /^56[45]/, si: "C" },
  { ref: "DR", re: /^5/, si: "C" },
]

const PLAN_ACTIF: Poste[] = [
  { ref: "AE", libelle: "Frais de développement et de prospection" },
  { ref: "AF", libelle: "Brevets, licences, logiciels et droits similaires" },
  { ref: "AG", libelle: "Fonds commercial et droit au bail" },
  { ref: "AH", libelle: "Autres immobilisations incorporelles" },
  { ref: "AD", libelle: "IMMOBILISATIONS INCORPORELLES", de: ["AE", "AF", "AG", "AH"] },
  { ref: "AJ", libelle: "Terrains" },
  { ref: "AK", libelle: "Bâtiments" },
  { ref: "AL", libelle: "Aménagements, agencements et installations" },
  { ref: "AM", libelle: "Matériel, mobilier et actifs biologiques" },
  { ref: "AN", libelle: "Matériel de transport" },
  { ref: "AI", libelle: "IMMOBILISATIONS CORPORELLES", de: ["AJ", "AK", "AL", "AM", "AN"] },
  { ref: "AP", libelle: "Avances et acomptes versés sur immobilisations" },
  { ref: "AR", libelle: "Titres de participation" },
  { ref: "AS", libelle: "Autres immobilisations financières" },
  { ref: "AQ", libelle: "IMMOBILISATIONS FINANCIÈRES", de: ["AR", "AS"] },
  { ref: "AZ", libelle: "TOTAL ACTIF IMMOBILISÉ", de: ["AD", "AI", "AP", "AQ"] },
  { ref: "BA", libelle: "ACTIF CIRCULANT HAO" },
  { ref: "BB", libelle: "STOCKS ET ENCOURS" },
  { ref: "BI", libelle: "Fournisseurs, avances versées" },
  { ref: "BJ", libelle: "Clients" },
  { ref: "BK", libelle: "Autres créances" },
  { ref: "BH", libelle: "CRÉANCES ET EMPLOIS ASSIMILÉS", de: ["BI", "BJ", "BK"] },
  { ref: "BT", libelle: "TOTAL ACTIF CIRCULANT", de: ["BA", "BB", "BH"] },
  { ref: "BQ", libelle: "Titres de placement" },
  { ref: "BR", libelle: "Valeurs à encaisser" },
  { ref: "BS", libelle: "Banques, chèques postaux, caisse et assimilés" },
  { ref: "BU", libelle: "TOTAL TRÉSORERIE-ACTIF", de: ["BQ", "BR", "BS"] },
  { ref: "BV", libelle: "Écart de conversion-Actif" },
  { ref: "BZ", libelle: "TOTAL GÉNÉRAL", de: ["AZ", "BT", "BU", "BV"] },
]

const PLAN_PASSIF: Poste[] = [
  { ref: "CA", libelle: "Capital" },
  { ref: "CB", libelle: "Apporteurs capital non appelé (-)" },
  { ref: "CC", libelle: "Primes liées au capital social" },
  { ref: "CD", libelle: "Écarts de réévaluation" },
  { ref: "CE", libelle: "Réserves indisponibles" },
  { ref: "CF", libelle: "Réserves libres" },
  { ref: "CG", libelle: "Report à nouveau (+ ou -)" },
  { ref: "CH", libelle: "Résultat net de l'exercice (bénéfice + ou perte -)" },
  { ref: "CJ", libelle: "Subventions d'investissement" },
  { ref: "CK", libelle: "Provisions réglementées et fonds assimilés" },
  { ref: "CP", libelle: "TOTAL CAPITAUX PROPRES ET RESSOURCES ASSIMILÉES", de: ["CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CJ", "CK"] },
  { ref: "DA", libelle: "Emprunts et dettes financières diverses" },
  { ref: "DB", libelle: "Dettes de location-acquisition" },
  { ref: "DC", libelle: "Provisions pour risques et charges" },
  { ref: "DD", libelle: "TOTAL DETTES FINANCIÈRES ET RESSOURCES ASSIMILÉES", de: ["DA", "DB", "DC"] },
  { ref: "DF", libelle: "TOTAL RESSOURCES STABLES", de: ["CP", "DD"] },
  { ref: "DH", libelle: "Dettes circulantes HAO" },
  { ref: "DI", libelle: "Clients, avances reçues" },
  { ref: "DJ", libelle: "Fournisseurs d'exploitation" },
  { ref: "DK", libelle: "Dettes fiscales et sociales" },
  { ref: "DM", libelle: "Autres dettes" },
  { ref: "DN", libelle: "Provisions pour risques à court terme" },
  { ref: "DP", libelle: "TOTAL PASSIF CIRCULANT", de: ["DH", "DI", "DJ", "DK", "DM", "DN"] },
  { ref: "DQ", libelle: "Banques, crédits d'escompte" },
  { ref: "DR", libelle: "Banques, établissements financiers et crédits de trésorerie" },
  { ref: "DT", libelle: "TOTAL TRÉSORERIE-PASSIF", de: ["DQ", "DR"] },
  { ref: "DV", libelle: "Écart de conversion-Passif" },
  { ref: "DZ", libelle: "TOTAL GÉNÉRAL", de: ["DF", "DP", "DT", "DV"] },
]

type MontantActif = { brut: number; amort: number }

/** Situation au 31/12 de `an` : cumul des ecritures classes 1 a 5, resultat de l'exercice et report des exercices anterieurs. */
function situation(lignes: Ligne[], an: number) {
  const soldes = new Map<string, number>()
  let resultat = 0
  let anterieur = 0
  for (const l of lignes) {
    const a = annee(l.date)
    if (a > an || l.compte[0] === "9") continue
    if ("678".includes(l.compte[0])) {
      if (a === an) resultat += l.credit - l.debit
      else anterieur += l.credit - l.debit
    } else soldes.set(l.compte, (soldes.get(l.compte) ?? 0) + l.debit - l.credit)
  }

  const actif: Record<string, MontantActif> = {}
  const passif: Record<string, number> = {}
  const nonClasses: string[] = []
  const montant = (ref: string) => (actif[ref] ??= { brut: 0, amort: 0 })
  const trouver = (regles: Regle[], c: string, signe?: "D" | "C") =>
    regles.find((x) => x.re.test(c) && (!signe || !x.si || x.si === signe))

  for (const [c, s] of soldes) {
    if (Math.abs(s) < 0.005) continue
    const signe = s > 0 ? "D" : "C"
    // Amortissements (28), depreciations (29, 39, 49, 59) : en deduction du poste d'actif concerne
    if (/^(28|29|39|59|49[0-8])/.test(c)) {
      const poste = trouver(REGLES_ACTIF, c[0] + c.slice(2))
      if (poste) montant(poste.ref).amort -= s
      else nonClasses.push(c)
      continue
    }
    const ra = trouver(REGLES_ACTIF, c, signe)
    if (ra) {
      montant(ra.ref).brut += s
      continue
    }
    const rp = trouver(REGLES_PASSIF, c, signe)
    if (rp) passif[rp.ref] = (passif[rp.ref] ?? 0) - s
    else nonClasses.push(c)
  }
  passif.CG = (passif.CG ?? 0) + anterieur
  passif.CH = (passif.CH ?? 0) + resultat
  return { actif, passif, nonClasses, resultat }
}

type Situation = ReturnType<typeof situation>

export type LigneActif = { ref: string; libelle: string; total: boolean; brut: number; amort: number; net: number; netPrec: number }
export type LignePassif = { ref: string; libelle: string; total: boolean; n: number; nPrec: number }

function sommeActif(plan: Poste[], s: Situation) {
  const v: Record<string, MontantActif> = {}
  for (const p of plan) {
    v[p.ref] = p.de
      ? p.de.reduce((t, ref) => ({ brut: t.brut + v[ref].brut, amort: t.amort + v[ref].amort }), { brut: 0, amort: 0 })
      : { brut: s.actif[p.ref]?.brut ?? 0, amort: s.actif[p.ref]?.amort ?? 0 }
  }
  return v
}

function sommePassif(plan: Poste[], s: Situation) {
  const v: Record<string, number> = {}
  for (const p of plan) v[p.ref] = p.de ? p.de.reduce((t, ref) => t + v[ref], 0) : (s.passif[p.ref] ?? 0)
  return v
}

// ---------------------------------------------------------------- Compte de resultat

// Resultat = credit - debit : les charges ressortent en negatif, comme dans le modele officiel.
const REGLES_CR: Regle[] = [
  { ref: "TA", re: /^701/ },
  { ref: "RA", re: /^601/ },
  { ref: "RB", re: /^6031/ },
  { ref: "TB", re: /^70[234]/ },
  { ref: "TC", re: /^70[56]/ },
  { ref: "TD", re: /^707/ },
  { ref: "TE", re: /^73/ },
  { ref: "TF", re: /^72/ },
  { ref: "TG", re: /^71/ },
  { ref: "TH", re: /^75/ },
  { ref: "TI", re: /^781/ },
  { ref: "RC", re: /^602/ },
  { ref: "RD", re: /^6032/ },
  { ref: "RE", re: /^60[458]/ },
  { ref: "RF", re: /^6033/ },
  { ref: "RG", re: /^61/ },
  { ref: "RH", re: /^6[23]/ },
  { ref: "RI", re: /^64/ },
  { ref: "RJ", re: /^65/ },
  { ref: "RK", re: /^66/ },
  { ref: "TL", re: /^797/ },
  { ref: "TJ", re: /^79[189]/ },
  { ref: "RL", re: /^6[89]1/ },
  { ref: "TK", re: /^77/ },
  { ref: "TM", re: /^787/ },
  { ref: "RM", re: /^67/ },
  { ref: "RN", re: /^6[89]7/ },
  { ref: "TN", re: /^82/ },
  { ref: "TO", re: /^8[468]/ },
  { ref: "RO", re: /^81/ },
  { ref: "RP", re: /^8[35]/ },
  { ref: "RQ", re: /^87/ },
  { ref: "RS", re: /^89/ },
]

const PLAN_CR: Poste[] = [
  { ref: "TA", libelle: "Ventes de marchandises" },
  { ref: "RA", libelle: "Achats de marchandises" },
  { ref: "RB", libelle: "Variation de stocks de marchandises" },
  { ref: "XA", libelle: "MARGE COMMERCIALE (Somme TA à RB)", de: ["TA", "RA", "RB"] },
  { ref: "TB", libelle: "Ventes de produits fabriqués" },
  { ref: "TC", libelle: "Travaux, services vendus" },
  { ref: "TD", libelle: "Produits accessoires" },
  { ref: "XB", libelle: "CHIFFRE D'AFFAIRES (TA + TB + TC + TD)", de: ["TA", "TB", "TC", "TD"] },
  { ref: "TE", libelle: "Production stockée (ou déstockage)" },
  { ref: "TF", libelle: "Production immobilisée" },
  { ref: "TG", libelle: "Subventions d'exploitation" },
  { ref: "TH", libelle: "Autres produits" },
  { ref: "TI", libelle: "Transferts de charges d'exploitation" },
  { ref: "RC", libelle: "Achats de matières premières et fournitures liées" },
  { ref: "RD", libelle: "Variation de stocks de matières premières et fournitures liées" },
  { ref: "RE", libelle: "Autres achats" },
  { ref: "RF", libelle: "Variation de stocks d'autres approvisionnements" },
  { ref: "RG", libelle: "Transports" },
  { ref: "RH", libelle: "Services extérieurs" },
  { ref: "RI", libelle: "Impôts et taxes" },
  { ref: "RJ", libelle: "Autres charges" },
  { ref: "XC", libelle: "VALEUR AJOUTÉE", de: ["XB", "RA", "RB", "TE", "TF", "TG", "TH", "TI", "RC", "RD", "RE", "RF", "RG", "RH", "RI", "RJ"] },
  { ref: "RK", libelle: "Charges de personnel" },
  { ref: "XD", libelle: "EXCÉDENT BRUT D'EXPLOITATION (EBE)", de: ["XC", "RK"] },
  { ref: "TJ", libelle: "Reprises d'amortissements, provisions et dépréciations d'exploitation" },
  { ref: "RL", libelle: "Dotations aux amortissements, aux provisions et dépréciations d'exploitation" },
  { ref: "XE", libelle: "RÉSULTAT D'EXPLOITATION", de: ["XD", "TJ", "RL"] },
  { ref: "TK", libelle: "Revenus financiers et assimilés" },
  { ref: "TL", libelle: "Reprises de provisions et dépréciations financières" },
  { ref: "TM", libelle: "Transferts de charges financières" },
  { ref: "RM", libelle: "Frais financiers et charges assimilées" },
  { ref: "RN", libelle: "Dotations aux provisions et aux dépréciations financières" },
  { ref: "XF", libelle: "RÉSULTAT FINANCIER", de: ["TK", "TL", "TM", "RM", "RN"] },
  { ref: "XG", libelle: "RÉSULTAT DES ACTIVITÉS ORDINAIRES", de: ["XE", "XF"] },
  { ref: "TN", libelle: "Produits des cessions d'immobilisations" },
  { ref: "TO", libelle: "Autres produits HAO" },
  { ref: "RO", libelle: "Valeurs comptables des cessions d'immobilisations" },
  { ref: "RP", libelle: "Autres charges HAO" },
  { ref: "XH", libelle: "RÉSULTAT HORS ACTIVITÉS ORDINAIRES (HAO)", de: ["TN", "TO", "RO", "RP"] },
  { ref: "RQ", libelle: "Participation des travailleurs" },
  { ref: "RS", libelle: "Impôts sur le résultat" },
  { ref: "XI", libelle: "RÉSULTAT NET", de: ["XG", "XH", "RQ", "RS"] },
]

function compteResultatAnnee(lignes: Ligne[], an: number) {
  const v: Record<string, number> = {}
  const nonClasses = new Set<string>()
  for (const l of lignes) {
    if (annee(l.date) !== an || !"678".includes(l.compte[0])) continue
    const regle = REGLES_CR.find((x) => x.re.test(l.compte))
    if (regle) v[regle.ref] = (v[regle.ref] ?? 0) + l.credit - l.debit
    else nonClasses.add(l.compte)
  }
  for (const p of PLAN_CR) v[p.ref] = r(p.de ? p.de.reduce((t, ref) => t + v[ref], 0) : (v[p.ref] ?? 0))
  return { v, nonClasses: [...nonClasses] }
}

export type LigneResultat = { ref: string; libelle: string; total: boolean; n: number; nPrec: number }

// ---------------------------------------------------------------- Etats

export type EtatsFinanciers = ReturnType<typeof etatsFinanciers>

/** Annees comptables presentes dans les ecritures, de la plus recente a la plus ancienne. */
export function exercices(lignes: Ligne[]): number[] {
  return [...new Set(lignes.map((l) => annee(l.date)))].sort((a, b) => b - a)
}

export function etatsFinanciers(brutes: Ligne[], an: number) {
  // A-nouveaux : rattaches a la cloture de l'exercice precedent
  const lignes = brutes.map((l) => (l.journal === "AN" ? { ...l, date: new Date(annee(l.date) - 1, 11, 31) } : l))
  const dans = (re: RegExp) => lignes.filter((l) => annee(l.date) === an && re.test(l.compte))
  const mvt = (re: RegExp) => r(dans(re).reduce((s, l) => s + l.debit - l.credit, 0)) // debit - credit
  const debits = (re: RegExp) => r(dans(re).reduce((s, l) => s + l.debit, 0))
  const credits = (re: RegExp) => r(dans(re).reduce((s, l) => s + l.credit, 0))
  const tresorerie = (a: number) =>
    r(lignes.filter((l) => annee(l.date) <= a && /^5[0-8]/.test(l.compte)).reduce((s, l) => s + l.debit - l.credit, 0))

  const cl = situation(lignes, an)
  const ou = situation(lignes, an - 1)

  // Bilan
  const aCl = sommeActif(PLAN_ACTIF, cl)
  const aOu = sommeActif(PLAN_ACTIF, ou)
  const pCl = sommePassif(PLAN_PASSIF, cl)
  const pOu = sommePassif(PLAN_PASSIF, ou)
  const actif: LigneActif[] = PLAN_ACTIF.map((p) => ({
    ref: p.ref,
    libelle: p.libelle,
    total: !!p.de,
    brut: r(aCl[p.ref].brut),
    amort: r(aCl[p.ref].amort),
    net: r(aCl[p.ref].brut - aCl[p.ref].amort),
    netPrec: r(aOu[p.ref].brut - aOu[p.ref].amort),
  }))
  const passif: LignePassif[] = PLAN_PASSIF.map((p) => ({
    ref: p.ref,
    libelle: p.libelle,
    total: !!p.de,
    n: r(pCl[p.ref]),
    nPrec: r(pOu[p.ref]),
  }))

  // Compte de resultat
  const crN = compteResultatAnnee(lignes, an)
  const crP = compteResultatAnnee(lignes, an - 1)
  const resultat: LigneResultat[] = PLAN_CR.map((p) => ({
    ref: p.ref,
    libelle: p.libelle,
    total: !!p.de,
    n: crN.v[p.ref],
    nPrec: crP.v[p.ref],
  }))

  // Tableau des flux de tresorerie (methode indirecte). Variations de BFR sur valeurs brutes :
  // les depreciations et provisions passent par la CAFG (dotations - reprises).
  const brut = (s: Situation, ...refs: string[]) => refs.reduce((t, ref) => t + (s.actif[ref]?.brut ?? 0), 0)
  const pas = (s: Situation, ...refs: string[]) => refs.reduce((t, ref) => t + (s.passif[ref] ?? 0), 0)
  const dotations = mvt(/^(6[89]|85)/)
  const reprises = -mvt(/^(79|86)/)
  const cafg = r(crN.v.XI + dotations - reprises + mvt(/^81/) + mvt(/^82/))
  const FB = r(-(brut(cl, "BA") - brut(ou, "BA")))
  const FC = r(-(brut(cl, "BB") - brut(ou, "BB")))
  const FD = r(-(brut(cl, "BI", "BJ", "BK", "BV") - brut(ou, "BI", "BJ", "BK", "BV")))
  const FE = r(pas(cl, "DH", "DI", "DJ", "DK", "DM", "DV") - pas(ou, "DH", "DI", "DJ", "DK", "DM", "DV"))
  const B = r(cafg + FB + FC + FD + FE)
  const FF = -debits(/^21/)
  const FG = -debits(/^2[2-5]/)
  const FH = -debits(/^2[67]/)
  const FJ = -mvt(/^826/)
  const FI = r(-mvt(/^82/) - FJ)
  const C = r(FF + FG + FH + FI + FJ)
  const capital = -mvt(/^10[1-5789]/)
  const FK = Math.max(0, capital)
  const FL = credits(/^14/)
  const FM = Math.min(0, capital)
  const FN = Math.min(0, -mvt(/^1[123]/))
  const D = r(FK + FL + FM + FN)
  const FO = credits(/^16/)
  const FP = credits(/^17/)
  const FQ = -debits(/^1[67]/)
  const E = r(FO + FP + FQ)
  const F = r(D + E)
  const G = r(B + C + F)
  const A = tresorerie(an - 1)
  const H = r(A + G)

  const ligneFlux = (ref: string, libelle: string, valeur: number, total = false) => ({ ref, libelle, valeur: r(valeur), total })
  const flux = [
    ligneFlux("ZA", "Trésorerie nette au 1er janvier (A)", A, true),
    ligneFlux("FA", "Capacité d'autofinancement globale (CAFG)", cafg),
    ligneFlux("FB", "Variation de l'actif circulant HAO", FB),
    ligneFlux("FC", "Variation des stocks", FC),
    ligneFlux("FD", "Variation des créances", FD),
    ligneFlux("FE", "Variation du passif circulant", FE),
    ligneFlux("ZB", "Flux de trésorerie provenant des activités opérationnelles (B)", B, true),
    ligneFlux("FF", "Décaissements liés aux acquisitions d'immobilisations incorporelles", FF),
    ligneFlux("FG", "Décaissements liés aux acquisitions d'immobilisations corporelles", FG),
    ligneFlux("FH", "Décaissements liés aux acquisitions d'immobilisations financières", FH),
    ligneFlux("FI", "Encaissements liés aux cessions d'immobilisations incorporelles et corporelles", FI),
    ligneFlux("FJ", "Encaissements liés aux cessions d'immobilisations financières", FJ),
    ligneFlux("ZC", "Flux de trésorerie provenant des activités d'investissement (C)", C, true),
    ligneFlux("FK", "Augmentations de capital par apports nouveaux", FK),
    ligneFlux("FL", "Subventions d'investissement reçues", FL),
    ligneFlux("FM", "Prélèvements sur le capital", FM),
    ligneFlux("FN", "Dividendes versés", FN),
    ligneFlux("ZD", "Flux de trésorerie provenant des capitaux propres (D)", D, true),
    ligneFlux("FO", "Emprunts", FO),
    ligneFlux("FP", "Autres dettes financières", FP),
    ligneFlux("FQ", "Remboursements des emprunts et autres dettes financières", FQ),
    ligneFlux("ZE", "Flux de trésorerie provenant des capitaux étrangers (E)", E, true),
    ligneFlux("ZF", "Flux de trésorerie provenant des activités de financement (F = D + E)", F, true),
    ligneFlux("ZG", "VARIATION DE LA TRÉSORERIE NETTE DE LA PÉRIODE (G = B + C + F)", G, true),
    ligneFlux("ZH", "Trésorerie nette au 31 décembre (H = G + A)", H, true),
  ]

  // Etat des variations des capitaux propres
  const colonnes = [
    { cle: "capital", libelle: "Capital", refs: ["CA", "CB"] },
    { cle: "primes", libelle: "Primes", refs: ["CC"] },
    { cle: "ecarts", libelle: "Écarts de réévaluation", refs: ["CD"] },
    { cle: "reserves", libelle: "Réserves", refs: ["CE", "CF"] },
    { cle: "ran", libelle: "Report à nouveau", refs: ["CG"] },
    { cle: "resultat", libelle: "Résultat net", refs: ["CH"] },
    { cle: "subventions", libelle: "Subventions d'inv.", refs: ["CJ"] },
    { cle: "provisions", libelle: "Prov. réglementées", refs: ["CK"] },
  ] as const
  const compose = (v: Record<string, number>) => colonnes.map((c) => r(c.refs.reduce((t, ref) => t + v[ref], 0)))
  const ouverture = compose(pOu)
  const cloture = compose(pCl)
  const iRes = colonnes.findIndex((c) => c.cle === "resultat")
  const iRan = colonnes.findIndex((c) => c.cle === "ran")
  const affectation = colonnes.map((_, i) => (i === iRes ? -ouverture[i] : i === iRan ? ouverture[iRes] : 0))
  const variationCapital = colonnes.map((c, i) => (c.cle === "capital" || c.cle === "primes" ? r(cloture[i] - ouverture[i]) : 0))
  const resultatN = colonnes.map((_, i) => (i === iRes ? cloture[i] : 0))
  const autres = colonnes.map((_, i) => r(cloture[i] - ouverture[i] - affectation[i] - variationCapital[i] - resultatN[i]))
  const somme = (t: number[]) => r(t.reduce((a, b) => a + b, 0))
  const variations = {
    colonnes: colonnes.map((c) => c.libelle),
    lignes: [
      { libelle: `Solde au 31 décembre ${an - 1}`, valeurs: ouverture, total: true },
      { libelle: `Affectation du résultat de ${an - 1} en report à nouveau`, valeurs: affectation, total: false },
      { libelle: "Augmentations ou réductions de capital et primes", valeurs: variationCapital, total: false },
      { libelle: `Résultat net de l'exercice ${an}`, valeurs: resultatN, total: false },
      { libelle: "Dividendes, subventions et autres mouvements", valeurs: autres, total: false },
      { libelle: `Solde au 31 décembre ${an}`, valeurs: cloture, total: true },
    ].map((l) => ({ ...l, ensemble: somme(l.valeurs) })),
  }

  const nonClasses = [...new Set([...cl.nonClasses, ...crN.nonClasses])].sort()
  const controles = {
    bilanEquilibre: Math.abs(aCl.BZ.brut - aCl.BZ.amort - pCl.DZ) < 1,
    fluxRapproches: Math.abs(tresorerie(an) - H) < 1,
    nonClasses,
  }

  return { exercice: an, actif, passif, resultat, flux, variations, controles }
}
