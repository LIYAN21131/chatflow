"use client";

import { useRouter } from "next/navigation";
import { ResultTaskCard } from "@/components/ai/ResultTaskCard";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, Card } from "@/components/ui";
import { ROUTES } from "@/constants/config";
import { useHydrateTaskStore } from "@/hooks/useHydrateTaskStore";
import { useTaskStore } from "@/store/useTaskStore";

export function ResultView() {
  const router = useRouter();
  const pendingExtractedTasks = useTaskStore((state) => state.pendingExtractedTasks);
  const selectedTaskIds = useTaskStore((state) => state.selectedTaskIds);
  const toggleExtractedTask = useTaskStore((state) => state.toggleExtractedTask);
  const removeExtractedTask = useTaskStore((state) => state.removeExtractedTask);
  const confirmSelectedTasks = useTaskStore((state) => state.confirmSelectedTasks);

  useHydrateTaskStore();

  const handleConfirm = () => {
    confirmSelectedTasks();
    router.push(ROUTES.todos);
  };

  return (
    <AppShell activeTab="识别" hideTab>
      <PageHeader title="识别结果" onBack={() => router.push(ROUTES.home)} />
      <div className="space-y-4 pb-20">
        <Card className="bg-blue-600 text-white">
          <p className="text-lg font-semibold">
            识别成功，本次共提取 {pendingExtractedTasks.length} 条任务
          </p>
          <p className="mt-2 text-sm text-blue-100">请确认需要生成的待办事项</p>
        </Card>

        {pendingExtractedTasks.map((task) => (
          <ResultTaskCard
            key={task.id}
            task={task}
            checked={selectedTaskIds.includes(task.id)}
            onToggle={() => toggleExtractedTask(task.id)}
            onEdit={() => router.push(`${ROUTES.task}/${task.id}/edit`)}
            onDelete={() => removeExtractedTask(task.id)}
          />
        ))}
      </div>
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-white/95 px-5 pb-5 pt-3 backdrop-blur">
        <Button onClick={handleConfirm} disabled={selectedTaskIds.length === 0}>
          确认生成待办
        </Button>
      </div>
    </AppShell>
  );
}
