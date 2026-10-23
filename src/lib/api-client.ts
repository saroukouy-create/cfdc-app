import { toast } from "sonner"

/** Appel d'API depuis un composant client : affiche l'erreur en toast, renvoie null en cas d'echec. */
export async function appelApi<T = unknown>(url: string, init: { method: string; body?: unknown }): Promise<T | null> {
  const isForm = init.body instanceof FormData
  const res = await fetch(url, {
    method: init.method,
    headers: isForm || init.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: isForm ? (init.body as FormData) : init.body === undefined ? undefined : JSON.stringify(init.body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    toast.error(data.error ?? "Une erreur est survenue", {
      description: Array.isArray(data.erreurs) ? data.erreurs.join("\n") : undefined,
    })
    return null
  }
  return data as T
}
