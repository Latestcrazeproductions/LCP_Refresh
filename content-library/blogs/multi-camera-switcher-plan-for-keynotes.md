---
title: Multi-Camera Switcher Plan for Corporate Keynotes
description: How to spec a switcher plan for corporate keynotes — input lists, IMAG presets, director cues, stream handoff, and the questions that keep your shader from improvising during the CEO walk-on.
track: A
dateModified: 2026-11-18
---

A multi-camera switcher plan is the written map of what goes into the switcher, what comes out to the room, the stream, and record, and who moves between those states on cue. For corporate keynotes, that map matters because one show feeds IMAG on an LED wall, a program mix for the archive, and often a second framing path for remote viewers — all from the same 45-minute segment.

This guide covers the input list and preset strategy production teams use for keynote switcher plans, how director cues tie to run-of-show, and what to lock before load-in so your shader is building looks in prep — not discovering that slides and IMAG share one bus at rehearsal.

## Start with outputs — room, stream, and record

Switcher planning works backward from destinations. A keynote that only feeds an in-room LED needs fewer buses and less comms than one that also pushes 16:9 to a platform with lower-thirds baked in. Name every output before you count cameras.

**Typical keynote outputs:**

- **Hero wall / IMAG** — Primary switched program for the ballroom; may be 16:9 or custom processor aspect depending on LED sizing
- **Stream encoder** — Often the same program feed as IMAG; document when remote framing differs (tighter crops, slide-only segments)
- **Archive / ISO** — Program record plus optional isolated camera and direct slide feeds for post; clips teams need clean ISO when program cuts to wide for a transition
- **Confidence / presenter feed** — Not always switcher-driven; if it mirrors program, list it so nobody patches presenter notes onto the public bus
- **Overflow or delay displays** — Repeat of program or a downstream mix with audio delay aligned to the room

If IMAG and stream share one output, write which shots remote viewers sacrifice when the director holds slides full-screen. Splitting outputs costs a second shader pass or ME; it prevents the hybrid view where thousands online watched a wide shot while the room read a financial table. For camera coverage tiers, see [camera platform planning for corporate livestreams](/blog/camera-platform-planning-for-corporate-livestreams).

## Input list — what the switcher actually switches

Corporate keynote switchers die from vague input lists. "Four cameras and slides" is not a plan. Every source needs a name, a physical origin, resolution, and whether it is live, patched, or playback.

**Minimum input map for a multi-camera keynote:**

| Role | Source | Notes |
|------|--------|-------|
| CAM1 | Wide establishing | Stable hold; safe for walk-in, applause, long announcements |
| CAM2 | Presenter primary | Tight enough for IMAG faces; shaded to match stage light |
| CAM3 | Presenter cross / panel | Hunts movement off the mark; preset falls back if unrehearsed |
| GFX / PC | Direct slide or graphics feed | Dedicated path — never slide legibility from a camera on screen |
| PLAY | Video server or rack PC | Embedded rolls, openers, stingers; separate from deck advance when possible |
| AUD (optional) | Audience or floor mic reaction | For stream energy; cut sparingly on in-room IMAG during data segments |

Add return feeds, virtual presenters, and second-stage sources as numbered inputs on the same sheet. The shader should not learn on show day that the green-room return is "something on HDMI three."

**Routing rules to document:**

- Which input is default when talent is on the lectern vs roaming
- Whether slides take full-frame, PiP, or side-by-side with presenter — per agenda block, not per mood
- Mute and blackout logic on the LED path versus what the encoder still sees
- Backup playback and how the switcher exposes failover without a layout jump the room notices

Match switcher scale to show complexity: a locked lectern and slides-forward keynote can run on a compact production switcher with pre-built presets and one shader. Roaming CEO, live demos, panel handoffs, and hybrid Q&A usually need more MEs, more inputs, and a director who is not also calling slides. Under-spec the switcher and you get either a locked wide or a shader who cannot build the next look until the current segment ends.

## IMAG presets — name them before rehearsal

