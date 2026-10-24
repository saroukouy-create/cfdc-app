"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import type { z } from "zod"
import { inscriptionSchema, type InscriptionInput } from "@/lib/validations"
import { appelApi } from "@/lib/api-client"
import { a11y, FormField } from "@/components/form-field"
import { cibleApresConnexion } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

export function InscriptionForm() {
  const router = useRouter()
  const callbackUrl = useSearchParams().get("callbackUrl")
  const {
    register,
    handleSubmit,
    formState: { errors: e, isSubmitting },
  } = useForm<InscriptionInput, unknown, z.output<typeof inscriptionSchema>>({ mode: "onTouched", resolver: zodResolver(inscriptionSchema) })

  async function onSubmit(data: z.output<typeof inscriptionSchema>) {
    if (!(await appelApi("/api/inscription", { method: "POST", body: data }))) return
    // Connexion automatique puis retour a la demande en cours (ou a l'espace client)
    const res = await signIn("credentials", { email: data.email, password: data.password, portail: "client", redirect: false })
    if (!res?.ok) return router.push("/connexion")
    toast.success("Bienvenue ! Votre espace client est prêt.")
    router.replace(cibleApresConnexion(callbackUrl, "/espace"))
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
      {/* Champ piege anti-robots, invisible pour les visiteurs */}
      <div className="hidden" aria-hidden>
        <label>
          Site web <input tabIndex={-1} autoComplete="off" {...register("site_web")} />
        </label>
      </div>
      <FormField id="i-prenom" label="Prénom *" erreur={e.prenom?.message}>
        <Input autoComplete="given-name" {...register("prenom")} {...a11y("i-prenom", e.prenom?.message)} />
      </FormField>
      <FormField id="i-nom" label="Nom *" erreur={e.nom?.message}>
        <Input autoComplete="family-name" {...register("nom")} {...a11y("i-nom", e.nom?.message)} />
      </FormField>
      <FormField id="i-email" label="Email *" erreur={e.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} {...a11y("i-email", e.email?.message)} />
      </FormField>
      <FormField id="i-telephone" label="Téléphone *" erreur={e.telephone?.message}>
        <Input type="tel" autoComplete="tel" {...register("telephone")} {...a11y("i-telephone", e.telephone?.message)} />
      </FormField>
      <FormField id="i-entreprise" label="Entreprise (si elle existe déjà)" className="sm:col-span-2">
        <Input autoComplete="organization" {...register("raisonSociale")} id="i-entreprise" />
      </FormField>
      <FormField id="i-password" label="Mot de passe *" erreur={e.password?.message}>
        <PasswordInput autoComplete="new-password" {...register("password")} {...a11y("i-password", e.password?.message)} />
      </FormField>
      <FormField id="i-confirmation" label="Confirmer le mot de passe *" erreur={e.confirmation?.message}>
        <PasswordInput autoComplete="new-password" {...register("confirmation")} {...a11y("i-confirmation", e.confirmation?.message)} />
      </FormField>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Création du compte…" : "Créer mon espace client"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">Vos informations restent confidentielles et ne servent qu&apos;à traiter vos demandes.</p>
      </div>
    </form>
  )
}
