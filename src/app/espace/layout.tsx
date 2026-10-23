import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { ClientShell } from "./client-shell"

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/connexion")
  if (session.user.role !== "CLIENT") redirect("/gestion")
  return <ClientShell utilisateur={session.user.name ?? session.user.email ?? ""}>{children}</ClientShell>
}
