/**
 * Contact outbound mail: standard SMTP (DreamHost smtp.dreamhost.com, Google smtp.gmail.com, …)
 * configured with SMTP_* env vars, or legacy Resend if SMTP credentials are unset.
 */
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

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

export function isResendConfigured(): boolean {
  return Boolean(trimEnv('RESEND_API_KEY'));
}

/** For logs only — which SMTP vars are missing (no secrets). */
export function smtpMissingEnvKeys(): string[] {
  const missing: string[] = [];
  if (!smtpUser()) missing.push('SMTP_USER');
  if (!smtpPass()) missing.push('SMTP_PASS');
  return missing;
}

/** When true, never fall back to Resend (avoids confusing Resend errors if SMTP_* are missing in Production). */
export function skipResendFallback(): boolean {
  const v = trimEnv('SKIP_RESEND');
  if (!v) return false;
  return ['1', 'true', 'yes'].includes(v.toLowerCase());
}

/**
 * From header for contact emails. Prefer MAIL_FROM_*; for Workspace SMTP,
 * MAIL_FROM_EMAIL should match the mailbox or an allowed send-as alias.
 */
export function resolveContactFromHeader(brandNameFull: string): string {
  const email =
    trimEnv('MAIL_FROM_EMAIL') ||
    smtpUser() ||
    trimEnv('RESEND_FROM_EMAIL') ||
    'onboarding@resend.dev';
  const name = trimEnv('MAIL_FROM_NAME') || brandNameFull;
  return `${name} <${email}>`;
}

function createSmtpTransport() {
  const port = parseInt(trimEnv('SMTP_PORT') || '465', 10);
  return nodemailer.createTransport({
    // DreamHost: smtp.dreamhost.com — Google: smtp.gmail.com
    host: trimEnv('SMTP_HOST') || 'smtp.gmail.com',
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: smtpUser()!,
      pass: smtpPass()!,
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

  const resend = new Resend(trimEnv('RESEND_API_KEY')!);
  const to = Array.isArray(opts.to) ? opts.to : [opts.to];
  const base = {
    from: opts.fromHeader,
    to,
    subject: opts.subject,
    ...(opts.replyTo !== undefined ? { replyTo: opts.replyTo } : {}),
  };

  let data: { id: string } | null = null;
  let error: { message: string } | null = null;
  if (opts.html && opts.text !== undefined) {
    ({ data, error } = await resend.emails.send({
      ...base,
      html: opts.html,
      text: opts.text,
    }));
  } else if (opts.html) {
    ({ data, error } = await resend.emails.send({ ...base, html: opts.html }));
  } else {
    ({ data, error } = await resend.emails.send({
      ...base,
      text: opts.text ?? '',
    }));
  }
  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);
    return { ok: false, errorMessage };
  }
  return { ok: true, id: data?.id ?? undefined };
}
