"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const callbackUrl = useSearchParams().get("callbackUrl")
  const [erreur, setErreur] = useState("")
  const [envoi, setEnvoi] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnvoi(true)
    setErreur("")
    const form = new FormData(e.currentTarget)
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })
    if (!res?.ok) {
      setEnvoi(false)
      return setErreur("Email ou mot de passe incorrect")
    }
    // Redirection selon le role : clients vers leur espace, personnel vers le tableau de bord
    const session = await getSession()
    const accueil = session?.user.role === "CLIENT" ? "/espace" : "/dashboard"
    const cible = callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : accueil
    router.replace(cible)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {erreur && (
        <p role="alert" className="text-sm text-destructive">
          {erreur}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={envoi}>
        {envoi ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  )
}
