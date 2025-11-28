import { List, Typography } from 'antd'
import type { ChatMessage } from '../types'

export default function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <List
      dataSource={messages}
      renderItem={(m) => (
        <List.Item>
          <Typography.Text strong>{m.role === 'user' ? '我' : 'AI'}:</Typography.Text>
          <span style={{ marginLeft: 8 }}>{m.content}</span>
        </List.Item>
      )}
    />
  )
}
