import { config, collection, fields, singleton } from '@keystatic/core';

/**
 * Schéma des contenus éditables.
 * - Singletons « settings/* » : données structurées (YAML) lues via src/lib/content.ts
 * - Collections « posts » / « pages » : Markdoc, exposées aussi comme content collections Astro
 *   (cf. src/content.config.ts) pour profiter de render().
 */

const cta = (label: string) =>
  fields.object(
    {
      label: fields.text({ label: 'Libellé', validation: { isRequired: true } }),
      href: fields.text({ label: 'Lien (ex. #contact)', validation: { isRequired: true } }),
    },
    { label },
  );

const offer = fields.object({
  name: fields.text({ label: 'Nom', validation: { isRequired: true } }),
  tagline: fields.text({ label: 'Accroche' }),
  priceMin: fields.integer({ label: 'Prix min (€)', validation: { isRequired: true } }),
  priceMax: fields.integer({ label: 'Prix max (€)' }),
  priceUnit: fields.text({ label: 'Unité', defaultValue: 'HT' }),
  features: fields.array(fields.text({ label: 'Élément' }), {
    label: 'Inclus',
    itemLabel: (props) => props.value,
  }),
  highlighted: fields.checkbox({ label: 'Mise en avant', defaultValue: false }),
});

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Daeris' },
    navigation: {
      Site: ['site', 'home', 'offers'],
      Contenus: ['posts', 'pages'],
    },
  },

  singletons: {
    site: singleton({
      label: 'Coordonnées & SEO',
      path: 'src/content/settings/site',
      format: { data: 'yaml' },
      schema: {
        name: fields.text({ label: 'Nom commercial', validation: { isRequired: true } }),
        legalName: fields.text({ label: 'Raison sociale' }),
        tagline: fields.text({ label: 'Baseline' }),
        description: fields.text({ label: 'Description SEO par défaut', multiline: true }),
        phone: fields.text({ label: 'Téléphone (affiché)' }),
        phoneE164: fields.text({ label: 'Téléphone (format +33…)' }),
        email: fields.text({ label: 'Email' }),
        street: fields.text({ label: 'Adresse' }),
        postalCode: fields.text({ label: 'Code postal' }),
        city: fields.text({ label: 'Ville' }),
        region: fields.text({ label: 'Région' }),
        latitude: fields.text({ label: 'Latitude' }),
        longitude: fields.text({ label: 'Longitude' }),
        areaServed: fields.array(fields.text({ label: 'Zone' }), {
          label: 'Zones desservies',
          itemLabel: (props) => props.value,
        }),
        openingHours: fields.text({ label: 'Horaires (affichés)' }),
        siret: fields.text({ label: 'SIRET' }),
        formEndpoint: fields.text({
          label: 'Endpoint du formulaire de contact',
          description: 'Laisser vide tant que le service d’envoi n’est pas branché.',
        }),
        social: fields.array(
          fields.object({
            label: fields.text({ label: 'Réseau' }),
            url: fields.url({ label: 'URL' }),
          }),
          { label: 'Réseaux sociaux', itemLabel: (props) => props.fields.label.value },
        ),
      },
    }),

    home: singleton({
      label: 'Page d’accueil',
      path: 'src/content/settings/home',
      format: { data: 'yaml' },
      schema: {
        seoTitle: fields.text({ label: 'Titre SEO' }),
        seoDescription: fields.text({ label: 'Description SEO', multiline: true }),
        hero: fields.object(
          {
            eyebrow: fields.text({ label: 'Surtitre' }),
            title: fields.text({ label: 'Titre (H1)', validation: { isRequired: true } }),
            subtitle: fields.text({ label: 'Sous-titre', multiline: true }),
            primary: cta('Bouton principal'),
            secondary: cta('Bouton secondaire'),
          },
          { label: 'Hero' },
        ),
        services: fields.object(
          {
            eyebrow: fields.text({ label: 'Surtitre' }),
            title: fields.text({ label: 'Titre' }),
            intro: fields.text({ label: 'Introduction', multiline: true }),
            items: fields.array(
              fields.object({
                title: fields.text({ label: 'Pôle' }),
                text: fields.text({ label: 'Texte', multiline: true }),
                quote: fields.text({ label: 'Citation' }),
              }),
              { label: 'Pôles', itemLabel: (props) => props.fields.title.value },
            ),
          },
          { label: 'Expertise (4 pôles)' },
        ),
        offers: fields.object(
          {
            eyebrow: fields.text({ label: 'Surtitre' }),
            title: fields.text({ label: 'Titre' }),
            intro: fields.text({ label: 'Introduction', multiline: true }),
          },
          { label: 'Offres (en-tête de section)' },
        ),
        process: fields.object(
          {
            eyebrow: fields.text({ label: 'Surtitre' }),
            title: fields.text({ label: 'Titre' }),
            intro: fields.text({ label: 'Introduction', multiline: true }),
            steps: fields.array(
              fields.object({
                title: fields.text({ label: 'Étape' }),
                text: fields.text({ label: 'Texte', multiline: true }),
              }),
              { label: 'Étapes', itemLabel: (props) => props.fields.title.value },
            ),
          },
          { label: 'Méthodologie' },
        ),
        cta: fields.object(
          {
            title: fields.text({ label: 'Titre' }),
            text: fields.text({ label: 'Texte', multiline: true }),
            button: cta('Bouton'),
          },
          { label: 'Bandeau d’appel à l’action' },
        ),
        contact: fields.object(
          {
            eyebrow: fields.text({ label: 'Surtitre' }),
            title: fields.text({ label: 'Titre' }),
            intro: fields.text({ label: 'Introduction', multiline: true }),
          },
          { label: 'Contact' },
        ),
      },
    }),

    offers: singleton({
      label: 'Offres & tarifs',
      path: 'src/content/settings/offers',
      format: { data: 'yaml' },
      schema: {
        disclaimer: fields.text({ label: 'Mention sous les tarifs', multiline: true }),
        packsTitle: fields.text({ label: 'Titre — packs' }),
        packsIntro: fields.text({ label: 'Intro — packs', multiline: true }),
        packs: fields.array(offer, { label: 'Packs', itemLabel: (props) => props.fields.name.value }),
        subscriptionsTitle: fields.text({ label: 'Titre — abonnements' }),
        subscriptionsIntro: fields.text({ label: 'Intro — abonnements', multiline: true }),
        subscriptions: fields.array(offer, {
          label: 'Abonnements',
          itemLabel: (props) => props.fields.name.value,
        }),
      },
    }),
  },

  collections: {
    posts: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishedDate'],
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        description: fields.text({ label: 'Résumé / meta description', multiline: true }),
        publishedDate: fields.date({ label: 'Date de publication', validation: { isRequired: true } }),
        draft: fields.checkbox({ label: 'Brouillon', defaultValue: false }),
        content: fields.markdoc({ label: 'Contenu' }),
      },
    }),

    pages: collection({
      label: 'Pages simples',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        description: fields.text({ label: 'Meta description', multiline: true }),
        content: fields.markdoc({ label: 'Contenu' }),
      },
    }),
  },
});
