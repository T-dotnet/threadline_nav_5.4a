import { cn } from "../../lib/utils";
import { ProcessStepper, type ProcessStep } from "./ProcessStepper";

interface ProcessStepperSidebarProps {
  activeStep: number;
  heading: string;
  steps: ProcessStep[];
  side?: "left" | "right";
  mobileBehavior?: "stacked" | "hidden";
  mobileBorder?: "top" | "bottom" | "none";
  className?: string;
}

export function ProcessStepperSidebar({
  activeStep,
  heading,
  steps,
  side = "left",
  mobileBehavior = "stacked",
  mobileBorder = "bottom",
  className,
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
        side === "left" && "md:w-[250px] md:border-r md:border-black/5",
        mobileBehavior === "hidden" ? "max-md:hidden" : stackedMobileBorder,
        "md:border-b-0 md:border-t-0",
        className,
      )}
    >
      <ProcessStepper
        activeStep={activeStep}
        heading={heading}
        steps={steps}
      />
    </aside>
  );
}
