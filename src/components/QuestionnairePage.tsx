import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Check, CheckCircle2, ArrowLeft, ArrowRight, Save, ChevronRight, Clock, LockKeyhole } from "lucide-react";
import { PageContainer } from "./ui/PageContainer";
import { PageHeader } from "./ui/PageHeader";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { GuideCard } from "./ui/GuideCard";
import { ProgressBar } from "./ui/ProgressBar";
import { ProgressRing } from "./ui/ProgressRing";
import { ActionLink } from "./ui/ActionLink";
import { AreaItem } from "./ui/AreaItem";
import { ModalShell, ModalCloseButton } from "./ui/ModalShell";
import { ModalOutcomeScreen } from "./ui/ModalOutcomeScreen";
import { QuestionNotSurePrompt } from "./ui/QuestionNotSurePrompt";
import { QuestionOption } from "./ui/QuestionOption";
import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { getRotatingCornerClass } from "../lib/cornerStyles";
import { MVP_CLINICAL_MODULE_QUESTIONS } from "../lib/familyJourneyQuestionBank";
import { getNotSureAnswerValue } from "../lib/questionnaireUi";
import pediatricianQuestionsImage from "../assets/images/optimized/abstract-pediatrician-questions-900.jpg";
import classroomFatigueImage from "../assets/images/optimized/abstract-classroom-support-900.jpg";
import bedtimeRoutineImage from "../assets/images/optimized/abstract-bedtime-wind-down-900.jpg";
import assessmentDocumentsImage from "../assets/images/optimized/abstract-assessment-documents-900.jpg";

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: "choice" | "text";
  options?: string[];
  placeholder?: string;
}

const CLINICAL_QUESTIONS: Record<string, Question[]> = {
  "Classroom Focus": [
    {
      id: "focus_attention",
      text: "How frequently does ${childName} experience difficulty maintaining task focus during structured activities?",
      subtext: "Consider school classroom settings, structured group tasks, or homework.",
      type: "choice",
      options: ["Rarely", "Sometimes", "Often"]
    },
    {
      id: "following_instructions",
      text: "Does ${childName} struggle to follow multi-step instructions or directions?",
      subtext: "E.g., 'Go put your shoes on, get your bag, and wait by the door.'",
      type: "choice",
      options: ["Rarely", "Sometimes", "Often"]
    }
  ],
  "Sleep & Rest": [
    {
      id: "bedtime_resistance",
      text: "Does ${childName} experience bedtime resistance or waking challenges during school nights?",
      subtext: "Consider bedtime routine duration, settling down, and overall sleep hygiene.",
      type: "choice",
      options: ["Rarely", "Sometimes", "Often"]
    },
    {
      id: "morning_alertness",
      text: "How would you describe ${childName}'s morning alertness and energy level upon waking?",
      subtext: "Does it take a long time to get going, or are they alert and ready quickly?",
      type: "choice",
      options: ["Slow start / fatigued", "Fluctuates", "Quick to wake / alert"]
    }
  ],
  "Routines & Co-Regulation": [
    {
      id: "routine_dysregulation",
      text: "How regularly do emotional dysregulation challenges interfere with morning or evening routines?",
      subtext: "Such as getting dressed, brushing teeth, eating meals, or bath transitions.",
      type: "choice",
      options: ["Rarely", "Sometimes", "Often"]
    },
    {
      id: "transition_difficulty",
      text: "Does ${childName} find transitions between activities, settings, or places difficult?",
      subtext: "Especially transitioning away from high-interest activities (like screen time).",
      type: "choice",
      options: ["Rarely", "Sometimes", "Often"]
    }
  ],
  "Social Connections": [
    {
      id: "peer_interaction",
      text: "How does ${childName} interact with peers in group play environments?",
      subtext: "Does play tend to be parallel, cooperative, or guided mostly by adults?",
      type: "choice",
      options: ["Joins in easily", "Requires support to join", "Prefers solo play"]
    },
    {
      id: "communication_gaps",
      text: "Does ${childName} find it difficult to express feelings or needs during overwhelming situations?",
      subtext: "Consider when they are tired, frustrated, or overstimulated.",
      type: "choice",
      options: ["Rarely", "Sometimes", "Often"]
    }
  ]
};

