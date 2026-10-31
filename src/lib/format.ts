const fcfa = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })

export function formatFCFA(n: number | null | undefined) {
  return n == null ? "—" : `${fcfa.format(n)} FCFA`
}

export function formatDate(d: Date | string | null | undefined) {
  return d ? new Date(d).toLocaleDateString("fr-FR") : "—"
}

export function formatTaille(octets: number) {
  return octets < 1024 * 1024 ? `${Math.round(octets / 1024)} Ko` : `${(octets / 1024 / 1024).toFixed(1)} Mo`
}

export function formatDateHeure(d: Date | string | null | undefined) {
  return d ? new Date(d).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—"
}
