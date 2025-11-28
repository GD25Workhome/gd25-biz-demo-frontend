import http from './http'

export type ChatMessage = {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

export async function sendMessage(payload: {
  conversationId: string
  content: string
  role: 'user' | 'assistant'
}) {
  const resp = await http.post<ChatMessage>('/api/chat/send', payload)
  return resp.data
}

export async function listMessages(params: { conversationId: string; since?: string }) {
  const resp = await http.get<{ messages: ChatMessage[] }>('/api/chat/messages', { params })
  return resp.data
}
