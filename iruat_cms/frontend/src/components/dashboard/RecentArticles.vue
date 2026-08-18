<script setup lang="ts">
import type { Article } from '@/types/article'

defineProps<{
  articles: Article[]
}>()

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="bg-cream border-4 border-ink shadow-brutal">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b-4 border-ink">
      <h2 class="text-xs font-bold uppercase tracking-[0.2em] text-ink">
        ARTICLES RÉCENTS
      </h2>
      <router-link
        to="/articles"
        class="text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:text-accent-dark transition-colors"
      >
        VOIR TOUT →
      </router-link>
    </div>

    <!-- Empty state -->
    <div
      v-if="articles.length === 0"
      class="flex flex-col items-center justify-center py-12 sm:py-16 px-6"
    >
      <span class="material-symbols-outlined text-ink/20 text-[36px] sm:text-[48px] mb-4">
        description
      </span>
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-ink/40 text-center">
        Aucun article pour le moment
      </p>
    </div>

    <!-- Article rows -->
    <div v-else>
      <router-link
        v-for="article in articles"
        :key="article.id"
        :to="`/articles/${article.id}`"
        class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-ink/10 last:border-b-0 hover:bg-parchment/60 transition-colors group"
      >
        <div class="min-w-0 flex-1">
          <p class="font-display text-xs sm:text-sm font-bold text-ink truncate">
            {{ article.title }}
          </p>
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 mt-1">
            {{ article.created_at ? formatDate(article.created_at) : '' }}
          </p>
        </div>
        <span
          class="ml-3 sm:ml-4 shrink-0 px-2 sm:px-3 py-1 border-2 border-ink/20 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 bg-parchment"
        >
          {{ article.type_id.slice(0, 8) }}
        </span>
      </router-link>
    </div>
  </div>
</template>
