"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

/** Compte de 0 a `valeur` en 700 ms ; affiche directement la valeur si l'utilisateur reduit les animations. */
function Compteur({ valeur }: { valeur: number }) {
  const [affiche, setAffiche] = useState(valeur)
  const premier = useRef(true)
  useEffect(() => {
    if (!premier.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches || valeur === 0) return
    premier.current = false
    const debut = performance.now()
    let id = 0
    const pas = (t: number) => {
      const p = Math.min(1, (t - debut) / 700)
      setAffiche(Math.round(valeur * (1 - Math.pow(1 - p, 3))))
      if (p < 1) id = requestAnimationFrame(pas)
    }
    setAffiche(0)
    id = requestAnimationFrame(pas)
    return () => cancelAnimationFrame(id)
  }, [valeur])
  return <span aria-label={String(valeur)}>{affiche}</span>
}

/** Carte chiffre cliquable du tableau de bord : icone, libelle, valeur animee. */
export function StatCarte({ label, valeur, href, icone }: { label: string; valeur: number; href: string; icone: React.ReactNode }) {
  return (
    <Link href={href} className="stat-carte group flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icone}
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
      </div>
      <div>
        <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
          <Compteur valeur={valeur} />
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </Link>
  )
}
