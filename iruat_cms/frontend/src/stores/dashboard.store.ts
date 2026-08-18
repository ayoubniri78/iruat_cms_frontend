import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articlesService } from '@/services/articles.service'
import { typesService } from '@/services/types.service'
import type { Article } from '@/types/article'

export const useDashboardStore = defineStore('dashboard', () => {
  const articleCount = ref(0)
  const typeCount = ref(0)
  const recentArticles = ref<Article[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchDashboard() {
    loading.value = true
    error.value = ''
    try {
      const [articlesRes, typesRes] = await Promise.all([
        articlesService.getAll(),
        typesService.getAll(),
      ])
      const articles = articlesRes.data
      articleCount.value = articles.length
      typeCount.value = typesRes.data.length
      recentArticles.value = articles.slice(0, 5)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de chargement'
    } finally {
      loading.value = false
    }
  }

  return { articleCount, typeCount, recentArticles, loading, error, fetchDashboard }
})
