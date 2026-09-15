// src/pages/api/notify.ts
// Accepts a "notify me when ClearPath launches" submission from /install and
// forwards it to the team inbox via Resend's send API — reuses the same
// RESEND_API_KEY / FORWARD_TO_EMAIL secrets as the inbound-email webhook.
// There's no subscriber list yet; each submission is just a forwarded email
// the team can track/reply to. Good enough for pre-launch volume.

export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { env } = (locals as any).runtime;

    const apiKey: string = env.RESEND_API_KEY;
    const forwardTo: string = env.FORWARD_TO_EMAIL;

    if (!apiKey || !forwardTo) {
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json() as { email?: string; website?: string };
    const email = (body.email ?? '').trim();

    // Honeypot — a real visitor never fills this hidden field in
    if (body.website) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return new Response(JSON.stringify({ error: 'Enter a valid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'ClearPath Notify <hello@clearpathext.com>',
      to: [forwardTo],
      reply_to: email,
      subject: 'ClearPath launch notify-me signup',
      text: `${email} asked to be notified when ClearPath launches on the Chrome Web Store / Firefox Add-ons.`,
    });

    if (error) {
      console.error('Resend notify error:', error);
      return new Response(JSON.stringify({ error: 'Could not send right now' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Notify endpoint error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
