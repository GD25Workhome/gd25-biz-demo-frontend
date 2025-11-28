import type { ChatMessage } from '../../types'

const store = new Map<string, ChatMessage[]>()

function ensureConv(id: string) {
  if (!store.has(id)) store.set(id, [])
}

export async function sendMessage(payload: { conversationId: string; content: string; role: 'user' | 'assistant' }) {
  const now = new Date().toISOString()
  ensureConv(payload.conversationId)
  const arr = store.get(payload.conversationId)!
  const userMsg: ChatMessage = {
    id: crypto.randomUUID(),
    conversationId: payload.conversationId,
    role: 'user',
    content: payload.content,
    createdAt: now,
  }
  arr.push(userMsg)
  setTimeout(() => {
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: payload.conversationId,
      role: 'assistant',
      content: `AI回复：${payload.content}`,
      createdAt: new Date().toISOString(),
    }
    arr.push(aiMsg)
  }, 600)
  return userMsg
}

export async function listMessages(params: { conversationId: string; since?: string }) {
  ensureConv(params.conversationId)
  const arr = store.get(params.conversationId)!
  return { messages: [...arr] }
}
