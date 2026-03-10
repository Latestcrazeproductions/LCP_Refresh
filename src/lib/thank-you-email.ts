import type { SiteContent } from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

function absUrl(src: string | null): string {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

/** Build HTML thank-you email using site branding and images */
export function buildThankYouEmailHtml(
  content: SiteContent,
  recipientName: string
): string {
  const logoUrl = absUrl(content.brand.logo);
  const heroImage =
    content.hero.images?.[0] ?? 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800';
  const serviceImage =
    content.services.items?.[0]?.image ??
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you from ${content.brand.nameFull}</title>
</head>
<body style="margin:0;padding:0;font-family:'Inter',system-ui,sans-serif;background:#050505;color:#fff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" style="max-width:600px;">
          <!-- Logo -->
          ${logoUrl ? `<tr><td align="center" style="padding-bottom:32px;"><img src="${logoUrl}" alt="${content.brand.nameFull}" width="160" style="max-width:160px;height:auto;" /></td></tr>` : ''}
          <!-- Hero image -->
          <tr>
            <td style="border-radius:12px;overflow:hidden;">
              <img src="${heroImage}" alt="Events" width="600" style="width:100%;height:auto;display:block;object-fit:cover;max-height:240px;" />
            </td>
          </tr>
          <!-- Message -->
          <tr>
            <td style="padding:32px 24px;text-align:center;">
              <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;letter-spacing:-0.02em;line-height:1.2;">
                Thank you, ${recipientName}
              </h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:rgba(255,255,255,0.85);">
                We've received your message and will be in touch soon. Our team is excited to learn more about your event vision.
              </p>
              <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.6);">
                In the meantime, explore what we do best.
              </p>
            </td>
          </tr>
          <!-- Service image -->
          <tr>
            <td style="padding:0 24px 32px;">
              <img src="${serviceImage}" alt="Our services" width="552" style="width:100%;height:auto;border-radius:12px;display:block;object-fit:cover;max-height:200px;" />
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px;text-align:center;border-top:1px solid rgba(255,255,255,0.1);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5);">
                © ${new Date().getFullYear()} ${content.brand.nameFull}. All rights reserved.
              </p>
              <p style="margin:8px 0 0;font-size:12px;">
                <a href="${SITE_URL}" style="color:#3b82f6;text-decoration:none;">Visit our website</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
