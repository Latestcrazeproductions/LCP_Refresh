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
    'Production considerations for hotels, convention centers, resorts, and non-traditional spaces — what to verify before you sign and what to hand your AV partner before load-in.',
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
      title: 'Site visit checklist — measure before you mood-board',
      body: 'Bring a tape measure, your phone camera, and someone who cares about sight lines — not just the catering manager. Photos beat memory when the production company asks for ceiling height six weeks later.',
      bullets: [
        'Ceiling height at stage downstage center and at FOH position — rigged truss vs ground-support changes everything',
        'Column locations and spacing — mark them on a floor plan; they dictate LED width and camera cross-shoot angles',
        'Power — house cam-lock locations, amperage per leg, generator pad access if you need supplemental distro',
        'Rigging — house points on CAD, weight limits, dead-hang vs bridled spans, and whether motors are in-house or BYO',
        'Load-in path — dock height, freight elevator dimensions and hours, distance from dock to ballroom, union escort rules',
        'FOH and camera positions — rear center sight lines, balcony sight lines, ADA seating sight lines, no-go zones for stream framing',
        'Noise and curfew — amplified sound cutoff, strike deadline, and whether the hotel enforces decibel limits during cocktail hour next door',
        'Storage and overnight hold — where cases sit between load-in and show day, and whether the venue clears the room for another event overnight',
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
      title: 'What to send your production vendor with the venue packet',
      body: 'Vendors quote against the information they receive. A floor plan without column marks and a one-line "load-in at 8 a.m." produces three different numbers from three competent companies — because each filled a different gap with a different assumption.',
      numbered: [
        'Marked floor plan — stage footprint, FOH, camera positions, cable paths, and ADA seating blocks',
        'Venue tech packet — house AV contact, rigging plot, power one-line, union rules if applicable',
        'Agenda and format — general session length, panel count, awards segment, hybrid stream yes/no, breakout rooms tied to main show',
        'Audience size and seating style — theater, classroom, rounds; affects PA design and camera count',
        'Content inventory — slide aspect ratio, video rolls, IMAG needs, LED vs projection preference',
        'Load-in and rehearsal windows — actual hours, not "morning of"; note when the room must be clear for another event',
        'Photos from site visit — ceiling, columns, dock path, and anything the CAD will not show',
      ],
    },
    {
      title: 'Scaling production to the room — not the brochure',
      body: 'The same creative brief produces different gear lists in a 400-seat breakout vs a 2,000-seat general session. Match production scope to room geometry, not to the last show the client liked on Instagram.',
      bullets: [
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
    body: 'A general session moved into a convention center ballroom with a published 22-foot ceiling. The house rigging plot showed points at 20 feet — fine for a modest truss. What the CAD did not show was a HVAC soffit downstage left that dropped effective height to 16 feet 6 inches exactly where the LED wall needed to sit. Production discovered it during focus, not during the site visit, because nobody measured at the stage lip. Ground-support saved the day. The soffit did not move. The lesson is boring: measure at downstage center, not at the room centerline on the sales PDF. Venues are not wrong when their documents are incomplete. Planners who walk the stage footprint are.',
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
