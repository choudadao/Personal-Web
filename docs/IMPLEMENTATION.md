# About interaction study

Source: https://www.gionatannese.com/about → `/` and `/about`.
Isolated project: `projects/avatar-about`. No existing application routes changed.

The source was inspected through its public About module and desktop screenshots. Native CUA was unavailable; a local headless Edge session provided reference and implementation screenshots. This is an independent implementation of the interaction structure, not a copy of the original bundled application.

## Modules / specifications

- Header: fixed compact navigation, neutral translucent backgrounds, serif labels, optional synthesized sound toggle. Links target the implemented About-page sections rather than unimplemented project pages.
- Hero: white background, three centered serif lines, fixed central avatar drawn in front of type, smaller work descriptor underneath. Desktop type scales to 76px; mobile type scales to viewport.
- Chapters: four sections, serif title with chapter markers, left/right line-anchored body text. Each line displaces away from an invisible central ellipse while scrolling; mobile paragraphs are staggered vertically.
- Avatar: user's Skeptical Cap Girl FBX converted to an optimized textured static GLB and normalized to a fixed visual size; smooth pointer/orientation rotations, raycast-local blue shader, global click spring response. There are no animation clips in the supplied model.
- Refraction: offscreen text render target, three bounded radial waves with UV displacement, chromatic separation and a blue ring; avatar rendered afterward. The shader is independently authored and approximates the reference's expanding glass lens.
- Closing: editable personal closing and optional real contact links; no fabricated contact information.

## Material ownership

User avatar FBX and source texture maps stay unchanged in their original directory. A converted and reduced web copy is saved under `dist/assets/avatar.glb`. The previous procedural placeholder is an original geometric character and is used only as a load-error fallback. No reference-site model, proprietary font or identity assets are included.
Libre Caslon Display is distributed with its OFL license. Three.js is distributed with its MIT license.

## Validation

`npm run check` verifies JS syntax. `scripts/qa.cjs` checks runtime errors, model loading, cursor rotation, blue hover intensity, click waves, visible text avoidance, navigation, sound toggle, mobile overflow, and a simulated orientation event. Screenshots cover desktop/mobile, hover, ripple and scroll. Actual mobile sensor permissions require a physical device and HTTPS.

The typeface, personal text, supplied avatar and a few secondary details intentionally differ from the source. Liquid-model formation and facial animations are not reproduced with the static supplied asset.
