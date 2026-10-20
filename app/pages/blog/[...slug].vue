<script setup lang="ts">
definePageMeta({ key: route => route.path })
import { defaultVersion } from '#shared/versions'
const route = useRoute()
const path = route.path.replace(/\/$/, '')
const { data: page } = await useAsyncData(`blog-${path}`, () => queryCollection('blog').path(path).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Article not found' })
const current = page.value
const { absolute } = useSiteUrl()
usePageSeo({ title: current.title, description: current.description, path: path + '/', type: 'article', breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Journal', path: '/blog/' }, { name: current.title, path: path + '/' }], schema: { '@type': 'BlogPosting', headline: current.title, description: current.description, datePublished: current.date, author: { '@type': 'Person', name: current.author, url: 'https://github.com/amkargar' }, image: absolute('/og/gonex.png'), mainEntityOfPage: absolute(path + '/') } })
useSeoMeta({ articlePublishedTime: current.date, articleAuthor: [current.author] })
</script>
<template><article class="blog-article wrap"><NuxtLink to="/blog/" class="text-link">← Back to the journal</NuxtLink><div class="article-meta">{{ current.category }} · <time :datetime="current.date">{{ new Date(current.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) }}</time> · {{ current.readingTime }} min read</div><h1>{{ current.title }}</h1><p class="doc-description">{{ current.description }}</p><div class="article-author"><span class="author-initials">AK</span><div><strong>{{ current.author }}</strong><span>Gonex creator</span></div></div><nav class="article-toc" aria-label="Article table of contents"><a v-for="heading in current.body?.toc?.links" :key="heading.id" :href="`#${heading.id}`">{{ heading.text }}</a></nav><div class="prose-content"><ContentRenderer :value="current" /></div><div class="article-end"><span>Keep exploring.</span><UButton :to="`/docs/${defaultVersion}/quick-start/`" trailing-icon="i-lucide-arrow-right">Get Started with Gonex</UButton></div></article></template>
