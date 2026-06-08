"use client";

import { Card } from "@/components/ui";

export type AIPreferences = {
  autoTime: boolean;
  autoPriority: boolean;
  mergeDuplicate: boolean;
  allowManualCreate: boolean;
};

const preferenceItems: Array<{
  key: keyof AIPreferences;
  label: string;
}> = [
  { key: "autoTime", label: "自动识别时间" },
  { key: "autoPriority", label: "自动识别优先级" },
  { key: "mergeDuplicate", label: "自动合并重复任务" },
  { key: "allowManualCreate", label: "识别失败时允许手动创建" },
];

type AIPreferenceCardProps = {
  preferences: AIPreferences;
  onChange: (key: keyof AIPreferences, value: boolean) => void;
};

export function AIPreferenceCard({ preferences, onChange }: AIPreferenceCardProps) {
  return (
    <Card>
      <h2 className="mb-2 text-[17px] font-semibold">AI识别偏好</h2>
      <div className="space-y-1">
        {preferenceItems.map((item) => (
          <div key={item.key} className="flex h-12 items-center justify-between rounded-2xl px-2">
            <span className="text-[15px] font-medium text-slate-700">{item.label}</span>
            <button
              onClick={() => onChange(item.key, !preferences[item.key])}
              className={`relative h-7 w-12 rounded-full transition ${
                preferences[item.key] ? "bg-blue-600" : "bg-slate-300"
              }`}
              aria-label={item.label}
            >
              <span
                className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition ${
                  preferences[item.key] ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
