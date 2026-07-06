import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface WatercolorPanelProps extends HTMLAttributes<HTMLDivElement> {
  innerClassName?: string;
}

export function WatercolorPanel({
  children,
  className,
  innerClassName,
  ...props
}: WatercolorPanelProps) {
  return (
    <div
      className={cn("relative rounded-br-[36px] bg-watercolor p-12", className)}
      {...props}
    >
      {innerClassName ? (
        <div className={innerClassName}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
