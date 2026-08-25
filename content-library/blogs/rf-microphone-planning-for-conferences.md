---
title: RF Microphone Planning for Multi-Room Conferences
description: RF microphone planning for multi-room conferences — channel inventory, frequency coordination, intermod testing, and the vendor questions that prevent wireless dropouts across simultaneous sessions.
track: A
dateModified: 2026-08-25
---

Multi-room conferences turn wireless into a shared resource problem. Breakout lavs, panel handhelds, press scrums, and the general session next door all compete for the same spectrum — and a dropout in one room is usually an inventory decision someone made three weeks ago, not bad luck on show day.

This guide covers what planners should lock before RF coordination starts: how to count channels honestly across rooms, what belongs on a master coordination sheet, and the rehearsal tests that surface intermod before twelve sessions run at once.

## Count channels by room tier, not by agenda optimism

RF planning starts with a channel budget, not a frequency list. Every active wireless mic, IFB pack, and comms belt pack counts against the venue's usable spectrum. Assign tiers early so procurement and coordination math stay aligned when the agenda adds a fourth concurrent session on Tuesday night.

Use these channel caps as a starting framework — adjust to your venue scan, not your vendor's default kit:

- **Tier 1 breakouts (up to 40 seats):** Two active wireless channels maximum — one lav or headset for the primary speaker, one handheld for Q&A or a co-presenter. No "we'll add a third if someone asks."
- **Tier 2 rooms (40–100 seats):** Four to six channels — primary lav, moderator handheld, two to three Q&A mics, plus one spare receiver paired to a backup frequency. Document which channel is the spare before load-in.
- **Tier 3 / general session (100+ seats):** Eight to twelve channels depending on format — panel inventory, audience Q&A, VOG, backstage confidence, and dedicated spares. Every channel gets a named assignment on the coordination sheet, not a slot number only the A1 understands.
- **Adjacent spaces (press room, sponsor lounge, green room):** Count these in the master inventory even when another vendor owns the gear. Unregistered transmitters powered up at 7:45 AM do not respect your keynote schedule.

Write tier assignments on the master schedule alongside room capacity. When sales promotes a workshop from Tier 1 to Tier 2 because registration jumped, the RF budget must move with it — not get resolved by borrowing a receiver from the ballroom during the CEO segment.

## Build one coordination sheet — and one owner

Distributed clipboards are how a breakout lav lands on the same frequency as a press-room handheld three floors away. One document, one audio lead, updated after every scan and every vendor arrival.

Every multi-room conference RF plan needs these fields locked before the first receiver powers on:

- **Channel index** — transmitter ID, receiver rack location, room assignment, and primary user role (presenter lav, Q&A handheld, IFB, comms).
- **Frequency assignment** — primary frequency, backup frequency, and band plan (UHF block or specific MHz if your jurisdiction requires it).
- **Vendor ownership** — which production company registered each channel; escalation contact when an unlisted transmitter appears on scan.
- **Power and antenna map** — receiver rack positions, remote antenna placements, and cable runs long enough to matter for signal at the far end of a ballroom divider.
- **Battery and swap protocol** — charged spare count per room tier, mid-session swap procedure, and who alerts the show caller before a mic goes dark.
- **Mute group logic** — presenter lavs, audience mics, and VOG on separate groups; confirm no channel mutes when slides advance or video rolls.
- **Compliance notes** — venue RF restrictions, union jurisdiction on wireless deployment, and broadcast coordination if you're near a sports arena, airport, or active DTV repack zone.

Share the sheet with every audio vendor on the conference — breakout subs, general session A1, streaming partner, and venue AV if they maintain permanent systems in the building. RF coordination fails at the handoffs nobody documented.

## Scan, assign, and test under load

Frequency assignment before the full vendor load-in is a draft, not a plan. Hotel ballrooms, adjacent conferences, and permanent venue systems change the usable spectrum daily. Build scan and test windows into the production schedule the same way you block rigging — not as an optional afternoon if time allows.

