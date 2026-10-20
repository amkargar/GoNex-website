import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'
const records = [], search = []
async function walk(dir) {
  for (const file of await readdir(dir, { withFileTypes: true })) {
    const name = path.join(dir, file.name)
    if (file.isDirectory()) { await walk(name); continue }
    if (!name.endsWith('.md')) continue
    const raw = await readFile(name, 'utf8')
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
    if (!match) throw Error(`Missing frontmatter: ${name}`)
    const data = parse(match[1])
    if (!data.title || !data.description) throw Error(`Missing SEO title/description: ${name}`)
    const normalized = path.relative('content', name).split(path.sep).join('/')
    const relative = normalized.replace(/\.md$/, '').replace(/\/index$/, '')
    const route = '/' + relative + '/'
    const type = relative.startsWith('docs/') ? 'docs' : 'blog'
    const docMeta = type === 'docs' ? { version: data.version, section: data.section, group: data.group } : {}
    if (type === 'docs') {
      if (!['build', 'contribute'].includes(data.section) || !data.group || !data.version) throw Error(`Missing docs audience/group/version: ${name}`)
      if (route.includes('/contribute/') !== (data.section === 'contribute')) throw Error(`Docs section/path mismatch: ${name}`)
    }
    records.push({ path: route, title: data.title, description: data.description, type, order: data.order ?? 0, file: 'content/' + normalized, ...docMeta, ...(type === 'blog' ? { date: data.date, category: data.category, readingTime: data.readingTime } : {}) })
    if (type === 'docs') search.push({ path: route, title: data.title, description: data.description, ...docMeta, text: match[2].replace(/[`#*\[\]{}]/g, '') })
  }
}
await walk('content')
records.sort((a, b) => a.type.localeCompare(b.type) || (a.section || '').localeCompare(b.section || '') || a.order - b.order || a.path.localeCompare(b.path))
await writeFile('shared/content-manifest.json', JSON.stringify(records, null, 2) + '\n')
await writeFile('shared/search-index.json', JSON.stringify(search) + '\n')
console.log(`Synced ${records.length} content routes and ${search.length} search documents across two docs sections.`)

// Build a self-contained prompt from the same versioned guides as the website.
const aiRoot = new URL('../public/ai/', import.meta.url)
await mkdir(aiRoot, { recursive: true })
for (const version of [...new Set(records.filter(p => p.type === 'docs' && p.section === 'build').map(p => p.version))]) {
  if (!/^[a-zA-Z0-9._-]+$/.test(version)) throw Error('Invalid AI prompt version')
  const guides = []
  for (const slug of ['quick-start', 'building-api', 'debug', 'cli', 'database', 'security', 'deployment']) {
    const entry = records.find(p => p.path === `/docs/${version}/${slug}/`)
    if (!entry) throw Error(`Missing AI reference guide: ${version}/${slug}`)
    const raw = await readFile(entry.file, 'utf8')
    const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    guides.push(`# Reference: ${entry.title}\nSource: https://amkargar.github.io/GoNex-website${entry.path}\n\n${body}`)
  }
  const instructions = `You are helping me implement a runnable REST backend with Gonex.

MY APP REQUIREMENTS
[Replace this line with your app idea, resources, business rules, database and authentication needs.]

FRAMEWORK CONTEXT
Gonex (github.com/amkargar/gonex) is an API-first, modular Go framework with typed HTTP endpoints, Gin routing, validation, OpenAPI 3.1 and structured logs. GORM/database adapters and gRPC are optional. Business services stay plain Go; adapters handle HTTP and persistence. This is documentation version "${version}", a development snapshot, so do not assume a stable release or invent APIs.

HOW TO WORK
1. Read my requirements and inspect any existing project before changing it. Ask only about missing decisions that materially affect the app; otherwise state reasonable assumptions.
2. Use the embedded guides below as the concrete API reference. If browsing/tools are available, check the matching current docs and framework source before choosing the dependency pin, Go minimum or CLI flags. Preserve an existing app's compatible pin. Never invent a framework method; if you cannot verify an API, say what needs checking.
3. For a new app, use gonex new with my own module path, then the project-local go tool gonex commands. Keep the generated entrypoint, config, .gonex.json and registries. Do not clone or modify the framework to create an application.
4. Default to a single HTTP app. Add gRPC, HTTP versioning or microservices only when required. The CLI's generated module is a starter endpoint, not automatic CRUD. Implement the requested resource actions explicitly.
5. Put business behavior in modules/<resource>/service.go; HTTP DTOs and validation in http/schemas.go; mapping in http/handlers.go; typed endpoint contracts in http/routes.go; descriptions in http/openapi.go; explicit construction/wiring in module.go. Adapt the references' example.com/shop imports to my module path.
6. Use transport.Routes with Get/Post/etc. and typed handler methods, following the REST guide. Request/response types are inferred; use .Name for each OpenAPI operation ID. The lower-level Endpoint/Register API remains supported. Declare methods, paths, operation IDs, success statuses and domain errors so runtime responses and OpenAPI agree. Keep domain entities separate from HTTP DTOs and database models; avoid import cycles.
7. Add persistence, migrations, authentication, authorization, pagination and update/delete behavior when my requirements need them. Use the database and security guides for supported mechanisms; do not claim that the in-memory example is durable or already authenticated. Read secrets from environment/configuration and validate access per resource.
8. Preserve graceful shutdown, request IDs, structured logging and /healthz and /openapi.json behavior from the generated app. Do not log passwords, tokens or request bodies.
9. Deliver working code with actual file paths and setup/run instructions. Replace starter tests if their methods change. Run gofmt, go mod tidy, go tool gonex check and go test ./... where tools are available; test success, invalid input, not found, conflicts and authorization where relevant. Report exactly what ran and any remaining blockers.
10. For local browser diagnostics, use DEBUG=true explicitly. Debug defaults off; use DEBUG=false on public deployments. The root welcome page is a fallback and never replaces application routes. JSON clients retain their API error contracts. Build executable targets with go tool gonex build --os OS --arch ARCH [--out FILE], which uses go build underneath.
11. Include example requests/responses, required environment variables, database/migration steps, the actual server/OpenAPI URLs and a deployment checklist based on the deployment guide. Clearly label assumptions and unfinished work.

Documentation: https://amkargar.github.io/GoNex-website/docs/${version}/
Source: https://github.com/amkargar/gonex
Working REST example: https://github.com/amkargar/GoNex-website/tree/main/examples/api

The following reference material is included so you can use this prompt even without browsing. It describes the website's pinned snapshot; newer releases may differ.

`
  await writeFile(new URL(`${version}.txt`, aiRoot), instructions + guides.join('\n\n---\n\n'))
}
