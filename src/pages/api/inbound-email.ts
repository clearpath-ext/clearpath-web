// src/pages/api/inbound-email.ts
// Resend fires a POST to this endpoint when someone emails hello@clearpathext.com
// This route forwards the email to your personal inbox via Resend's send API.
//
// SETUP CHECKLIST:
// 1. In Resend dashboard → Domains → Add Domain → add clearpathext.com
// 2. Add the DNS records Resend gives you to your DNS provider
// 3. In Resend dashboard → Inbound → Add Route:
//    - Match:   hello@clearpathext.com
//    - Webhook: https://clearpathext.com/api/inbound-email
// 4. Set environment variables (see below)

export const prerender = false; // This must be a serverless function

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Required environment variables (set in Vercel dashboard or .env file):
// RESEND_API_KEY       — your Resend API key
// FORWARD_TO_EMAIL     — your personal email (e.g. you@gmail.com)
// INBOUND_WEBHOOK_SECRET — a random secret string you set in Resend's webhook config

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Verify the request is genuinely from Resend
    const secret = import.meta.env.INBOUND_WEBHOOK_SECRET;
    if (secret) {
      const signature = request.headers.get('svix-signature') ?? 
                        request.headers.get('webhook-secret') ?? '';
      if (!signature.includes(secret)) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    // 2. Parse the inbound email payload from Resend
    const payload = await request.json() as ResendInboundPayload;

    const {
      from,
      to,
      subject,
      text,
      html,
      headers,
    } = payload;

    // 3. Build a clean forwarded subject
    const forwardedSubject = subject?.startsWith('Fwd:')
      ? subject
      : `Fwd: ${subject ?? '(no subject)'}`;

    // 4. Build the forwarded email body
    const originalFrom = from ?? 'Unknown sender';
    const originalDate = headers?.['Date'] ?? new Date().toUTCString();

    const forwardedText = [
      `---------- Forwarded message ----------`,
      `From: ${originalFrom}`,
      `Date: ${originalDate}`,
      `Subject: ${subject ?? '(no subject)'}`,
      `To: ${Array.isArray(to) ? to.join(', ') : to}`,
      ``,
      text ?? '',
    ].join('\n');

    const forwardedHtml = html
      ? `
          <div style="border-left: 3px solid #5B9BF8; padding-left: 16px; margin: 16px 0; color: #666; font-size: 13px;">
            <p><strong>---------- Forwarded message ----------</strong></p>
            <p><strong>From:</strong> ${originalFrom}</p>
            <p><strong>Date:</strong> ${originalDate}</p>
            <p><strong>Subject:</strong> ${subject ?? '(no subject)'}</p>
            <p><strong>To:</strong> ${Array.isArray(to) ? to.join(', ') : to}</p>
          </div>
          ${html}
        `
      : undefined;

    // 5. Send the forwarded email
    const { error } = await resend.emails.send({
      from: 'ClearPath Inbound <hello@clearpathext.com>',
      to: [import.meta.env.FORWARD_TO_EMAIL],
      reply_to: originalFrom,            // So you can reply directly to the sender
      subject: forwardedSubject,
      text: forwardedText,
      ...(forwardedHtml ? { html: forwardedHtml } : {}),
    });

    if (error) {
      console.error('Resend forward error:', error);
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Inbound webhook error:', err);
    return new Response('Internal server error', { status: 500 });
  }
};

// TypeScript type for Resend's inbound email payload
// Full schema: https://resend.com/docs/api-reference/inbound-email
interface ResendInboundPayload {
  from: string;
  to: string | string[];
  subject?: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: string;      // base64
    contentType: string;
  }>;
}
