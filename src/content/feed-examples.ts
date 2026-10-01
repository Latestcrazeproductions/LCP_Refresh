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
    h1: 'Corporate Event Production',
    eyebrow: 'National · Full service',
    lead: `${BRAND} provides corporate event production nationwide — LED video, intelligent lighting, precision audio, staging, and show management for keynotes, conferences, galas, and brand activations.`,
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
      {
        question: 'How is this different from nationwide event production?',
        answer:
          'This page is corporate event production as a service — what we put on stage. Nationwide event production is the touring model: one technical standard across markets. Phoenix-local programs start at corporate event production in Phoenix.',
      },
    ],
    relatedLinks: [
      { href: '/feeds/av-production', label: 'AV production company' },
      { href: '/feeds/led-walls', label: 'LED walls for events' },
      { href: '/nationwide-event-production', label: 'Nationwide event production' },
      { href: '/phoenix-av-production', label: 'Corporate event production in Phoenix' },
      { href: '/services', label: 'All services' },
    ],
  },

  '/feeds/av-production': {
    h1: 'AV Production Company',
    eyebrow: 'National · Technical production',
    lead: `${BRAND} is an AV production company for corporate programs — LED walls, lighting, audio, staging, and show operation under one technical director, not a rental list with a different crew in every room.`,
    primaryCta: { label: 'Request an AV production consult', href: '/contact' },
    sections: [
      {
        title: 'What an AV production partner owns',
        body: 'AV production is the signal path, the cue, and the person who calls the show. We spec the wall, light the presenter for camera, mix the room and the stream, and run rehearsal against a hard out — then we stay on headset through strike. Gear without that ownership is a quote, not a show.',
        bullets: [
          'LED, lighting, audio, and staging as one plot — not four vendors',
          'Show caller and TD who own the file from rehearsal through encore',
          'Processor, RF, and backup paths written into the rider',
          'Same technical standard in Phoenix and on the road',
        ],
        imageLabel: 'Corporate AV production — LED, lighting, and audio',
      },
      {
        title: 'When you need a production company, not a rental house',
        body: 'Rental is the right buy when you have an in-house TD and a simple breakout. It fails when the CEO walks on, IMAG has to match the wall, and house AV is exclusive after 6 p.m. We bid the show: crew, cueing, and the failure modes — monsoon internet, soffit height, union dock windows — not just panel count.',
        imageLabel: 'General session AV — IMAG and line array',
      },
    ],
    capabilitiesTitle: 'AV production stack',
    capabilities: [
      'LED video walls & IMAG',
      'Intelligent lighting',
      'Line-array audio & RF',
      'Stage & scenic',
      'Show calling & TD',
      'Hybrid / streaming paths',
    ],
    faq: [
      {
        question: 'What is the difference between AV rental and AV production?',
        answer:
          'Rental delivers gear. Production delivers a show: design, crew, cue-to-cue, and someone accountable when the room or the stream breaks. We do both, but we quote production first.',
      },
      {
        question: 'Do you work outside Phoenix?',
        answer:
          'Yes. Phoenix is headquarters and warehouse. Touring crews run the same standard nationwide — see nationwide event production when the program hits multiple markets.',
      },
      {
        question: 'Can you work with in-house or venue AV?',
        answer:
          'Yes. We write who patches the clicker, who owns the switcher, and who talks to the union steward before load-in. Unwritten splits are how shows miss the first cue.',
      },
    ],
    relatedLinks: [
      { href: '/feeds/event-production', label: 'Corporate event production' },
      { href: '/feeds/led-walls', label: 'LED walls for events' },
      { href: '/nationwide-event-production', label: 'Nationwide event production' },
      { href: '/phoenix-av-production', label: 'Corporate event production in Phoenix' },
      { href: '/services', label: 'All services' },
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
      { href: '/feeds/event-production', label: 'Corporate event production' },
      { href: '/blog/corporate-gala-production-guide', label: 'Gala planning guide' },
      { href: '/work', label: 'Case studies' },
    ],
  },

  '/feeds/led-walls': {
    h1: 'LED Walls for Events',
    eyebrow: 'LED video · Technical capability',
    lead: 'LED walls for events — ultra-wide video, IMAG, and stage-backdrop displays for corporate keynotes, product launches, and general sessions, engineered for sight lines, processor redundancy, and clean content delivery.',
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
      {
        question: 'Is this LED wall rental or production?',
        answer:
          'We provide the wall as part of a production: spec, processor path, content, and an onsite technician. Pure rental without show operation is a different quote — see the LED walls service page for capability detail.',
      },
    ],
    relatedLinks: [
      { href: '/services/led-walls', label: 'LED walls service page' },
      { href: '/feeds/event-production', label: 'Corporate event production' },
      { href: '/feeds/av-production', label: 'AV production company' },
      { href: '/blog/led-wall-sizing-for-events', label: 'LED wall sizing guide' },
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
      { href: '/phoenix-av-production', label: 'Corporate event production in Phoenix' },
      { href: '/feeds/av-production', label: 'AV production company' },
      { href: '/services', label: 'All services' },
      { href: '/featured-venues', label: 'Featured venues' },
    ],
  },

  '/feeds/event-production/scottsdale-az': {
    h1: 'Event Production in Scottsdale, AZ',
    eyebrow: 'Scottsdale · Resort & corporate',
    lead: `${BRAND} produces corporate events in Scottsdale — resort ballrooms, incentive programs, and general sessions along the Scottsdale Road corridor, with gear prepped at our Phoenix warehouse before every load-in.`,
    primaryCta: { label: 'Request a Scottsdale production consult', href: '/contact' },
    sections: [
      {
        title: 'Resort ballrooms are the default room type',
        body: 'Scottsdale corporate work clusters at full-service resorts — long receiving docks, golf-cart gear shuttles, and AV liaisons who know their rigging charts by heart. We load from Phoenix, walk the ballroom with house staff, and build against the actual ceiling height and chandelier positions, not a generic stage plot.',
        bullets: [
          'Receiving-dock appointments and resort security badging before first cart',
          'Ballroom turnovers between general session and gala — separate cue files',
          'Outdoor lawn and courtyard segments tied to the same show caller',
          'Programs that list Phoenix on the RFP but load in at a Scottsdale address',
        ],
        imageLabel: 'Scottsdale resort general session — LED and staging',
      },
      {
        title: 'One technical standard from warehouse to resort floor',
        body: 'Gear is prepped and QC’d at 4035 E Magnolia St in Phoenix, then trucked to Gainey Ranch, North Scottsdale resorts, Old Town hotels, or WestWorld depending on the room. When the same client adds a second market, crews travel under the same spec.',
        imageLabel: 'Scottsdale corporate gala — lighting and IMAG',
      },
    ],
    capabilitiesTitle: 'Scottsdale event production scope',
    capabilities: [
      'Resort general sessions & keynotes',
      'Incentive & awards programs',
      'LED walls & IMAG',
      'Intelligent lighting design',
      'Line-array audio & RF',
      'Show calling & rehearsal',
    ],
    faq: [
      {
        question: 'Do you produce events in Scottsdale if you are based in Phoenix?',
        answer:
          'Yes. Scottsdale is a core market — we prep at our Phoenix warehouse and load into Scottsdale resorts weekly. Distance is a logistics detail, not a different crew or standard.',
      },
      {
        question: 'Can you handle Phoenix-address RFPs with a Scottsdale venue?',
        answer:
          'Often. Planners search Phoenix; the property is on Scottsdale Road or in North Scottsdale. We plan for the load-in address, resort AV rules, and dock windows — not just the metro name on the contract.',
      },
      {
        question: 'Do Scottsdale programs travel to other cities?',
        answer:
          'Regularly. See nationwide event production for the touring model — same TD, same processor paths, different dock.',
      },
    ],
    relatedLinks: [
      { href: '/feeds/av-production/scottsdale-az', label: 'AV production in Scottsdale' },
      { href: '/blog/scottsdale-corporate-event-venues', label: 'Scottsdale venue production guide' },
      { href: '/nationwide-event-production', label: 'Nationwide event production' },
      { href: '/phoenix-av-production', label: 'Corporate event production in Phoenix' },
      { href: '/featured-venues', label: 'Featured venues' },
    ],
  },

  '/feeds/av-production/scottsdale-az': {
    h1: 'AV Production in Scottsdale, AZ',
    eyebrow: 'Scottsdale · Technical production',
    lead: `Scottsdale AV production from ${BRAND} — LED walls, lighting, audio, and show operation for resort ballrooms and corporate programs along the Camelback corridor, with Phoenix warehouse prep and nationwide crews when the tour leaves Arizona.`,
    primaryCta: { label: 'Talk to our Scottsdale AV team', href: '/contact' },
    sections: [
      {
        title: 'Resort AV is a negotiation, not a handoff',
        body: 'Scottsdale properties run house AV exclusives, rigging policies, and after-hours rules that vary floor to floor. We write who patches the clicker, who owns the switcher, and who meets the steward at the receiving dock — before gear leaves Phoenix.',
        bullets: [
          'House AV liaison calls during site visit, not day-of',
          'Ballroom rigging charts and flown-point approvals documented on the plot',
          'Separate paths for IMAG, stream, and room audio when house shares infrastructure',
          'Spares trucked from Magnolia St — not sourced from the resort closet',
        ],
        imageLabel: 'Scottsdale resort AV production — LED and line array',
      },
      {
        title: 'Old Town to North Scottsdale — different load-in math',
        body: 'A boutique Old Town hotel loads through a service elevator and a 90-degree corner. A North Scottsdale resort rolls in on a golf cart from a receiving dock a quarter-mile from the ballroom. Same show, different dock plan — we scout the path that actually fits a road case.',
        imageLabel: 'Scottsdale ballroom load-in — staging and cable path',
      },
    ],
    capabilitiesTitle: 'Scottsdale AV production stack',
    capabilities: [
      'LED video walls & IMAG',
      'Resort ballroom lighting',
      'Line-array audio & RF coordination',
      'Show caller & technical director',
      'Hybrid / streaming paths',
      'Nationwide touring standard',
    ],
    faq: [
      {
        question: 'Do you work with resort in-house AV teams?',
        answer:
          'Yes. We define splits early: house patch, outside vendor scope, and who is on headset for the general session. Unwritten splits are how Scottsdale shows miss the first cue.',
      },
      {
        question: 'How far in advance should we book Scottsdale resort AV?',
        answer:
          'For peak season (January–April) general sessions, 10–12 weeks is realistic. Resort dock slots and rigging approvals move faster when the plot is in front of the liaison early.',
      },
      {
        question: 'Is this different from nationwide AV production?',
        answer:
          'This page is Scottsdale-local AV. Nationwide event production is the same technical standard when your program hits Dallas, Denver, or a second resort market on the same tour.',
      },
    ],
    relatedLinks: [
      { href: '/feeds/event-production/scottsdale-az', label: 'Event production in Scottsdale' },
      { href: '/feeds/led-walls/scottsdale-az', label: 'LED walls in Scottsdale' },
      { href: '/nationwide-event-production', label: 'Nationwide event production' },
      { href: '/phoenix-av-production', label: 'Corporate event production in Phoenix' },
      { href: '/services', label: 'All services' },
    ],
  },

  '/feeds/conference-production/scottsdale-az': {
    h1: 'Conference Production in Scottsdale, AZ',
    eyebrow: 'Scottsdale · Multi-day programs',
    lead: `${BRAND} handles conference production in Scottsdale — general sessions, breakouts, and awards nights at resort campuses and expo halls, with one show file across ballroom turnovers and outdoor keynote segments.`,
    primaryCta: { label: 'Plan your Scottsdale conference', href: '/contact' },
    sections: [
      {
        title: 'Multi-day resort conferences need one show brain',
        body: 'Scottsdale incentive and user conferences often split across a main ballroom, breakout salons, and a pool-lawn keynote. We assign a technical director who owns the master schedule, RF plan, and asset handoff between rooms — not a different freelancer per space.',
        bullets: [
          'General session + breakout AV packages scoped as one program',
          'Ballroom flip schedules with house catering and rigging in writing',
          'Outdoor general sessions — shade, wind, and audio spill planned in site visit',
          'WestWorld and large expo layouts when the program outgrows the resort footprint',
        ],
        imageLabel: 'Scottsdale conference general session',
      },
      {
        title: 'Breakouts at Scottsdale resorts are not identical rooms',
        body: 'Salon 1 has a soffit that kills rear projection. Salon 3 shares a wall with a kitchen. We walk each breakout during the site visit and publish input/output lists — so day-two sessions do not start with a 45-minute cable hunt.',
        imageLabel: 'Scottsdale resort breakout — projection and audio',
      },
    ],
    capabilitiesTitle: 'Conference production capabilities',
    capabilities: [
      'General session & keynote',
      'Breakout room packages',
      'Awards & gala segments',
      'Hybrid / remote presenter paths',
      'Show calling across rooms',
      'Expo hall & large-format layouts',
    ],
    faq: [
      {
        question: 'Can you run general session and breakouts at the same Scottsdale resort?',
        answer:
          'Yes. We spec breakouts against the master RF and switching plan so general session rehearsal does not collide with breakout setup in adjacent salons.',
      },
      {
        question: 'Do you support outdoor general sessions in Scottsdale?',
        answer:
          'Yes, with caveats. Wind, sun angle, and noise curfew are production variables — not afterthoughts. We plan shade, audio spill, and a weather call window in the run of show.',
      },
    ],
    relatedLinks: [
      { href: '/feeds/event-production/scottsdale-az', label: 'Event production in Scottsdale' },
      { href: '/feeds/av-production/scottsdale-az', label: 'AV production in Scottsdale' },
      { href: '/nationwide-event-production', label: 'Nationwide event production' },
      { href: '/blog/scottsdale-corporate-event-venues', label: 'Scottsdale venue guide' },
      { href: '/contact', label: 'Contact' },
    ],
  },

  '/feeds/led-walls/scottsdale-az': {
    h1: 'LED Walls in Scottsdale, AZ',
    eyebrow: 'Scottsdale · LED video',
    lead: `LED walls for Scottsdale corporate events — resort ballrooms with deep sight lines, outdoor keynote backdrops, and IMAG packages sized for chandelier-heavy rooms along the Scottsdale resort corridor.`,
    primaryCta: { label: 'Discuss LED for your Scottsdale event', href: '/contact' },
    sections: [
      {
        title: 'Resort ballroom sight lines drive pixel pitch',
        body: 'Scottsdale ballrooms are wide and often shallow relative to the head table. We spec pitch from the last row and the IMAG camera position — not from a catalog sheet — and document processor paths before the resort rigging meeting.',
        bullets: [
          'Pixel pitch matched to room depth and camera distance',
          'Ground-stack vs flown — rigging approval before the quote is final',
          'Chandelier and soffit conflicts flagged on the site visit',
          'Outdoor LED — brightness, wind load, and power from a named resort circuit',
        ],
        imageLabel: 'Scottsdale resort LED wall — keynote',
      },
      {
        title: 'Content rehearsal belongs in the ballroom, not the shop',
        body: 'Resort Wi-Fi is for email. We test playback from the same processor path that runs show day, on the actual wall, after HVAC has been at show temperature — Scottsdale ballrooms drift white balance when the room finally cools down.',
        imageLabel: 'Wide-format LED with Scottsdale ballroom lighting',
      },
    ],
    capabilitiesTitle: 'LED specifications for Scottsdale rooms',
    capabilities: [
      '1.9mm – 3.9mm indoor panels',
      'Outdoor high-bright packages',
      'IMAG & presentation switching',
      'Processor redundancy',
      'Ground stack & flown rigging',
      'Onsite LED technician',
    ],
    faq: [
      {
        question: 'Can you fly LED in a Scottsdale resort ballroom?',
        answer:
          'When the house rigging chart allows it. Many properties cap flown weight or require their riggers. We submit plot and weight early — ground stack is a valid plan B, not a failure.',
      },
      {
        question: 'How do chandeliers affect LED sizing in Scottsdale ballrooms?',
        answer:
          'They reduce usable width and throw shadow on wide shots. We map chandelier locations on the plot and adjust wall width or add front light so IMAG does not look like a cave.',
      },
    ],
    relatedLinks: [
      { href: '/services/led-walls', label: 'LED walls service page' },
      { href: '/feeds/av-production/scottsdale-az', label: 'AV production in Scottsdale' },
      { href: '/blog/led-wall-sizing-for-events', label: 'LED wall sizing guide' },
      { href: '/nationwide-event-production', label: 'Nationwide event production' },
      { href: '/contact', label: 'Contact' },
    ],
  },

  '/feeds/event-lighting/scottsdale-az': {
    h1: 'Event Lighting in Scottsdale, AZ',
    eyebrow: 'Scottsdale · Lighting design',
    lead: `${BRAND} designs event lighting for Scottsdale programs — ballroom keynotes with crystal fixtures overhead, courtyard dinners with string-light competition, and awards looks that survive both camera and guest phone photos.`,
    primaryCta: { label: 'Plan Scottsdale event lighting', href: '/contact' },
    sections: [
      {
        title: 'Chandeliers are a lighting instrument, not decoration',
        body: 'Scottsdale resort ballrooms ship with permanent fixtures that read warm on camera and throw shadow on presenter faces. We plot key, fill, and backlight against the house chandelier grid — and confirm dimmer access with resort AV before load-in.',
        bullets: [
          'Presenter key light that does not fight permanent fixtures',
          'Awards and gala looks with separate cue stacks for dinner vs show',
          'Outdoor courtyard lighting — uplight, path, and stage wash as one plot',
          'Haze policy confirmed with resort fire panel rules in writing',
        ],
        imageLabel: 'Scottsdale gala lighting — stage wash and audience',
      },
      {
        title: 'Golden hour is a production deadline in Scottsdale',
        body: 'West-facing glass and courtyard doors mean the room look at 4 p.m. rehearsal is not the look at 7 p.m. doors. We schedule a white-balance and intensity checkpoint after sun angle changes — especially October through April peak season.',
        imageLabel: 'Scottsdale outdoor corporate event — lighting',
      },
    ],
    capabilitiesTitle: 'Scottsdale lighting toolkit',
    capabilities: [
      'Keynote & IMAG lighting',
      'Gala & awards looks',
      'Outdoor courtyard plots',
      'Intelligent fixtures & hazer',
      'Color temperature matching',
      'Show-caller lighting cues',
    ],
    faq: [
      {
        question: 'Is haze allowed in Scottsdale resort ballrooms?',
        answer:
          'Property by property. Some detections tie to the fire panel; others allow water-based haze with advance notice. We confirm in the site visit — not from a generic resort fact sheet.',
      },
      {
        question: 'Can you light an outdoor Scottsdale dinner and an indoor awards show?',
        answer:
          'Yes, as one lighting design with separate cue files. Outdoor wind and dimmer distance get their own page in the plot.',
      },
    ],
    relatedLinks: [
      { href: '/feeds/event-production/scottsdale-az', label: 'Event production in Scottsdale' },
      { href: '/feeds/av-production/scottsdale-az', label: 'AV production in Scottsdale' },
      { href: '/nationwide-event-production', label: 'Nationwide event production' },
      { href: '/services', label: 'All services' },
      { href: '/contact', label: 'Contact' },
    ],
  },

  '/feeds/audio-systems/scottsdale-az': {
    h1: 'Audio Systems in Scottsdale, AZ',
    eyebrow: 'Scottsdale · Audio & RF',
    lead: `${BRAND} deploys audio systems for Scottsdale corporate events — line arrays for resort ballrooms, RF plans that survive crowded spectrum during peak convention weeks, and outdoor programs where pool pumps qualify as ambient noise.`,
    primaryCta: { label: 'Discuss Scottsdale audio', href: '/contact' },
    sections: [
      {
        title: 'Resort ballrooms need RF discipline, not more mics',
        body: 'Peak season in Scottsdale means multiple concurrent galas on one property — and RF coordination with house AV, band backline, and presenter lavs. We scan, document, and assign frequencies before the first rehearsal, with backup mics routed on the plot.',
        bullets: [
          'RF scan during site visit when possible; coordination with resort AV',
          'Line-array coverage for deep ballrooms with balcony seating',
          'Band and DJ integration with one stage patch list',
          'Outdoor audio — spill, curfew, and wind noise on the rider',
        ],
        imageLabel: 'Scottsdale ballroom line-array audio',
      },
      {
        title: 'Breakout audio is where conferences lose clarity',
        body: 'Salon breakouts at Scottsdale resorts often share air-handling noise and thin walls. We spec speech reinforcement per room — not a speaker-on-a-stand package copied from the general session quote.',
        imageLabel: 'Scottsdale breakout — speech reinforcement',
      },
    ],
    capabilitiesTitle: 'Scottsdale audio capabilities',
    capabilities: [
      'Line-array main systems',
      'Wireless RF planning',
      'Breakout speech reinforcement',
      'Band & entertainment integration',
      'Streaming mix / mix-minus',
      'Show-comms & IFB',
    ],
    faq: [
      {
        question: 'Do you coordinate RF with Scottsdale resort house AV?',
        answer:
          'Yes. House teams often hold preferred frequency blocks. We share our RF list during prep and adjust before load-in — not after the first wireless dropout.',
      },
      {
        question: 'Can you handle outdoor keynote audio in Scottsdale?',
        answer:
          'Yes. Wind and ambient resort noise (pools, HVAC, nearby events) go on the site visit checklist. Delay speakers and sub placement are part of the quote, not a day-of surprise.',
      },
    ],
    relatedLinks: [
      { href: '/feeds/av-production/scottsdale-az', label: 'AV production in Scottsdale' },
      { href: '/feeds/conference-production/scottsdale-az', label: 'Conference production in Scottsdale' },
      { href: '/nationwide-event-production', label: 'Nationwide event production' },
      { href: '/services', label: 'All services' },
      { href: '/contact', label: 'Contact' },
    ],
  },

  '/feeds/staging/scottsdale-az': {
    h1: 'Staging in Scottsdale, AZ',
    eyebrow: 'Scottsdale · Staging & scenic',
    lead: `${BRAND} builds staging for Scottsdale corporate events — ballroom decks with low ceiling clearance, outdoor platforms with wind ratings, and scenic that clears resort rigging limits without shrinking the brand moment.`,
    primaryCta: { label: 'Plan Scottsdale staging', href: '/contact' },
    sections: [
      {
        title: 'Resort stage height is a rigging conversation',
        body: 'Scottsdale ballrooms often cap deck height or require house riggers for anything flown. We submit weight, footprint, and load-in path during the site visit — including whether a 24-foot truck can reach the receiving dock or stops at a golf-cart transfer.',
        bullets: [
          'Stage plot with weight and point loads for resort approval',
          'Ramp and ADA paths that survive fire marshal walkthrough',
          'Outdoor staging — wind load, ballast, and surface (grass, turf, hardscape)',
          'Quick-change scenic for gala-to-general-session turnovers',
        ],
        imageLabel: 'Scottsdale corporate stage — deck and scenic',
      },
      {
        title: 'Load-in paths vary more than the stage plot',
        body: 'North Scottsdale resorts move gear on carts from a remote dock. Old Town properties may require elevator sizing checks for deck pieces. We measure the path that fits the largest case — not the stage drawing alone.',
        imageLabel: 'Scottsdale resort load-in — staging cart path',
      },
    ],
    capabilitiesTitle: 'Staging & scenic scope',
    capabilities: [
      'Ballroom stage decks',
      'Outdoor platforms & risers',
      'Scenic & branding elements',
      'Rigging coordination',
      'ADA & presenter access',
      'Turnover-friendly modular builds',
    ],
    faq: [
      {
        question: 'Can you build stage in a Scottsdale ballroom with a low ceiling?',
        answer:
          'Usually with a lower deck and careful flown element planning. We confirm trim height and sprinkler clearance on the walkthrough — before scenic is built in Phoenix.',
      },
      {
        question: 'Do you stage outdoor events in Scottsdale resort courtyards?',
        answer:
          'Yes. Surface, wind, and noise curfew drive deck and ballast spec. Grass after irrigation is a load-in detail someone should plan for.',
      },
    ],
    relatedLinks: [
      { href: '/feeds/event-production/scottsdale-az', label: 'Event production in Scottsdale' },
      { href: '/feeds/led-walls/scottsdale-az', label: 'LED walls in Scottsdale' },
      { href: '/nationwide-event-production', label: 'Nationwide event production' },
      { href: '/featured-venues', label: 'Featured venues' },
      { href: '/contact', label: 'Contact' },
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
