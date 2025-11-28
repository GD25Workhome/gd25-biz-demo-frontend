import { describe, it, expect, vi } from 'vitest'
import { sendMessage, listMessages } from './chatMock'

describe('chat mock', () => {
  it('sendMessage optimistic then assistant reply', async () => {
    vi.useFakeTimers()
    const conv = 'c1'
    await sendMessage({ conversationId: conv, content: 'hi', role: 'user' })
    let list = await listMessages({ conversationId: conv })
    expect(list.messages.length).toBe(1)
    vi.advanceTimersByTime(700)
    list = await listMessages({ conversationId: conv })
    expect(list.messages.length).toBeGreaterThanOrEqual(2)
    vi.useRealTimers()
  })
})
