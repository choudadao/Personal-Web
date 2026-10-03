# About interaction study

Source: https://www.gionatannese.com/about → the interaction structure used by `/`, `/about`, `/marble`, and `/mirror`.
Isolated project: `projects/avatar-about`. No existing application routes changed.

The source was inspected through its public About module and desktop screenshots. Native CUA was unavailable; a local headless Edge session provided reference and implementation screenshots. This is an independent implementation of the interaction structure, not a copy of the original bundled application.

## Modules / specifications

- Header: fixed compact navigation, neutral translucent backgrounds, serif labels, optional synthesized sound toggle. Links target the implemented About-page sections rather than unimplemented project pages.
- Hero: white background, three centered serif lines, fixed central avatar drawn in front of type, smaller work descriptor underneath. Desktop type scales to 76px; mobile type scales to viewport.
- Chapters: four sections, serif title with chapter markers, left/right line-anchored body text. Each line displaces away from an invisible central ellipse while scrolling; mobile paragraphs are staggered vertically.
- Avatar: user's uncompressed Skeptical Cap Girl textured static GLB, normalized to a fixed visual size; smooth pointer/orientation rotations, raycast-local blue shader, global click spring response. The current 30.1 MB trial contains 850,256 triangles and no animation clips.
- Material routes: `/` and `/about` alias `/marble`; the marble route shifts from polished black marble to monochrome graphite within the local pointer mask. `/mirror` uses softened chrome with optional camera reflection. The colored source material is not exposed in the public selector.
- Dot matrix: a fixed, pointer-transparent CSS overlay shared by every public route. Its radial-gradient field uses the inspected Nothing reference settings (32px frame, 30% overlay opacity, 1px white dots with a 1.5px transparent edge, half-cell alignment, and `difference` blending). Runtime sizing produces 12 equal columns on desktop/tablet and four on mobile; the field enters after the experience is ready and exits on same-origin navigation.
- Refraction: offscreen text render target, three bounded radial waves with UV displacement, chromatic separation and a blue ring; avatar rendered afterward. The shader is independently authored and approximates the reference's expanding glass lens.
- Closing: editable personal closing and optional real contact links; no fabricated contact information.

## Material ownership

User source files stay unchanged in their original directory. The supplied uncompressed GLB is copied to `dist/assets/avatar.glb` for this fidelity trial. The previous procedural placeholder is an original geometric character and is used only as a load-error fallback. No reference-site model, proprietary font or identity assets are included.
Libre Caslon Display is distributed with its OFL license. Three.js is distributed with its MIT license.

## Validation

`npm run check` verifies JS syntax. `npm run qa` runs the complete Playwright browser suite, while the four `npm run qa:*` commands run focused checks. Playwright and Sharp are direct development dependencies rather than relying on tools installed elsewhere or pulled in transitively. The scripts launch Playwright-managed Chromium, installed once with `npx playwright install chromium`, rather than relying on a separately installed system browser.

`scripts/qa.cjs` checks runtime errors, model loading, cursor rotation, blue hover intensity, click waves, visible text avoidance, navigation, sound toggle, mobile overflow, and a simulated orientation event. Marble QA also checks that no colored-version link remains and that the circular surface shift does not alter pixels outside its boundary. Screenshots cover desktop/mobile, hover, ripple and scroll. Actual mobile sensor permissions require a physical device and HTTPS.

The marble pointer-exit and touch-release assertions wait until the reveal easing reaches its final threshold. The touch release dispatches to the same global listener used by the runtime. These state-based checks avoid synthetic-event bubbling and machine-speed differences across Chromium versions and avatar asset sizes.

Camera QA allows up to 90 seconds for the uncompressed avatar to become ready on each simulated page and up to 60 seconds for mobile virtual-camera frames. The high-density simulated mobile case dispatches button click events directly to avoid Playwright actionability delays under heavy WebGL load; it still verifies the same handlers, camera state, controls, and stream cleanup.

The dot matrix was additionally checked in Chromium at 1440×1000 and 390×844. Computed styles confirmed `opacity: .3`, `mix-blend-mode: difference`, `pointer-events: none`, a fully revealed field, reference-matching background positions, and 12/4 responsive columns. Desktop and mobile screenshots were visually reviewed; screenshots remain ignored local QA artifacts.

The typeface, personal text, supplied avatar and a few secondary details intentionally differ from the source. Liquid-model formation and facial animations are not reproduced with the static supplied asset.
