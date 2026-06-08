"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReminderOptions } from "@/components/task/ReminderOptions";
import { Button, Card } from "@/components/ui";
import { ROUTES } from "@/constants/config";
import { useHydrateTaskStore } from "@/hooks/useHydrateTaskStore";
import { useTaskStore } from "@/store/useTaskStore";
import type { ReminderType } from "@/types/task";

type ReminderSettingsViewProps = {
  taskId: string;
};

export function ReminderSettingsView({ taskId }: ReminderSettingsViewProps) {
  const router = useRouter();
  const task = useTaskStore((state) => state.getTaskById(taskId));
  const setReminder = useTaskStore((state) => state.setReminder);
  const [selectedReminder, setSelectedReminder] = useState<ReminderType>("1hour");

  useHydrateTaskStore();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (task) setSelectedReminder(task.reminder);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [task]);

  const handleSave = () => {
    setReminder(taskId, selectedReminder);
    router.push(`${ROUTES.task}/${taskId}`);
  };

  return (
    <AppShell activeTab="待办" hideTab>
      <PageHeader title="提醒设置" onBack={() => router.back()} />
      <div className="space-y-4">
        <Card className="bg-blue-600 text-white">
          <p className="text-lg font-semibold">准时完成，不再遗忘</p>
          <p className="mt-2 text-sm text-blue-100">{task?.title ?? "为任务选择一个提醒时间"}</p>
        </Card>
        <Card>
          <ReminderOptions value={selectedReminder} onChange={setSelectedReminder} />
        </Card>
      </div>
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-white/95 px-5 pb-5 pt-3 backdrop-blur">
        <Button onClick={handleSave}>保存设置</Button>
      </div>
    </AppShell>
  );
}
