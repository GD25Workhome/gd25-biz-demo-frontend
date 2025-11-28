import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ChatInput from './ChatInput'

describe('ChatInput', () => {
  it('calls onChange and onSend', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    render(<ChatInput value="" onChange={onChange} onSend={onSend} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'hi' } })
    expect(onChange).toHaveBeenCalled()
    const btn = screen.getByRole('button', { name: /发\s?送/ })
    fireEvent.click(btn)
    expect(onSend).toHaveBeenCalled()
  })
})
