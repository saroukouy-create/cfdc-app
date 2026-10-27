// Copie exacte du site public en fichiers HTML/CSS/JS (dossier site-statique/) :
//   index.html, services.html, ...   pages (liens relatifs : s'ouvrent aussi par double-clic)
//   css/style.css  js/site.js  images/  fonts/
// Prerequis : le site tourne (npm run build && npm start). Usage : npm run export:statique
// Limites : l'espace client, la gestion et les formulaires exigent le serveur Next.js ;
// dans la copie statique ces liens menent a la page contact.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

const SOURCE = process.env.SOURCE ?? "http://localhost:3000"
const SORTIE = path.resolve("site-statique")
const PAGES = [
  "/",
  "/services",
  "/services/creation-entreprise",
  "/services/gestion-entreprise",
  "/services/assistance-comptable-fiscale-sociale",
  "/services/attestations-documents",
  "/formations",
  "/a-propos",
  "/contact",
]

/** "/" -> index.html ; "/services/gestion-entreprise" -> gestion-entreprise.html */
const fichierDe = (page) => (page === "/" ? "index.html" : `${page.split("/").pop()}.html`)

const fichiers = new Set() // images et icones a recuperer (chemins du site)
const feuilles = new Map() // CSS du site -> css/style.css, css/style-2.css...

/** /_next/image?url=%2Fimages%2Fx.jpg&w=640&q=75 -> /images/x.jpg (pas d'optimiseur d'images hors serveur) */
function imageDirecte(url) {
  const m = url.match(/\/_next\/image\?url=([^&"'\s]+)/)
  return m ? decodeURIComponent(m[1]) : url
}

/** Adresse absolue du site -> chemin relatif dans la copie */
function relatif(url) {
  const [chemin, reste = ""] = url.split(/(?=[?#])/)
  if (chemin.startsWith("/_next/static/css/")) {
    if (!feuilles.has(chemin)) feuilles.set(chemin, `css/style${feuilles.size ? `-${feuilles.size + 1}` : ""}.css`)
    return feuilles.get(chemin)
  }
  if (/^\/(images|icons)\//.test(chemin) || chemin === "/icon.png" || chemin === "/apple-icon.png") {
    fichiers.add(chemin)
    return chemin.startsWith("/images/") ? chemin.slice(1) : `images${chemin}`
  }
  if (PAGES.includes(chemin)) return fichierDe(chemin) + reste
  // espace client, inscription, gestion : exigent le serveur de l'application
  return "contact.html"
}

function reecrireHtml(html) {
  // Le JavaScript de Next.js exige son serveur (routeur, optimiseur d'images) : on le retire
  // et on le remplace par js/site.js (apparitions, menu mobile, horaires, formulaires)
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  html = html.replace(/<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*as="script"[^>]*\/?>/gi, "")
  html = html.replace(/<link\b[^>]*as="script"[^>]*rel="(?:preload|modulepreload)"[^>]*\/?>/gi, "")
  // le manifeste d'application web exige un serveur (refuse par les navigateurs en file://)
  html = html.replace(/<link\b[^>]*rel="manifest"[^>]*\/?>/gi, "")
  html = html.replace("</body>", '<script src="js/site.js" defer></script></body>')
  // srcset / src / imageSrcSet d'images optimisees -> fichier original
  html = html.replace(/\/_next\/image\?url=[^"'\s,]+/g, (u) => imageDirecte(u.replace(/&amp;/g, "&")))
  // les srcset deviennent "x.jpg 640w, x.jpg 750w..." : identiques, on garde le premier
  html = html.replace(/(srcset|imageSrcSet)="([^"]+)"/gi, (_, attr, val) => `${attr}="${val.split(",")[0].trim().split(" ")[0]}"`)
  // toutes les adresses absolues du site -> chemins relatifs
  html = html.replace(/\b(href|src|srcset|imagesrcset)="(\/[^"]*)"/gi, (_, attr, url) => `${attr}="${relatif(url.replace(/&amp;/g, "&"))}"`)
  html = html.replace(/url\((["']?|&quot;)\/(images|icons)\//g, (_, q, dossier) => `url(${q}${dossier === "images" ? "" : "images/"}${dossier}/`)
  return html
}

async function recuperer(chemin) {
  const res = await fetch(SOURCE + chemin)
  if (!res.ok) throw new Error(`${chemin} : HTTP ${res.status}`)
  return res
}

async function ecrire(relatifCible, contenu) {
  const cible = path.join(SORTIE, relatifCible)
  await mkdir(path.dirname(cible), { recursive: true })
  await writeFile(cible, contenu)
}

await rm(SORTIE, { recursive: true, force: true })

// 1. Pages HTML
for (const page of PAGES) {
  await ecrire(fichierDe(page), reecrireHtml(await (await recuperer(page)).text()))
  console.log("page   ", fichierDe(page))
}
await ecrire("404.html", reecrireHtml(await (await fetch(SOURCE + "/page-introuvable-export")).text()))

// 2. CSS : les polices passent de /_next/static/media/ a fonts/
const polices = new Set()
for (const [source, cible] of feuilles) {
  const css = (await (await recuperer(source)).text()).replace(/url\(\/_next\/static\/media\/([^)"']+)\)/g, (_, nom) => {
    polices.add(nom)
    return `url(../fonts/${nom})`
  })
  await ecrire(cible, css)
}
for (const nom of polices) await ecrire(`fonts/${nom}`, Buffer.from(await (await recuperer(`/_next/static/media/${nom}`)).arrayBuffer()))

// 3. Images et icones
for (const f of fichiers) {
  const cible = f.startsWith("/images/") ? f.slice(1) : `images${f}`
  await ecrire(decodeURIComponent(cible), Buffer.from(await (await recuperer(f)).arrayBuffer()))
}
// Les navigateurs demandent /favicon.ico d'office : une icone PNG sous ce nom leur suffit
await ecrire("favicon.ico", Buffer.from(await (await recuperer("/icon.png")).arrayBuffer()))

// 4. JavaScript et lisez-moi
await ecrire("js/site.js", await readFile(new URL("./site-statique.js", import.meta.url)))
await ecrire(
  "LISEZMOI.txt",
  [
    "Copie statique du site public CFDC (genere par scripts/export-statique.mjs).",
    "Ouvrir index.html (double-clic) ou publier tout le dossier sur un hebergement web.",
    "  pages : *.html   style : css/   script : js/site.js   images : images/   polices : fonts/",
    "Ne fonctionnent pas sans le serveur de l'application : espace client, gestion, inscription,",
    "envoi des formulaires (les liens correspondants menent a contact.html).",
    "",
  ].join("\n"),
)
console.log(`\n${PAGES.length} pages, ${feuilles.size} CSS, ${polices.size} polices, ${fichiers.size} images -> ${SORTIE}`)
