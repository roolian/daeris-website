# daeris.fr — starter « Site + Visibilité locale » (variante Pages CMS)

Site vitrine de Daeris (Brive-la-Gaillarde) **et** base du starter réutilisé pour les sites clients
(commerçants, restaurateurs, artisans, TPE). Contexte et offre : voir `BRIEF.md`.

## Stack
- Astro 7 (sortie statique), TypeScript strict
- Tailwind CSS 4 via `@tailwindcss/vite` — tokens dans `src/styles/global.css` (`@theme`)
- Pages CMS pour l'édition : back-office en ligne, hors du site, partagé entre tous les clients. Schéma dans `.pages.yml`
- Markdown (`.md`) pour les contenus riches (blog, pages simples)
- Site 100 % statique : aucun code CMS, aucun adapter, aucun JS framework

## Commandes
- `npm run dev` (ou `npx astro dev --background`, puis `astro dev stop|status|logs`)
- `npm run build` — doit passer sans erreur avant tout commit

## Flux d'édition
Le client reçoit une invitation par email, se connecte avec un code à usage unique (sans compte GitHub) et enregistre : Pages CMS commit dans le dépôt, et le commit déclenche le build et le déploiement. Le client ne voit que le dépôt où il est invité.

## Organisation
```
.pages.yml                  Schéma de TOUS les contenus éditables (côté CMS)
src/content/settings/*.yaml Singletons : site (NAP/SEO), home (textes des sections), offers (tarifs)
src/content/posts/*.md      Blog
src/content/pages/*.md      Pages simples servies à la racine (/mentions-legales…)
src/content.config.ts       Schémas zod de toutes les collections (singletons inclus) — à garder aligné avec .pages.yml
src/lib/content.ts          getSite/getHome/getOffers + types, via getEntry
public/uploads/             Images envoyées depuis le back-office
src/lib/schema.ts           JSON-LD LocalBusiness/ProfessionalService
src/components/             Composants de section réutilisables
src/layouts/BaseLayout.astro Shell HTML + SEO + header/footer
```

## Conventions
- **Aucun texte en dur dans les composants** : tout texte visible vient des contenus éditables (singletons ou collections). Les composants reçoivent les données en props, typées depuis `src/lib/content.ts`.
- Une section = un composant (`Hero`, `Services`, `Pricing`, `Process`, `CallToAction`, `Contact`, `Footer`). Chaque section prend un `id` optionnel (ancre) et un titre `h2` relié par `aria-labelledby`.
- Ajouter un champ éditable : 1) `.pages.yml`, 2) `src/content.config.ts` (zod), 3) le YAML/MD de contenu, 4) le composant. Les types des composants suivent le schéma zod.
- Champs optionnels : `nullish()` dans `src/content.config.ts`, car un champ vidé dans le CMS peut être enregistré à `null`. Les composants testent donc la valeur avant de l'afficher.
- Champs techniques : `hidden: true` dans `.pages.yml`. Ils ne sont conservés à l'enregistrement que grâce à `settings.content.merge: true` : ne pas retirer ce réglage.
- Labels de `.pages.yml` en français simple, écrits pour un commerçant (« Titre pour Google », pas « seoTitle »).
- YAML édité à la main : quoter les valeurs contenant « : » (typographie française) — sinon le build casse. Le CMS gère le quoting lui-même à l'enregistrement.
- Style : uniquement des utilitaires Tailwind + les classes de `global.css` (`container-site`, `label`, `btn btn-primary|btn-ghost`, `prose-site`). Pour un client, changer d'abord les tokens `@theme` (couleurs, police, tracking).
- Police auto-hébergée via `@fontsource-variable/*` (pas de Google Fonts, pour la perf et le RGPD).

## SEO / local
- NAP (nom, adresse, téléphone) : source unique `settings/site.yaml`, réutilisée par le footer, la section contact et le JSON-LD. Doit être **identique** à la fiche Google Business.
- Chaque page passe `title` / `description` à `BaseLayout` ; `Seo.astro` gère canonical, OpenGraph et JSON-LD.
- Sitemap généré par `@astrojs/sitemap`, `public/robots.txt` pointe dessus.
- Objectif Lighthouse ≥ 95 sur les 4 axes : pas de JS client hors besoins ponctuels (menu mobile en `<details>`, petits scripts inline), images dimensionnées.

## Accessibilité
- Lien d'évitement, un seul `h1` par page, hiérarchie de titres continue, `:focus-visible` visible, labels sur tous les champs, éléments décoratifs en `aria-hidden`.
- Contraste : le texte secondaire utilise `text-muted` (#a3a3a3 sur #0a0a0a) ; ne pas descendre en dessous.

## Hors périmètre (pour l'instant)
Stats (Umami/Matomo), rapport mensuel automatisé, déploiement, instance Pages CMS (VPS, PostgreSQL, GitHub App, envoi d'emails), endpoint du formulaire (champ `formEndpoint`, masqué dans le CMS, envoi bloqué tant qu'il est vide), édition visuelle.

## Placeholders à remplacer
- Logos SVG officiels (wordmark typographique dans `Logo.astro`, loup PNG dans `Hero.astro`)
- Téléphone, adresse, SIRET, hébergeur (mentions légales)
- Tarifs : hypothèses à valider par Julien avant publication
