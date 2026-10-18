// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

// Pages pré-rendues (sortie statique). Seule la route /tina-island/[name] — utilisée par
// l'édition visuelle de TinaCMS pour re-rendre une zone pendant la saisie — est servie à la
// demande, d'où l'adapter Node.
export default defineConfig({
  site: 'https://daeris.fr',
  trailingSlash: 'ignore',

  vite: {
    plugins: [tailwindcss(), tinaAdminDevRedirect()],
  },

  integrations: [
    react(),
    tina(),
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/tina-island'),
    }),
  ],

  adapter: node({
    mode: 'standalone',
  }),
});
