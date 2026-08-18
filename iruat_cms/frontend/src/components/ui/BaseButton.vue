<script setup lang="ts">
defineProps<{
  loading?: boolean
  type?: 'submit' | 'button'
  variant?: 'primary' | 'secondary'
}>()
</script>

<template>
  <button
    :type="type ?? 'submit'"
    :disabled="loading"
    :class="[
      'w-full py-4 text-sm font-bold uppercase tracking-[0.2em] border-4 border-ink disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal',
      variant === 'secondary'
        ? 'bg-white text-ink hover:bg-ink hover:text-parchment'
        : 'bg-accent text-white hover:bg-accent-dark',
    ]"
  >
    <template v-if="loading">
      <span class="flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
        CHARGEMENT...
      </span>
    </template>
    <template v-else><slot /></template>
  </button>
</template>
