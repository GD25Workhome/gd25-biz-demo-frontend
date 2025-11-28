# AI Demo 前端技术设计

## 背景与目标
本设计用于实现一个包含“数据后台列表”和“聊天功能”的 AI Demo 前端，采用主流前端技术框架，支持与后端接口对接、消息发送与轮询拉取、基础错误处理与可扩展性。文末提供完整依赖清单（固定版本），便于一次性安装。

## 技术选型
- 框架：React 18 + Vite 5 + TypeScript（快速开发、良好生态）
- 路由：React Router v6（多页面导航）
- UI 组件库：Ant Design 5（成熟的企业级 UI）
- 数据请求与缓存：Axios + TanStack Query v5（请求封装、缓存、重试、轮询）
- 局部状态：Zustand（轻量管理页面内 UI/会话态）
- 时间与工具：Day.js、uuid（轻量工具库）
- 测试：Vitest + Testing Library + jsdom（单元与组件测试）
- 代码质量：ESLint + @typescript-eslint + Prettier（规范与格式化）

## 环境与运行要求
- Node.js：>= 18（推荐 18 LTS）
- 包管理器：npm 或 pnpm；示例使用 npm
- 环境变量：`VITE_API_BASE_URL` 指向后端服务地址，如 `http://localhost:8080`

## 目录结构规划
```text
├─ src
│  ├─ app
│  │  ├─ App.tsx
│  │  └─ router.tsx
│  ├─ pages
│  │  ├─ Dashboard
│  │  │  ├─ ListPage.tsx
│  │  │  └─ DetailPage.tsx
│  │  └─ Chat
│  │     └─ ChatPage.tsx
│  ├─ components
│  │  ├─ DataTable.tsx
│  │  ├─ MessageList.tsx
│  │  └─ ChatInput.tsx
│  ├─ services
│  │  ├─ api
│  │  │  ├─ http.ts
│  │  │  ├─ data.ts
│  │  │  └─ chat.ts
│  │  └─ queryClient.ts
│  ├─ store
│  │  ├─ chat.ts
│  │  └─ ui.ts
│  ├─ types
│  │  └─ index.ts
│  ├─ utils
│  │  └─ format.ts
│  ├─ assets
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ index.html
└─ package.json
```

## 路由与导航
- 根路由：`/` → 首页或跳转到 `/dashboard`
- 数据后台：`/dashboard`（列表页）与 `/dashboard/:id`（详情页）
- 聊天：`/chat`（聊天界面）
- 顶部导航栏/侧边菜单：使用 Antd `Layout` + `Menu`，路由切换通过 `Link/NavLink`

## 网络层封装
`services/api/http.ts`
- 使用 Axios 创建实例：`baseURL` 读取 `import.meta.env.VITE_API_BASE_URL`
- 请求拦截器：附加鉴权头（如 `Authorization: Bearer <token>`，若后端需要）
- 响应拦截器：统一错误处理（HTTP 非 2xx、后端业务码），转换为可读的错误对象

`services/queryClient.ts`
- 初始化 React Query 的 `QueryClient`
- 默认重试策略：网络错误重试 3 次，指数退避
- 全局错误处理：在 `onError` 中触发 Antd `message.error`

## 数据后台模块设计（列表/详情）
### API 约定（示例）
- 列表：`GET /api/items?page=<number>&size=<number>&q=<string>`
- 详情：`GET /api/items/:id`

### 前端实现要点
- 列表页
  - 使用 React Query 的 `useQuery` 拉取数据；`queryKey = ['items', page, size, q]`
  - 表格组件：Antd `Table`，启用分页、排序、搜索框；分页变化触发 `setState` 并自动刷新查询
  - 空态、加载态、错误态：分别展示 `Empty`、`Skeleton`/`Spin`、`Result`/`message.error`
- 详情页
  - 根据路由参数 `id` 拉取详情；支持返回上一页
  - 展示核心字段与状态标识；可扩展成编辑/操作按钮

## 聊天模块设计（发送与轮询）
### 数据流
1. 发送消息：`POST /api/chat/send`，请求体 `{ conversationId, content, role }`
2. 轮询消息：`GET /api/chat/messages?conversationId=<id>&since=<timestamp>` 返回新增消息列表
3. 本地存储：将消息追加到当前会话的消息列表，并滚动到底部

### 前端实现要点
- 消息模型
  ```ts
  type ChatMessage = {
    id: string
    conversationId: string
    role: 'user' | 'assistant' | 'system'
    content: string
    createdAt: string // ISO
  }
  ```
- 发送
  - `chat.ts` 中封装 `sendMessage(payload)` → `axios.post('/api/chat/send', payload)`
  - 前端可做“乐观更新”：先在 UI 中插入用户消息，失败时回滚并提示错误
- 轮询
  - 使用 React Query 的 `useQuery` + `refetchInterval: 2000`（2s 间隔）拉取新消息
  - 通过 `since`（最后一条消息时间）增量获取；首次进入拉全量历史或控制上限
  - 可根据会话活跃状态暂停/恢复轮询（Tab 不活跃时暂停以省资源）
