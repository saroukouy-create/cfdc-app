import { redirect } from "next/navigation"
import { getSession, STAFF } from "@/lib/auth"
import { StaffShell } from "./staff-shell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Double controle (le middleware filtre deja) : les pages serveur lisent Prisma directement
  const session = await getSession()
  if (!session) redirect("/login")
  if (!STAFF.includes(session.user.role)) redirect("/espace")
  return (
    <StaffShell admin={session.user.role === "ADMIN"} utilisateur={session.user.name ?? session.user.email ?? ""}>
      {children}
    </StaffShell>
  )
}
