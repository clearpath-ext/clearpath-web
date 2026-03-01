// src/pages/api/inbound-email.ts
// Resend fires a POST to this endpoint when someone emails hello@clearpathext.com
// This route forwards the email to your personal inbox via Resend's send API.

export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { env } = (locals as any).runtime;

    const apiKey: string = env.RESEND_API_KEY;
    const forwardTo: string = env.FORWARD_TO_EMAIL;
    const secret: string = env.INBOUND_WEBHOOK_SECRET;

    if (!apiKey || !forwardTo) {
      return new Response('Server misconfigured', { status: 500 });
    }

    // Verify the request is genuinely from Resend
    if (secret) {
      const signature = request.headers.get('svix-signature') ??
                        request.headers.get('webhook-secret') ?? '';
      if (!signature.includes(secret)) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    const payload = await request.json() as ResendInboundPayload;
    const { from, to, subject, text, html, headers } = payload;

    const forwardedSubject = subject?.startsWith('Fwd:')
      ? subject
      : `Fwd: ${subject ?? '(no subject)'}`;

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

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'ClearPath Inbound <hello@clearpathext.com>',
      to: [forwardTo],
      reply_to: originalFrom,
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

interface ResendInboundPayload {
  from: string;
  to: string | string[];
  subject?: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}
