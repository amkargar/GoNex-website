<script setup lang="ts">
import index from '#shared/search-index.json'
const open = ref(false)
const query = ref('')
const route = useRoute()
const version = computed(() => route.path.split('/')[2] || 'main')
const results = computed(() => { const terms = query.value.toLowerCase().trim().split(/\s+/).filter(Boolean); return index.filter(p => p.path.startsWith(`/docs/${version.value}/`) || !route.path.startsWith('/docs/')).map(p => ({ ...p, score: terms.reduce((s, t) => s + (p.title.toLowerCase().includes(t) ? 10 : 0) + (p.text.toLowerCase().includes(t) ? 1 : 0), 0) })).filter(p => terms.every(t => (p.title + ' ' + p.text).toLowerCase().includes(t))).sort((a,b) => b.score-a.score).slice(0, 8) })
function keydown(e: KeyboardEvent) { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open.value = !open.value } }
onMounted(() => window.addEventListener('keydown', keydown))
onBeforeUnmount(() => window.removeEventListener('keydown', keydown))
watch(() => route.path, () => open.value = false)
</script>
<template><UModal v-model:open="open" title="Search Gonex documentation" description="Find guides, commands, and framework concepts."><button class="search-trigger" type="button" @click="open = true"><UIcon name="i-lucide-search" /><span>Search docs</span><kbd>⌘ K</kbd></button><template #body><label class="sr-only" for="docs-query">Search documentation</label><UInput id="docs-query" v-model="query" autofocus icon="i-lucide-search" placeholder="Search modules, HTTP, CLI…" class="w-full" size="lg" /><div class="search-results" aria-live="polite"><NuxtLink v-for="item in results" :key="item.path" :to="item.path" @click="open = false"><strong>{{ item.title }}</strong><span>{{ item.description }}</span><small>{{ item.path }}</small></NuxtLink><p v-if="!results.length">No results. Try “modules”, “HTTP” or “CLI”.</p></div></template></UModal></template>
