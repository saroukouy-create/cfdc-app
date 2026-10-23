"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { z } from "zod"
import { clientSchema, type ClientInput } from "@/lib/validations"
import { FORMES_JURIDIQUES } from "@/lib/constants"
import { appelApi } from "@/lib/api-client"
import { a11y, FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"

export function ClientForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientInput, unknown, z.output<typeof clientSchema>>({ resolver: zodResolver(clientSchema) })

  async function onSubmit(data: z.output<typeof clientSchema>) {
    const client = await appelApi<{ id: string }>("/api/clients", { method: "POST", body: data })
    if (!client) return
    toast.success("Client créé")
    router.push(`/gestion/clients/${client.id}`)
    router.refresh()
  }

  const e = errors
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Entreprise</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <FormField id="raisonSociale" label="Raison sociale *" erreur={e.raisonSociale?.message}>
            <Input {...register("raisonSociale")} {...a11y("raisonSociale", e.raisonSociale?.message)} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="formeJuridique" label="Forme juridique">
              <NativeSelect {...register("formeJuridique")} id="formeJuridique" defaultValue="">
                <option value="">— Non définie —</option>
                {FORMES_JURIDIQUES.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField id="secteurActivite" label="Secteur d'activité">
              <Input {...register("secteurActivite")} id="secteurActivite" />
            </FormField>
            <FormField id="chiffreAffaires" label="Chiffre d'affaires (FCFA)" erreur={e.chiffreAffaires?.message}>
              <Input inputMode="numeric" {...register("chiffreAffaires")} {...a11y("chiffreAffaires", e.chiffreAffaires?.message)} />
            </FormField>
            <FormField id="ifu" label="IFU">
              <Input {...register("ifu")} id="ifu" />
            </FormField>
            <FormField id="telephone" label="Téléphone">
              <Input type="tel" {...register("telephone")} id="telephone" />
            </FormField>
            <FormField id="adresse" label="Adresse">
              <Input {...register("adresse")} id="adresse" />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dirigeant et accès à l&apos;espace client</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FormField id="prenom" label="Prénom *" erreur={e.prenom?.message}>
            <Input autoComplete="off" {...register("prenom")} {...a11y("prenom", e.prenom?.message)} />
          </FormField>
          <FormField id="nom" label="Nom *" erreur={e.nom?.message}>
            <Input autoComplete="off" {...register("nom")} {...a11y("nom", e.nom?.message)} />
          </FormField>
          <FormField id="email" label="Email *" erreur={e.email?.message} className="sm:col-span-2">
            <Input type="email" autoComplete="off" {...register("email")} {...a11y("email", e.email?.message)} />
          </FormField>
          <FormField id="password" label="Mot de passe initial *" erreur={e.password?.message} className="sm:col-span-2">
            <Input type="password" autoComplete="new-password" {...register("password")} {...a11y("password", e.password?.message)} />
          </FormField>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Communiquez ces identifiants au client : il pourra suivre ses dossiers et demander ses attestations.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2 lg:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : "Créer le client"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
