"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TYPE_SERVICE } from "@/lib/constants"
import { appelApi } from "@/lib/api-client"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

/** Nouvelle demande d'attestation / de service. Sans `clients`, la demande est pour le client connecte. */
export function DemandeForm({ clients }: { clients?: { id: string; raisonSociale: string }[] }) {
  const router = useRouter()
  const [envoi, setEnvoi] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setEnvoi(true)
    const ok = await appelApi("/api/demandes", { method: "POST", body: Object.fromEntries(new FormData(form)) })
    setEnvoi(false)
    if (!ok) return
    toast.success("Demande enregistrée")
    form.reset()
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {clients && (
        <FormField id="demande-client" label="Client">
          <NativeSelect id="demande-client" name="clientId" required defaultValue="">
            <option value="" disabled>
              — Choisir —
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.raisonSociale}
              </option>
            ))}
          </NativeSelect>
        </FormField>
      )}
      <FormField id="demande-type" label="Document ou service">
        <NativeSelect id="demande-type" name="type" required defaultValue="">
          <option value="" disabled>
            — Choisir —
          </option>
          {Object.entries(TYPE_SERVICE).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </NativeSelect>
      </FormField>
      <FormField id="demande-description" label="Précisions (facultatif)">
        <Textarea id="demande-description" name="description" rows={3} placeholder="Période, organisme destinataire, urgence…" />
      </FormField>
      <Button type="submit" disabled={envoi} className="w-fit">
        {envoi ? "Envoi…" : "Envoyer la demande"}
      </Button>
    </form>
  )
}
