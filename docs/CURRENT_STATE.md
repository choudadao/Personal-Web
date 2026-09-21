# Current state

Updated: 2026-09-21

## Working implementation

The repository contains a static Three.js About study with an optimized user-supplied avatar and three independent variants:

| Route | State | Behavior |
| --- | --- | --- |
| `/about` | Live | Original model texture, pointer/device orientation, blue hover, click ripple/refraction, and text avoidance |
| `/marble` | Live | Procedural polished black marble; the pointer/touch circle locally reveals the original texture; original interactions remain |
| `/mirror` | Live | Softened chrome with optional camera reflection; mobile permission panel collapses after success; switch and stop controls remain |

On mobile, the model is scaled to 1.5 times the earlier size and the text-avoidance ellipse is enlarged to match.

## Content state

- The visible biography and chapter text in `dist/content.js` is placeholder copy.
- Public name, role, contact information, resume, and real portfolio projects have not been supplied.
- The content workbook exists at `content/个人作品网站内容管理.xlsx` and contains confirmed direction plus editable records for three initial projects.
- Runtime code does not yet import the workbook.

## Verification state

- `npm run check` checks JavaScript syntax.
- `scripts/qa.cjs` covers the original page and mobile interactions.
- `scripts/qa-marble.cjs` and `scripts/qa-reveal-boundary.cjs` cover the marble reveal.
- `scripts/qa-camera.cjs` covers camera opt-in, live texture updates, camera switching, stream cleanup, denied permission, mobile overflow, and compact mobile controls using a virtual camera.
- Physical-device camera and motion permission behavior still requires manual testing on HTTPS in Safari and Chrome.
- JSON evidence is stored under `docs/`; screenshots are intentionally ignored by Git.

## Known limitations

- The supplied avatar has no facial animation clips; motion is procedural.
- A single phone camera is mapped as an approximate environment and cannot produce a physically correct 360-degree reflection.
- Marble and chrome are approximations and do not include the referenced premium texture downloads.
- The current project is an About experience, not yet a complete portfolio with Home, Work, Project detail, and Contact pages.
- Multilingual routing, locale switching, SEO metadata, and workbook import are not implemented.

## Next useful work

1. Fill website identity, contact details, launch languages, and the first three project records in the workbook.
2. Build the portfolio shell: Home, Work, Project detail, About, Lab, and Contact.
3. Define a data format generated from the workbook and add validation plus preview before publication.
4. Replace placeholder copy and add approved, optimized project media.
5. Add multilingual routing and metadata after launch languages are confirmed.

## Resume checklist for a new computer or AI session

1. Clone `https://github.com/choudadao/Personal-Web.git` and enter the repository.
2. Read `AGENTS.md`, `docs/PROJECT_MEMORY.md`, this file, and `docs/WORK_LOG.md`.
3. Open `content/个人作品网站内容管理.xlsx` to review pending inputs and approved content.
4. Check `git status` and the latest commit before changing files.
5. Install dependencies with the package manager used by the environment if `node_modules` is absent.
6. Run `npm run dev`, open the relevant routes, and run `npm run check` before committing.
7. Update the required memory files described in `AGENTS.md` at the end of the work.
