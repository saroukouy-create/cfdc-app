"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import type { LucideIcon } from "lucide-react"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type NavItem = { href: string; label: string; icon: LucideIcon }

export function AppShell({ nav, utilisateur, children }: { nav: NavItem[]; utilisateur: string; children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b bg-sidebar md:sticky md:top-0 md:flex md:h-dvh md:flex-col md:border-r md:border-b-0">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold text-primary">
            CFDC
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:overflow-visible" aria-label="Navigation principale">
          {nav.map(({ href, label, icon: Icon }) => {
            const actif = pathname === href || pathname.startsWith(`${href}/`)
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
        <div className="hidden border-t p-3 md:block">
          <p className="truncate px-1 pb-2 text-xs text-muted-foreground">{utilisateur}</p>
          <Button variant="ghost" className="w-full justify-start" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut aria-hidden /> Déconnexion
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex justify-end border-b px-4 py-2 md:hidden">
          <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut aria-hidden /> Déconnexion
          </Button>
        </div>
        <main className="mx-auto max-w-6xl p-4 md:p-8">{children}</main>
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
