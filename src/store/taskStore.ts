"use client";

import { create } from "zustand";
import { STORAGE_KEYS } from "@/constants/config";
import { createTask, updateTask as buildUpdatedTask } from "@/features/task-management";
import { readStorage, writeStorage } from "@/lib/storage";
import { SAMPLE_CHAT_TEXT } from "@/mock/tasks";
import { extractTasks } from "@/services/ai/extractTasks";
import { trackEvent } from "@/services/analytics";
import { taskRepository } from "@/services/taskRepository";
import { useAnalyticsStore } from "@/store/analyticsStore";
import type { ReminderType, Task, TaskDraft, TaskFilter } from "@/types/task";

type TaskStore = {
  chatText: string;
  inputError: string;
  tasks: Task[];
  pendingExtractedTasks: Task[];
  selectedTaskIds: string[];
  taskFilter: TaskFilter;
  hydrated: boolean;
  hydrate: () => void;
  setChatText: (value: string) => void;
  fillSampleChat: () => void;
  validateChatText: () => boolean;
  runExtraction: () => Promise<boolean>;
  setPendingExtractedTasks: (tasks: Task[]) => void;
  clearPendingExtractedTasks: () => void;
  toggleExtractedTask: (taskId: string) => void;
  removeExtractedTask: (taskId: string) => void;
  confirmSelectedTasks: () => void;
  addTasks: (tasks: Task[]) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  setTaskFilter: (filter: TaskFilter) => void;
  getTaskById: (taskId: string) => Task | undefined;
  saveTask: (taskId: string | "new", draft: TaskDraft) => Task | undefined;
  completeTaskById: (taskId: string) => void;
  deleteTaskById: (taskId: string) => void;
  setReminder: (taskId: string, reminder: ReminderType) => void;
  clearChatText: () => void;
};

function persistTasks(tasks: Task[]) {
  taskRepository.saveAll(tasks);
}

function mergeTasks(currentTasks: Task[], nextTasks: Task[]) {
  const currentIds = new Set(currentTasks.map((task) => task.id));
  return [...nextTasks.filter((task) => !currentIds.has(task.id)), ...currentTasks];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  chatText: "",
  inputError: "",
  tasks: [],
  pendingExtractedTasks: [],
  selectedTaskIds: [],
  taskFilter: "all",
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    set({
      chatText: readStorage<string>(STORAGE_KEYS.chatText, ""),
      tasks: taskRepository.getAll(),
      hydrated: true,
    });
  },

  setChatText(value) {
    writeStorage(STORAGE_KEYS.chatText, value);
    set({ chatText: value, inputError: "" });
    if (value.trim()) trackEvent("chat_pasted", { textLength: value.length });
  },

  fillSampleChat() {
    get().setChatText(SAMPLE_CHAT_TEXT);
  },

  validateChatText() {
    if (get().chatText.trim()) {
      set({ inputError: "" });
      return true;
    }
    set({ inputError: "请先输入聊天内容" });
    return false;
  },

  async runExtraction() {
    const result = await extractTasks(get().chatText);
    useAnalyticsStore.getState().hydrate();
    useAnalyticsStore.getState().recordAnalysis(false);
    get().setPendingExtractedTasks(result.tasks);
    return result.success;
  },

  setPendingExtractedTasks(tasks) {
    set({
      pendingExtractedTasks: tasks,
      selectedTaskIds: tasks.map((task) => task.id),
    });
  },

  clearPendingExtractedTasks() {
    set({ pendingExtractedTasks: [], selectedTaskIds: [] });
  },

  toggleExtractedTask(taskId) {
    const selected = get().selectedTaskIds;
    set({
      selectedTaskIds: selected.includes(taskId)
        ? selected.filter((id) => id !== taskId)
        : [...selected, taskId],
    });
  },

  removeExtractedTask(taskId) {
    set({
      pendingExtractedTasks: get().pendingExtractedTasks.filter((task) => task.id !== taskId),
      selectedTaskIds: get().selectedTaskIds.filter((id) => id !== taskId),
    });
  },

  confirmSelectedTasks() {
    const { pendingExtractedTasks, selectedTaskIds } = get();
    const confirmedTasks = pendingExtractedTasks.filter((task) =>
      selectedTaskIds.includes(task.id),
    );
    get().addTasks(confirmedTasks);
    useAnalyticsStore.getState().hydrate();
    if (confirmedTasks.length) {
      useAnalyticsStore.getState().recordAnalysisSuccess();
    }
    useAnalyticsStore.getState().recordCreatedTasks(confirmedTasks.length);
    trackEvent("task_confirmed", { taskCount: confirmedTasks.length });
    get().clearPendingExtractedTasks();
  },

  addTasks(tasks) {
    const nextTasks = mergeTasks(get().tasks, tasks);
    persistTasks(nextTasks);
    set({ tasks: nextTasks });
  },

  updateTask(task) {
    const nextTasks = get().tasks.map((item) => (item.id === task.id ? task : item));
    persistTasks(nextTasks);
    set({ tasks: nextTasks });
  },

  deleteTask(taskId) {
    const nextTasks = get().tasks.filter((task) => task.id !== taskId);
    persistTasks(nextTasks);
    set({ tasks: nextTasks });
    trackEvent("task_deleted", { taskId });
  },

  completeTask(taskId) {
    const task = get().getTaskById(taskId);
    if (!task) return;
    get().updateTask({ ...task, status: "completed", updatedAt: new Date().toISOString() });
    trackEvent("task_completed", { taskId });
  },

  toggleTaskStatus(taskId) {
    const task = get().getTaskById(taskId);
    if (!task) return;
    get().updateTask({
      ...task,
      status: task.status === "completed" ? "pending" : "completed",
      updatedAt: new Date().toISOString(),
    });
  },

  setTaskFilter(filter) {
    set({ taskFilter: filter });
  },

  getTaskById(taskId) {
    return (
      get().tasks.find((task) => task.id === taskId) ??
      get().pendingExtractedTasks.find((task) => task.id === taskId) ??
      taskRepository.getById(taskId)
    );
  },

  saveTask(taskId, draft) {
    const existingTask = get().getTaskById(taskId);
    const savedTask = existingTask ? buildUpdatedTask(existingTask, draft) : createTask(draft);
    const isPersisted = get().tasks.some((task) => task.id === savedTask.id);
    const isPendingExtracted = get().pendingExtractedTasks.some((task) => task.id === savedTask.id);

    if (isPersisted) {
      get().updateTask(savedTask);
    } else if (isPendingExtracted) {
      set({
        pendingExtractedTasks: get().pendingExtractedTasks.map((task) =>
          task.id === savedTask.id ? savedTask : task,
        ),
      });
    } else {
      get().addTasks([savedTask]);
    }

    return savedTask;
  },

  completeTaskById(taskId) {
    get().completeTask(taskId);
  },

  deleteTaskById(taskId) {
    get().deleteTask(taskId);
  },

  setReminder(taskId, reminder) {
    const task = get().getTaskById(taskId);
    if (!task) return;
    get().updateTask({ ...task, reminder, updatedAt: new Date().toISOString() });
  },

  clearChatText() {
    writeStorage(STORAGE_KEYS.chatText, "");
    set({ chatText: "", inputError: "" });
  },
}));
