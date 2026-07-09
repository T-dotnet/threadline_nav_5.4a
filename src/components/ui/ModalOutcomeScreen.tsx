import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

interface ModalOutcomeScreenProps {
  titleId?: string;
  kicker?: string;
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  iconClassName?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function ModalOutcomeScreen({
  titleId,
  kicker = "Complete",
  title,
  description,
  icon,
  iconClassName,
  actionLabel,
  onAction,
  actionIcon,
  className,
  children,
}: ModalOutcomeScreenProps) {
  return (
    <div className={cn("flex min-h-[360px] max-w-2xl flex-col justify-center space-y-6", className)}>
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]",
          iconClassName,
        )}
      >
        {icon}
      </span>
      <div className="space-y-3">
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {kicker}
        </span>
        <h2 id={titleId} className="font-serif text-3xl font-normal leading-tight text-[var(--color-thread-heading)]">
          {title}
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
      {children}
      {actionLabel && onAction && (
        <Button
          type="button"
          variant="primary"
          onClick={onAction}
          className="h-10 w-fit rounded-full px-5 text-xs font-semibold shadow-none"
          rightIcon={actionIcon ?? <ArrowRight className="h-3.5 w-3.5" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
