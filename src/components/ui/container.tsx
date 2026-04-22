import type { HTMLAttributes } from "react";

export function Container({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`w-full max-w-6xl mx-auto px-6 sm:px-8 ${className}`}
      {...rest}
    />
  );
}
