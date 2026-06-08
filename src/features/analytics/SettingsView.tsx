"use client";

import { useEffect, useState } from "react";
import { AIPreferenceCard, type AIPreferences } from "@/components/settings/AIPreferenceCard";
import { DataManagementCard } from "@/components/settings/DataManagementCard";
import { HistoryStatsCard } from "@/components/settings/HistoryStatsCard";
import { ProfileCard } from "@/components/settings/ProfileCard";
import {
  ReminderSettingCard,
  type DefaultReminderOption,
} from "@/components/settings/ReminderSettingCard";
import { StatsOverview } from "@/components/settings/StatsOverview";
import { AppShell } from "@/components/layout/AppShell";
import { useHydrateTaskStore } from "@/hooks/useHydrateTaskStore";
import {
  getCompletedTasks,
  getCompletionRate,
  getContinuousCompletionDays,
  getOverdueTasks,
  getTodayTasks,
  getTotalTasks,
  getUpcomingTasks,
} from "@/lib/taskStats";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { useTaskStore } from "@/store/useTaskStore";

const defaultPreferences: AIPreferences = {
  autoTime: true,
  autoPriority: true,
  mergeDuplicate: true,
  allowManualCreate: true,
};

export function SettingsView() {
  const [defaultReminder, setDefaultReminder] = useState<DefaultReminderOption>("提前1小时");
  const [preferences, setPreferences] = useState<AIPreferences>(defaultPreferences);
  const tasks = useTaskStore((state) => state.tasks);
  const analysisCount = useAnalyticsStore((state) => state.analysisCount);
  const analysisSuccessCount = useAnalyticsStore((state) => state.analysisSuccessCount);
  const hydrateAnalytics = useAnalyticsStore((state) => state.hydrate);

  useHydrateTaskStore();

  useEffect(() => {
    hydrateAnalytics();
  }, [hydrateAnalytics]);

  const handlePreferenceChange = (key: keyof AIPreferences, value: boolean) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const showUnavailableNotice = () => {
    window.alert("当前为演示版本，功能暂未开放");
  };

  return (
    <AppShell activeTab="我的">
      <div className="space-y-4 pt-2">
        <div>
          <p className="text-sm font-medium text-blue-600">我的 / 设置</p>
          <h1 className="mt-2 text-[24px] font-bold">我的</h1>
        </div>

        <ProfileCard
          totalTasks={getTotalTasks(tasks)}
          completedTasks={getCompletedTasks(tasks)}
          completionRate={getCompletionRate(tasks)}
          continuousDays={getContinuousCompletionDays()}
        />
        <StatsOverview
          todayTasks={getTodayTasks(tasks)}
          upcomingTasks={getUpcomingTasks(tasks)}
          overdueTasks={getOverdueTasks(tasks)}
        />
        <ReminderSettingCard value={defaultReminder} onChange={setDefaultReminder} />
        <AIPreferenceCard preferences={preferences} onChange={handlePreferenceChange} />
        <HistoryStatsCard
          analysisCount={analysisCount}
          analysisSuccessCount={analysisSuccessCount}
        />
        <DataManagementCard onUnavailableAction={showUnavailableNotice} />
      </div>
    </AppShell>
  );
}
