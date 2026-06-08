import { priorityLabels } from "@/lib/taskLabels";
import type { Priority } from "@/types/task";

const priorityClassName: Record<Priority, string> = {
  high: "bg-rose-50 text-rose-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-emerald-50 text-emerald-600",
};

export function PriorityPill({ value }: { value: Priority }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClassName[value]}`}>
      {priorityLabels[value]}
    </span>
  );
}
