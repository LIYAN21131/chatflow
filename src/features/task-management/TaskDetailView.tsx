"use client";

import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { TaskDetail } from "@/components/task/TaskDetail";
import { Button, Card } from "@/components/ui";
import { ROUTES } from "@/constants/config";
import { useHydrateTaskStore } from "@/hooks/useHydrateTaskStore";
import { useTaskStore } from "@/store/useTaskStore";

type TaskDetailViewProps = {
  taskId: string;
};

export function TaskDetailView({ taskId }: TaskDetailViewProps) {
  const router = useRouter();
  const task = useTaskStore((state) => state.getTaskById(taskId));
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  useHydrateTaskStore();

  if (!task) {
    return (
      <AppShell activeTab="待办" hideTab>
        <PageHeader title="任务详情" onBack={() => router.push(ROUTES.todos)} />
        <Card className="text-center text-slate-500">任务不存在</Card>
      </AppShell>
    );
  }

  return (
    <AppShell activeTab="待办" hideTab>
      <PageHeader
        title="任务详情"
        onBack={() => router.push(ROUTES.todos)}
        action={<Share2 size={20} className="text-slate-600" />}
      />
      <TaskDetail
        task={task}
        onReminderClick={() => router.push(`${ROUTES.task}/${task.id}/reminder`)}
      />
      <div className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-3 gap-2 bg-white/95 px-5 pb-5 pt-3 backdrop-blur">
        <Button variant="secondary" onClick={() => router.push(`${ROUTES.task}/${task.id}/edit`)}>
          编辑
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            deleteTask(task.id);
            router.push(ROUTES.todos);
          }}
          className="text-rose-500"
        >
          删除
        </Button>
        <Button onClick={() => toggleTaskStatus(task.id)}>
          {task.status === "completed" ? "恢复未完成" : "标记完成"}
        </Button>
      </div>
    </AppShell>
  );
}
