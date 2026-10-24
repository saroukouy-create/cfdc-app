"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { z } from "zod"
import { dossierSchema, type DossierInput } from "@/lib/validations"
import { FORMES_JURIDIQUES } from "@/lib/constants"
import { appelApi } from "@/lib/api-client"
import { a11y, FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"

export function DossierForm({ clients, clientId }: { clients: { id: string; raisonSociale: string }[]; clientId?: string }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors: e, isSubmitting },
  } = useForm<DossierInput, unknown, z.output<typeof dossierSchema>>({
    mode: "onTouched", resolver: zodResolver(dossierSchema),
    defaultValues: { clientId: clients.some((c) => c.id === clientId) ? clientId : "" },
  })

  async function onSubmit(data: z.output<typeof dossierSchema>) {
    const dossier = await appelApi<{ id: string }>("/api/dossiers", { method: "POST", body: data })
    if (!dossier) return
    toast.success("Dossier créé")
    router.push(`/gestion/creation-entreprise/${dossier.id}`)
  }

  return (
    <Card className="max-w-2xl">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
          <FormField id="clientId" label="Porteur de projet (client) *" erreur={e.clientId?.message} className="sm:col-span-2">
            <NativeSelect {...register("clientId")} {...a11y("clientId", e.clientId?.message)}>
              <option value="">— Choisir —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.raisonSociale}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField id="denomination" label="Dénomination de l'entreprise *" erreur={e.denomination?.message} className="sm:col-span-2">
            <Input {...register("denomination")} {...a11y("denomination", e.denomination?.message)} />
          </FormField>
          <FormField id="activite" label="Activité principale">
            <Input {...register("activite")} id="activite" />
          </FormField>
          <FormField id="formeJuridique" label="Forme juridique envisagée">
            <NativeSelect {...register("formeJuridique")} id="formeJuridique">
              <option value="">— À définir avec le conseiller —</option>
              {FORMES_JURIDIQUES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField id="capital" label="Capital (FCFA)" erreur={e.capital?.message}>
            <Input inputMode="numeric" {...register("capital")} {...a11y("capital", e.capital?.message)} />
          </FormField>
          <FormField id="siege" label="Siège social">
            <Input {...register("siege")} id="siege" />
          </FormField>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création…" : "Créer le dossier"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
