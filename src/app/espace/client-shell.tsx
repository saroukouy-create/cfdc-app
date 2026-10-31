"use client"

import { Building2, ClipboardList, FileCheck2, Home, KeyRound } from "lucide-react"
import { AppShell, type NavItem } from "@/components/layout/app-shell"

const NAV: NavItem[] = [
  { href: "/espace", label: "Mon espace", icon: Home },
  { href: "/espace/dossiers", label: "Mes dossiers", icon: Building2 },
  { href: "/espace/demandes", label: "Mes demandes", icon: FileCheck2 },
  { href: "/espace/demarches", label: "Mes démarches", icon: ClipboardList },
  { href: "/espace/compte", label: "Mon compte", icon: KeyRound },
]

export function ClientShell({ utilisateur, children }: { utilisateur: string; children: React.ReactNode }) {
  return (
    <AppShell nav={NAV} utilisateur={utilisateur} connexion="/connexion">
      {children}
    </AppShell>
  )
}
