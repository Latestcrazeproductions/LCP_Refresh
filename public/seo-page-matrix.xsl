<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:matrix="https://latestcrazeproductions.com/schemas/seo-page-matrix/1.0">
  <xsl:output method="html" doctype-system="about:legacy-compat" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>SEO Page Matrix — Latest Craze Productions</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background: #050505; color: #fff; min-height: 100vh; line-height: 1.6; background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent), linear-gradient(180deg, #050505 0%, #0a0a0f 100%); }
          .glow { position: fixed; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 60%); pointer-events: none; z-index: 0; }
          .wrap { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 56px 24px; }
          h1 { font-size: 2.25rem; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 8px; background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.85) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          h2 { font-size: 1.1rem; font-weight: 600; margin: 32px 0 12px; color: rgba(255,255,255,0.9); }
          .sub { color: rgba(255,255,255,0.55); font-size: 0.95rem; margin-bottom: 20px; }
          .info { background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 20px 24px; margin-bottom: 24px; font-size: 0.9rem; color: rgba(255,255,255,0.75); }
          .stats { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 28px; }
          .stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 16px; min-width: 140px; }
          .stat-num { font-size: 1.5rem; font-weight: 700; color: #93c5fd; }
          .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.06em; }
          .tier-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 32px; }
          .tier-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; }
          .tier-card strong { color: #93c5fd; }
          .filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; font-size: 0.85rem; color: rgba(255,255,255,0.6); }
          table { width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.02); border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); font-size: 0.85rem; }
          th, td { padding: 12px 14px; text-align: left; vertical-align: top; }
          th { background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%); color: rgba(255,255,255,0.95); font-weight: 600; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; position: sticky; top: 0; }
          tr { border-bottom: 1px solid rgba(255,255,255,0.05); }
          tr:hover { background: rgba(255,255,255,0.04); }
          a { color: #60a5fa; text-decoration: none; word-break: break-all; }
          a:hover { color: #93c5fd; text-decoration: underline; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; margin-right: 4px; white-space: nowrap; }
          .tier-1 { background: rgba(234, 179, 8, 0.2); color: #fde047; border: 1px solid rgba(234, 179, 8, 0.3); }
          .tier-2 { background: rgba(59, 130, 246, 0.25); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); }
          .tier-3 { background: rgba(34, 197, 94, 0.2); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.25); }
          .tier-4 { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.25); }
          .tier-5 { background: rgba(249, 115, 22, 0.2); color: #fdba74; border: 1px solid rgba(249, 115, 22, 0.25); }
          .tier-6 { background: rgba(236, 72, 153, 0.2); color: #f9a8d4; border: 1px solid rgba(236, 72, 153, 0.25); }
          .tier-7 { background: rgba(107, 114, 128, 0.3); color: #d1d5db; border: 1px solid rgba(107, 114, 128, 0.4); }
          .layer-national { color: #86efac; }
          .layer-geo { color: #fdba74; }
          .meta-small { font-size: 0.75rem; color: rgba(255,255,255,0.45); margin-top: 4px; }
          .footer { margin-top: 48px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.85rem; color: rgba(255,255,255,0.4); }
        </style>
      </head>
      <body>
        <div class="glow"></div>
        <div class="wrap">
          <h1>SEO Page Matrix</h1>
          <p class="sub">Latest Craze Productions — comprehensive keyword landing page registry</p>

          <div class="info">
            <strong>Pattern:</strong> service × industry × event type × location.
            Priority tiers follow the internal strategy: start with head terms (event production, AV production),
            then core services (LED walls, event lighting, staging, audio), then industry/event long-tail,
            then Phoenix/Scottsdale cross-references, then nationwide geo. Niche terms (gobos) are lowest priority.
            <br/><br/>
            Generated: <xsl:value-of select="matrix:seoPageMatrix/@generated"/>
          </div>

          <div class="stats">
            <div class="stat">
              <div class="stat-num"><xsl:value-of select="matrix:seoPageMatrix/@totalPages"/></div>
              <div class="stat-label">Total pages</div>
            </div>
            <div class="stat">
              <div class="stat-num"><xsl:value-of select="count(matrix:seoPageMatrix/matrix:pages/matrix:page[@layer='national'])"/></div>
              <div class="stat-label">National</div>
            </div>
            <div class="stat">
              <div class="stat-num"><xsl:value-of select="count(matrix:seoPageMatrix/matrix:pages/matrix:page[@layer='geo'])"/></div>
              <div class="stat-label">Geo</div>
            </div>
          </div>

          <h2>Priority tiers</h2>
          <div class="tier-grid">
            <xsl:for-each select="matrix:seoPageMatrix/matrix:meta/matrix:tierSummary/matrix:tier">
              <div class="tier-card">
                <strong>Tier <xsl:value-of select="@id"/>:</strong>
                <xsl:value-of select="@label"/>
                <div class="meta-small"><xsl:value-of select="text()"/> pages</div>
              </div>
            </xsl:for-each>
          </div>

          <h2>Taxonomy</h2>
          <div class="info">
            <p><strong>Head services:</strong>
              <xsl:for-each select="matrix:seoPageMatrix/matrix:taxonomy/matrix:headServices/matrix:service">
                <xsl:value-of select="."/><xsl:if test="position()!=last()"> · </xsl:if>
              </xsl:for-each>
            </p>
            <p style="margin-top:8px"><strong>Core services:</strong>
              <xsl:for-each select="matrix:seoPageMatrix/matrix:taxonomy/matrix:coreServices/matrix:service">
                <xsl:value-of select="."/><xsl:if test="position()!=last()"> · </xsl:if>
              </xsl:for-each>
            </p>
            <p style="margin-top:8px"><strong>Industries:</strong>
              <xsl:for-each select="matrix:seoPageMatrix/matrix:taxonomy/matrix:industries/matrix:industry">
                <xsl:value-of select="."/><xsl:if test="position()!=last()"> · </xsl:if>
              </xsl:for-each>
            </p>
            <p style="margin-top:8px"><strong>Event types:</strong>
              <xsl:for-each select="matrix:seoPageMatrix/matrix:taxonomy/matrix:eventTypes/matrix:eventType">
                <xsl:value-of select="."/><xsl:if test="position()!=last()"> · </xsl:if>
              </xsl:for-each>
            </p>
            <p style="margin-top:8px"><strong>Arizona locations:</strong>
              <xsl:for-each select="matrix:seoPageMatrix/matrix:taxonomy/matrix:locations/matrix:location">
                <xsl:value-of select="."/><xsl:if test="position()!=last()"> · </xsl:if>
              </xsl:for-each>
            </p>
          </div>

          <h2>All planned pages (<xsl:value-of select="matrix:seoPageMatrix/@totalPages"/>)</h2>
          <table>
            <thead>
              <tr>
                <th>Tier</th>
                <th>Layer</th>
                <th>Title / H1</th>
                <th>URL slug</th>
                <th>Keyword</th>
                <th>Dimensions</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="matrix:seoPageMatrix/matrix:pages/matrix:page">
                <xsl:sort select="@tier" data-type="number"/>
                <xsl:sort select="@priority" data-type="number" order="descending"/>
                <tr>
                  <td>
                    <span class="badge tier-{@tier}">T<xsl:value-of select="@tier"/></span>
                  </td>
                  <td>
                    <span class="layer-{@layer}"><xsl:value-of select="@layer"/></span>
                  </td>
                  <td>
                    <strong><xsl:value-of select="matrix:title"/></strong>
                    <div class="meta-small"><xsl:value-of select="matrix:h1"/></div>
                    <xsl:if test="matrix:note">
                      <div class="meta-small"><em><xsl:value-of select="matrix:note"/></em></div>
                    </xsl:if>
                  </td>
                  <td><a href="{matrix:url}"><xsl:value-of select="matrix:slug"/></a></td>
                  <td><xsl:value-of select="matrix:keyword"/></td>
                  <td>
                    <xsl:if test="matrix:service"><span class="badge tier-2"><xsl:value-of select="matrix:service"/></span></xsl:if>
                    <xsl:if test="matrix:industry"><span class="badge tier-3"><xsl:value-of select="matrix:industry"/></span></xsl:if>
                    <xsl:if test="matrix:eventType"><span class="badge tier-4"><xsl:value-of select="matrix:eventType"/></span></xsl:if>
                    <xsl:if test="matrix:location"><span class="badge tier-5"><xsl:value-of select="matrix:location"/></span></xsl:if>
                    <xsl:if test="matrix:aliases">
                      <div class="meta-small">Aliases: <xsl:value-of select="matrix:aliases"/></div>
                    </xsl:if>
                    <xsl:if test="matrix:crossRef">
                      <div class="meta-small">Cross-ref: <xsl:value-of select="matrix:crossRef"/></div>
                    </xsl:if>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <p class="footer">© 2026 Latest Craze Productions. SEO Page Matrix — internal planning registry. Regenerate with <code>node scripts/generate-seo-page-matrix.mjs</code></p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
