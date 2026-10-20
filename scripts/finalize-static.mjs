import { writeFile, readFile, mkdir } from 'node:fs/promises'
const { defaultVersion } = JSON.parse(await readFile('shared/versions.json', 'utf8'))
const base = ('/' + (process.env.NUXT_APP_BASE_URL || '/').replace(/^\/+|\/+$/g, '') + '/').replace(/\/+/g, '/')
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found · Gonex</title><meta name="robots" content="noindex, nofollow"><meta name="description" content="This Gonex page could not be found."><meta name="color-scheme" content="light dark"><link rel="icon" href="${base}favicon.ico?v=2"><style>body{font-family:system-ui,sans-serif;background:#f9f9f3;color:#252820;margin:0}main{max-width:650px;margin:15vh auto;padding:30px}small{letter-spacing:2px;color:#6d7066}h1{font-size:clamp(32px,6vw,52px);letter-spacing:-2px;line-height:1.1}p{line-height:1.8;color:#6d7066}a{display:inline-block;color:#252820;background:#f7d34c;border-radius:8px;padding:13px 20px;text-decoration:none;margin:15px 10px 0 0}a:last-child{background:#e9eadf}@media(prefers-color-scheme:dark){body{background:#171a17;color:#f1f3e9}p,small{color:#adb5a5}}</style></head><body><main><small>404 / GONEX</small><h1>This route takes a detour.</h1><p>The page may have moved, or this documentation version may not exist.</p><a href="${base}">Back to Gonex</a><a href="${base}docs/${defaultVersion}/">Documentation</a></main></body></html>`
await writeFile('.output/public/404.html', html)
// Nuxt's SPA fallback is useful on some static hosts, but must never be indexed.
const fallback=await readFile('.output/public/200.html','utf8').catch(()=>null)
if(fallback) await writeFile('.output/public/200.html',fallback.replace('<head>','<head><meta name="robots" content="noindex, nofollow">'))
console.log('Finalized static 404 and noindex fallback.')

// Retain the old tutorial URL as a static redirect; GitHub Pages has no server redirects.
const movedPath = `docs/${defaultVersion}/building-websites/`
const target = `${base}docs/${defaultVersion}/building-api/`
const origin = (process.env.SITE_URL || 'https://amkargar.github.io').replace(/\/$/, '')
await mkdir(`.output/public/${movedPath}`, { recursive: true })
await writeFile(`.output/public/${movedPath}index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Build a REST API · Gonex</title><meta name="robots" content="noindex, follow"><link rel="canonical" href="${origin}${target}"><meta http-equiv="refresh" content="0;url=${target}"></head><body><p>This guide moved to <a href="${target}">Build a REST API</a>.</p></body></html>`)
