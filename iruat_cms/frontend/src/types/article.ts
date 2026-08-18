import type { TypeOfArticle } from '@/types/type'

export interface Article {
  id: string
  author_id: string
  type_id: string
  title: string
  slug: string
  content: string
  created_at: string
  updated_at: string
  type?: TypeOfArticle
  images?: ArticleImage[]
}

export interface ArticleImage {
  id: string
  article_id: string
  image_url: string
  public_id: string
  is_main: boolean
  created_at?: string
}
