/**
 * Nationwide event production hub content.
 * Source mirror: content-library/hubs/nationwide-event-production.md
 */

export interface NationwideHubSection {
  title: string;
  body: string;
  bullets?: string[];
  numbered?: string[];
}

export interface NationwideHubContent {
  h1: string;
  eyebrow: string;
  lead: string;
  intro: string;
  primaryCta: { label: string; href: string };
  sections: NationwideHubSection[];
  floorStory: { title: string; body: string };
  capabilitiesTitle: string;
  capabilities: { label: string; href: string }[];
  faq: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
}

export const NATIONWIDE_HUB: NationwideHubContent = {
  h1: 'Nationwide Event Production',
  eyebrow: 'National · Touring crews',
  lead:
    'Corporate event production across the United States — one technical standard, touring crews, and show operation from Phoenix HQ.',
  intro:
    'Nationwide event production is the decision to run the same technical standard in every market — not a different AV vendor in every city who interprets your deck differently. This page covers when touring production beats local-only AV, what to lock before your RFP, and the questions that separate a real touring partner from a rental house with a mileage line item.',
  primaryCta: { label: 'Request a production consult', href: '/contact' },
  sections: [
    {
      title: 'When nationwide production beats local-only AV',
      body: 'Multi-market programs fail quietly when each city gets a different crew interpreting the same creative. Pixel pitch shifts. Color temperature drifts. Slide safe zones crop differently. The audience in market three notices — even if they cannot name why the keynote felt cheaper than market one.',
      bullets: [
        'Your program travels — sales kickoffs, roadshow keynotes, or franchise conferences on a fixed run-of-show',
        'Brand consistency is non-negotiable — LED content, lighting looks, and IMAG framing must match market to market',
        'One accountable partner beats a patchwork — a single TD owns cue-to-cue across venues',
        'Load-in windows are tight — touring crews who know your show file beat a new local team at 6 a.m.',
      ],
    },
    {
      title: 'Lock these before the RFP goes out',
      body: 'Most nationwide RFPs list gear counts and travel days. Few list the production decisions that actually govern consistency. Define these internally first so vendors quote against a real spec.',
      bullets: [
        'Technical standard — native LED resolution, pixel pitch range, farthest-seat readability, lighting key looks',
        'Content pipeline — aspect ratio, safe zones, fonts, and who owns final pixel maps',
        'Crew travel plan — which roles tour vs hire locally (TD, show caller, LED tech, A1)',
        'Spares policy — processor cards, modules, RF packs, cable kits for the full tour',
        'Venue minimums — load-in dimensions, rigging limits, ceiling height, power, rehearsal block length',
      ],
    },
    {
      title: 'How we run multi-market programs',
      body: 'Our Phoenix warehouse is where shows get built before they travel — not where they get improvised on arrival.',
      numbered: [
        'Pre-pro and show file lock — CAD sight lines, content review, and cue structure before the first truck loads',
        'Warehouse QC — LED panels cycled, processors mapped, spares packed against your show failure surface',
        'Touring crew deployment — TD and core operators travel with the show file; local labor supplements where it helps',
        'Market load-in playbook — same cable labeling, same patch, same calibration sequence in every venue',
        'Show call and strike — one show caller owns cue-to-cue; strike timed for the next market freight window',
      ],
    },
    {
      title: 'Questions to ask any touring production partner',
      body: 'Use these in bid review. References beat spec sheets.',
      bullets: [
        'Show me a multi-market program at this pixel pitch and seating depth — what broke on the road?',
        'Who travels with the show file, and who has authority to change cues mid-tour?',
        'What is your spares ratio for LED processors and RF on a five-market run?',
        'How do you handle a venue whose rigging plot does not match the CAD you sold the client?',
        'What is the minimum rehearsal block before doors — and do you enforce it when the schedule slips?',
      ],
    },
  ],
  floorStory: {
    title: 'What stays consistent from market to market',
    body: 'Venues change: rigging points move, load-in paths shrink, power differs, and local labor joins at each stop. The useful constant is a documented show file, core leads who already know it, and a repeatable prep and check process. That does not eliminate local variables; it gives the production team a known baseline for resolving them without reinventing the show.',
  },
  capabilitiesTitle: 'Production capabilities',
  capabilities: [
    { label: 'LED video walls & IMAG', href: '/services/led-walls' },
    { label: 'Intelligent lighting design', href: '/services/lighting' },
    { label: 'Line-array audio & RF', href: '/services/audio' },
    { label: 'Stage design & scenic', href: '/services/stage' },
    { label: 'Projection mapping', href: '/services/projection' },
    { label: 'Show operation & cueing', href: '/services' },
  ],
  faq: [
    {
      question: 'Do you produce events outside Arizona?',
      answer:
        'Yes. We maintain a Phoenix headquarters and warehouse for prep and QC, and deploy touring crews nationwide for corporate keynotes, conferences, galas, and multi-market programs.',
    },
    {
      question: 'How far in advance should we book a multi-market tour?',
      answer:
        'For programs hitting three or more markets, 10–12 weeks is ideal — enough time for pre-pro, content lock, and warehouse QC. Tighter timelines are possible depending on scope and inventory.',
    },
    {
      question: 'Do you hire local crew in each market?',
      answer:
        'We supplement with local labor where it makes sense — loaders, riggers, and venue-specific roles. Core show operators who own the show file travel with the production.',
    },
    {
      question: 'What makes nationwide production different from renting AV locally?',
      answer:
        'Consistency and accountability. One technical standard, one show file, one TD who owns cue-to-cue — instead of a new vendor interpreting your creative in every city.',
    },
  ],
  relatedLinks: [
    { href: '/services', label: 'All services' },
    { href: '/events', label: 'Events we create' },
    { href: '/blog/led-wall-sizing-for-events', label: 'LED wall sizing guide' },
    { href: '/resources/event-production-checklist', label: 'Production checklist' },
    { href: '/work', label: 'Case studies' },
    { href: '/phoenix-av-production', label: 'Phoenix AV production' },
  ],
};
