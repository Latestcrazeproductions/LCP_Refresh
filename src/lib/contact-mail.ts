/**
 * Contact outbound mail: SMTP only (Nodemailer). DreamHost, Google Workspace, etc.
 */
import nodemailer from 'nodemailer';

function trimEnv(key: string): string | undefined {
  const v = process.env[key];
  if (v == null) return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export function smtpUser(): string | undefined {
  return trimEnv('SMTP_USER');
}

export function smtpPass(): string | undefined {
  return trimEnv('SMTP_PASS');
}

export function isSmtpConfigured(): boolean {
  return Boolean(smtpUser() && smtpPass());
}

/** For logs — which SMTP vars are missing (no secrets). */
export function smtpMissingEnvKeys(): string[] {
  const missing: string[] = [];
  if (!smtpUser()) missing.push('SMTP_USER');
  if (!smtpPass()) missing.push('SMTP_PASS');
  return missing;
}

/** Call only when `isSmtpConfigured()` is true so `SMTP_USER` exists. */
export function resolveContactFromHeader(brandNameFull: string): string {
  const email = trimEnv('MAIL_FROM_EMAIL') || smtpUser()!;
  const name = trimEnv('MAIL_FROM_NAME') || brandNameFull;
  return `${name} <${email}>`;
}

function createSmtpTransport() {
  const host = (trimEnv('SMTP_HOST') || 'smtp.gmail.com').toLowerCase();
  if (host.includes('resend.com')) {
    console.warn(
      '[contact] SMTP_HOST points at Resend (e.g. smtp.resend.com). Nodemailer talks to that server — ' +
        'you will see Resend errors until the domain is verified in Resend, or switch SMTP_HOST to DreamHost (smtp.dreamhost.com) with your mailbox credentials.'
    );
  }
  const port = parseInt(trimEnv('SMTP_PORT') || '465', 10);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: smtpUser()!,
      pass: smtpPass()!,
    },
  });
}

export type ContactMailOpts = {
  fromHeader: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

export async function sendContactSmtp(
  opts: ContactMailOpts
): Promise<{ ok: boolean; id?: string; errorMessage?: string }> {
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
