"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Upload } from "lucide-react"
import { appelApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EXEMPLE = "date;journal;piece;compte;libelle;debit;credit\n05/01/2026;BANQUE;B001;521;Apport en capital;1000000;\n05/01/2026;BANQUE;B001;101;Apport en capital;;1000000\n"

export function ImportCsv({ clientId }: { clientId: string }) {
  const router = useRouter()
  const [envoi, setEnvoi] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const body = new FormData(form)
    body.set("clientId", clientId)
    setEnvoi(true)
    const res = await appelApi<{ importees: number }>("/api/ecritures/import", { method: "POST", body })
    setEnvoi(false)
    if (!res) return
    toast.success(`${res.importees} écritures importées`)
    form.reset()
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="fichier">Fichier CSV des écritures</Label>
        <Input id="fichier" name="fichier" type="file" accept=".csv,text/csv" required />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="remplacer" className="size-4 accent-primary" /> Remplacer les écritures existantes
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={envoi}>
          <Upload aria-hidden /> {envoi ? "Import…" : "Importer"}
        </Button>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(EXEMPLE)}`}
          download="modele-ecritures.csv"
          className="text-sm text-primary hover:underline"
        >
          Télécharger le modèle
        </a>
      </div>
      <p className="text-xs text-muted-foreground">
        Colonnes : date ; journal (ACHATS, VENTES, CAISSE, BANQUE, OD) ; pièce ; compte SYSCOHADA ; libellé ; débit ; crédit.
        Les écritures d&apos;inventaire et de régularisation se saisissent au journal OD.
      </p>
    </form>
  )
}
