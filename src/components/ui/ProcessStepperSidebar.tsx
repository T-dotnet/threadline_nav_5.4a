import { cn } from "../../lib/utils";
import { ProcessStepper, type ProcessStep } from "./ProcessStepper";

export type ProcessStepperMobileBehavior = "stacked" | "hidden" | "right-rail";

interface ProcessStepperSidebarProps {
  activeStep: number;
  completedSteps?: number[];
  heading: string;
  steps: ProcessStep[];
  side?: "left" | "right";
  mobileBehavior?: ProcessStepperMobileBehavior;
  mobileBorder?: "top" | "bottom" | "none";
  className?: string;
  onStepSelect?: (step: ProcessStep) => void;
}

export function ProcessStepperSidebar({
  activeStep,
  completedSteps,
  heading,
  steps,
  side = "left",
  mobileBehavior = "stacked",
  mobileBorder = "bottom",
  className,
  onStepSelect,
}: ProcessStepperSidebarProps) {
  const stackedMobileBorder = mobileBehavior === "stacked" && (
    mobileBorder === "top"
      ? "border-t border-black/5"
      : mobileBorder === "bottom"
      ? "border-b border-black/5"
      : ""
  );

  return (
    <aside
      className={cn(
        "w-full shrink-0 bg-[var(--color-thread-off-white)] px-6 py-7 font-sans",
        side === "right" && "md:w-72 md:border-l md:border-black/5",
        side === "left" && "md:w-[300px] md:border-r md:border-black/5",
        mobileBehavior === "right-rail" && "thread-process-stepper-sidebar--mobile-rail max-md:absolute max-md:right-3 max-md:top-1/2 max-md:z-20 max-md:!h-auto max-md:!w-11 max-md:-translate-y-1/2 max-md:rounded-full max-md:border max-md:border-black/10 max-md:bg-white/95 max-md:!px-0 max-md:!py-3 max-md:shadow-[0_14px_32px_rgba(15,23,42,0.16)] max-md:backdrop-blur",
        mobileBehavior === "hidden" ? "max-md:hidden" : stackedMobileBorder,
        "md:border-b-0 md:border-t-0",
        className,
      )}
    >
      <ProcessStepper
        activeStep={activeStep}
        completedSteps={completedSteps}
        heading={heading}
        steps={steps}
        onStepSelect={onStepSelect}
      />
    </aside>
  );
}
