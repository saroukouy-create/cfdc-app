import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { FONTS_PORTAIL } from "@/lib/fonts-portail"
import { ClientShell } from "./client-shell"

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/connexion")
  if (session.user.role !== "CLIENT") redirect("/connexion")
  return (
    <div className={`portail ${FONTS_PORTAIL}`}>
      <ClientShell utilisateur={session.user.name ?? session.user.email ?? ""}>{children}</ClientShell>
    </div>
  )
}
