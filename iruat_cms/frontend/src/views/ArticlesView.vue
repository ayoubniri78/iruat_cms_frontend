<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticlesStore } from '@/stores/articles.store'
import AdminLayout from '@/layouts/AdminLayout.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'

const articlesStore = useArticlesStore()

const searchQuery = ref('')
const showDeleteModal = ref(false)
const deletingArticleId = ref('')
const deletingArticleTitle = ref('')

const filteredArticles = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return articlesStore.articles
  return articlesStore.articles.filter((a) =>
    a.title.toLowerCase().includes(q)
  )
})

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function openDeleteModal(article: { id: string; title: string }) {
  deletingArticleId.value = article.id
  deletingArticleTitle.value = article.title
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deletingArticleId.value = ''
  deletingArticleTitle.value = ''
}

async function handleDelete() {
  if (!deletingArticleId.value) return
  await articlesStore.deleteArticle(deletingArticleId.value)
  closeDeleteModal()
}

onMounted(() => {
  articlesStore.fetchArticles()
})
</script>

<template>
  <AdminLayout>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display text-3xl font-bold text-ink uppercase tracking-wider">
          ARTICLES
        </h1>
        <p class="text-sm text-ink/50 font-medium mt-1">
          Gérer et publier votre contenu
        </p>
      </div>
      <router-link
        to="/articles/create"
        class="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] border-4 border-ink bg-accent text-white hover:bg-accent-dark transition-colors shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px]"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        NOUVEL ARTICLE
      </router-link>
    </div>

    <!-- Global error -->
    <AlertMessage
      v-if="articlesStore.error && !showDeleteModal"
      type="error"
      :message="articlesStore.error"
    />

    <!-- Loading -->
    <div
      v-if="articlesStore.loading && articlesStore.articles.length === 0"
      class="flex items-center justify-center py-20"
    >
      <div class="flex items-center gap-3 text-ink/50">
        <span class="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
        <span class="text-sm font-bold uppercase tracking-widest">CHARGEMENT...</span>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!articlesStore.loading && articlesStore.articles.length === 0"
      class="bg-cream border-4 border-ink shadow-brutal p-12 text-center"
    >
      <div class="w-20 h-20 mx-auto bg-parchment border-4 border-ink flex items-center justify-center mb-6 shadow-brutal-sm">
        <span class="material-symbols-outlined text-[36px] text-ink/30">description</span>
      </div>
      <h2 class="font-display text-xl font-bold text-ink uppercase tracking-wider mb-2">
        AUCUN ARTICLE
      </h2>
      <p class="text-sm text-ink/50 font-medium mb-6">
        Créez votre premier article pour commencer.
      </p>
      <router-link
        to="/articles/create"
        class="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] border-4 border-ink bg-accent text-white hover:bg-accent-dark transition-colors shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px]"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        CRÉER UN ARTICLE
      </router-link>
    </div>

    <!-- Articles table -->
    <div v-else>
      <!-- Search bar -->
      <div class="mb-6">
        <div class="relative max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-[18px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par titre..."
            class="w-full pl-10 pr-4 py-3 bg-cream border-4 border-ink text-sm font-bold placeholder:text-ink/30 focus:outline-none focus:shadow-brutal-sm focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all"
          />
        </div>
      </div>

      <!-- Loading overlay -->
      <div
        v-if="articlesStore.loading"
        class="relative bg-cream border-4 border-ink shadow-brutal"
      >
        <div class="absolute inset-0 bg-cream/80 flex items-center justify-center z-10">
          <span class="material-symbols-outlined text-[24px] animate-spin text-accent">progress_activity</span>
        </div>
        <div class="p-8 text-center text-ink/30">
          <span class="text-sm font-bold uppercase tracking-widest">CHARGEMENT...</span>
        </div>
      </div>

      <!-- Table -->
      <div
        v-else-if="filteredArticles.length > 0"
        class="bg-cream border-4 border-ink shadow-brutal"
      >
        <!-- Table header -->
        <div class="px-6 py-3 border-b-4 border-ink bg-parchment">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
            {{ filteredArticles.length }} ARTICLE{{ filteredArticles.length > 1 ? 'S' : '' }}
          </p>
        </div>

        <!-- Desktop rows -->
        <div class="hidden md:block">
          <div
            v-for="article in filteredArticles"
            :key="article.id"
            class="flex items-center gap-4 px-6 py-4 border-b-2 border-ink/10 last:border-b-0 hover:bg-parchment/50 transition-colors group"
          >
            <!-- Thumbnail placeholder -->
            <div class="w-10 h-10 bg-ink/5 border-2 border-ink/20 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-[18px] text-ink/20">add_a_photo</span>
            </div>

            <!-- Title -->
            <div class="flex-1 min-w-0">
              <router-link
                :to="`/articles/${article.id}`"
                class="font-display text-sm font-bold text-ink hover:text-accent transition-colors truncate block"
              >
                {{ article.title }}
              </router-link>
              <p class="text-xs text-ink/40 mt-1 truncate">
                {{ article.slug }}
              </p>
            </div>

            <!-- Type badge -->
            <div class="flex-shrink-0">
              <span
                v-if="article.type"
                class="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-ink bg-parchment"
              >
                {{ article.type.name }}
              </span>
              <span
                v-else
                class="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-ink/20 text-ink/30"
              >
                SANS TYPE
              </span>
            </div>

            <!-- Date -->
            <div class="flex-shrink-0 w-28">
              <p class="text-xs text-ink/40 font-medium">
                {{ formatDate(article.created_at) }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <router-link
                :to="`/articles/${article.id}`"
                class="w-9 h-9 flex items-center justify-center border-2 border-ink text-ink hover:bg-ink hover:text-parchment transition-colors"
                title="Voir"
              >
                <span class="material-symbols-outlined text-[16px]">visibility</span>
              </router-link>
              <router-link
                :to="`/articles/${article.id}/edit`"
                class="w-9 h-9 flex items-center justify-center border-2 border-ink text-ink hover:bg-ink hover:text-parchment transition-colors"
                title="Modifier"
              >
                <span class="material-symbols-outlined text-[16px]">edit</span>
              </router-link>
              <button
                class="w-9 h-9 flex items-center justify-center border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors"
                title="Supprimer"
                @click="openDeleteModal(article)"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden">
          <div
            v-for="article in filteredArticles"
            :key="article.id"
            class="px-4 py-4 border-b-2 border-ink/10 last:border-b-0"
          >
            <router-link
              :to="`/articles/${article.id}`"
              class="block hover:bg-parchment/50 transition-colors p-2 -m-2"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-ink/5 border-2 border-ink/20 flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-[18px] text-ink/20">add_a_photo</span>
                </div>
                <p class="font-display text-sm font-bold text-ink truncate">{{ article.title }}</p>
              </div>
              <div class="flex items-center gap-3 mt-2">
                <span
                  v-if="article.type"
                  class="px-2 py-0.5 border-2 border-ink/20 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 bg-parchment"
                >
                  {{ article.type.name }}
                </span>
                <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
                  {{ formatDate(article.created_at) }}
                </span>
              </div>
            </router-link>
            <div class="flex items-center gap-2 mt-2">
              <router-link
                :to="`/articles/${article.id}`"
                class="w-8 h-8 flex items-center justify-center border-2 border-ink text-ink hover:bg-ink hover:text-parchment transition-colors"
                title="Voir"
              >
                <span class="material-symbols-outlined text-[14px]">visibility</span>
              </router-link>
              <router-link
                :to="`/articles/${article.id}/edit`"
                class="w-8 h-8 flex items-center justify-center border-2 border-ink text-ink hover:bg-ink hover:text-parchment transition-colors"
                title="Modifier"
              >
                <span class="material-symbols-outlined text-[14px]">edit</span>
              </router-link>
              <button
                class="w-8 h-8 flex items-center justify-center border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors"
                title="Supprimer"
                @click="openDeleteModal(article)"
              >
                <span class="material-symbols-outlined text-[14px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No search results -->
      <div
        v-else
        class="bg-cream border-4 border-ink shadow-brutal p-12 text-center"
      >
        <span class="material-symbols-outlined text-ink/20 text-[48px] block mb-4">search_off</span>
        <p class="font-bold uppercase tracking-[0.2em] text-ink/40">
          AUCUN RÉSULTAT
        </p>
        <p class="text-sm text-ink/40 mt-2">
          Aucun article ne correspond à « {{ searchQuery }} »
        </p>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="SUPPRIMER L'ARTICLE"
      :message="`Êtes-vous sûr de vouloir supprimer « ${deletingArticleTitle} » ? Cette action est irréversible.`"
      confirm-label="SUPPRIMER"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </AdminLayout>
</template>
