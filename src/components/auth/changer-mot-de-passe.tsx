"use client"

import { useState } from "react"
import { toast } from "sonner"
import { appelApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"

export function ChangerMotDePasse() {
  const [v, setV] = useState({ actuel: "", nouveau: "", confirmation: "" })
  const [envoi, setEnvoi] = useState(false)
  const maj = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value })

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault()
    setEnvoi(true)
    if (await appelApi("/api/compte/mot-de-passe", { method: "PUT", body: v })) {
      toast.success("Mot de passe modifié")
      setV({ actuel: "", nouveau: "", confirmation: "" })
    }
    setEnvoi(false)
  }

  return (
    <form onSubmit={enregistrer} className="grid max-w-md gap-4">
      <label className="grid gap-1.5 text-sm font-medium">
        Mot de passe actuel
        <PasswordInput autoComplete="current-password" value={v.actuel} onChange={maj("actuel")} required />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Nouveau mot de passe (8 caractères minimum)
        <PasswordInput autoComplete="new-password" value={v.nouveau} onChange={maj("nouveau")} required minLength={8} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Confirmer le nouveau mot de passe
        <PasswordInput autoComplete="new-password" value={v.confirmation} onChange={maj("confirmation")} required minLength={8} />
      </label>
      <Button type="submit" disabled={envoi} className="w-fit">
        {envoi ? "Enregistrement…" : "Changer le mot de passe"}
      </Button>
    </form>
  )
}
