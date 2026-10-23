import { readFileSync } from "node:fs"
import path from "node:path"
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { Synthese } from "@/lib/donnees"

// Logo passe en octets : un chemin Windows ("C:\...") serait pris pour une URL par @react-pdf
const LOGO = readFileSync(path.join(process.cwd(), "public", "images", "logo-cfdc.png"))

// Helvetica (police PDF standard) ne connait pas les espaces fines insecables de fr-FR
const n = (v: number) => `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(v).replace(/[  ]/g, " ")} FCFA`

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937" },
  entete: { borderBottomWidth: 2, borderBottomColor: "#0f4c81", paddingBottom: 8, marginBottom: 16 },
  marque: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#0f4c81" },
  sous: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  titre: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 14, marginBottom: 6, color: "#0f4c81" },
  ligne: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: "#e5e7eb" },
  total: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, fontFamily: "Helvetica-Bold" },
  colonnes: { flexDirection: "row", gap: 20 },
  col: { flex: 1 },
  pied: { position: "absolute", bottom: 25, left: 40, right: 40, fontSize: 8, color: "#9ca3af", textAlign: "center" },
})

function Ligne({ label, valeur, gras }: { label: string; valeur: number; gras?: boolean }) {
  return (
    <View style={gras ? s.total : s.ligne}>
      <Text>{label}</Text>
      <Text>{n(valeur)}</Text>
    </View>
  )
}

export function RapportPDF({ client, synthese, date }: { client: { raisonSociale: string; formeJuridique: string | null }; synthese: Synthese; date: string }) {
  const { resultat, bilan, series, cycle } = synthese
  const marge = resultat.produits ? Math.round((resultat.resultat / resultat.produits) * 100) : 0
  return (
    <Document title={`Rapport de gestion - ${client.raisonSociale}`} author="CFDC">
      <Page size="A4" style={s.page}>
        <View style={s.entete}>
          {/* Image @react-pdf (pas une balise HTML) : elle n'a pas d'attribut alt */}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={{ data: LOGO, format: "png" }} style={{ width: 96 }} />
          <Text style={s.sous}>{`Bureau d'études pluridisciplinaire - Rapport de gestion du ${date}`}</Text>
        </View>

        <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold" }}>{client.raisonSociale}</Text>
        {client.formeJuridique && <Text style={s.sous}>{client.formeJuridique}</Text>}

        <Text style={s.titre}>Compte de résultat</Text>
        <Ligne label="Produits" valeur={resultat.produits} />
        <Ligne label="Charges" valeur={resultat.charges} />
        <Ligne label={resultat.resultat >= 0 ? "Bénéfice" : "Perte"} valeur={resultat.resultat} gras />
        <Text style={s.sous}>Marge nette : {marge} % des produits</Text>

        <Text style={s.titre}>Bilan simplifié</Text>
        <View style={s.colonnes}>
          <View style={s.col}>
            <Ligne label="Immobilisations nettes" valeur={bilan.actif.immobilisations} />
            <Ligne label="Stocks" valeur={bilan.actif.stocks} />
            <Ligne label="Créances" valeur={bilan.actif.creances} />
            <Ligne label="Trésorerie actif" valeur={bilan.actif.tresorerie} />
            <Ligne label="Total actif" valeur={bilan.totalActif} gras />
          </View>
          <View style={s.col}>
            <Ligne label="Capitaux propres" valeur={bilan.passif.capitauxPropres} />
            <Ligne label="Résultat de l'exercice" valeur={bilan.passif.resultat} />
            <Ligne label="Dettes financières" valeur={bilan.passif.dettesFinancieres} />
            <Ligne label="Dettes" valeur={bilan.passif.dettes} />
            <Ligne label="Trésorerie passif" valeur={bilan.passif.tresoreriePassif} />
            <Ligne label="Total passif" valeur={bilan.totalPassif} gras />
          </View>
        </View>

        <Text style={s.titre}>Évolution mensuelle</Text>
        <View style={[s.ligne, { fontFamily: "Helvetica-Bold" }]}>
          <Text style={{ width: "25%" }}>Mois</Text>
          <Text style={{ width: "25%", textAlign: "right" }}>Produits</Text>
          <Text style={{ width: "25%", textAlign: "right" }}>Charges</Text>
          <Text style={{ width: "25%", textAlign: "right" }}>Trésorerie</Text>
        </View>
        {series.map((m) => (
          <View key={m.mois} style={s.ligne}>
            <Text style={{ width: "25%" }}>{m.mois}</Text>
            <Text style={{ width: "25%", textAlign: "right" }}>{n(m.produits)}</Text>
            <Text style={{ width: "25%", textAlign: "right" }}>{n(m.charges)}</Text>
            <Text style={{ width: "25%", textAlign: "right" }}>{n(m.tresorerie)}</Text>
          </View>
        ))}

        <Text style={s.titre}>Cycle comptable</Text>
        {cycle.map((e) => (
          <View key={e.etape} style={s.ligne}>
            <Text>{e.fait ? "[x]" : "[ ]"} {e.etape}</Text>
            <Text style={{ color: "#6b7280" }}>{e.detail}</Text>
          </View>
        ))}

        <Text style={s.pied} fixed>
          {"CFDC - Votre partenaire de confiance pour une création d'entreprise réussie et une gestion sereine."}
        </Text>
      </Page>
    </Document>
  )
}
