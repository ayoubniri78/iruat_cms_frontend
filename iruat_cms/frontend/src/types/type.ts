export interface TypeOfArticle {
  id: string
  name: string
  description?: string | null
  created_at: string
  updated_at: string
}

/** Alias for backward compatibility */
export type CmsType = TypeOfArticle
