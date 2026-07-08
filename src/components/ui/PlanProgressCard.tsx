import React from "react";
import { Calendar } from "lucide-react";
import { cn } from "../../lib/utils";
import { ProgressBar } from "./ProgressBar";

interface PlanProgressDetail {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface PlanProgressCardProps {
  progress: number;
  statusText: string;
  nextReview: string;
  className?: string;
  title?: string;
  footerLabel?: string;
  details?: PlanProgressDetail[];
  onReschedule?: () => void;
  rescheduleLabel?: string;
}

export function PlanProgressCard({
  progress,
  statusText,
  nextReview,
  className,
  title = "This Quarter's Plan Progress",
  footerLabel = "Next review",
  details,
  onReschedule,
  rescheduleLabel = "Reschedule",
}: PlanProgressCardProps) {
  const parts = statusText.split(" — ");
  const mainStatus = parts[0];
  const subStatus = parts[1];
  const footerDetails = details !== undefined
    ? details
    : nextReview
    ? [
        {
          label: footerLabel,
          value: nextReview,
          icon: <Calendar className="w-4 h-4 stroke-[1.8]" />,
        },
      ]
    : [];

  return (
    <div
      className={cn(
        "bg-[var(--hero-secondary-bg)] text-[var(--hero-secondary-text)] rounded-bl-[32px] p-7.5 flex flex-col h-full",
        className,
        "border-0"
      )}
    >
      <span className="text-[0.68rem] tracking-[0.12em] uppercase opacity-75 font-medium mb-5 block flex-shrink-0">
        {title}
      </span>
      
      <div className="flex flex-col gap-1 mb-5.5">
        <div className="font-serif text-[4rem] leading-[4rem] tracking-[-2.2px]">
          {progress}%
        </div>
        <div className="text-[1.125rem] opacity-80 leading-snug">
          {mainStatus}
          {subStatus ? (
            <>
              {" —"}
              <br />
              <span className="opacity-75 text-[0.95em]">{subStatus}</span>
            </>
          ) : null}
        </div>
      </div>
      
      <div className="flex flex-col mt-auto">
        <div className="mb-5.5">
          <ProgressBar
            value={progress}
            max={100}
            heightClass="h-3"
            isSecondary
            colorClass="bg-[var(--hero-secondary-text)]"
          />
        </div>
        
        {footerDetails.length > 0 && (
          <div className="space-y-2.5 text-[0.84rem] opacity-70 border-t border-current/10 pt-4.5">
            {footerDetails.map((detail) => (
              <div key={`${detail.label}-${detail.value}`} className="flex items-center gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {detail.icon || <Calendar className="w-4 h-4 stroke-[1.8]" />}
                </span>
                <span className="flex-1">
                  {detail.label}:{" "}
                  <strong className="opacity-100 font-medium ml-1">
                    {detail.value}
                  </strong>
                </span>
                {onReschedule && detail.label === footerLabel && (
                  <button
                    type="button"
                    onClick={onReschedule}
                    className="shrink-0 font-medium underline underline-offset-2 decoration-current/40 transition hover:decoration-current"
                  >
                    {rescheduleLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
