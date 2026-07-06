import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

export function FloatingActionButton({
  icon,
  label,
  className,
  type = "button",
  ...props
}: FloatingActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "thread-fab",
        className,
      )}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}
