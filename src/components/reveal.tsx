"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Apparition au defilement : ajoute data-visible quand l'element entre dans l'ecran.
 * `delai` (ms) decale les cartes d'une meme rangee ; l'animation elle-meme est en CSS (.reveal).
 */
export function Reveal({
  delai = 0,
  className,
  children,
  as: Tag = "div",
}: {
  delai?: number
  className?: string
  children: React.ReactNode
  as?: "div" | "article" | "li" | "section"
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          el.dataset.visible = ""
          obs.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <Tag ref={ref as never} className={cn("reveal", className)} style={{ "--delai": `${delai}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  )
}
