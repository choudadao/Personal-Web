# Project handoff instructions

This repository is an evolving personal portfolio website. Read these files before making changes:

1. `docs/PROJECT_MEMORY.md` — durable product goal, audience, design direction, architecture, constraints, and decisions.
2. `docs/CURRENT_STATE.md` — current implementation, live routes, known limitations, and the next useful tasks.
3. `content/个人作品网站内容管理.xlsx` — authoritative editable content plan and multilingual content inventory.
4. `docs/CONTENT_WORKFLOW.md` — how workbook records map to future site content.
5. `docs/WORK_LOG.md` — chronological record of completed work and verification.

## Working rules

- Preserve `/about`, `/marble`, and `/mirror` as independent comparison routes unless the user explicitly asks to merge or remove them.
- Keep the existing avatar interactions: pointer or device-orientation tracking, blue hover light, click ripple/refraction, and text avoidance.
- Never invent biography, client names, project outcomes, metrics, awards, testimonials, contact details, or translations. Leave missing content blank or mark it as pending.
- Treat the workbook in `content/` as the content-planning source. The current site does not import it automatically; code remains the runtime source until an importer is implemented.
- Do not commit paid texture packages, unlicensed assets, private source models, credentials, or local absolute paths. Commit only licensed web-ready assets and their license/source notes.
- Optimize large media for the web while preserving the user's source files outside this repository.
- Keep the site usable without camera access. Camera video must remain local, request video only, and stop tracks on Stop, page hide, page exit, or WebGL loss.
- Verify relevant desktop and mobile behavior before publishing. Use `npm run check` for syntax and the focused QA script for changed interactions.
- Commit coherent changes to `main` and push to the configured GitHub repository when the user requests synchronization.

## Required memory updates after each meaningful change

- Update `docs/CURRENT_STATE.md` when routes, features, dependencies, deployment state, known limitations, or next tasks change.
- Append one dated entry to `docs/WORK_LOG.md` with the outcome, affected areas, verification, commit, and deployment status.
- Update `docs/PROJECT_MEMORY.md` only when a durable goal, audience, design principle, technical constraint, or product decision changes.
- Update `docs/CONTENT_WORKFLOW.md` and the workbook together when IDs, columns, supported languages, or import rules change.
- Update `README.md` when setup, commands, routes, asset replacement, or public usage instructions change.
- Update `docs/IMPLEMENTATION.md` and QA JSON only when implementation details or test evidence change.

## Mandatory task closeout

Before reporting that any implementation or content task is complete, the AI must perform this checklist automatically. Do not wait for the user to request documentation updates.

1. Review the files changed during the task and classify the change as runtime, content, durable decision, workflow/schema, setup, implementation detail, or test evidence.
2. Update every memory file required by the mapping above. Do not touch unrelated memory files merely to change a date.
3. Append a dated `docs/WORK_LOG.md` entry for every meaningful change. Record the outcome, affected areas, verification performed, and whether GitHub and the live site were updated.
4. Run relevant checks and compare `git status` with the documentation. The documents must describe completed work accurately and must not claim unimplemented or unpublished work.
5. When Git synchronization is part of the user's request, include code, content, and their memory updates in the same coherent commit and push it.
6. In the final response, confirm which memory files were updated. If no memory file needed a change, state that explicitly and explain why in one sentence.

If the AI cannot update a required file, it must leave the task open, identify the exact missing update, and tell the user what blocks it. A reminder in chat is not a substitute for updating the repository.

At the start of a new session, compare `git status`, the latest commit, `CURRENT_STATE.md`, and the workbook before editing. At the end, ensure the documentation describes the committed state rather than plans that were not completed.

