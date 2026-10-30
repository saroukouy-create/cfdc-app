"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Trash2, Upload } from "lucide-react"
import { appelApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Contact = { email: string; tel1: string; tel2: string; whatsapp: string }
type Service = { slug: string; titre: string; accroche: string; prestations: string[] }
type Livre = { id?: string; titre: string; description: string; prix: number | null; image: string; alt: string; visible: boolean; ordre: number }

const Champ = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="grid gap-1.5 text-sm font-medium">
    {label}
    {children}
  </label>
)

function CarteContact({ initial }: { initial: Contact }) {
  const router = useRouter()
  const [c, setC] = useState(initial)
  const [envoi, setEnvoi] = useState(false)
  async function enregistrer() {
    setEnvoi(true)
    if (await appelApi("/api/site/reglages", { method: "PUT", body: { cle: "contact", valeur: c } })) {
      toast.success("Coordonnées enregistrées")
      router.refresh()
    }
    setEnvoi(false)
  }
  const maj = (k: keyof Contact) => (e: React.ChangeEvent<HTMLInputElement>) => setC({ ...c, [k]: e.target.value })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coordonnées du cabinet</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Champ label="Email">
          <Input type="email" value={c.email} onChange={maj("email")} />
        </Champ>
        <Champ label="WhatsApp (numéro des achats)">
          <Input value={c.whatsapp} onChange={maj("whatsapp")} placeholder="+229 01 97 44 32 31" />
        </Champ>
        <Champ label="Téléphone 1">
          <Input value={c.tel1} onChange={maj("tel1")} />
        </Champ>
        <Champ label="Téléphone 2 (facultatif)">
          <Input value={c.tel2} onChange={maj("tel2")} />
        </Champ>
        <Button onClick={enregistrer} disabled={envoi} className="w-fit">
          {envoi ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </CardContent>
    </Card>
  )
}

function CarteServices({ initial }: { initial: Service[] }) {
  const router = useRouter()
  const [liste, setListe] = useState(initial.map((s) => ({ ...s, texte: s.prestations.join("\n") })))
  const [envoi, setEnvoi] = useState(false)
  const maj = (i: number, patch: Partial<(typeof liste)[number]>) => setListe(liste.map((s, j) => (j === i ? { ...s, ...patch } : s)))
  async function enregistrer() {
    setEnvoi(true)
    const valeur = Object.fromEntries(
      liste.map((s) => [s.slug, { titre: s.titre, accroche: s.accroche, prestations: s.texte.split("\n").map((l) => l.trim()).filter(Boolean) }]),
    )
    if (await appelApi("/api/site/reglages", { method: "PUT", body: { cle: "services", valeur } })) {
      toast.success("Services enregistrés")
      router.refresh()
    }
    setEnvoi(false)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services (prestations)</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {liste.map((s, i) => (
          <fieldset key={s.slug} className="grid gap-3 rounded-lg border p-4">
            <legend className="px-1 text-sm font-semibold text-muted-foreground">{s.slug}</legend>
            <Champ label="Titre">
              <Input value={s.titre} onChange={(e) => maj(i, { titre: e.target.value })} />
            </Champ>
            <Champ label="Phrase d'accroche">
              <Textarea value={s.accroche} onChange={(e) => maj(i, { accroche: e.target.value })} />
            </Champ>
            <Champ label="Prestations (une par ligne)">
              <Textarea value={s.texte} onChange={(e) => maj(i, { texte: e.target.value })} rows={5} />
            </Champ>
          </fieldset>
        ))}
        <Button onClick={enregistrer} disabled={envoi} className="w-fit">
          {envoi ? "Enregistrement…" : "Enregistrer les services"}
        </Button>
      </CardContent>
    </Card>
  )
}

