import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { useDisplayMode } from "../../context/DisplayModeContext";

interface SetupCompleteStepProps {
  reflectedChildName: string;
  mirroredJourneyStage: string;
  mirroredHardestAreasSentence: string;
  mirroredAvailableInfoSentence: string;
  stepHeadingClass: string;
  stepLeadClass: string;
  onBack: () => void;
  onViewProfile: () => void;
}

export function SetupCompleteStep({
  reflectedChildName,
  mirroredJourneyStage,
  mirroredHardestAreasSentence,
  mirroredAvailableInfoSentence,
  stepHeadingClass,
  stepLeadClass,
  onBack,
  onViewProfile,
}: SetupCompleteStepProps) {
  const { isMvp } = useDisplayMode();
  const summaryItems = isMvp
    ? [
        {
          label: "Assessment thread",
          text: `${reflectedChildName}'s starting details have been saved.`,
        },
        {
          label: "Next step",
          text: "Continue to the assessment workspace when you are ready.",
        },
        {
          label: "You can come back anytime",
          text: "Threadline keeps the evidence, questionnaires, and reports organised as you prepare.",
        },
      ]
    : [
        {
          label: "Where you are now",
          text: mirroredJourneyStage,
        },
        {
          label: "What feels hardest",
          text: mirroredHardestAreasSentence,
        },
        {
          label: "What we can start with",
          text: mirroredAvailableInfoSentence,
        },
      ];

  return (
    <>
      <div className="w-full bg-white rounded-tr-[36px] border border-black/5 shadow-premium p-8 sm:p-12 md:p-14 flex flex-col justify-between gap-10 min-h-[580px]">
        <div className="space-y-8 sm:space-y-10">
          <div className="space-y-5">
            <div className="inline-flex items-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-thread-mid-green)]">
              {isMvp ? "Assessment setup ready" : "First picture complete"}
            </div>
            <h1 className={cn(stepHeadingClass, "max-w-[18ch]")}>
              {isMvp
                ? `${reflectedChildName}'s assessment setup is ready.`
                : `${reflectedChildName}'s first picture is ready.`}
            </h1>
            <p className={stepLeadClass}>
              {isMvp
                ? "Your answers are saved. From here, Threadline can help you move toward Assessment Ready one step at a time."
                : "Here's what we heard from you so far, and where Navigator can start helping next."}
            </p>
          </div>

          <div className="bg-[var(--color-thread-off-white)]/70 p-6 sm:p-8 rounded-tr-[24px] space-y-6">
            <div className="space-y-5">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <Check className="w-5 h-5 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-1" />
                  <div className="space-y-1">
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-thread-dark-slate)]/55">
                      {item.label}
                    </p>
                    <p className="text-[0.95rem] text-[var(--color-thread-dark-slate)] leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-black/5 w-full flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
          <button
            onClick={onBack}
            className="text-[0.84rem] font-medium text-slate-500 hover:text-slate-900 flex items-center justify-center sm:justify-start gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <Button
            onClick={onViewProfile}
            variant="primary"
            className="px-6 shadow-none w-full sm:w-auto"
          >
            {isMvp ? "Open assessment workspace" : `Open ${reflectedChildName}'s profile`} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
}
