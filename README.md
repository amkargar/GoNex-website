# Gonex website

Official-style English website for [Gonex](https://github.com/amkargar/gonex), built with Nuxt 4, TypeScript, Tailwind 4, Nuxt UI and Nuxt Content. The output is fully static and suitable for GitHub Pages.

## Run locally

Use Node.js **24 LTS** (the build uses native `node:sqlite`, so old Node releases are unsupported).

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
SITE_URL=https://amkargar.github.io NUXT_APP_BASE_URL=/GoNex-website/ PUBLIC_INDEXING=true npm run generate
```

On Windows PowerShell, set those environment variables with `$env:NAME = 'value'` before `npm run generate`. Output is `.output/public`. `npm run build` produces the same static export. No server is needed in production.

For local review use `PUBLIC_INDEXING=false`; this is the default. Production origin must be HTTPS and contain **no path**. Configure the path separately with `NUXT_APP_BASE_URL`; do not include it twice.

## Design and features

- Warm white / charcoal / duck yellow, Geist Sans and Geist Mono, original transparent duck mascot.
- Responsive landing page, source-grounded quick start, GitHub Source Code and Get Started buttons.
- Light default with persistent dark-mode switch through Nuxt Color Mode.
- Versioned docs, desktop sidebar, mobile docs navigation, heading contents and previous/next links.
- Local static search with Cmd/Ctrl+K; no remote service/account. Search reads headings and full guide text.
- Copyable code examples, Nuxt Content syntax highlighting, keyboard-accessible Nuxt UI dialog.
- Markdown blog, categories, article metadata, author and RSS.

## Content truth and snapshot

The current Go repository has **no published framework release**. `main · Development` is a documentation snapshot, not an invented v1 release. Read `shared/source-snapshot.json` for the source commit. The website is based on the upstream README and source docs at that commit; it does not automatically update when the framework changes. Source-grounded does not mean the Go examples were executed in this website build.

Imported documentation is under the upstream BSD 3-Clause terms; see `UPSTREAM_LICENSE`. First-party website files and articles are delivered to the project owner without imposing a separate license. Font licenses are included beside local WOFF2 assets. Mascot was supplied by the owner.

The two dated journal entries are newly authored introductory/architecture drafts, not release announcements or third-party endorsements. Review the copy before public launch.

## Two documentation audiences

The main **Build with Gonex** documentation lives at `/docs/<version>/`: adding the Go dependency, running an application, building HTML websites, connecting a frontend and deploying it. **Contribute to Gonex** lives at `/docs/<version>/contribute/`: framework setup, internals, tests, pull requests and maintenance.

The section picker, scoped search, breadcrumbs and previous/next navigation keep these paths distinct while using the same version registry. Existing consumer guide URLs are retained. Complete source examples are in `examples/quick-start/` and `examples/website/`; each is intended for a separate consumer Go module.

## Edit content

Markdown is under `content/docs/main/` and `content/blog/`. Nuxt Content renders full HTML during generation. Frontmatter requires unique `title` and `description`. Docs also have `order`, `version`, `section` (`build` or `contribute`) and `group` (sidebar heading). `source` is optional and points to an upstream reference filename when a guide is adapted from it. Blog posts have `date` (ISO string), `author`, `category` and `readingTime`.

Every `dev`, `typecheck`, and `generate` command runs `scripts/sync-content.mjs` to rebuild the route manifest and local search index from Markdown. When adding a page during an already-running dev session, run `npm run sync-content` and restart the dev server so generated indexes update. Titles and body edits are then handled by Nuxt Content.

Keep readable slugs; order is a frontmatter value, not a filename prefix. Use `index.md` for version roots. Use root-relative Nuxt links, e.g. `/docs/main/modules/`, in Markdown. NuxtLink adds the app base automatically. For raw assets use `useSiteUrl().asset()`.

### Add a documentation version

1. Create `content/docs/<version>/`, starting with `index.md` and the relevant guides.
2. Add that id and label to `shared/versions.json`; set its `released` state honestly.
3. Change `defaultVersion` if the release should become the default.
4. Assign each guide a `section`, sidebar `group` and `order`. Navigation is generated from these fields; do not maintain a second list of guide slugs.
5. Run `npm run typecheck` and `npm run generate`.

The selector preserves the current slug when it exists in the destination version, otherwise takes the reader to its index. Do not add an option before that content exists. Each version's pages are self-canonical and discoverable in the sitemap. HTTP API versions and documentation versions are independent.

### Refresh upstream docs

Import reviewed changes from the source repository, maintaining website frontmatter and local links. Update `shared/source-snapshot.json` when the snapshot changes; keep source links pinned to that reviewed commit. Inspect release/toolchain status before changing the quick-start copy. Do not advertise `go install ...@latest` until a real release is published.

## SEO included

- Complete HTML per page; explicitly enumerated prerender routes.
- Unique title/description, absolute canonical, Open Graph and Twitter large-image metadata.
- Real 1200×630 `public/og/gonex.png`, favicon, 180px Apple touch icon, 192px and 512px icons.
- WebSite / SoftwareSourceCode on landing; TechArticle and breadcrumbs for docs; BlogPosting, article date/author and breadcrumbs for posts.
- Generated sitemap, robots policy, RSS, webmanifest, `.nojekyll`, and optional `llms.txt`.
- Consistent URL helper for origin and base path; metadata files use the same settings.
- Preview defaults to noindex/nofollow and Disallow. Public GitHub Pages CI deliberately enables indexing. No fake verification tags, ratings, social handles or keyword stuffing.
- Custom noindex 404 and direct HTML files for deep links. GitHub Pages serves `404.html` on misses; private review hosting is separate and may add its own authentication.
- Local fonts with `font-display: swap`, explicit image dimensions, reduced-motion support and responsive layouts.

`llms.txt` is optional developer discovery content, not a Google ranking signal. SEO infrastructure cannot guarantee rankings. Search Console verification, domain ownership, public indexability and submission are owner-side launch tasks.

## GitHub Pages

1. Create a separate `gonex-website` repository and push this source including `package-lock.json`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Push to main or run the Deploy Gonex Website workflow manually.

The workflow uses `configure-pages` outputs for the canonical HTTPS origin and base path; no repository name is hardcoded. It runs `npm ci`, typecheck, static generation and output audit before uploading `.output/public`. It grants only contents:read, pages:write and id-token:write.

- Project Pages: origin `https://amkargar.github.io`, base `/GoNex-website/`.
- User/organization Pages: that origin and base `/`.
- Custom domain: configure domain/DNS/HTTPS in Pages; the configure-pages output supplies its origin/base. If manually deploying, set SITE_URL and base explicitly. Do not retain a preview hostname in production metadata.

Repository: https://github.com/amkargar/GoNex-website. Publishing is automated by the GitHub Actions workflow. Domain/DNS and Search Console verification remain owner-managed.

## Validation

`scripts/verify-static.mjs` checks all content routes for exported HTML, one h1, unique title/description, exact canonical, social tags, parseable JSON-LD and the expected indexing policy. It verifies local links/assets, sitemap membership, metadata files, manifest scope/start URL and noindex 404. It also checks CSS font URLs for broken project-base references.

The build-time checker is not a browser accessibility audit, Lighthouse report or search-engine index guarantee. See `VERIFICATION.md` for the actual executed checks and verification limits.
