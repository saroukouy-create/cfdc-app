import { Lexend, Source_Sans_3 } from "next/font/google"

// Typographie des portails (gestion et espace client), recommandee par UI UX Pro Max pour la finance :
// Lexend (titres, lisibilite) + Source Sans 3 (texte et chiffres)
const lexend = Lexend({ variable: "--font-portail-titre", subsets: ["latin"], weight: ["500", "600", "700"] })
const source = Source_Sans_3({ variable: "--font-portail", subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const FONTS_PORTAIL = `${lexend.variable} ${source.variable}`
