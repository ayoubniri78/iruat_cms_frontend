<script setup lang="ts">
import type { ArticleImage } from '@/types/article'
import ImageCard from '@/components/images/ImageCard.vue'

defineProps<{
  images: ArticleImage[]
  loading?: boolean
}>()

defineEmits<{
  delete: [image: ArticleImage]
}>()

function getMainImageId(images: ArticleImage[]): string | null {
  const main = images.find((img) => img.is_main)
  return main?.id ?? null
}
</script>

<template>
  <div>
    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="grid grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="aspect-video bg-ink/5 border-4 border-ink/10 animate-pulse"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="images.length === 0"
      class="bg-cream border-4 border-dashed border-ink/20 p-12 text-center"
    >
      <span class="material-symbols-outlined text-ink/15 text-[64px] block mb-4">image</span>
      <p class="font-display text-sm font-bold text-ink/30 uppercase tracking-[0.2em]">
        AUCUNE IMAGE
      </p>
      <p class="text-xs text-ink/25 mt-1">
        Uploadez une image pour commencer
      </p>
    </div>

    <!-- Image grid -->
    <div
      v-else
      class="grid grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <ImageCard
        v-for="image in images"
        :key="image.id"
        :image="image"
        :is-main="getMainImageId(images) === image.id"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>
