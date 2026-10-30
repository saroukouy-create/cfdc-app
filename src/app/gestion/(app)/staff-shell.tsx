"use client"

import { BarChart3, Building2, FileCheck2, Globe, Inbox, KeyRound, LayoutDashboard, Settings, Users } from "lucide-react"
import { AppShell, type NavItem } from "@/components/layout/app-shell"

// Les icones (fonctions) ne peuvent pas passer d'un composant serveur a un composant client : nav definie ici
const NAV: NavItem[] = [
  { href: "/gestion", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/gestion/clients", label: "Clients", icon: Users },
  { href: "/gestion/creation-entreprise", label: "Création d'entreprise", icon: Building2 },
  { href: "/gestion/comptabilite", label: "Comptabilité", icon: BarChart3 },
  { href: "/gestion/attestations", label: "Attestations & services", icon: FileCheck2 },
  { href: "/gestion/prospects", label: "Demandes de devis", icon: Inbox },
]

export function StaffShell({ admin, utilisateur, children }: { admin: boolean; utilisateur: string; children: React.ReactNode }) {
  const compte = { href: "/gestion/compte", label: "Mon compte", icon: KeyRound }
  const nav = admin
    ? [...NAV, { href: "/gestion/site", label: "Site web", icon: Globe }, { href: "/gestion/admin", label: "Administration", icon: Settings }, compte]
    : [...NAV, compte]
  return (
    <AppShell nav={nav} utilisateur={utilisateur} connexion="/gestion/connexion">
      {children}
    </AppShell>
  )
}
