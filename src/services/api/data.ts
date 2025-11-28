import http from './http'
import type { Item, ItemListResponse } from '../../types'

export async function fetchItems(params: { page?: number; size?: number; q?: string } = {}) {
  const { page = 1, size = 20, q = '' } = params
  const resp = await http.get<ItemListResponse>('/api/items', { params: { page, size, q } })
  return resp.data
}

export async function fetchItem(id: string) {
  const resp = await http.get<Item>(`/api/items/${id}`)
  return resp.data
}
