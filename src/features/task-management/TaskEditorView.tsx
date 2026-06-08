"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { TaskEditor } from "@/components/task/TaskEditor";
import { ROUTES } from "@/constants/config";
import { useHydrateTaskStore } from "@/hooks/useHydrateTaskStore";
import { useTaskStore } from "@/store/useTaskStore";
import type { TaskDraft } from "@/types/task";

type TaskEditorViewProps = {
  taskId: string | "new";
};

export function TaskEditorView({ taskId }: TaskEditorViewProps) {
  const router = useRouter();
  const task = useTaskStore((state) => state.getTaskById(taskId));
  const saveTask = useTaskStore((state) => state.saveTask);
  const isNewTask = taskId === "new";

  useHydrateTaskStore();

  const handleSave = (draft: TaskDraft) => {
    const savedTask = saveTask(taskId, draft);
    if (savedTask) router.push(`${ROUTES.task}/${savedTask.id}`);
  };

  return (
    <AppShell activeTab="待办" hideTab>
      <PageHeader title={isNewTask ? "创建任务" : "编辑任务"} onBack={() => router.back()} />
      <TaskEditor task={task} onCancel={() => router.back()} onSave={handleSave} />
    </AppShell>
  );
}
