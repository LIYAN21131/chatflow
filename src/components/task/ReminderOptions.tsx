"use client";

import { Check } from "lucide-react";
import { REMINDER_OPTIONS } from "@/constants/reminder";
import { reminderLabels } from "@/lib/taskLabels";
import type { ReminderType } from "@/types/task";

type ReminderOptionsProps = {
  value: ReminderType;
  onChange: (value: ReminderType) => void;
};

export function ReminderOptions({ value, onChange }: ReminderOptionsProps) {
  return (
    <div className="space-y-2">
      {REMINDER_OPTIONS.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className="flex h-14 w-full items-center justify-between rounded-2xl px-3 text-left"
        >
          <span className="font-medium text-slate-700">{reminderLabels[option]}</span>
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
  );
}
