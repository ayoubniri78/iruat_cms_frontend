import api from '@/lib/axios'
import type { CmsType } from '@/types/type'

export const typesService = {
  async getAll() {
    const { data } = await api.get<CmsType[]>('/type')
    return { data }
  },

  async getById(id: string) {
    const { data } = await api.get<CmsType>(`/type/${id}`)
    return { data }
  },

  async create(type: { name: string }) {
    const { data } = await api.post<CmsType>('/type', type)
    return { data }
  },

  async update(id: string, updates: { name: string }) {
    const { data } = await api.patch<CmsType>(`/type/${id}`, updates)
    return { data }
  },

  async delete(id: string) {
    await api.delete(`/type/${id}`)
  },
}
