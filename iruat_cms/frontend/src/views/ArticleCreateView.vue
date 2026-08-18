<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticlesStore } from '@/stores/articles.store'
import { useTypesStore } from '@/stores/types.store'
import { useAuthStore } from '@/stores/auth.store'
import AdminLayout from '@/layouts/AdminLayout.vue'
import ArticleForm from '@/components/articles/ArticleForm.vue'

const router = useRouter()
const articlesStore = useArticlesStore()
const typesStore = useTypesStore()
const authStore = useAuthStore()

async function handleSubmit(data: { title: string; slug: string; content: string; type_id: string }) {
  if (!authStore.user) return

  const created = await articlesStore.createArticle({
    ...data,
    author_id: authStore.user.id,
  })

  if (created) {
    router.push(`/articles/${created.id}`)
  }
}

onMounted(() => {
  typesStore.fetchTypes()
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
        <li class="text-ink">CRÉER</li>
      </ol>
    </nav>

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="font-display text-3xl font-bold text-ink uppercase tracking-wider">
        CRÉER UN ARTICLE
      </h1>
      <p class="text-sm text-ink/50 font-medium mt-1">
        Rédigez un nouvel article
      </p>
    </div>

    <!-- Form card -->
    <div class="bg-cream border-4 border-ink shadow-brutal p-8">
      <ArticleForm
        mode="create"
        :loading="articlesStore.loading"
        @submit="handleSubmit"
      />
    </div>
  </AdminLayout>
</template>
