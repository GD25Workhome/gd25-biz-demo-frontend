import { describe, it, expect } from 'vitest'
import { fetchItems, fetchItem } from './mock'

describe('mock data api', () => {
  it('fetchItems paginates and filters', async () => {
    const r1 = await fetchItems({ page: 1, size: 10 })
    expect(r1.items.length).toBe(10)
    const r2 = await fetchItems({ q: '样例 1' })
    expect(r2.items.every((x) => x.name.includes('样例 1'))).toBe(true)
  })

  it('fetchItem returns item', async () => {
    const item = await fetchItem('2')
    expect(item.id).toBe('2')
    expect(typeof item.createdAt).toBe('string')
  })
})
