# POC daeris.fr — brief pour Claude Code

## Contexte
Julien (Daeris, freelance fullstack PHP/TS, 15+ ans, expert WordPress/Laravel/Symfony + SEO) fait évoluer son offre :
on quitte le WordPress custom (Timber + ACF Pro, WP Rocket, SecuPress, mutu OVH) pour une offre
« Site + Visibilité locale » destinée aux commerçants, restaurateurs, TPE/PME.
Le site daeris.fr est le POC : il doit PRÉSENTER cette offre ET être construit avec la nouvelle stack.
Doc de référence de l'offre : https://claude.ai/code/artifact/f8d24a88-6387-4272-9543-7312b9374143

## Périmètre du POC
- Astro + Tailwind (site statique)
- Keystatic pour l'édition des contenus (mode local d'abord, GitHub ensuite)
- HORS périmètre pour l'instant : stats Umami/Matomo, rapport mensuel automatisé, déploiement

## Positionnement
- Zone : Brive-la-Gaillarde (et alentours / Corrèze). Le site actuel cible Marne-la-Vallée → à changer.
- Cibles : commerçants, restaurateurs, artisans, TPE/PME locales.
- Message : vendre un résultat (être trouvé localement), le site est une brique de l'offre.

## Charte (inchangée)
- Logo : loup géométrique filaire blanc sur fond noir + wordmark « DΛΞRIS » (A = Λ, E = Ξ), baseline « CRÉATION DIGITALE » en capitales très espacées.
- Ambiance : noir / blanc, lignes fines, typo sans-serif géométrique fine et très espacée.
- Logos à demander à Julien (SVG) — en attendant, placeholder.

## Contenu : reprendre et ajuster la trame actuelle de daeris.fr
Actuel = one-page « Agence de création digitale », 4 pôles avec texte court + citation :
Communication (image de marque), Emarketing (attirer des clients), Optimisation (performances des supports), Développement (web).
Menu : Accueil, Expertise, Méthodologie, Contact, Blog. Intro animée (« revoir l'intro »).

Ajustement proposé :
- Hero : visibilité locale à Brive, le loup en visuel.
- Les 4 pôles conservés mais réécrits autour de l'offre locale.
- Section offres :
  - Packs : Présence locale (site 5-7 pages + fiche Google + schema + Search Console, 2 500-4 000 € HT), Croissance (4 000-7 000 €), Sur mesure (6 000-10 000 €)
  - Abonnement Visibilité : Essentiel 59-79 €/mois, Visibilité 129-169 €/mois, Croissance 249-349 €/mois
  (prix = hypothèses, à faire valider par Julien avant publication)
- Méthodologie : découverte → maquette en ligne → construction → contenus → mise en ligne → suivi mensuel avec rapport.
- Contact (formulaire, endpoint à brancher plus tard), mentions légales, blog (collection Keystatic).

## Exigences techniques
- Composants réutilisables (ce repo servira de base au « starter » client) : Hero, Services, Offres/Pricing, Process, CTA, Contact, Footer.
- SEO : meta, OpenGraph, sitemap, JSON-LD (ProfessionalService / LocalBusiness, adresse Brive), NAP cohérent.
- Lighthouse visé ≥ 95 partout, accessibilité soignée.
- Contenus éditables dans Keystatic : textes des sections, offres/prix, articles de blog, coordonnées.
- Écrire un CLAUDE.md décrivant les conventions du starter.

## Première étape suggérée
1. `npm create astro@latest daeris-astro` (template minimal, TypeScript strict), ajouter Tailwind et Keystatic.
2. Poser la structure + la home avec contenus provisoires.
3. Montrer le rendu à Julien avant d'aller plus loin.
