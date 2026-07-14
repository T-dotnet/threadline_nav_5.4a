import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MVP_CLINICAL_MODULE_QUESTIONS } from "../../lib/familyJourneyQuestionBank";
import { getNotSureAnswerValue } from "../../lib/questionnaireUi";
import { isAnswered } from "../../questionnaire";
import { Button } from "../ui/Button";
import { ModalOutcomeScreen } from "../ui/ModalOutcomeScreen";
import { QuestionNotSurePrompt } from "../ui/QuestionNotSurePrompt";
import { QuestionOption } from "../ui/QuestionOption";
import { QuestionnaireModuleModalFrame } from "./QuestionnaireModuleModalFrame";
import {
  CHECKLIST_DETAIL_WIDTH_CLASS,
  MODAL_BODY_CLASS,
  MODAL_FIELD_LABEL_CLASS,
  MODAL_KICKER_CLASS,
  MODAL_PRIMARY_BUTTON_CLASS,
  MODAL_SECONDARY_BUTTON_CLASS,
  MODAL_TITLE_CLASS,
} from "./workflowStyles";

export const CLINICAL_MODULE_SECTIONS = Object.keys(MVP_CLINICAL_MODULE_QUESTIONS);
export const CLINICAL_MODULE_QUESTION_COUNT = Object.values(MVP_CLINICAL_MODULE_QUESTIONS).flat().length;

export interface ClinicalModuleModalTarget {
  section: string;
  index: number;
}