- 展示
  - `MessageList`：按时间排序，区分角色样式；支持代码块、换行等基础渲染
  - `ChatInput`：多行输入、`Enter` 发送；发送时禁用按钮，结束后恢复
- 可扩展（后续替换为 WebSocket/SSE）
  - 若后端支持实时推送，抽象 `chat.ts` 的数据源层，新增 WebSocket/SSE 实现，无需改动上层组件

## 状态管理策略
- 服务器状态：全部由 React Query 管理（列表、详情、聊天拉取）
- 客户端局部状态：用 Zustand（如聊天输入框内容、当前会话 ID、UI 折叠等）
- 错误与通知：Antd `message`/`notification` 统一弹出

## 错误处理与重试
- Axios 拦截器将后端错误规范化；对业务码进行统一分支处理
- React Query 对网络错误重试 3 次；业务错误直接 fail 并提示
- 针对 401/403：触发登录态处理或跳转登录页（若后续接入鉴权）

## 安全与合规
- 切勿在代码中硬编码令牌或密钥；通过环境变量与安全存储获取
- 日志不输出敏感信息；调试开关在开发环境启用、生产关闭
- 允许跨域：后端应设置 CORS；前端仅通过配置化 `baseURL` 访问

## 测试与验证
- 单元测试：组件（列表表格、聊天输入）与服务（`chat.ts`、`data.ts`）
- 组件测试：`@testing-library/react` 对交互与渲染断言
- 网络模拟：可选 MSW（未列入必要依赖），或以函数桩替代

## 构建与本地运行
1. 安装依赖：见下方清单（固定版本）
2. 开发启动：`npm run dev` → `vite` 本地开发服务器
3. 生产构建：`npm run build` → 产出到 `dist`
4. 预览构建：`npm run preview`

## 依赖清单（固定版本）
> 下列版本为稳定版本，确保在 Node 18 环境可用。若镜像源差异导致安装失败，可按小版本区间调整，但建议保持主版本一致。

### dependencies
- react: 18.2.0
- react-dom: 18.2.0
- axios: 1.7.7
- @tanstack/react-query: 5.50.1
- react-router-dom: 6.26.2
- antd: 5.20.0
- zustand: 4.5.2
- dayjs: 1.11.11
- uuid: 9.0.1

### devDependencies
- vite: 5.4.10
- @vitejs/plugin-react: 4.3.2
- typescript: 5.6.3
- eslint: 8.57.0
- @typescript-eslint/eslint-plugin: 7.17.0
- @typescript-eslint/parser: 7.17.0
- prettier: 3.3.3
- vitest: 1.6.0
- @testing-library/react: 14.1.2
- @testing-library/jest-dom: 6.2.0
- jsdom: 24.1.0

## 安装脚本示例（可直接复制）
```bash
npm i react@18.2.0 react-dom@18.2.0 axios@1.7.7 @tanstack/react-query@5.50.1 \
  react-router-dom@6.26.2 antd@5.20.0 zustand@4.5.2 dayjs@1.11.11 uuid@9.0.1

npm i -D vite@5.4.10 @vitejs/plugin-react@4.3.2 typescript@5.6.3 \
  eslint@8.57.0 @typescript-eslint/eslint-plugin@7.17.0 @typescript-eslint/parser@7.17.0 \
  prettier@3.3.3 vitest@1.6.0 @testing-library/react@14.1.2 @testing-library/jest-dom@6.2.0 jsdom@24.1.0
```

## 示例接口契约（参考）
```http
GET /api/items?page=1&size=20&q=
200 OK
{
  "items": [
    { "id": "1001", "name": "样例", "status": "active", "createdAt": "2025-01-01T10:00:00Z" }
  ],
  "page": 1,
  "size": 20,
  "total": 200
}

GET /api/items/1001
200 OK
{ "id": "1001", "name": "样例", "desc": "详情...", "status": "active" }

POST /api/chat/send
{ "conversationId": "c1", "content": "你好", "role": "user" }
200 OK
{ "id": "m101", "conversationId": "c1", "content": "你好，有什么可以帮你？", "role": "assistant", "createdAt": "2025-01-01T10:01:00Z" }

GET /api/chat/messages?conversationId=c1&since=2025-01-01T10:00:00Z
200 OK
{ "messages": [ /* 新增消息数组 */ ] }
```

## 可扩展方向
- 鉴权与角色权限：接入登录、Token 刷新、RBAC 菜单控制
- 长连接支持：WebSocket/SSE 替代轮询，提升实时性与资源利用
- 草稿与会话管理：支持多会话、固定提示词、消息引用上下文
- 观测：前端埋点与后端链路追踪，定位性能瓶颈

---
以上设计覆盖模块划分、数据流与依赖版本。后续如需生成模板项目，可按上述目录与依赖直接初始化。

