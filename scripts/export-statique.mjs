// Copie exacte du site public en fichiers HTML/CSS/JS (dossier site-statique/).
// Prerequis : le site tourne (npm run build && npm start). Usage : npm run export:statique
// Limites : l'espace client, la gestion et les formulaires (devis, contact) exigent le serveur Next.js ;
// dans la copie statique ces liens et envois ne fonctionnent pas.
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

const fichiers = new Set() // ressources a recuperer : chemins absolus du site (/_next/..., /images/...)

/** /_next/image?url=%2Fimages%2Fx.jpg&w=640&q=75 -> /images/x.jpg (pas d'optimiseur d'images sur un hebergement statique) */
function imageDirecte(url) {
  const m = url.match(/\/_next\/image\?url=([^&"'\s]+)/)
  return m ? decodeURIComponent(m[1]) : url
}

function reecrireHtml(html) {
  // Le JavaScript de Next.js exige son serveur (routeur, optimiseur d'images) : on le retire
  // et on le remplace par site.js (apparitions, menu mobile, horaires, formulaires)
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  html = html.replace(/<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*as="script"[^>]*\/?>/gi, "")
  html = html.replace(/<link\b[^>]*as="script"[^>]*rel="(?:preload|modulepreload)"[^>]*\/?>/gi, "")
  html = html.replace("</body>", '<script src="/site.js" defer></script></body>')
  // srcset / src / imageSrcSet d'images optimisees -> fichier original
  html = html.replace(/\/_next\/image\?url=[^"'\s,]+/g, (u) => imageDirecte(u.replace(/&amp;/g, "&")))
  // les srcset deviennent "x.jpg 640w, x.jpg 750w..." : identiques, on garde le premier
  html = html.replace(/(srcset|imageSrcSet)="([^"]+)"/gi, (_, attr, val) => `${attr}="${val.split(",")[0].trim().split(" ")[0]}"`)
  // reperer toutes les ressources locales referencees
  for (const m of html.matchAll(/(?:src|href)="(\/(?:_next\/static|images|icons)[^"?#]*)"/g)) fichiers.add(m[1])
  for (const f of ["/icon.png", "/apple-icon.png", "/manifest.webmanifest"]) if (html.includes(f)) fichiers.add(f)
  return html
}

async function recuperer(chemin) {
  const res = await fetch(SOURCE + chemin)
  if (!res.ok) throw new Error(`${chemin} : HTTP ${res.status}`)
  return res
}

await rm(SORTIE, { recursive: true, force: true })

// 1. Pages HTML : /services -> services/index.html (adresses propres sur un serveur web)
for (const page of PAGES) {
  const html = reecrireHtml(await (await recuperer(page)).text())
  const cible = path.join(SORTIE, page, "index.html")
  await mkdir(path.dirname(cible), { recursive: true })
  await writeFile(cible, html)
  console.log("page   ", page)
}

// 2. Ressources (CSS, JS, images, icones) ; les CSS referencent les polices via url(...)
const faits = new Set()
for (let i = 0; i < 3 && [...fichiers].some((f) => !faits.has(f)); i++) {
  for (const f of [...fichiers]) {
    if (faits.has(f)) continue
    faits.add(f)
    const res = await recuperer(f)
    const cible = path.join(SORTIE, decodeURIComponent(f))
    await mkdir(path.dirname(cible), { recursive: true })
    if (f.endsWith(".css")) {
      const css = await res.text()
      for (const m of css.matchAll(/url\((\/_next\/static\/media\/[^)"']+)\)/g)) fichiers.add(m[1])
      await writeFile(cible, css)
    } else {
      await writeFile(cible, Buffer.from(await res.arrayBuffer()))
    }
  }
}

// 3. JavaScript du site statique, page 404 et lisez-moi
await writeFile(path.join(SORTIE, "site.js"), await readFile(new URL("./site-statique.js", import.meta.url)))
// Les navigateurs demandent /favicon.ico d'office : une icone PNG sous ce nom leur suffit
await writeFile(path.join(SORTIE, "favicon.ico"), Buffer.from(await (await recuperer("/icon.png")).arrayBuffer()))
await writeFile(path.join(SORTIE, "404.html"), reecrireHtml(await (await fetch(SOURCE + "/page-introuvable-export")).text()))
await writeFile(
  path.join(SORTIE, "LISEZMOI.txt"),
  [
    "Copie statique du site public CFDC (genere par scripts/export-statique.mjs).",
    "A publier a la RACINE d'un domaine ou sous-domaine (les liens commencent par /).",
    "Test local : npx serve site-statique  puis ouvrir l'adresse affichee.",
    "Ne fonctionnent pas sans le serveur Next.js : espace client, gestion, inscription, formulaires.",
    "",
  ].join("\n"),
)
console.log(`\n${PAGES.length} pages, ${faits.size} ressources -> ${SORTIE}`)
