import { defineConfig, type TinaField } from 'tinacms';

/**
 * Schéma des contenus éditables dans TinaCMS (admin : /admin).
 * Astro lit les mêmes fichiers via src/content.config.ts : garder les deux schémas alignés.
 */

const str = (name: string, label: string, extra: Partial<TinaField> = {}): TinaField =>
  ({ type: 'string', name, label, ...extra }) as TinaField;
const textarea = (name: string, label: string) => str(name, label, { ui: { component: 'textarea' } });

const cta = (name: string, label: string): TinaField => ({
  type: 'object',
  name,
  label,
  fields: [str('label', 'Libellé', { required: true }), str('href', 'Lien (ex. #contact)', { required: true })],
});

const section = [str('eyebrow', 'Surtitre'), str('title', 'Titre'), textarea('intro', 'Introduction')];

const offerFields: TinaField[] = [
  str('name', 'Nom', { required: true, isTitle: true }),
  str('tagline', 'Accroche'),
  { type: 'number', name: 'priceMin', label: 'Prix min (€)', required: true },
  { type: 'number', name: 'priceMax', label: 'Prix max (€)' },
  str('priceUnit', 'Unité'),
  str('features', 'Inclus', { list: true }),
  { type: 'boolean', name: 'highlighted', label: 'Mise en avant' },
];

const offerList = (name: string, label: string): TinaField => ({
  type: 'object',
  name,
  label,
  list: true,
  ui: { itemProps: (item: Record<string, string>) => ({ label: item?.name }) },
  fields: offerFields,
});

// Singleton = collection d'un seul fichier, sans création ni suppression.
const singleton = (name: string, label: string, fields: TinaField[]) => ({
  name,
  label,
  path: 'src/content/settings',
  format: 'yaml' as const,
  match: { include: name },
  ui: {
    allowedActions: { create: false, delete: false },
    // Les 3 singletons alimentent la home : l'admin l'ouvre en aperçu (édition visuelle).
    router: () => '/',
  },
  fields,
});

export default defineConfig({
  // Mode local : pas de Tina Cloud. clientId/token à renseigner le jour où on passe en mode « cloud ».
  branch: process.env.TINA_BRANCH || process.env.HEAD || 'main',
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: { outputFolder: 'admin', publicFolder: 'public' },
  media: { tina: { mediaRoot: 'uploads', publicFolder: 'public' } },

  schema: {
    collections: [
      singleton('site', 'Coordonnées & SEO', [
        str('name', 'Nom commercial', { required: true }),
        str('legalName', 'Raison sociale'),
        str('tagline', 'Baseline'),
        textarea('description', 'Description SEO par défaut'),
        str('phone', 'Téléphone (affiché)'),
        str('phoneE164', 'Téléphone (format +33…)'),
        str('email', 'Email'),
        str('street', 'Adresse'),
        str('postalCode', 'Code postal', { required: true }),
        str('city', 'Ville', { required: true }),
        str('region', 'Région'),
        str('latitude', 'Latitude'),
        str('longitude', 'Longitude'),
        str('areaServed', 'Zones desservies', { list: true }),
        str('openingHours', 'Horaires (affichés)'),
        str('siret', 'SIRET'),
        str('formEndpoint', 'Endpoint du formulaire de contact', {
          description: 'Laisser vide tant que le service d’envoi n’est pas branché.',
        }),
        {
          type: 'object',
          name: 'social',
          label: 'Réseaux sociaux',
          list: true,
          ui: { itemProps: (item: Record<string, string>) => ({ label: item?.label }) },
          fields: [str('label', 'Réseau'), str('url', 'URL')],
        },
      ]),

      singleton('home', 'Page d’accueil', [
        str('seoTitle', 'Titre SEO'),
        textarea('seoDescription', 'Description SEO'),
        {
          type: 'object',
          name: 'hero',
          label: 'Hero',
          fields: [
            str('eyebrow', 'Surtitre'),
            str('title', 'Titre (H1)', { required: true }),
            textarea('subtitle', 'Sous-titre'),
            cta('primary', 'Bouton principal'),
            cta('secondary', 'Bouton secondaire'),
          ],
        },
        {
          type: 'object',
          name: 'services',
          label: 'Expertise (4 pôles)',
          fields: [
            ...section,
            {
              type: 'object',
              name: 'items',
              label: 'Pôles',
              list: true,
              ui: { itemProps: (item: Record<string, string>) => ({ label: item?.title }) },
              fields: [str('title', 'Pôle'), textarea('text', 'Texte'), str('quote', 'Citation')],
            },
          ],
        },
        { type: 'object', name: 'offers', label: 'Offres (en-tête de section)', fields: section },
        {
          type: 'object',
          name: 'process',
          label: 'Méthodologie',
          fields: [
            ...section,
            {
              type: 'object',
              name: 'steps',
              label: 'Étapes',
              list: true,
              ui: { itemProps: (item: Record<string, string>) => ({ label: item?.title }) },
              fields: [str('title', 'Étape'), textarea('text', 'Texte')],
            },
          ],
        },
        {
          type: 'object',
          name: 'cta',
          label: 'Bandeau d’appel à l’action',
          fields: [str('title', 'Titre'), textarea('text', 'Texte'), cta('button', 'Bouton')],
        },
        { type: 'object', name: 'contact', label: 'Contact', fields: section },
      ]),

      singleton('offers', 'Offres & tarifs', [
        textarea('disclaimer', 'Mention sous les tarifs'),
        str('packsTitle', 'Titre — packs'),
        textarea('packsIntro', 'Intro — packs'),
        offerList('packs', 'Packs'),
        str('subscriptionsTitle', 'Titre — abonnements'),
        textarea('subscriptionsIntro', 'Intro — abonnements'),
        offerList('subscriptions', 'Abonnements'),
      ]),

      {
        name: 'posts',
        label: 'Blog',
        path: 'src/content/posts',
        format: 'md',
        fields: [
          str('title', 'Titre', { required: true, isTitle: true }),
          textarea('description', 'Résumé / meta description'),
          { type: 'datetime', name: 'publishedDate', label: 'Date de publication', required: true },
          { type: 'boolean', name: 'draft', label: 'Brouillon' },
          { type: 'rich-text', name: 'body', label: 'Contenu', isBody: true },
        ],
      },

      {
        name: 'pages',
        label: 'Pages simples',
        path: 'src/content/pages',
        format: 'md',
        fields: [
          str('title', 'Titre', { required: true, isTitle: true }),
          textarea('description', 'Meta description'),
          { type: 'rich-text', name: 'body', label: 'Contenu', isBody: true },
        ],
      },
    ],
  },
});
