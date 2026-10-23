"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { NAV_SITE } from "@/lib/site-content"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function SiteHeader() {
  const pathname = usePathname()
  const [ouvert, setOuvert] = useState(false)
  // Referme le menu mobile a chaque changement de page
  useEffect(() => setOuvert(false), [pathname])

  const actif = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
        <Link href="/" className="entree-logo shrink-0" aria-label="CFDC, accueil">
          <Image src="/images/logo-cfdc.png" alt="Cabinet CFDC" width={336} height={210} priority className="vol h-12 w-auto md:h-14" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation du site">
          {NAV_SITE.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={actif(l.href) ? "page" : undefined}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-marque after:transition-transform after:duration-300",
                actif(l.href) && "text-primary after:scale-x-100",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "hidden sm:inline-flex")}>
            Espace client
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-muted md:hidden"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOuvert((o) => !o)}
          >
            {ouvert ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      {ouvert && (
        <nav id="menu-mobile" className="entree-page border-t bg-background px-4 pb-4 md:hidden" aria-label="Navigation du site">
          {NAV_SITE.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={actif(l.href) ? "page" : undefined}
              className={cn("block border-b py-3 font-medium", actif(l.href) && "text-primary")}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full")}>
            Espace client / collaborateur
          </Link>
        </nav>
      )}
    </header>
  )
}
