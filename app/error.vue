<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()
useSeoMeta({ title: 'Page not found · Gonex', robots: 'noindex, nofollow' })
</script>
<template><UApp><div class="error-page"><span class="eyebrow">{{ error.statusCode || 404 }} / GONEX</span><h1>This route takes a detour.</h1><p>The page may have moved, or this documentation version may not exist.</p><UButton to="/" color="primary" icon="i-lucide-arrow-left" @click="clearError()">Back to Gonex</UButton></div></UApp></template>
