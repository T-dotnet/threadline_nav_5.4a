import { motion } from "motion/react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { QUESTIONS, QUESTIONNAIRE_SECTIONS } from "../../questionnaire";
import { useDisplayMode } from "../../context/DisplayModeContext";

interface SetupQuestionnaireStepProps {
  title: string;
  description: string;
  answers: Record<string, any>;
  sectionKickerClass: string;
  stepHeadingClass: string;
  stepLeadClass: string;
  getSectionStatus: (sectionName: string) => string;
  onOpenSection: (sectionName: string) => void;
}

export function SetupQuestionnaireStep({
  title,
  description,
  answers,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  getSectionStatus,
  onOpenSection,
}: SetupQuestionnaireStepProps) {
  const completedSectionsCount = QUESTIONNAIRE_SECTIONS.filter(
    (section) => getSectionStatus(section) === "Completed",
  ).length;
  const totalQuestionsCount = Object.values(QUESTIONS).flat().length;
  const answeredQuestionsCount = Object.values(QUESTIONS).flat().filter((question) => {
    const answer = answers[question.id];
    if (answer === undefined || answer === null) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    if (typeof answer === "string") return answer.trim() !== "";
    return true;
  }).length;
  const progressPercent = Math.round((answeredQuestionsCount / totalQuestionsCount) * 100);
  const { isMvp } = useDisplayMode();
  const formatQuestionCount = (count: number) => `${count} ${count === 1 ? "question" : "questions"}`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        {!isMvp && <span className={sectionKickerClass}>Step 4 of 5 · Questionnaire</span>}
        <h1 className={cn(stepHeadingClass, "max-w-none")}>{title}</h1>
        <p className={stepLeadClass}>{description}</p>
      </div>

      <div className="space-y-3">
        <div className="bg-white rounded-tr-[24px] overflow-hidden">
          {QUESTIONNAIRE_SECTIONS.map((section, index) => {
            const status = getSectionStatus(section);
            const isDone = status === "Completed";
            const questionCount = (QUESTIONS[section] || []).length;
            const isLocked = false;
            const isInProgress = !isDone && status !== "Not started";
            return (
              <button
                key={section}
                onClick={() => {
                  if (isLocked) return;
                  onOpenSection(section);
                }}
                disabled={isLocked}
                className={cn(
                  "w-full bg-white p-4 text-left transition-all group border-b border-black/5 last:border-b-0 sm:flex sm:items-center sm:gap-5 max-sm:grid max-sm:grid-cols-[2.5rem_minmax(0,1fr)] max-sm:gap-x-3 max-sm:gap-y-2",
                  isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[var(--color-thread-off-white)]/40 cursor-pointer",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shrink-0",
                    isDone
                      ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                      : isLocked
                      ? "border-slate-200 text-slate-300 bg-slate-50"
                      : "border-slate-200 text-slate-400 bg-[var(--color-thread-off-white)] group-hover:bg-white group-hover:border-[var(--color-thread-mid-green)] group-hover:text-[var(--color-thread-mid-green)]",
                  )}
                >
                  {isDone ? <Check className="w-4 h-4" /> : isLocked ? <span className="text-slate-300">🔒</span> : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "font-sans text-[0.95rem] leading-relaxed",
                      isLocked ? "text-slate-400" : "text-[var(--color-thread-dark-slate)]",
                    )}
                  >
                    {section}
                  </div>
                  <div className="text-[0.78rem] text-[var(--color-thread-gray)] mt-1.5 leading-relaxed">
                    {isLocked
                      ? `Complete "${QUESTIONNAIRE_SECTIONS[index - 1]}" to unlock`
                      : formatQuestionCount(questionCount)}
                  </div>
                </div>
                {!isLocked && (
                  <div className="flex items-center gap-3 shrink-0 max-sm:col-start-2 max-sm:w-full max-sm:justify-between">
                    <div
                      className={cn(
                        "text-[0.6rem] font-medium inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full uppercase tracking-[0.12em] sm:whitespace-nowrap",
                        isDone
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]"
                          : status === "Not started"
                          ? "bg-[var(--color-thread-off-white)] text-slate-400"
                          : "bg-[var(--color-thread-cream)] text-[var(--color-thread-heading)]",
                      )}
                    >
                      {isDone && <Check className="w-3 h-3" />}
                      {isDone ? "Completed" : isInProgress ? status : "Start"}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
