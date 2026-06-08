# 聊天任务整理助手

聊天任务整理助手是一个移动端优先的效率工具 Web App，用于把聊天记录中的任务信息自动整理为可执行待办事项。当前版本使用 Mock AI 和本地数据仓储，保留了真实商业项目所需的 AI、任务管理、提醒、埋点和数据库扩展入口。

## 技术栈

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Zustand
- ESLint
- Prettier
- Vercel

## 目录结构说明

```text
src/
├── app/                    # Next.js 路由层，只挂载页面 View
│   ├── page.tsx
│   ├── analyze/
│   ├── result/
│   ├── todos/
│   ├── task/
│   ├── settings/
│   └── failed/
├── components/             # 可复用 UI 组件
│   ├── layout/             # App 外壳、页面头部
│   ├── task/               # 任务卡片、列表、详情、编辑器、提醒选项
│   ├── ai/                 # AI 识别进度、步骤、结果卡片
│   ├── common/             # 通用空状态、图标按钮、信息行
│   └── ui/                 # Button、Card、PriorityPill 等基础组件
├── features/               # 业务功能模块
│   ├── task-extraction/    # 聊天输入、AI 识别、结果确认、失败页
│   ├── task-management/    # 创建、修改、删除、完成任务
│   ├── reminder/           # 提醒设置
│   └── analytics/          # 设置页与埋点事件预留
├── hooks/                  # 复用 hooks
├── services/               # 外部能力和仓储抽象
│   ├── ai/                 # extractTasks，未来接 OpenAI/Claude/DeepSeek/Gemini
│   ├── reminder/           # 提醒服务预留
│   ├── analytics/          # trackEvent，未来接 PostHog
│   └── taskRepository.ts   # 当前 localStorage + mock，未来接数据库
├── store/                  # Zustand 状态管理
├── types/                  # Task、Priority、TaskStatus、ReminderType 等类型
├── lib/                    # 通用工具
├── mock/                   # Mock 数据
└── constants/              # APP_NAME、AI_PROVIDER、开关配置
```

## 启动方式

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

## 常用命令

```bash
npm run lint
npm run build
npm run format
npm run format:check
```

## 部署方式

项目已包含 `vercel.json`，可直接部署到 Vercel。

```bash
npm install
npm run build
```

在 Vercel 中导入仓库后，Framework Preset 选择 Next.js 即可。环境变量可参考 `.env.example`。

## 未来扩展方案

- 接入真实 AI：替换 `src/services/ai/extractTasks.ts`，保持返回 `{ success, tasks }`，页面和业务层无需调整。
- 接入 PostHog：在 `src/services/analytics/trackEvent.ts` 中替换当前 console 逻辑。
- 接入数据库：替换 `src/services/taskRepository.ts` 为 Supabase、Firebase 或 PostgreSQL 实现。
- 接入提醒系统：扩展 `src/services/reminder/reminderService.ts`，并接入通知权限、定时任务或服务端提醒。
- 接入用户登录：在仓储层按 userId 隔离任务数据，页面和组件结构无需重构。
