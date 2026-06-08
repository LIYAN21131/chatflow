"use client";

import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  onBack?: () => void;
  action?: ReactNode;
};

export function PageHeader({ title, onBack, action }: PageHeaderProps) {
  return (
    <header className="mb-5 flex h-11 items-center justify-between">
      <button
        onClick={onBack}
        className={`grid size-10 place-items-center rounded-full bg-white text-slate-700 shadow-sm ${
          onBack ? "" : "invisible"
        }`}
        aria-label="返回"
      >
        <ArrowLeft size={20} />
      </button>
      <h1 className="text-[18px] font-semibold">{title}</h1>
      <div className="grid size-10 place-items-center">{action}</div>
    </header>
  );
}
