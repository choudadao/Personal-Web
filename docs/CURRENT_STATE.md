# Current state

Updated: 2026-09-22

## Working implementation

The repository contains a static Three.js About study with an optimized user-supplied avatar and two public material variants:

The current avatar is the user-supplied Skeptical Cap Girl model converted from FBX with its color, normal, roughness, and metallic source maps, then optimized into `dist/assets/avatar.glb`. The web copy is about 2.3 MB, 68,018 triangles, and contains no animation clips.

| Route | State | Behavior |
| --- | --- | --- |
| `/` and `/about` | Live | Aliases of the marble direction for existing links |
| `/marble` | Live | Procedural polished black marble; the pointer/touch circle locally shifts to monochrome graphite; pointer/device orientation, blue hover, click ripple/refraction, and text avoidance remain |
| `/mirror` | Live | Softened chrome with optional camera reflection; mobile permission panel collapses after success; switch and stop controls remain |

The colored material version has been removed from the selector and public route behavior after visual review. Its source texture data remains inside the optimized GLB but is not exposed as a public variant.

On mobile, the model is scaled to 1.5 times the earlier size and the text-avoidance ellipse is enlarged to match.

## Content state

- The visible biography and chapter text in `dist/content.js` is placeholder copy.
- Public name, role, contact information, resume, and real portfolio projects have not been supplied.
- The content workbook exists at `content/个人作品网站内容管理.xlsx` and contains confirmed direction plus editable records for three initial projects.
- Runtime code does not yet import the workbook.

## Verification state

- `npm run check` checks JavaScript syntax.
- `scripts/qa.cjs` covers the default marble page and mobile interactions.
- `scripts/qa-marble.cjs` and `scripts/qa-reveal-boundary.cjs` cover the marble surface-shift mask.
- `scripts/qa-camera.cjs` covers camera opt-in, live texture updates, camera switching, stream cleanup, denied permission, mobile overflow, and compact mobile controls using a virtual camera.
- Physical-device camera and motion permission behavior still requires manual testing on HTTPS in Safari and Chrome.
- JSON evidence is stored under `docs/`; screenshots are intentionally ignored by Git.

## Known limitations

- The current Skeptical Cap Girl avatar has no animation clips; motion is procedural.
- The current avatar silhouette and face treatment are not considered visually resolved; the user plans to revisit the model and material direction.
- A single phone camera is mapped as an approximate environment and cannot produce a physically correct 360-degree reflection.
- Marble, graphite, and chrome are exploratory approximations rather than a final art direction, and do not include the referenced premium texture downloads.
- The current project is an About experience, not yet a complete portfolio with Home, Work, Project detail, and Contact pages.
- Multilingual routing, locale switching, SEO metadata, and workbook import are not implemented.

## Next useful work

1. Fill website identity, contact details, launch languages, and the first three project records in the workbook.
2. Build the portfolio shell: Home, Work, Project detail, About, Lab, and Contact.
3. Define a data format generated from the workbook and add validation plus preview before publication.
4. Explore alternative restrained avatar materials and reassess the model silhouette before choosing a final direction.
5. Replace placeholder copy and add approved, optimized project media.
6. Add multilingual routing and metadata after launch languages are confirmed.

## Resume checklist for a new computer or AI session

1. Clone `https://github.com/choudadao/Personal-Web.git` and enter the repository.
2. Read `AGENTS.md`, `docs/PROJECT_MEMORY.md`, this file, and `docs/WORK_LOG.md`.
3. Open `content/个人作品网站内容管理.xlsx` to review pending inputs and approved content.
4. Check `git status` and the latest commit before changing files.
5. Install dependencies with the package manager used by the environment if `node_modules` is absent.
6. Run `npm run dev`, open the relevant routes, and run `npm run check` before committing.
7. Update the required memory files described in `AGENTS.md` at the end of the work.
