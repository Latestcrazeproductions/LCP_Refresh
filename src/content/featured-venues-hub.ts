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
    'Production considerations for hotels, convention centers, resorts, and non-traditional spaces — what to verify before you sign, what belongs in the BEO beside catering counts, and where house rules, fire marshal approvals, dock hours, and split-vendor scope quietly cap your show before load-in day.',
  intro:
    'Venue selection and production design are the same decision split in half. A ballroom that photographs well on the sales tour can still fail your keynote when ceiling height caps truss height, house power cannot feed a 40-foot LED wall, or the freight elevator locks at 5 p.m. on Fridays. This guide covers venue categories, what to measure on a site visit, how banquet event orders should reflect load-in and strike — not just F&B — how house AV and your production partner divide labor and show authority, multi-day hold rules that nobody mentions on the sales call, life safety sign-offs that gate your lighting looks, and the packet your vendor needs to quote accurately — not a list of properties we prefer, but the technical questions seasoned planners ask before the contract is signed.',
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
        'Historic theaters and performing arts centers — fixed grid height, orchestra pit covers, union house crew minimums, and load-in through the stage door only',
        'Hybrid-ready venues — dedicated encoder room, hardline internet handoff, and camera positions that work for both IMAG and a 16:9 stream frame',
        'Exhibition halls and raw event spaces — floor load ratings, trench covers, overhead grid height at 30+ feet, and whether the venue treats you like a trade show or a seated general session',
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
        'Outdoor backup — rain plan location, tent tie-down points, wind speed limits for LED or flown elements, generator pad and cable trench path',
        'Storage and overnight hold — where cases sit between load-in and show day, and whether the venue clears the room for another event overnight',
        'Fire marshal and life safety — haze approval threshold, open-flame or pyro permits, crowd capacity vs your seating plan, egress paths with your stage footprint',
        'COI and insurance — minimum liability limits, additional-insured wording, certificate delivery deadline before load-in',
        'ADA and accessibility — wheelchair zones with clear sight lines, assisted-listening RF, captioning feed path, and camera framing that includes accessible seating',
        'Obstructions at stage lip — HVAC soffits, sprinkler drops, and lighting coves that do not appear on the sales PDF centerline height',
        'Venue tech packet — house AV contact, rigging plot, power one-line, union rules if applicable',
        'Agenda and format — general session length, panel count, awards segment, hybrid stream yes/no, breakout rooms tied to main show',
        'Content inventory — slide aspect ratio, video rolls, IMAG needs, LED vs projection preference',
        'Load-in and rehearsal windows — actual hours, not "morning of"; note when the room must clear for another event or a room flip',
        'Audience size and seating style — theater, classroom, rounds; affects PA design, camera count, and sight-line checks',
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
        'In-house AV exclusivity — outside-vendor patch fees, mandatory house tech hours, and whether your switcher operator can touch the house projector',
        'Comms and playback handoff — who owns the matrix, intercom channels, and show-control laptop when house and outside vendor share a room',
        'Show caller designation — one name on the run-of-show with headset authority; house tech vs production TD when both are in the booth',
      ],
    },
    {
      title: 'Fire marshal, haze, and life safety sign-offs',
      body: 'Lighting looks and special effects are venue decisions before they are creative ones. Fire marshal approval, sprinkler protection for overhead work, and crowd loading limits can veto a design after your scenic is already built. Get the rules in writing during contracting — not during the rehearsal when haze triggers an alarm.',
      bullets: [
        'Haze density limits — written approval, designated operator in the room, and whether the venue ties haze to the fire panel',
        'Open flame and pyro — permit lead times, licensed operator requirements, and whether the venue allows either indoors at all',
        'Egress and furniture layout — aisle widths, exit visibility with your stage and scenic, and capacity caps that change when you add a thrust',
        'Sprinkler and overhead protection — heat shields for rigging near heads, and whether motors can fly over protected areas',
        'Alarm testing windows — when the venue will not run a full evacuation drill during your rehearsal block',
        'Post-incident procedure — who resets the panel, who signs off before doors reopen, and whether rehearsal time is credited back',
      ],
    },
    {
      title: 'BEO lines that protect production — not just catering',
      body: 'The banquet event order is where venue ops lives. Catering minimums get edited; production windows often do not — until load-in when the dock is double-booked and the BEO still says "AV setup TBD." Attach production timing to the same document the venue treats as gospel, with names and hard times, not a footnote your vendor never sees.',
      bullets: [
        'Load-in and strike windows — start and end times, dock door assignment, and freight elevator hours on the BEO itself, not a separate email thread',
        'Room access — who holds keys, when housekeeping may enter, and whether catering reset can overlap with cable pull',
        'Power and rigging holds — confirmed energize/de-energize times, generator pad reservation, and rigging inspection slots if the venue requires them',
        'Rehearsal and tech rehearsal — blocked room time with doors locked to walk-through traffic; hybrid tech checks counted as production, not "setup"',
        'Vendor meal and break coverage — union venues often mandate house labor for certain hours; outside crew break timing affects your cue-to-cue block',
        'Change-order path — air-wall moves, added breakout, extended hold: who signs, what fee, and how fast the BEO revision reaches the dock captain',
        'Single contact on show day — venue manager plus production lead on the BEO header; reduces "I thought AV had the room until 3" disputes',
      ],
    },
    {
      title: 'Multi-day holds, room turnover, and compound layouts',
      body: 'Single-day shows are the easy math. Multi-day conferences, galas with a separate rehearsal day, and programs that span a ballroom plus three breakouts plus an outdoor dinner add storage, power, and access questions the venue sales sheet rarely covers. Ask these before you sign — not when housekeeping needs the room at 6 a.m. on day two.',
      bullets: [
        'Overnight case storage — locked cage, ballroom floor, or dock hold; who has keys and whether climate-controlled storage costs extra',
        'Room flip windows — hours between your strike and the next group\'s load-in; whether scenic or truss can stay dressed overnight',
        'Compound layouts — general session in one room, breakouts elsewhere, gala outdoors; shared FOH, duplicate switchers, and cable paths between spaces',
        'Power lockout — venues that kill breakers overnight; who re-energizes at load-in and whether your gear can stay patched',
        'Housekeeping and catering access — when staff can enter to reset tables while production is still in the room (it happens)',
        'Multi-day rigging holds — whether motors stay flown between days or must come down nightly per fire marshal or house policy',
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
        'Accessible production — assisted-listening distribution, open-caption displays, and presenter mic redundancy for ADA seating zones',
      ],
    },
    {
      title: 'Strike, load-out, and dock release',
      body: 'Planners optimize load-in and show day. Strike inherits whatever hours are left — which is often less than anyone admitted at contract. A hard room flip, union call minimums, and three shows sharing one dock at 11 p.m. land on the same clock. Confirm strike the way you confirm load-in: in writing, on the BEO, with the same freight paths.',
      bullets: [
        'Strike end time — when the room must be empty for the next group; whether truss, LED, or scenic must be down before housekeeping enters',
        'Dock and elevator parity — Sunday closures, holiday freight bans, and elevator locks apply to load-out, not just load-in',
        'Union overtime and call minimums — last-hour crew counts; who pays house labor if strike runs past the published window',
        'Case staging during strike — hallway holds, dock cage limits, and per-pallet fees if cases sit overnight before pickup',
        'Damage walk-through — floor protection, wall touch-ups, and chandelier swing clearance signed before final payment release',
        'Partial strike between segments — gala to general session; what stays dressed vs what must clear for catering reset overnight',
        'RF and wireless teardown — coordinated with venue IT if exhibitor Wi-Fi comes back up the moment your cases leave the dock',
      ],
    },
  ],
  floorStory: {
    title: 'From the floor',
    body: 'Load-in for a downtown hotel general session was booked for Friday at 2 p.m. — reasonable on the run-of-show. Production arrived with road cases on pallet jacks. The only freight elevator to the ballroom level closed at 5 p.m. and did not reopen until Monday at 7 a.m. The show was Saturday. Everything that did not fit through the service stairwell by 4:45 sat in a dock cage over the weekend. The vendor had assumed "hotel ballroom" meant normal freight hours. The BEO said "elevator by appointment." Those are different documents. Confirm elevator hours in writing alongside the hold fee, not the day your truck is scheduled.',
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
    { href: '/feeds/event-production', label: 'Corporate event production' },
    { href: '/phoenix-av-production', label: 'Corporate event production in Phoenix' },
    { href: '/nationwide-event-production', label: 'Nationwide production' },
    { href: '/resources/event-production-checklist', label: 'Production checklist' },
    { href: '/blog/led-wall-sizing-for-events', label: 'LED wall sizing guide' },
    { href: '/blog/hybrid-event-av-checklist', label: 'Hybrid event AV checklist' },
    { href: '/blog/backstage-flow-for-corporate-events', label: 'Backstage flow for corporate events' },
    { href: '/blog/hire-vs-in-house-av-team', label: 'House AV vs production partner' },
    { href: '/blog/load-in-timeline-for-hotel-ballrooms', label: 'Load-in timeline for hotel ballrooms' },
    { href: '/blog/power-and-rigging-asks-for-venue-contracts', label: 'Power and rigging for venue contracts' },
    { href: '/blog/union-labor-planning-for-corporate-events', label: 'Union labor planning' },
    { href: '/blog/rf-microphone-planning-for-conferences', label: 'RF planning for conferences' },
    { href: '/work', label: 'Case studies' },
  ],
};
