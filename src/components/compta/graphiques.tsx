"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Point = { mois: string; produits: number; charges: number; resultat: number; tresorerie: number }

const compact = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 })
const complet = (v: number) => `${new Intl.NumberFormat("fr-FR").format(v)} FCFA`
const libelleMois = (m: string) => {
  const [a, mo] = m.split("-").map(Number)
  return new Date(a, mo - 1).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
}

const axes = (
  <>
    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
    <XAxis dataKey="mois" tickFormatter={libelleMois} tickLine={false} axisLine={false} fontSize={12} />
    <YAxis tickFormatter={(v) => compact.format(v)} tickLine={false} axisLine={false} fontSize={12} width={48} />
  </>
)

export function GraphiqueTresorerie({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        {axes}
        <Tooltip formatter={(v) => complet(Number(v))} labelFormatter={(m) => libelleMois(String(m))} />
        <Area type="monotone" dataKey="tresorerie" name="Trésorerie" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.15} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function GraphiqueResultat({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        {axes}
        <Tooltip formatter={(v) => complet(Number(v))} labelFormatter={(m) => libelleMois(String(m))} />
        {/* Libelles en couleur de texte : la couleur de la serie seule ne passe pas le contraste 4.5:1 */}
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span className="text-foreground">{v}</span>} />
        <Bar dataKey="produits" name="Produits" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="charges" name="Charges" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
