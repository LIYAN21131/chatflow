"use client";

import { Download, RotateCcw, Trash2 } from "lucide-react";
import { Card } from "@/components/ui";

const dataActions = [
  { label: "导出任务", icon: Download },
  { label: "清空历史记录", icon: Trash2 },
  { label: "恢复默认设置", icon: RotateCcw },
] as const;

type DataManagementCardProps = {
  onUnavailableAction: () => void;
};

export function DataManagementCard({ onUnavailableAction }: DataManagementCardProps) {
  return (
    <Card>
      <h2 className="mb-2 text-[17px] font-semibold">数据管理</h2>
      <div className="space-y-1">
        {dataActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={onUnavailableAction}
              className="flex h-12 w-full items-center gap-3 rounded-2xl px-2 text-left"
            >
              <span className="grid size-9 place-items-center rounded-full bg-blue-50 text-blue-600">
                <Icon size={18} />
              </span>
              <span className="text-[15px] font-medium text-slate-700">{action.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