interface MvpModuleMeta {
  description: string;
  image: string;
}

const DEFAULT_MVP_MODULE_META: MvpModuleMeta = {
  description: "Structured information for the clinical review.",
  image: assessmentDocumentsImage,
};

const MVP_MODULE_META: Record<string, MvpModuleMeta> = {
  "1. Child & Family Profile": {
    description: "Core background for the Assessment Package.",
    image: pediatricianQuestionsImage,
  },
  "2. Development & Medical History": {
    description: "Health and development details for clinical review.",
    image: assessmentDocumentsImage,
  },
  "3. Parent ADHD Questionnaire": {
    description: "Parent observations that support assessment scoring.",
    image: classroomFatigueImage,
  },
  "5. Emotional Wellbeing": {
    description: "Daily function, routines, and home patterns.",
    image: bedtimeRoutineImage,
  },
  "7. Daily Life & Functioning": {
    description: "Strengths, supports, and priorities to preserve.",
    image: classroomFatigueImage,
  },
};

function getMvpModuleMeta(section: string) {
  return MVP_MODULE_META[section] || DEFAULT_MVP_MODULE_META;
}

export default function QuestionnairePage() {
  const { currentChild, updateChild } = useCurrentChild();
  const { isMvp, questionnaireModuleView } = useDisplayMode();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isModuleSuccessVisible, setIsModuleSuccessVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isClinicalInfoModalOpen, setIsClinicalInfoModalOpen] = useState(false);
  const [questionnaireModuleOpenOverrides, setQuestionnaireModuleOpenOverrides] = useState<Record<string, boolean>>({});

  const answers = (currentChild?.intake?.questionnaireAnswers || {}) as Record<string, any>;
  const completedSections = currentChild?.intake?.completedQuestionnaireSections || [];

  const childName = currentChild?.name || "your child";
  const activeQuestionnaireQuestions = isMvp ? MVP_CLINICAL_MODULE_QUESTIONS : CLINICAL_QUESTIONS;
  const activeQuestionnaireModules = Object.keys(activeQuestionnaireQuestions);

  const getSectionStatus = (sectionName: string) => {
    const questions = activeQuestionnaireQuestions[sectionName] || [];
    const answeredCount = questions.filter(
      (q) => answers[q.id] !== undefined && answers[q.id] !== ""
    ).length;

    if (answeredCount === 0) return "Not started";
    if (answeredCount === questions.length) return "Completed";
    return "In progress";
  };

  const getSectionProgress = (sectionName: string) => {
    const questions = activeQuestionnaireQuestions[sectionName] || [];
    const answeredCount = questions.filter(
      (q) => answers[q.id] !== undefined && answers[q.id] !== ""
    ).length;
    const percent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

    return { answeredCount, totalCount: questions.length, percent };
  };

  const getUpdatedCompletedSections = (updatedAnswers: Record<string, any>) => {
    const updatedCompletedSections = [...completedSections];
    activeQuestionnaireModules.forEach((sectionName) => {
      const questions = activeQuestionnaireQuestions[sectionName] || [];
      const allAnswered = questions.length > 0 && questions.every(
        (q) => updatedAnswers[q.id] !== undefined && updatedAnswers[q.id] !== ""
      );
      const isAlreadyCompleted = updatedCompletedSections.includes(sectionName);

      if (allAnswered && !isAlreadyCompleted) {
        updatedCompletedSections.push(sectionName);
      } else if (!allAnswered && isAlreadyCompleted) {
        const idx = updatedCompletedSections.indexOf(sectionName);
        if (idx > -1) updatedCompletedSections.splice(idx, 1);
      }
    });

    return updatedCompletedSections;
  };

  const isSectionCompleteWithAnswers = (sectionName: string | null, updatedAnswers: Record<string, any>) => {
    const questions = activeQuestionnaireQuestions[sectionName || ""] || [];
    return questions.length > 0 && questions.every(
      (q) => updatedAnswers[q.id] !== undefined && updatedAnswers[q.id] !== ""
    );
  };

  const handleSelectOption = (questionId: string, value: string) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: value
    };

    updateChild({
      ...currentChild,
      intake: {
        ...currentChild.intake,
        questionnaireAnswers: updatedAnswers,
        completedQuestionnaireSections: getUpdatedCompletedSections(updatedAnswers)
      }
    });

    // Auto-advance for choice question if not at the end
    const currentQuestions = activeQuestionnaireQuestions[activeSection || ""] || [];
    if (activeQuestionIndex < currentQuestions.length - 1) {
      setTimeout(() => {
        setActiveQuestionIndex((prev) => prev + 1);
      }, 300);
    } else if (isSectionCompleteWithAnswers(activeSection, updatedAnswers)) {
      setTimeout(() => {
        setIsModuleSuccessVisible(true);
      }, 300);
    }
  };

  const handleTextChange = (questionId: string, value: string) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: value
    };

    updateChild({
      ...currentChild,
      intake: {
        ...currentChild.intake,
        questionnaireAnswers: updatedAnswers,
        completedQuestionnaireSections: getUpdatedCompletedSections(updatedAnswers)
      }
    });
  };

  const handleMarkQuestionNotSure = (questionId: string, options?: string[]) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: getNotSureAnswerValue(options)
    };

    updateChild({
      ...currentChild,
      intake: {
        ...currentChild.intake,
        questionnaireAnswers: updatedAnswers,
        completedQuestionnaireSections: getUpdatedCompletedSections(updatedAnswers)
      }
    });
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    const currentQuestions = activeQuestionnaireQuestions[activeSection || ""] || [];
    if (activeQuestionIndex < currentQuestions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else if (isSectionCompleteWithAnswers(activeSection, answers)) {
      setIsModuleSuccessVisible(true);
    } else {
      // Save and exit section
      setActiveSection(null);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Progress calculations
  const totalQuestions = Object.values(activeQuestionnaireQuestions).flat().length;
  const answeredCount = Object.values(activeQuestionnaireQuestions)
    .flat()
    .filter((q) => answers[q.id] !== undefined && answers[q.id] !== "").length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const allSectionsCompleted = activeQuestionnaireModules.every(
    (sec) => getSectionStatus(sec) === "Completed"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16 font-sans min-h-screen"
    >
      <PageContainer>
        {/* Back navigation */}
        <div className="mb-6">
          <Button
            type="button"
            onClick={() => navigate("/assessment")}
            variant="ghost"
            className="min-h-11 text-sm font-medium"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to assessment
          </Button>
        </div>

        <PageHeader
          kicker="Developmental Insights"
          title="Clinical modules"
          description={
            isMvp
              ? `Please complete the structured modules below. These inputs help prepare ${childName}'s Assessment Package and move you toward Assessment Ready.`
              : `Please complete the structured sections below. These inputs help prepare an objective, comprehensive clinical formulation ahead of ${childName}'s consultation.`
          }
        />

        <div className="mt-10 space-y-8">
          {submitted ? (
            <Card className="p-8 space-y-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-slate-900">Thank you! Your clinical module is complete.</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  These responses have been saved in {childName}&apos;s Thread. Your child&apos;s clinician will review these details ahead of the formulation.
                </p>
              </div>
              <div className="pt-2">
                <Button variant="primary" onClick={() => navigate("/assessment")}>
                  {isMvp ? "Return to assessment" : "Return to Dashboard"}
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* Progress Summary */}
              <Card className="rounded-none rounded-tr-[32px] p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3 max-sm:w-full">
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-thread-muted-text)]">
                      Questionnaire Progress
                    </span>
                    <span className="shrink-0 text-xs font-medium text-[var(--color-thread-mid-green)]">
                      {progressPercent}% Done
                    </span>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!allSectionsCompleted}
                    variant="primary"
                    className={cn(
                      "h-9 shrink-0 rounded-full px-4 text-xs font-medium inline-flex items-center gap-2 max-sm:w-full max-sm:justify-center",
                      !allSectionsCompleted && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Save className="w-4 h-4" />
                    <span>Submit Questionnaire</span>
                  </Button>
                </div>
                <ProgressBar
                  value={progressPercent}
                  colorClass="bg-[var(--color-thread-mid-green)]"
                  trackClassName="bg-slate-100"
                />
                <p className="text-xs text-[var(--color-thread-muted-text)]">
                  {answeredCount} of {totalQuestions} total questions completed. Your progress is saved automatically.{" "}
                  <ActionLink
                    as="button"
                    icon={null}
                    onClick={() => setIsClinicalInfoModalOpen(true)}
                    className="min-h-0 py-0 align-baseline text-xs font-medium hover:text-[var(--color-thread-heading)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/25"
                  >
                    Confidential Clinical Information
                  </ActionLink>
                </p>
              </Card>

              {isMvp && questionnaireModuleView === "cards" ? (
                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                  {activeQuestionnaireModules.map((section, index) => {
                    const status = getSectionStatus(section);
                    const isDone = status === "Completed";
                    const isInProgress = status === "In progress";
                    const questions = activeQuestionnaireQuestions[section] || [];
                    const sectionProgress = getSectionProgress(section);
                    const { description, image } = getMvpModuleMeta(section);
                    return (
                      <GuideCard
                        key={section}
                        category={`Module ${index + 1}`}
                        title={section}
                        description={description}
                        readTime={`${sectionProgress.answeredCount}/${questions.length} questions · ${status}`}
                        image={image}
                        cornerClass={getRotatingCornerClass(index)}
                        actionText={isDone ? "Review module" : isInProgress ? "Continue module" : "Start module"}
                        onClick={() => {
                          setIsModuleSuccessVisible(false);
                          setActiveSection(section);
                          setActiveQuestionIndex(0);
                        }}
                        className="h-full"
                      />
                    );
                  })}
                </div>
              ) : isMvp && (questionnaireModuleView === "checklist" || questionnaireModuleView === "package") ? (
                <div className="mt-4 border-y border-black/10 [&>*:first-child]:border-t-0">
                  {activeQuestionnaireModules.map((section) => {
                    const status = getSectionStatus(section);
                    const isDone = status === "Completed";
                    const isInProgress = status === "In progress";
                    const questions = activeQuestionnaireQuestions[section] || [];
                    const sectionProgress = getSectionProgress(section);
                    const { description } = getMvpModuleMeta(section);
                    const isPackageModuleView = questionnaireModuleView === "package";
                    const packageDefaultExpanded = isInProgress;

                    return (
                      <AreaItem
                        key={section}
                        title={section}
                        className={isPackageModuleView ? "thread-package-highlight" : undefined}
                        impact={`${sectionProgress.answeredCount}/${questions.length} questions complete`}
                        titleClassName={isPackageModuleView ? "text-[1.85rem] leading-tight text-[var(--color-thread-heading)]" : undefined}
                        status={isDone ? "Completed" : isInProgress ? "In Progress" : "To do"}
                        leadingVisual={
                          <ProgressRing
                            value={sectionProgress.percent}
                            complete={isDone}
                            className="h-11 w-11 p-[3px]"
                            centerClassName={cn(
                              "text-xs font-medium",
                              isDone || isInProgress
                                ? "bg-transparent text-[var(--color-thread-mid-green)]"
                                : "bg-transparent text-[var(--color-thread-muted-text)]"
                            )}
                          >
                            {isDone ? <Check className="w-4 h-4 stroke-[1.8]" /> : null}
                          </ProgressRing>
                        }
                        icon={
                          isDone ? (
                            <Check className="w-3 h-3 stroke-[2.4]" />
                          ) : isInProgress ? (
                            <Clock className="w-3 h-3 stroke-[2.4]" />
                          ) : (
                            <AlertCircle className="w-3 h-3 stroke-[2.4]" />
                          )
                        }
                        isCollapsible={isPackageModuleView}
                        collapsibleIndicator={isPackageModuleView ? "plus-minus" : "chevron"}
                        isExpanded={
                          isPackageModuleView
                            ? questionnaireModuleOpenOverrides[section] ?? packageDefaultExpanded
                            : undefined
                        }
                        onToggle={
                          isPackageModuleView
                            ? () => {
                                setQuestionnaireModuleOpenOverrides((current) => ({
                                  ...current,
                                  [section]: !(current[section] ?? packageDefaultExpanded),
                                }));
                              }
                            : undefined
                        }
                        description={
                          isPackageModuleView ? (
                            <div className="max-w-[62ch] pt-1">
                              <p className="text-base leading-relaxed text-[var(--color-thread-gray)]">
                                {description}
                              </p>
                            </div>
                          ) : description
                        }
                        actionText={isDone ? "Review module" : isInProgress ? "Continue module" : "Start module"}
                        actionPlacement="footer"
                        actionVariant="mint"
                        bodyAlignment="title"
                        onAction={() => {
                          setIsModuleSuccessVisible(false);
                          setActiveSection(section);
                          setActiveQuestionIndex(0);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  <Card className="overflow-hidden p-0">
                    {activeQuestionnaireModules.map((section, index) => {
                      const status = getSectionStatus(section);
                      const isDone = status === "Completed";
                      const isInProgress = status === "In progress";
                      const questions = activeQuestionnaireQuestions[section] || [];
                      const sectionProgress = getSectionProgress(section);

                      return (
                        <button
                          key={section}
                          onClick={() => {
                            setIsModuleSuccessVisible(false);
                            setActiveSection(section);
                            setActiveQuestionIndex(0);
                          }}
                          className="w-full bg-white px-5 pt-5 flex items-start gap-5 text-left transition-all group hover:bg-slate-50/50 cursor-pointer"
                        >
                          {isMvp ? (
                            <ProgressRing
                              value={sectionProgress.percent}
                              complete={isDone}
                              className="h-11 w-11 p-[3px] transition-transform group-hover:scale-[1.03]"
                              centerClassName={cn(
                                "border text-xs font-medium",
                                isDone
                                  ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-mid-green)] text-white"
                                  : isInProgress
                                    ? "border-[var(--color-thread-light-green)] bg-white text-[var(--color-thread-mid-green)]"
                                    : "border-slate-100 bg-slate-50 text-[var(--color-thread-muted-text)] group-hover:bg-white group-hover:text-[var(--color-thread-mid-green)]"
                              )}
                            >
                              {isDone ? <Check className="w-4 h-4" /> : `${sectionProgress.percent}%`}
                            </ProgressRing>
                          ) : (
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all shrink-0",
                                isDone
                                  ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                  : "border-slate-200 text-[var(--color-thread-muted-text)] bg-slate-50 group-hover:bg-white group-hover:border-[var(--color-thread-mid-green)] group-hover:text-[var(--color-thread-mid-green)]"
                              )}
                            >
                              {isDone ? <Check className="w-4 h-4" /> : index + 1}
                            </div>
                          )}
                          <div
                            className={cn(
                              "flex min-w-0 flex-1 items-center justify-between gap-3 pb-5 max-sm:flex-col max-sm:items-stretch",
                              index < activeQuestionnaireModules.length - 1 && "border-b border-black/5"
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-sans font-medium text-base leading-relaxed text-slate-900">
                                {section}
                              </div>
                              <div className="text-xs text-[var(--color-thread-muted-text)] mt-1 leading-relaxed">
                                {questions.length} questions
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 max-sm:justify-between">
                              <div
                                className={cn(
                                  "text-xs font-medium inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full uppercase tracking-[0.12em] whitespace-nowrap",
                                  isDone
                                    ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]"
                                    : status === "Not started"
                                    ? "bg-slate-100 text-[var(--color-thread-muted-text)]"
                                    : "bg-[var(--color-thread-cream)] text-[var(--color-thread-heading)]"
                                )}
                              >
                                {isDone && <Check className="w-3 h-3" />}
                                {isDone ? "Completed" : isInProgress ? "In Progress" : isMvp ? "Start module" : "Start section"}
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[var(--color-thread-muted-text)] transition-colors" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </Card>
                </div>
              )}

              {/* Submit Section */}
              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-[var(--color-thread-muted-text)]">
                  {allSectionsCompleted
                    ? isMvp
                      ? "All modules complete! Submit your responses now."
                      : "All sections complete! Submit your responses now."
                    : isMvp
                    ? "Complete all modules to submit."
                    : "Complete all sections to submit."}
                </span>
                <Button
                  onClick={handleSubmit}
                  disabled={!allSectionsCompleted}
                  variant="primary"
                  className={cn(
                    "rounded-full inline-flex items-center gap-2",
                    !allSectionsCompleted && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Save className="w-4 h-4" />
                  <span>Submit Final Questionnaire</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </PageContainer>

      <ModalShell
        isOpen={isClinicalInfoModalOpen}
        onRequestClose={() => setIsClinicalInfoModalOpen(false)}
        titleId="clinical-info-modal-title"
        size="small"
        panelClassName="p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <div className="space-y-2">
 <h2 id="clinical-info-modal-title" className="font-serif text-2xl leading-tight text-[var(--color-thread-heading)]">
                Confidential Clinical Information
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Your answers are encrypted end-to-end and shared only with your child&apos;s clinician, such as your GP, paediatrician or psychiatrist. You can edit your responses anytime before the review is finalized.
              </p>
            </div>
          </div>
          <ModalCloseButton onClick={() => setIsClinicalInfoModalOpen(false)} label="Close confidential clinical information" />
        </div>
      </ModalShell>

      {/* QUESTIONNAIRE MODAL - IMMERSIVE ONE-BY-ONE STEPPER PATTERN */}
      <ModalShell
        isOpen={Boolean(activeSection)}
        onRequestClose={() => {
          setIsModuleSuccessVisible(false);
          setActiveSection(null);
        }}
        titleId="questionnaire-modal"
        size="large"
        className="max-sm:p-0"
        radiusClassName="thread-modal-panel--scalloped max-sm:rounded-none"
        panelClassName="flex h-[100dvh] max-h-[100dvh] flex-col sm:h-auto sm:max-h-[90vh]"
      >
        <div className="flex min-h-0 h-full flex-col justify-between sm:min-h-[480px]">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:pb-5 sm:pt-6">
            <ActionLink
              as="button"
              icon={null}
              onClick={() => {
                setIsModuleSuccessVisible(false);
                setActiveSection(null);
              }}
              className="min-h-11 text-sm font-medium"
            >
              {isMvp ? "Save & exit module" : "Save & exit section"}
            </ActionLink>
            <ModalCloseButton
              onClick={() => {
                setIsModuleSuccessVisible(false);
                setActiveSection(null);
              }}
              label="Close"
            />
          </div>

          {/* Modal Body */}
          <div className="flex flex-1 flex-col justify-start space-y-6 overflow-y-auto px-4 py-6 sm:space-y-8 sm:px-10 sm:py-8">
            {isModuleSuccessVisible ? (
              <ModalOutcomeScreen
                titleId="questionnaire-modal"
                icon={<CheckCircle2 className="h-7 w-7 stroke-[1.8]" />}
                title="Clinical module complete"
                description={`All questions in this module for ${childName} are complete. Threadline will keep these answers in the Assessment Package preparation view.`}
                actionLabel="Back to modules"
                onAction={() => {
                  setIsModuleSuccessVisible(false);
                  setActiveSection(null);
                }}
              />
            ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`question-${activeQuestionIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6 sm:space-y-8"
                    >
                      {(() => {
                        const currentQuestions = activeQuestionnaireQuestions[activeSection || ""] || [];
                        const q = currentQuestions[activeQuestionIndex];
                        if (!q) return null;

                        const qText = q.text.replace(/\$\{childName\}/g, childName);
                        const qSub = q.subtext?.replace(/\$\{childName\}/g, childName);
                        const isSelected = (opt: string) => answers[q.id] === opt;

                        return (
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <div className="inline-flex rounded-tr-[18px] rounded-bl-[18px] bg-[var(--color-thread-light-green)]/70 px-4 py-2 text-sm font-medium text-[var(--color-thread-mid-green)] mb-1">
                                {activeSection}
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="mt-1 h-7 min-w-7 rounded-full bg-slate-100 text-xs font-medium tracking-[0.08em] text-[var(--color-thread-mid-green)] flex items-center justify-center">
                                  {activeQuestionIndex + 1}
                                </span>
                                <div>
 <h2 id="questionnaire-modal" className="font-serif text-2xl text-[var(--color-thread-heading)] leading-snug">
                                    {qText}
                                  </h2>
                                  {qSub && (
                                    <p className="text-[var(--color-thread-muted-text)] text-sm leading-relaxed mt-2 max-w-xl">
                                      {qSub}
                                    </p>
                                  )}
                                  <p className="text-xs uppercase tracking-wider text-[var(--color-thread-muted-text)] font-medium mt-4">
                                    {q.type === "choice" ? "Select one option below" : "Provide brief feedback"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="ml-0 sm:ml-10">
                              {q.type === "choice" && q.options && (
                                <div className="space-y-2.5 max-w-lg">
                                  {q.options.map((opt, oIdx) => {
                                    const selected = isSelected(opt);
                                    const letter = String.fromCharCode(65 + oIdx);
                                    return (
                                      <QuestionOption
                                        key={opt}
                                        onClick={() => handleSelectOption(q.id, opt)}
                                        selected={selected}
                                        marker={letter}
                                      >
                                        {opt}
                                      </QuestionOption>
                                    );
                                  })}
                                </div>
                              )}

                              {q.type === "text" && (
                                <div className="max-w-xl space-y-4">
                                  <textarea
                                    value={answers[q.id] || ""}
                                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                                    placeholder={q.placeholder || "Type your answer here..."}
                                    rows={4}
                                    className="thread-textarea thread-textarea--soft thread-textarea--compact"
                                  />
                                  <div className="flex items-center gap-3">
                                    <Button
                                      onClick={handleNextQuestion}
                                      variant="primary"
                                      className="min-h-11 w-full rounded-full px-5 py-2.5 shadow-none sm:w-auto"
                                      rightIcon={<Check className="w-4 h-4" />}
                                    >
                                      Continue
                                    </Button>
                                  </div>

                                  <QuestionNotSurePrompt
                                    marked={answers[q.id] === getNotSureAnswerValue(q.options)}
                                    onMark={() => handleMarkQuestionNotSure(q.id, q.options)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
            )}
                </div>

                {/* Modal Footer */}
                {!isModuleSuccessVisible && (
                <div className="flex flex-col items-stretch gap-3 border-t border-black/5 bg-slate-50/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-5">
                  <Button
                    type="button"
                    onClick={handlePrevQuestion}
                    disabled={activeQuestionIndex === 0}
                    variant="tertiary"
                    className="min-h-11 w-full px-4 text-sm font-medium shadow-none sm:min-h-0 sm:w-auto sm:text-xs"
                    leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  >
                    Previous
                  </Button>

                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Button
                      type="button"
                      onClick={handleNextQuestion}
                      variant="primary"
                      className="min-h-11 w-full px-4 text-sm font-medium shadow-none sm:min-h-0 sm:w-auto sm:text-xs"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      <span>
                        {activeQuestionIndex ===
                        (activeQuestionnaireQuestions[activeSection || ""] || []).length - 1
                          ? isMvp
                            ? "Exit Module"
                            : "Exit Section"
                          : "Next"}
                      </span>
                    </Button>
                  </div>
                </div>
                )}
              </div>
      </ModalShell>
    </motion.div>
  );
}
