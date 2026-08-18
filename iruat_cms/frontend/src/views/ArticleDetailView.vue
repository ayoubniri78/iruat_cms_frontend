<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '@/stores/articles.store'
import { imagesService } from '@/services/images.service'
import type { ArticleImage } from '@/types/article'
import AdminLayout from '@/layouts/AdminLayout.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'
import ImageUploader from '@/components/images/ImageUploader.vue'
import ImageGrid from '@/components/images/ImageGrid.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()

const showDeleteModal = ref(false)
const showDeleteImageModal = ref(false)
const imageToDelete = ref<ArticleImage | null>(null)

const articleId = computed(() => route.params.id as string)
const articleImages = computed(() => (articlesStore.currentArticle as any)?.images ?? [])

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function refreshArticle() {
  articlesStore.fetchArticle(articleId.value)
}

function handleImageUploaded() {
  refreshArticle()
}

function handleDeleteImage(image: ArticleImage) {
  imageToDelete.value = image
  showDeleteImageModal.value = true
}

async function confirmDeleteImage() {
  if (!imageToDelete.value) return
  try {
    await imagesService.delete(imageToDelete.value.id)
    showDeleteImageModal.value = false
    imageToDelete.value = null
    refreshArticle()
  } catch {
    // silent
  }
}

function handleDelete() {
  articlesStore.deleteArticle(articleId.value).then(() => {
    showDeleteModal.value = false
    router.push('/articles')
  })
}

onMounted(() => {
  articlesStore.fetchArticle(articleId.value)
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
          {{ articlesStore.currentArticle?.title ?? 'ARTICLE' }}
        </li>
      </ol>
    </nav>

    <!-- Loading -->
    <div
      v-if="articlesStore.loading && !articlesStore.currentArticle"
      class="flex items-center justify-center py-20"
    >
      <div class="flex items-center gap-3 text-ink/50">
        <span class="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
        <span class="text-sm font-bold uppercase tracking-widest">CHARGEMENT...</span>
      </div>
    </div>

    <!-- Error -->
    <AlertMessage
      v-else-if="articlesStore.error && !articlesStore.currentArticle"
      type="error"
      :message="articlesStore.error"
    />

    <!-- Article content -->
    <template v-else-if="articlesStore.currentArticle">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div class="flex-1 min-w-0">
          <h1 class="font-display text-2xl sm:text-3xl font-bold text-ink uppercase tracking-wider break-words">
            {{ articlesStore.currentArticle.title }}
          </h1>
          <div class="flex items-center gap-4 mt-3 flex-wrap">
            <span
              v-if="articlesStore.currentArticle.type"
              class="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border-2 border-ink bg-parchment"
            >
              {{ articlesStore.currentArticle.type.name }}
            </span>
            <span class="text-xs text-ink/40 font-medium">
              Créé le {{ formatDate(articlesStore.currentArticle.created_at) }}
            </span>
            <span
              v-if="articlesStore.currentArticle.updated_at && articlesStore.currentArticle.updated_at !== articlesStore.currentArticle.created_at"
              class="text-xs text-ink/40 font-medium"
            >
              Modifié le {{ formatDate(articlesStore.currentArticle.updated_at) }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <router-link
            :to="`/articles/${articleId}/edit`"
            class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] border-4 border-ink bg-white text-ink hover:bg-ink hover:text-parchment transition-colors shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <span class="material-symbols-outlined text-[16px]">edit</span>
            MODIFIER
          </router-link>
          <button
            class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] border-4 border-accent bg-accent text-white hover:bg-accent-dark transition-colors shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px]"
            @click="showDeleteModal = true"
          >
            <span class="material-symbols-outlined text-[16px]">delete</span>
            SUPPRIMER
          </button>
        </div>
      </div>

      <!-- Article body -->
      <div class="bg-cream border-4 border-ink shadow-brutal p-8 mb-8">
        <div class="whitespace-pre-wrap text-sm text-ink/80 leading-relaxed font-body">
          {{ articlesStore.currentArticle.content }}
        </div>
      </div>

      <!-- Images section -->
      <div class="bg-cream border-4 border-ink shadow-brutal p-8">
        <div class="flex items-center gap-3 mb-6">
          <span class="material-symbols-outlined text-[24px]">image</span>
          <h2 class="font-display text-lg font-bold text-ink uppercase tracking-wider">
            IMAGES
          </h2>
        </div>

        <!-- Uploader -->
        <ImageUploader
          :article-id="articleId"
          :has-image="articleImages.length > 0"
          @uploaded="handleImageUploaded"
          class="mb-6"
        />

        <!-- Image grid -->
        <ImageGrid
          :images="articleImages"
          @delete="handleDeleteImage"
        />
      </div>
    </template>

    <!-- Delete article confirmation modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="SUPPRIMER L'ARTICLE"
      :message="`Êtes-vous sûr de vouloir supprimer « ${articlesStore.currentArticle?.title ?? ''} » ? Cette action est irréversible.`"
      confirm-label="SUPPRIMER"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Delete image confirmation modal -->
    <ConfirmModal
      :show="showDeleteImageModal"
      title="SUPPRIMER L'IMAGE"
      message="Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible."
      confirm-label="SUPPRIMER"
      @confirm="confirmDeleteImage"
      @cancel="showDeleteImageModal = false; imageToDelete = null"
    />
  </AdminLayout>
</template>
