# Documentation update — verification record

## Source and runtime

- Website changes start from commit `25789b80f81a8553a74a5a9addf07ca85096566a`.
- Gonex framework reviewed at `670c8c5f427ecd44e146836f7d45b2e3e0abd3ae`.
- Runtime: Node 24.19.0 and Go 1.27.1 on Linux/amd64.
- No framework release is assumed. A fresh consumer module successfully resolved `go get github.com/amkargar/gonex@670c8c5f427e` to `v0.0.0-20261019191310-670c8c5f427e` through normal Go module dependency resolution.

## Checks performed

- Nuxt TypeScript checking: PASS.
- Static root build, base `/`, preview noindex policy: PASS, 30 canonical content pages and 2,600 local links/assets.
- Static GitHub Pages build, base `/GoNex-website/`, public indexing policy: PASS, 30 canonical content pages and 2,600 local links/assets.
- Output checks: full prerendered article bodies, one h1 per content page, unique title/description, exact canonicals, social metadata, parseable JSON-LD, metadata files, sitemap membership, manifest scope and 404 noindex policy.
- Documentation check: two audience indexes per version, section/path consistency, scoped search metadata and four code blocks identical to their committed example files.
- Navigation check: audience marker, same-section pagination and internal heading anchors inspected in generated HTML. An old API-reference link was corrected to the upstream implementation record.
- Quick-start program: `go test ./...` passes in a fresh consumer module using the real pinned remote dependency. HTTP recorder assertions verify `/api/hello` and the generated OpenAPI operation.
- Website program: `go test ./...` passes with the same pinned remote dependency, without a local replace directive. Assertions verify server-rendered HTML, embedded CSS, typed JSON and the OpenAPI operation.
- CLI consumer path: compiled the reviewed CLI, generated a new app with the resolved pseudo-version, added the users module, resolved dependencies and passed `gonex check` (tests, vet and build). The temporary app was initialized as a Git repository for Go VCS stamping.
- `git diff --check`: PASS.

## What changed

Application developers enter **Build with Gonex**: install the dependency in their own project, register an endpoint, build an HTML website, connect a frontend and deploy a Go service. **Contribute to Gonex** contains fork/setup instructions, framework internals, testing, pull-request guidance and maintenance/release gates. Existing consumer guide URLs are retained.

## Limits

No browser automation is available here. No screenshot/interaction audit, axe accessibility report, Lighthouse score or field Core Web Vitals result is claimed. HTTP example checks use Go's in-process HTTP test recorder rather than a public server. The complete upstream framework test/platform/database matrix was not rerun; this update validates the consumer examples and website, not framework production support.
