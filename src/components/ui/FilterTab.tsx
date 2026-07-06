import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "../../lib/utils"
import { buttonPress } from "../../lib/motion-presets"

export interface FilterTabProps extends HTMLMotionProps<"button"> {
  active?: boolean;
  label: string;
}

export const FilterTab = React.forwardRef<HTMLButtonElement, FilterTabProps>(
  ({ className, active, label, onClick, ...props }, ref) => {
    return (
      <motion.button
        ref={ref as any}
        {...buttonPress}
        onClick={onClick}
        className={cn(
          "thread-filter-tab",
          active
            ? "thread-filter-tab--active"
            : "thread-filter-tab--inactive",
          className
        )}
        {...props}
      >
        {label}
      </motion.button>
    )
  }
)
FilterTab.displayName = "FilterTab"
