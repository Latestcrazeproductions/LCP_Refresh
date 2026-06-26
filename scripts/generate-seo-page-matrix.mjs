/**
 * Generates public/seo-page-matrix.xml — comprehensive SEO landing page registry
 * following the LCP internal keyword matrix pattern (service × market × event × location).
 *
 * Run: node scripts/generate-seo-page-matrix.mjs
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../public/seo-page-matrix.xml');

const BASE = 'https://latestcrazeproductions.com';

/** Tier 1 — broad head terms (searchers who don't know AV jargon) */
const HEAD_SERVICES = [
  {
    id: 'event-production',
    label: 'Event Production',
    aliases: ['corporate event production', 'event production company', 'corporate events production'],
    slug: 'event-production',
  },
  {
    id: 'conference-production',
    label: 'Conference Production',
    aliases: ['corporate conference production', 'conference event production'],
    slug: 'conference-production',
  },
  {
    id: 'av-production',
    label: 'AV Production',
    aliases: ['audio video production', 'AV production company', 'video production for events'],
    slug: 'av-production',
  },
];

/** Tier 2 — core technical services (event-specific; exclude permanent install terms) */
const CORE_SERVICES = [
  {
    id: 'led-walls',
    label: 'LED Walls',
    aliases: ['LED video walls', 'LED wall rental', 'LED display for events'],
    slug: 'led-walls',
    eventScoped: true,
  },
  {
    id: 'event-lighting',
    label: 'Event Lighting',
    aliases: ['event lighting design', 'corporate event lighting'],
    slug: 'event-lighting',
    eventScoped: true,
    excludeTerms: ['architectural lighting', 'landscape lighting', 'permanent installation'],
  },
  {
    id: 'staging',
    label: 'Staging',
    aliases: ['stages', 'risers', 'stage risers', 'event staging'],
    slug: 'staging',
    eventScoped: true,
  },
  {
    id: 'audio-systems',
    label: 'Audio Systems',
    aliases: ['line array', 'PA systems', 'speakers for events', 'microphones for events'],
    slug: 'audio-systems',
    eventScoped: true,
  },
  {
    id: 'projection-mapping',
    label: 'Projection Mapping',
    aliases: ['projection mapping services', '3D projection mapping'],
    slug: 'projection-mapping',
    eventScoped: true,
  },
  {
    id: 'scenic-design',
    label: 'Scenic Design',
    aliases: ['event scenic design', 'custom stage design'],
    slug: 'scenic-design',
    eventScoped: true,
  },
  {
    id: 'stage-design',
    label: 'Stage Design',
    aliases: ['corporate stage design', 'custom stage fabrication'],
    slug: 'stage-design',
    eventScoped: true,
  },
];

/** Tier 3 — niche equipment (lower priority per transcript) */
const NICHE_SERVICES = [
  {
    id: 'gobos',
    label: 'Gobos',
    aliases: ['custom gobos', 'logo gobos', 'gobo projection'],
    slug: 'gobos',
    fringeAliases: ['bogo', 'headboard lamp'],
    eventScoped: true,
  },
  {
    id: 'digital-signage',
    label: 'Digital Signage',
    aliases: ['event digital signage', 'LED signage for events'],
    slug: 'digital-signage',
    eventScoped: true,
  },
];

const INDUSTRIES = [
  { id: 'pharmaceutical', label: 'Pharmaceutical', slug: 'pharmaceutical' },
  { id: 'cybersecurity', label: 'Cybersecurity', slug: 'cybersecurity' },
  { id: 'automotive', label: 'Automotive', slug: 'automotive' },
  { id: 'nonprofit', label: 'Nonprofit', slug: 'nonprofit' },
  { id: 'corporate', label: 'Corporate', slug: 'corporate' },
  { id: 'technology', label: 'Technology', slug: 'technology' },
  { id: 'healthcare', label: 'Healthcare', slug: 'healthcare' },
  { id: 'finance', label: 'Finance', slug: 'finance' },
  { id: 'pr-agencies', label: 'PR Agencies', slug: 'pr-agencies', note: 'Partner audience — agencies sourcing AV' },
];

