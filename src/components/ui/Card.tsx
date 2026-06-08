import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <section className={`rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </section>
  );
}
