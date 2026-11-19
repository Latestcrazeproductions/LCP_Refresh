---
title: DMX and Named Lighting Looks for Awards Segments
description: How to brief and rehearse named DMX lighting looks for corporate awards — preset vocabulary, segment-by-segment cues, console handoff to the show caller, and the vendor questions that keep reveals in sync.
track: A
dateModified: 2026-08-22
---

Awards segments fail in the lighting console when every department uses a different name for the same moment. The show caller says “reveal look,” the LD fires a preset labeled “Winner B,” and the streaming shader is still on “Presenter A” because nobody agreed on a cue sheet vocabulary. DMX is the plumbing; named looks are the language the show runs on.

This guide covers what planners should lock before cue-to-cue: which looks to name, how they map to awards beats, how DMX and console organization affect handoff speed, and the questions that keep lighting in step with video and audio on reveal night.

## Why named looks beat “make it brighter”

Corporate awards compress dozens of lighting changes into a program where the audience only notices when something is late. Unnamed instructions force the LD to improvise under comms pressure. Named looks let the show caller call a preset the entire team rehearsed — same intensity, same color temperature, same follow-spot logic every time.

Planners do not need to patch fixtures. They do need to require a **look list** in the production brief and insist that list matches the run-of-show column headings.

Looks every awards program should define in writing:

- **House / walk-in** — audience light level, any color wash, and whether work lights stay available in wings.
- **Category open** — preset for announcer or VOG, walk-on music beat, and IMAG-safe key on the mark.
- **Presenter** — key/fill/backlight for the lectern or center mark; note if follow-spot is primary or supplemental.
- **Reveal / winner** — distinct from presenter; often a brightness bump, color shift, or spot pickup timed to envelope or on-screen name.
- **Acceptance** — follow-spot assignment, sustained key for roaming speakers, and house dim level for camera.
- **Video hold** — static look during nominee reels or sponsor content; no accidental blackouts when rolls start.
- **Reset / exit** — return path to walk-in or a transitional look before the next category.

If the run-of-show says “Lighting: dramatic” without a preset name, your first cue-to-cue becomes a thesaurus exercise. Require exact names — `AWD_CAT_OPEN`, `AWD_REVEAL_01`, whatever your LD prefers — and forbid aliases in the show caller script.

## DMX and console structure planners should ask about

DMX universes, node layout, and console show files are operator territory. Planners still own the **interface** between lighting and the rest of the show: who triggers what, and whether a missed cue has a backup path.

Before load-in, confirm these operational choices with your lighting vendor:

- **Trigger model** — Does the LD execute every look on a call, or are some cues tied to timecode, MSC, or a dedicated playback operator? Awards reveals often need manual confirmation; automated stacks can fire early when applause runs long.
- **Preset vs. chase** — Stored looks should be static presets for repeatable rehearsal; chases and busk effects belong in optional moments, not category turnover.
- **Universe headroom** — Adding last-minute LED uplights or audience fixtures can split patches across nodes; ask whether your package includes spare universes and addresses before scenic adds fixtures without telling lighting.
- **Follow-spot integration** — Are spots on the same console, a separate desk, or manual? Name who picks up the winner and how that call appears on the cue sheet (“Spots: take `AWD_WINNER_KEY`” vs. verbal only).
- **House light crossover** — One master plan for who dims house when (building management, LD, or show caller); DMX-controlled house and theatrical dimmers on different systems cause the classic half-lit ballroom during a reveal.
- **Backup** — Second console, snapshot file, or paper plot for the plot’s eight most-called presets; know which looks can be rebuilt in under two minutes if a node fails.

You are not signing off on DMX charts. You are signing off on the **call structure** — one column in the run-of-show, one comms channel rule, one person who cannot be double-booked as spot op and board op on the same category.

## Map looks to awards beats in the run-of-show

Awards lighting should align one-to-one with the same sub-cues you document for video and audio. Tie each beat to a single look name so departments do not debate when “reveal” starts.

Use this sequence as a template for your cue sheet (adjust for your show length and presenter format):

1. **Walk-in / dinner hold** — `AWD_HOUSE_WALKIN`; hold through last F&B exit if applicable.
2. **Show open / host** — `AWD_HOST`; transition on show caller’s first “fade” or time-of-day cue.
3. **Category slate** — `AWD_CAT_OPEN`; out-point when presenter hits the mark, not when music fades.
4. **Nominee package or straight to presenter** — `AWD_VIDEO_HOLD` or maintain `AWD_CAT_OPEN`; document which.
5. **Reveal trigger** — `AWD_REVEAL` on envelope, graphic, or announcer line — pick one trigger and rehearse all three in a drill once.
6. **Acceptance** — `AWD_ACCEPT`; include max time in ROS; LD knows when to soften for long thank-yous vs. hold the winner look.
7. **Exit / turnover** — `AWD_RESET`; target seconds until next `AWD_CAT_OPEN`; if turnover exceeds ninety seconds, add a wing work light look by name.

Rehearsal value is repetition with the same strings. Changing “Reveal” to “Winner moment” on show day is how you get a follow-spot on the presenter while the name is on the screen.

## Questions to bring your lighting vendor

Bring these to the first production meeting and chase written answers into the brief:

- **Who publishes the final look list and version number?** — Same owner as the run-of-show revision, with distribution to show caller, TD, and video shader.
- **How many distinct looks are included in your bid, and what counts as a change order?** — Sponsor palettes and category-specific colors add up fast.
- **Rehearsal time for programming** — Hours blocked **before** presenters arrive vs. only during cue-to-cue; unnamed looks get built in the slot meant for talent.
- **Camera shading attendance** — Will the LD attend the shader session or provide target illuminance and CCT per look?
- **Integration with IMAG and LED** — How presets account for full-white slides or saturated content on the LED wall; who holds when content changes mid-acceptance speech.
- **Comms phraseology** — Exact words the show caller uses (“Stand by `AWD_REVEAL`, go on envelope”); LD and spots confirm they match the console labels.
- **Change cutoff** — Last time a new look can be added without overtime or untested presets on show day.

Answers belong in the production brief and on the document at the calling position. Verbal alignment at pre-pro disappears when three categories run back-to-back and someone abbreviates a cue.

## From the floor: the preset with three names

One corporate awards rehearsal had a reveal that worked twice — house dipped, winner look fired, spot picked up — and failed the third time because the show caller said “Take B” while the console was still sorted alphabetically under “Category 3 — Sales Excellence.” The LD scrolled. The envelope opened on a presenter still in the walk-in wash. The stream looked intentional. The room did not.

The fix was not more fixtures. Marketing, graphics, and lighting adopted one column: category number, sponsor name, graphic filename, and **lighting preset string** on the same line. The LD renamed nothing mid-show; the show caller stopped improvising synonyms.

DMX gets the photons to the stage. Named looks are how the rest of the production keeps those photons on the right face at the right second — especially when the winner hugs the CFO and ignores the mark entirely.

For awards lighting design, look programming, and show-day console operation, see our [event lighting services](/services/lighting). Ready to align your run-of-show, look list, and cue-to-cue plan? [Request a consultation](/contact).