import { Input, Button } from 'antd'

export default function ChatInput({ value, onChange, onSend }: { value: string; onChange: (v: string) => void; onSend: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Input.TextArea value={value} onChange={(e) => onChange(e.target.value)} autoSize={{ minRows: 2, maxRows: 4 }} />
      <Button type="primary" onClick={onSend}>
        发送
      </Button>
    </div>
  )
}
