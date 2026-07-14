import type { ReactNode } from "react";
import { ActionLink } from "../ui/ActionLink";
import { ModalCloseButton, ModalShell } from "../ui/ModalShell";
import type { ProcessStep } from "../ui/ProcessStepper";
import { ProcessStepperSidebar } from "../ui/ProcessStepperSidebar";

interface QuestionnaireModuleModalFrameProps {
  isOpen: boolean;
  titleId: string;
  activeStep: number;
  completedSteps?: number[];
  heading: string;
  steps: ProcessStep[];
  closeLabel: string;
  onClose: () => void;
  onStepSelect?: (step: ProcessStep) => void;
  children: ReactNode;
  footer?: ReactNode;
}

function StepperModalHeader({
  closeLabel,
  onClose,
}: Pick<QuestionnaireModuleModalFrameProps, "closeLabel" | "onClose">) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-6 sm:py-5">
      <ActionLink
        as="button"
        icon={null}
        onClick={onClose}
        className="min-h-11 text-sm font-medium"
      >
        Save &amp; exit
      </ActionLink>
      <ModalCloseButton onClick={onClose} label={closeLabel} />
    </div>
  );
}

export function QuestionnaireModuleModalFrame({
  isOpen,
  titleId,
  activeStep,
  completedSteps,
  heading,
  steps,
  closeLabel,
  onClose,
  onStepSelect,
  children,
  footer,
}: QuestionnaireModuleModalFrameProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      onRequestClose={onClose}
      titleId={titleId}
      size="large"
      className="max-sm:p-0"
      radiusClassName="thread-modal-panel--scalloped max-sm:rounded-none"
      panelClassName="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden p-0 sm:h-auto sm:max-h-[90vh]"
    >
      <div className="relative flex min-h-0 flex-1 flex-col md:min-h-[560px] md:flex-row">
        <ProcessStepperSidebar
          activeStep={activeStep}
          completedSteps={completedSteps}
          heading={heading}
          steps={steps}
          side="left"
          mobileBorder="bottom"
          className="md:max-h-[90vh] md:overflow-y-auto"
          onStepSelect={onStepSelect}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <StepperModalHeader closeLabel={closeLabel} onClose={onClose} />

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-10 sm:py-8">
            {children}
          </div>

          {footer && (
            <div className="flex flex-col items-stretch gap-3 border-t border-black/5 bg-slate-50/60 px-4 py-4 max-sm:[&>button]:min-h-11 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
