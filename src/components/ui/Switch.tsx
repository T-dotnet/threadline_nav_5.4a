import * as React from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"

export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCheckedChange(!checked);
          }
        }}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "w-11 h-6 rounded-full transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/30",
          checked ? "bg-[var(--color-thread-mid-green)]" : "bg-slate-200",
          className
        )}
        {...props}
      >
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className={cn(
            "w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5",
            checked ? "right-0.5" : "left-0.5"
          )}
        />
      </div>
    )
  }
)
Switch.displayName = "Switch"
