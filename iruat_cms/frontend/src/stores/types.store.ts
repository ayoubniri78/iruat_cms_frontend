import { defineStore } from 'pinia'
import { ref } from 'vue'
import { typesService } from '@/services/types.service'
import type { TypeOfArticle } from '@/types/type'

export const useTypesStore = defineStore('types', () => {
  const types = ref<TypeOfArticle[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchTypes() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await typesService.getAll()
      types.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de chargement'
    } finally {
      loading.value = false
    }
  }

  async function createType(name: string) {
    loading.value = true
    error.value = ''
    try {
      await typesService.create({ name })
      await fetchTypes()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de création'
    } finally {
      loading.value = false
    }
  }

  async function updateType(id: string, name: string) {
    loading.value = true
    error.value = ''
    try {
      await typesService.update(id, { name })
      await fetchTypes()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de mise à jour'
    } finally {
      loading.value = false
    }
  }

  async function deleteType(id: string) {
    loading.value = true
    error.value = ''
    try {
      await typesService.delete(id)
      await fetchTypes()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur de suppression'
    } finally {
      loading.value = false
    }
  }

  return { types, loading, error, fetchTypes, createType, updateType, deleteType }
})