Preset improvisation is how IMAG drifts: the audience sees crops that change width every cut, slides with inconsistent margins, and panelists half out of frame because someone frantically built a split mid-cue. A switcher plan lists every layout the show uses — with stable names the show caller can say on intercom.

**Preset types to define for corporate keynotes:**

1. **FULL SLIDE** — Graphics full-frame to the wall; cameras off program or parked on wide for quick recovery
2. **FULL TALENT** — Presenter IMAG with safe title safe for lower-thirds if the stream adds them later
3. **SPLIT L / R** — Presenter + slide with documented aspect; marketing approves margins before graphics export
4. **VIDEO ROLL** — Playback source full-screen; cameras muted from program or on a supervised wide ready for tail-out
5. **PANEL GRID** — Multi-box layout for seated participants; agree maximum headcount before GFX builds assets
6. **HOLD / TRANSITION** — Branded stinger or blank with audio policy spelled out (room hears VO, stream hears mix, etc.)

Build presets in prep on show resolution and test on the actual LED processor — not only on the multiview. Color space, overscan, and crop on the wall differ from what the shader sees at the tech table. If you use [confidence monitors](/blog/confidence-monitor-placement-for-keynotes) that mirror program, confirm they follow presenter-preset rules so talent is not reading slides off a feed the audience never sees.

## Director cues and run-of-show integration

The switcher plan is useless if cues live only in the shader’s head. Tie preset names to run-of-show lines the show caller can execute.

**What belongs on the cue sheet:**

- Slide or segment ID → default preset (e.g., "Q3 results → FULL SLIDE", "CEO intro → FULL TALENT")
- Mandatory cuts — product reveal, guest walk-on, panel open — with camera source numbers, not nicknames
- Hold language — one phrase for extend present look, one for go to wide, one for emergency slides-only
- Who advances decks vs who rolls video — playback op and shader share a channel; conflicting "next" commands sink shows
- Stream-only moments — remote polling, platform layout changes — and whether IMAG holds or follows

Rehearsal is switcher rehearsal: run every agenda block once with preset recalls, not just mic checks. If the CEO adds four unscripted minutes, the team should not be building a new split while they are on stage. For comms roles and playback paths that sit upstream of the switcher, use the [broadcast-grade keynote checklist](/blog/broadcast-keynote-production-checklist) as a companion spec.

## Questions for your production partner

Bring these before positions are rigged and presets are due:

- **Switcher make and ME count** — Enough inputs and buses for your output map, or a documented compromise if the package is fixed
- **Preset list sign-off** — Who from marketing or comms approves split layouts and slide safe zones
- **Direct content feed** — Guaranteed slide input resolution and who fixes it if the deck PC sleeps mid-show
- **Shader staffing** — Dedicated director for IMAG and stream, or shared with camera shading on the floor
- **Record strategy** — Program-only vs ISOs; who takes drives home and whether archive survives a mistaken "end webinar"
- **Failover behavior** — What the room and encoder see if CAM2 drops or playback stutters; "go wide" only works if wide is composed
- **Latency and delay** — Audio delay to room, IMAG delay, and whether return feeds to talent match what the switcher previews

Answers should reference your agenda and output map — not a switcher size pulled from the last gala.

## From the floor: the preset nobody named

A leadership keynote shipped with a capable switcher, four cameras, and a shader who knew the show cold — except for the segment between the safety video and the CEO walk-on. Marketing wanted a full-frame stinger with audio; the stream overlay team wanted talent on a tight before the lower-third cleared; the show caller had three different names for the same look on the run-of-show, the deck, and the multiview.

The first walk-on cut to a split nobody had built. The room saw half a logo. The shader built the layout in six seconds that felt like a tax audit. The fix was not more hardware — it was a preset sheet with six names, agreed in the production meeting, pasted into the cue column everyone already used.

Switcher planning is boring paperwork until the CEO is on the mark. Lock outputs, inputs, and preset names early; rehearse recalls like they are talent cues. Your shader will spend show day switching, not negotiating spelling.

For LED walls, IMAG integration, and multi-camera keynote production, see our [LED wall production services](/services/led-walls). Ready to document your switcher map before load-in? [Request a consultation](/contact).