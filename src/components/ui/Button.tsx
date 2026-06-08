import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-lg shadow-blue-600/20 disabled:bg-slate-300 disabled:shadow-none",
  secondary: "border border-slate-200 bg-white text-slate-700",
  ghost: "bg-blue-50 text-blue-600",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`h-12 w-full rounded-2xl px-5 text-[15px] font-semibold transition active:scale-[0.99] ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
