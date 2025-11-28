export type Item = {
  id: string
  name: string
  status: 'active' | 'disabled'
  createdAt: string
}

export type Paginated<T> = {
  items: T[]
  page: number
  size: number
  total: number
}

export type ItemListResponse = Paginated<Item>

export type ChatMessage = {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}
