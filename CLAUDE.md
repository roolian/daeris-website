# daeris.fr — starter « Site + Visibilité locale » (variante TinaCMS)

Site vitrine de Daeris (Brive-la-Gaillarde) **et** base du starter réutilisé pour les sites clients
(commerçants, restaurateurs, artisans, TPE). Contexte et offre : voir `BRIEF.md`.

## Stack
- Astro 7 (sortie statique), TypeScript strict
- Tailwind CSS 4 via `@tailwindcss/vite` — tokens dans `src/styles/global.css` (`@theme`)
- TinaCMS (mode local, sans Tina Cloud) pour l'édition — admin sur `/admin/index.html` en dev
- Markdown (`.md`) pour les contenus riches (blog, pages simples)
- Édition visuelle (clic-pour-éditer, aperçu en direct) via `@tinacms/astro` sur la home
- Pages pré-rendues ; `@astrojs/node` sert uniquement la route `/tina-island/[name]` (re-rendu des zones éditables en dev)

## Commandes
- `npm run dev` — lance Tina (GraphQL sur :4001) **et** Astro (:4321)
- `npm run dev:site` — Astro seul, sans CMS
- `npm run build` — démarre le serveur GraphQL local de Tina puis `astro build` (la home lit ses données via le client Tina) ; doit passer avant tout commit
- `npm run build:site` — `astro build` seul (échoue si Tina ne tourne pas, à cause de la home)
- Admin : http://localhost:4321/admin/index.html
- Agent (Claude) : Astro 7 passe `astro dev` en arrière-plan quand il détecte un agent, ce qui fait quitter Tina. Lancer `npx tinacms dev -c "astro dev --ignore-lock"`.

## Organisation
```
tina/config.ts              Schéma de TOUS les contenus éditables (côté CMS)
src/content/settings/*.yaml Singletons : site (NAP/SEO), home (textes des sections), offers (tarifs)
src/content/posts/*.md      Blog
src/content/pages/*.md      Pages simples servies à la racine (/mentions-legales…)
src/content.config.ts       Schémas zod de toutes les collections (singletons inclus) — à garder aligné avec tina/config.ts
src/lib/content.ts          getSite/getHome/getOffers + types, via getEntry (layout, blog…)
src/lib/tina.ts             loadHomeData() via le client Tina + helper tf() pour data-tina-field
src/lib/tina-islands.ts     Registre des zones éditables visuellement (name → fetch + composant)
src/pages/tina-island/      Route à la demande appelée par l'éditeur visuel
src/lib/schema.ts           JSON-LD LocalBusiness/ProfessionalService
src/components/             Composants de section réutilisables
src/layouts/BaseLayout.astro Shell HTML + SEO + header/footer
```

## Conventions
- **Aucun texte en dur dans les composants** : tout texte visible vient des contenus éditables dans Tina (singletons ou collections). Les composants reçoivent les données en props, typées depuis `src/lib/content.ts`.
- Une section = un composant (`Hero`, `Services`, `Pricing`, `Process`, `CallToAction`, `Contact`, `Footer`). Chaque section prend un `id` optionnel (ancre) et un titre `h2` relié par `aria-labelledby`.
- Ajouter un champ éditable : 1) `tina/config.ts`, 2) `src/content.config.ts` (zod), 3) le YAML/MD de contenu, 4) le composant. Les types des composants suivent le schéma zod.
- Édition visuelle : une page éditable charge ses données avec `requestWithMetadata()` (src/lib/tina.ts), enveloppe son contenu dans `<TinaIsland name=… primary>` et déclare l'îlot dans `src/lib/tina-islands.ts` (même wrapper). Chaque texte reçoit `data-tina-field={tf(objet, 'champ')}` ; pour un élément de liste : `tf(parent, 'liste', index)`.
- Le reste du site (layout, blog, pages simples) lit les fichiers via les content collections Astro, sans Tina.
- `ui.router` dans `tina/config.ts` indique à l'admin quelle URL prévisualiser pour un document.
- YAML édité à la main : quoter les valeurs contenant « : » (typographie française) — sinon le build casse. Tina gère le quoting lui-même à l'enregistrement.
- Style : uniquement des utilitaires Tailwind + les classes de `global.css` (`container-site`, `label`, `btn btn-primary|btn-ghost`, `prose-site`). Pour un client, changer d'abord les tokens `@theme` (couleurs, police, tracking).
- Police auto-hébergée via `@fontsource-variable/*` (pas de Google Fonts, pour la perf et le RGPD).

## SEO / local
- NAP (nom, adresse, téléphone) : source unique `settings/site.yaml`, réutilisée par le footer, la section contact et le JSON-LD. Doit être **identique** à la fiche Google Business.
- Chaque page passe `title` / `description` à `BaseLayout` ; `Seo.astro` gère canonical, OpenGraph et JSON-LD.
- Sitemap généré par `@astrojs/sitemap` (exclut `/admin`), `public/robots.txt` pointe dessus.
- Objectif Lighthouse ≥ 95 sur les 4 axes : pas de JS client hors besoins ponctuels (menu mobile en `<details>`, petits scripts inline), images dimensionnées.

## Accessibilité
- Lien d'évitement, un seul `h1` par page, hiérarchie de titres continue, `:focus-visible` visible, labels sur tous les champs, éléments décoratifs en `aria-hidden`.
- Contraste : le texte secondaire utilise `text-muted` (#a3a3a3 sur #0a0a0a) ; ne pas descendre en dessous.

## Hors périmètre (pour l'instant)
Stats (Umami/Matomo), rapport mensuel automatisé, déploiement, endpoint du formulaire (champ `formEndpoint` dans Tina, envoi bloqué tant qu'il est vide), Tina Cloud / édition en production, édition visuelle du blog et des pages simples (rendu via `TinaMarkdown`), retrait de `public/admin` et des attributs `data-tina-field` du build de prod.

## Placeholders à remplacer
- Logos SVG officiels (wordmark typographique dans `Logo.astro`, loup PNG dans `Hero.astro`)
- Téléphone, adresse, SIRET, hébergeur (mentions légales)
- Tarifs : hypothèses à valider par Julien avant publication
