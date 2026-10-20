<script setup lang="ts">
const props = defineProps<{ code?: string; filename?: string; language?: string; class?: string }>()
const copied = ref(false)
const message = ref('')
async function copy() { try { await navigator.clipboard.writeText(props.code || ''); copied.value = true; message.value = 'Code copied'; setTimeout(() => copied.value = false, 2000) } catch { message.value = 'Select the code to copy it.' } }
</script>
<template><div class="prose-code"><div class="code-bar"><span>{{ filename || language || 'Code' }}</span><UButton color="neutral" variant="ghost" size="xs" :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" aria-label="Copy code" @click="copy" /></div><pre :class="props.class"><slot /></pre><span class="sr-only" role="status">{{ message }}</span></div></template>
