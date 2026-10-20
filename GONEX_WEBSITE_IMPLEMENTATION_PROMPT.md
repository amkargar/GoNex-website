# Gonex official website — complete implementation prompt

## Role and outcome
Act as a senior frontend engineer, technical writer, and technical SEO engineer. Build the official English-language website for the open-source Gonex Go backend framework. Deliver a complete, responsive Nuxt source project, a generated static website, a working private review URL, and GitHub Pages deployment instructions. This specification records the approved direction; do the implementation rather than stopping at a plan.

## Ground truth before content
- Framework repository: https://github.com/amkargar/gonex. Inspect its current README, go.mod, examples, CLI help/source, public exports, docs, license and release tags.
- Use the user's original Gonex duck mascot. Preserve its geometry and transparency; do not redraw or distort it.
- Earlier framework implementation prompts describe targets, not proof of implemented functionality. Prefer current repository code and docs.
- Install commands, imports, configuration, HTTP routes and expected responses must match the actual source. Do not invent APIs, CLI subcommands, version numbers, stars, users, benchmark scores, testimonials, license terms, or maturity claims.
- If a capability is proposed, say so. If only one documentation version is available, support a registry and selector without inventing a v2. Label a development snapshot honestly; documentation version is independent of HTTP API version.

## Product and information architecture
1. Landing at `/`: clear framework positioning, Get Started, GitHub Source Code, actual quick setup, minimal working application, module explanation, HTTP/gRPC capabilities where verified, contribution links and recent articles.
2. Version-aware docs at `/docs/<version>/...`: introduction, installation, quick start, CLI, modules, HTTP, gRPC, architecture, schemas/OpenAPI, deployment, API reference. Include only supported features or explicitly marked roadmap material.
3. `/docs/` resolves to the default docs version. Each version has an index; unknown versions/pages produce a genuine 404, never unrelated content.
4. `/blog/` lists Markdown articles. Individual articles provide title, summary, author, date, reading time, tags, content, table of contents and related navigation where useful. No fabricated release announcements.
5. Contribution guide and appropriate GitHub issues/source/edit links. Footer links must resolve.

## Visual direction — confirmed
Minimal and technical, with restrained personality from the duck mascot. No terminal-themed page. A code editor may be dark in a light page, but the overall design is spacious and editorial.
- Warm white surfaces, charcoal text and duck yellow accents; maintain sufficient contrast with dark text on yellow.
- Matching dark mode with persistent user preference, sensible initial light default and no prominent theme flash.
- Geist Sans for interface/editorial text; Geist Mono for code. Prefer self-hosted WOFF2 with font-display: swap and system fallbacks.
- Lucide icons; no mixed icon families. Use Nuxt UI as the accessible primitive foundation, customized through central tokens.
- A 4px spacing scale, roughly 8–12px control/card radii, restrained shadows and fine neutral borders.
- Hero: large concise heading, clear description, Get Started and GitHub Source Code buttons. Use the real mascot and a copyable, source-grounded application preview.
- Follow with a genuinely useful 3-step quick start, architecture-specific explanations, and an invitation to read the docs/contribute. Avoid repeated generic cards.
- Make responsive layouts at 360, 768, 1024 and 1440px. Keep line lengths comfortable; let code blocks scroll internally without overflowing the page.
- Honor reduced motion. Avoid looping decorative animation, excessive gradients and heavy libraries.

## Required interactions
- Get Started links to the active/default version's quick start.
- GitHub Source Code links to the correct public repository, with a clear accessible name.
- Copyable installation commands and code blocks; show success and gracefully handle clipboard unavailability.
- Docs version selector uses a single registry. Switching version preserves the equivalent slug when it exists, otherwise navigates to the selected version's index. Do not show unavailable versions as releases.
- Desktop docs sidebar; mobile navigation with a usable open/close button.
- Active navigation and heading table of contents.
- Local static documentation search, keyboard shortcut (Cmd/Ctrl+K), Escape close, accessible results, empty state and version scoping. Search must not require a runtime server or third-party account.
- Blog category filtering where useful; date and reading time are based on article content.
- Keyboard-visible focus, skip link and semantic form labels. Use Nuxt UI primitives for accessible modal/search behavior.

## Stack
- Nuxt 4 + Vue 3 + TypeScript.
- Tailwind CSS 4 and Nuxt UI.
- Nuxt Content page collections for versioned docs and blog, authored in Markdown/MDC.
- SSG with `nuxt generate`: every meaningful page has complete HTML before JavaScript runs. No production Node server requirement.
- Static-compatible content queries and local search. Validate direct deep links after export.
- Repository separate from the Go framework: `gonex-website`.
- Pin resolved versions with a committed package lock. Choose supported Node LTS for CI, documenting the actual tested runtime.

## Suggested structure
```
.github/workflows/deploy.yml
app/
  app.vue
  app.config.ts
  assets/css/main.css
  components/{SiteHeader,SiteFooter,CodeBlock,DocsSearch}.vue
  composables/usePageSeo.ts
  layouts/{default,docs}.vue
  pages/index.vue
  pages/docs/index.vue
  pages/docs/[...slug].vue
  pages/blog/index.vue
  pages/blog/[...slug].vue
  error.vue
content/docs/<version>/*.md
content/blog/*.md
shared/{site,versions}.ts
public/{brand,fonts,og,favicon.ico,icon-192.png,icon-512.png,apple-touch-icon.png}
content.config.ts
nuxt.config.ts
scripts/{seo-files,verify-static}.mjs
package.json
package-lock.json
README.md
.env.example
GONEX_WEBSITE_IMPLEMENTATION_PROMPT.md
```
Exact names may change when Nuxt conventions make another arrangement simpler.

