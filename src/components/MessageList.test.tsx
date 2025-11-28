import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MessageList from './MessageList'

describe('MessageList', () => {
  it('renders roles and content', () => {
    render(
      <MessageList
        messages={[
          { id: '1', conversationId: 'c', role: 'user', content: 'hello', createdAt: new Date().toISOString() },
          { id: '2', conversationId: 'c', role: 'assistant', content: 'world', createdAt: new Date().toISOString() },
        ]}
      />
    )
    expect(screen.getByText('我:')).toBeTruthy()
    expect(screen.getByText('AI:')).toBeTruthy()
    expect(screen.getByText('hello')).toBeTruthy()
    expect(screen.getByText('world')).toBeTruthy()
  })
})
