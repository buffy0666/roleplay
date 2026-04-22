import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full h-10 px-3.5 rounded-lg bg-surface border border-border text-[14px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-brand/20 ${className}`}
      {...rest}
    />
  );
}
