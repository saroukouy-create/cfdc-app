"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, FileText, Upload } from "lucide-react"
import { ETAPES, FORMES_JURIDIQUES, STATUT_DOSSIER, UPLOAD_TYPES, type EtapeKey } from "@/lib/constants"
import { formatDate, formatTaille } from "@/lib/format"
import { appelApi } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"

export type DossierVue = {
  id: string
  denomination: string
  activite: string | null
  formeJuridique: string | null
  capital: number | null
  siege: string | null
  etape: EtapeKey
  statut: string
  dateDepot: string | null
  numeroRccm: string | null
  notes: string | null
  pieces: { id: string; nom: string; taille: number; createdAt: string }[]
}

// Conseil affiche a l'etape "Forme juridique" (accompagnement du choix, document ACTIVITES CFDC)
const CONSEIL_FORME =
  "Le choix dépend du nombre d'associés, du capital disponible, de la responsabilité souhaitée et du régime fiscal. Le conseiller CFDC valide ce choix avec le porteur de projet avant la rédaction des statuts."

/**
 * Stepper des 5 etapes (informations, forme juridique, pieces, depot, suivi).
 * En lecture seule (espace client), seul le televersement des pieces reste possible.
 */
export function DossierStepper({ dossier, lectureSeule = false }: { dossier: DossierVue; lectureSeule?: boolean }) {
  const router = useRouter()
  const indexCourant = ETAPES.findIndex((e) => e.key === dossier.etape)
  const [vue, setVue] = useState(indexCourant)
  const [envoi, setEnvoi] = useState(false)
  const etape = ETAPES[vue]

  async function enregistrer(form: HTMLFormElement, avancer: boolean) {
    const data: Record<string, string> = Object.fromEntries(
      [...new FormData(form).entries()].map(([k, v]) => [k, String(v)]),
    )
    if (avancer && vue < ETAPES.length - 1) data.etape = ETAPES[vue + 1].key
    setEnvoi(true)
    const ok = await appelApi(`/api/dossiers/${dossier.id}`, { method: "PATCH", body: data })
    setEnvoi(false)
    if (!ok) return
    toast.success(avancer ? "Étape validée" : "Enregistré")
    if (avancer && vue < ETAPES.length - 1) setVue(vue + 1)
    router.refresh()
  }

  async function televerser(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0]
    if (!fichier) return
    const body = new FormData()
    body.set("fichier", fichier)
    setEnvoi(true)
    const ok = await appelApi(`/api/dossiers/${dossier.id}/pieces`, { method: "POST", body })
    setEnvoi(false)
    e.target.value = ""
    if (ok) {
      toast.success("Pièce ajoutée")
      router.refresh()
    }
  }

  const champs: Record<EtapeKey, React.ReactNode> = {
    INFORMATIONS: (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="denomination" label="Dénomination">
          <Input id="denomination" name="denomination" defaultValue={dossier.denomination} required />
        </FormField>
        <FormField id="activite" label="Activité principale">
          <Input id="activite" name="activite" defaultValue={dossier.activite ?? ""} />
        </FormField>
        <FormField id="capital" label="Capital (FCFA)">
          <Input id="capital" name="capital" inputMode="numeric" defaultValue={dossier.capital ?? ""} />
        </FormField>
        <FormField id="siege" label="Siège social">
          <Input id="siege" name="siege" defaultValue={dossier.siege ?? ""} />
        </FormField>
      </div>
    ),
    FORME_JURIDIQUE: (
      <div className="grid gap-4">
        <p className="rounded-lg bg-muted p-3 text-sm">{CONSEIL_FORME}</p>
        <FormField id="formeJuridique" label="Forme juridique retenue" className="max-w-sm">
          <NativeSelect id="formeJuridique" name="formeJuridique" defaultValue={dossier.formeJuridique ?? ""}>
            <option value="">— À définir —</option>
            {FORMES_JURIDIQUES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </NativeSelect>
        </FormField>
      </div>
    ),
    PIECES: (
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">
          Pièces d&apos;identité, justificatif de siège, statuts signés… Formats PDF, JPEG ou PNG, 10 Mo maximum.
        </p>
        <ul className="divide-y rounded-lg border">
          {dossier.pieces.length === 0 && <li className="p-3 text-sm text-muted-foreground">Aucune pièce pour l&apos;instant.</li>}
          {dossier.pieces.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 p-3 text-sm">
              <a href={`/api/pieces/${p.id}`} target="_blank" className="flex min-w-0 items-center gap-2 hover:text-primary hover:underline">
                <FileText className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{p.nom}</span>
              </a>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatTaille(p.taille)} · {formatDate(p.createdAt)}
              </span>
            </li>
          ))}
        </ul>
        <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50">
          <Upload className="size-4" aria-hidden />
          {envoi ? "Envoi…" : "Ajouter une pièce"}
          <input type="file" accept={UPLOAD_TYPES.join(",")} onChange={televerser} disabled={envoi} className="sr-only" />
        </label>
      </div>
    ),
    DEPOT: (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="dateDepot" label="Date de dépôt du dossier">
          <Input id="dateDepot" name="dateDepot" type="date" defaultValue={dossier.dateDepot?.slice(0, 10) ?? ""} />
        </FormField>
        <FormField id="statut-depot" label="Statut">
          <NativeSelect id="statut-depot" name="statut" defaultValue={dossier.statut}>
            {Object.entries(STATUT_DOSSIER).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </NativeSelect>
        </FormField>
      </div>
    ),
    SUIVI: (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="numeroRccm" label="Numéro RCCM">
          <Input id="numeroRccm" name="numeroRccm" defaultValue={dossier.numeroRccm ?? ""} />
        </FormField>
        <FormField id="statut-suivi" label="Statut">
          <NativeSelect id="statut-suivi" name="statut" defaultValue={dossier.statut}>
            {Object.entries(STATUT_DOSSIER).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="notes" label="Notes de suivi" className="sm:col-span-2">
          <Textarea id="notes" name="notes" rows={4} defaultValue={dossier.notes ?? ""} />
        </FormField>
      </div>
    ),
  }

  return (
    <div className="grid gap-6">
      <ol className="grid grid-cols-5 gap-1" aria-label="Étapes du dossier">
        {ETAPES.map((e, i) => {
          const fait = i < indexCourant
          const courant = i === indexCourant
          return (
            <li key={e.key}>
              <button
                type="button"
                onClick={() => setVue(i)}
                aria-current={i === vue ? "step" : undefined}
                className={cn(
                  "flex w-full flex-col items-center gap-1.5 rounded-lg p-2 text-center text-xs transition-colors hover:bg-muted",
                  i === vue && "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 font-semibold",
                    fait && "border-primary bg-primary text-primary-foreground",
                    courant && "border-primary text-primary",
                  )}
                >
                  {fait ? <Check className="size-4" aria-label="terminée" /> : i + 1}
                </span>
                <span className={cn("hidden sm:block", courant && "font-semibold")}>{e.label}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <Card>
        <CardHeader>
          <CardTitle>
            Étape {vue + 1} · {etape.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lectureSeule && etape.key !== "PIECES" ? (
            <ResumeEtape dossier={dossier} etape={etape.key} />
          ) : (
            <form
              key={etape.key}
              onSubmit={(ev) => {
                ev.preventDefault()
                enregistrer(ev.currentTarget, (ev.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "avancer")
              }}
              className="grid gap-6"
            >
              {champs[etape.key]}
              {!lectureSeule && (
                <div className="flex flex-wrap gap-2">
                  {etape.key !== "PIECES" && (
                    <Button type="submit" variant="outline" disabled={envoi}>
                      Enregistrer
                    </Button>
                  )}
                  {vue === indexCourant && vue < ETAPES.length - 1 && (
                    <Button type="submit" value="avancer" disabled={envoi}>
                      Valider et passer à « {ETAPES[vue + 1].label} »
                    </Button>
                  )}
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ResumeEtape({ dossier, etape }: { dossier: DossierVue; etape: EtapeKey }) {
  const lignes: Record<EtapeKey, [string, string | null][]> = {
    INFORMATIONS: [
      ["Dénomination", dossier.denomination],
      ["Activité", dossier.activite],
      ["Capital", dossier.capital != null ? `${dossier.capital.toLocaleString("fr-FR")} FCFA` : null],
      ["Siège", dossier.siege],
    ],
    FORME_JURIDIQUE: [["Forme juridique", dossier.formeJuridique]],
    PIECES: [],
    DEPOT: [
      ["Date de dépôt", dossier.dateDepot ? formatDate(dossier.dateDepot) : null],
      ["Statut", STATUT_DOSSIER[dossier.statut]],
    ],
    SUIVI: [
      ["Numéro RCCM", dossier.numeroRccm],
      ["Statut", STATUT_DOSSIER[dossier.statut]],
    ],
  }
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      {lignes[etape].map(([k, v]) => (
        <div key={k}>
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="font-medium">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  )
}
