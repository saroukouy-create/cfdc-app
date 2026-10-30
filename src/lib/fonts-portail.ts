import localFont from "next/font/local"

// Typographie des portails (gestion et espace client), recommandee par UI UX Pro Max pour la finance :
// Lexend (titres, lisibilite) + Source Sans 3 (texte et chiffres).
// Polices variables auto-hebergees (src/fonts) : le build du serveur n'a pas a joindre Google Fonts.
const lexend = localFont({ src: "../fonts/lexend.woff2", variable: "--font-portail-titre", weight: "500 700", display: "swap" })
const source = localFont({ src: "../fonts/source-sans-3.woff2", variable: "--font-portail", weight: "200 900", display: "swap" })

export const FONTS_PORTAIL = `${lexend.variable} ${source.variable}`
