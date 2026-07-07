import { CalendarClock } from "lucide-react";
import { DEFAULT_CLINICIAN_NAME } from "../../lib/clinicalProvider";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface FirstSessionCardProps {
  date?: string;
  time?: string;
  label?: string;
  detail?: string;
  provider?: string;
  isBooked?: boolean;
  isCancelled?: boolean;
  onBook?: () => void;
  onReschedule?: () => void;
  className?: string;
  titleText?: string;
  descriptionText?: string;
  buttonText?: string;
}

export function FirstSessionCard({
  date,
  time,
  label = "First session",
  detail = "Telehealth",
  provider = DEFAULT_CLINICIAN_NAME,
  isBooked = true,
  isCancelled = false,
  onBook,
  onReschedule,
  className,
  titleText,
  descriptionText,
  buttonText,
}: FirstSessionCardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] rounded-bl-[32px] p-7.5 flex flex-col h-full min-h-[260px]",
        className
      )}
    >
      <span className="text-[0.68rem] tracking-[0.12em] uppercase opacity-75 font-medium mb-5 block">
        {isBooked ? label : "Pathway"}
      </span>
      {isBooked ? (
        <>
          <div className="w-12 h-12 rounded-full bg-[var(--color-thread-mid-green)] text-white flex items-center justify-center mb-6">
            <CalendarClock className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div className="font-serif text-[2.4rem] leading-[1.05] tracking-tight text-[var(--style-light-surface-text)]">
            {date}
          </div>
          <div className="mt-2 text-[1rem] opacity-75">
            {time}{detail ? ` · ${detail}` : ""}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-current/10 pt-5 text-[0.84rem]">
            <span className="opacity-70">{provider}</span>
            {onReschedule && (
              <button
                type="button"
                onClick={onReschedule}
                className="shrink-0 font-medium text-[var(--color-thread-mid-green)] underline underline-offset-2 decoration-current/40 transition hover:decoration-current"
              >
                Reschedule
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="font-serif text-[2.2rem] leading-[1.05] tracking-tight text-[var(--style-light-surface-text)]">
            {titleText || "Choose your path"}
          </div>
          <p className="mt-3 text-[0.92rem] leading-relaxed opacity-70">
            {descriptionText || "Select Diagnostic Assessment or Navigator Care Program to begin your journey."}
          </p>
          {onBook && (
            <Button
              type="button"
              onClick={onBook}
              variant="primary"
              className="mt-6 sm:mt-8 w-full sm:w-auto self-start"
            >
              {buttonText || "Choose your path"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
