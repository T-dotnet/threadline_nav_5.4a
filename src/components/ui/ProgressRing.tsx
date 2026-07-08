import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ProgressRingProps {
  value: number;
  label?: string;
  children?: ReactNode;
  className?: string;
  centerClassName?: string;
  complete?: boolean;
  centerAriaHidden?: boolean;
}

export function ProgressRing({
  value,
  label,
  children,
  className,
  centerClassName,
  complete = false,
  centerAriaHidden = true,
}: ProgressRingProps) {
  const normalizedValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      className={cn(
        "thread-progress-ring relative shrink-0 rounded-full",
        complete && "thread-progress-ring--complete",
        className,
      )}
      style={{ "--section-progress": `${normalizedValue}%` } as CSSProperties}
      aria-label={label ?? `${normalizedValue}% complete`}
    >
      <div
        className={cn(
          "thread-progress-ring__center flex h-full w-full items-center justify-center rounded-full transition-colors",
          complete && "thread-progress-ring__center--complete",
          centerClassName,
        )}
        aria-hidden={centerAriaHidden}
      >
        {children}
      </div>
    </div>
  );
}
