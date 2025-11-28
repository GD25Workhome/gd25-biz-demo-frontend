import { create } from 'zustand'

type ChatState = {
  conversationId: string | null
  setConversationId: (id: string | null) => void
  draft: string
  setDraft: (v: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  conversationId: null,
  setConversationId: (id) => set({ conversationId: id }),
  draft: '',
  setDraft: (v) => set({ draft: v }),
}))
