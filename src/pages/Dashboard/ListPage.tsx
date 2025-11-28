import { useState, useEffect } from 'react'
import { Typography, Space, Button, Input, message, Empty } from 'antd'
import DataTable from '../../components/DataTable'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchItems } from '../../services/api'

export default function ListPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [q, setQ] = useState('')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['items', page, size, q],
    queryFn: () => fetchItems({ page, size, q }),
    placeholderData: (prev) => prev as any,
  })

  useEffect(() => {
    if (isError && (error as any)?.message) message.error((error as any).message)
  }, [isError, error])

  return (
    <Space direction="vertical" style={{ width: '100%', padding: 24 }}>
      <Typography.Title level={3}>后台列表</Typography.Title>
      <Space>
        <Input.Search placeholder="输入名称搜索" allowClear onSearch={(v) => { setPage(1); setQ(v) }} style={{ width: 260 }} />
      </Space>
      <DataTable
        data={data?.items ?? []}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: '名称', dataIndex: 'name' },
          { title: '状态', dataIndex: 'status' },
          {
            title: '操作',
            render: (_: any, record: any) => (
              <Button type="link">
                <Link to={`/dashboard/${record.id}`}>查看</Link>
              </Button>
            ),
          },
        ]}
        loading={isLoading}
        pagination={{ current: page, pageSize: size, total: data?.total ?? 0, showSizeChanger: true }}
        onChange={(p) => { setPage(p.current); setSize(p.pageSize) }}
      />
      {!isLoading && (data?.items?.length ?? 0) === 0 ? <Empty description="暂无数据" /> : null}
    </Space>
  )
}
