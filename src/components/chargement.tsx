/** Squelette de page affiche pendant le chargement d'un ecran (loading.tsx). Garde la mise en page : pas de saut. */
export function Chargement() {
  return (
    <div role="status" aria-busy="true" className="animate-pulse">
      <span className="sr-only">Chargement…</span>
      <div className="mb-6 space-y-2" aria-hidden>
        <div className="h-7 w-56 rounded-md bg-muted" />
        <div className="h-4 w-80 max-w-full rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="mt-6 h-64 rounded-xl bg-muted" aria-hidden />
    </div>
  )
}
