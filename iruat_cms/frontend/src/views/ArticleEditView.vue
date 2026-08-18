<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '@/stores/articles.store'
import { useTypesStore } from '@/stores/types.store'
import AdminLayout from '@/layouts/AdminLayout.vue'
import ArticleForm from '@/components/articles/ArticleForm.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()
const typesStore = useTypesStore()

const articleId = computed(() => route.params.id as string)
const article = computed(() => articlesStore.currentArticle)

async function handleSubmit(data: { title: string; slug: string; content: string; type_id: string }) {
  const updated = await articlesStore.updateArticle(articleId.value, data)
  if (updated) {
    router.push(`/articles/${articleId.value}`)
  }
}

onMounted(async () => {
  typesStore.fetchTypes()
  await articlesStore.fetchArticle(articleId.value)
})
</script>

<template>
  <AdminLayout>
    <!-- Breadcrumb -->
    <nav class="mb-6">
      <ol class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
        <li>
          <router-link to="/articles" class="text-ink/40 hover:text-accent transition-colors">
            ARTICLES
          </router-link>
        </li>
        <li class="text-ink/20">/</li>
        <li class="text-ink truncate max-w-[200px]">
          {{ article?.title ?? 'ARTICLE' }}
        </li>
        <li class="text-ink/20">/</li>
        <li class="text-ink">MODIFIER</li>
      </ol>
    </nav>

    <!-- Loading -->
    <div
      v-if="articlesStore.loading && !article"
      class="flex items-center justify-center py-20"
    >
      <div class="flex items-center gap-3 text-ink/50">
        <span class="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
        <span class="text-xs font-bold uppercase tracking-[0.2em]">CHARGEMENT...</span>
      </div>
    </div>

    <!-- Error -->
    <AlertMessage
      v-else-if="articlesStore.error && !article"
      type="error"
      :message="articlesStore.error"
    />

    <!-- Form -->
    <template v-else-if="article">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="font-display text-3xl font-bold text-ink uppercase tracking-wider">
          MODIFIER L'ARTICLE
        </h1>
        <p class="text-sm text-ink/50 font-medium mt-1">
          Modifier « {{ article.title }} »
        </p>
      </div>

      <!-- Form card -->
      <div class="bg-cream border-4 border-ink shadow-brutal p-8">
        <ArticleForm
          mode="edit"
          :initial-title="article.title"
          :initial-slug="article.slug"
          :initial-content="article.content"
          :initial-type-id="article.type_id"
          :loading="articlesStore.loading"
          :error="articlesStore.error"
          @submit="handleSubmit"
        />
      </div>
    </template>
  </AdminLayout>
</template>
