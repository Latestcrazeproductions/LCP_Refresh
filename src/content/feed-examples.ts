import type { FeedRegistryEntry } from '@/lib/feed-registry';

export interface FeedSection {
  title: string;
  body: string;
  bullets?: string[];
  imageLabel?: string;
}

export interface FeedPageContent {
  h1: string;
  lead: string;
  eyebrow: string;
  primaryCta: { label: string; href: string };
  sections: FeedSection[];
  capabilitiesTitle: string;
  capabilities: string[];
  faq: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
}

const BRAND = 'Latest Craze Productions';

const SAMPLE_CONTENT: Record<string, FeedPageContent> = {
  '/feeds/event-production': {
    h1: 'Event Production for Corporate Events',
    eyebrow: 'National · Full service',
    lead: `${BRAND} plans and executes corporate event production nationwide — LED video, intelligent lighting, precision audio, staging, and show management for keynotes, conferences, galas, and brand activations.`,
    primaryCta: { label: 'Request a production consult', href: '/contact' },
    sections: [
      {
        title: 'What corporate event production includes',
        body: 'We own the technical stack from design through show call — not just gear rental. That means unified creative, reliable cueing, and one accountable partner when the general session has to land.',
        bullets: [
          'Run-of-show planning and rehearsal management',
          'LED walls, lighting, audio, and staging integration',
          'Experienced show callers and technical directors',
          'Nationwide crews with Phoenix headquarters',
        ],
        imageLabel: 'Corporate general session — LED and staging',
      },
      {
        title: 'Built for high-stakes programs',
        body: 'Planners come to us when brand moments cannot fail — executive keynotes, product reveals, awards flows, and multi-day conferences where AV quality is part of the message.',
        imageLabel: 'Keynote stage — lighting and IMAG',
      },
    ],
    capabilitiesTitle: 'Core production capabilities',
    capabilities: [
      'LED video walls & IMAG',
      'Intelligent lighting design',
      'Line-array audio & RF',
      'Stage design & scenic',
      'Projection mapping',
      'Show operation & cueing',
    ],
    faq: [
      {
        question: 'Do you produce events outside Arizona?',
        answer: 'Yes. We produce corporate events nationwide while maintaining a Phoenix headquarters and warehouse for prep and quality control.',
      },
      {
        question: 'How far in advance should we book?',
        answer: 'For major general sessions and galas, 8–12 weeks is ideal. Tighter timelines are possible depending on scope and venue.',
      },
    ],
    relatedLinks: [
      { href: '/services', label: 'All services' },
      { href: '/events', label: 'Events we create' },
      { href: '/feeds/conference-production', label: 'Conference production' },
      { href: '/feeds/av-production', label: 'AV production' },
    ],
  },

  '/feeds/av-production-galas-awards': {
    h1: 'AV Production for Galas & Awards',
    eyebrow: 'Galas & awards · National',
    lead: 'Premium AV production for corporate galas and awards programs — dramatic lighting, LED content, precision audio, and cue-to-cue show flow that keeps guests engaged from reception through final applause.',
    primaryCta: { label: 'Plan your gala production', href: '/contact' },
    sections: [
      {
        title: 'Guest experience starts at the door',
        body: 'Gala production is more than a stage wash. We design arrival moments, dinner transitions, video packages, and awards segments as one continuous experience — with lighting and video that reinforce the evening’s tone.',
        bullets: [
          'Awards segment timing and teleprompter support',
          'Entertainment cues and band integration',
          'LED content for honorees and sponsor moments',
          'Dedicated rehearsal for show caller and stage management',
        ],
        imageLabel: 'Gala awards stage — lighting and LED',
      },
      {
        title: 'Show flow without surprises',
        body: 'Our team runs cue-to-cue rehearsals with your emcee, honorees, and video playback so segment transitions feel effortless on show night.',
        imageLabel: 'Awards ceremony — IMAG and stage',
      },
    ],
    capabilitiesTitle: 'Gala production toolkit',
    capabilities: [
      'Awards show calling',
      'LED & video playback',
      'Scenic & stage design',
      'Wireless audio & RF planning',
      'Intelligent lighting looks',
      'VIP and talent green room support',
    ],
    faq: [
      {
        question: 'Can you support both dinner and awards in one room?',
        answer: 'Yes. We plan lighting and audio transitions between dinner service and the awards program so the room transform feels intentional, not rushed.',
      },
      {
        question: 'Do you work with outside entertainment?',
        answer: 'We integrate bands, DJs, and talent with our show caller and technical director so all cues stay synchronized.',
      },
    ],
    relatedLinks: [
      { href: '/events/galas-awards', label: 'Gala events overview' },
      { href: '/feeds/event-production', label: 'Event production' },
      { href: '/blog/corporate-gala-production-guide', label: 'Gala planning guide' },
      { href: '/work/night-of-hope', label: 'Case study: Night of Hope' },
    ],
  },

  '/feeds/led-walls': {
    h1: 'LED Walls for Corporate Events',
    eyebrow: 'LED video · Technical capability',
    lead: 'Ultra-wide LED video walls, IMAG, and stage-backdrop displays for corporate keynotes, product launches, and general sessions — engineered for sight lines, processor redundancy, and clean content delivery.',
    primaryCta: { label: 'Discuss LED for your event', href: '/contact' },
    sections: [
      {
        title: 'LED that reads on camera and in the room',
        body: 'We specify panel pitch, processor paths, and mounting for your venue footprint — whether you need a 40-foot keynote wall or a multi-screen breakout experience.',
        bullets: [
          'Pixel pitch matched to room depth and camera needs',
          'Processor redundancy for critical general sessions',
          'Ground-supported and flown configurations',
          'Content specs and onsite playback support',
        ],
        imageLabel: 'LED video wall — corporate keynote',
      },
      {
        title: 'Integrated with the full production stack',
        body: 'LED is rarely standalone. We pair walls with lighting, audio, and staging so the entire stage picture supports your content — not competes with it.',
        imageLabel: 'Wide-format LED with stage lighting',
      },
    ],
    capabilitiesTitle: 'LED specifications we plan for',
    capabilities: [
      '1.9mm – 3.9mm indoor panels',
      '4K processor paths',
      'IMAG & presentation switching',
      'Ground stack & flown rigging',
      'Fast-turn content testing',
      'Onsite LED technician',
    ],
    faq: [
      {
        question: 'How do you determine the right pixel pitch?',
        answer: 'We factor viewing distance, room depth, IMAG usage, and budget. Tighter pitch for camera-heavy keynotes; optimized pitch for larger ballroom sight lines.',
      },
    ],
    relatedLinks: [
      { href: '/services/led-walls', label: 'LED walls service page' },
      { href: '/feeds/event-production', label: 'Event production' },
      { href: '/feeds/av-production-corporate-keynotes', label: 'AV for keynotes' },
    ],
  },

  '/feeds/av-production/phoenix-az': {
    h1: 'AV Production in Phoenix, AZ',
    eyebrow: 'Phoenix · Local + nationwide',
    lead: `Phoenix AV production from ${BRAND} — LED walls, lighting, audio, and staging for Valley venues, resorts, and convention spaces, with nationwide deployment when your program travels.`,
    primaryCta: { label: 'Talk to our Phoenix team', href: '/contact' },
    sections: [
      {
        title: 'Phoenix headquarters, production-grade warehouse',
        body: 'We prep and QC gear at 4035 E Magnolia St before load-in — so Phoenix events get the same technical standard as our road shows. Scottsdale, Tempe, and Chandler programs are in our regular rotation.',
        bullets: [
          'Local load-in crews who know Valley venues',
          'Warehouse prep and spares before every show',
          'Resort ballroom and convention center experience',
          'Same team for Phoenix anchor + national tour dates',
        ],
        imageLabel: 'Phoenix corporate event — AV production',
      },
      {
        title: 'Searchers say Phoenix — events are often Scottsdale',
        body: 'Many corporate programs list Phoenix while the venue sits in Scottsdale or Tempe. We plan logistics for the actual load-in address, not just the metro name on the RFP.',
        imageLabel: 'Scottsdale resort ballroom production',
      },
    ],
    capabilitiesTitle: 'Phoenix AV services',
    capabilities: [
      'LED walls & video',
      'Event lighting',
      'Line-array audio',
      'Stage & scenic',
      'Show management',
      'Nationwide touring crews',
    ],
    faq: [
      {
        question: 'Are you based in Phoenix?',
        answer: 'Yes. Our headquarters and warehouse are at 4035 E Magnolia St, Phoenix, AZ 85034. We serve the Valley and travel nationwide.',
      },
      {
        question: 'Do you work Scottsdale resort ballrooms?',
        answer: 'Regularly. We coordinate with resort AV liaisons, rigging policies, and load-in windows across Scottsdale, Phoenix, and Tempe properties.',
      },
    ],
    relatedLinks: [
      { href: '/phoenix-av-production', label: 'Phoenix AV production hub' },
      { href: '/feeds/av-production/scottsdale-az', label: 'Scottsdale AV production' },
      { href: '/services', label: 'All services' },
      { href: '/featured-venues', label: 'Featured venues' },
    ],
  },
};

function genericContent(entry: FeedRegistryEntry): FeedPageContent {
  const isGeo = entry.layer === 'geo';
  return {
    h1: entry.title,
    eyebrow: isGeo ? 'Local production' : 'Corporate events',
    lead: `${BRAND} provides ${entry.keyword} for corporate planners who need reliable AV, staging, and show management.`,
    primaryCta: { label: 'Contact our team', href: '/contact' },
    sections: [
      {
        title: 'Production scope',
        body: 'This preview page uses registry metadata. Approved layouts will receive full copy from the content library and agent workflow.',
        imageLabel: entry.title,
      },
    ],
    capabilitiesTitle: 'Capabilities',
    capabilities: ['LED & video', 'Lighting', 'Audio', 'Staging', 'Show management'],
    faq: [],
    relatedLinks: [
      { href: '/services', label: 'Services' },
      { href: '/contact', label: 'Contact' },
      { href: '/feeds', label: 'Feed previews' },
    ],
  };
}

export function getFeedPageContent(entry: FeedRegistryEntry): FeedPageContent {
  return SAMPLE_CONTENT[entry.url] ?? genericContent(entry);
}
