import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const manifest = JSON.parse(await readFile('shared/content-manifest.json', 'utf8'))
const index = JSON.parse(await readFile('shared/search-index.json', 'utf8'))
const registry = JSON.parse(await readFile('shared/versions.json', 'utf8'))
const docs = manifest.filter(p => p.type === 'docs')
for (const version of registry.versions) {
  for (const section of ['build', 'contribute']) {
    const root = `/docs/${version.id}/${section === 'contribute' ? 'contribute/' : ''}`
    assert(docs.some(p => p.path === root && p.section === section), `Missing ${section} index: ${version.id}`)
  }
}
for (const p of docs) {
  assert(p.group && p.version && ['build', 'contribute'].includes(p.section), `Missing navigation metadata: ${p.path}`)
  assert.equal(p.path.includes('/contribute/'), p.section === 'contribute', `Section/path mismatch: ${p.path}`)
  assert(index.some(x => x.path === p.path && x.version === p.version && x.section === p.section), `Missing scoped search entry: ${p.path}`)
}
const examples = [
  ...['modules/users/service.go','modules/users/http/schemas.go','modules/users/http/handlers.go','modules/users/http/routes.go','modules/users/http/openapi.go','modules/users/module.go','modules/users/service_test.go'].map(file => ['content/docs/main/building-api.md', `examples/api/${file}`, 'go'])
]
for (const [guide, file, lang] of examples) {
  const text = await readFile(guide, 'utf8'), code = (await readFile(file, 'utf8')).trimEnd()
  assert(text.includes('```' + lang + '\n' + code + '\n```'), `Guide/source example drift: ${file}`)
}
console.log(`PASS: two docs audiences, version indexes, ${docs.length} scoped search entries and seven source-matched API example blocks.`)

for (const p of docs.filter(p => p.section === 'build')) {
  const source = await readFile(p.file, 'utf8')
  assert(!source.includes('git clone '), `Consumer docs must not require a clone: ${p.path}`)
  assert(!source.includes('html/template'), `Consumer docs must focus on APIs: ${p.path}`)
}
