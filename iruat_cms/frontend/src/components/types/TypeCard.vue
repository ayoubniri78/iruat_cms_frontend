<script setup lang="ts">
import type { CmsType } from '@/types/type'

defineProps<{
  type: CmsType
}>()

defineEmits<{
  edit: [type: CmsType]
  delete: [type: CmsType]
}>()

function getInitial(name: string): string {
  return (name?.[0] ?? 'T').toUpperCase()
}
</script>

<template>
  <div class="group flex items-center gap-3 sm:gap-4 py-4 px-3 sm:px-4 border-b-4 border-ink/10 last:border-b-0 hover:bg-cream transition-colors">
    <!-- Initial circle -->
    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-accent border-3 border-ink flex items-center justify-center flex-shrink-0 shadow-brutal-sm">
      <span class="font-display text-xs sm:text-sm font-bold text-white">
        {{ getInitial(type.name) }}
      </span>
    </div>

    <!-- Name -->
    <div class="flex-1 min-w-0">
      <p class="font-bold text-ink text-sm uppercase tracking-wider truncate">
        {{ type.name }}
      </p>
      <p v-if="type.created_at" class="text-[11px] text-ink/40 font-medium mt-0.5">
        Créé le {{ new Date(type.created_at).toLocaleDateString('fr-FR') }}
      </p>
    </div>

    <!-- Actions: always visible on mobile (sm+), hover on desktop -->
    <div class="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
      <button
        class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border-3 border-ink bg-white hover:bg-cream transition-colors shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
        title="Modifier"
        @click="$emit('edit', type)"
      >
        <span class="material-symbols-outlined text-[16px]">edit</span>
      </button>
      <button
        class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border-3 border-ink bg-white hover:bg-accent hover:text-white transition-colors shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
        title="Supprimer"
        @click="$emit('delete', type)"
      >
        <span class="material-symbols-outlined text-[16px]">delete</span>
      </button>
    </div>
  </div>
</template>
