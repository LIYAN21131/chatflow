import type { ReactNode } from "react";
import { Card } from "@/components/ui";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function EmptyState({ icon, title, description, actions }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center px-6 py-10 text-center">
      <div className="grid size-20 place-items-center rounded-full bg-rose-50 text-rose-500">
        {icon}
      </div>
      <h1 className="mt-6 text-xl font-bold">{title}</h1>
      <p className="mt-3 text-[15px] leading-7 text-slate-500">{description}</p>
      {actions && <div className="mt-8 w-full space-y-3">{actions}</div>}
    </Card>
  );
}
