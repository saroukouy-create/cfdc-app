import type { Metadata } from "next"
import Link from "next/link"
import { Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/layout/app-shell"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = { title: "Clients" }

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q?.trim() ?? ""
  const clients = await prisma.client.findMany({
    where: q
      ? { OR: [{ raisonSociale: { contains: q } }, { secteurActivite: { contains: q } }, { user: { email: { contains: q } } }] }
      : undefined,
    include: { user: { select: { email: true } }, _count: { select: { dossiers: true } } },
    orderBy: { raisonSociale: "asc" },
  })

  return (
    <>
      <PageHeader titre="Clients" description={`${clients.length} client${clients.length > 1 ? "s" : ""}`}>
        <Link href="/clients/nouveau" className={buttonVariants()}>
          Nouveau client
        </Link>
      </PageHeader>

      <form className="mb-4 flex max-w-md gap-2" role="search">
        <Input name="q" defaultValue={q} placeholder="Raison sociale, secteur, email…" aria-label="Rechercher un client" />
        <button type="submit" className={buttonVariants({ variant: "outline" })}>
          <Search aria-hidden /> Rechercher
        </button>
      </form>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Raison sociale</TableHead>
              <TableHead>Forme juridique</TableHead>
              <TableHead className="hidden md:table-cell">Secteur</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  {q ? "Aucun client ne correspond à la recherche." : "Aucun client pour l'instant."}
                </TableCell>
              </TableRow>
            )}
            {clients.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.raisonSociale}</TableCell>
                <TableCell>{c.formeJuridique ?? "—"}</TableCell>
                <TableCell className="hidden md:table-cell">{c.secteurActivite ?? "—"}</TableCell>
                <TableCell className="hidden md:table-cell">{c.user.email}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/clients/${c.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                    Ouvrir
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
