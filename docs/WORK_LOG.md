# Work log

Use one entry per meaningful change. Keep entries concise and factual. Newest entries go first.

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

