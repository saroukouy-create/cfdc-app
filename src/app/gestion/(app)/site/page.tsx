import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { PageHeader } from "@/components/layout/app-shell"
import { LIVRES } from "@/lib/site-content"
import { contactSaisi, servicesSite } from "@/lib/site-db"
import { EditeurSite } from "@/components/site-admin/editeur-site"

export const metadata: Metadata = { title: "Site web" }
export const dynamic = "force-dynamic"

export default async function SiteAdminPage() {
  const session = await getSession()
  if (session?.user.role !== "ADMIN") redirect("/gestion")

  const [contact, services, livres] = await Promise.all([
    contactSaisi(),
    servicesSite(),
    prisma.livreSite.findMany({ orderBy: [{ ordre: "asc" }, { createdAt: "asc" }] }),
  ])

  return (
    <>
      <PageHeader titre="Site web" description="Modifiez les coordonnées, les services et la vente de livres du site public">
        <a href="/" target="_blank" className="text-sm font-medium text-primary hover:underline">
          Voir le site
        </a>
      </PageHeader>
      <EditeurSite
        contact={contact}
        services={services.map((s) => ({ slug: s.slug, titre: s.titre, accroche: s.accroche, prestations: s.prestations }))}
        livres={livres.map((l) => ({ id: l.id, titre: l.titre, description: l.description, prix: l.prix, image: l.image, alt: l.alt, visible: l.visible, ordre: l.ordre }))}
        livresParDefaut={LIVRES.map((l, i) => ({ titre: l.titre, description: l.description, prix: null, image: l.image, alt: l.alt, visible: true, ordre: i }))}
      />
    </>
  )
}