Run this sequence during tech rehearsal — not in empty rooms one at a time:

1. **Full venue scan** — after all vendors arrive and before any transmitter powers up; compare results to pre-con scan if one exists and note what changed.
2. **Assign from scan data** — let the audio lead allocate frequencies from actual noise floor readings, not a spreadsheet template from last year's show in a different city.
3. **Simultaneous room test** — run at least three tier-matched rooms at once with every assigned wireless active for ten full minutes; listen for dropouts, crackle, and intermod beats.
4. **Walk the floor** — carry a receiver or use a scan receiver at the back of each room while mics are live; signal that looks fine at FOH can be marginal where the audience sits.
5. **Comms and IFB isolation** — confirm show caller comms, tech comms, and presenter IFB do not share bands with breakout handhelds; comms bleed is how a stage manager's cue ends up in a breakout ISO recording.
6. **Fail one path** — mute a primary receiver or swap to the documented backup frequency; confirm the in-room tech or floater executes the manual step without calling the A1 on the keynote.
7. **Update the master sheet** — any frequency change, spare activation, or vendor addition gets logged before doors open; the sheet at load-in is not the sheet at show day unless someone maintains it.

Block this test during the same window as simultaneous breakout sessions in rehearsal — not after the general session sound check when half the wireless inventory is already packed for strike.

## Questions for your audio vendor

Bring this list to your RFP and pre-con walkthrough. Multi-room RF breaks where ownership is vague and channel counts are "rough estimates" until show day.

- **Master coordination ownership** — Who holds the sheet, who runs the scan, and who gets called when an unregistered vendor powers up in the sponsor lounge?
- **Channel math** — Will you bid against our tier assignments, or against a total that assumes breakouts share frequencies time-slot by time-slot?
- **Adjacent vendor policy** — How do you coordinate with breakout subs, streaming partners, and venue AV who each bring their own wireless?
- **Spare inventory** — How many backup receivers and pre-paired frequencies per tier, and where are spares physically staged during show hours?
- **Scan windows** — When does the full venue scan happen relative to load-in, and who pays for a re-scan if a neighboring conference arrives Wednesday?
- **Intermod liability** — If dropouts appear during simultaneous session testing, is retuning included or a change order?
- **Battery logistics** — Charging station layout, labeled slot protocol, and mid-show swap crew — FOH, floater, or presenter self-serve?
- **Recording and ISO paths** — Which rooms get per-mic ISO feeds, and are wireless channels routed to local recorders or a central record room?

Answers belong in the production brief with channel counts tied to room tiers, not in a verbal promise at the walkthrough. RF problems scale with room count — twelve breakouts do not leave room for heroics.

## From the floor: forty-seven channels, one hotel coffee shop

A three-track conference registered forty-seven wireless channels across twelve breakouts, a general session, a press room, and two sponsor activations. The scan looked clean on Monday. On Wednesday, a neighboring medical association loaded in with their own inventory — and a hotel coffee shop replaced their POS tablets overnight, adding a spread of digital noise nobody re-scanned for.

Breakout 9 dropped signal every four minutes during the first afternoon block. Not interference from the keynote — intermod between two breakout subs who each assumed they owned the 470 MHz block on their floor. Both coordinators had spreadsheets. Neither had the same spreadsheet.

The fix was two hours of retuning across six rooms, a mandatory shared scan at 6 AM for the rest of the week, and a rule that no transmitter powered up until the audio lead logged it. The mics were fine. The room count was accurate. The coordination model treated twelve rooms like twelve small shows instead of one conference on one piece of spectrum.

RF microphone planning for multi-room conferences is inventory math, shared documentation, and load testing before the agenda runs concurrent sessions for real. Spec channel tiers early, assign one coordination owner, and treat the simultaneous rehearsal as non-negotiable.

For wireless planning, multi-room RF coordination, and conference audio support, see our [audio production services](/services/audio). Ready to build a channel budget your vendor can crew against across every room on the schedule? [Request a consultation](/contact).
