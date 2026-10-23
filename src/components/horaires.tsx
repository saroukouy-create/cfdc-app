"use client"

import { useEffect, useState } from "react"
import { HORAIRES } from "@/lib/constants"

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

// Heure du Benin (UTC+1, sans heure d'ete), quel que soit le fuseau du visiteur
function maintenantBenin() {
  const d = new Date(Date.now() + 60 * 60 * 1000)
  return { jour: d.getUTCDay(), min: d.getUTCHours() * 60 + d.getUTCMinutes() }
}

function statut() {
  const { jour, min } = maintenantBenin()
  const h = HORAIRES[jour]
  if (h.ouverture && h.fermeture && min >= minutes(h.ouverture) && min < minutes(h.fermeture)) {
    const reste = minutes(h.fermeture) - min
    return { ouvert: true, texte: reste <= 60 ? `Ouvert · ferme dans ${reste} min` : `Ouvert · jusqu'à ${h.fermeture.replace(":", "H")}` }
  }
  return { ouvert: false, texte: "Fermé actuellement" }
}

export function Horaires() {
  // Calcule apres montage : la page est statique, l'heure doit etre celle de la visite
  const [etat, setEtat] = useState<{ ouvert: boolean; texte: string; jour: number } | null>(null)
  useEffect(() => {
    const maj = () => setEtat({ ...statut(), jour: maintenantBenin().jour })
    maj()
    const t = setInterval(maj, 60_000)
    return () => clearInterval(t)
  }, [])

  // Lundi en premier, dimanche en dernier
  const ordre = [...HORAIRES.slice(1), HORAIRES[0]]
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-medium" aria-live="polite">
        <span className={`size-2 rounded-full ${etat?.ouvert ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
        {etat?.texte ?? "Horaires d'ouverture"}
      </p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
        {ordre.map((h) => {
          const actif = etat && HORAIRES[etat.jour].jour === h.jour
          return (
            <div key={h.jour} className={`contents ${actif ? "font-semibold text-primary" : ""}`}>
              <dt>{h.jour}</dt>
              <dd className="tabular-nums">
                {h.ouverture ? `${h.ouverture.replace(":", "H")} — ${h.fermeture!.replace(":", "H")}` : "Fermé"}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
