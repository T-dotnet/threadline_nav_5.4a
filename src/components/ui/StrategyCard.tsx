import * as React from "react";
import { cn } from "../../lib/utils";
import { StrategyCardProps } from "../../types";

export function StrategyCard({
  title,
  icon,
  items,
  cornerClass = "rounded-[18px]",
  className,
}: StrategyCardProps) {
  return (
    <div
      className={cn(
        "bg-white p-6.5",
        cornerClass,
        className
      )}
    >
      <div className="flex items-center gap-2.75 mb-3.5">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-[1.05rem] font-medium tracking-tight leading-none text-[var(--color-thread-dark-slate)]">
          {title}
        </h3>
      </div>
      <div className="flex flex-col">
        {items.map((item: string, i: number) => (
          <div
            key={i}
            className={cn(
              "flex gap-2.75 py-2.75 border-t border-[var(--color-thread-light-gray)]/50 text-[0.92rem] text-[var(--color-thread-dark-slate)] leading-relaxed",
              i === 0 && "border-t-0 pt-0",
            )}
          >
            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--color-thread-mid-green)] mt-[8px]" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
