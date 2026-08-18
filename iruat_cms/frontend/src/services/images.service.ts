import api from '@/lib/axios'
import type { ArticleImage } from '@/types/article'

export const imagesService = {
  getAll: () => api.get<ArticleImage[]>('/article-images'),
  getById: (id: string) => api.get<ArticleImage>(`/article-images/${id}`),
  create: (formData: FormData) =>
    api.post<ArticleImage>('/article-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.patch<ArticleImage>(`/article-images/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/article-images/${id}`),
}
