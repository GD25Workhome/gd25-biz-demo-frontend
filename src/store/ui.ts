import { create } from 'zustand'

type UiState = {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

export const useUiStore = create<UiState>((set) => ({
  theme: 'light',
  setTheme: (t) => set({ theme: t }),
}))
