import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface QuestionOptionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  selected: boolean;
  marker: React.ReactNode;
  children: React.ReactNode;
  markerClassName?: string;
  showCheck?: boolean;
}

export function QuestionOption({
  selected,
  marker,
  children,
  className,
  markerClassName,
  showCheck = true,
  type = "button",
  ...props
}: QuestionOptionProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-center justify-between rounded-none rounded-tr-[20px] border p-4 text-left shadow-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/25",
        selected
          ? "border-[var(--color-thread-mid-green)]/30 bg-[var(--color-thread-light-green)] font-medium text-[var(--style-light-surface-text)]"
          : "border-black/10 bg-white text-[var(--color-thread-dark-slate)] hover:border-black/20 hover:bg-[var(--color-thread-off-white)]/60",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
            selected
              ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-mid-green)] text-white"
              : "border-black/10 bg-white text-[var(--color-thread-muted-text)] group-hover:border-black/20 group-hover:text-[var(--color-thread-dark-slate)]",
            markerClassName,
          )}
        >
          {marker}
        </span>
        <span className="min-w-0 text-[0.95rem]">{children}</span>
      </span>
      {selected && showCheck && (
        <Check className="h-4 w-4 shrink-0 text-[var(--color-thread-mid-green)]" aria-hidden="true" />
      )}
    </button>
  );
}
