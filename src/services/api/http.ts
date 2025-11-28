import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  config.headers['x-request-id'] = uuidv4()
  return config
})

instance.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const message = error?.response?.data?.message || error.message || '网络异常'
    return Promise.reject({
      code: error?.response?.status || 'NETWORK_ERROR',
      message,
      details: error?.response?.data,
    })
  }
)

export default instance
