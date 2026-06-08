"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Settings } from "lucide-react";
import { IconButton } from "@/components/common/IconButton";
import { AppShell } from "@/components/layout/AppShell";
import { TaskList } from "@/components/task/TaskList";
import { ROUTES } from "@/constants/config";
import { useHydrateTaskStore } from "@/hooks/useHydrateTaskStore";
import { taskFilterLabels } from "@/lib/taskLabels";
import { useTaskStore } from "@/store/useTaskStore";
import type { TaskFilter } from "@/types/task";

const filters: TaskFilter[] = ["all", "pending", "completed"];

export function TodoListView() {
  const router = useRouter();
  const tasks = useTaskStore((state) => state.tasks);
  const taskFilter = useTaskStore((state) => state.taskFilter);
  const setTaskFilter = useTaskStore((state) => state.setTaskFilter);

  useHydrateTaskStore();

  const filteredTasks = useMemo(
    () => tasks.filter((task) => taskFilter === "all" || task.status === taskFilter),
    [taskFilter, tasks],
  );

  return (
    <AppShell activeTab="待办">
      <header className="mb-5 flex items-center justify-between pt-1">
        <h1 className="text-[24px] font-bold">我的待办</h1>
        <div className="flex gap-2">
          <IconButton aria-label="搜索">
            <Search size={20} />
          </IconButton>
          <IconButton aria-label="设置" onClick={() => router.push(ROUTES.settings)}>
            <Settings size={20} />
          </IconButton>
        </div>
      </header>

      <div className="mb-4 grid grid-cols-3 rounded-2xl bg-white p-1 shadow-sm">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setTaskFilter(filter)}
            className={`h-10 rounded-xl text-sm font-semibold ${
              taskFilter === filter ? "bg-blue-600 text-white" : "text-slate-500"
            }`}
          >
            {taskFilterLabels[filter]}
          </button>
        ))}
      </div>

      <TaskList
        tasks={filteredTasks}
        onTaskClick={(taskId) => router.push(`${ROUTES.task}/${taskId}`)}
      />

      <button
        onClick={() => router.push(`${ROUTES.task}/new/edit`)}
        className="fixed bottom-24 left-[calc(50%+140px)] z-20 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30"
        aria-label="添加任务"
      >
        <Plus size={28} />
      </button>
    </AppShell>
  );
}
