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
npx wrangler pages secret put INBOUND_WEBHOOK_SECRET
```

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key |
| `FORWARD_TO_EMAIL` | Your personal email for forwarding inbound mail |
| `INBOUND_WEBHOOK_SECRET` | Random secret to verify Resend webhook requests |

Copy `.env.example` to `.env` for local development.

---

## Email Setup (hello@clearpathext.com)

ClearPath uses Resend for both sending and receiving email at `hello@clearpathext.com`.

```
Someone emails hello@clearpathext.com
        ↓
Resend catches it (MX records on clearpathext.com)
        ↓
Resend POSTs to https://clearpathext.com/api/inbound-email
        ↓
API route verifies webhook secret
        ↓
Forwards to FORWARD_TO_EMAIL via Resend, Reply-To set to original sender
        ↓
Reply directly from your inbox — sender receives it as hello@clearpathext.com
```

### Setup steps

1. Add `clearpathext.com` to Resend → copy the DNS records into Cloudflare DNS
2. In Resend → Inbound → add route: `hello@clearpathext.com` → `https://clearpathext.com/api/inbound-email`
3. Set the three environment variables above
4. Send a test email to `hello@clearpathext.com`

---

## Project Structure

```
src/
├── pages/
│   ├── index.astro           # Homepage
│   ├── install.astro         # Install page
│   ├── privacy.astro         # Privacy policy
│   ├── api/
│   │   └── inbound-email.ts  # Resend inbound webhook
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
