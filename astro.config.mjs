// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';

// Site statique : toutes les pages sont pré-rendues.
// Seules les routes /keystatic et /api/keystatic (injectées par l'intégration) sont servies à la demande,
// d'où l'adapter Node.
export default defineConfig({
  site: 'https://daeris.fr',
  trailingSlash: 'ignore',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/keystatic'),
    }),
  ],

  adapter: node({
    mode: 'standalone',
  }),
});
