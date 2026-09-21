# Content workbook workflow

The repository copy of the workbook is `content/个人作品网站内容管理.xlsx`. It is the planning and review source for future portfolio content.

## Sheet responsibilities

| Sheet | Owns |
| --- | --- |
| 网站方向 | Purpose, audience, language choices, public identity, contact settings, and default avatar choice |
| 页面规划 | Page and section IDs, route suggestions, visibility, ordering, and implementation status |
| 作品库 | Project IDs, internal names, status, featured choice, order, dates, links, publication scope, and role |
| 多语言文案 | Copy keyed by content ID, field, and language code |
| 素材库 | Asset IDs, related content IDs, paths/URLs, format, order, alt-text IDs, rights, and readiness |
| 更新说明 | Instructions for recurring edits and future importing |

## Stable-key rules

- `作品编号`, `板块编号`, `内容编号`, and `素材编号` are machine-facing keys. Keep them stable after publication.
- Use lowercase ASCII IDs with hyphens or dots, such as `project-004`, `home.featured`, and `project-004-cover`.
- Add new records rather than reusing an old ID for different content.
- Multilingual copy is uniquely identified by `内容编号 + 字段 + 语言代码`.
- Assets reference projects or pages through their content IDs; alt text uses a separate content ID in the multilingual sheet.

## Review and publication rules

- Only real and approved personal information may be marked confirmed.
- A project is publishable only when its public scope, role/credits, title, summary, cover asset, and required launch-language copy are reviewed.
- Media needs a known owner/license and publication permission.
- Blank copy means missing content, not permission to copy another language silently.
- A fallback language may be used later, but the interface should identify incomplete translations during preview.
- Workbook changes do not publish automatically. They must be imported or manually applied, reviewed in the browser, committed, and deployed.

## Files that change together

| Change | Update |
| --- | --- |
| New project | `作品库`, matching rows in `多语言文案`, and related rows in `素材库` |
| New language | `网站方向`, corresponding `多语言文案` rows, and future locale configuration |
| New page/section | `页面规划`, its multilingual fields, runtime routes/components, and `CURRENT_STATE.md` |
| Asset replacement | `素材库`, the web asset file, license/source notes, and affected QA if visual behavior changes |
| ID or column schema change | Workbook, this file, importer/validator when present, `PROJECT_MEMORY.md` if the policy changes |

## Planned import contract

The first importer should create a generated, reviewable JSON file rather than reading XLSX in the browser. It should:

1. Validate required columns and unique stable IDs.
2. Reject duplicate `内容编号 + 字段 + 语言代码` rows.
3. Report missing launch-language fields, missing assets, and unclear publication rights.
4. Exclude hidden, archived, or unapproved records from the public output.
5. Preserve ordered records and explicit zero/blank distinctions.
6. Generate a preview data file without deploying.
7. Publish only after browser review and a committed generated result.

Until that importer exists, `dist/content.js` remains the runtime source and must be updated manually from approved workbook rows.
