import { cn } from "../../lib/utils";
import { ProcessStepper, type ProcessStep } from "./ProcessStepper";

interface ProcessStepperSidebarProps {
  activeStep: number;
  completedSteps?: number[];
  heading: string;
  steps: ProcessStep[];
  side?: "left" | "right";
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
  mobileBorder = "bottom",
  className,
  onStepSelect,
}: ProcessStepperSidebarProps) {
  const stackedMobileBorder = mobileBorder === "top"
    ? "border-t border-black/5"
    : mobileBorder === "bottom"
    ? "border-b border-black/5"
    : "";

  return (
    <aside
      className={cn(
        "w-full shrink-0 bg-[var(--color-thread-off-white)] px-6 py-7 font-sans",
        side === "right" && "md:w-72 md:border-l md:border-black/5",
        side === "left" && "md:w-[300px] md:border-r md:border-black/5",
        stackedMobileBorder,
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
