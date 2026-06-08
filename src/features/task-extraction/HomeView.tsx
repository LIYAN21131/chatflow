"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/task/TaskCard";
import { Button, Card } from "@/components/ui";
import { APP_NAME, ROUTES } from "@/constants/config";
import { useHydrateTaskStore } from "@/hooks/useHydrateTaskStore";
import { useTaskStore } from "@/store/useTaskStore";

export function HomeView() {
  const router = useRouter();
  const chatText = useTaskStore((state) => state.chatText);
  const inputError = useTaskStore((state) => state.inputError);
  const tasks = useTaskStore((state) => state.tasks);
  const setChatText = useTaskStore((state) => state.setChatText);
  const fillSampleChat = useTaskStore((state) => state.fillSampleChat);
  const validateChatText = useTaskStore((state) => state.validateChatText);
  const recentTasks = useMemo(() => tasks.slice(0, 3), [tasks]);

  useHydrateTaskStore();

  const handleAnalyze = () => {
    if (!validateChatText()) return;
    router.push(ROUTES.analyze);
  };

  return (
    <AppShell activeTab="识别">
      <section className="space-y-5">
        <div className="pt-2">
          <p className="text-sm font-medium text-blue-600">AI 任务识别</p>
          <h1 className="mt-2 text-[26px] font-bold tracking-normal">{APP_NAME}</h1>
          <p className="mt-2 text-[15px] leading-6 text-slate-500">从聊天文本中自动生成待办事项</p>
        </div>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">聊天内容</span>
            <button onClick={fillSampleChat} className="text-xs font-semibold text-blue-600">
              填入示例
            </button>
          </div>
          <textarea
            value={chatText}
            onChange={(event) => setChatText(event.target.value)}
            placeholder="粘贴群聊、私聊中的任务信息..."
            className="min-h-48 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[15px] leading-7 outline-none focus:border-blue-400 focus:bg-white"
          />
          {inputError && <p className="text-sm font-medium text-rose-500">{inputError}</p>}
          <Button onClick={handleAnalyze}>开始智能分析</Button>
        </Card>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[17px] font-semibold">最近任务摘要</h2>
            <span className="text-xs text-slate-400">{recentTasks.length} 条</span>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} compact />
            ))}
            {recentTasks.length === 0 && (
              <Card className="flex items-center gap-3 text-slate-500">
                <CalendarClock size={20} />
                <span className="text-sm">暂无最近任务</span>
              </Card>
            )}
          </div>
        </section>
      </section>
    </AppShell>
  );
}
