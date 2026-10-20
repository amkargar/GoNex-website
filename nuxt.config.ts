import pages from './shared/content-manifest.json'
import icons from './shared/icons.json'
const baseURL = ('/' + (process.env.NUXT_APP_BASE_URL || '/').replace(/^\/+|\/+$/g, '') + '/').replace(/\/+/g, '/')
const siteUrl = (process.env.SITE_URL || 'https://amkargar.github.io').replace(/\/$/, '')
if (new URL(siteUrl).pathname !== '/' || !siteUrl.startsWith('https://')) throw new Error('SITE_URL must be an HTTPS origin with no path')
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  ssr: true,
  devtools: { enabled: false },
  ui: { fonts: false },
  icon: { provider: 'none', serverBundle: false, clientBundle: { icons, scan: true } },
  colorMode: { preference: 'light', fallback: 'light', classSuffix: '' },
  app: { baseURL, head: { htmlAttrs: { lang: 'en' }, meta: [{ name: 'color-scheme', content: 'light dark' }] } },
  runtimeConfig: { public: { siteUrl, indexing: process.env.PUBLIC_INDEXING === 'true' } },
  content: { experimental: { sqliteConnector: 'native' }, build: { markdown: { highlight: { theme: { default: 'github-light', dark: 'github-dark' }, langs: ['go', 'sh', 'bash', 'html', 'css', 'vue', 'typescript', 'json', 'yaml', 'powershell', 'sql', 'proto', 'toml', 'diff'] } } } },
  nitro: { externals: { inline: [/shared\//] }, prerender: { crawlLinks: true, failOnError: true, routes: ['/', '/docs/', '/blog/', ...pages.map(p => p.path)] } },
  typescript: { strict: true }
})