function LigneLivre({ initial, onChange }: { initial: Livre; onChange: () => void }) {
  const [l, setL] = useState(initial)
  const [envoi, setEnvoi] = useState(false)
  const maj = (patch: Partial<Livre>) => setL({ ...l, ...patch })
  const corps = { titre: l.titre, description: l.description, prix: l.prix, image: l.image, alt: l.alt || l.titre, visible: l.visible, ordre: l.ordre }

  async function enregistrer() {
    setEnvoi(true)
    const r = await appelApi<Livre>(l.id ? `/api/site/livres/${l.id}` : "/api/site/livres", { method: l.id ? "PUT" : "POST", body: corps })
    if (r) {
      toast.success("Livre enregistré")
      onChange()
    }
    setEnvoi(false)
  }
  async function supprimer() {
    if (!l.id) return onChange()
    if (!confirm(`Supprimer « ${l.titre} » ?`)) return
    if (await appelApi(`/api/site/livres/${l.id}`, { method: "DELETE" })) {
      toast.success("Livre supprimé")
      onChange()
    }
  }
  async function envoyerImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const fd = new FormData()
    fd.append("fichier", f)
    const r = await appelApi<{ url: string }>("/api/site/images", { method: "POST", body: fd })
    if (r) maj({ image: r.url })
    e.target.value = ""
  }

  return (
    <li className="grid gap-4 rounded-lg border p-4 md:grid-cols-[160px_1fr]">
      <div className="grid content-start gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l.image} alt={l.alt || l.titre} className="aspect-[4/3] w-full rounded-md border object-cover" />
        <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium hover:bg-muted">
          <Upload className="size-4" aria-hidden /> Changer l&apos;image
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={envoyerImage} />
        </label>
      </div>
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_140px_90px]">
          <Champ label="Titre">
            <Input value={l.titre} onChange={(e) => maj({ titre: e.target.value })} />
          </Champ>
          <Champ label="Prix (FCFA)">
            <Input
              type="number"
              min={0}
              value={l.prix ?? ""}
              placeholder="Sur demande"
              onChange={(e) => maj({ prix: e.target.value === "" ? null : Math.round(Number(e.target.value)) })}
            />
          </Champ>
          <Champ label="Ordre">
            <Input type="number" min={0} value={l.ordre} onChange={(e) => maj({ ordre: Math.max(0, Math.round(Number(e.target.value) || 0)) })} />
          </Champ>
        </div>
        <Champ label="Description">
          <Textarea value={l.description} onChange={(e) => maj({ description: e.target.value })} />
        </Champ>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={l.visible} onChange={(e) => maj({ visible: e.target.checked })} className="size-4" /> Visible sur le site
          </label>
          <Button onClick={enregistrer} disabled={envoi} size="sm">
            {envoi ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Button onClick={supprimer} variant="outline" size="sm">
            <Trash2 aria-hidden /> Supprimer
          </Button>
        </div>
      </div>
    </li>
  )
}

function CarteLivres({ livres, parDefaut }: { livres: Livre[]; parDefaut: Livre[] }) {
  const router = useRouter()
  const [nouveaux, setNouveaux] = useState<Livre[]>([])
  const [import_, setImport] = useState(false)
  const rafraichir = () => {
    setNouveaux([])
    router.refresh()
  }
  async function importer() {
    setImport(true)
    for (const l of parDefaut) if (!(await appelApi("/api/site/livres", { method: "POST", body: l }))) break
    setImport(false)
    rafraichir()
  }
  const vide: Livre = { titre: "", description: "", prix: null, image: "/images/livres/autres-registres.jpg", alt: "", visible: true, ordre: livres.length + nouveaux.length }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vente de livres comptables</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {livres.length === 0 && nouveaux.length === 0 && (
          <div className="rounded-lg border border-dashed p-4 text-sm">
            <p>Le site affiche pour l&apos;instant la liste d&apos;origine. Importez-la ici pour pouvoir la modifier (prix, images, ordre, masquer).</p>
            <Button onClick={importer} disabled={import_} className="mt-3">
              {import_ ? "Import…" : "Importer les livres actuels"}
            </Button>
          </div>
        )}
        <ul className="grid gap-4">
          {livres.map((l) => (
            <LigneLivre key={l.id} initial={l} onChange={rafraichir} />
          ))}
          {nouveaux.map((l, i) => (
            <LigneLivre key={`n${i}`} initial={l} onChange={rafraichir} />
          ))}
        </ul>
        <Button variant="outline" onClick={() => setNouveaux([...nouveaux, vide])} className="w-fit">
          <Plus aria-hidden /> Ajouter un livre
        </Button>
      </CardContent>
    </Card>
  )
}

export function EditeurSite(p: { contact: Contact; services: Service[]; livres: Livre[]; livresParDefaut: Livre[] }) {
  return (
    <div className="grid gap-6 [&>*]:min-w-0">
      <CarteLivres livres={p.livres} parDefaut={p.livresParDefaut} />
      <CarteServices initial={p.services} />
      <CarteContact initial={p.contact} />
    </div>
  )
}
