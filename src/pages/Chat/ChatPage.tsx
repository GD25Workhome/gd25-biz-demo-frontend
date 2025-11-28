import { useEffect } from 'react'
import { Card, Space, Typography, message } from 'antd'
import MessageList from '../../components/MessageList'
import ChatInput from '../../components/ChatInput'
import type { ChatMessage } from '../../types'
import { useChatStore } from '../../store/chat'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listMessages, sendMessage } from '../../services/api'


export default function ChatPage() {
  const queryClient = useQueryClient()
  const { conversationId, setConversationId, draft, setDraft } = useChatStore()

  useEffect(() => {
    if (!conversationId) setConversationId('conv-local')
  }, [conversationId, setConversationId])

  const { data } = useQuery<{ messages: ChatMessage[] }>({
    queryKey: ['chat', conversationId],
    queryFn: () => listMessages({ conversationId: conversationId || 'conv-local' }),
    enabled: !!conversationId,
    refetchInterval: 2000,
  })

  const mutation = useMutation({
    mutationFn: (content: string) => sendMessage({ conversationId: conversationId || 'conv-local', content, role: 'user' }),
    onError: (err: any) => {
      message.error(err?.message || '发送失败')
      const key = ['chat', conversationId]
      const prev = queryClient.getQueryData(key) as { messages: ChatMessage[] } | undefined
      if (prev) queryClient.setQueryData(key, prev)
    },
  })

  const send = () => {
    const content = draft.trim()
    if (!content) return
    const key = ['chat', conversationId]
    const prev = (queryClient.getQueryData(key) as { messages: ChatMessage[] }) || { messages: [] }
    const optimistic: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: conversationId || 'conv-local',
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    queryClient.setQueryData(key, { messages: [...prev.messages, optimistic] })
    setDraft('')
    mutation.mutate(content)
  }

  return (
    <Space direction="vertical" style={{ width: '100%', padding: 24 }}>
      <Typography.Title level={3}>聊天</Typography.Title>
      <Card>
        <MessageList messages={data?.messages ?? []} />
      </Card>
      <Space>
        <ChatInput value={draft} onChange={setDraft} onSend={send} />
      </Space>
    </Space>
  )
}
