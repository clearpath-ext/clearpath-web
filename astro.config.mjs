import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://clearpathext.com',
  output: 'hybrid', // Static by default, API routes are serverless
  adapter: vercel(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
  ],
});
