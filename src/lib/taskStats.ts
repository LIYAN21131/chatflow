import { getTaskTimeDate } from "@/lib/taskTime";
import type { Task } from "@/types/task";

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function getTotalTasks(tasks: Task[]) {
  return tasks.length;
}

export function getCompletedTasks(tasks: Task[]) {
  return tasks.filter((task) => task.status === "completed").length;
}

export function getPendingTasks(tasks: Task[]) {
  return tasks.filter((task) => task.status === "pending").length;
}

export function getCompletionRate(tasks: Task[]) {
  if (!tasks.length) return 0;
  return Math.round((getCompletedTasks(tasks) / tasks.length) * 100);
}

export function getTodayTasks(tasks: Task[], now = new Date()) {
  return tasks.filter((task) => {
    const taskTime = getTaskTimeDate(task);
    return task.status === "pending" && taskTime && isSameDay(taskTime, now);
  }).length;
}

export function getUpcomingTasks(tasks: Task[], now = new Date()) {
  const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return tasks.filter((task) => {
    const taskTime = getTaskTimeDate(task);
    return task.status === "pending" && taskTime && taskTime > now && taskTime <= nextDay;
  }).length;
}

export function getOverdueTasks(tasks: Task[], now = new Date()) {
  return tasks.filter((task) => {
    const taskTime = getTaskTimeDate(task);
    return task.status === "pending" && taskTime && taskTime < now;
  }).length;
}

export function getContinuousCompletionDays() {
  return 6;
}
