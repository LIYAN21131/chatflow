"use client";

import Link from "next/link";
import { Bot, CheckSquare, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { ROUTES } from "@/constants/config";

type TabName = "识别" | "待办" | "我的";

type AppShellProps = {
  children: ReactNode;
  activeTab?: TabName;
  hideTab?: boolean;
};

const tabs = [
  { label: "识别", href: ROUTES.home, icon: Bot },
  { label: "待办", href: ROUTES.todos, icon: CheckSquare },
  { label: "我的", href: ROUTES.settings, icon: UserRound },
] as const;

export function AppShell({ children, activeTab = "识别", hideTab = false }: AppShellProps) {
  return (
    <main className="min-h-dvh bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#f7f9fc] shadow-2xl shadow-slate-300/50">
        <div className="flex-1 overflow-y-auto px-5 pb-24 pt-6">{children}</div>
        {!hideTab && (
          <nav className="fixed bottom-0 left-1/2 z-20 grid h-20 w-full max-w-[430px] -translate-x-1/2 grid-cols-3 border-t border-slate-200 bg-white/95 px-6 pb-4 pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.label;
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
                    isActive ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.6 : 2} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </main>
  );
}
