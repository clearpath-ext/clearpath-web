// src/middleware.ts
// The Cloudflare adapter injects an /_image endpoint that fetches whatever URL
// it's given and serves the response from this domain (an open proxy, see
// GHSA for @astrojs/cloudflare < 12.6.6). No page uses astro:assets, so the
// endpoint is switched off entirely.

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === '/_image' || context.url.pathname.startsWith('/_image/')) {
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  }
  return next();
});
