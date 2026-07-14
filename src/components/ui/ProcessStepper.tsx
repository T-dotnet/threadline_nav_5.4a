import { useEffect, useId, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { ProgressBar } from "./ProgressBar";

export interface ProcessStep {
  num: number;
  title: string;
  desc?: string;
}

interface ProcessStepperProps {
  activeStep: number;
  completedSteps?: number[];
  heading: string;
  steps: ProcessStep[];
  className?: string;
  onStepSelect?: (step: ProcessStep) => void;
}

export function ProcessStepper({
  activeStep,
  completedSteps,
  heading,
  steps,
  className,
  onStepSelect,
}: ProcessStepperProps) {
  const [isMobileSelectorOpen, setIsMobileSelectorOpen] = useState(false);
  const mobileSelectorId = useId();
  const currentStep = steps.find((step) => step.num === activeStep) ?? steps[0];
  const currentStepIndex = Math.max(0, steps.findIndex((step) => step.num === activeStep));
  const progressPercent = steps.length > 1
    ? (currentStepIndex / (steps.length - 1)) * 100
    : 0;

  useEffect(() => {
    setIsMobileSelectorOpen(false);
  }, [activeStep]);

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

      <div className={cn("thread-process-stepper__mobile-card", onStepSelect && "thread-process-stepper__mobile-card--selectable")}>
        {onStepSelect ? (
          <>
            <button
              type="button"
              className="thread-process-stepper__mobile-trigger"
              aria-expanded={isMobileSelectorOpen}
              aria-controls={mobileSelectorId}
              onClick={() => setIsMobileSelectorOpen((isOpen) => !isOpen)}
            >
              <span className="thread-process-stepper__mobile-summary">
                <span className="thread-process-stepper__mobile-number">
                  {activeStep}
                </span>
                <span className="thread-process-stepper__mobile-copy">
                  <span className="thread-process-stepper__mobile-title-row">
                    <span className="thread-process-stepper__mobile-title">
                      {currentStep.title}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "thread-process-stepper__mobile-chevron",
                        isMobileSelectorOpen && "thread-process-stepper__mobile-chevron--open",
                      )}
                    />
                  </span>
                  {currentStep.desc && (
                    <span className="thread-process-stepper__mobile-desc">
                      {currentStep.desc}
                    </span>
                  )}
                </span>
              </span>
            </button>

            <div
              id={mobileSelectorId}
              className="thread-process-stepper__mobile-options"
              hidden={!isMobileSelectorOpen}
            >
              {steps.map((step) => {
                const isCurrent = activeStep === step.num;
                const isPast = !isCurrent && (completedSteps ? completedSteps.includes(step.num) : activeStep > step.num);

                return (
                  <button
                    key={step.num}
                    type="button"
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "thread-process-stepper__mobile-option",
                      isCurrent && "thread-process-stepper__mobile-option--current",
                    )}
                    onClick={() => {
                      if (!isCurrent) onStepSelect(step);
                      setIsMobileSelectorOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        "thread-process-stepper__dot thread-process-stepper__dot--mobile",
                        isPast
                          ? "thread-process-stepper__dot--complete"
                          : isCurrent
                          ? "thread-process-stepper__dot--current"
                          : "thread-process-stepper__dot--selectable",
                      )}
                      aria-hidden="true"
                    >
                      {isPast ? <Check className="thread-process-stepper__check" /> : step.num}
                    </span>
                    <span className="thread-process-stepper__mobile-option-copy">
                      <span className="thread-process-stepper__mobile-option-title">
                        {step.title}
                      </span>
                      {step.desc && (
                        <span className="thread-process-stepper__mobile-option-desc">
                          {step.desc}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
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
                  const isCurrent = activeStep === step.num;
                  const isPast = !isCurrent && (completedSteps ? completedSteps.includes(step.num) : activeStep > step.num);

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
          </>
        )}
      </div>

      <div className="thread-process-stepper__desktop-list">
        {steps.map((step) => {
          const isCurrent = activeStep === step.num;
          const isPast = !isCurrent && (completedSteps ? completedSteps.includes(step.num) : activeStep > step.num);
          const isSelectable = Boolean(onStepSelect);
          const StepItem = onStepSelect ? "button" : "div";
          return (
            <StepItem
              key={step.num}
              type={onStepSelect ? "button" : undefined}
              onClick={onStepSelect ? () => onStepSelect(step) : undefined}
              className={cn("thread-process-stepper__desktop-item", onStepSelect && "w-full cursor-pointer text-left")}
            >
              <div
                className={cn(
                  "thread-process-stepper__dot thread-process-stepper__dot--desktop",
                  isPast
                    ? "thread-process-stepper__dot--complete"
                    : isCurrent
                    ? "thread-process-stepper__dot--current thread-process-stepper__dot--current-desktop"
                    : "thread-process-stepper__dot--upcoming",
                  isSelectable && !isPast && !isCurrent && "thread-process-stepper__dot--selectable",
                )}
              >
                {isPast ? <Check className="thread-process-stepper__check" /> : step.num}
              </div>
              <div>
                <div
                  className={cn(
                    "thread-process-stepper__desktop-title",
                    isCurrent || isPast || isSelectable ? "thread-process-stepper__label--available" : "thread-process-stepper__label--upcoming",
                  )}
                >
                  {step.title}
                </div>
                {step.desc && (
                  <div
                    className={cn(
                      "thread-process-stepper__desktop-desc",
                      isCurrent || isSelectable ? "thread-process-stepper__desc--current" : "thread-process-stepper__label--upcoming",
                    )}
                  >
                    {step.desc}
                  </div>
                )}
              </div>
            </StepItem>
          );
        })}
      </div>
    </div>
  );
}
