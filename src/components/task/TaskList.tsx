"use client";

import { TaskCard } from "@/components/task/TaskCard";
import type { Task } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
};

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
      ))}
    </div>
  );
}
