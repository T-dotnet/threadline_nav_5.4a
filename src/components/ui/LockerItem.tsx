import * as React from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"
import { ActionLink } from "./ActionLink"
import { scaleHover } from "../../lib/motion-presets"

export function LockerItem({
  icon,
  title,
  description,
  action,
  cornerClass = "rounded-[18px]",
  className,
}: any) {
  return (
    <motion.div 
      {...scaleHover}
      className={cn("bg-[var(--style-card-bg)] p-6 flex flex-col transition-all cursor-pointer", cornerClass, className, "border-0")}
    >
      <div className="w-[38px] h-[38px] rounded-[10px] bg-[var(--style-card-icon-bg)] text-[var(--style-card-icon-text)] flex items-center justify-center mb-3.5">
        {icon}
      </div>
      <h3 className="thread-sans-heading text-[1.02rem] font-medium tracking-tight mb-1.75 text-[var(--style-card-text)] leading-tight">
        {title}
      </h3>
      <p className="text-[0.86rem] text-[var(--style-card-muted)] leading-relaxed mb-3.5">
        {description}
      </p>
      {action && (
        <div className="mt-auto pt-2">
          <ActionLink variant="default" as="span" className="group-hover:opacity-70 pointer-events-none">
            {action}
          </ActionLink>
        </div>
      )}
    </motion.div>
  );
}
