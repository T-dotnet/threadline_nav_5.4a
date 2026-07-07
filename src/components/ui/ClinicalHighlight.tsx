import React from "react";
import { cn } from "../../lib/utils";

interface ClinicalHighlightProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  titleClassName?: string;
  bodyClassName?: string;
  iconClassName?: string;
}

export function ClinicalHighlight({
  className,
  icon,
  title,
  titleClassName,
  bodyClassName,
  iconClassName,
  children,
  ...props
}: ClinicalHighlightProps) {
  return (
    <div
      className={cn(
        "rounded-none rounded-tr-[24px] bg-[var(--color-thread-light-green)]/60 p-5 text-sm text-slate-700 shadow-none ring-0",
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3.5">
        {icon && (
          <div
            className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-[var(--color-thread-mid-green)] shadow-none ring-0",
              iconClassName,
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {title && (
            <p
              className={cn(
                "mb-1 text-[0.9rem] font-semibold leading-snug text-[var(--color-thread-heading)]",
                titleClassName,
              )}
            >
              {title}
            </p>
          )}
          <div className={cn("leading-relaxed", bodyClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
