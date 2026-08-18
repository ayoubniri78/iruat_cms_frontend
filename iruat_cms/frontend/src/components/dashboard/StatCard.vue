<script setup lang="ts">
defineProps<{
  title: string
  value: number | string
  icon: string
  accent?: boolean
}>()
</script>

<template>
  <div
    class="bg-cream border-4 border-ink p-6 shadow-brutal relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all cursor-default"
  >
    <!-- accent stripe if accent=true -->
    <div
      v-if="accent"
      class="absolute top-0 right-0 w-16 h-16 bg-accent/10 -rotate-12 translate-x-4 -translate-y-4"
    />
    <span class="material-symbols-outlined text-ink/40 text-[32px] mb-4 block">
      {{ icon }}
    </span>
    <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-1">
      {{ title }}
    </p>
    <p class="font-display text-3xl font-bold text-ink">
      {{ value }}
    </p>
  </div>
</template>
