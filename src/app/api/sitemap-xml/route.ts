import { NextResponse } from 'next/server';
import { getSitePageIndex, sitePagesToSitemapEntries } from '@/lib/site-pages';

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function originFromRequest(request: Request): string {
  return new URL(request.url).origin;
}

export async function GET(request: Request) {
  const accept = request.headers.get('accept') ?? '';
  const now = new Date().toISOString().slice(0, 19) + 'Z';

  const groups = await getSitePageIndex();
  const entries = sitePagesToSitemapEntries(groups, baseUrl, now);

  if (accept.includes('text/html')) {
    // Browser HTML view: link to the same host/port the user is on (avoids localhost:3000 vs 3002 mismatches).
    const htmlBase = originFromRequest(request);
    const htmlEntries = sitePagesToSitemapEntries(groups, htmlBase, now);
    const rows = htmlEntries
      .map(
        (e) =>
          `<tr>
          <td><a href="${escapeXml(e.url)}">${escapeXml(e.url)}</a></td>
          <td><span class="badge badge-priority">${e.priority}</span></td>
          <td><span class="badge badge-freq">${e.changefreq}</span></td>
          <td><span class="badge badge-date">${e.lastmod}</span></td>
        </tr>`
      )
      .join('');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>XML Sitemap — Latest Craze Productions</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #050505; color: #fff; min-height: 100vh; line-height: 1.6; padding: 48px 24px; }
    .wrap { max-width: 960px; margin: 0 auto; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
    .sub { color: rgba(255,255,255,0.55); font-size: 0.95rem; margin-bottom: 28px; }
    .info { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px 20px; margin-bottom: 32px; font-size: 0.9rem; color: rgba(255,255,255,0.75); }
    table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.02); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
    th, td { padding: 14px 18px; text-align: left; }
    th { background: rgba(255,255,255,0.06); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
    tr:last-child { border-bottom: none; }
    tr:hover { background: rgba(255,255,255,0.03); }
    a { color: #60a5fa; text-decoration: none; }
    a:hover { text-decoration: underline; color: #93c5fd; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 500; }
    .badge-priority { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
    .badge-freq { background: rgba(34, 197, 94, 0.15); color: #86efac; }
    .badge-date { color: rgba(255,255,255,0.6); font-size: 0.85rem; }
    .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.85rem; color: rgba(255,255,255,0.45); }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>XML Sitemap</h1>
    <p class="sub">Latest Craze Productions — Site structure for search engines</p>
    <div class="info">Human-friendly index: <a href="${escapeXml(htmlBase)}/pages">${escapeXml(htmlBase)}/pages</a></div>
    <table>
      <thead><tr><th>URL</th><th>Priority</th><th>Change Freq.</th><th>Last Modified</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="footer">© 2025 Latest Craze Productions. XML Sitemap Protocol — sitemaps.org</p>
  </div>
</body>
</html>`;
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        Vary: 'Accept',
      },
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      Vary: 'Accept',
    },
  });
}
