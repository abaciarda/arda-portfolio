# Sanity setup

The existing Next.js app stays at the repository root. `studio/` is a standalone Sanity Studio. Both use project `w78zoc2a` and dataset `production`.

## Local development

Run `npm install` at the root and `npm install --prefix studio` for Studio dependencies.

Set these values in `.env.local`:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=w78zoc2a
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WEBHOOK_SECRET=your-random-secret
```

The dataset must be public for the website's token-free published-content queries. If a private dataset is desired, configure a server-only Viewer token before enabling it.

Run `npm run dev` for the website and `npm run studio:dev` for the editor at http://localhost:3333. Log in with the Sanity account that owns the project. The frontend has a local content fallback only when `NEXT_PUBLIC_SANITY_PROJECT_ID` is absent; configured projects return their actual published posts and projects, including empty collections. Missing profile/settings documents use the preserved defaults during onboarding. API errors fail visibly rather than silently showing old content.

## Existing content import

The source snapshot includes seven projects, six profile paragraphs, navigation, page introductions, and the existing Tailwind article's 29 blocks. Original JSX snapshots are retained in `migration/source/` so `node migration/extract.mjs` can reproduce the article conversion. Existing project JSON files are migration inputs, not the production content source.

The two sample blog cards without article bodies become drafts. Add their bodies and publish them in Studio to make them appear on the website. Their original slugs are preserved. Unknown or unpublished article URLs return 404.

Run `npm run content:import` to inspect the import plan without writing anything.

If you are signed into the Sanity CLI, run `npm run content:import:cli` for a dry run and `npm run content:import:cli -- --apply` to import using your existing account. Credentials stay in the CLI context and are never saved to the repository.

Alternatively, create a temporary Editor API token in Sanity Manage and set `SANITY_API_WRITE_TOKEN` in `.env.local`. Run:

```sh
npm run content:import -- --apply
```

The importer uploads local images, preserves GitHub preview image URLs, creates the profile before author references, and uses source-derived IDs for repeatability. Existing documents are never replaced or deleted. Reruns skip documents already imported. Remove the write token after importing. Inspect `migration/reports/import.json` and verify all seven projects, the published Tailwind article, two drafts, and the profile in Studio before cutover.

## Publish Studio

The Studio is published at https://arda-portfolio-w78zoc2a.sanity.studio/ with application ID `gn410jypo92shpniyr25vfqx`. Run `npm run studio:deploy` after logging into the Sanity CLI to publish future changes. Studio deployment is separate from the Cloudflare website deployment.

## Cloudflare

Add the public project ID and dataset to the Cloudflare build environment. Set `SANITY_WEBHOOK_SECRET` as a runtime Worker secret. `OCTOKIT_TOKEN` is optional for the public GitHub activity feed. Never put the migration write token in Cloudflare or any `NEXT_PUBLIC_` variable.

The integration uses the standard Next.js fetch cache with a 60-second revalidation interval, plus a signed webhook. It does not require a database or CMS server in the Worker. OpenNext caching must be configured for persistent cache behavior across Worker instances; the current repository uses OpenNext's default cache configuration. Verify production publishing behavior before launch; persistent R2 caching can be configured separately if needed.

In Sanity Manage, create a webhook:

- URL: `https://ardaabaci.com/api/sanity/revalidate`
- Dataset: `production`
- Triggers: create, update, delete
- Filter: `_type in ["post", "project", "profile", "siteSettings"] && !(_id in path("drafts.**"))`
- Projection: `{_id, _type}`
- HTTP method: POST
- Secret: the same value as `SANITY_WEBHOOK_SECRET`
- Drafts: disabled

The endpoint verifies Sanity's signature against the raw request body and expires tagged content. Published content is fetched from Sanity's API to avoid a stale CDN response after a webhook. Scheduled future publication dates are filtered out until their time arrives; they appear on the next cache refresh rather than through an automatic Sanity publishing schedule.

