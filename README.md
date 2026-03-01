# clearpath-web

The ClearPath project website, deployed at [clearpathext.com](https://clearpathext.com).

Built with Astro + Tailwind CSS, deployed on Vercel.

---

## Local Development

```bash
pnpm install
pnpm dev     # http://localhost:4321
```

---

## Deployment (Vercel)

The site deploys automatically on every push to `main` via Vercel's GitHub integration.

### First-time setup

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Astro**
3. Add environment variables (see below)
4. Deploy

---

## Environment Variables

Set these in the Vercel dashboard under **Settings → Environment Variables**.

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key |
| `FORWARD_TO_EMAIL` | Your personal email for forwarding inbound mail |
| `INBOUND_WEBHOOK_SECRET` | Random secret to verify Resend webhook requests |

Copy `.env.example` to `.env` for local development.

---

## Email Setup (Full Walkthrough)

ClearPath uses Resend for both sending and receiving email at `hello@clearpathext.com`.

### Step 1 — Add your domain to Resend

1. Log into [resend.com](https://resend.com) → **Domains → Add Domain**
2. Enter `clearpathext.com`
3. Resend will give you DNS records to add (SPF, DKIM, DMARC)
4. Add each record to your DNS provider
5. Click **Verify** in Resend — takes a few minutes

### Step 2 — Set up inbound routing in Resend

1. In Resend dashboard → **Inbound → Add Route**
2. **Receive at:** `hello@clearpathext.com`
3. **Webhook URL:** `https://clearpathext.com/api/inbound-email`
4. **Webhook secret:** generate a random string (e.g. `openssl rand -base64 32`) and paste it here

### Step 3 — Set environment variables

In Vercel dashboard:
- `RESEND_API_KEY` → your key from Resend dashboard
- `FORWARD_TO_EMAIL` → your personal Gmail (e.g. `you@gmail.com`)
- `INBOUND_WEBHOOK_SECRET` → the same secret you set in Resend's webhook config

### Step 4 — Test it

Send a test email to `hello@clearpathext.com`. Within a few seconds it should arrive in your personal inbox, with the Reply-To set to the original sender so you can reply directly.

### How it works

```
Someone emails hello@clearpathext.com
        ↓
Resend catches it (via MX records on your domain)
        ↓
Resend POSTs the email as JSON to /api/inbound-email
        ↓
The API route verifies the webhook secret
        ↓
The API route calls Resend's send API to forward it to FORWARD_TO_EMAIL
        ↓
Email arrives in your personal inbox with Reply-To set to the original sender
```

### Replying from hello@clearpathext.com

To reply as `hello@clearpathext.com` from Gmail:

1. Gmail → **Settings → See all settings → Accounts → Send mail as → Add another email**
2. Enter `hello@clearpathext.com`
3. SMTP server: `smtp.resend.com`, Port: `587`
4. Username: `resend`
5. Password: your Resend API key
6. Gmail will send a verification code — check your inbound route is working and confirm it

---

## Project Structure

```
src/
├── pages/
│   ├── index.astro              # Homepage
│   ├── features.astro           # Feature overview
│   ├── install.astro            # Installation guide
│   ├── privacy.astro            # Privacy policy
│   ├── api/
│   │   └── inbound-email.ts     # Resend inbound webhook
│   └── docs/
│       ├── getting-started.astro
│       ├── api-setup.astro
│       ├── profiles.astro
│       └── symbols.astro
├── components/
│   ├── Nav.astro
│   └── Footer.astro
├── layouts/
│   └── Base.astro
└── styles/
    └── global.css
```
