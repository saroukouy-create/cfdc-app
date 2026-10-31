"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { appelApi } from "@/lib/api-client"
import { PLATEFORME_DEMARCHE, STATUT_DEMARCHE } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

type Client = { id: string; raisonSociale: string }
export type LigneRegistre = {
  id: string
  client: string
  plateforme: string
  objet: string
  reference: string | null
  montant: number | null
  statut: string
  date: string
}

const Champ = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="grid gap-1.5 text-sm font-medium">
    {label}
    {children}
  </label>
)

const aujourdhui = () => new Date().toISOString().slice(0, 10)

/** Formulaire d'enregistrement et tableau des dernieres demarches, dans l'espace de gestion. */
export function RegistreDemarches({ clients, lignes }: { clients: Client[]; lignes: LigneRegistre[] }) {
  const router = useRouter()
  const vide = { clientId: clients[0]?.id ?? "", plateforme: "E_MECEF", objet: "", reference: "", montant: "", statut: "TERMINEE", dateDemarche: aujourdhui(), note: "" }
  const [v, setV] = useState(vide)
  const [envoi, setEnvoi] = useState(false)
  const maj = (k: keyof typeof vide) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value })

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault()
    setEnvoi(true)
    const montant = v.montant.trim() === "" ? null : Number(v.montant.replace(/\s/g, "").replace(",", "."))
    if (montant !== null && Number.isNaN(montant)) {
      toast.error("Montant invalide")
      return setEnvoi(false)
    }
    if (await appelApi("/api/demarches", { method: "POST", body: { ...v, montant } })) {
      toast.success("Démarche enregistrée dans le compte du client")
      setV({ ...vide, clientId: v.clientId, plateforme: v.plateforme })
      router.refresh()
    }
    setEnvoi(false)
  }
  async function changerStatut(id: string, statut: string) {
    if (await appelApi(`/api/demarches/${id}`, { method: "PATCH", body: { statut } })) router.refresh()
  }
  async function supprimer(id: string) {
    if (!confirm("Supprimer cette démarche du compte du client ?")) return
    if (await appelApi(`/api/demarches/${id}`, { method: "DELETE" })) {
      toast.success("Démarche supprimée")
      router.refresh()
    }
  }

  if (clients.length === 0) return <p className="text-sm text-muted-foreground">Créez d&apos;abord une fiche client pour enregistrer une démarche.</p>
  return (
    <div className="grid gap-6">
      <form onSubmit={enregistrer} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Champ label="Client">
          <NativeSelect value={v.clientId} onChange={maj("clientId")} required>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.raisonSociale}
              </option>
            ))}
          </NativeSelect>
        </Champ>
        <Champ label="Plateforme">
          <NativeSelect value={v.plateforme} onChange={maj("plateforme")}>
            {Object.entries(PLATEFORME_DEMARCHE).map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </NativeSelect>
        </Champ>
        <Champ label="Objet de la démarche">
          <Input value={v.objet} onChange={maj("objet")} placeholder="Facture normalisée, déclaration TVA..." required />
        </Champ>
        <Champ label="Référence (n° de facture, de dossier, de paiement)">
          <Input value={v.reference} onChange={maj("reference")} />
        </Champ>
        <Champ label="Montant (FCFA, facultatif)">
          <Input inputMode="decimal" value={v.montant} onChange={maj("montant")} />
        </Champ>
        <Champ label="Date">
          <Input type="date" value={v.dateDemarche} onChange={maj("dateDemarche")} required />
        </Champ>
        <Champ label="Statut">
          <NativeSelect value={v.statut} onChange={maj("statut")}>
            {Object.entries(STATUT_DEMARCHE).map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </NativeSelect>
        </Champ>
        <div className="sm:col-span-2">
          <Champ label="Note visible par le client (facultatif)">
            <Textarea value={v.note} onChange={maj("note")} rows={2} />
          </Champ>
        </div>
        <Button type="submit" disabled={envoi} className="w-fit self-end">
          {envoi ? "Enregistrement…" : "Enregistrer dans le compte du client"}
        </Button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-3">Date</th>
              <th className="pr-3">Client</th>
              <th className="pr-3">Plateforme</th>
              <th className="pr-3">Objet</th>
              <th className="pr-3">Référence</th>
              <th className="pr-3 text-right">Montant</th>
              <th className="pr-3">Statut</th>
              <th className="sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lignes.length === 0 && (
              <tr>
                <td colSpan={8} className="py-4 text-muted-foreground">
                  Aucune démarche enregistrée pour l&apos;instant.
                </td>
              </tr>
            )}
            {lignes.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="py-2 pr-3 whitespace-nowrap">{l.date}</td>
                <td className="pr-3">{l.client}</td>
                <td className="pr-3">{PLATEFORME_DEMARCHE[l.plateforme]}</td>
                <td className="pr-3">{l.objet}</td>
                <td className="pr-3 font-mono text-xs">{l.reference ?? "—"}</td>
                <td className="pr-3 text-right tabular-nums">{l.montant != null ? `${new Intl.NumberFormat("fr-FR").format(l.montant)} FCFA` : "—"}</td>
                <td className="pr-3">
                  <NativeSelect value={l.statut} onChange={(e) => changerStatut(l.id, e.target.value)} aria-label={`Statut de la démarche ${l.objet}`}>
                    {Object.entries(STATUT_DEMARCHE).map(([k, lib]) => (
                      <option key={k} value={k}>
                        {lib}
                      </option>
                    ))}
                  </NativeSelect>
                </td>
                <td>
                  <Button variant="ghost" size="icon" onClick={() => supprimer(l.id)} aria-label={`Supprimer la démarche ${l.objet}`}>
                    <Trash2 aria-hidden />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
