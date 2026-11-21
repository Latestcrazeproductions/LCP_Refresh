---
title: Lower-Thirds and Graphics Safe Zones for IMAG and LED
description: A spec guide for lower-thirds and graphics safe zones on IMAG and LED — native canvas sizes, title-safe margins, split-layout rules, stream overlays, and what to hand motion graphics before load-in.
track: A
dateModified: 2026-11-12
---

Lower-thirds and branded graphics only work when they are built on the right pixel canvas and parked inside margins the switcher, LED processor, and stream platform agree on. A title that looks centered on a 16:9 deck becomes a lip bite on a 32:9 ribbon; a name key that clears the hero wall gets cropped by the encoder’s stream overlay.

This guide covers the safe zones production teams spec for corporate general sessions — separate from wall sizing and pixel pitch, which belong in our [LED wall sizing guide](/blog/led-wall-sizing-for-events) — and what to lock before anyone opens After Effects or PowerPoint.

## One canvas per surface — not one master file scaled everywhere

Every output path gets its own dimensions: the LED or projection native resolution, the switcher’s program bus, IMAG framing presets, confidence and delay feeds, and the stream encoder’s crop. “We’ll export 1920×1080 and let the tech stretch it” is how logos lose clear space and financial tables lose the right column.

Assign a named canvas for each path your show actually uses:

- **Hero wall / program full-screen** — Native pixel map from the wall vendor or processor (e.g. 3840×1080 for a 32:9 ribbon, not assumed 16:9).
- **Slide or content zone only** — When IMAG and slides share a wall, the content zone has its own width and height; graphics built for full-wall 16:9 will bleed into the IMAG column on show day.
- **IMAG-dominant layouts** — PiP, split, and presenter-plus-slide presets: document which corner owns the name key and whether the shader can disable lower-thirds during full-slide holds.
- **Stream / remote feed** — Platform overlays (name badges, caption bars, “live” bugs) often sit in different corners than your in-room design; spec a second safe margin for the encoder crop, not just the ballroom wall.
- **Delay and overflow surfaces** — Same program feed does not guarantee the same bezel mask; confirm each processor’s safe area or you’ll chase three different crops in rehearsal.

Hand vendors and designers a one-page **pixel map**: resolution, safe action, safe title, and which outputs are line-aligned (wall + stream) versus independent (confidence monitor).

## Safe margins — what to put in the brief

Broadcast title-safe and action-safe traditions still apply on LED: action-safe (~90% of frame) keeps logos and live video away from edges that get masked by scenic or bezels; title-safe (~80%) keeps type readable after downscaling and center-cut crops. Corporate shows often tighten margins further because switcher DVEs and LED wall edge compensation eat another few percent.

Default spec lines planners can paste into a production brief:

1. **Title-safe for all type and logos** — No critical text or brand marks outside the inner **80%** of the content zone (width and height). Footnotes, legal, and URL lines count as critical type.
2. **Action-safe for live video and full-bleed creative** — Faces, product UI, and full-frame video kept inside **90%** unless scenic intentionally masks the outer band.
3. **Lower-third band** — Fixed height in pixels from the bottom of the *content zone* (not the physical wall): typically **12–18%** of zone height for name/title keys; nothing else lives in that band during IMAG (no slide bullets bleeding under the name).
4. **Headroom for IMAG** — When the same wall switches between slides and presenter shots, define whether lower-thirds stay on during IMAG or drop for full-frame faces; mixed policy causes graphics to cover chins on camera two.
5. **Minimum type size at farthest seat** — Character height as a production spec, tied to seating distance; motion graphics can satisfy the math while a 16:9 slide export cannot.

If your show uses platform-specific stream layouts, add a row for **encoder safe** — often an extra 5% strip on the bottom where the platform draws speaker labels without asking your director.

## Lower-thirds workflow — who builds, who triggers, who owns bleed

Lower-thirds are not a graphics polish item. They are a show-flow item: when the name appears, who advances it, and whether it lives on the switcher, in playback, or in a stream tool.

Lock these before content lock:

- **Template ownership** — One versioned package (fonts, colors, line spacing) with the same safe margins on wall and stream variants; filename includes version number.
- **Trigger path** — Shader, graphics operator, or playback server; name keys tied to rundown rows, not ad-hoc keyboard shortcuts.
- **Segment policy** — Panels need multiperson keys or moderator-only lower-thirds; awards segments may need duplicate keys on delay screens with identical timing.
- **Slide vs IMAG priority** — When a presenter references a slide, does the lower-third hide, shrink, or move? Document preset names on the switcher.
- **Archive and marketing** — If post-event cuts use the program record, burned-in lower-thirds on IMAG may clash with editorial titles; know which feed marketing receives.

Questions worth asking your LED and video vendor before graphics are due:

- “What is the exact pixel resolution and safe area for each processor output we will feed?”
- “Do your switcher presets respect our title-safe grid, or do we build to full raster and let DVE crop?”
- “Where do stream platform overlays sit relative to our program frame — and do you have a reference screenshot?”
- “When we run split layout, what is the content zone resolution *before* IMAG scaling?”

Cross-check [broadcast keynote checklist](/blog/broadcast-keynote-production-checklist) items on graphics safe zones and stream overlays if the session is also clipped for remote audiences — the in-room wall is only one consumer of the same pixels.

## Pre-show validation — catch crop failures before doors

Rehearsal should include a **graphics sweep**, not only slide advance and audio. Ten minutes with every layout the show will use:

- Full-screen slide with footer logo in title-safe
- Lower-third over IMAG on each camera preset you will use live
- Split layout with simultaneous name key and data slide
- Video roll with embedded supers
- Stream preview with platform overlays enabled — not a clean program feed on a laptop

Fail criteria to call out explicitly:

- Type touching or crossing title-safe on the farthest delay screen
- Name key covering product UI or sponsor lockup
- Brand color shifting between wall and stream because graphics were built in sRGB but fed through a mismatched pipeline
- Lower-third lingering into walk-off or company bumper

Pair this pass with [content lock deadlines](/blog/content-lock-deadlines-for-event-playback): safe zones are meaningless if a midnight export changes dimensions without a new QA frame.

## From the floor: the bumper that ate the CEO’s title

A sales kickoff shipped a gorgeous motion open: full-bleed animation on a wide LED ribbon, CEO lower-third on a separate GFX channel, and a stream with its own automatic speaker label. Marketing built one 1920×1080 master because “the wall team would scale it.”

Load-in, the processor wanted the native 3840×1080 map. The scaled open looked fine in the tech room. From the floor, the CEO’s title sat under the scenic mask on the left third, and the stream showed a platform-generated name that disagreed with the in-room key by one job title. The fix was rebuilding the open with a 80% title-safe grid and turning off duplicate stream labels — three hours that were not in the rehearsal block.

Safe zones are boring until they are not. Get the pixel map early, build lower-thirds on the zone — not the wallpaper — and rehearse every layout with titles on, not only slides.

For LED wall sizing, processor maps, and show-day graphics support on corporate general sessions, see our [LED wall services](/services/led-walls). Need help aligning IMAG, stream, and motion graphics before content lock? [Request a consultation](/contact).
