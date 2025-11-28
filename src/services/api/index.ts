import * as mock from './mock'
import * as data from './data'
import * as chatMock from './chatMock'
import * as chatHttp from './chat'

const useMock = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_BASE_URL
const api = useMock ? mock : data
const chatApi = useMock ? chatMock : chatHttp

export const fetchItems = api.fetchItems
export const fetchItem = api.fetchItem
export const sendMessage = chatApi.sendMessage
export const listMessages = chatApi.listMessages
