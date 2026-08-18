<script setup lang="ts">
import type { ArticleImage } from '@/types/article'

defineProps<{
  image: ArticleImage
  isMain?: boolean
}>()

defineEmits<{
  delete: [image: ArticleImage]
}>()
</script>

<template>
  <div class="group relative bg-cream border-4 border-ink shadow-brutal overflow-hidden">
    <!-- Main image badge -->
    <div
      v-if="isMain"
      class="absolute top-0 left-0 z-10 bg-accent text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border-r-4 border-b-4 border-ink"
    >
      PRINCIPALE
    </div>

    <!-- Image container -->
    <div class="aspect-video w-full overflow-hidden bg-ink/5">
      <img
        :src="image.image_url"
        :alt="`Image article ${image.id}`"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <!-- Hover overlay — delete only -->
    <div
      class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
    >
      <button
        class="w-10 h-10 flex items-center justify-center bg-cream border-4 border-ink shadow-brutal-sm text-ink hover:bg-accent hover:text-white transition-colors hover:translate-x-[-2px] hover:translate-y-[-2px]"
        title="SUPPRIMER"
        @click.stop="$emit('delete', image)"
      >
        <span class="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
  </div>
</template>
