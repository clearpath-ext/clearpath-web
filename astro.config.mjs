import { defineConfig, passthroughImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://clearpathext.com',
  // Static pages; /api/notify opts into on-demand rendering (prerender = false)
  adapter: cloudflare({ imageService: 'passthrough' }),
  // Nothing uses Astro sessions; an explicit driver stops the adapter from
  // requiring a SESSION KV binding
  session: { driver: 'memory' },
  redirects: {
    '/docs': '/docs/getting-started/',
    '/changelog': 'https://github.com/clearpath-ext/clearpath-extension/releases',
  },
  image: {
    service: passthroughImageService(),
  },
  // Never inline page scripts: keeping every script in /_astro/ files lets the
  // CSP in public/_headers stay at script-src 'self' (no 'unsafe-inline')
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
});
