import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { NAV_SITE, SERVICES } from "@/lib/site-content"
import { CONTACT, HORAIRES } from "@/lib/constants"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="titres-serif flex min-h-dvh flex-col overflow-x-clip bg-background">
      <SiteHeader />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">{children}</main>

      <footer className="border-t bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
          <div>
            {/* Logo sur pastille claire : l'aigle noir disparaitrait sur le fond sombre */}
            <span className="inline-block rounded-xl bg-background p-2">
              <Image src="/images/logo-cfdc.png" alt="Cabinet CFDC" width={336} height={210} className="h-12 w-auto" />
            </span>
            <p className="mt-4 text-sm text-background/70">
              Bien plus qu&apos;un simple bureau d&apos;études : un véritable partenaire de confiance pour votre réussite.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold">Le cabinet</h2>
            <ul className="space-y-2 text-sm text-background/70">
              {NAV_SITE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-background">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold">Nos services</h2>
            <ul className="space-y-2 text-sm text-background/70">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-background">
                    {s.titre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold">Horaires</h2>
            <ul className="space-y-1 text-sm text-background/70">
              <li>Lundi – vendredi : {HORAIRES[1].ouverture?.replace(":", "H")} — {HORAIRES[1].fermeture?.replace(":", "H")}</li>
              <li>Samedi : {HORAIRES[6].ouverture?.replace(":", "H")} — {HORAIRES[6].fermeture?.replace(":", "H")}</li>
              <li>Dimanche : fermé</li>
            </ul>
            <h2 className="mt-6 mb-3 text-sm font-semibold">Nous joindre</h2>
            <ul className="space-y-1 text-sm text-background/70">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-background hover:underline">
                  {CONTACT.email}
                </a>
              </li>
              {CONTACT.telephones.map((t) => (
                <li key={t.lien}>
                  <a href={`tel:${t.lien}`} className="hover:text-background hover:underline">
                    {t.affichage}
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="mt-4 inline-block text-sm font-medium text-background underline-offset-4 hover:underline">
              Demander un devis gratuit →
            </Link>
          </div>
        </div>
        <p className="border-t border-background/15 py-4 text-center text-xs text-background/60">
          © {new Date().getFullYear()} Cabinet CFDC · Bureau d&apos;études pluridisciplinaire ·{" "}
          <Link href="/gestion/connexion" className="hover:text-background hover:underline">
            Accès équipe
          </Link>
        </p>
      </footer>
    </div>
  )
}
