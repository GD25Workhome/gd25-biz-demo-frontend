import { Table } from 'antd'

type Props<T extends { id: string }> = {
  data: T[]
  columns: any[]
  pageSize?: number
  loading?: boolean
  pagination?: any
  onChange?: (pagination: any) => void
}

export default function DataTable<T extends { id: string }>({ data, columns, pageSize = 10, loading, pagination, onChange }: Props<T>) {
  return <Table rowKey="id" dataSource={data} columns={columns} loading={loading} pagination={pagination ?? { pageSize }} onChange={onChange} />
}
