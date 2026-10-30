"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import type { LucideIcon } from "lucide-react"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type NavItem = { href: string; label: string; icon: LucideIcon }

function Initiales({ nom }: { nom: string }) {
  const t = nom
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0]!.toUpperCase())
    .join("")
  return (
    <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
      {t || "?"}
    </span>
  )
}

export function AppShell({
  nav,
  utilisateur,
  connexion,
  children,
}: {
  nav: NavItem[]
  utilisateur: string
  /** Page de connexion du portail, ou l'on revient apres deconnexion */
  connexion: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Entree active = la plus precise qui correspond (sinon "/gestion" serait active sur toutes les sous-pages)
  const actifHref = nav
    .map((n) => n.href)
    .filter((h) => pathname === h || pathname.startsWith(`${h}/`))
    .sort((a, b) => b.length - a.length)[0]
  const deconnexion = () => signOut({ callbackUrl: connexion })
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-sidebar-border bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-4 py-2 lg:px-5 lg:py-5">
          {/* Pastille claire : le logo noir disparaitrait sur le fond sombre */}
          <Link href={nav[0]?.href ?? "/"} aria-label="CFDC, accueil du portail" className="rounded-lg bg-white px-2.5 py-1.5">
            <Image src="/images/logo-cfdc.png" alt="Cabinet CFDC" width={336} height={210} priority className="h-8 w-auto lg:h-9" />
          </Link>
          {/* Mobile et tablette portrait : deconnexion sur la ligne du logo */}
          <Button variant="ghost" size="sm" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden" onClick={deconnexion}>
            <LogOut aria-hidden /> Déconnexion
          </Button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3" aria-label="Navigation principale">
          {nav.map(({ href, label, icon: Icon }) => {
            const actif = href === actifHref
            return (
              <Link
                key={href}
                href={href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "nav-lien flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap",
                  actif ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden border-t border-sidebar-border p-3 lg:block">
          <div className="flex items-center gap-2.5 px-1 pb-2">
            <Initiales nom={utilisateur} />
            <p className="truncate text-sm text-sidebar-foreground/90">{utilisateur}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={deconnexion}>
            <LogOut aria-hidden /> Déconnexion
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <main id="contenu" tabIndex={-1} className="mx-auto max-w-6xl p-4 outline-none md:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}

export function PageHeader({ titre, description, children }: { titre: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-[1.75rem]">{titre}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}
