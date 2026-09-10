/**
 * Featured venues hub — authority venue guide content.
 * Refreshed by AuthorityContentAgent (Track B).
 */

export interface FeaturedVenuesSection {
  title: string;
  body: string;
  bullets?: string[];
  numbered?: string[];
}

export interface FeaturedVenuesHubContent {
  h1: string;
  eyebrow: string;
  lead: string;
  intro: string;
  primaryCta: { label: string; href: string };
  sections: FeaturedVenuesSection[];
  floorStory: { title: string; body: string };
  capabilitiesTitle: string;
  capabilities: { label: string; href: string }[];
  relatedLinks: { href: string; label: string }[];
}

export const FEATURED_VENUES_HUB: FeaturedVenuesHubContent = {
  h1: 'Featured Venues',
  eyebrow: 'Venue production',
  lead:
    'Production considerations for hotels, convention centers, resorts, and non-traditional spaces — what to verify before you sign, what to send your AV partner, and where house rules quietly cap your show.',
  intro:
    'Venue selection and production design are the same decision split in half. A ballroom that photographs well for the sales tour can still fail your keynote when ceiling height caps truss height, house power cannot feed a 40-foot LED wall, or the freight elevator stops at 5 p.m. on Fridays. This guide covers venue categories, what to measure on a site visit, and the packet your production vendor needs to quote accurately — not a list of properties we prefer, but the technical questions seasoned planners ask before the contract is signed.',
  primaryCta: { label: 'Plan your venue production', href: '/contact' },
  sections: [
    {
      title: 'How venue type changes your production plan',
      body: 'Every venue category has a default assumption baked in. Hotels assume banquet rounds and a single breakout down the hall. Convention centers assume union jurisdiction and long dock hours. Resorts assume guest experience first and load noise second. Unique spaces assume nothing — which is either freedom or a blank check for surprises.',
      bullets: [
        'Hotel ballrooms — column spacing, chandelier rigging restrictions, split-level floors, and noise curfews that start before your strike finishes',
        'Convention centers — house rigging plots, union call times, power distro locations, and whether your general session shares air walls with another show',
        'Resort properties — outdoor ceremony backup, golf-cart load paths, generator placement away from guest rooms, and AV storage overnight',
        'Non-traditional spaces — warehouses, museums, and rooftop terraces: ground-support-only staging, weather holds, and permit lead times for amplified sound',
        'Hybrid-ready venues — dedicated encoder room, hardline internet handoff, and camera positions that work for both IMAG and a 16:9 stream frame',
      ],
    },
    {
      title: 'Site visit through vendor packet — one pass, no gaps',
      body: 'Bring a tape measure, your phone camera, and someone who cares about sight lines — not just the catering manager. What you capture on the walkthrough becomes the production quote. Vendors fill gaps with assumptions; three competent companies will assume three different things from the same incomplete packet.',
      numbered: [
        'Ceiling height at stage downstage center and at FOH — rigged truss vs ground-support changes everything',
        'Column locations and spacing — mark them on a floor plan; they dictate LED width and camera cross-shoot angles',
        'Power — house cam-lock locations, amperage per leg, generator pad access if supplemental distro is required',
        'Rigging — house points on CAD, weight limits, dead-hang vs bridled spans, and whether motors are in-house or BYO',
        'Load-in path — dock height, freight elevator dimensions and hours, distance from dock to ballroom, union escort rules',
        'FOH and camera positions — rear center sight lines, balcony sight lines, ADA seating sight lines, stream safe zones',
        'Noise and curfew — amplified sound cutoff, strike deadline, decibel limits during cocktail hour next door',
        'Marked floor plan for vendor — stage footprint, FOH, camera positions, cable paths, and ADA seating blocks',
        'Venue tech packet — house AV contact, rigging plot, power one-line, union rules if applicable',
        'Agenda and format — general session length, panel count, awards segment, hybrid stream yes/no, breakout rooms tied to main show',
        'Content inventory — slide aspect ratio, video rolls, IMAG needs, LED vs projection preference',
        'Load-in and rehearsal windows — actual hours, not "morning of"; note when the room must clear for another event',
        'Photos from site visit — ceiling, columns, dock path, and anything the CAD will not show',
      ],
    },
    {
      title: 'House AV, union rules, and scaling to the room',
      body: 'The same creative brief produces different gear lists in a 400-seat breakout vs a 2,000-seat general session. Match production scope to room geometry and house constraints — not to the last show the client liked on Instagram. Clarify who owns what before load-in day; that conversation is cheaper at contract stage than at 6 a.m. on the dock.',
      bullets: [
        'In-house AV vs outside vendor — exclusivity clauses, patch fees, and whether house staff operate your gear or only theirs',
        'Union jurisdiction — which trades touch your load-in, minimum call times, and whether your crew can touch truss after house riggers fly it',
        'LED wall sizing — farthest-seat readability, pixel pitch, and whether ground-support avoids a rigging fight',
        'Audio — line array vs point-source for the room volume; delay speakers for deep ballroom throws; RF coordination with house Wi-Fi',
        'Lighting — keynote looks vs awards looks; haze policy; whether the house chandelier must stay on and how that affects front light',
        'IMAG and cameras — minimum coverage for presenter, content, and wide; stream frame safe zones if hybrid',
        'Rehearsal block — cue-to-cue time is a venue constraint too; a 6 p.m. hard out means rehearsal starts earlier, not faster',
      ],
    },
  ],
  floorStory: {
    title: 'From the floor',
    body: 'A general session once shared an air wall with a trade show that ran amplified demos until noon. Our keynote sound check started at 11:30. The house plot showed a solid partition; the wall was two layers of fabric over a steel track with a four-inch gap at the ceiling. Every bass hit from the expo side arrived in the ballroom like a second kick drum. Production added a delay speaker ring and pushed FOH gain — reasonable fixes for a room, not for a wall that was never going to be a wall. The show ran clean after a 40-minute negotiation to pause demos next door. The venue was fine. The site visit had measured ceiling height and column spacing but nobody knocked on the shared partition. When your room touches another event, listen through the wall before you sign.',
  },
  capabilitiesTitle: 'Production capabilities by venue',
  capabilities: [
    { label: 'LED video walls & IMAG', href: '/services/led-walls' },
    { label: 'Intelligent lighting design', href: '/services/lighting' },
    { label: 'Line-array audio & RF', href: '/services/audio' },
    { label: 'Stage design & scenic', href: '/services/stage' },
    { label: 'Conference & general session', href: '/services/conferences' },
    { label: 'Projection & mapping', href: '/services/projection' },
  ],
  relatedLinks: [
    { href: '/services', label: 'All services' },
    { href: '/phoenix-av-production', label: 'Phoenix AV production' },
    { href: '/nationwide-event-production', label: 'Nationwide production' },
    { href: '/resources/event-production-checklist', label: 'Production checklist' },
    { href: '/blog/led-wall-sizing-for-events', label: 'LED wall sizing guide' },
    { href: '/work', label: 'Case studies' },
  ],
};
