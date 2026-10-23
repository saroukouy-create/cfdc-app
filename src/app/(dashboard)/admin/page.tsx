import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { PageHeader } from "@/components/layout/app-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserForm } from "@/components/admin/user-form"
import { ROLES } from "@/lib/constants"
import { formatDate } from "@/lib/format"

export const metadata: Metadata = { title: "Administration" }

export default async function AdminPage() {
  const session = await getSession()
  if (session?.user.role !== "ADMIN") redirect("/dashboard")

  const [equipe, stats] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "CONSEILLER"] } },
      select: { id: true, prenom: true, nom: true, email: true, role: true, createdAt: true },
      orderBy: { nom: "asc" },
    }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
  ])

  return (
    <>
      <PageHeader titre="Administration" description="Comptes de l'équipe CFDC">
        {stats.map((s) => (
          <Badge key={s.role} variant="outline">
            {ROLES[s.role]} : {s._count}
          </Badge>
        ))}
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 rounded-xl border lg:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="hidden md:table-cell">Depuis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipe.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.prenom} {u.nom}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{ROLES[u.role]}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(u.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Nouveau collaborateur</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
