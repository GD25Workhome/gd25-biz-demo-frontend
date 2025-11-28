import { createBrowserRouter, Navigate } from 'react-router-dom'
import ListPage from '../pages/Dashboard/ListPage'
import DetailPage from '../pages/Dashboard/DetailPage'
import ChatPage from '../pages/Chat/ChatPage'
import RootLayout from './RootLayout'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '/dashboard', element: <ListPage /> },
      { path: '/dashboard/:id', element: <DetailPage /> },
      { path: '/chat', element: <ChatPage /> },
    ],
  },
])

export default router
