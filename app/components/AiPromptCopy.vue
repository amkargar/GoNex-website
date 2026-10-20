<script setup lang="ts">
const props = defineProps<{ version: string }>()
const { asset } = useSiteUrl()
const loading = ref(false)
const copied = ref(false)
const prompt = ref('')
const error = ref('')
const manualCopy = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(resetTimer))
watch(() => props.version, () => {
  prompt.value = ''
  copied.value = false
  error.value = ''
  manualCopy.value = false
})
async function copyPrompt() {
  loading.value = true
  copied.value = false
  error.value = ''
  manualCopy.value = false
  try {
    if (!prompt.value) prompt.value = await $fetch<string>(asset(`/ai/${props.version}.txt`), { responseType: 'text' })
    try {
      await navigator.clipboard.writeText(prompt.value)
      copied.value = true
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => { copied.value = false }, 3000)
    } catch {
      manualCopy.value = true
      error.value = 'Clipboard unavailable. Select and copy the prompt below.'
    }
  } catch {
    error.value = 'Could not load the prompt. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="ai-prompt">
    <UButton type="button" color="neutral" variant="outline" size="sm" :loading="loading" :disabled="loading" :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" @click="copyPrompt">{{ copied ? 'Prompt copied!' : 'Copy prompt for AI' }}</UButton>
    <p class="ai-hint">Paste into your AI to build a Gonex REST backend.</p>
    <span class="ai-status" role="status" aria-live="polite">{{ copied ? 'Prompt copied to clipboard.' : error }}</span>
    <details v-if="prompt" :open="manualCopy">
      <summary>View prompt</summary>
      <textarea :value="prompt" readonly aria-label="Gonex REST backend prompt for AI" spellcheck="false" @focus="($event.target as HTMLTextAreaElement).select()" />
      <a :href="asset(`/ai/${version}.txt`)" target="_blank" rel="noopener">Open full prompt ↗</a>
    </details>
  </div>
</template>

<style scoped>
.ai-prompt{min-width:0;margin:6px 0 16px;padding:0 8px}
.ai-prompt :deep(button){width:100%;justify-content:center;min-height:44px;white-space:normal}
.ai-hint,.ai-status{font-size:11px;line-height:1.6;color:var(--soft);overflow-wrap:anywhere}
.ai-hint{margin-top:7px}
.ai-status:empty{display:none}
details{margin-top:8px;font-size:11px;color:var(--soft)}
summary{cursor:pointer}
textarea{display:block;box-sizing:border-box;width:100%;min-width:0;height:200px;margin:8px 0;padding:8px;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--ink);font:11px/1.6 var(--font-mono);resize:vertical}
a{text-decoration:underline;text-underline-offset:3px}
</style>
