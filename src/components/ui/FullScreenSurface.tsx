import type { HTMLMotionProps } from "motion/react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface FullScreenSurfaceProps extends HTMLMotionProps<"div"> {
  fixed?: boolean;
  tone?: "watercolor" | "white";
  zIndexClassName?: string;
}

export function FullScreenSurface({
  fixed = true,
  tone = "watercolor",
  zIndexClassName = "thread-z-modal",
  className,
  ...props
}: FullScreenSurfaceProps) {
  return (
    <motion.div
      className={cn(
        fixed ? "fixed inset-0" : "relative min-h-screen",
        fixed && zIndexClassName,
        "flex flex-col overflow-y-auto font-sans",
        tone === "watercolor" ? "bg-watercolor bg-fixed" : "bg-white",
        className,
      )}
      {...props}
    />
  );
}