const EVENT_TYPES = [
  { id: 'product-launches', label: 'Product Launches', slug: 'product-launches' },
  { id: 'corporate-conferences', label: 'Corporate Conferences', slug: 'corporate-conferences' },
  { id: 'sales-kickoffs', label: 'Sales Kickoffs', slug: 'sales-kickoffs' },
  { id: 'galas-awards', label: 'Galas & Awards', slug: 'galas-awards' },
  { id: 'fundraisers', label: 'Fundraisers', slug: 'fundraisers' },
  { id: 'car-reveals', label: 'Car Reveals', slug: 'car-reveals', industries: ['automotive'] },
  { id: 'corporate-keynotes', label: 'Corporate Keynotes', slug: 'corporate-keynotes' },
  { id: 'brand-activations', label: 'Brand Activations', slug: 'brand-activations' },
  { id: 'meetings', label: 'Meetings', slug: 'meetings' },
  { id: 'trade-shows', label: 'Trade Shows', slug: 'trade-shows' },
];

/** Phoenix metro cross-references (Steven: events in Scottsdale, searchers type Phoenix) */
const LOCATIONS = [
  { id: 'phoenix-az', city: 'Phoenix', state: 'AZ', slug: 'phoenix-az', crossRef: 'scottsdale-az' },
  { id: 'scottsdale-az', city: 'Scottsdale', state: 'AZ', slug: 'scottsdale-az', crossRef: 'phoenix-az' },
  { id: 'tempe-az', city: 'Tempe', state: 'AZ', slug: 'tempe-az', crossRef: 'phoenix-az' },
  { id: 'chandler-az', city: 'Chandler', state: 'AZ', slug: 'chandler-az', crossRef: 'phoenix-az' },
  { id: 'arizona', city: 'Arizona', state: 'AZ', slug: 'arizona', crossRef: 'phoenix-az' },
];

