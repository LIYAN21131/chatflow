import { Card } from "@/components/ui";

type ProgressCardProps = {
  progress: number;
};

export function ProgressCard({ progress }: ProgressCardProps) {
  const dash = `${progress * 2.64} 264`;

  return (
    <Card className="flex flex-col items-center py-8">
      <div className="relative grid size-36 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="42" stroke="#e2e8f0" strokeWidth="8" fill="none" />
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="#2563eb"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={dash}
          />
        </svg>
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">{progress}%</p>
          <p className="mt-1 text-xs text-slate-400">AI 分析</p>
        </div>
      </div>
      <p className="mt-5 text-[17px] font-semibold">正在整理聊天中的任务信息</p>
      <p className="mt-2 text-sm text-slate-500">预计 2 秒内完成</p>
    </Card>
  );
}
