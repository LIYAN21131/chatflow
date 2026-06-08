import { Card } from "@/components/ui";

type HistoryStatsCardProps = {
  analysisCount: number;
  analysisSuccessCount: number;
};

export function HistoryStatsCard({ analysisCount, analysisSuccessCount }: HistoryStatsCardProps) {
  const successRate = analysisCount ? Math.round((analysisSuccessCount / analysisCount) * 100) : 0;
  const historyStats = [
    { label: "最近7天识别", value: `${analysisCount}次` },
    { label: "识别成功", value: `${analysisSuccessCount}次` },
    { label: "识别成功率", value: `${successRate}%` },
    { label: "平均识别耗时", value: "2.1秒" },
  ] as const;

  return (
    <Card>
      <h2 className="mb-3 text-[17px] font-semibold">识别历史</h2>
      <div className="grid grid-cols-2 gap-3">
        {historyStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 p-3">
            <p className="text-[20px] font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
