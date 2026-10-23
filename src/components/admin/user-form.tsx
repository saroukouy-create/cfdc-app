"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { z } from "zod"
import { userSchema, type UserInput } from "@/lib/validations"
import { appelApi } from "@/lib/api-client"
import { a11y, FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"

export function UserForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: e, isSubmitting },
  } = useForm<UserInput, unknown, z.output<typeof userSchema>>({ resolver: zodResolver(userSchema), defaultValues: { role: "CONSEILLER" } })

  async function onSubmit(data: z.output<typeof userSchema>) {
    if (!(await appelApi("/api/users", { method: "POST", body: data }))) return
    toast.success("Compte créé")
    reset()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="u-prenom" label="Prénom" erreur={e.prenom?.message}>
          <Input {...register("prenom")} {...a11y("u-prenom", e.prenom?.message)} />
        </FormField>
        <FormField id="u-nom" label="Nom" erreur={e.nom?.message}>
          <Input {...register("nom")} {...a11y("u-nom", e.nom?.message)} />
        </FormField>
      </div>
      <FormField id="u-email" label="Email" erreur={e.email?.message}>
        <Input type="email" autoComplete="off" {...register("email")} {...a11y("u-email", e.email?.message)} />
      </FormField>
      <FormField id="u-password" label="Mot de passe initial" erreur={e.password?.message}>
        <Input type="password" autoComplete="new-password" {...register("password")} {...a11y("u-password", e.password?.message)} />
      </FormField>
      <FormField id="u-role" label="Rôle">
        <NativeSelect {...register("role")} id="u-role">
          <option value="CONSEILLER">Conseiller</option>
          <option value="ADMIN">Administrateur</option>
        </NativeSelect>
      </FormField>
      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? "Création…" : "Créer le compte"}
      </Button>
    </form>
  )
}
