<script setup lang="ts">
const props = withDefaults(defineProps<{ code: string; filename?: string; language?: string }>(), { filename: '', language: 'sh' })
const copied = ref(false)
const failed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
async function copy() { try { await navigator.clipboard.writeText(props.code); copied.value = true; failed.value = false; timer = setTimeout(() => copied.value = false, 2000) } catch { failed.value = true } }
onBeforeUnmount(() => clearTimeout(timer))
</script>
<template><div class="code-block"><div class="code-bar"><span>{{ filename || language }}</span><UButton :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" size="xs" color="neutral" variant="ghost" :aria-label="copied ? 'Code copied' : 'Copy code'" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</UButton></div><pre><code>{{ code }}</code></pre><span v-if="failed" class="copy-failure" role="status">Select the code to copy it.</span><span class="sr-only" aria-live="polite">{{ copied ? 'Code copied to clipboard' : '' }}</span></div></template>
