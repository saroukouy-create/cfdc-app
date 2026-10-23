import { Label } from "@/components/ui/label"

// Champ de formulaire : libelle + controle + message d'erreur relie par aria-describedby
export function FormField({
  id,
  label,
  erreur,
  className,
  children,
}: {
  id: string
  label: string
  erreur?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5">
        {label}
      </Label>
      {children}
      {erreur && (
        <p id={`${id}-erreur`} className="mt-1 text-xs text-destructive">
          {erreur}
        </p>
      )}
    </div>
  )
}

/** Props a etaler sur le controle pour l'accessibilite des erreurs. */
export const a11y = (id: string, erreur?: string) => ({
  id,
  "aria-invalid": erreur ? true : undefined,
  "aria-describedby": erreur ? `${id}-erreur` : undefined,
})
