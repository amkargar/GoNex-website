# Verification record

- Environment: Node **24.19.0**; npm lockfile included.
- Framework source reviewed: **670c8c5f427ecd44e146836f7d45b2e3e0abd3ae**.
- `npm run typecheck`: **PASS**, no TypeScript errors.
- Static root build, preview noindex policy: **PASS** — 20 canonical content pages and 1,586 local links/assets validated.
- GitHub project Pages build, origin `https://amkargar.github.io`, base `/gonex-website/`, public indexing policy: **PASS** — the same 20 canonical pages and 1,586 local links/assets validated.
- Static HTML includes real docs/article content, exactly one h1, unique title/description, expected canonical and social tags; JSON-LD parses.
- Metadata files: sitemap and RSS parsed with Python ElementTree; webmanifest parsed; 404/fallback noindex checked; `.nojekyll` present.
- Image dimensions checked with Pillow: OG **1200×630**, icons **192×192** / **512×512**, Apple icon **180×180**.
- Font paths are bundled by Vite and checked for project-base compatibility. Icons use a local client bundle with provider/network fallback disabled.
- Responsive layout rules inspected at source level for mobile/tablet/desktop, including a fluid mobile hero heading.

## Verification limits

Browser automation is not available in this environment. No browser-based screenshot review, click/keyboard interaction audit, axe accessibility report, Lighthouse score or field Core Web Vitals measurement is claimed. Static/source checks cannot prove those results.

The Go application itself was not compiled or run here. Its sample commands and outputs are taken from the reviewed upstream source and README, not from website test execution.

The public GitHub Pages workflow is provided; the source is now being published to the owner’s GoNex-website repository. Domain/DNS and Search Console verification were not changed. Private preview has noindex/nofollow, and public Pages builds explicitly enable indexing.
