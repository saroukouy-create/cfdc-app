import Link from "next/link"
import { LogIn, UserPlus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

/**
 * Appel a l'action du site public : toute demande se fait depuis l'espace client.
 * Un visiteur non connecte passe par la connexion (le middleware l'y envoie) ou par l'inscription,
 * puis revient directement sur le formulaire prerempli.
 */
export function DemandeCTA({ type = "DEVIS", sujet, titre, texte }: { type?: "DEVIS" | "FORMATION"; sujet?: string; titre: string; texte: string }) {
  const cible = `/espace/demandes?type=${type}${sujet ? `&sujet=${encodeURIComponent(sujet)}` : ""}#devis`
  return (
    <div className="rounded-3xl border bg-card p-6 md:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{titre}</h2>
      <p className="mt-3 text-muted-foreground">{texte}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={cible} className={buttonVariants({ size: "lg" })}>
          <LogIn aria-hidden /> Faire ma demande
        </Link>
        <Link href={`/inscription?callbackUrl=${encodeURIComponent(cible)}`} className={buttonVariants({ size: "lg", variant: "outline" })}>
          <UserPlus aria-hidden /> Créer mon espace client
        </Link>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Gratuit et sans engagement. Votre espace vous permet ensuite de suivre la demande, vos dossiers et vos documents.
      </p>
    </div>
  )
}
