import type { SelectHTMLAttributes } from "react";

export function Select({
  className = "",
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={`appearance-none w-full h-10 pl-3.5 pr-9 rounded-lg bg-surface border border-border text-[14px] text-foreground transition-colors focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-brand/20 ${className}`}
        {...rest}
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      >
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {hint ? (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {children}
    </label>
  );
}
