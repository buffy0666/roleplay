import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({
  className = "",
  interactive = false,
  ...rest
}: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-[var(--radius-card)] ${
        interactive
          ? "transition-all duration-200 hover:border-foreground/20 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.08)]"
          : ""
      } ${className}`}
      {...rest}
    />
  );
}

export function CardHeader({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pb-4 ${className}`} {...rest} />;
}

export function CardBody({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 pb-6 ${className}`} {...rest} />;
}

export function CardFooter({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 py-4 border-t border-border flex items-center justify-between ${className}`}
      {...rest}
    />
  );
}
