import { defineConfig, passthroughImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://clearpathext.com',
  output: 'hybrid',
  adapter: cloudflare(),
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
});
