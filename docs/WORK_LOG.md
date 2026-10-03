# Work log

Use one entry per meaningful change. Keep entries concise and factual. Newest entries go first.

## 2026-10-03 — Responsive difference-blend dot matrix

- Added a viewport-fixed dot matrix to `/`, `/about`, `/marble`, and `/mirror`, based on the inspected runtime settings of the Nothing About reference.
- Preserved the 32px frame, 30% layer opacity, 1px-to-1.5px radial dots, half-cell alignment, Difference blending, pointer passthrough, and responsive 12-column desktop / four-column mobile geometry.
- Connected the entrance to the existing completed-loading state, added a same-origin navigation fade-out, and retained an immediate reduced-motion fallback.
- Verification: `npm run check`, `git diff --check`, the complete `npm run qa` suite, computed-style checks at 1440×1000 and 390×844, and desktop/mobile visual review passed.
- GitHub: commit `526cf6b` pushed to `origin/main`.
- Deployment: not updated in this task.

## 2026-09-23 — Uncompressed GLB fidelity trial

- Replaced the reduced 2.3 MB avatar with the user-supplied 30.1 MB GLB without geometry or texture compression.
- The trial asset contains 850,256 triangles, 452,778 vertices, three embedded textures, and no animation clips. The higher-density geometry visibly smooths the face and silhouette under the marble material.
- Existing marble/mirror routes, pointer/device tracking, blue hover light, click ripple/refraction, text avoidance, and camera behavior remain unchanged.
- Verification: syntax check and all focused interaction/camera QA passed. Local headless measurement reported about 60 fps at 1440×1000 and about 40 fps at a simulated 390×844 viewport with 2× device scale; real-device network and thermal performance remain to be checked.
- GitHub: included in this task's uncompressed-model trial commit.
- Deployment: published to the existing private site after validation.

## 2026-09-22 — Colored material withdrawal and visual issue record

- Recorded that the current model silhouette and colored treatment are not visually resolved and should be revisited in a later material exploration.
- Removed the colored material from the public selector; `/` and `/about` now remain valid as marble aliases, while `/marble` and `/mirror` are the two public comparisons.
- Replaced the marble route's circular colored-texture reveal with a monochrome graphite surface shift while retaining pointer/device tracking, blue hover light, click ripple/refraction, and text avoidance.
- Verification: `npm run check`, default-page QA, marble QA, reveal-boundary QA, and virtual-camera QA passed; the marble idle and shifted states were visually reviewed.
- GitHub: included in this task's material-direction commit.
- Deployment: published to the existing private site after validation.

## 2026-09-22 — Skeptical Cap Girl avatar replacement

- Replaced the shared avatar web asset with the user-supplied Skeptical Cap Girl FBX and its PBR textures; the source folder was left unchanged.
- Converted the 40.5 MB FBX to GLB and optimized the web copy to about 2.3 MB, 68,018 triangles, with no animation clips.
- The original, marble, and mirror routes continue to use the same shared avatar while retaining their existing interaction and material behavior.
- Verification: `npm run check`, original-page QA, marble QA, reveal-boundary QA, and virtual-camera QA passed. Desktop and mobile renders were visually reviewed. Physical-device camera and motion testing remains manual.
- GitHub: included in this task's avatar replacement commit.
- Deployment: the same committed source is published to the existing private site after validation.

## 2026-09-21 — Reproducible browser QA setup and private source metadata

- Replaced the avatar optimization record's local absolute source path with a generic description of the uncommitted user-provided model.
- Declared Playwright and Sharp as direct development dependencies, added complete and focused `npm run qa` commands, and made the scripts use Playwright-managed Chromium.
- Changed the marble pointer-exit and touch-release checks to wait for their final thresholds instead of assuming fixed machine-dependent delays; runtime interaction timing is unchanged.
- Increased only the camera QA readiness timeouts to accommodate the later 30.1 MB uncompressed avatar trial; camera behavior and assertions are unchanged.
- Made the high-density mobile camera case dispatch its start/stop clicks directly so Playwright actionability checks do not time out under heavy WebGL load; the same application handlers and outcomes remain covered.
- Ignored Chromium's local `debug.log` output so browser diagnostics do not appear as project changes.
- Updated setup, verification, implementation, and handoff documentation for the reproducible QA workflow.
- Verification: dependency lock refreshed; `npm run check` and the complete `npm run qa` browser suite passed with Playwright-managed Chromium.
- Commit: this reproducible browser QA setup commit.
- GitHub: included in this QA setup commit and pushed to `main`.
- Deployment: not required because runtime website behavior is unchanged.

## 2026-09-21 — Automatic memory closeout rule

- Strengthened `AGENTS.md` with a mandatory end-of-task checklist for AI collaborators.
- AI must now classify each change, update the applicable memory files automatically, append the work log, verify documentation against Git state, and report which memory files changed.
- No runtime website behavior or content changed.
- Verification: reviewed repository instructions and confirmed the working tree only contains this documentation update.
- GitHub: included in this documentation commit.
- Deployment: not required because the runtime site is unchanged.

## 2026-09-21 — Repository memory and content framework

- Added durable project goals, current state, content workflow, and AI handoff instructions.
- Added the editable portfolio content workbook to `content/` with confirmed audience, purpose, style, actions, initial page plan, three project placeholders, multilingual copy structure, and asset inventory.
- No runtime website behavior changed in this entry.
- Verification: workbook structure, key values, formula-error scan, and rendered views were reviewed during creation.
- Commit: this repository-memory documentation commit.
- Deployment: not required because the runtime site is unchanged.

## 2026-09-17 — Mobile scale and camera mirror refinement

- Increased all mobile avatar variants to 1.5 times their earlier visual size and enlarged text avoidance accordingly.
- Increased chrome roughness and softened the live-camera reflection.
- Collapsed the mobile permission panel after camera access, keeping switch and stop controls.
- Verification: JavaScript syntax and virtual-camera QA passed; real phone testing remained manual.
- Commit: `08d4775`.
- Deployment: published to the private live site and pushed to GitHub.

## 2026-09-17 — Camera mirror comparison

- Added `/mirror` as a third independent material comparison.
- Added opt-in, video-only camera reflection with front/rear switching and stream cleanup.
- Preserved the original interaction set.
- Commit: `51d3ff6`.

## 2026-09-16 — Marble comparison

- Added `/marble` with procedural black marble and a local circular original-texture reveal.
- Preserved `/about` as the original textured comparison.
- Commit: `44351d6`.

## 2026-09-16 — Initial About experience

- Built the independent Three.js About page with the supplied optimized avatar.
- Added pointer/device orientation, hover glow, ripple/refraction, and text avoidance.
- Commit: `b65868d`.

