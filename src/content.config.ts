import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Schémas lus par Astro. Les mêmes champs sont déclarés côté CMS dans tina/config.ts :
// garder les deux alignés.

const text = z.string().optional();
const cta = z.object({ label: z.string(), href: z.string() });

const offer = z.object({
  name: z.string(),
  tagline: text,
  priceMin: z.number(),
  priceMax: z.number().optional(),
  priceUnit: z.string().default('HT'),
  features: z.array(z.string()).default([]),
  highlighted: z.boolean().default(false),
});

// Singletons YAML : un fichier = une collection d'une seule entrée.
const singleton = <T extends z.ZodTypeAny>(file: string, schema: T) =>
  defineCollection({ loader: glob({ pattern: `${file}.yaml`, base: './src/content/settings' }), schema });

const site = singleton(
  'site',
  z.object({
    name: z.string(),
    legalName: text,
    tagline: text,
    description: z.string().default(''),
    phone: text,
    phoneE164: text,
    email: text,
    street: text,
    postalCode: z.string(),
    city: z.string(),
    region: text,
    latitude: text,
    longitude: text,
    areaServed: z.array(z.string()).default([]),
    openingHours: text,
    siret: text,
    formEndpoint: text,
    social: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  }),
);

const section = { eyebrow: text, title: text, intro: text };

const home = singleton(
  'home',
  z.object({
    seoTitle: text,
    seoDescription: text,
    hero: z.object({ eyebrow: text, title: z.string(), subtitle: text, primary: cta, secondary: cta }),
    services: z.object({
      ...section,
      items: z.array(z.object({ title: z.string(), text: z.string(), quote: text })).default([]),
    }),
    offers: z.object(section),
    process: z.object({ ...section, steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]) }),
    cta: z.object({ title: z.string(), text: text, button: cta }),
    contact: z.object(section),
  }),
);

const offers = singleton(
  'offers',
  z.object({
    disclaimer: text,
    packsTitle: text,
    packsIntro: text,
    packs: z.array(offer).default([]),
    subscriptionsTitle: text,
    subscriptionsIntro: text,
    subscriptions: z.array(offer).default([]),
  }),
);

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { site, home, offers, posts, pages };
