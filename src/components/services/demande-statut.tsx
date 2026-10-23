"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { STATUT_DEMANDE } from "@/lib/constants"
import { appelApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

export function DemandeStatut({ demande }: { demande: { id: string; statut: string; reponse: string | null; titre: string } }) {
  const router = useRouter()
  const [ouvert, setOuvert] = useState(false)
  const [envoi, setEnvoi] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnvoi(true)
    const ok = await appelApi(`/api/demandes/${demande.id}`, { method: "PATCH", body: Object.fromEntries(new FormData(e.currentTarget)) })
    setEnvoi(false)
    if (!ok) return
    toast.success("Demande mise à jour")
    setOuvert(false)
    router.refresh()
  }

  return (
    <Dialog open={ouvert} onOpenChange={setOuvert}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Traiter</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{demande.titre}</DialogTitle>
          <DialogDescription>Le client voit le statut et la réponse dans son espace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor={`statut-${demande.id}`}>Statut</Label>
            <NativeSelect id={`statut-${demande.id}`} name="statut" defaultValue={demande.statut}>
              {Object.entries(STATUT_DEMANDE).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`reponse-${demande.id}`}>Message au client</Label>
            <Textarea id={`reponse-${demande.id}`} name="reponse" rows={3} defaultValue={demande.reponse ?? ""} placeholder="Document prêt au cabinet, pièces manquantes…" />
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
