import { redirect } from "next/navigation"
import { getSession, STAFF } from "@/lib/auth"
import { FONTS_PORTAIL } from "@/lib/fonts-portail"
import { StaffShell } from "./staff-shell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Double controle (le middleware filtre deja) : les pages serveur lisent Prisma directement
  const session = await getSession()
  if (!session) redirect("/gestion/connexion")
  if (!STAFF.includes(session.user.role)) redirect("/espace")
  return (
    <div className={`portail ${FONTS_PORTAIL}`}>
      <StaffShell admin={session.user.role === "ADMIN"} utilisateur={session.user.name ?? session.user.email ?? ""}>
        {children}
      </StaffShell>
    </div>
  )
}
