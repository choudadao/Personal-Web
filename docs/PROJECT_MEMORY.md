# Project memory

Last reviewed: 2026-09-22

## Product goal

Build a distinctive multilingual personal portfolio for job seeking, freelance work, and creative presentation. The primary visitors are recruiters and potential clients. The site should lead visitors toward viewing selected work and contacting the owner.

The experience should prioritize finished work and interactive expression. Its character is experimental, warm, and approachable. The interactive avatar is a recognizable part of the identity, but the final portfolio must also make projects, responsibilities, and outcomes easy to understand.

## Confirmed direction

- Purpose: job seeking, freelance projects, and creative showcase.
- Audience: recruiters and potential clients.
- Languages: multilingual. Initial workbook rows use `zh-CN` and `en`; the exact launch languages and default locale are still open decisions.
- Content priority: project outcomes first, interactive experience also prominent.
- Personality: experimental, warm, approachable.
- Primary actions: view work and contact the owner.
- Initial information architecture: Home, Work, Project detail, About, Lab, and Contact. Notes and Awards remain optional until real content exists.

## Experience principles

1. Show evidence before claims. Project pages should lead with the result, then explain role, context, decisions, and outcome.
2. Use interaction to express personality without hiding navigation, project information, or contact paths.
3. Keep the central avatar responsive to pointer or device motion and preserve click ripple, text avoidance, and local blue hover lighting.
4. Respect reduced-motion preferences, mobile performance, accessibility, camera privacy, and graceful fallbacks.
5. Do not fabricate personal information or project success. Missing information stays visibly pending in the workbook.

## Content system decision

`content/个人作品网站内容管理.xlsx` is the editable planning source for site direction, sections, projects, multilingual copy, and assets. Stable IDs link records across sheets. Titles must not replace IDs.

The current static website does not read the workbook at runtime. Until an import pipeline exists, changes follow this sequence:

1. Edit and review the workbook.
2. Translate approved records into site data/code.
3. Preview desktop and mobile behavior.
4. Commit, push, and deploy.

A future importer should validate IDs, language coverage, status, public scope, and referenced assets before generating runtime content. Publishing should require an explicit preview step.

## Technical baseline

- Static ES modules served from `dist/`.
- Three.js is vendored locally; no runtime CDN dependency.
- Primary runtime content currently lives in `dist/content.js`.
- User avatar web copy: `dist/assets/avatar.glb`; currently generated from the user-supplied Skeptical Cap Girl FBX and its PBR textures.
- Local development command: `npm run dev`.
- Syntax check: `npm run check`.
- GitHub: `https://github.com/choudadao/Personal-Web.git`, branch `main`.
- Private live site: `https://personal-avatar-study-0916.ccchangchang7.chatgpt.site`.

## Durable route decisions

- `/about`: original textured avatar comparison.
- `/marble`: procedural black-marble avatar with circular original-texture reveal.
- `/mirror`: softened chrome avatar with optional local live-camera reflection.

These are currently comparison pages and should remain independently testable. A future `/lab` page may collect their links without removing the individual routes.

## Asset and privacy constraints

- The original supplied model remains outside the repository; only its optimized web copy is committed.
- Textures.com and Poliigon references are premium assets and are not included. Current marble and chrome appearances are independently authored approximations.
- Add a license/source note for every third-party font, library, texture, image, video, or model that enters the repository.
- Never commit account credentials, camera data, private client files, or material that lacks publication permission.
- Camera access is opt-in, video-only, local to the browser, and must have a non-camera fallback.

## Open product decisions

- Public name, professional title, biography, email, social links, availability, and resume.
- Launch languages, default locale, and language-switching behavior.
- Default avatar material on the final home page.
- Three to six selected projects and their publication permissions.
- Whether Notes and Awards should launch.
- Whether content updates remain an assisted build process or become a self-service spreadsheet import workflow.
