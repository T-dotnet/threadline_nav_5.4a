import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { useDisplayMode } from "../../context/DisplayModeContext";
import { ProgressBar } from "../ui/ProgressBar";

const SETUP_STEPS = [
  { num: 1, title: "Journey", desc: "Where you are now" },
  { num: 2, title: "Your child", desc: "Name & date of birth" },
  { num: 3, title: "Hardest right now", desc: "Top areas" },
  { num: 4, title: "Questionnaire", desc: "Everyday life" },
  { num: 5, title: "Session", desc: "Appointment time" },
];

interface SetupStepperProps {
  activeStep: number;
  heading: string;
}

export function SetupStepper({ activeStep, heading }: SetupStepperProps) {
  const { isMvp } = useDisplayMode();
  const visibleSteps = isMvp ? SETUP_STEPS.filter((step) => step.num <= 3) : SETUP_STEPS;
  const currentStep = visibleSteps.find((step) => step.num === activeStep) ?? visibleSteps[0];
  const currentStepIndex = Math.max(0, visibleSteps.findIndex((step) => step.num === activeStep));
  const progressPercent = visibleSteps.length > 1
    ? (currentStepIndex / (visibleSteps.length - 1)) * 100
    : 0;

  return (
    <div className="thread-setup-stepper">
      <div className="thread-setup-stepper__heading-row">
        <div className="thread-setup-stepper__heading">
          {heading}
        </div>
        {!isMvp && (
          <div className="thread-setup-stepper__counter">
            Step {activeStep} of {visibleSteps.length}
          </div>
        )}
      </div>

      <div className="thread-setup-stepper__mobile-card">
        <div className="thread-setup-stepper__mobile-summary">
          <div className="thread-setup-stepper__mobile-number">
            {activeStep}
          </div>
          <div className="thread-setup-stepper__mobile-copy">
            <div className="thread-setup-stepper__mobile-title">
              {currentStep.title}
            </div>
            <div className="thread-setup-stepper__mobile-desc">
              {currentStep.desc}
            </div>
          </div>
        </div>

        <div className="thread-setup-stepper__mobile-progress">
          <ProgressBar
            value={progressPercent}
            heightClass="h-0.5"
            className="thread-setup-stepper__mobile-meter"
          />
          <div
            className="thread-setup-stepper__mobile-grid"
            style={{ gridTemplateColumns: `repeat(${visibleSteps.length}, minmax(0, 1fr))` }}
          >
            {visibleSteps.map((step) => {
              const isPast = activeStep > step.num;
              const isCurrent = activeStep === step.num;

              return (
                <div key={step.num} className="thread-setup-stepper__mobile-item">
                  <div
                    className={cn(
                      "thread-setup-stepper__dot thread-setup-stepper__dot--mobile",
                      isPast
                        ? "thread-setup-stepper__dot--complete"
                        : isCurrent
                        ? "thread-setup-stepper__dot--current"
                        : "thread-setup-stepper__dot--upcoming",
                    )}
                    aria-label={`${step.title}: ${isPast ? "complete" : isCurrent ? "current" : "up next"}`}
                  >
                    {isPast ? <Check className="thread-setup-stepper__check" /> : step.num}
                  </div>
                  <span
                    className={cn(
                      "thread-setup-stepper__mobile-label",
                      isCurrent || isPast ? "thread-setup-stepper__label--available" : "thread-setup-stepper__label--upcoming",
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

      <div className="thread-setup-stepper__desktop-list">
        {visibleSteps.map((step) => {
          const isPast = activeStep > step.num;
          const isCurrent = activeStep === step.num;
          return (
            <div key={step.num} className="thread-setup-stepper__desktop-item">
              <div
                className={cn(
                  "thread-setup-stepper__dot thread-setup-stepper__dot--desktop",
                  isPast
                    ? "thread-setup-stepper__dot--complete"
                    : isCurrent
                    ? "thread-setup-stepper__dot--current thread-setup-stepper__dot--current-desktop"
                    : "thread-setup-stepper__dot--upcoming",
                )}
              >
                {isPast ? <Check className="thread-setup-stepper__check" /> : step.num}
              </div>
              <div>
                <div
                  className={cn(
                    "thread-setup-stepper__desktop-title",
                    isCurrent || isPast ? "thread-setup-stepper__label--available" : "thread-setup-stepper__label--upcoming",
                  )}
                >
                  {step.title}
                </div>
                <div
                  className={cn(
                    "thread-setup-stepper__desktop-desc",
                    isCurrent ? "thread-setup-stepper__desc--current" : "thread-setup-stepper__label--upcoming",
                  )}
                >
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
