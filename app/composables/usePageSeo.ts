export function useSiteUrl() {
  const config = useRuntimeConfig()
  const appBase = useRuntimeConfig().app.baseURL
  const asset = (path: string) => appBase + path.replace(/^\//, '')
  const absolute = (path: string) => String(config.public.siteUrl).replace(/\/$/, '') + asset(path)
  return { asset, absolute }
}
export function usePageSeo(data: { title: string; description: string; path: string; type?: 'website' | 'article'; schema?: Record<string, unknown>; breadcrumbs?: { name: string; path: string }[] }) {
  const { absolute, asset } = useSiteUrl()
  const title = data.title === 'Gonex — A modular Go framework' ? data.title : `${data.title} · Gonex`
  const image = absolute('/og/gonex.png')
  useSeoMeta({ title, description: data.description, robots: useRuntimeConfig().public.indexing ? 'index, follow, max-image-preview:large' : 'noindex, nofollow', ogTitle: title, ogDescription: data.description, ogType: data.type || 'website', ogUrl: absolute(data.path), ogSiteName: 'Gonex', ogLocale: 'en_US', ogImage: image, ogImageWidth: 1200, ogImageHeight: 630, ogImageAlt: 'Gonex — A modular Go framework. Less wiring. More building.', twitterCard: 'summary_large_image', twitterTitle: title, twitterDescription: data.description, twitterImage: image, twitterImageAlt: 'Gonex modular Go framework', themeColor: '#f8f8f2' })
  const schemas: Record<string, unknown>[] = []
  if (data.schema) schemas.push({ '@context': 'https://schema.org', ...data.schema })
  if (data.breadcrumbs) schemas.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: data.breadcrumbs.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: absolute(x.path) })) })
  useHead({ link: [{ rel: 'canonical', href: absolute(data.path) }, { rel: 'icon', type: 'image/x-icon', href: asset('/favicon.ico?v=2') }, { rel: 'icon', type: 'image/png', sizes: '32x32', href: asset('/favicon-32x32.png') }, { rel: 'icon', type: 'image/png', sizes: '16x16', href: asset('/favicon-16x16.png') }, { rel: 'apple-touch-icon', sizes: '180x180', href: asset('/apple-touch-icon.png?v=2') }, { rel: 'manifest', href: asset('/site.webmanifest') }, { rel: 'alternate', type: 'application/rss+xml', title: 'Gonex Journal', href: asset('/feed.xml') }], script: schemas.map((s, i) => ({ key: `schema-${i}`, type: 'application/ld+json', innerHTML: JSON.stringify(s).replace(/</g, '\\u003c') })) })
}
