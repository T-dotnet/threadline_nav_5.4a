import * as React from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"
import { ChevronRight } from "lucide-react"
import { buttonPress } from "../../lib/motion-presets"

export function QuickLink({ label, onClick }: any) {
  return (
    <motion.div
      {...buttonPress}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 py-4 px-0.5 border-t border-black/10 transition-all",
        onClick ? "cursor-pointer group" : "cursor-default opacity-50",
      )}
    >
      <span className="flex-1 text-[0.96rem] font-medium group-hover:text-[var(--color-thread-mid-green)] transition-colors">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-slate-500 stroke-[1.8]" />
    </motion.div>
  );
}
