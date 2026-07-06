import React from "react";
import { cn } from "../../lib/utils";

interface SurfacePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  radiusClassName?: string;
  paddingClassName?: string;
  shadowClassName?: string;
}

export function SurfacePanel({
  className,
  radiusClassName = "rounded-tr-[36px]",
  paddingClassName = "p-8",
  shadowClassName = "shadow-premium-light",
  ...props
}: SurfacePanelProps) {
  return (
    <div
      className={cn("bg-white", radiusClassName, paddingClassName, shadowClassName, className)}
      {...props}
    />
  );
}
