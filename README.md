# clearpath-web

The ClearPath project website, deployed at [clearpathext.com](https://clearpathext.com).

Built with Astro + Tailwind CSS, deployed on Cloudflare Pages.

---

## Stack

- **Hosting:** Cloudflare Pages
- **Framework:** Astro 4 (hybrid — static + serverless API routes)
- **Styling:** Tailwind CSS
- **Email:** Resend (inbound forwarding + sending)

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
| `FORWARD_TO_EMAIL` | Your personal inbox for notify-me signups |

Copy `.env.example` to `.env` for local development.

---

## Email (hello@clearpathext.com)

Incoming mail doesn't touch this site. Cloudflare Email Routing (the MX records on
clearpathext.com) hands each message to the `clearpath-email` Worker, which forwards
it to your inbox through Resend with Reply-To set to the sender. Outgoing mail from
`hello@clearpathext.com` is sent through Resend.

This site only sends one kind of email: `/api/notify` forwards "notify me when
ClearPath launches" signups to `FORWARD_TO_EMAIL`.

---

## Project Structure

```
src/
├── pages/
│   ├── index.astro           # Homepage
│   ├── install.astro         # Install page
│   ├── privacy.astro         # Privacy policy
│   ├── api/
│   │   └── notify.ts         # Launch notify-me form
│   └── docs/
│       └── getting-started.astro
├── components/
│   ├── Nav.astro
│   └── Footer.astro
├── layouts/
│   └── Base.astro
└── styles/
    └── global.css
```
