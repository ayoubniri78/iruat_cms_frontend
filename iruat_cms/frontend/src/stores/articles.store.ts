import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articlesService } from '@/services/articles.service'
import type { Article } from '@/types/article'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchArticles() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await articlesService.getAll()
      articles.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de chargement'
    } finally {
      loading.value = false
    }
  }

  async function fetchArticle(id: string) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await articlesService.getById(id)
      currentArticle.value = data
      return data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de chargement'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createArticle(data: Omit<Article, 'id' | 'created_at' | 'updated_at'>) {
    loading.value = true
    error.value = ''
    try {
      const { data: created } = await articlesService.create(data)
      articles.value.unshift(created)
      return created
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de création'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateArticle(id: string, data: Partial<Article>) {
    loading.value = true
    error.value = ''
    try {
      const { data: updated } = await articlesService.update(id, data)
      const idx = articles.value.findIndex((a) => a.id === id)
      if (idx !== -1) articles.value[idx] = updated
      currentArticle.value = updated
      return updated
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de mise à jour'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteArticle(id: string) {
    loading.value = true
    error.value = ''
    try {
      await articlesService.remove(id)
      articles.value = articles.value.filter((a) => a.id !== id)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de suppression'
    } finally {
      loading.value = false
    }
  }

  return {
    articles,
    currentArticle,
    loading,
    error,
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
  }
})
