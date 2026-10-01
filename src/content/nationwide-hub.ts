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
  introSecondary?: string;
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
    'Nationwide event production is the decision to run the same technical standard in every market — not a different AV vendor in every city who interprets your deck differently. This page covers when touring production beats local-only AV, what to lock before your RFP, how touring budgets should split core vs market-flex spend, and the questions that separate a real touring partner from a rental house with a mileage line item.',
  introSecondary:
    'Latest Craze Productions is headquartered in Phoenix with warehouse prep, QC, and show-ready inventory. We deploy nationwide for keynotes, conferences, galas, product launches, and multi-city programs where brand moments cannot reset between markets.',
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
        'Content reuse matters — marketing needs one capture package, not twelve incompatible cuts from regional vendors',
      ],
    },
    {
      title: 'When local-only AV still wins',
      body: 'Nationwide touring is not the default for every corporate event. Single-market shows with established venue relationships, no travel requirement, and creative that changes city to city often run cleaner with a strong local partner who knows the house.',
      bullets: [
        'One-night general sessions in a single market with no content capture requirement',
        'Programs where creative, scenic, or format changes completely between stops',
        'Venues with mandatory in-house AV exclusivity and no practical path for outside production',
        'Budgets that cannot fund touring crew, spares, freight, or advance coordination across three or more markets',
      ],
    },
    {
      title: 'Lock these before the RFP goes out',
      body: 'Most nationwide RFPs list gear counts and travel days. Few list the production decisions that actually govern consistency. Define these internally first so vendors quote against a real spec — not a ballroom photo and a prayer.',
      bullets: [
        'Technical standard — native LED resolution, pixel pitch range, farthest-seat readability, lighting key looks within a defined foot-candle range',
        'Content pipeline — aspect ratio, safe zones, fonts, lower-thirds templates, and who owns final pixel maps',
        'Crew travel plan — which roles tour vs hire locally (TD, show caller, LED tech, A1, playback operator)',
        'Spares policy — processor cards, modules, RF packs, cable kits, and backup paths for the full tour',
        'Venue minimums — load-in dimensions, rigging limits, ceiling height, power, rehearsal block length',
        'Single point of contact — one owner for run-of-show changes across all markets, named in the contract',
      ],
    },
    {
      title: 'How touring budget should split core vs market-flex',
      body: 'Multi-city tours fail in the budget review when every market gets the same line-item template and nobody owns what must stay identical versus what the room will override. Three layers keep finance, production, and regional teams aligned.',
      bullets: [
        'Core touring package — switcher and playback paths, primary LED or projection kit, touring audio backbone, show caller or TD, branded graphics templates, and spares that travel stop to stop',
        'Market flex — venue-specific rigging adapters, supplemental power, local PA augmentation, extra delay fills, union labor, and freight or storage driven by room geometry',
        'Program overhead — advance coordination, site validation, freight logistics, QC between stops, contingency for gear failure, and one run-of-show source of truth',
        'Change-order triggers — air-wall moves, added breakouts, extended rehearsal, and overnight holds; confirm line items before sign-off, not at load-in',
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
        'How do you split core touring kit vs market-flex spend in the quote — and what triggers a change order?',
      ],
    },
  ],
  floorStory: {
    title: 'From the floor',
    body: 'Market four load-in started on the CAD the client approved in pre-pro. The venue rigging plot arrived overnight with house points six feet downstage of where the LED wall was sold. The TD spent the first hour on a tablet, not on the floor, reframing content and tightening the IMAG crop so the keynote still read from row Q. The show opened on time. Nobody in the audience knew. The rigging plot had been in the venue packet since March.',
  },
  capabilitiesTitle: 'Production capabilities',
  capabilities: [
    { label: 'LED video walls & IMAG', href: '/services/led-walls' },
    { label: 'Intelligent lighting design', href: '/services/lighting' },
    { label: 'Line-array audio & RF', href: '/services/audio' },
    { label: 'Stage design & scenic', href: '/services/stage' },
    { label: 'Projection mapping', href: '/services/projection' },
    { label: 'Conference & general session', href: '/services/conferences' },
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
    {
      question: 'Can you support hybrid or streamed segments on a touring program?',
      answer:
        'Yes. Hybrid adds encoder placement, return feeds, and camera positions that work for both IMAG and a 16:9 stream frame. Those specs belong in the touring show file and advance packet — not a separate add-on per market.',
    },
  ],
  relatedLinks: [
    { href: '/services', label: 'All services' },
    { href: '/events', label: 'Events we create' },
    { href: '/blog/standardize-av-vendors-across-markets', label: 'Standardize AV vendors across markets' },
    { href: '/blog/touring-show-technical-riders-for-planners', label: 'Touring show technical riders' },
    { href: '/blog/av-budget-allocation-for-multi-city-tours', label: 'AV budget for multi-city tours' },
    { href: '/blog/brand-consistency-across-annual-meetings', label: 'Brand consistency across markets' },
    { href: '/blog/led-wall-sizing-for-events', label: 'LED wall sizing guide' },
    { href: '/resources/event-production-checklist', label: 'Production checklist' },
    { href: '/featured-venues', label: 'Featured venues guide' },
    { href: '/work', label: 'Case studies' },
    { href: '/feeds/event-production', label: 'Corporate event production' },
    { href: '/phoenix-av-production', label: 'Corporate event production in Phoenix' },
  ],
};
