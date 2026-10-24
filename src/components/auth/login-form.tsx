"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"

/** Destination apres connexion : callbackUrl interne au portail, sinon l'accueil du portail. */
export function cibleApresConnexion(callbackUrl: string | null, accueil: string) {
  const interne = callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
  return interne && callbackUrl.startsWith(accueil) ? callbackUrl : accueil
}

export function LoginForm({ portail }: { portail: "client" | "gestion" }) {
  const router = useRouter()
  const callbackUrl = useSearchParams().get("callbackUrl")
  const [erreur, setErreur] = useState("")
  const [envoi, setEnvoi] = useState(false)
  const accueil = portail === "gestion" ? "/gestion" : "/espace"

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnvoi(true)
    setErreur("")
    const form = new FormData(e.currentTarget)
    // Le serveur refuse un compte qui n'appartient pas a ce portail (voir authorize dans lib/auth.ts)
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      portail,
      redirect: false,
    })
    if (!res?.ok) {
      setEnvoi(false)
      return setErreur(
        portail === "gestion"
          ? "Identifiants incorrects ou compte non autorisé sur l'espace de gestion."
          : "Email ou mot de passe incorrect.",
      )
    }
    router.replace(cibleApresConnexion(callbackUrl, accueil))
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
        <PasswordInput id="password" name="password" autoComplete="current-password" required />
      </div>
      {erreur && (
        <p role="alert" className="text-sm text-destructive">
          {erreur}
        </p>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={envoi}>
        {envoi ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  )
}
