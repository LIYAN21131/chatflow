"use client";

import { Check } from "lucide-react";
import { Card } from "@/components/ui";

export type DefaultReminderOption = "提前10分钟" | "提前1小时" | "提前1天" | "不提醒";

const reminderOptions: DefaultReminderOption[] = ["提前10分钟", "提前1小时", "提前1天", "不提醒"];

type ReminderSettingCardProps = {
  value: DefaultReminderOption;
  onChange: (value: DefaultReminderOption) => void;
};

export function ReminderSettingCard({ value, onChange }: ReminderSettingCardProps) {
  return (
    <Card>
      <h2 className="mb-2 text-[17px] font-semibold">默认提醒</h2>
      <div className="space-y-1">
        {reminderOptions.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className="flex h-12 w-full items-center justify-between rounded-2xl px-2 text-left"
          >
            <span className="text-[15px] font-medium text-slate-700">{option}</span>
            <span
              className={`grid size-6 place-items-center rounded-full border ${
                value === option ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
              }`}
            >
              {value === option && <Check size={15} />}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
