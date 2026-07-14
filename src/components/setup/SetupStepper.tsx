import { useDisplayMode } from "../../context/DisplayModeContext";
import { ProcessStepper } from "../ui/ProcessStepper";
import { ProcessStepperSidebar } from "../ui/ProcessStepperSidebar";

const SETUP_STEPS = [
  { num: 1, title: "Journey", desc: "Where you are now" },
  { num: 2, title: "Your child", desc: "Name & date of birth" },
  { num: 3, title: "Hardest right now", desc: "Top areas" },
  { num: 4, title: "Questionnaire", desc: "Everyday life" },
  { num: 5, title: "Session", desc: "Appointment time" },
];

const MVP_SETUP_STEPS = [
  { num: 1, title: "Child", desc: "Name, age, location" },
  { num: 2, title: "Process", desc: "Where you are now" },
  { num: 3, title: "Help", desc: "What would support you" },
  { num: 4, title: "Evidence", desc: "What you already have" },
  { num: 5, title: "Reflection", desc: "Next steps" },
];

interface SetupStepperProps {
  activeStep: number;
  heading: string;
}

interface SetupStepperSidebarProps extends SetupStepperProps {
  side?: "left" | "right";
  mobileBorder?: "top" | "bottom" | "none";
  className?: string;
}

export function SetupStepper({ activeStep, heading }: SetupStepperProps) {
  const { isMvp } = useDisplayMode();
  const visibleSteps = isMvp ? MVP_SETUP_STEPS : SETUP_STEPS;

  return (
    <ProcessStepper
      activeStep={activeStep}
      heading={heading}
      steps={visibleSteps}
    />
  );
}

export function SetupStepperSidebar({
  activeStep,
  heading,
  side = "right",
  mobileBorder = "bottom",
  className,
}: SetupStepperSidebarProps) {
  const { isMvp } = useDisplayMode();
  const visibleSteps = isMvp ? MVP_SETUP_STEPS : SETUP_STEPS;

  return (
    <ProcessStepperSidebar
      activeStep={activeStep}
      heading={heading}
      steps={visibleSteps}
      side={side}
      mobileBorder={mobileBorder}
      className={className}
    />
  );
}
