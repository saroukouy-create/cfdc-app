import type { Metadata } from "next"
import { PageHeader } from "@/components/layout/app-shell"
import { ClientForm } from "@/components/clients/client-form"

export const metadata: Metadata = { title: "Nouveau client" }

export default function NouveauClientPage() {
  return (
    <>
      <PageHeader titre="Nouveau client" description="La fiche crée aussi l'accès du client à son espace en ligne." />
      <ClientForm />
    </>
  )
}
