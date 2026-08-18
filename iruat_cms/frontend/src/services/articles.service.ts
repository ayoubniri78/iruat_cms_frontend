import api from '@/lib/axios'
import type { Article } from '@/types/article'

export const articlesService = {
  async getAll() {
    const { data } = await api.get<Article[]>('/articles')
    return { data }
  },

  async getById(id: string) {
    const { data } = await api.get<Article>(`/articles/${id}`)
    return { data }
  },

  async create(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>) {
    const { data } = await api.post<Article>('/articles', article)
    return { data }
  },

  async update(id: string, updates: Partial<Article>) {
    const { data } = await api.patch<Article>(`/articles/${id}`, updates)
    return { data }
  },

  async remove(id: string) {
    await api.delete(`/articles/${id}`)
  },
}
