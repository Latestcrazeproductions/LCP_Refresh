---
title: Panel Discussion Audio and IMAG: A Spec List for Planners
description: Panel discussion audio and IMAG specs for planners — mic inventory by seat, monitor and mix requirements, camera shot minimums, and vendor questions that keep panels audible and visible from every row.
track: A
dateModified: 2026-10-26
---

Panel discussions fail in two places planners can spec early: the room cannot hear the person who is not holding the mic, and the audience watches profiles while the active speaker faces the moderator. Audio and IMAG for panels are not general-session packages with a table dropped on stage — they need per-seat capture, a mix that follows conversation, and a camera plan built for seated cross-talk.

This guide is a spec list you can paste into a production brief or RFP: minimum wireless inventory, monitor and submix requirements, IMAG camera tiers, and the questions that separate a panel that reads on screen from one that looks like a wide shot of chair backs.

## Panel audio — minimum inventory and mix logic

Treat every seated participant as a primary source, not a guest on a shared lectern mic. Table condensers alone are a backup layer for video ISO and room tone — not the plan for a 400-seat ballroom where the moderator turns to panelist three and the handheld is still on panelist one.

Lock these audio minimums before you sign off on channel count:

- **One wireless per seated panelist** — lav or headset, bodypack with fresh battery swap protocol; no sharing a handheld across four people unless the format is explicitly one-mic-at-a-time.
- **Dedicated moderator mic** — handheld or lav, always live in the mix during Q&A; the moderator is the show caller for the audience and the A1 needs that channel unmuted by default.
- **Audience Q&A path** — minimum one wireless handheld with a runner, or two for split seating; define whether questions are mixed to PA only or also to panel monitors.
- **Table / boundary mics (optional layer)** — useful for ISO recording and backup pickup; specify count, placement, and that they do not replace individual wireless on the primary PA mix.
- **Monitor feed to the panel** — each participant hears themselves and the moderator at minimum; full program mix in headphones or floor wedges depends on room noise and IFB preference — specify which.
- **Submix for stream / record** — panel ISO plus a balanced program mix; name who receives the feed (streaming vendor, in-house record) and latency tolerance for remote panelists if hybrid.

Mix behavior matters as much as mic count. Panels are not keynotes: the A1 needs a follow plan — auto-mix, dedicated operator, or show-caller cues for who is hot. Write it down. "We'll ride gain live" without a rehearsal block is how crosstalk and late un-mutes happen when the CEO asks a follow-up.

RF inventory should include one spare receiver paired to a documented backup frequency per four active wireless channels — same discipline as [multi-room conference RF planning](/blog/rf-microphone-planning-for-conferences), even when you only have one general session room.

## IMAG for panels — camera tiers and shot list

IMAG on a panel exists so the audience sees the face of whoever is speaking, not the back of whoever is listening. That requires cross-shoot clearance, a director who understands conversation rhythm, and enough cameras that you are not faking coverage with a single tight on the moderator.

Use these tiers as starting points; scale up when seat count, room depth, or hybrid capture demands it:

| Tier | Room / format | Camera package | Mandatory shots |
| --- | --- | --- | --- |
| **Baseline** | Up to ~200 seats, shallow room, three panelists | 2 cameras | Moderator medium, active panelist tight (switched), safe wide for transitions |
| **Standard** | 200–500 seats, or three to five panelists | 3 cameras | Cross-shoot panelists L/R, moderator down-center, wide establishing; reaction optional |
| **Full** | Deep room, six+ seats, awards-style recognition, or broadcast/stream primary | 4+ cameras | Dedicated panelist coverage, moderator, wide, audience or demo; shader + shot list in rehearsal |

Panel IMAG also depends on [stage deck width and depth](/blog/stage-deck-sizing-for-panels-and-keynotes) — side cameras need wing clearance the scenic render rarely shows. If the deck is sized for a keynote lectern, cross-shots may live in the aisle unless you fix dimensions in pre-pro.

Program routing: confirm whether the hero wall runs IMAG, slides, or a split layout; panels with heavy slide content often need explicit switcher rules so a full-screen deck does not bury the speaker the audience came to see. If the back half of the room relies on [delay screens](/blog/when-you-need-imag-and-delay-screens), state whether delays carry the same switched IMAG feed or slide-only content — mismatches read as two different shows.

Rehearsal scope is part of the spec. Block time for camera blocking with real chairs and real table height, not an empty deck. Panelists will lean, turn, and talk over each other; the shader needs one pass through the actual run-of-show segment, not a five-minute "we'll figure it out at show call."

## What to put in the RFP — and questions for your vendor

Copy these lines into your brief so audio and video vendors bid the same show:

- **Seated count and seat map** — moderator included; note stool vs arm chair (affects lav placement and camera height).
- **Wireless channel list** — named roles, spare count, and who coordinates RF with venue and stream vendor.
- **Monitor / IFB diagram** — who hears what; whether remote panelists join on delayed mix.
- **Camera shot list** — mandatory vs optional shots; hybrid requirements (presenter view, clean feed, graphics).
- **Rehearsal minutes for panel segment** — separate from keynote walk-through if the same room flips format.
- **Failover** — single mic failure, camera failure, and fallback to wide + slides without killing Q&A.

Questions worth asking in the bid review:

1. **"Walk me through your default panel mix — auto-mix, operator, or show-caller cues — and who owns transitions when two people talk at once?"**
2. **"Where do side cameras sit for a table this width, and what deck depth do you require for clean cross-shoots?"**
3. **"What is included in rehearsal for panel blocking versus a single-presenter keynote on the same wall?"**
4. **"How do you route panel audio to stream ISOs without the moderator's monitor feeding back on the return?"**
5. **"What is the latency budget from stage to IMAG surface, and does that change for interactive hybrid panelists?"**

Answers should reference your room depth and seating chart, not a package labeled "Panel Gold."

## From the floor: the table mic that was "enough"

A general session spec listed two handhelds and one lectern mic for a five-person panel because the template assumed a keynote with Q&A. Load-in, the A1 placed a boundary mic at the table center and called it covered. Rehearsal, the moderator swiveled to the end chair for every follow-up; the active speaker's lav was fine in monitors, but the PA carried room tone and the profile of whoever leaned toward the table mic.

Row eighteen could hear words. They could not tell who said them. IMAG was a single camera on the moderator because the brief never listed cross-shoot clearance — the side operator's platform was in the aisle between sections, and the director chose a wide that made everyone the size of a postage stamp.

The fix was three more lavs, a second rehearsal block, and a shot list with six lines on an index card. Nothing exotic — just inventory and geometry specified the way you would for a keynote, then adjusted for people sitting in a row and talking over each other.

Panel discussion audio and IMAG reward boring specificity: one wireless per seat, a mix plan that follows conversation, cameras sized to the table and room, and rehearsal time that treats the panel as its own show segment. Spec that stack early and the back row gets faces and intelligibility instead of a guessing game.

For panel audio, wireless coordination, and general session IMAG on corporate events, see our [audio production services](/services/audio). Ready to walk through seat count, deck layout, and camera positions before your RFP goes out? [Request a consultation](/contact).
