import { readFile, writeFile, mkdir } from 'node:fs/promises'
const pages = JSON.parse(await readFile(new URL('../shared/content-manifest.json', import.meta.url), 'utf8'))
const root = new URL('../public/', import.meta.url)
const origin = (process.env.SITE_URL || 'https://amkargar.github.io').replace(/\/$/, '')
if (!origin.startsWith('https://') || new URL(origin).pathname !== '/') throw Error('SITE_URL must be an HTTPS origin, without a path')
const base = ('/' + (process.env.NUXT_APP_BASE_URL || '/').replace(/^\/+|\/+$/g, '') + '/').replace(/\/+/g, '/')
const url = p => origin + base + p.replace(/^\//, '')
const indexing = process.env.PUBLIC_INDEXING === 'true'
const esc = s => String(s).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]))
const all = [{ path: '/' }, { path: '/blog/' }, ...pages]
await mkdir(root, { recursive: true })
await writeFile(new URL('sitemap.xml', root), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${all.map(p => `<url><loc>${esc(url(p.path))}</loc></url>`).join('\n')}</urlset>\n`)
await writeFile(new URL('robots.txt', root), `User-agent: *\n${indexing ? 'Allow: /' : 'Disallow: /'}\nSitemap: ${url('/sitemap.xml')}\n`)
await writeFile(new URL('feed.xml', root), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Gonex Journal</title><link>${esc(url('/blog/'))}</link><description>Notes on Gonex and modular Go applications.</description><language>en</language><atom:link href="${esc(url('/feed.xml'))}" rel="self" type="application/rss+xml"/>${pages.filter(p => p.type === 'blog').map(p => `<item><title>${esc(p.title)}</title><link>${esc(url(p.path))}</link><guid isPermaLink="true">${esc(url(p.path))}</guid><description>${esc(p.description)}</description><pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate></item>`).join('')}</channel></rss>`)
await writeFile(new URL('site.webmanifest', root), JSON.stringify({ name: 'Gonex — API-first Go Framework', short_name: 'Gonex', description: 'Typed APIs and explicit Go modules.', start_url: base, scope: base, display: 'standalone', background_color: '#f9f9f3', theme_color: '#f7d34c', icons: [{ src: base + 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: base + 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }] }, null, 2))
await writeFile(new URL('.nojekyll', root), '')
await writeFile(new URL('llms.txt', root), `# Gonex\n\n> A modular Go framework for typed HTTP APIs and explicit service boundaries.\n\nDevelopment snapshot: main branch; no published release yet.\n\n## Documentation\n${pages.filter(p => p.type === 'docs').map(p => `- [${p.title}](${url(p.path)}): ${p.description}`).join('\n')}\n\n## Source\n- https://github.com/amkargar/gonex\n`)
console.log(`Generated sitemap (${all.length} URLs), robots (${indexing ? 'indexable' : 'private preview'}), RSS, manifest and llms.txt at ${url('/')}`)
