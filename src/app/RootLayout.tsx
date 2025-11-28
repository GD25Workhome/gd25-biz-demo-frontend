import { Layout, Menu } from 'antd'
import { Outlet, Link, useLocation } from 'react-router-dom'

export default function RootLayout() {
  const location = useLocation()
  const selected = location.pathname.startsWith('/chat') ? 'chat' : 'dashboard'
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selected]}
          items={[
            { key: 'dashboard', label: <Link to="/dashboard">后台数据</Link> },
            { key: 'chat', label: <Link to="/chat">聊天</Link> },
          ]}
        />
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
