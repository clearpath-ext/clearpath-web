# clearpath-web

The ClearPath project website, deployed at [clearpathext.com](https://clearpathext.com).

Built with Astro + Tailwind CSS, deployed on Cloudflare Pages.

---

## Stack

- **Hosting:** Cloudflare Pages
- **Framework:** Astro 5 with `@astrojs/cloudflare` 12 (static pages; `/api/notify` runs on demand). Stay on adapter 12: v13+ drops Cloudflare Pages support.
- **Styling:** Tailwind CSS 3
- **Email:** Resend sends the notify-me alerts; mail to hello@clearpathext.com is Google Workspace (see below)

---

## Local Development

```bash
pnpm install
pnpm dev     # http://localhost:4321
```

---

## Deployment (Cloudflare Pages)

The site auto-deploys on every push to `main` via Cloudflare Pages GitHub integration.

### First-time setup

1. Go to Cloudflare Dashboard → Pages → Create a project → Connect to Git
2. Select `clearpath-ext/clearpath-web`
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `pnpm run build`
   - **Output directory:** `dist`
4. Add environment variables (see below)
5. Deploy

### Manual deploy

```bash
npx wrangler pages deploy dist --project-name clearpath-web
```

---

## Environment Variables

Set in Cloudflare Pages dashboard under **Settings → Environment Variables**, or via CLI:

```bash
npx wrangler pages secret put RESEND_API_KEY
npx wrangler pages secret put FORWARD_TO_EMAIL
```

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key (sends the notify-me emails) |
| `FORWARD_TO_EMAIL` | Where notify-me signups go (`hello@clearpathext.com`) |

Copy `.env.example` to `.env` for local development.

---

## Email (hello@clearpathext.com)

Mail for clearpathext.com is Google Workspace: the MX, SPF and `google._domainkey`
DKIM records point at Google, and `hello@` is an alias on the ClearPath Workspace
user. The site's own emails still go out through Resend, which has its records on
`send.clearpathext.com` and `resend._domainkey`; don't remove those.

This site only sends one kind of email: `/api/notify` forwards "notify me when
ClearPath launches" signups to `FORWARD_TO_EMAIL`.

---

## Roadmap

[clearpathext.com/roadmap](https://clearpathext.com/roadmap/) (`src/pages/roadmap.astro`) lists what's shipped and what's planned:

- **v0.8.0:** onboarding.
- **v0.9.0:** polish and a security audit.
- **v1.0.0:** the Chrome Web Store listing.
- **After v1.0:** Firefox.

The work for each version is tracked as issues in the extension repo's [milestones](https://github.com/clearpath-ext/clearpath-extension/milestones). When a release ships or the plan changes, update `roadmap.astro`, the roadmap in the [org profile](https://github.com/clearpath-ext/.github/blob/main/profile/README.md), and the extension README together.

## Project Structure

```
src/
├── pages/
│   ├── index.astro           # Homepage (scroll demo, read-aloud demo, FAQ)
│   ├── install.astro         # Download, load-unpacked steps, notify-me form
│   ├── roadmap.astro         # Shipped releases and what's next (linked to milestones)
│   ├── brand.astro           # Brand guide
│   ├── privacy.astro         # Privacy policy
│   ├── 404.astro
│   ├── api/
│   │   └── notify.ts         # Notify-me form → Resend
│   └── docs/                 # getting-started, api-setup, profiles, symbols, vocabulary
├── components/
│   ├── Nav.astro             # Docs · Roadmap · Install, pause-animations toggle
│   ├── Footer.astro
│   ├── DeclutterDemo.astro   # Homepage "clear up" scroll demo
│   └── Icon.astro            # Lucide line icons
├── layouts/
│   └── Base.astro            # Head, CSP-safe scripts, JSON-LD
├── middleware.ts             # Blocks the /_image endpoint
└── styles/
    └── global.css
public/
├── js/                       # Page scripts (CSP: script-src 'self'): logo-draw, motion-pref
├── css/motion.css            # Pause-animations styles
├── _headers                  # Security headers and CSP
├── llms.txt, sitemap.xml, robots.txt
└── video/, symbols/, screenshots/, brand-assets/
```
