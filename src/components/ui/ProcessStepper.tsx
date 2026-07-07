import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { ProgressBar } from "./ProgressBar";

export interface ProcessStep {
  num: number;
  title: string;
  desc?: string;
}

interface ProcessStepperProps {
  activeStep: number;
  heading: string;
  steps: ProcessStep[];
  className?: string;
}

export function ProcessStepper({
  activeStep,
  heading,
  steps,
  className,
}: ProcessStepperProps) {
  const currentStep = steps.find((step) => step.num === activeStep) ?? steps[0];
  const currentStepIndex = Math.max(0, steps.findIndex((step) => step.num === activeStep));
  const progressPercent = steps.length > 1
    ? (currentStepIndex / (steps.length - 1)) * 100
    : 0;

  return (
    <div className={cn("thread-process-stepper", className)}>
      <div className="thread-process-stepper__heading-row">
        <div className="thread-process-stepper__heading">
          {heading}
        </div>
        <div className="thread-process-stepper__counter">
          Step {activeStep} of {steps.length}
        </div>
      </div>

      <div className="thread-process-stepper__mobile-card">
        <div className="thread-process-stepper__mobile-summary">
          <div className="thread-process-stepper__mobile-number">
            {activeStep}
          </div>
          <div className="thread-process-stepper__mobile-copy">
            <div className="thread-process-stepper__mobile-title">
              {currentStep.title}
            </div>
            {currentStep.desc && (
              <div className="thread-process-stepper__mobile-desc">
                {currentStep.desc}
              </div>
            )}
          </div>
        </div>

        <div className="thread-process-stepper__mobile-progress">
          <ProgressBar
            value={progressPercent}
            heightClass="h-0.5"
            className="thread-process-stepper__mobile-meter"
          />
          <div
            className="thread-process-stepper__mobile-grid"
            style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
          >
            {steps.map((step) => {
              const isPast = activeStep > step.num;
              const isCurrent = activeStep === step.num;

              return (
                <div key={step.num} className="thread-process-stepper__mobile-item">
                  <div
                    className={cn(
                      "thread-process-stepper__dot thread-process-stepper__dot--mobile",
                      isPast
                        ? "thread-process-stepper__dot--complete"
                        : isCurrent
                        ? "thread-process-stepper__dot--current"
                        : "thread-process-stepper__dot--upcoming",
                    )}
                    aria-label={`${step.title}: ${isPast ? "complete" : isCurrent ? "current" : "up next"}`}
                  >
                    {isPast ? <Check className="thread-process-stepper__check" /> : step.num}
                  </div>
                  <span
                    className={cn(
                      "thread-process-stepper__mobile-label",
                      isCurrent || isPast ? "thread-process-stepper__label--available" : "thread-process-stepper__label--upcoming",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="thread-process-stepper__desktop-list">
        {steps.map((step) => {
          const isPast = activeStep > step.num;
          const isCurrent = activeStep === step.num;
          return (
            <div key={step.num} className="thread-process-stepper__desktop-item">
              <div
                className={cn(
                  "thread-process-stepper__dot thread-process-stepper__dot--desktop",
                  isPast
                    ? "thread-process-stepper__dot--complete"
                    : isCurrent
                    ? "thread-process-stepper__dot--current thread-process-stepper__dot--current-desktop"
                    : "thread-process-stepper__dot--upcoming",
                )}
              >
                {isPast ? <Check className="thread-process-stepper__check" /> : step.num}
              </div>
              <div>
                <div
                  className={cn(
                    "thread-process-stepper__desktop-title",
                    isCurrent || isPast ? "thread-process-stepper__label--available" : "thread-process-stepper__label--upcoming",
                  )}
                >
                  {step.title}
                </div>
                {step.desc && (
                  <div
                    className={cn(
                      "thread-process-stepper__desktop-desc",
                      isCurrent ? "thread-process-stepper__desc--current" : "thread-process-stepper__label--upcoming",
                    )}
                  >
                    {step.desc}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
