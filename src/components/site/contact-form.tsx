"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2 } from "lucide-react"
import type { z } from "zod"
import { contactSchema, type ContactInput } from "@/lib/validations"
import { appelApi } from "@/lib/api-client"
import { a11y, FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

/**
 * Formulaire public : demande de devis, inscription a une formation ou message.
 * `sujets` alimente la liste deroulante (services ou formations), `sujet` la preselectionne.
 */
export function ContactForm({
  type = "DEVIS",
  sujets,
  sujet,
  libelleSujet = "Service concerné",
}: {
  type?: "DEVIS" | "FORMATION" | "MESSAGE"
  sujets: string[]
  sujet?: string
  libelleSujet?: string
}) {
  const [envoye, setEnvoye] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors: e, isSubmitting },
  } = useForm<ContactInput, unknown, z.output<typeof contactSchema>>({
    mode: "onTouched", resolver: zodResolver(contactSchema),
    defaultValues: { type, sujet: sujets.includes(sujet ?? "") ? sujet : "" },
  })

  async function onSubmit(data: z.output<typeof contactSchema>) {
    if (await appelApi("/api/contact", { method: "POST", body: data })) setEnvoye(true)
  }

  if (envoye)
    return (
      <div role="status" className="entree-page rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden />
        <p className="mt-3 text-lg font-semibold">Merci, votre demande est bien envoyée.</p>
        <p className="mt-1 text-muted-foreground">Un conseiller CFDC vous recontacte rapidement.</p>
      </div>
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
      <input type="hidden" {...register("type")} />
      {/* Champ piege anti-robots, invisible pour les visiteurs */}
      <div className="hidden" aria-hidden>
        <label>
          Site web <input tabIndex={-1} autoComplete="off" {...register("site_web")} />
        </label>
      </div>

      <FormField id="c-nom" label="Nom et prénom *" erreur={e.nom?.message}>
        <Input autoComplete="name" {...register("nom")} {...a11y("c-nom", e.nom?.message)} />
      </FormField>
      <FormField id="c-entreprise" label="Entreprise (facultatif)">
        <Input autoComplete="organization" {...register("entreprise")} id="c-entreprise" />
      </FormField>
      <FormField id="c-email" label="Email *" erreur={e.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} {...a11y("c-email", e.email?.message)} />
      </FormField>
      <FormField id="c-telephone" label="Téléphone">
        <Input type="tel" autoComplete="tel" {...register("telephone")} id="c-telephone" />
      </FormField>
      <FormField id="c-sujet" label={libelleSujet} className="sm:col-span-2">
        <NativeSelect {...register("sujet")} id="c-sujet">
          <option value="">— Choisir —</option>
          {sujets.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </NativeSelect>
      </FormField>
      <FormField id="c-message" label="Votre besoin" erreur={e.message?.message} className="sm:col-span-2">
        <Textarea rows={5} placeholder="Décrivez votre projet ou votre demande…" {...register("message")} {...a11y("c-message", e.message?.message)} />
      </FormField>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Envoi…" : type === "FORMATION" ? "Envoyer mon inscription" : "Envoyer ma demande"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">Vos informations restent confidentielles et ne servent qu&apos;à vous répondre.</p>
      </div>
    </form>
  )
}