## English and Turkish

English is the default language and uses unprefixed paths: `/`, `/about`, `/projects`, and `/blog`. Turkish uses `/tr`, `/tr/about`, `/tr/projects`, and `/tr/blog`. Old `/en` URLs redirect permanently to the unprefixed English equivalent. Internally, Next.js rewrites English requests to the shared locale routes while keeping `/en` out of the browser URL. Visitors choose Turkish through the navigation switcher; the current language is preserved in internal links. Browser language preferences do not override the English default.

Posts and projects use Sanity's document internationalization plugin with a `locale` field, separate documents per language, and translation metadata linking them. The existing project `language` field still describes the programming language. Profile and Site settings each have English and Turkish entries in Studio. Existing Turkish singleton IDs stay unchanged to preserve author references; English uses `profile-en` and `siteSettings-en`.

In Studio, use the translation menu on a post or project to open or create its other language. New documents have English as the default; language-specific templates also allow creating Turkish content. Translate text inside custom blocks as well as titles and descriptions. Each language is published separately. Keep a shared slug if desired; the website also handles different slugs by following translation references when switching languages. If the other version is missing or unpublished, switching from an article opens that language's blog listing.

UI labels are in `app/i18n/config.ts`. Dates, document language, canonical URLs, language alternates, and Open Graph locale follow the selected language. Untranslated posts do not appear under the other language. Existing documents without a `locale` are treated as Turkish during migration.

`npm run content:localize` prepares a read-only plan for the existing content. After reviewing the English snapshot and the local `migration/reports/localization-plan.json`, run `npm run content:localize -- --apply` to mark existing content as Turkish, add missing English documents, and link translations. The script snapshots current content, checks for changes to its source article/projects, preserves current drafts, and never replaces existing English content. Deploy the updated Studio/schema before applying the import. Then deploy the website separately to Cloudflare.

## Content model

- Posts: metadata, author reference, cover image, category/tags, SEO fields, and Portable Text body.
- Body: headings, paragraphs, lists, links, inline code, images, code blocks, notices, badges, comparison tables, benchmark cards, and feature lists.
- Table of contents: generated from article headings; anchor IDs use stable block keys.
- Projects: display order, featured status, URL, image, language, date, and commit count.
- Profile: singleton for biography, education, focus, skills, avatar, and social links.
- Site settings: singleton for navigation, default SEO, and blog/project page introductions.

Layouts and presentation remain in React. New block types require a matching schema and React renderer.

## Verification

The homepage activity feed shows the latest five public pushes by `abaciarda` across repositories, using each push's head commit message. A GitHub token is optional; invalid tokens fall back to anonymous public access. Requests for the event feed refresh after five minutes, while immutable commit lookups are cached for a day. GitHub's Events API can itself be delayed and is not a complete commit-history API. Private activity is excluded. Remove or replace a rejected `OCTOKIT_TOKEN` in local environment files and Cloudflare secrets.

Run `npm run lint`, `npm test`, `npx tsc --noEmit --incremental false`, `npm --prefix studio run typecheck`, `npm --prefix studio run schema:extract`, `npm --prefix studio run typegen`, `npm run build`, and `npm run studio:build`. Type generation removes generated code comments to follow the project's code style.

After import, check every page, cover images, all custom block types, heading links, author references, and an unknown article URL. Publish a small edit and confirm the live website updates. Draft edits must stay private.
# Homepage projects

In Site settings → English or Türkçe, use **Homepage projects source** to choose **Selected projects** or **Latest GitHub repositories**, then publish the settings document. Missing settings default to selected projects.

Selected mode shows up to five projects with **Show on homepage** enabled, in their **Display order**. GitHub mode shows the five public repositories owned by `abaciarda` with the latest push dates, refreshed every five minutes. Each name links to its repository. If GitHub is unavailable, selected projects provide a fallback. The full Projects page continues to use your Sanity project descriptions and images.
