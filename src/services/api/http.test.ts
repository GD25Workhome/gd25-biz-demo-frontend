import { describe, it, expect } from 'vitest'
import http from './http'

describe('http client', () => {
  it('adds x-request-id header and resolves', async () => {
    const prev = http.defaults.adapter
    http.defaults.adapter = async (config) => {
      expect((config.headers as any)['x-request-id']).toBeDefined()
      return Promise.resolve({
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as any)
    }
    const resp = await http.get('/test')
    expect(resp.data).toEqual({ ok: true })
    http.defaults.adapter = prev
  })

  it('normalizes error shape', async () => {
    const prev = http.defaults.adapter
    http.defaults.adapter = async () => {
      return Promise.reject({ response: { status: 500, data: { message: 'failed' } } })
    }
    await expect(http.get('/err')).rejects.toMatchObject({ code: 500, message: 'failed' })
    http.defaults.adapter = prev
  })
})
