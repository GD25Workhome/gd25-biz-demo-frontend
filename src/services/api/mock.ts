import type { ItemListResponse, Item } from '../../types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchItems(params: { page?: number; size?: number; q?: string } = {}): Promise<ItemListResponse> {
  const { page = 1, size = 20, q = '' } = params
  await delay(300)
  const all: Item[] = Array.from({ length: 57 }).map((_, i) => ({
    id: String(i + 1),
    name: `样例 ${i + 1}`,
    status: i % 2 === 0 ? 'active' : 'disabled',
    createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
  }))
  const filtered = q ? all.filter((x) => x.name.includes(q)) : all
  const start = (page - 1) * size
  const items = filtered.slice(start, start + size)
  return { items, page, size, total: filtered.length }
}

export async function fetchItem(id: string): Promise<Item> {
  await delay(200)
  return {
    id,
    name: `样例 ${id}`,
    status: Number(id) % 2 === 0 ? 'active' : 'disabled',
    createdAt: new Date().toISOString(),
  }
}
