import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function IconButton({ children, className = "", ...props }: IconButtonProps) {
  return (
    <button
      className={`grid size-10 place-items-center rounded-full bg-white text-slate-600 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
