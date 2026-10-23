"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { STATUT_CONTACT } from "@/lib/constants"
import { appelApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

export function ProspectStatut({ prospect }: { prospect: { id: string; statut: string; note: string | null; titre: string } }) {
  const router = useRouter()
  const [ouvert, setOuvert] = useState(false)
  const [envoi, setEnvoi] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnvoi(true)
    const ok = await appelApi(`/api/prospects/${prospect.id}`, { method: "PATCH", body: Object.fromEntries(new FormData(e.currentTarget)) })
    setEnvoi(false)
    if (!ok) return
    toast.success("Demande mise à jour")
    setOuvert(false)
    router.refresh()
  }

  return (
    <Dialog open={ouvert} onOpenChange={setOuvert}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Suivre</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{prospect.titre}</DialogTitle>
          <DialogDescription>Note interne, non visible par le demandeur.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`p-statut-${prospect.id}`}>Statut</Label>
            <NativeSelect id={`p-statut-${prospect.id}`} name="statut" defaultValue={prospect.statut}>
              {Object.entries(STATUT_CONTACT).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`p-note-${prospect.id}`}>Note</Label>
            <Textarea id={`p-note-${prospect.id}`} name="note" rows={3} defaultValue={prospect.note ?? ""} placeholder="Rappelé le…, devis envoyé…" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={envoi}>
              {envoi ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
