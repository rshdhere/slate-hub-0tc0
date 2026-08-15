import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-3.5 text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] transition-shadow focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/25",
        className,
      )}
      {...props}
    />
  );
}
