<script setup lang="ts">
definePageMeta({ key: route => route.path })
import { versions, github } from '#shared/versions'
import manifest from '#shared/content-manifest.json'
import snapshot from '#shared/source-snapshot.json'
const route = useRoute()
const path = route.path.replace(/\/$/, '')
const version = computed(() => path.split('/')[2])
if (!versions.some(v => v.id === version.value)) throw createError({ statusCode: 404, statusMessage: 'Documentation version not found' })
const { data: page } = await useAsyncData(`docs-${path}`, () => queryCollection('docs').path(path).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Documentation page not found' })
const current = page.value
const { absolute } = useSiteUrl()
usePageSeo({ title: `${current.title} — ${version.value} docs`, description: current.description, path: path + '/', type: 'article', breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Documentation', path: `/docs/${version.value}/` }, ...(path === `/docs/${version.value}` ? [] : [{ name: current.title, path: path + '/' }])], schema: { '@type': 'TechArticle', headline: current.title, description: current.description, inLanguage: 'en', url: absolute(path + '/'), author: { '@type': 'Person', name: 'Amir Mohammad Kargar', url: 'https://github.com/amkargar' }, isPartOf: { '@type': 'WebSite', name: 'Gonex', url: absolute('/') } } })
const docs = manifest.filter(p => p.type === 'docs' && p.path.startsWith(`/docs/${version.value}/`))
const currentIndex = docs.findIndex(p => p.path === path + '/')
const previous = docs[currentIndex - 1]
const next = docs[currentIndex + 1]
const activeVersion = versions.find(v => v.id === version.value)!
const sourceRef = activeVersion.sourceRef || snapshot.commit
const menu = ref(false)
const selectedVersion = ref(version.value)
async function changeVersion() { const slug = path.split('/').slice(3).join('/'); const target = `/docs/${selectedVersion.value}/${slug ? slug + '/' : ''}`; await navigateTo(manifest.some(p => p.path === target) ? target : `/docs/${selectedVersion.value}/`) }
const headings = computed(() => current.body?.toc?.links || [])
const categories = [{ label: 'GETTING STARTED', slugs: ['index', 'installation', 'quick-start'] }, { label: 'BUILD', slugs: ['modules', 'http', 'cli', 'architecture', 'versioning', 'database', 'grpc', 'microservices'] }, { label: 'OPERATE & MAINTAIN', slugs: ['operations', 'security', 'api-reference', 'upgrades', 'release'] }]
function slugOf(p: { path: string }) { return p.path.split('/').filter(Boolean)[2] || 'index' }
</script>
<template><div class="docs-shell wrap"><div class="docs-mobile-bar"><UButton color="neutral" variant="outline" icon="i-lucide-panel-left" :aria-expanded="menu" aria-controls="docs-sidebar" @click="menu = !menu">Documentation menu</UButton><span>{{ activeVersion.short }}</span></div><aside id="docs-sidebar" class="docs-sidebar" :class="{ 'mobile-open': menu }"><label for="docs-version" class="sidebar-title">DOCUMENTATION</label><select id="docs-version" v-model="selectedVersion" class="version-select" @change="changeVersion"><option v-for="v in versions" :key="v.id" :value="v.id">{{ v.label }}</option></select><nav aria-label="Documentation"><div v-for="group in categories" :key="group.label" class="sidebar-group"><span>{{ group.label }}</span><template v-for="item in docs" :key="item.path"><NuxtLink v-if="group.slugs.includes(slugOf(item))" :to="item.path" :class="{ selected: item.path === path + '/' }">{{ item.title }}</NuxtLink></template></div></nav><a :href="github" class="sidebar-github"><UIcon name="i-lucide-github" /> View source code <UIcon name="i-lucide-arrow-up-right" /></a></aside><article class="docs-article"><div class="doc-breadcrumb">Docs <UIcon name="i-lucide-chevron-right" /> {{ activeVersion.id }} <UIcon name="i-lucide-chevron-right" /> {{ current.title }}</div><div class="doc-notice"><UIcon name="i-lucide-git-branch" /><span>{{ activeVersion.released ? activeVersion.label + ' documentation' : 'Development documentation · ' + activeVersion.id + ' branch · No release published yet.' }}</span></div><h1>{{ current.title }}</h1><p class="doc-description">{{ current.description }}</p><div class="prose-content"><ContentRenderer :value="current" /></div><div class="doc-source"><a :href="`${github}/blob/${sourceRef}/docs/${current.source}`"><UIcon name="i-lucide-file-code" /> Upstream source ↗</a><span>Snapshot {{ sourceRef.slice(0, 7) }}</span></div><nav class="doc-pagination" aria-label="Documentation pages"><NuxtLink v-if="previous" :to="previous.path"><span>← Previous</span><strong>{{ previous.title }}</strong></NuxtLink><NuxtLink v-if="next" :to="next.path"><span>Next →</span><strong>{{ next.title }}</strong></NuxtLink></nav></article><aside class="docs-toc"><span>ON THIS PAGE</span><nav aria-label="Table of contents"><a v-for="heading in headings" :key="heading.id" :href="`#${heading.id}`">{{ heading.text }}</a></nav><div class="toc-help"><strong>Something unclear?</strong><a :href="`${github}/issues/new`">Open an issue ↗</a><a :href="`${github}/edit/${activeVersion.id}/docs/${current.source}`">Improve this page ↗</a></div></aside></div></template>
