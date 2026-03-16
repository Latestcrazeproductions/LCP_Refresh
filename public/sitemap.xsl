<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" doctype-system="about:legacy-compat" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>XML Sitemap — Latest Craze Productions</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background: #050505; color: #fff; min-height: 100vh; line-height: 1.6; background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent), linear-gradient(180deg, #050505 0%, #0a0a0f 100%); }
          .glow { position: fixed; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 60%); pointer-events: none; z-index: 0; animation: pulse 8s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
          .wrap { position: relative; z-index: 1; max-width: 960px; margin: 0 auto; padding: 56px 24px; }
          h1 { font-size: 2.25rem; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 8px; background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.85) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .sub { color: rgba(255,255,255,0.55); font-size: 0.95rem; margin-bottom: 28px; }
          .info { background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 20px 24px; margin-bottom: 36px; font-size: 0.9rem; color: rgba(255,255,255,0.75); box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
          table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.02); border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
          th, td { padding: 16px 20px; text-align: left; transition: background 0.2s ease; }
          th { background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%); color: rgba(255,255,255,0.95); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
          tr { border-bottom: 1px solid rgba(255,255,255,0.05); }
          tr:last-child { border-bottom: none; }
          tr:hover { background: rgba(255,255,255,0.04); }
          tr:hover td { color: rgba(255,255,255,0.95); }
          a { color: #60a5fa; text-decoration: none; transition: color 0.2s; }
          a:hover { color: #93c5fd; text-decoration: underline; text-underline-offset: 3px; }
          .badge { display: inline-block; padding: 5px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.02em; }
          .badge-priority { background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); }
          .badge-freq { background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.25); }
          .badge-date { color: rgba(255,255,255,0.55); font-size: 0.8rem; font-variant-numeric: tabular-nums; }
          .footer { margin-top: 48px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.85rem; color: rgba(255,255,255,0.4); }
        </style>
      </head>
      <body>
        <div class="glow"></div>
        <div class="wrap">
          <h1>XML Sitemap</h1>
          <p class="sub">Latest Craze Productions — Site structure for search engines</p>
          <div class="info">This sitemap helps search engines discover and index our pages. It is intended for crawlers; humans can browse the links below.</div>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Priority</th>
                <th>Change Freq.</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td><span class="badge badge-priority"><xsl:value-of select="sitemap:priority"/></span></td>
                  <td><span class="badge badge-freq"><xsl:value-of select="sitemap:changefreq"/></span></td>
                  <td><span class="badge badge-date"><xsl:value-of select="sitemap:lastmod"/></span></td>
                </tr>
              </xsl:for-each>
              <xsl:if test="sitemap:sitemapindex">
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td colspan="3"><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td><span class="badge badge-date"><xsl:value-of select="sitemap:lastmod"/></span></td>
                  </tr>
                </xsl:for-each>
              </xsl:if>
            </tbody>
          </table>
          <p class="footer">© 2025 Latest Craze Productions. XML Sitemap Protocol — sitemaps.org</p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
