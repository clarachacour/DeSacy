// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Pages are prerendered as static HTML; only /api/inquiry runs on Vercel as a function.
export default defineConfig({
  // Replace with the final domain once it is bought.
  site: 'https://desacy.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  trailingSlash: 'never',
});
