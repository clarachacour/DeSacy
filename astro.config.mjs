// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Pages are prerendered as static HTML; only /api/inquiry runs on Vercel as a function.
export default defineConfig({
  // desacy.com redirects to www in Vercel, so www is the canonical address.
  site: 'https://www.desacy.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  trailingSlash: 'never',
});