interface ClinicalModulesChecklistContentProps {
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

interface ClinicalModulesWorkflowProps {
  childName: string;
  questionnaireAnswers: Record<string, unknown>;
  activeSection: string | null;
  activeQuestionIndex: number;
  isCoverVisible: boolean;
  isSuccessVisible: boolean;
  onActiveSectionChange: (section: string | null) => void;
  onActiveQuestionIndexChange: (index: number) => void;
  onCoverVisibleChange: (visible: boolean) => void;
  onSuccessVisibleChange: (visible: boolean) => void;
  onAnswerChange: (questionId: string, value: string) => void;
  onBackToPreparation: () => void;
  onClose: () => void;
}

const DEFAULT_CLINICAL_MODULE_META = {
  description: "Structured information for the clinical review.",
};

const CLINICAL_MODULE_META: Record<string, { description: string }> = {
  "1. Child & Family Profile": {
    description: "Core background for the Assessment Package.",
  },
  "2. Development & Medical History": {
    description: "Health and development details for clinical review.",
  },
  "3. Parent ADHD Questionnaire": {
    description: "Parent observations that support assessment scoring.",
  },
  "5. Emotional Wellbeing": {
    description: "Daily function, routines, and home patterns.",
  },
  "7. Daily Life & Functioning": {
    description: "Strengths, supports, and priorities to preserve.",
  },
};

export function getClinicalModuleModalTarget(
  questionnaireAnswers: Record<string, unknown>,
  section?: string,
): ClinicalModuleModalTarget | null {
  const latestInProgressSection = [...CLINICAL_MODULE_SECTIONS].reverse().find((sectionName) => {
    const questions = MVP_CLINICAL_MODULE_QUESTIONS[sectionName] ?? [];
    const answeredCount = questions.filter((question) => isAnswered(questionnaireAnswers[question.id])).length;
    return answeredCount > 0 && answeredCount < questions.length;
  });
  const firstIncompleteSection = CLINICAL_MODULE_SECTIONS.find((sectionName) =>
    (MVP_CLINICAL_MODULE_QUESTIONS[sectionName] ?? []).some((question) => !isAnswered(questionnaireAnswers[question.id]))
  );
  const targetSection = section ?? latestInProgressSection ?? firstIncompleteSection ?? CLINICAL_MODULE_SECTIONS[0];

  if (!targetSection) return null;

  const questions = MVP_CLINICAL_MODULE_QUESTIONS[targetSection] ?? [];
  const firstUnansweredIndex = questions.findIndex((question) => !isAnswered(questionnaireAnswers[question.id]));

  return {
    section: targetSection,
    index: firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0,
  };
}

export function ClinicalModulesChecklistContent({
  actionLabel,
  onAction,
  showAction = true,
}: ClinicalModulesChecklistContentProps) {
  return (
    <div className="max-w-[62ch] space-y-4 pt-1">
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        The module maps out primary developmental areas including focus, sleep, school transitions, and co-regulation patterns, helping your child&apos;s clinician prepare a rich diagnostic overview.
      </p>
      {showAction && actionLabel && onAction && (
        <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} space-y-4 pt-2`}>
          <Button
            variant="secondary"
            onClick={onAction}
            className="text-xs h-9 px-4 font-medium rounded-full inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ClinicalModulesWorkflow({
  childName,
  questionnaireAnswers,
  activeSection,
  activeQuestionIndex,
  isCoverVisible,
  isSuccessVisible,
  onActiveSectionChange,
  onActiveQuestionIndexChange,
  onCoverVisibleChange,
  onSuccessVisibleChange,
  onAnswerChange,
  onBackToPreparation,
  onClose,
}: ClinicalModulesWorkflowProps) {
  const activeQuestions = activeSection ? MVP_CLINICAL_MODULE_QUESTIONS[activeSection] ?? [] : [];
  const activeQuestion = activeQuestions[activeQuestionIndex];
  const activeModuleIndex = Math.max(0, CLINICAL_MODULE_SECTIONS.indexOf(activeSection ?? CLINICAL_MODULE_SECTIONS[0]));
  const activeStepNumber = activeModuleIndex + 1;
  const activeTitle = activeSection?.replace(/^\d+\.\s*/, "") ?? "Clinical module";
  const activeMeta = activeSection
    ? CLINICAL_MODULE_META[activeSection] ?? DEFAULT_CLINICAL_MODULE_META
    : DEFAULT_CLINICAL_MODULE_META;
  const questionOrdinal = CLINICAL_MODULE_SECTIONS
    .slice(0, activeModuleIndex)
    .reduce((total, section) => total + (MVP_CLINICAL_MODULE_QUESTIONS[section]?.length ?? 0), 0) + activeQuestionIndex + 1;
  const isFirstQuestion = activeModuleIndex === 0 && activeQuestionIndex === 0;
  const isLastQuestion =
    activeModuleIndex === CLINICAL_MODULE_SECTIONS.length - 1 &&
    activeQuestionIndex >= activeQuestions.length - 1;

  const getModuleProgress = (section: string) => {
    const questions = MVP_CLINICAL_MODULE_QUESTIONS[section] ?? [];
    const answeredCount = questions.filter((question) => isAnswered(questionnaireAnswers[question.id])).length;
    return { answeredCount, totalCount: questions.length };
  };

  const activeProgress = activeSection
    ? getModuleProgress(activeSection)
    : { answeredCount: 0, totalCount: 0 };
  const isActiveModuleComplete =
    activeProgress.totalCount > 0 && activeProgress.answeredCount === activeProgress.totalCount;
  const sidebarSteps = CLINICAL_MODULE_SECTIONS.map((section, index) => {
    const progress = getModuleProgress(section);
    return {
      num: index + 1,
      title: section.replace(/^\d+\.\s*/, ""),
      desc: `${progress.answeredCount}/${progress.totalCount} questions`,
    };
  });
  const completedStepNumbers = CLINICAL_MODULE_SECTIONS
    .map((section, index) => {
      const progress = getModuleProgress(section);
      return progress.totalCount > 0 && progress.answeredCount === progress.totalCount ? index + 1 : null;
    })
    .filter((stepNumber): stepNumber is number => stepNumber !== null);
  const areModulesComplete =
    CLINICAL_MODULE_SECTIONS.length > 0 && completedStepNumbers.length === CLINICAL_MODULE_SECTIONS.length;

  const selectModule = (section: string) => {
    const target = getClinicalModuleModalTarget(questionnaireAnswers, section);
    if (!target) return;
    onSuccessVisibleChange(false);
    onActiveSectionChange(target.section);
    onActiveQuestionIndexChange(target.index);
    onCoverVisibleChange(true);
  };

  const handlePrevious = () => {
    if (!activeSection || isCoverVisible) return;
    if (activeQuestionIndex > 0) {
      onActiveQuestionIndexChange(activeQuestionIndex - 1);
      return;
    }

    const previousSection = CLINICAL_MODULE_SECTIONS[activeModuleIndex - 1];
    if (!previousSection) return;
    const previousQuestions = MVP_CLINICAL_MODULE_QUESTIONS[previousSection] ?? [];
    onActiveSectionChange(previousSection);
    onActiveQuestionIndexChange(Math.max(0, previousQuestions.length - 1));
    onCoverVisibleChange(true);
  };

  const handleNext = () => {
    if (!activeSection) return;
    if (isCoverVisible) {
      onCoverVisibleChange(false);
      return;
    }
    if (activeQuestionIndex < activeQuestions.length - 1) {
      onActiveQuestionIndexChange(activeQuestionIndex + 1);
      return;
    }

    const nextSection = CLINICAL_MODULE_SECTIONS[activeModuleIndex + 1];
    if (!nextSection) {
      if (areModulesComplete) onSuccessVisibleChange(true);
      onActiveSectionChange(null);
      onActiveQuestionIndexChange(0);
      onCoverVisibleChange(false);
      return;
    }

    onActiveSectionChange(nextSection);
    onActiveQuestionIndexChange(0);
    onCoverVisibleChange(true);
  };

  return (
    <QuestionnaireModuleModalFrame
      isOpen={Boolean(activeSection) || isSuccessVisible}
      titleId="clinical-question-modal-title"
      activeStep={isSuccessVisible ? CLINICAL_MODULE_SECTIONS.length : activeStepNumber}
      completedSteps={completedStepNumbers}
      heading="Clinical modules"
      steps={sidebarSteps}
      closeLabel="Close clinical modules question"
      onClose={onClose}
      onStepSelect={(step) => {
        const section = CLINICAL_MODULE_SECTIONS[step.num - 1];
        if (section) selectModule(section);
      }}
      footer={!isCoverVisible && !isSuccessVisible ? (
        <>
          <Button variant="secondary" onClick={handlePrevious} disabled={isFirstQuestion} className={MODAL_SECONDARY_BUTTON_CLASS}>
            Previous
          </Button>
          <Button onClick={handleNext} className={MODAL_PRIMARY_BUTTON_CLASS}>
            {isLastQuestion ? "Done" : "Next"}
          </Button>
        </>
      ) : undefined}
    >
      {isSuccessVisible ? (
        <ModalOutcomeScreen
          titleId="clinical-question-modal-title"
          icon={<CheckCircle2 className="h-7 w-7 stroke-[1.8]" />}
          title="Clinical modules complete"
          description={`All clinical module questions for ${childName} are complete. Threadline will keep these answers in the Assessment Package preparation view.`}
          actionLabel="Back to preparation"
          onAction={onBackToPreparation}
        />
      ) : isCoverVisible && activeSection ? (
        <div className="max-w-2xl space-y-7">
          <div className="space-y-3">
            <span className={MODAL_KICKER_CLASS}>Module {activeStepNumber}</span>
            <h2 id="clinical-question-modal-title" className={MODAL_TITLE_CLASS}>{activeTitle}</h2>
            <p className={`${MODAL_BODY_CLASS} max-w-xl`}>{activeMeta.description}</p>
          </div>
          <div className="rounded-none rounded-tr-[28px] bg-[var(--color-thread-off-white)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-thread-muted-text)]">Module progress</p>
                <p className="mt-1 text-sm font-medium text-[var(--color-thread-dark-slate)]">
                  {activeProgress.answeredCount} of {activeProgress.totalCount} questions complete
                </p>
              </div>
              <Button
                onClick={() => onCoverVisibleChange(false)}
                className={MODAL_PRIMARY_BUTTON_CLASS}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                {isActiveModuleComplete ? "Review module" : "Start module"}
              </Button>
            </div>
          </div>
        </div>
      ) : activeQuestion ? (
        <div className="max-w-2xl space-y-7">
          <div className="space-y-3">
            <span className={MODAL_KICKER_CLASS}>{activeTitle}</span>
            <h2 id="clinical-question-modal-title" className={MODAL_TITLE_CLASS}>
              {activeQuestion.text.replace(/\$\{childName\}/g, childName)}
            </h2>
            {activeQuestion.subtext && (
              <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
                {activeQuestion.subtext.replace(/\$\{childName\}/g, childName)}
              </p>
            )}
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-thread-muted-text)]">
              Question {questionOrdinal} of {CLINICAL_MODULE_QUESTION_COUNT}
            </p>
          </div>

          {activeQuestion.type === "choice" && activeQuestion.options ? (
            <div className="space-y-2.5">
              {activeQuestion.options.map((option, optionIndex) => (
                <QuestionOption
                  key={option}
                  onClick={() => onAnswerChange(activeQuestion.id, option)}
                  selected={questionnaireAnswers[activeQuestion.id] === option}
                  marker={String.fromCharCode(65 + optionIndex)}
                  showCheck={false}
                >
                  {option}
                </QuestionOption>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block">
                <span className={MODAL_FIELD_LABEL_CLASS}>Answer</span>
                <textarea
                  value={String(questionnaireAnswers[activeQuestion.id] ?? "")}
                  onChange={(event) => onAnswerChange(activeQuestion.id, event.target.value)}
                  placeholder={activeQuestion.placeholder || "Type your answer here..."}
                  rows={5}
                  className="min-h-[150px] w-full resize-y rounded-none rounded-tr-[24px] border border-black/10 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none transition focus:border-[var(--color-thread-mid-green)] focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/15"
                />
              </label>
              <QuestionNotSurePrompt
                marked={questionnaireAnswers[activeQuestion.id] === getNotSureAnswerValue(activeQuestion.options)}
                onMark={() => onAnswerChange(activeQuestion.id, getNotSureAnswerValue(activeQuestion.options))}
                buttonClassName={MODAL_SECONDARY_BUTTON_CLASS}
              />
            </div>
          )}
        </div>
      ) : null}
    </QuestionnaireModuleModalFrame>
  );
}