const NATIONWIDE_MARKETS = [
  { id: 'atlanta-ga', city: 'Atlanta', state: 'GA', slug: 'atlanta-ga' },
  { id: 'dallas-tx', city: 'Dallas', state: 'TX', slug: 'dallas-tx' },
  { id: 'los-angeles-ca', city: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca' },
  { id: 'las-vegas-nv', city: 'Las Vegas', state: 'NV', slug: 'las-vegas-nv' },
  { id: 'denver-co', city: 'Denver', state: 'CO', slug: 'denver-co' },
  { id: 'chicago-il', city: 'Chicago', state: 'IL', slug: 'chicago-il' },
  { id: 'nashville-tn', city: 'Nashville', state: 'TN', slug: 'nashville-tn' },
  { id: 'austin-tx', city: 'Austin', state: 'TX', slug: 'austin-tx' },
  { id: 'san-francisco-ca', city: 'San Francisco', state: 'CA', slug: 'san-francisco-ca' },
  { id: 'seattle-wa', city: 'Seattle', state: 'WA', slug: 'seattle-wa' },
];

const pages = [];
const seen = new Set();

function slugify(...parts) {
  return parts.filter(Boolean).join('-').replace(/[^a-z0-9-]/gi, '').replace(/-+/g, '-').toLowerCase();
}

function addPage(entry) {
  const key = entry.slug;
  if (seen.has(key)) return;
  seen.add(key);
  pages.push(entry);
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- Tier 1: National head terms ---
for (const svc of HEAD_SERVICES) {
  addPage({
    tier: 1,
    layer: 'national',
    pattern: 'head-service',
    slug: `/feeds/${svc.slug}`,
    title: `${svc.label} Company`,
    h1: `${svc.label} for Corporate Events`,
    keyword: `${svc.label.toLowerCase()} company`,
    service: svc.id,
    serviceLabel: svc.label,
    aliases: svc.aliases,
    priority: 0.95,
    status: 'planned',
  });
}

// Head service × event type
for (const svc of HEAD_SERVICES) {
  for (const evt of EVENT_TYPES) {
    addPage({
      tier: 1,
      layer: 'national',
      pattern: 'head-service-event',
      slug: `/feeds/${svc.slug}-${evt.slug}`,
      title: `${svc.label} for ${evt.label}`,
      h1: `${svc.label} for ${evt.label}`,
      keyword: `${svc.label.toLowerCase()} ${evt.label.toLowerCase()}`,
      service: svc.id,
      serviceLabel: svc.label,
      eventType: evt.id,
      eventLabel: evt.label,
      priority: 0.9,
      status: 'planned',
    });
  }
}

// --- Tier 2: Core service × event type ---
for (const svc of CORE_SERVICES) {
  addPage({
    tier: 2,
    layer: 'national',
    pattern: 'core-service',
    slug: `/feeds/${svc.slug}`,
    title: `${svc.label} for Events`,
    h1: `${svc.label} for Corporate Events`,
    keyword: `${svc.label.toLowerCase()} for events`,
    service: svc.id,
    serviceLabel: svc.label,
    aliases: svc.aliases,
    excludeTerms: svc.excludeTerms,
    priority: 0.88,
    status: 'planned',
  });

  for (const evt of EVENT_TYPES) {
    addPage({
      tier: 2,
      layer: 'national',
      pattern: 'core-service-event',
      slug: `/feeds/${svc.slug}-${evt.slug}`,
      title: `${svc.label} for ${evt.label}`,
      h1: `${svc.label} for ${evt.label}`,
      keyword: `${svc.label.toLowerCase()} ${evt.label.toLowerCase()}`,
      service: svc.id,
      serviceLabel: svc.label,
      eventType: evt.id,
      eventLabel: evt.label,
      priority: 0.85,
      status: 'planned',
    });
  }
}

// --- Tier 3: Service × industry ---
for (const svc of [...HEAD_SERVICES, ...CORE_SERVICES]) {
  for (const ind of INDUSTRIES) {
    addPage({
      tier: 3,
      layer: 'national',
      pattern: 'service-industry',
      slug: `/feeds/${svc.slug}-${ind.slug}`,
      title: `${svc.label} for ${ind.label}`,
      h1: `${svc.label} for ${ind.label} Events`,
      keyword: `${svc.label.toLowerCase()} ${ind.label.toLowerCase()}`,
      service: svc.id,
      serviceLabel: svc.label,
      industry: ind.id,
      industryLabel: ind.label,
      industryNote: ind.note,
      priority: 0.82,
      status: 'planned',
    });
  }
}

// --- Tier 4: Service × industry × event (high-intent combos) ---
for (const svc of [...HEAD_SERVICES, ...CORE_SERVICES]) {
  for (const ind of INDUSTRIES) {
    for (const evt of EVENT_TYPES) {
      if (evt.industries && !evt.industries.includes(ind.id)) continue;
      addPage({
        tier: 4,
        layer: 'national',
        pattern: 'service-industry-event',
        slug: `/feeds/${svc.slug}-${ind.slug}-${evt.slug}`,
        title: `${svc.label} for ${ind.label} ${evt.label}`,
        h1: `${svc.label} for ${ind.label} ${evt.label}`,
        keyword: `${svc.label.toLowerCase()} ${ind.label.toLowerCase()} ${evt.label.toLowerCase()}`,
        service: svc.id,
        serviceLabel: svc.label,
        industry: ind.id,
        industryLabel: ind.label,
        eventType: evt.id,
        eventLabel: evt.label,
        priority: 0.78,
        status: 'planned',
      });
    }
  }
}

// --- Tier 5: Arizona geo cross-reference pages ---
const AZ_SERVICES = [...HEAD_SERVICES, ...CORE_SERVICES.slice(0, 4)];
for (const loc of LOCATIONS) {
  for (const svc of AZ_SERVICES) {
    addPage({
      tier: 5,
      layer: 'geo',
      pattern: 'service-location',
      slug: `/feeds/${svc.slug}/${loc.slug}`,
      title: `${svc.label} in ${loc.city}, ${loc.state}`,
      h1: `${svc.label} in ${loc.city}, ${loc.state}`,
      keyword: `${svc.label.toLowerCase()} ${loc.city.toLowerCase()} ${loc.state.toLowerCase()}`,
      service: svc.id,
      serviceLabel: svc.label,
      location: loc.id,
      locationLabel: `${loc.city}, ${loc.state}`,
      crossRef: loc.crossRef,
      priority: 0.86,
      status: 'planned',
    });
  }
}

// Phoenix/Scottsdale explicit cross-reference hub pages
addPage({
  tier: 5,
  layer: 'geo',
  pattern: 'location-crossref',
  slug: '/feeds/phoenix-scottsdale-event-production',
  title: 'Phoenix & Scottsdale Event Production',
  h1: 'Event Production in Phoenix & Scottsdale',
  keyword: 'phoenix scottsdale event production',
  location: 'phoenix-az',
  locationLabel: 'Phoenix & Scottsdale, AZ',
  crossRef: 'scottsdale-az',
  note: 'Cross-reference hub — events often in Scottsdale; searchers often type Phoenix',
  priority: 0.92,
  status: 'planned',
});

// --- Tier 6: Nationwide geo (top markets × head services) ---
for (const market of NATIONWIDE_MARKETS) {
  for (const svc of HEAD_SERVICES) {
    addPage({
      tier: 6,
      layer: 'geo',
      pattern: 'head-service-market',
      slug: `/feeds/${svc.slug}/${market.slug}`,
      title: `${svc.label} in ${market.city}, ${market.state}`,
      h1: `${svc.label} in ${market.city}, ${market.state}`,
      keyword: `${svc.label.toLowerCase()} ${market.city.toLowerCase()} ${market.state.toLowerCase()}`,
      service: svc.id,
      serviceLabel: svc.label,
      location: market.id,
      locationLabel: `${market.city}, ${market.state}`,
      priority: 0.75,
      status: 'planned',
    });
  }
}

// --- Tier 7: Niche / fringe (gobos, alias terms) ---
for (const svc of NICHE_SERVICES) {
  addPage({
    tier: 7,
    layer: 'national',
    pattern: 'niche-service',
    slug: `/feeds/${svc.slug}`,
    title: `${svc.label} for Events`,
    h1: `${svc.label} for Corporate Events`,
    keyword: `${svc.label.toLowerCase()} for events`,
    service: svc.id,
    serviceLabel: svc.label,
    aliases: svc.aliases,
    fringeAliases: svc.fringeAliases,
    priority: 0.55,
    status: 'planned',
  });

  for (const ind of INDUSTRIES.slice(0, 6)) {
    addPage({
      tier: 7,
      layer: 'national',
      pattern: 'niche-service-industry',
      slug: `/feeds/${svc.slug}-${ind.slug}`,
      title: `${svc.label} for ${ind.label} Events`,
      h1: `${svc.label} for ${ind.label} Events`,
      keyword: `${svc.label.toLowerCase()} ${ind.label.toLowerCase()}`,
      service: svc.id,
      serviceLabel: svc.label,
      industry: ind.id,
      industryLabel: ind.label,
      priority: 0.5,
      status: 'planned',
    });
  }

  for (const evt of EVENT_TYPES.slice(0, 5)) {
    addPage({
      tier: 7,
      layer: 'national',
      pattern: 'niche-service-event',
      slug: `/feeds/${svc.slug}-${evt.slug}`,
      title: `${svc.label} for ${evt.label}`,
      h1: `${svc.label} for ${evt.label}`,
      keyword: `${svc.label.toLowerCase()} ${evt.label.toLowerCase()}`,
      service: svc.id,
      serviceLabel: svc.label,
      eventType: evt.id,
      eventLabel: evt.label,
      priority: 0.5,
      status: 'planned',
    });
  }
}

// Partner audience pages (PR agencies)
addPage({
  tier: 3,
  layer: 'national',
  pattern: 'audience-partner',
  slug: '/feeds/av-production-pr-agencies',
  title: 'AV Production for PR Agencies',
  h1: 'AV Production for PR & Event Agencies',
  keyword: 'av production pr agencies',
  service: 'av-production',
  serviceLabel: 'AV Production',
  industry: 'pr-agencies',
  industryLabel: 'PR Agencies',
  note: 'Partner audience — agencies sourcing production (Steven: talk and play)',
  priority: 0.8,
  status: 'planned',
});

// Sort by tier, then priority desc, then slug
pages.sort((a, b) => a.tier - b.tier || b.priority - a.priority || a.slug.localeCompare(b.slug));

const tierCounts = pages.reduce((acc, p) => {
  acc[p.tier] = (acc[p.tier] || 0) + 1;
  return acc;
}, {});

function pageXml(p) {
  const lines = [
    `    <page tier="${p.tier}" layer="${p.layer}" pattern="${p.pattern}" priority="${p.priority}" status="${p.status}">`,
    `      <slug>${esc(p.slug)}</slug>`,
    `      <url>${esc(BASE + p.slug)}</url>`,
    `      <title>${esc(p.title)}</title>`,
    `      <h1>${esc(p.h1)}</h1>`,
    `      <keyword>${esc(p.keyword)}</keyword>`,
  ];
  if (p.service) lines.push(`      <service id="${p.service}">${esc(p.serviceLabel)}</service>`);
  if (p.industry) lines.push(`      <industry id="${p.industry}">${esc(p.industryLabel)}</industry>`);
  if (p.eventType) lines.push(`      <eventType id="${p.eventType}">${esc(p.eventLabel)}</eventType>`);
  if (p.location) lines.push(`      <location id="${p.location}">${esc(p.locationLabel)}</location>`);
  if (p.crossRef) lines.push(`      <crossRef>${esc(p.crossRef)}</crossRef>`);
  if (p.aliases?.length) lines.push(`      <aliases>${p.aliases.map(esc).join(', ')}</aliases>`);
  if (p.fringeAliases?.length) lines.push(`      <fringeAliases>${p.fringeAliases.map(esc).join(', ')}</fringeAliases>`);
  if (p.excludeTerms?.length) lines.push(`      <excludeTerms>${p.excludeTerms.map(esc).join(', ')}</excludeTerms>`);
  if (p.note) lines.push(`      <note>${esc(p.note)}</note>`);
  lines.push('    </page>');
  return lines.join('\n');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/seo-page-matrix.xsl"?>
<seoPageMatrix
  xmlns="https://latestcrazeproductions.com/schemas/seo-page-matrix/1.0"
  generated="${new Date().toISOString()}"
  totalPages="${pages.length}">
  <meta>
    <site>${esc(BASE)}</site>
    <brand>Latest Craze Productions</brand>
    <description>Comprehensive SEO landing page matrix — service × industry × event × location combinations per LCP keyword strategy.</description>
    <tierSummary>
      <tier id="1" label="Head terms (event production, AV production, conference production)">${tierCounts[1] || 0}</tier>
      <tier id="2" label="Core services × event types (LED walls, event lighting, staging, audio)">${tierCounts[2] || 0}</tier>
      <tier id="3" label="Service × industry (pharmaceutical, cybersecurity, automotive, nonprofit…)">${tierCounts[3] || 0}</tier>
      <tier id="4" label="Service × industry × event type (high-intent long tail)">${tierCounts[4] || 0}</tier>
      <tier id="5" label="Arizona geo + Phoenix/Scottsdale cross-references">${tierCounts[5] || 0}</tier>
      <tier id="6" label="Nationwide geo markets × head services">${tierCounts[6] || 0}</tier>
      <tier id="7" label="Niche equipment (gobos, digital signage) + fringe aliases">${tierCounts[7] || 0}</tier>
    </tierSummary>
  </meta>
  <taxonomy>
    <headServices>${HEAD_SERVICES.map((s) => `<service id="${s.id}">${esc(s.label)}</service>`).join('')}</headServices>
    <coreServices>${CORE_SERVICES.map((s) => `<service id="${s.id}">${esc(s.label)}</service>`).join('')}</coreServices>
    <nicheServices>${NICHE_SERVICES.map((s) => `<service id="${s.id}">${esc(s.label)}</service>`).join('')}</nicheServices>
    <industries>${INDUSTRIES.map((i) => `<industry id="${i.id}">${esc(i.label)}</industry>`).join('')}</industries>
    <eventTypes>${EVENT_TYPES.map((e) => `<eventType id="${e.id}">${esc(e.label)}</eventType>`).join('')}</eventTypes>
    <locations>${LOCATIONS.map((l) => `<location id="${l.id}">${esc(l.city)}, ${l.state}</location>`).join('')}</locations>
  </taxonomy>
  <pages>
${pages.map(pageXml).join('\n')}
  </pages>
</seoPageMatrix>
`;

writeFileSync(OUT, xml, 'utf8');
console.log(`Wrote ${pages.length} pages to ${OUT}`);
console.log('Tier counts:', tierCounts);
