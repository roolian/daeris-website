// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Site 100 % statique. Le back-office (Pages CMS) vit en dehors du site : il commit dans le
// dépôt GitHub, et chaque commit déclenche un nouveau build.
export default defineConfig({
  site: 'https://daeris.fr',
  trailingSlash: 'ignore',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
