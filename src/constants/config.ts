export const APP_NAME = "聊天任务整理助手";
export const APP_VERSION = "1.0.0";
export const AI_PROVIDER = "mock";
export const ENABLE_ANALYTICS = true;
export const ENABLE_NOTIFICATION = false;

export const STORAGE_KEYS = {
  tasks: "chat_task_todos",
  chatText: "chat-task-assistant.chatText",
  analytics: "chat_task_analytics",
} as const;

export const ROUTES = {
  home: "/",
  analyze: "/analyze",
  result: "/result",
  todos: "/todos",
  task: "/task",
  settings: "/settings",
  failed: "/failed",
} as const;
