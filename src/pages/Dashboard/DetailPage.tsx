import { useParams, Link } from 'react-router-dom'
import { Card, Space, Typography, Button, Spin, message } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { fetchItem } from '../../services/api'

export default function DetailPage() {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => fetchItem(id || ''),
    enabled: !!id,
  })

  if (isError && (error as any)?.message) message.error((error as any).message)
  return (
    <Space direction="vertical" style={{ width: '100%', padding: 24 }}>
      <Typography.Title level={3}>详情</Typography.Title>
      {isLoading ? (
        <Spin />
      ) : (
        <Card>
          <Typography.Paragraph>
            <Typography.Text>ID: {data?.id}</Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Typography.Text>名称: {data?.name}</Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Typography.Text>状态: {data?.status}</Typography.Text>
          </Typography.Paragraph>
        </Card>
      )}
      <Button type="primary">
        <Link to="/dashboard">返回列表</Link>
      </Button>
    </Space>
  )
}
