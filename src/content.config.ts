import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Les collections Markdoc éditées dans Keystatic (cf. keystatic.config.ts) sont aussi
// déclarées ici pour être rendues par Astro. Garder les deux schémas synchronisés.
const posts = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, pages };
