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
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-4 py-2 lg:py-4">
          <Link href={nav[0]?.href ?? "/"} aria-label="CFDC, accueil du portail">
            <Image src="/images/logo-cfdc.png" alt="Cabinet CFDC" width={336} height={210} priority className="h-10 w-auto lg:h-11" />
          </Link>
          {/* Mobile et tablette portrait : deconnexion sur la ligne du logo */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={deconnexion}>
            <LogOut aria-hidden /> Déconnexion
          </Button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-1 lg:flex-col lg:overflow-visible" aria-label="Navigation principale">
          {nav.map(({ href, label, icon: Icon }) => {
            const actif = href === actifHref
            return (
              <Link
                key={href}
                href={href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors",
                  actif ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden border-t p-3 lg:block">
          <p className="truncate px-1 pb-2 text-xs text-muted-foreground">{utilisateur}</p>
          <Button variant="ghost" className="w-full justify-start" onClick={deconnexion}>
            <LogOut aria-hidden /> Déconnexion
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <main className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export function PageHeader({ titre, description, children }: { titre: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{titre}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}
