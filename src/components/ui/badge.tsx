import type { HTMLAttributes } from "react";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  brand: "bg-brand-soft text-brand border-transparent",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-transparent",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400 border-transparent",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
};

export function Badge({ tone = "neutral", className = "", ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 h-6 rounded-[var(--radius-pill)] border text-[11px] font-medium tracking-wide uppercase ${tones[tone]} ${className}`}
      {...rest}
    />
  );
}
