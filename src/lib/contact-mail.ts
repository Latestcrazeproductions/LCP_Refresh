/**
 * Contact outbound mail: standard SMTP (DreamHost smtp.dreamhost.com, Google smtp.gmail.com, …)
 * configured with SMTP_* env vars, or legacy Resend if SMTP credentials are unset.
 */
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * From header for contact emails. Prefer MAIL_FROM_*; for Workspace SMTP,
 * MAIL_FROM_EMAIL should match the mailbox or an allowed send-as alias.
 */
export function resolveContactFromHeader(brandNameFull: string): string {
  const email =
    process.env.MAIL_FROM_EMAIL ||
    process.env.SMTP_USER ||
    process.env.RESEND_FROM_EMAIL ||
    'onboarding@resend.dev';
  const name = process.env.MAIL_FROM_NAME || brandNameFull;
  return `${name} <${email}>`;
}

function createSmtpTransport() {
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  return nodemailer.createTransport({
    // DreamHost: smtp.dreamhost.com — Google: smtp.gmail.com
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });
}

type SendOpts = {
  fromHeader: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

export async function sendContactMessage(
  mode: 'smtp' | 'resend',
  opts: SendOpts
): Promise<{ ok: boolean; id?: string; errorMessage?: string }> {
  if (mode === 'smtp') {
    try {
      const transport = createSmtpTransport();
      const info = await transport.sendMail({
        from: opts.fromHeader,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
        replyTo: opts.replyTo,
      });
      return { ok: true, id: info.messageId };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, errorMessage: msg };
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const to = Array.isArray(opts.to) ? opts.to : [opts.to];
  const base = {
    from: opts.fromHeader,
    to,
    subject: opts.subject,
    ...(opts.replyTo !== undefined ? { replyTo: opts.replyTo } : {}),
  };

  const { data, error } = opts.html
    ? await resend.emails.send({ ...base, html: opts.html })
    : await resend.emails.send({ ...base, text: opts.text ?? '' });
  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);
    return { ok: false, errorMessage };
  }
  return { ok: true, id: data?.id ?? undefined };
}
