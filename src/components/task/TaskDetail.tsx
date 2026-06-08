import { Bell } from "lucide-react";
import { InfoRow } from "@/components/common/InfoRow";
import { Button, Card, PriorityPill } from "@/components/ui";
import { priorityLabels, reminderLabels, statusLabels } from "@/lib/taskLabels";
import { getTaskTimeLabel } from "@/lib/taskTime";
import type { Task } from "@/types/task";

type TaskDetailProps = {
  task: Task;
  onReminderClick: () => void;
};

function getTimeRow(task: Task) {
  if (task.timeType === "unknown") {
    return { label: "时间", value: "时间待确认" };
  }

  if (task.timeType === "event") {
    return {
      label: "时间",
      value: getTaskTimeLabel(task).replace(
        /^(考试时间|会议时间|上课时间|讲座时间|面试时间|集合时间|事件时间)\s/,
        "",
      ),
    };
  }

  return { label: "截止时间", value: getTaskTimeLabel(task).replace("截止时间 ", "") };
}

export function TaskDetail({ task, onReminderClick }: TaskDetailProps) {
  const timeRow = getTimeRow(task);

  return (
    <div className="space-y-4 pb-20">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="break-words text-xl font-bold leading-snug text-slate-900">
              {task.title}
            </p>
            {task.summary && task.summary !== task.title && (
              <p className="mt-2 break-words text-sm font-semibold text-slate-600">
                {task.summary}
              </p>
            )}
            <p className="mt-3 text-sm text-slate-500">状态：{statusLabels[task.status]}</p>
          </div>
          <PriorityPill value={task.priority} />
        </div>
      </Card>
      <Card className="space-y-4">
        <InfoRow label={timeRow.label} value={timeRow.value} />
        {task.location && <InfoRow label="地点" value={task.location} />}
        <InfoRow label="分类" value={task.category} />
        <InfoRow
          label="置信度"
          value={`${task.confidence}%${task.confidence < 70 ? "，建议确认" : ""}`}
        />
        <InfoRow label="优先级" value={priorityLabels[task.priority]} />
        <InfoRow label="提醒" value={reminderLabels[task.reminder]} />
        <InfoRow label="创建时间" value={new Date(task.createdAt).toLocaleString("zh-CN")} />
      </Card>
      <Card>
        <p className="mb-2 text-sm font-semibold text-slate-700">来源聊天内容</p>
        <p className="break-all text-sm leading-7 text-slate-500">{task.sourceText}</p>
      </Card>
      <Button
        variant="ghost"
        onClick={onReminderClick}
        className="flex items-center justify-center gap-2"
      >
        <Bell size={18} />
        设置提醒
      </Button>
    </div>
  );
}
