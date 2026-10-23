import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { ClientShell } from "./client-shell"

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/login")
  if (session.user.role !== "CLIENT") redirect("/dashboard")
  return <ClientShell utilisateur={session.user.name ?? session.user.email ?? ""}>{children}</ClientShell>
}
