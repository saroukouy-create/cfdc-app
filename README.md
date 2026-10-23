# CFDC — application de gestion du cabinet

Application web du bureau d'études CFDC : site vitrine, espace collaborateurs (clients, création
d'entreprise, comptabilité, attestations, administration) et espace client.

Stack : Next.js 15 (App Router, `src/`), TypeScript, Tailwind CSS 4, shadcn/ui (Base UI),
Prisma 6 + MySQL/MariaDB, NextAuth 4 (identifiants + JWT), Zod, React Hook Form, Recharts,
@react-pdf/renderer, Sonner.

## Deux portails

| Portail | Adresses | Connexion | Comptes |
| --- | --- | --- | --- |
| **Client** | site public (`/`, `/services`, `/formations`, `/a-propos`, `/contact`), `/inscription`, `/connexion`, espace `/espace` | `/connexion` | CLIENT (inscription libre depuis le site) |
| **Gestion** | `/gestion` (tableau de bord), `/gestion/clients`, `/gestion/creation-entreprise`, `/gestion/comptabilite`, `/gestion/attestations`, `/gestion/prospects`, `/gestion/admin` | `/gestion/connexion` | ADMIN, CONSEILLER (créés dans `/gestion/admin`) |

La séparation est imposée côté serveur : chaque page de connexion envoie son portail et `authorize`
(`src/lib/auth.ts`) refuse un compte d'un autre type ; le middleware renvoie chaque rôle vers son portail.

Demandes : toute demande (devis, inscription formation, attestation) se fait depuis l'espace client ;
les boutons du site y mènent en passant par la connexion ou l'inscription, avec le formulaire prérempli.
Seul un simple message reste possible sans compte (page Contact). L'équipe traite devis et messages
dans `/gestion/prospects`, les attestations dans `/gestion/attestations`.

Les anciennes adresses (`/login`, `/dashboard`, `/clients`…) redirigent vers les nouvelles.

## Développement local

Prérequis : Node.js 20+, un serveur MySQL 8 ou MariaDB 10.6+.

```bash
npm install
cp .env.example .env.local      # puis renseigner les valeurs
npm run db:migrate              # applique prisma/migrations
npm run db:seed                 # crée le compte ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                     # http://localhost:3000
```

Le CLI Prisma ne lit que `.env` : les scripts `db:*` et `prisma` chargent `.env.local` à sa place.
Utiliser `npm run prisma -- <commande>` au lieu de `npx prisma <commande>` (ex. `npm run db:studio`).

Autres commandes :

```bash
npm test          # tests des calculs comptables et de l'import CSV
npm run lint
npm run build     # prisma generate + next build
npm start
```

### Format d'import CSV

En-tête obligatoire, séparateur `;` ou `,` :

```
date;journal;piece;compte;libelle;debit;credit
05/01/2026;BANQUE;B001;521;Apport en capital;1000000;
05/01/2026;BANQUE;B001;101;Apport en capital;;1000000
```

Comptes au plan SYSCOHADA. Les écritures d'inventaire et de régularisation vont au journal `OD`.
Un fichier contenant une seule ligne invalide est refusé en entier.

## Déploiement Hostinger

1. hPanel : créer la base MySQL, puis l'application Node.js liée au dépôt GitHub (branche `main`).
2. Variables d'environnement dans hPanel :
   - `DATABASE_URL="mysql://UTILISATEUR:MOTDEPASSE@127.0.0.1:3306/BASE?connection_limit=5"`
     (`127.0.0.1` et non `localhost` : évite la résolution IPv6 ; `connection_limit=5` évite
     « Too many connections » sur l'hébergement mutualisé)
   - `NEXTAUTH_SECRET` : chaîne aléatoire longue (`openssl rand -base64 32`)
   - `NEXTAUTH_URL` : URL publique du site, ex. `https://app.cfdc.bj`
   - `UPLOAD_DIR` : dossier des pièces jointes **hors du dossier de l'application**, pour qu'un
     redéploiement ne les efface pas
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` : seulement pour le premier seed
3. Commande de build : `npm run build` ; démarrage : `npm start`.
4. Migrations (jamais dans le build), via SSH dans le dossier de l'application :
   `npx prisma migrate deploy`, puis `npx tsx prisma/seed.ts` pour le premier administrateur.
   Sur le serveur, les variables viennent de hPanel : `npx prisma` fonctionne directement.
5. Redémarrer l'application après tout changement de variables.

Sauvegarder régulièrement la base et le dossier `UPLOAD_DIR`.
