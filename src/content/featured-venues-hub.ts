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
    'Venue selection and production design are the same decision split in half. A ballroom that photographs well on the sales tour can still fail your keynote when ceiling height caps truss height, house power cannot feed a 40-foot LED wall, or the freight elevator locks at 5 p.m. on Fridays. This guide covers venue categories, what to measure on a site visit, how house AV and your production partner divide labor, and the packet your vendor needs to quote accurately — not a list of properties we prefer, but the technical questions seasoned planners ask before the contract is signed.',
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
        'Storage and overnight hold — where cases sit between load-in and show day, and whether the venue clears the room for another event overnight',
        'Venue tech packet — house AV contact, rigging plot, power one-line, union rules if applicable',
        'Agenda and format — general session length, panel count, awards segment, hybrid stream yes/no, breakout rooms tied to main show',
        'Content inventory — slide aspect ratio, video rolls, IMAG needs, LED vs projection preference',
        'Photos from site visit — ceiling, columns, dock path, and anything the CAD will not show',
      ],
    },
    {
      title: 'House AV, union labor, and who owns what',
      body: 'Most venue failures are scope gaps, not bad gear. House AV sells a package; your production partner sells a show. If nobody writes down who patches the clicker, who runs the switcher, and who gets called when the union steward says your truss is 30 minutes early, you will find out at load-in.',
      bullets: [
        'House AV scope — projectors, basic PA, lectern mic, and a tech who knows the room; rarely includes IMAG, show calling, or custom lighting looks',
        'Union jurisdiction — who can touch cable, who can climb, and whether your vendor\'s crew can operate house gear or must use house labor',
        'Rigging and motors — house points vs ground-support-only; who supplies motors, who signs the rigging plot, and who holds insurance for overhead work',
        'Power handoff — house distro vs supplemental generator; who coordinates tie-in and who pays for after-hours electrician calls',
        'Internet and streaming — venue hardline vs cellular backup; encoder placement, VLAN access, and whether IT will be on-site show day',
        'Change-order triggers — air-wall moves, added breakout rooms, extended rehearsal, and overnight hold all have line items; confirm them in writing before sign-off',
      ],
    },
    {
      title: 'Scaling production to the room — not the brochure',
      body: 'The same creative brief produces different gear lists in a 400-seat breakout vs a 2,000-seat general session. Match production scope to room geometry and house constraints — not to the last show the client liked on Instagram. Clarify who owns what before load-in day; that conversation is cheaper at contract stage than at 6 a.m. on the dock.',
      bullets: [
        'LED wall sizing — farthest-seat readability, pixel pitch, and whether ground-support avoids a rigging fight',
        'Audio — line array vs point-source for the room volume; delay speakers for deep ballroom throws; RF coordination with house Wi-Fi',
        'Lighting — keynote looks vs awards looks; haze policy; whether the house chandelier must stay on and how that affects front light',
        'IMAG and cameras — minimum coverage for presenter, content, and wide; stream frame safe zones if hybrid',
        'Breakout vs general session — shared gear pools, duplicate switchers, and whether breakouts need independent record paths',
        'Rehearsal block — cue-to-cue time is a venue constraint too; a 6 p.m. hard out means rehearsal starts earlier, not faster',
        'Strike window — how fast the room must clear affects cable paths and whether you can leave cases staged for a multi-day show',
      ],
    },
  ],
  floorStory: {
    title: 'From the floor',
    body: 'Load-in for a corporate awards show started at 6 a.m. on a convention center dock. The outside vendor\'s truck was on time. The union steward was also on time, with a clipboard showing no rigging permit on file. House rigging would not touch the motors until the form was signed by the exhibitor services manager, who arrives at 8. Ground-support for the LED went up instead — slower, but no paperwork. The permit appeared at 8:15. The truss the vendor originally planned was already irrelevant. The show looked fine. The lesson is administrative: union venues have gates that are not physical. Ask for the rigging submission deadline when you book, not when the truck idles on the dock.',
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
    { href: '/blog/hybrid-event-av-checklist', label: 'Hybrid event AV checklist' },
    { href: '/work', label: 'Case studies' },
  ],
};
