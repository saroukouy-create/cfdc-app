"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { appelApi } from "@/lib/api-client"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

/** Espace client : demande de devis ou inscription a une formation (coordonnees prises dans le compte). */
export function DevisForm({
  services,
  formations,
  type: typeInitial = "DEVIS",
  sujet,
}: {
  services: string[]
  formations: string[]
  type?: "DEVIS" | "FORMATION"
  sujet?: string
}) {
  const router = useRouter()
  const [type, setType] = useState(typeInitial)
  const [envoi, setEnvoi] = useState(false)
  const sujets = type === "FORMATION" ? formations : services

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setEnvoi(true)
    const ok = await appelApi("/api/contact", { method: "POST", body: Object.fromEntries(new FormData(form)) })
    setEnvoi(false)
    if (!ok) return
    toast.success(type === "FORMATION" ? "Inscription envoyée" : "Demande de devis envoyée")
    form.reset()
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <FormField id="devis-type" label="Type de demande">
        <NativeSelect id="devis-type" name="type" value={type} onChange={(e) => setType(e.target.value as "DEVIS" | "FORMATION")}>
          <option value="DEVIS">Demande de devis</option>
          <option value="FORMATION">Inscription à une formation</option>
        </NativeSelect>
      </FormField>
      <FormField id="devis-sujet" label={type === "FORMATION" ? "Formation" : "Service"}>
        {/* key : reinitialise la selection quand le type change */}
        <NativeSelect key={type} id="devis-sujet" name="sujet" required defaultValue={sujets.includes(sujet ?? "") ? sujet : ""}>
          <option value="" disabled>
            — Choisir —
          </option>
          {sujets.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </NativeSelect>
      </FormField>
      <FormField id="devis-message" label="Votre besoin">
        <Textarea id="devis-message" name="message" rows={4} maxLength={3000} placeholder="Décrivez votre projet, vos délais, vos questions…" />
      </FormField>
      <Button type="submit" disabled={envoi} className="w-fit">
        {envoi ? "Envoi…" : "Envoyer la demande"}
      </Button>
    </form>
  )
}
