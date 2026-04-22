import type { Ref, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: Ref<HTMLTextAreaElement>;
};

export function Textarea({
  className = "",
  rows = 3,
  ref,
  ...rest
}: TextareaProps) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-[14px] leading-6 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-brand/20 resize-y ${className}`}
      {...rest}
    />
  );
}