## SEO implementation — build it, do not just list it
### Crawlability and routing
- SSR enabled during generation. Explicitly enumerate docs/blog routes instead of relying only on crawling the homepage.
- Serve each exported route directly from its directory index; provide a real 404 document, with noindex metadata and no false 200 fallback.
- Use a consistent trailing-slash policy and canonical route builder.
- One configurable production origin and base path, normalized once. No preview host in public-production canonical URLs.
- GitHub project Pages base `/gonex-website/`, user/organization Pages base `/`, and custom domains must work without source edits.
- Canonical URLs, OG URLs, sitemap, RSS, manifest icons, internal navigation, search, asset URLs and 404 links all honor the base path exactly once.
- Current docs are self-canonical. Older versions keep their own canonical when content is intentionally version-specific. Don't canonicalize all docs to the homepage or every version to latest.

### Per-page head
- Unique, human-readable title and meta description; document lang=en, charset and viewport.
- Absolute canonical, Open Graph type/title/description/url/site_name/image, and Twitter summary_large_image equivalents.
- OG images are real 1200x630 raster assets with width/height and alt text. Article-specific presentation where feasible.
- Article metadata: datePublished/dateModified when grounded, author and appropriate article structured data.
- A stable theme-color, color-scheme, favicon, Apple touch icon and webmanifest. No empty verification tokens or fake social handles.
- Avoid obsolete keyword stuffing, duplicate head tags and unsupported SEO promises.

### Structured data
- Valid JSON-LD with absolute URLs and stable @id values.
- WebSite and SoftwareSourceCode on the appropriate page, using only verified attributes and repository URL. Do not invent reviews, ratings, offers or release versions.
- BreadcrumbList for docs and articles; TechArticle for technical docs and BlogPosting for articles where applicable.
- Escape JSON safely in scripts. Link the author to the supplied verified public identity when suitable.

### Metadata files
- `sitemap.xml` lists every canonical indexable page, including versioned docs and blog. Do not use an artificial current date as lastmod.
- `robots.txt` references the correct absolute sitemap and reflects the build's explicit indexing policy.
- Private preview stays non-indexable; production Pages workflow turns public indexing on after production SITE_URL/base are configured.
- `feed.xml` is valid escaped RSS with correct article URLs and real publication dates.
- `site.webmanifest` has correct name, short name, scope, start_url and working maskable/general icons as appropriate.
- `.nojekyll` in static output so GitHub Pages serves Nuxt's underscored assets.
- `llms.txt` may be included as optional developer discovery content; do not claim it improves Google rankings.

### Performance and accessibility
- Reserve image dimensions to prevent layout shift; mascot is optimized WebP, no remote image dependency.
- Lazy-load below-the-fold images; avoid lazy-loading the primary hero image.
- Fonts are local or use robust fallbacks, with no runtime font service dependency.
- Semantic header/nav/main/article/footer; one h1 per page; logical h2/h3 nesting; meaningful link text and image alt text.
- No forced script dependencies for reading docs. Search and theme enhance the static document.
- Measure or inspect available output; do not claim Lighthouse scores or field Core Web Vitals without actually measuring them.

## Deployment
- Commit package-lock and use npm ci in GitHub Actions.
- Use supported Node LTS, actions/checkout, setup-node, configure-pages, upload-pages-artifact and deploy-pages actions.
- Generate with NUXT_APP_BASE_URL from configure-pages output and SITE_URL from configured production origin. Enforce HTTPS origin with no path.
- Verify static output before uploading `.output/public`.
- Limit deployment token permissions to contents:read, pages:write, id-token:write; use github-pages environment and pages concurrency.
- Document Settings → Pages → GitHub Actions, custom domain changes, local dev, content editing, adding a docs version, regenerating social images, and production indexing.
- Private review publication and GitHub Pages are separate: do not claim the user's GitHub repository or Pages settings have changed without doing so.

## Acceptance checks
1. Dependency install completes and lockfile is present.
2. Nuxt typecheck succeeds; generation succeeds.
3. Static route audit verifies every content page exists and contains its real title/body, unique description and canonical.
4. Sitemap URLs correspond to exported HTML; robots/feed/manifest/icons exist and parse.
5. Check internal links and local assets, including all header/footer links and default-version routes.
6. Generate and verify both root `/` and project `/gonex-website/` builds, ensuring no doubled prefix or root-only assets.
7. Verify noindex policy in preview and index policy in production.
8. Validate heading count, JSON-LD parsing and OG image dimensions.
9. When supported browser automation exists, inspect desktop/mobile, theme, copy, navigation, search, version selection and direct links. If unavailable, state the limit and perform source/output validation.
10. Record actual results and remaining limitations in the README/handoff. No fabricated test results or SEO ranking guarantees.

## Deliverables and completion
- This full implementation prompt.
- Full editable source ZIP excluding node_modules, credentials, transient caches and .git; include lockfile, content, local assets, workflow and README.
- Private deployed review link with verified native deployment status.
- Concise handoff describing what works, what was tested, and what requires user-owned GitHub/domain configuration.
