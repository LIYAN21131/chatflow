import { Card } from "@/components/ui";

type StatsOverviewProps = {
  todayTasks: number;
  upcomingTasks: number;
  overdueTasks: number;
};

export function StatsOverview({ todayTasks, upcomingTasks, overdueTasks }: StatsOverviewProps) {
  const overviewStats = [
    { label: "今日待办", value: String(todayTasks) },
    { label: "即将到期", value: String(upcomingTasks) },
    { label: "已逾期", value: String(overdueTasks) },
  ] as const;

  return (
    <section>
      <h2 className="mb-3 text-[17px] font-semibold">任务数据概览</h2>
      <div className="grid grid-cols-3 gap-3">
        {overviewStats.map((stat) => (
          <Card key={stat.label} className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
