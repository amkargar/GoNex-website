import { readFile, readdir, writeFile } from 'node:fs/promises'
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
