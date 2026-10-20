<script setup lang="ts">
import { versions, github, websiteGithub } from '#shared/versions'
import manifest from '#shared/content-manifest.json'
import snapshot from '#shared/source-snapshot.json'
definePageMeta({ key: route => route.path })
const route = useRoute()
const path = route.path.replace(/\/$/, '')
const version = path.split('/')[2]!
const activeVersion = versions.find(v => v.id === version)
if (!activeVersion) throw createError({ statusCode: 404, statusMessage: 'Documentation version not found' })
const { data: page } = await useAsyncData(`docs-${path}`, () => queryCollection('docs').path(path).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Documentation page not found' })
const current = page.value
const section = current.section
const sectionTitle = section === 'contribute' ? 'Contribute to Gonex' : 'Build with Gonex'
const sectionRoot = `/docs/${version}/${section === 'contribute' ? 'contribute/' : ''}`
const currentEntry = manifest.find(p => p.path === path + '/')!
const docs = manifest.filter(p => p.type === 'docs' && p.version === version && p.section === section)
const currentIndex = docs.findIndex(p => p.path === path + '/')
const previous = docs[currentIndex - 1]
const next = docs[currentIndex + 1]
const categories = [...new Set(docs.map(p => p.group!))]
const sourceRef = activeVersion.sourceRef || snapshot.commit
const { absolute } = useSiteUrl()
usePageSeo({ title: `${current.title} — ${version} docs`, description: current.description, path: path + '/', type: 'article', breadcrumbs: [{ name: 'Home', path: '/' }, { name: sectionTitle, path: sectionRoot }, ...(path + '/' === sectionRoot ? [] : [{ name: current.title, path: path + '/' }])], schema: { '@type': 'TechArticle', headline: current.title, description: current.description, inLanguage: 'en', url: absolute(path + '/'), author: { '@type': 'Person', name: 'Amir Mohammad Kargar', url: 'https://github.com/amkargar' }, isPartOf: { '@type': 'WebSite', name: 'Gonex', url: absolute('/') } } })
const menu = ref(false)
const selectedVersion = ref(version)
async function changeVersion() {
  const slug = path.split('/').slice(3).join('/')
  const target = `/docs/${selectedVersion.value}/${slug ? slug + '/' : ''}`
  const sectionFallback = `/docs/${selectedVersion.value}/${section === 'contribute' ? 'contribute/' : ''}`
  await navigateTo(manifest.some(p => p.path === target) ? target : manifest.some(p => p.path === sectionFallback) ? sectionFallback : `/docs/${selectedVersion.value}/`)
}
const headings = current.body?.toc?.links || []
</script>
<template>
  <div class="docs-shell wrap" :data-docs-section="section">
    <div class="docs-mobile-bar"><UButton color="neutral" variant="outline" icon="i-lucide-panel-left" :aria-expanded="menu" aria-controls="docs-sidebar" @click="menu = !menu">{{ sectionTitle }}</UButton><span>{{ activeVersion.short }}</span></div>
    <aside id="docs-sidebar" class="docs-sidebar" :class="{ 'mobile-open': menu }">
      <label for="docs-version" class="sidebar-title">DOCUMENTATION</label>
      <select id="docs-version" v-model="selectedVersion" class="version-select" @change="changeVersion"><option v-for="v in versions" :key="v.id" :value="v.id">{{ v.label }}</option></select>
      <nav class="docs-section-picker" aria-label="Documentation sections">
        <NuxtLink :to="`/docs/${version}/`" :class="{ chosen: section === 'build' }" :aria-current="section === 'build' ? 'true' : undefined"><UIcon name="i-lucide-boxes" /><span><strong>Build with Gonex</strong><small>Install, create & deploy your app</small></span></NuxtLink>
        <NuxtLink :to="`/docs/${version}/contribute/`" :class="{ chosen: section === 'contribute' }" :aria-current="section === 'contribute' ? 'true' : undefined"><UIcon name="i-lucide-file-code" /><span><strong>Contribute to Gonex</strong><small>Develop the framework itself</small></span></NuxtLink>
      </nav>
      <AiPromptCopy :version="version" />
      <nav :aria-label="sectionTitle"><div v-for="group in categories" :key="group" class="sidebar-group"><span>{{ group }}</span><template v-for="item in docs" :key="item.path"><NuxtLink v-if="item.group === group" :to="item.path" :class="{ selected: item.path === path + '/' }" :aria-current="item.path === path + '/' ? 'page' : undefined">{{ item.title }}</NuxtLink></template></div></nav>
      <a :href="github" class="sidebar-github"><UIcon name="i-lucide-github" /> View framework source <UIcon name="i-lucide-arrow-up-right" /></a>
    </aside>
    <article class="docs-article">
      <div class="doc-breadcrumb"><NuxtLink :to="sectionRoot">{{ sectionTitle }}</NuxtLink><UIcon name="i-lucide-chevron-right" />{{ activeVersion.id }}<UIcon name="i-lucide-chevron-right" />{{ current.title }}</div>
      <div class="doc-notice"><UIcon name="i-lucide-git-branch" /><span>{{ activeVersion.released ? activeVersion.label + ' documentation' : 'Development snapshot · ' + activeVersion.id + ' · No release published yet.' }}</span></div>
      <div class="docs-track-label">{{ section === 'contribute' ? 'FOR FRAMEWORK CONTRIBUTORS' : 'FOR APPLICATION DEVELOPERS' }}</div>
      <h1>{{ current.title }}</h1><p class="doc-description">{{ current.description }}</p>
      <div class="prose-content"><ContentRenderer :value="current" /></div>
      <div class="doc-source"><a :href="`${websiteGithub}/edit/main/${currentEntry.file}`"><UIcon name="i-lucide-file-code" /> Edit this guide ↗</a><a v-if="current.source" :href="`${github}/blob/${sourceRef}/docs/${current.source}`">Framework reference ↗</a><span>Source snapshot {{ sourceRef.slice(0, 7) }}</span></div>
      <nav class="doc-pagination" :aria-label="`${sectionTitle} pages`"><NuxtLink v-if="previous" :to="previous.path"><span>← Previous</span><strong>{{ previous.title }}</strong></NuxtLink><NuxtLink v-if="next" :to="next.path"><span>Next →</span><strong>{{ next.title }}</strong></NuxtLink></nav>
    </article>
    <aside class="docs-toc"><span>ON THIS PAGE</span><nav aria-label="Table of contents"><a v-for="heading in headings" :key="heading.id" :href="`#${heading.id}`">{{ heading.text }}</a></nav><div class="toc-help"><strong>Something unclear?</strong><a :href="`${github}/issues/new`">Open an issue ↗</a><a :href="`${websiteGithub}/edit/main/${currentEntry.file}`">Improve this page ↗</a></div></aside>
  </div>
</template>
