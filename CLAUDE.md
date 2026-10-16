# daeris.fr — starter « Site + Visibilité locale »

Site vitrine de Daeris (Brive-la-Gaillarde) **et** base du starter réutilisé pour les sites clients
(commerçants, restaurateurs, artisans, TPE). Contexte et offre : voir `BRIEF.md`.

## Stack
- Astro 7 (sortie statique), TypeScript strict
- Tailwind CSS 4 via `@tailwindcss/vite` — tokens dans `src/styles/global.css` (`@theme`)
- Keystatic (mode `local`) pour l'édition — admin sur `/keystatic` en dev
- Markdoc pour les contenus riches (blog, pages simples)
- `@astrojs/node` uniquement parce que les routes Keystatic sont rendues à la demande ; toutes les pages du site sont pré-rendues

## Commandes
- `npm run dev` (ou `npx astro dev --background`, puis `astro dev stop|status|logs`)
- `npm run build` — doit passer sans erreur avant tout commit
- Admin : http://127.0.0.1:4321/keystatic

## Organisation
```
keystatic.config.ts        Schéma de TOUS les contenus éditables
src/content/settings/*.yaml Singletons : site (NAP/SEO), home (textes des sections), offers (tarifs)
src/content/posts/*.mdoc    Blog (collection Keystatic + content collection Astro)
src/content/pages/*.mdoc    Pages simples servies à la racine (/mentions-legales…)
src/content.config.ts       Collections Astro (posts, pages) — schéma à garder aligné avec Keystatic
src/lib/content.ts          Lecture des singletons via le reader Keystatic (getSite/getHome/getOffers)
src/lib/schema.ts           JSON-LD LocalBusiness/ProfessionalService
src/components/             Composants de section réutilisables
src/layouts/BaseLayout.astro Shell HTML + SEO + header/footer
```

## Conventions
- **Aucun texte en dur dans les composants** : tout texte visible vient de Keystatic (singletons ou collections). Les composants reçoivent les données en props, typées depuis `src/lib/content.ts`.
- Une section = un composant (`Hero`, `Services`, `Pricing`, `Process`, `CallToAction`, `Contact`, `Footer`). Chaque section prend un `id` optionnel (ancre) et un titre `h2` relié par `aria-labelledby`.
- Ajouter un champ éditable : 1) `keystatic.config.ts`, 2) le YAML/MDOC de contenu, 3) le composant. Les types suivent automatiquement.
- Collections Markdoc : modifier le schéma dans `keystatic.config.ts` **et** `src/content.config.ts`.
- YAML : quoter les valeurs contenant « : » (typographie française) — sinon le build casse.
- Style : uniquement des utilitaires Tailwind + les classes de `global.css` (`container-site`, `label`, `btn btn-primary|btn-ghost`, `prose-site`). Pour un client, changer d'abord les tokens `@theme` (couleurs, police, tracking).
- Police auto-hébergée via `@fontsource-variable/*` (pas de Google Fonts, pour la perf et le RGPD).

## SEO / local
- NAP (nom, adresse, téléphone) : source unique `settings/site.yaml`, réutilisée par le footer, la section contact et le JSON-LD. Doit être **identique** à la fiche Google Business.
- Chaque page passe `title` / `description` à `BaseLayout` ; `Seo.astro` gère canonical, OpenGraph et JSON-LD.
- Sitemap généré par `@astrojs/sitemap` (exclut `/keystatic`), `public/robots.txt` pointe dessus.
- Objectif Lighthouse ≥ 95 sur les 4 axes : pas de JS client hors besoins ponctuels (menu mobile en `<details>`, petits scripts inline), images dimensionnées.

## Accessibilité
- Lien d'évitement, un seul `h1` par page, hiérarchie de titres continue, `:focus-visible` visible, labels sur tous les champs, éléments décoratifs en `aria-hidden`.
- Contraste : le texte secondaire utilise `text-muted` (#a3a3a3 sur #0a0a0a) ; ne pas descendre en dessous.

## Hors périmètre (pour l'instant)
Stats (Umami/Matomo), rapport mensuel automatisé, déploiement, endpoint du formulaire (champ `formEndpoint` dans Keystatic, envoi bloqué tant qu'il est vide), Keystatic en mode GitHub.

## Placeholders à remplacer
- Logos SVG officiels (wordmark typographique dans `Logo.astro`, loup PNG dans `Hero.astro`)
- Téléphone, adresse, SIRET, hébergeur (mentions légales)
- Tarifs : hypothèses à valider par Julien avant publication
