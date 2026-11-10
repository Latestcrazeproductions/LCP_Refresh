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
    'Production considerations for hotels, convention centers, resorts, outdoor spaces, and non-traditional venues — what to verify before you sign, what belongs in the BEO and production addenda, and where dock schedules, house rules, and split-vendor scope quietly cap your show before load-in day.',
  intro:
    'Venue selection and production design are the same decision split in half. A ballroom that photographs well on the sales tour can still fail your keynote when ceiling height caps truss height, house power cannot feed a 40-foot LED wall, or the freight elevator locks at 5 p.m. on Fridays. The sales CAD rarely matches field measurements. Dock time is often first-come among every group loading that morning. This guide covers venue categories, site-visit measurements, BEO language worth fighting for, how house AV and your production partner divide labor and show authority, multi-day holds, life safety sign-offs, outdoor and tented constraints, strike windows, and the packet your vendor needs to quote accurately — not a list of properties we prefer, but the technical questions seasoned planners ask before the contract is signed.',
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
        'Shared air walls — whether neighboring rooms can run amplified programs simultaneously; acoustic isolation, not just visual separation',
        'Fire marshal and life safety — haze approval, open-flame or pyro permits, sprinkler clearance with scenic, occupancy vs seating plan, egress with your stage footprint',
        'Outdoor backup — rain plan location, tent tie-down points, wind speed limits for LED or flown elements, generator pad and cable trench path',
        'Storage and overnight hold — where cases sit between load-in and show day, and whether the venue clears the room for another event overnight',
        'COI and insurance — minimum liability limits, additional-insured wording, certificate delivery deadline before load-in',
        'ADA and accessibility — wheelchair zones with clear sight lines, assisted-listening RF, captioning feed path, and camera framing that includes accessible seating',
        'Obstructions at stage lip — HVAC soffits, sprinkler drops, and lighting coves that do not appear on the sales PDF centerline height',
        'Venue tech packet — house AV contact, rigging plot, power one-line, union rules if applicable',
        'Agenda and format — general session length, panel count, awards segment, hybrid stream yes/no, breakout rooms tied to main show',
        'Content inventory — slide aspect ratio, video rolls, IMAG needs, LED vs projection preference',
        'Load-in and rehearsal windows — actual hours, not "morning of"; note when the room must clear for another event or a room flip',
        'Audience size and seating style — theater, classroom, rounds; affects PA design, camera count, and sight-line checks',
        'Photos from site visit — ceiling, columns, dock path, field measurements that disagree with the sales PDF',
        'Dock and freight scheduling — assigned window vs open dock; concurrent shows sharing the same elevator bank',
      ],
    },
    {
      title: 'BEO and contract language production should own',
      body: 'The catering BEO is not a technical document — until it becomes the only signed record of load-in hours, elevator access, and strike deadline. Production details belong in an addendum or exhibit, referenced on the master agreement, with the same signature path as the room rental. If it lives only in email, it will not survive a Saturday night dispute at the dock.',
      bullets: [
        'Freight elevator hours and capacity — dimensions, weight limit, escort rules, and whether access extends through strike',
        'Dock assignment — time slot, shared vs dedicated bay, and who queues when two groups load the same hour',
        'Load-in and strike windows — start and hard out in local time; overtime triggers and who approves extension',
        'Power and rigging exhibits — house one-line, available points, and whether supplemental distro or motors require venue sign-off',
        'Outside vendor clauses — exclusivity fees, mandatory house patch, and minimum house labor hours before your crew touches cable',
        'Noise, curfew, and decibel limits — written cutoff for amplified program and strike, not “per management discretion”',
        'Damage and floor protection — who supplies masonite or carpet shield, walk-through before final payment, and chandelier swing clearance',
        'Cancellation and weather — outdoor rain plan room on contract, not verbal; who pays for hold if the backup room is smaller',
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
      title: 'Outdoor, tented, and weather-dependent spaces',
      body: 'Resort lawns and rooftop terraces look effortless in the brochure. Production sees tie-down points, wind load, and a rain plan that cannot be “move inside” if the ballroom is already booked for dinner. Tented structures add their own code path — fire marshal approval, sidewall egress, and generator placement far enough from guest rooms that nobody calls the front desk.',
      bullets: [
        'Rain and wind holds — backup room on contract, not verbal; wind speed thresholds for LED, flown lighting, or scenic',
        'Tent structure — house vs rental vendor; who owns stakes, ballast, and fire marshal inspection before first guest',
        'Power and distro — generator sizing for full show load, refuel access during event, cable trench or ramp covers for guest paths',
        'Noise bleed — amplified sound toward guest rooms or neighboring properties; curfew that starts during your awards segment',
        'Ground conditions — cable ramps on grass, mud after rain, and whether golf-cart paths handle road-case weight',
        'Sun and glare — afternoon keynotes on west-facing stages; scrim or tent peak height for IMAG camera angles',
      ],
    },
    {
      title: 'Strike, load-out, and the exit nobody schedules',
      body: 'Planners optimize load-in and show day. Strike gets whatever hours are left — which is often less than anyone admitted when the contract was signed. A hard room flip, union overtime rules, and dock congestion at 11 p.m. all land on the same clock.',
      bullets: [
        'Strike window — confirmed end time in writing; whether scenic, truss, or LED must be down before housekeeping enters',
        'Dock and elevator access — same freight restrictions as load-in; confirm Sunday or holiday closures apply to strike too',
        'Union call minimums — last-hour crew counts and whether your vendor pays house labor if strike runs past the call',
        'Case staging during strike — hallway holds, dock cage, and whether the venue charges per pallet overnight',
        'Damage walk-through — who signs off on floor protection, wall touch-ups, and scenic removal before final payment',
        'Partial strike between segments — what can stay dressed when catering resets for gala after general session',
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
        'Room measurement reality — stage depth from sales CAD vs field measure; plan ground-support LED width against actual column spacing',
      ],
    },
  ],
  floorStory: {
    title: 'From the floor',
    body: 'Load-in for a downtown hotel general session had a written dock slot: 7 a.m. Saturday. Production arrived at 6:50 with two 53-foot trucks. The dock had one active bay. A wedding florist had been loading since 6:30 with no slot on paper — the dock manager had said yes on the phone Thursday. By 8:15, cases were still on the sidewalk. The freight elevator opened at 8:00 and stopped accepting carts at noon because a luncheon group owned the ballroom air space. The BEO listed “morning load-in” but not a bay number or elevator cutoff. The fix was not faster crew; it was a dock exhibit on the contract the next year. Assign the bay and the elevator window like you assign the room — in writing, with a time range.',
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
    { href: '/blog/load-in-timeline-for-hotel-ballrooms', label: 'Hotel ballroom load-in timeline' },
    { href: '/work', label: 'Case studies' },
  ],
};
