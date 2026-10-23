"use client"

import { Building2, FileCheck2, Home } from "lucide-react"
import { AppShell, type NavItem } from "@/components/layout/app-shell"

const NAV: NavItem[] = [
  { href: "/espace", label: "Mon espace", icon: Home },
  { href: "/espace/dossiers", label: "Mes dossiers", icon: Building2 },
  { href: "/espace/demandes", label: "Mes demandes", icon: FileCheck2 },
]

export function ClientShell({ utilisateur, children }: { utilisateur: string; children: React.ReactNode }) {
  return (
    <AppShell nav={NAV} utilisateur={utilisateur}>
      {children}
    </AppShell>
  )
}
