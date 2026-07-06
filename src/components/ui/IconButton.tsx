import * as React from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"
import { buttonPress } from "../../lib/motion-presets"

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hasBadge?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, hasBadge, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref as any}
        {...buttonPress}
        type="button"
        className={cn(
          "thread-icon-button group",
          className
        )}
        {...(props as any)}
      >
        {hasBadge && (
          <span className="thread-icon-button__badge" />
        )}
        {children}
      </motion.button>
    )
  }
)
IconButton.displayName = "IconButton"
