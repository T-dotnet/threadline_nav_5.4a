import { motion } from "motion/react";
import {
  ClipboardList,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  Stethoscope,
  Heart,
  ChevronDown,
  Settings as SettingsIcon,
  CalendarClock,
  Upload,
  LineChart,
  Users,
  ListTodo,
  Eye,
  MessageSquare,
  Lightbulb,
  Video,
  Download,
  GraduationCap,
  Check,
  LockKeyhole,
  Save,
  Tag,
  Info,
  X
} from "lucide-react";
import { PageContainer } from "./ui/PageContainer";
import { PageHeader } from "./ui/PageHeader";
import { PageIcon } from "./ui/PageIcon";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionDescription } from "./ui/SectionDescription";
import { TimelineStep } from "./ui/TimelineStep";
import { AreaItem } from "./ui/AreaItem";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { ClinicalHighlight } from "./ui/ClinicalHighlight";
import { ProgressBar } from "./ui/ProgressBar";
import { ProgressRing } from "./ui/ProgressRing";
import { ProcessStepperSidebar, type ProcessStepperMobileBehavior } from "./ui/ProcessStepperSidebar";
import type { ProcessStep } from "./ui/ProcessStepper";
import { PreparationChecklistCard } from "./ui/PreparationChecklistCard";
import { ActionLink } from "./ui/ActionLink";
import { TimelineItem } from "./ui/TimelineItem";
import { LockerItem } from "./ui/LockerItem";
import { GuideCard } from "./ui/GuideCard";
import { ModalCloseButton, ModalShell } from "./ui/ModalShell";
import { ModalOutcomeScreen } from "./ui/ModalOutcomeScreen";
import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { useLocker, type DocFile } from "../context/LockerContext";
import { useSecondaryUsers } from "../context/SecondaryUsersContext";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import {
  getChildProfileKey,
  getAssessmentProgressCardData,
  hasSubmittedAssessmentQuestionnaire,
  hasReturnedAssessmentResults,
  isDiagnosticPathway,
  usesAssessmentCard,
  usesAssessmentProgressCard,
  usesCompletedAssessmentReport,
  usesMvpNewChildSetup,
  getChildSessionStatus,
  getSessionDate,
} from "../lib/childStatus";
import { DEFAULT_CLINICIAN_NAME } from "../lib/clinicalProvider";
import {
  CHILD_PERSPECTIVE_MODULE_TITLE,
  MVP_CLINICAL_MODULE_QUESTIONS,
  MVP_WORKFLOW_QUESTIONS,
} from "../lib/familyJourneyQuestionBank";
import { getResourceGuides } from "../lib/resourceGuides";
import { getFeatureCardCornerClass } from "../lib/cornerStyles";
import {
  DIAGNOSTIC_ASSESSMENT_PRICE,
  DIAGNOSTIC_DISCOUNT_CODE_EXAMPLE,
  DIAGNOSTIC_DISCOUNT_CODES,
  type DiagnosticDiscountCode,
  formatAssessmentPackagePrice,
} from "../lib/assessmentCheckout";
import { CLINICIAN_SHARE_DEFAULTS, CLINICIAN_SHARE_PLACEHOLDERS } from "../lib/clinicianSharing";
import { DEFAULT_SESSION_TIME } from "../lib/sessionDefaults";
import { isAnswered } from "../questionnaire";
import { cn } from "../lib/utils";
import type { GuideCardProps } from "../types";

import clinicalReportImg from "../assets/images/clinical_report_placeholder_1783000795444.jpg";
import pediatricianQuestionsImage from "../assets/images/optimized/abstract-pediatrician-questions-900.jpg";
import classroomSupportImage from "../assets/images/optimized/abstract-classroom-support-900.jpg";
import breathingRhythmImage from "../assets/images/optimized/abstract-breathing-coregulation-900.jpg";
import watercolorBgImage from "../assets/images/optimized/abstract-assessment-documents-900.jpg";

const OPEN_CLINICAL_MODULES_REQUEST_KEY = "threadline-open-clinical-modules-request";
const OPEN_CLINICIAN_SHARE_REQUEST_KEY = "threadline-open-clinician-share-request";
const MVP_QUESTIONNAIRE_MODULES = Object.keys(MVP_CLINICAL_MODULE_QUESTIONS);
const MVP_QUESTIONNAIRE_QUESTION_COUNT = Object.values(MVP_CLINICAL_MODULE_QUESTIONS).flat().length;
const CHECKLIST_DETAIL_WIDTH_CLASS = "w-full max-w-lg";
const MODAL_KICKER_CLASS = "text-[0.68rem] tracking-[0.18em] uppercase font-medium text-[var(--color-thread-mid-green)]";
const MODAL_TITLE_CLASS = "mt-2 font-serif font-normal text-[1.75rem] sm:text-[2rem] leading-[1.08] tracking-tight text-[var(--color-thread-heading)]";
const MODAL_BODY_CLASS = "text-sm text-slate-600 leading-relaxed";
const MODAL_FIELD_LABEL_CLASS = "block text-xs font-semibold text-slate-600 mb-1.5";
const MODAL_CONFIRM_PANEL_CLASS = "space-y-3 rounded-none rounded-tr-[28px] bg-[var(--color-thread-off-white)] p-4";
const MODAL_CONFIRM_TITLE_CLASS = "block text-xs font-semibold text-slate-700";
const MODAL_CONFIRM_ROW_CLASS = "flex items-start gap-3 text-xs leading-relaxed text-slate-700";
const MODAL_CHECKBOX_CLASS = "mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--color-thread-mid-green)] focus:ring-[var(--color-thread-mid-green)]";
const MODAL_ATTACHED_HIGHLIGHT_CLASS = "rounded-none rounded-tr-[24px] bg-[var(--color-thread-off-white)] text-[var(--color-thread-dark-slate)] shadow-none";
const MODAL_ATTACHED_HIGHLIGHT_ICON_CLASS = "bg-white text-[var(--color-thread-mid-green)]";
const MODAL_FINE_PRINT_CLASS = "text-[11px] leading-relaxed text-slate-500";
const MODAL_LINK_BUTTON_CLASS = "font-semibold text-[var(--color-thread-mid-green)] underline decoration-[var(--color-thread-mid-green)]/30 underline-offset-2 hover:decoration-[var(--color-thread-mid-green)]";
const MODAL_SECONDARY_BUTTON_CLASS = "text-xs h-9 px-4 font-semibold rounded-full border-black/10 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer";
const MODAL_PRIMARY_BUTTON_CLASS = "text-xs h-9 px-4 font-semibold rounded-full cursor-pointer";
const CHECKOUT_SAVE_CARD_CLASS = `${MODAL_ATTACHED_HIGHLIGHT_CLASS} flex cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-thread-off-white)]/80`;
const CHECKOUT_SUMMARY_PANEL_CLASS = "space-y-4 rounded-none rounded-tr-[30px] border border-black/5 bg-white p-5";
const CHECKOUT_SUMMARY_ROW_CLASS = "flex justify-between gap-4 text-[var(--color-thread-gray)]";
const CHECKOUT_SUMMARY_META_CLASS = "mt-0.5 block text-xs text-slate-400";
const CHECKOUT_TOTAL_ROW_CLASS = "flex justify-between gap-4 pt-2 text-lg font-semibold text-[var(--color-thread-heading)]";
const CHECKOUT_ICON_BUTTON_CLASS = "inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-[var(--color-thread-soft-green)] hover:text-[var(--color-thread-dark-green)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/30";
const CHECKOUT_TOOLTIP_CLASS = "pointer-events-none absolute left-1/2 top-7 z-20 hidden w-60 -translate-x-1/2 rounded-none rounded-tr-[18px] border border-black/5 bg-white px-3 py-2 text-left text-xs font-normal leading-relaxed text-slate-600 shadow-[0_18px_45px_rgba(15,23,42,0.14)] group-focus-within:block group-hover:block sm:left-auto sm:right-0 sm:translate-x-0";
const ASSESSMENT_READY_ICON_CLASS = "w-[22px] h-[22px] stroke-[1.7] text-[var(--color-thread-ready-green)]";
const ASSESSMENT_SUPPORT_ICON_CLASS = "w-[19px] h-[19px] stroke-[1.8] text-[var(--color-thread-ready-green)]";
const ASSESSMENT_SUPPORT_ICON_WRAPPER_CLASS = "text-[var(--color-thread-ready-green)]";
const NOT_COLLECTED_YET_ANSWER = "not collected yet";
const NOT_SURE_PROMPT_TEXT = "Not sure? That's fine. We'll mark this as \"not collected yet\" so you remember it's open - not blank.";
const QUESTION_NOT_SURE_PROMPT_CLASS = `${MODAL_ATTACHED_HIGHLIGHT_CLASS} flex flex-wrap items-center justify-between gap-4 border border-black/5 px-4 py-3 text-sm`;

const getNotSureAnswerValue = (options?: string[]) =>
  options?.find((option) => option.toLowerCase() === "not sure") ?? NOT_COLLECTED_YET_ANSWER;

type ClinicalModulesOpenRequest = {
  childId?: string;
  childName?: string;
  openClinicalModules?: boolean;
};

type ClinicianShareOpenRequest = {
  childId?: string;
  childName?: string;
  openClinicianShare?: boolean;
};

type ClinicalModuleModalTarget = {
  section: string;
  index: number;
};

type DocumentUploadStep = 1 | 2 | 3 | 4;

const DOCUMENT_UPLOAD_STEPS = [
  { num: 1, title: "Upload file", desc: "Select source" },
  { num: 2, title: "Document type", desc: "Associate file" },
  { num: 3, title: "Locker gate", desc: "Confirm access" },
  { num: 4, title: "Confirm upload", desc: "Final review" },
];

const DOCUMENT_TYPE_OPTIONS = [
  { typeId: "report", typeName: "Report" },
  { typeId: "schoolpack", typeName: "School Pack" },
  { typeId: "school", typeName: "School" },
  { typeId: "clinical", typeName: "Clinical" },
];

const CHILD_PERSPECTIVE_STEP_TITLES: Record<string, string> = {
  "What is hardest for you?": "Hardest part",
  "What helps you when things are hard?": "What helps",
  "What do grown ups get wrong about you?": "Misunderstood",
  "What are you good at?": "Strengths",
  "What kind of support would you like?": "Support wanted",
};

const getChildPerspectiveStepTitle = (questionText: string, index: number) =>
  CHILD_PERSPECTIVE_STEP_TITLES[questionText] ?? `Question ${index + 1}`;

const getClinicalModuleModalTarget = (
  questionnaireAnswers: Record<string, unknown>,
  section?: string,
): ClinicalModuleModalTarget | null => {
  const latestInProgressSection = [...MVP_QUESTIONNAIRE_MODULES].reverse().find((sectionName) => {
    const questions = MVP_CLINICAL_MODULE_QUESTIONS[sectionName] ?? [];
    const answeredCount = questions.filter((question) => isAnswered(questionnaireAnswers[question.id])).length;
    return answeredCount > 0 && answeredCount < questions.length;
  });
  const firstIncompleteSection = MVP_QUESTIONNAIRE_MODULES.find((sectionName) =>
    (MVP_CLINICAL_MODULE_QUESTIONS[sectionName] ?? []).some((question) => !isAnswered(questionnaireAnswers[question.id]))
  );
  const targetSection = section ?? latestInProgressSection ?? firstIncompleteSection ?? MVP_QUESTIONNAIRE_MODULES[0];

  if (!targetSection) return null;

  const questions = MVP_CLINICAL_MODULE_QUESTIONS[targetSection] ?? [];
  const firstUnansweredIndex = questions.findIndex((question) => !isAnswered(questionnaireAnswers[question.id]));

  return {
    section: targetSection,
    index: firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0,
  };
};

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
type DiagnosticCheckoutStep = "legal" | "payment" | "complete";
type RequiredThreadConsent = "guardian" | "medical" | "terms";
type OptionalThreadConsent = "improveThreadline" | "improveAssessment";

function StepperModalHeader({
  closeLabel,
  onClose,
}: {
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
      <ActionLink
        as="button"
        icon={null}
        onClick={onClose}
        className="text-[0.84rem] font-semibold"
      >
        Save & exit
      </ActionLink>
      <ModalCloseButton onClick={onClose} label={closeLabel} />
    </div>
  );
}

function QuestionnaireModuleModalFrame({
  isOpen,
  titleId,
  activeStep,
  completedSteps,
  heading,
  steps,
  closeLabel,
  onClose,
  onStepSelect,
  mobileBehavior = "right-rail",
  children,
  footer,
}: {
  isOpen: boolean;
  titleId: string;
  activeStep: number;
  completedSteps?: number[];
  heading: string;
  steps: ProcessStep[];
  closeLabel: string;
  onClose: () => void;
  onStepSelect?: (step: ProcessStep) => void;
  mobileBehavior?: ProcessStepperMobileBehavior;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <ModalShell
      isOpen={isOpen}
      titleId={titleId}
      size="large"
      panelClassName="flex max-h-[90vh] flex-col overflow-hidden p-0"
    >
      <div className="relative flex min-h-0 flex-col md:min-h-[560px] md:flex-row">
        <ProcessStepperSidebar
          activeStep={activeStep}
          completedSteps={completedSteps}
          heading={heading}
          steps={steps}
          side="left"
          mobileBehavior={mobileBehavior}
          mobileBorder="bottom"
          className="md:max-h-[90vh] md:overflow-y-auto"
          onStepSelect={onStepSelect}
        />

        <div className="flex min-w-0 flex-1 flex-col max-md:pr-14">
          <StepperModalHeader closeLabel={closeLabel} onClose={onClose} />

          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
            {children}
          </div>

          {footer && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 bg-slate-50/60 px-6 py-5 sm:px-10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function OverallProgressCircleCard({
  progress,
  actionLabel,
  onAction,
  showActionButton = false,
  disabled = false,
}: {
  progress: number;
  actionLabel?: string;
  onAction?: () => void;
  showActionButton?: boolean;
  disabled?: boolean;
}) {
  const normalizedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  if (showActionButton && actionLabel && onAction) {
    return (
      <div
        data-testid="assessment-progress-circle-card"
        className="relative flex w-[190px] flex-shrink-0 items-center justify-center"
      >
        <Button
          data-testid="assessment-progress-circle-action"
          variant="secondary"
          onClick={onAction}
          disabled={disabled}
          className="h-9 min-h-0 px-5 text-[0.8rem] font-semibold"
        >
          {actionLabel}
        </Button>
      </div>
    );
  }

  return (
    <div
      data-testid="assessment-progress-circle-card"
      className="relative flex w-[190px] flex-shrink-0 items-center justify-center"
    >
      <ProgressRing
        value={normalizedProgress}
        label={`Overall progress ${normalizedProgress}%`}
        className="h-20 w-20 p-[5px]"
        centerClassName="bg-transparent"
      />
    </div>
  );
}

function DiagnosticAssessmentReadyPanel({
  childName,
  isShared,
  resourceGuides = [],
  onShare,
  onUploadAssessment,
  onOpenResources,
  onBackToModules,
}: {
  childName: string;
  isShared: boolean;
  resourceGuides: GuideCardProps[];
  onShare: () => void;
  onUploadAssessment: () => void;
  onOpenResources: () => void;
  onBackToModules: () => void;
}) {
  return (
    <div
      data-testid="diagnostic-assessment-ready-panel"
      className="mt-8"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex w-full flex-col items-center rounded-none rounded-tr-[32px] border-0 bg-white px-6 py-10 shadow-none sm:px-8 sm:py-12">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--color-thread-mid-green)] bg-transparent text-[var(--color-thread-mid-green)]"
            aria-hidden="true"
          >
            <Check className="h-12 w-12 stroke-[2.4]" />
          </div>

          <h3 className="mt-5 font-sans text-[2.1rem] font-semibold leading-none text-[var(--color-thread-darkest)]">
            All set
          </h3>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button
              variant="forest"
              onClick={isShared ? onUploadAssessment : onShare}
              rightIcon={isShared ? <Upload className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              className="h-10 px-5 text-xs font-semibold"
            >
              {isShared ? "Upload assessment" : "Share with Clinician"}
            </Button>
            <Button
              type="button"
              onClick={onBackToModules}
              variant="ghost"
              className="text-sm font-medium"
            >
              Back to modules
            </Button>
          </div>
        </div>

        <div className="mt-20 w-full pb-10 text-left sm:pb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>
                From resources
              </SectionLabel>
              <SectionTitle className="mb-0">
                Three articles to read next.
              </SectionTitle>
              <SectionDescription>
                Hand-picked articles based on {childName}&apos;s profile.
              </SectionDescription>
            </div>
            <ActionLink
              variant="forest"
              as="button"
              onClick={onOpenResources}
              className="text-[0.84rem]"
            >
              See all resources
            </ActionLink>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6 max-lg:grid-cols-1">
            {resourceGuides.map((guide, index) => (
              <GuideCard
                key={guide.title}
                {...guide}
                cornerClass={getFeatureCardCornerClass(index)}
                actionText="Open in resources"
                onClick={onOpenResources}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_REQUIRED_THREAD_CONSENTS: Record<RequiredThreadConsent, boolean> = {
  guardian: false,
  medical: false,
  terms: false,
};

const DEFAULT_OPTIONAL_THREAD_CONSENTS: Record<OptionalThreadConsent, boolean> = {
  improveThreadline: false,
  improveAssessment: false,
};

const DIAGNOSTIC_PERMISSION_NEXT_STEPS = [
  {
    title: "Uploading documents",
    text: "Confirm you have the right to upload and share documents before they become part of your child's Thread.",
  },
  {
    title: "Teacher invitation",
    text: "Confirm permission to provide teacher contact details before Threadline sends the secure questionnaire link.",
  },
  {
    title: "Share with Your Child's Clinician",
    text: "Confirm authorisation before the Assessment Package is securely shared with your child's clinician, such as your GP, paediatrician or psychiatrist.",
  },
];

const DIAGNOSTIC_CHECKOUT_STEPS = [
  { num: 1, title: "Legal", desc: "Create your Thread" },
  { num: 2, title: "Payment", desc: "Secure checkout" },
  { num: 3, title: "Continue", desc: "Ready for next steps" },
];

type CompletedReportEvidenceType = "observation" | "input" | "recommendation";

interface CompletedReportEvidenceItem {
  type: CompletedReportEvidenceType;
  label: string;
  content: string;
}

interface CompletedReportDomain {
  title: string;
  impact: string;
  status: string;
  summary: string;
  evidence: CompletedReportEvidenceItem[];
  sources: string[];
}

function CompletedReportDomainDetails({
  summary,
  evidence,
}: {
  summary: string;
  evidence: CompletedReportEvidenceItem[];
}) {
  const iconByType = {
    observation: Eye,
    input: MessageSquare,
    recommendation: Lightbulb,
  };

  return (
    <div className="space-y-4 mt-3 max-w-[62ch]">
      <p className="text-[0.96rem] text-[var(--color-thread-gray)] leading-relaxed font-sans">
        {summary}
      </p>
      <div className="bg-white p-5 rounded-none rounded-tr-[36px] text-[0.88rem] space-y-4 font-sans text-slate-700">
        {evidence.map((item) => {
          const Icon = iconByType[item.type];
          return (
            <div key={item.label} className="flex gap-3">
              <Icon
                className={[
                  "w-4 h-4 shrink-0 mt-0.5",
                  item.type === "recommendation" ? "text-[var(--color-thread-mid-green)]" : "text-slate-400",
                ].join(" ")}
              />
              <div>
                <span className="font-semibold text-slate-900 block mb-0.5">{item.label}</span>
                {item.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildCompletedAssessmentReport(childName: string, options: { returnedResults?: boolean } = {}) {
  const possessiveName = `${childName}'s`;

  return {
    title: `${possessiveName} assessment is complete.`,
    intro: options.returnedResults
      ? `${DEFAULT_CLINICIAN_NAME} has sent back ${possessiveName} Assessment Package. Results are now available to review.`
      : `All preparatory steps and document uploads have been completed. ${DEFAULT_CLINICIAN_NAME} has finalized ${possessiveName} Assessment Package.`,
    quote: options.returnedResults
      ? `${possessiveName} Assessment Package has been returned by the clinician. Results are available now.`
      : `${possessiveName} Assessment Package has been shared with your child's clinician, who is now preparing the clinical formulation.`,
    domains: [
      {
        title: "Executive function",
        impact: "High impact on school engagement",
        status: "NOT MET",
        summary: `Sustained attention and working memory present significant challenges in structured environments. ${childName} struggles with initiating tasks independently and managing distractions.`,
        evidence: [
          {
            type: "observation",
            label: "Clinical Observation",
            content: "Fidgets or leaves seat during tasks requiring sustained mental effort.",
          },
          {
            type: "input",
            label: "Parent Input",
            content: "Requires frequent prompts to complete multi-step routines at home.",
          },
          {
            type: "recommendation",
            label: "Recommendation",
            content: "Introduce visual checklists and structured breaks during school tasks.",
          },
        ],
        sources: ["12 observations", "7 extracts", "5 verbatim", "8 behavioural"],
      },
      {
        title: "Emotional regulation",
        impact: "Moderate impact during transitions",
        status: "MET",
        summary: `Strong emotional awareness, but gets overwhelmed when fatigue sets in. ${childName} benefits from clear, predictable routines to ease transition anxiety.`,
        evidence: [
          {
            type: "observation",
            label: "Clinical Observation",
            content: "Warm and generally cooperative, but shuts down or displays high frustration when tasks feel too complex.",
          },
          {
            type: "input",
            label: "Parent Input",
            content: "Meltdowns are common after school due to sensory and cognitive overload.",
          },
          {
            type: "recommendation",
            label: "Recommendation",
            content: "Establish an after-school quiet reset routine with low cognitive demand.",
          },
        ],
        sources: ["12 observations", "7 extracts"],
      },
      {
        title: "Sensory processing",
        impact: "Low-to-moderate impact",
        status: "MET",
        summary: `Responds well to calm, quiet environments. ${childName} shows high sensitivity to sudden loud auditory environments or overlapping noises.`,
        evidence: [
          {
            type: "observation",
            label: "Clinical Observation",
            content: "Observed covering ears in loud or busy shared areas.",
          },
          {
            type: "recommendation",
            label: "Recommendation",
            content: "Allow noise-cancelling headphones during independent classroom work time.",
          },
        ],
        sources: ["12 observations", "5 verbatim"],
      },
      {
        title: "Social participation",
        impact: "Positive asset",
        status: "MET",
        summary: `${childName} is imaginative, friendly, and eager to connect. They enjoy playing with peers, though occasional conflicts arise during structured team games.`,
        evidence: [
          {
            type: "observation",
            label: "Clinical Observation",
            content: "Demonstrates high social motivation and friendly cooperative play in one-on-one activities.",
          },
          {
            type: "recommendation",
            label: "Recommendation",
            content: "Encourage unstructured playground play and structured small-group activities with familiar peer mentors.",
          },
        ],
        sources: ["12 observations", "5 verbatim"],
      },
      {
        title: "Communication",
        impact: "Steady developmental track",
        status: "MET",
        summary: `${childName} expresses their needs clearly and has a rich vocabulary, but can become quiet or non-verbal when experiencing emotional or sensory overload.`,
        evidence: [
          {
            type: "observation",
            label: "Clinical Observation",
            content: "Articulate, descriptive, and highly expressive in low-stress one-on-one dialogues.",
          },
          {
            type: "recommendation",
            label: "Recommendation",
            content: "Provide options for non-verbal signaling (e.g., green/yellow/red emotion cards) when overwhelmed.",
          },
        ],
        sources: ["12 observations", "8 behavioural"],
      },
      {
        title: "Sleep",
        impact: "Supports cognitive stamina",
        status: "MET",
        summary: "Occasional restlessness during bedtime transitions, but generally achieves high-quality sleep which supports daytime regulation.",
        evidence: [
          {
            type: "input",
            label: "Parent Input",
            content: "Bedtime routine is stable, though transition to wind-down requires active support.",
          },
          {
            type: "recommendation",
            label: "Recommendation",
            content: "Maintain a strict screen-free boundary 60 minutes before bed.",
          },
        ],
        sources: ["7 extracts"],
      },
      {
        title: "School participation",
        impact: "Requires supportive structuring",
        status: "NOT MET",
        summary: "Highly engaged during active discussions or hands-on tasks, but school performance and stamina decline during silent, structured independent desk tasks.",
        evidence: [
          {
            type: "observation",
            label: "Teacher Observation",
            content: "Needs visual reminders to stay on task; can distract others when losing focus.",
          },
          {
            type: "recommendation",
            label: "Recommendation",
            content: `Position ${childName} near the front of the classroom and deliver instructions in simplified, sequential steps.`,
          },
        ],
        sources: ["5 verbatim", "8 behavioural"],
      },
      {
        title: "Physical wellbeing",
        impact: "Strong developmental asset",
        status: "MET",
        summary: `${childName} has excellent gross motor skills, stamina, and enjoys active outdoor running, climbing, and physical sports.`,
        evidence: [
          {
            type: "input",
            label: "Parent Input",
            content: "Active physical play is a major source of joy and co-regulation.",
          },
          {
            type: "recommendation",
            label: "Recommendation",
            content: "Integrate short movement breaks or active play opportunities to aid concentration.",
          },
        ],
        sources: ["7 extracts"],
      },
    ] satisfies CompletedReportDomain[],
  };
}

type TeacherChecklistStatus = "todo" | "sent" | "completed";

interface TeacherContact {
  name: string;
  email: string;
}

interface TeacherChecklistState {
  done: boolean;
  active: boolean;
  todo: boolean;
  meta: string;
  metaTag: string;
}

function getTeacherChecklistState({
  teacherStatus,
  teacherName,
  teacherEmail,
  isSeededComplete,
}: {
  teacherStatus: TeacherChecklistStatus;
  teacherName: string;
  teacherEmail: string;
  isSeededComplete: boolean;
}): TeacherChecklistState {
  const isComplete = isSeededComplete || teacherStatus === "completed";
  const resolvedTeacherName = teacherName || "Ms. Carter";
  const resolvedTeacherEmail = teacherEmail || "carter@oakwood.edu";

  if (isComplete) {
    return {
      done: true,
      active: false,
      todo: false,
      meta: `Completed by ${resolvedTeacherName} (${resolvedTeacherEmail})`,
      metaTag: "Completed",
    };
  }

  if (teacherStatus === "sent") {
    return {
      done: false,
      active: true,
      todo: false,
      meta: `Invitation sent to ${resolvedTeacherName} (${resolvedTeacherEmail})`,
      metaTag: "Pending Response",
    };
  }

  return {
    done: false,
    active: false,
    todo: true,
    meta: "Share link to the modules with homeroom teacher",
    metaTag: "To do",
  };
}

interface TeacherQuestionnaireChecklistContentProps {
  childName: string;
  teacherStatus: TeacherChecklistStatus;
  teacherName: string;
  teacherEmail: string;
  teacherMessage: string;
  teacherInviteError: string;
  teacherContactPermission: boolean;
  teacherAssessmentPermission: boolean;
  primaryTeacher?: TeacherContact;
  isSeededComplete: boolean;
  isInviteModalOpen: boolean;
  isConfirmingInvite: boolean;
  onTeacherNameChange: (value: string) => void;
  onTeacherEmailChange: (value: string) => void;
  onTeacherMessageChange: (value: string) => void;
  onTeacherContactPermissionChange: (value: boolean) => void;
  onTeacherAssessmentPermissionChange: (value: boolean) => void;
  onOpenTeacherInvite: () => void;
  onCloseTeacherInvite: () => void;
  onReviewTeacherInvite: (event: React.FormEvent) => void;
  onBackToTeacherInviteDetails: () => void;
  onConfirmTeacherInvite: () => void;
  onSimulateTeacherResponse: () => void;
  onResetTeacherStatus: () => void;
  layout?: "default" | "unboxed";
}

function TeacherQuestionnaireChecklistContent({
  childName,
  teacherStatus,
  teacherName,
  teacherEmail,
  teacherMessage,
  teacherInviteError,
  teacherContactPermission,
  teacherAssessmentPermission,
  primaryTeacher,
  isSeededComplete,
  isInviteModalOpen,
  isConfirmingInvite,
  onTeacherNameChange,
  onTeacherEmailChange,
  onTeacherMessageChange,
  onTeacherContactPermissionChange,
  onTeacherAssessmentPermissionChange,
  onOpenTeacherInvite,
  onCloseTeacherInvite,
  onReviewTeacherInvite,
  onBackToTeacherInviteDetails,
  onConfirmTeacherInvite,
  onSimulateTeacherResponse,
  onResetTeacherStatus,
  layout = "default",
}: TeacherQuestionnaireChecklistContentProps) {
  const isComplete = isSeededComplete || teacherStatus === "completed";
  const resolvedTeacherName = teacherName || "Ms. Carter";
  const resolvedTeacherEmail = teacherEmail || "carter@oakwood.edu";
  const isUnboxedLayout = layout === "unboxed";
  const statePanelClassName = [
    "w-full space-y-4 font-sans mt-2",
    isUnboxedLayout
      ? "max-w-xl"
      : "bg-[var(--color-thread-off-white)] p-5 rounded-none rounded-tr-[36px]",
  ].filter(Boolean).join(" ");
  const completedPanelClassName = [
    `${CHECKLIST_DETAIL_WIDTH_CLASS} space-y-2 mt-4`,
  ].join(" ");

  return (
    <div className={isUnboxedLayout ? "max-w-[62ch] space-y-4 pt-1" : "space-y-4 pt-1"}>
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        To understand how {childName} performs in structured school environments, we require observations from their classroom teacher. Send a secure, direct link to the educational checklist when you are ready.
      </p>

      {isComplete && (
        <div className={completedPanelClassName}>
          <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px] mb-2 font-sans">shared with teacher</span>
          <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl font-sans">
            <FileText className="w-4 h-4 text-[var(--color-thread-mid-green)] shrink-0" />
            <span className="font-medium truncate">Classroom focus &amp; attention questionnaire</span>
            <span className="text-slate-400 text-[10px] ml-auto shrink-0">Shared</span>
          </div>
          {!isSeededComplete && (
            <button
              onClick={onResetTeacherStatus}
              className="text-xs text-slate-500 font-medium hover:text-slate-800 underline transition-colors"
            >
              Reset / Invite Another Teacher
            </button>
          )}
        </div>
      )}

      {teacherStatus === "todo" && !isSeededComplete && (
        <div className={statePanelClassName}>
          <div>
            <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px] mb-2">
              Teacher questionnaire
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add the teacher&apos;s contact details and an optional note before the invitation is sent.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={onOpenTeacherInvite}
            className="text-xs h-9 px-4 font-semibold rounded-full cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Send Questionnaire Invitation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {teacherStatus === "sent" && !isSeededComplete && (
        <div className={statePanelClassName}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px]">
              Invitation Active
            </span>
            <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-semibold border border-amber-100">
              Awaiting teacher response
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            An invitation with a unique questionnaire token was emailed to <strong className="text-slate-800">{resolvedTeacherName}</strong> (<span className="text-slate-500">{resolvedTeacherEmail}</span>). Once submitted, their classroom observations will automatically merge here.
          </p>
          {teacherMessage.trim() && (
            <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-[var(--color-thread-mid-green)]/30 pl-3">
              Your message: &ldquo;{teacherMessage.trim()}&rdquo;
            </p>
          )}

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={onSimulateTeacherResponse}
              className="text-xs h-9 px-4 font-semibold rounded-full cursor-pointer"
            >
              Simulate Teacher Response (Mark Done)
            </Button>
            <Button
              variant="tertiary"
              onClick={onResetTeacherStatus}
              className="text-xs h-9 px-4 font-semibold rounded-full cursor-pointer"
            >
              Cancel / Reset
            </Button>
          </div>
        </div>
      )}

      <ModalShell
        isOpen={isInviteModalOpen}
        titleId="teacher-invite-modal-title"
        size="small"
        radiusClassName="rounded-none rounded-tr-[36px]"
      >
        <form onSubmit={onReviewTeacherInvite}>
          <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
            <div>
              <span className={MODAL_KICKER_CLASS}>
                Teacher questionnaire
              </span>
              <h2
                id="teacher-invite-modal-title"
                className={MODAL_TITLE_CLASS}
              >
                Invite your child&apos;s teacher
              </h2>
            </div>
            <ModalCloseButton
              onClick={onCloseTeacherInvite}
              label="Close teacher invitation modal"
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8">
            {isConfirmingInvite ? (
              <ModalOutcomeScreen
                kicker="Confirm"
                icon={<LockKeyhole className="h-7 w-7 stroke-[1.8]" />}
                title="Confirm teacher invitation"
                description="Please check the recipient details below. When you confirm, Threadline will send the secure teacher questionnaire invitation."
                className="min-h-0"
              >
                <div className={MODAL_CONFIRM_PANEL_CLASS}>
                  <span className={MODAL_CONFIRM_TITLE_CLASS}>
                    Send teacher questionnaire to:
                  </span>
                  <dl className="grid gap-3 text-sm">
                    <div>
                      <dt className="text-xs font-semibold text-slate-500">Teacher</dt>
                      <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{teacherName.trim()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-500">Email</dt>
                      <dd className="mt-0.5 break-words text-[var(--color-thread-dark-slate)]">{teacherEmail.trim()}</dd>
                    </div>
                    {teacherMessage.trim() && (
                      <div>
                        <dt className="text-xs font-semibold text-slate-500">Message</dt>
                        <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">&ldquo;{teacherMessage.trim()}&rdquo;</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <p className={MODAL_FINE_PRINT_CLASS}>
                  Your information is only shared with your permission. You can go back to edit these details before confirming.
                </p>
              </ModalOutcomeScreen>
            ) : (
              <>
                <p className={MODAL_BODY_CLASS}>
                  We&apos;ll send your child&apos;s teacher a secure link to complete a questionnaire.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="teacher-invite-name">
                      Teacher name
                    </label>
                    <input
                      id="teacher-invite-name"
                      type="text"
                      placeholder="e.g. Ms. Carter"
                      value={teacherName}
                      onChange={(event) => onTeacherNameChange(event.target.value)}
                      className="thread-input thread-input--default text-sm"
                    />
                  </div>
                  <div>
                    <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="teacher-invite-email">
                      Teacher email
                    </label>
                    <input
                      id="teacher-invite-email"
                      type="email"
                      placeholder="e.g. carter@oakwood.edu"
                      value={teacherEmail}
                      onChange={(event) => onTeacherEmailChange(event.target.value)}
                      className="thread-input thread-input--default text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="teacher-invite-message">
                    Short message <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="teacher-invite-message"
                    rows={4}
                    maxLength={280}
                    placeholder="Add a short note for the teacher."
                    value={teacherMessage}
                    onChange={(event) => onTeacherMessageChange(event.target.value)}
                    className="thread-textarea thread-textarea--soft thread-textarea--compact"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400">{teacherMessage.length}/280</p>
                </div>

                <div className={MODAL_CONFIRM_PANEL_CLASS}>
                  <span className={MODAL_CONFIRM_TITLE_CLASS}>
                    Please confirm:
                  </span>
                  <label className={MODAL_CONFIRM_ROW_CLASS}>
                    <input
                      type="checkbox"
                      checked={teacherContactPermission}
                      onChange={(event) => onTeacherContactPermissionChange(event.target.checked)}
                      className={MODAL_CHECKBOX_CLASS}
                    />
                    <span>
                      I have permission to provide my child&apos;s teacher&apos;s contact details.
                    </span>
                  </label>
                  <label className={MODAL_CONFIRM_ROW_CLASS}>
                    <input
                      type="checkbox"
                      checked={teacherAssessmentPermission}
                      onChange={(event) => onTeacherAssessmentPermissionChange(event.target.checked)}
                      className={MODAL_CHECKBOX_CLASS}
                    />
                    <span>
                      I authorise Threadline to contact my child&apos;s teacher to collect assessment information.
                    </span>
                  </label>
                  <p className={MODAL_FINE_PRINT_CLASS}>
                    Learn more:{" "}
                    <button
                      type="button"
                      className={MODAL_LINK_BUTTON_CLASS}
                    >
                      Privacy Policy
                    </button>
                  </p>
                  <p className={MODAL_FINE_PRINT_CLASS}>
                    Your information is only shared with your permission.
                  </p>
                </div>
              </>
            )}

            {teacherInviteError && (
              <p className="text-xs text-red-500 font-medium">{teacherInviteError}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {primaryTeacher && teacherName !== primaryTeacher.name && (
                <button
                  type="button"
                  onClick={() => {
                    onTeacherNameChange(primaryTeacher.name);
                    onTeacherEmailChange(primaryTeacher.email);
                  }}
                  className="text-[11px] text-[var(--color-thread-mid-green)] font-medium hover:underline"
                >
                  Quick select {primaryTeacher.name} (Teacher)
                </button>
              )}
              <div className="ml-auto flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={isConfirmingInvite ? onBackToTeacherInviteDetails : onCloseTeacherInvite}
                  className={MODAL_SECONDARY_BUTTON_CLASS}
                >
                  {isConfirmingInvite ? "Back" : "Cancel"}
                </Button>
                {isConfirmingInvite ? (
                  <Button
                    type="button"
                    variant="primary"
                    className={MODAL_PRIMARY_BUTTON_CLASS}
                    rightIcon={<Check className="w-3.5 h-3.5" />}
                    onClick={onConfirmTeacherInvite}
                  >
                    Confirm and send
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    className={MODAL_PRIMARY_BUTTON_CLASS}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Review before sending
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

interface MvpClinicianShareModalProps {
  clinicianName: string;
  clinicianPractice: string;
  clinicianEmail: string;
  sharePermission: boolean;
  shareError: string;
  isConfirmingShare: boolean;
  isOpen: boolean;
  onClinicianNameChange: (value: string) => void;
  onClinicianPracticeChange: (value: string) => void;
  onClinicianEmailChange: (value: string) => void;
  onSharePermissionChange: (value: boolean) => void;
  onBackToDetails: () => void;
  onClose: () => void;
  onReviewShare: (event: React.FormEvent) => void;
  onConfirmShare: () => void;
}

function MvpClinicianShareModal({
  clinicianName,
  clinicianPractice,
  clinicianEmail,
  sharePermission,
  shareError,
  isConfirmingShare,
  isOpen,
  onClinicianNameChange,
  onClinicianPracticeChange,
  onClinicianEmailChange,
  onSharePermissionChange,
  onBackToDetails,
  onClose,
  onReviewShare,
  onConfirmShare,
}: MvpClinicianShareModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      titleId="clinician-share-modal-title"
      size="small"
      radiusClassName="rounded-none rounded-tr-[36px]"
    >
      <form onSubmit={onReviewShare}>
        <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
          <div>
            <span className={MODAL_KICKER_CLASS}>
              Share with Your Child&apos;s Clinician
            </span>
            <h2
              id="clinician-share-modal-title"
              className={MODAL_TITLE_CLASS}
            >
              Your Assessment Package is ready
            </h2>
          </div>
          <ModalCloseButton
            onClick={onClose}
            label="Close clinician sharing modal"
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8">
          {isConfirmingShare ? (
            <ModalOutcomeScreen
              kicker="Confirm"
              icon={<LockKeyhole className="h-7 w-7 stroke-[1.8]" />}
              title="Confirm before sharing"
              description="Please check the recipient details below. When you confirm, Threadline will mark this Assessment Package as shared with your child's clinician."
              className="min-h-0"
            >
              <div className={MODAL_CONFIRM_PANEL_CLASS}>
                <span className={MODAL_CONFIRM_TITLE_CLASS}>
                  Share Assessment Package with:
                </span>
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">Clinician</dt>
                    <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{clinicianName.trim()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">Medical centre</dt>
                    <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{clinicianPractice.trim()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">Email</dt>
                    <dd className="mt-0.5 break-words text-[var(--color-thread-dark-slate)]">{clinicianEmail.trim()}</dd>
                  </div>
                </dl>
              </div>

              <p className={MODAL_FINE_PRINT_CLASS}>
                Your information is only shared with your permission. You can go back to edit these details before confirming.
              </p>
            </ModalOutcomeScreen>
          ) : (
            <>
              <p className={MODAL_BODY_CLASS}>
                Your Assessment Package is complete and ready to share with your child&apos;s clinician, such as your GP, paediatrician or psychiatrist.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="clinician-share-name">
                    Clinician name
                  </label>
                  <input
                    id="clinician-share-name"
                    type="text"
                    placeholder={CLINICIAN_SHARE_PLACEHOLDERS.name}
                    value={clinicianName}
                    onChange={(event) => onClinicianNameChange(event.target.value)}
                    className="thread-input thread-input--default text-sm"
                  />
                </div>
                <div>
                  <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="clinician-share-email">
                    Email address
                  </label>
                  <input
                    id="clinician-share-email"
                    type="email"
                    placeholder={CLINICIAN_SHARE_PLACEHOLDERS.email}
                    value={clinicianEmail}
                    onChange={(event) => onClinicianEmailChange(event.target.value)}
                    className="thread-input thread-input--default text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="clinician-share-practice">
                    Medical centre
                  </label>
                  <input
                    id="clinician-share-practice"
                    type="text"
                    placeholder={CLINICIAN_SHARE_PLACEHOLDERS.practice}
                    value={clinicianPractice}
                    onChange={(event) => onClinicianPracticeChange(event.target.value)}
                    className="thread-input thread-input--default text-sm"
                  />
                </div>
              </div>

              <div className={MODAL_CONFIRM_PANEL_CLASS}>
                <span className={MODAL_CONFIRM_TITLE_CLASS}>
                  Please confirm:
                </span>
                <label className={MODAL_CONFIRM_ROW_CLASS}>
                  <input
                    type="checkbox"
                    checked={sharePermission}
                    onChange={(event) => onSharePermissionChange(event.target.checked)}
                    className={MODAL_CHECKBOX_CLASS}
                  />
                  <span>
                    I authorise Threadline to securely share my child&apos;s Assessment Package and
                    supporting information with my child&apos;s clinician.
                  </span>
                </label>
                <p className={MODAL_FINE_PRINT_CLASS}>
                  Learn more:{" "}
                  <button
                    type="button"
                    className={MODAL_LINK_BUTTON_CLASS}
                  >
                    Privacy Policy
                  </button>
                </p>
                <p className={MODAL_FINE_PRINT_CLASS}>
                  Your information is only shared with your permission.
                </p>
              </div>
            </>
          )}

          {shareError && (
            <p className="text-xs text-red-500 font-medium">{shareError}</p>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
            <div className="ml-auto flex flex-wrap gap-3">
              <Button
                type="button"
                variant="tertiary"
                onClick={isConfirmingShare ? onBackToDetails : onClose}
                className={MODAL_SECONDARY_BUTTON_CLASS}
              >
                {isConfirmingShare ? "Back" : "Cancel"}
              </Button>
              {isConfirmingShare ? (
                <Button
                  type="button"
                  variant="primary"
                  className={MODAL_PRIMARY_BUTTON_CLASS}
                  rightIcon={<Check className="w-3.5 h-3.5" />}
                  onClick={onConfirmShare}
                >
                  Confirm and share
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  className={MODAL_PRIMARY_BUTTON_CLASS}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Review before sharing
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

interface MvpDiagnosticCheckoutModalProps {
  childName: string;
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

function MvpDiagnosticCheckoutModal({
  childName,
  isOpen,
  onClose,
  onContinue,
}: MvpDiagnosticCheckoutModalProps) {
  const [step, setStep] = React.useState<DiagnosticCheckoutStep>("legal");
  const [requiredConsents, setRequiredConsents] = React.useState(DEFAULT_REQUIRED_THREAD_CONSENTS);
  const [optionalConsents, setOptionalConsents] = React.useState(DEFAULT_OPTIONAL_THREAD_CONSENTS);
  const [isOptionalConsentsOpen, setIsOptionalConsentsOpen] = React.useState(false);
  const [discountCode, setDiscountCode] = React.useState("");
  const [appliedDiscountCode, setAppliedDiscountCode] = React.useState<DiagnosticDiscountCode | null>(null);
  const [discountError, setDiscountError] = React.useState("");
  const [saveCardForCheckout, setSaveCardForCheckout] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) return;
    setStep("legal");
    setRequiredConsents(DEFAULT_REQUIRED_THREAD_CONSENTS);
    setOptionalConsents(DEFAULT_OPTIONAL_THREAD_CONSENTS);
    setIsOptionalConsentsOpen(false);
    setDiscountCode("");
    setAppliedDiscountCode(null);
    setDiscountError("");
    setSaveCardForCheckout(true);
  }, [isOpen]);

  const canCreateThread = Object.values(requiredConsents).every(Boolean);
  const appliedDiscount = appliedDiscountCode ? DIAGNOSTIC_DISCOUNT_CODES[appliedDiscountCode] : null;
  const discountAmount = appliedDiscount
    ? Math.round(DIAGNOSTIC_ASSESSMENT_PRICE * (appliedDiscount.percentage / 100))
    : 0;
  const total = DIAGNOSTIC_ASSESSMENT_PRICE - discountAmount;
  const formattedTotal = formatAssessmentPackagePrice(total);
  const formattedPaymentTotal = formatAssessmentPackagePrice(total, true);
  const optionalConsentCount = Object.values(optionalConsents).filter(Boolean).length;
  const checkoutActiveStep = step === "legal" ? 1 : step === "payment" ? 2 : 3;

  const toggleRequiredConsent = (key: RequiredThreadConsent) => {
    setRequiredConsents((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const toggleOptionalConsent = (key: OptionalThreadConsent) => {
    setOptionalConsents((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleApplyDiscount = () => {
    const normalizedCode = discountCode.trim().toUpperCase() as DiagnosticDiscountCode;

    if (!normalizedCode) {
      setDiscountError("Enter a discount code first.");
      setAppliedDiscountCode(null);
      return;
    }

    if (!DIAGNOSTIC_DISCOUNT_CODES[normalizedCode]) {
      setDiscountError(`That code is not active. Try ${DIAGNOSTIC_DISCOUNT_CODE_EXAMPLE}.`);
      setAppliedDiscountCode(null);
      return;
    }

    setDiscountError("");
    setAppliedDiscountCode(normalizedCode);
    setDiscountCode(normalizedCode);
  };

  const handleContinue = () => {
    onClose();
    onContinue();
  };

  const requiredConsentRows: Array<{ id: RequiredThreadConsent; label: React.ReactNode }> = [
    {
      id: "guardian",
      label: "I am the parent or legal guardian of this child, or I have authority to provide this information.",
    },
    {
      id: "medical",
      label: "I understand Threadline helps prepare an Assessment Package and does not diagnose ADHD or provide medical advice.",
    },
    {
      id: "terms",
      label: (
        <>
          I have read and agree to the{" "}
          <button type="button" className="font-semibold text-[var(--color-thread-mid-green)] underline decoration-[var(--color-thread-mid-green)]/30 underline-offset-2">
            Terms of Use
          </button>{" "}
          and{" "}
          <button type="button" className="font-semibold text-[var(--color-thread-mid-green)] underline decoration-[var(--color-thread-mid-green)]/30 underline-offset-2">
            Privacy Policy
          </button>
          .
        </>
      ),
    },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      titleId="diagnostic-checkout-title"
      maxWidthClassName="max-w-5xl"
      radiusClassName="rounded-none rounded-tr-[40px]"
      panelClassName="overflow-hidden"
    >
      <div className="grid min-h-0 grid-cols-[300px_minmax(0,1fr)] bg-white md:min-h-[620px] max-md:grid-cols-1">
        <ProcessStepperSidebar
          activeStep={checkoutActiveStep}
          heading="Diagnostic checkout"
          steps={DIAGNOSTIC_CHECKOUT_STEPS}
          side="left"
          mobileBehavior="hidden"
        />

        <div className="flex min-h-0 flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
            <div>
              <span className={MODAL_KICKER_CLASS}>
                {step === "legal" ? "Create your Thread" : step === "payment" ? "Secure checkout" : "Thread created"}
              </span>
              <h2
                id="diagnostic-checkout-title"
                className={MODAL_TITLE_CLASS}
              >
                {step === "legal"
                  ? "Before you continue, please confirm."
                  : step === "payment"
                  ? "Choose your price and complete payment."
                  : "You are ready to keep going."}
              </h2>
            </div>
            <ModalCloseButton
              onClick={onClose}
              label="Close diagnostic checkout"
              className="cursor-pointer"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            {step === "legal" && (
              <div className="space-y-7">
                <ClinicalHighlight
                  className={MODAL_ATTACHED_HIGHLIGHT_CLASS}
                  icon={<LockKeyhole className="h-5 w-5" />}
                  iconClassName={MODAL_ATTACHED_HIGHLIGHT_ICON_CLASS}
                >
                  We ask these first so every Thread begins with permission, clarity, and plain-language expectations.
                </ClinicalHighlight>

                <div className="space-y-3">
                  {requiredConsentRows.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <input
                        type="checkbox"
                        checked={requiredConsents[item.id]}
                        onChange={() => toggleRequiredConsent(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[var(--color-thread-mid-green)]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="border-t border-black/10 py-6 px-0.5">
                  <button
                    type="button"
                    aria-expanded={isOptionalConsentsOpen}
                    aria-controls="diagnostic-optional-consents-panel"
                    onClick={() => setIsOptionalConsentsOpen((current) => !current)}
                    className="flex w-full cursor-pointer select-none items-start justify-between gap-4.5 rounded-sm text-left transition-colors hover:bg-black/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-thread-mid-green)] max-md:flex-wrap"
                  >
                    <span className="flex min-w-0 items-start gap-3">
                      <ChevronDown
                        className={[
                          "mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
                          isOptionalConsentsOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                      <span className="min-w-0">
                        <span className="block text-[1.04rem] font-medium tracking-tight text-[var(--color-thread-dark-slate)]">
                          Help every child be understood <span className="font-normal text-slate-400">(optional)</span>
                        </span>
                        <span className="mt-1 block max-w-[62ch] text-[0.78rem] leading-relaxed text-[var(--color-thread-gray)]">
                          Every child deserves the opportunity to be understood. With your permission, you can help us improve Threadline and future ADHD assessment.
                        </span>
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end pt-1">
                      {optionalConsentCount > 0 && (
                        <span className="rounded-full bg-[var(--color-thread-light-green)] px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-[var(--color-thread-mid-green)]">
                          {optionalConsentCount} selected
                        </span>
                      )}
                    </span>
                  </button>

                  {isOptionalConsentsOpen && (
                    <div id="diagnostic-optional-consents-panel" className="mt-4 grid gap-3 pl-8 max-sm:pl-0">
                      <label className="flex cursor-pointer gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 transition-colors hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={optionalConsents.improveThreadline}
                          onChange={() => toggleOptionalConsent("improveThreadline")}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[var(--color-thread-mid-green)]"
                        />
                        <span>
                          <strong className="block text-slate-900">Help improve Threadline</strong>
                          Use de-identified information to improve Threadline and develop future assessment and care technologies.
                          <span className="mt-1 block text-xs font-semibold text-[var(--color-thread-mid-green)]">Learn more: Research &amp; Improvement Policy</span>
                        </span>
                      </label>

                      <label className="flex cursor-pointer gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 transition-colors hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={optionalConsents.improveAssessment}
                          onChange={() => toggleOptionalConsent("improveAssessment")}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[var(--color-thread-mid-green)]"
                        />
                        <span>
                          <strong className="block text-slate-900">Help improve ADHD assessment</strong>
                          Use de-identified information to support ethically approved research that helps improve ADHD assessment and care.
                          <span className="mt-1 block text-xs font-semibold text-[var(--color-thread-mid-green)]">Learn more: Research &amp; Improvement Policy</span>
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
                <div className="space-y-5">
                  <div className="grid gap-4">
                    <div>
                      <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-card-name">
                        Name on card
                      </label>
                      <input
                        id="diagnostic-card-name"
                        className="thread-input thread-input--default"
                        placeholder="Taylor Morgan"
                      />
                    </div>
                    <div>
                      <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-card-number">
                        Card number
                      </label>
                      <input
                        id="diagnostic-card-number"
                        className="thread-input thread-input--default"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-card-expiry">
                          Expiry
                        </label>
                        <input
                          id="diagnostic-card-expiry"
                          className="thread-input thread-input--default"
                          placeholder="12 / 30"
                        />
                      </div>
                      <div>
                        <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-card-cvc">
                          CVC
                        </label>
                        <input
                          id="diagnostic-card-cvc"
                          className="thread-input thread-input--default"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <label className={CHECKOUT_SAVE_CARD_CLASS}>
                      <input
                        type="checkbox"
                        checked={saveCardForCheckout}
                        onChange={() => setSaveCardForCheckout((current) => !current)}
                        className={MODAL_CHECKBOX_CLASS}
                      />
                      <span className="min-w-0">
                        <span className={MODAL_CONFIRM_TITLE_CLASS}>
                          Save my card for faster checkout next time
                        </span>
                        <span className={cn(MODAL_FINE_PRINT_CLASS, "mt-0.5 block")}>
                          Your card details are saved securely with Stripe.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <aside className={CHECKOUT_SUMMARY_PANEL_CLASS}>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--color-thread-heading)]">
                      Order summary for {childName}.
                    </h3>
                  </div>

                  <div className="space-y-2 border-y border-black/5 py-4 text-sm">
                    <div className={CHECKOUT_SUMMARY_ROW_CLASS}>
                      <span className="min-w-0">
                        <span className="inline-flex items-center gap-1.5">
                          <span>Assessment Package</span>
                          <span className="group relative inline-flex">
                            <button
                              type="button"
                              aria-label="What is included in the Assessment Package?"
                              className={CHECKOUT_ICON_BUTTON_CLASS}
                            >
                              <Info className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span
                              role="tooltip"
                              className={CHECKOUT_TOOLTIP_CLASS}
                            >
                              Includes your completed questionnaires, uploaded documents, and plain-language summary to support conversations with your child&apos;s clinician. It does not diagnose ADHD.
                            </span>
                          </span>
                        </span>
                        <span className={CHECKOUT_SUMMARY_META_CLASS}>One-time payment</span>
                      </span>
                      <span>{formatAssessmentPackagePrice(DIAGNOSTIC_ASSESSMENT_PRICE)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between gap-4 text-[var(--color-thread-mid-green)]">
                        <span>{appliedDiscount.label}</span>
                        <span>-{formatAssessmentPackagePrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className={CHECKOUT_TOTAL_ROW_CLASS}>
                      <span>Total</span>
                      <span>{formattedTotal}</span>
                    </div>
                    <p className="text-right text-xs text-slate-400">Includes GST</p>
                  </div>

                  <div>
                    <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-discount-code">
                      Discount code
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="diagnostic-discount-code"
                        value={discountCode}
                        onChange={(event) => {
                          setDiscountCode(event.target.value);
                          setDiscountError("");
                        }}
                        className="thread-input thread-input--default h-10 text-sm"
                        placeholder={DIAGNOSTIC_DISCOUNT_CODE_EXAMPLE}
                      />
                      <Button
                        type="button"
                        variant="tertiary"
                        onClick={handleApplyDiscount}
                        className="h-10 min-h-10 px-3 text-xs"
                        aria-label="Apply discount code"
                      >
                        <Tag className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {discountError && (
                      <p className="mt-2 text-xs font-medium text-red-500">{discountError}</p>
                    )}
                    {appliedDiscount && (
                      <p className="mt-2 text-xs font-semibold text-[var(--color-thread-mid-green)]">
                        {appliedDiscount.percentage}% discount applied.
                      </p>
                    )}
                  </div>
                </aside>
              </div>
            )}

            {step === "complete" && (
              <div className="space-y-6">
                <div className="rounded-none rounded-tr-[34px] bg-[var(--color-thread-light-green)] p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-thread-mid-green)] text-white">
                      <Check className="h-5 w-5 stroke-[3]" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-thread-heading)]">
                        {childName}&apos;s Thread is ready.
                      </h3>
                      <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-slate-700">
                        Payment was completed successfully. The next steps will ask for permission at the exact moment information is uploaded, requested, or shared.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--color-thread-heading)]">
                    Permissions you will see later
                  </h3>
                  <div className="mt-4 grid gap-3">
                    {DIAGNOSTIC_PERMISSION_NEXT_STEPS.map((item) => (
                      <div key={item.title} className="rounded-xl bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-950">{item.title}</h4>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 px-6 py-5 sm:px-8">
            {step !== "payment" && (
              <p className="text-xs leading-relaxed text-slate-500">
                Your information is only shared with your permission.
              </p>
            )}
            <div
              className={cn(
                "ml-auto flex w-full flex-col gap-3",
                step === "payment" ? "sm:w-full sm:items-stretch" : "sm:w-auto sm:flex-row sm:items-center",
              )}
            >
              {step !== "complete" && step !== "payment" && (
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              )}
              {step === "legal" && (
                <Button
                  type="button"
                  variant="primary"
                  disabled={!canCreateThread}
                  onClick={() => setStep("payment")}
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Create my Thread
                </Button>
              )}
              {step === "payment" && (
                <div className="grid w-full gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Button
                      type="button"
                      variant="tertiary"
                      onClick={onClose}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setStep("complete")}
                      className="h-11 w-full justify-center px-5 text-[0.92rem] font-semibold sm:w-auto sm:min-w-[260px]"
                      leftIcon={<LockKeyhole className="h-4 w-4" />}
                    >
                      Pay {formattedPaymentTotal}
                    </Button>
                  </div>
                  <p className={cn(MODAL_FINE_PRINT_CLASS, "mt-2 w-full max-w-none text-left")}>
                    By completing your purchase, you agree to our{" "}
                    <button
                      type="button"
                      className={MODAL_LINK_BUTTON_CLASS}
                    >
                      Terms of Use
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className={MODAL_LINK_BUTTON_CLASS}
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </div>
              )}
              {step === "complete" && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleContinue}
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

export default function AssessmentPage() {
  const { currentChild, updateChild } = useCurrentChild();
  const {
    isMvp,
    preparationChecklistView,
    showAssessmentProgressCircle,
    showDiagnosticAssessmentPlaceholder,
    showQuestionnaireInAssessment,
  } = useDisplayMode();
  const { files, addFile, removeFile } = useLocker();
  const { secondaryUsers, addSecondaryUser } = useSecondaryUsers();
  const navigate = useNavigate();
  const location = useLocation();
  const previousAssessmentChildKeyRef = React.useRef(currentChild.id ?? currentChild.name);
  const suppressAutoOpenForChildKeyRef = React.useRef<string | null>(null);
  const readClinicalModulesOpenRequest = () => {
    const searchParams = new URLSearchParams(location.search);
    const queryOpenRequest = searchParams.get("openClinicalModules") === "1"
      ? {
          childId: searchParams.get("childId") ?? undefined,
          childName: searchParams.get("childName") ?? undefined,
        }
      : null;
    const routeState = location.state as ClinicalModulesOpenRequest | null;
    let openRequest = queryOpenRequest ?? (routeState?.openClinicalModules
      ? { childId: routeState.childId, childName: routeState.childName }
      : null);

    if (!openRequest) {
      try {
        const storedRequest = sessionStorage.getItem(OPEN_CLINICAL_MODULES_REQUEST_KEY);
        openRequest = storedRequest ? JSON.parse(storedRequest) : null;
      } catch {
        openRequest = null;
      }
    }

    return openRequest;
  };
  const isClinicalModulesOpenRequestForCurrentChild = (openRequest: ClinicalModulesOpenRequest | null) =>
    Boolean(openRequest) &&
    (!openRequest?.childId || openRequest.childId === currentChild.id) &&
    (!openRequest?.childName || openRequest.childName === currentChild.name);
  const clearClinicalModulesOpenRequest = () => {
    try {
      sessionStorage.removeItem(OPEN_CLINICAL_MODULES_REQUEST_KEY);
    } catch {
      // Nothing to clear when storage is unavailable.
    }

    if (new URLSearchParams(location.search).get("openClinicalModules") === "1") {
      navigate(location.pathname, { replace: true, state: null });
    }
  };
  const readClinicianShareOpenRequest = () => {
    const searchParams = new URLSearchParams(location.search);
    const queryOpenRequest = searchParams.get("openClinicianShare") === "1"
      ? {
          childId: searchParams.get("childId") ?? undefined,
          childName: searchParams.get("childName") ?? undefined,
        }
      : null;
    const routeState = location.state as ClinicianShareOpenRequest | null;
    let openRequest = queryOpenRequest ?? (routeState?.openClinicianShare
      ? { childId: routeState.childId, childName: routeState.childName }
      : null);

    if (!openRequest) {
      try {
        const storedRequest = sessionStorage.getItem(OPEN_CLINICIAN_SHARE_REQUEST_KEY);
        openRequest = storedRequest ? JSON.parse(storedRequest) : null;
      } catch {
        openRequest = null;
      }
    }

    return openRequest;
  };
  const isClinicianShareOpenRequestForCurrentChild = (openRequest: ClinicianShareOpenRequest | null) =>
    Boolean(openRequest) &&
    (!openRequest?.childId || openRequest.childId === currentChild.id) &&
    (!openRequest?.childName || openRequest.childName === currentChild.name);
  const clearClinicianShareOpenRequest = () => {
    try {
      sessionStorage.removeItem(OPEN_CLINICIAN_SHARE_REQUEST_KEY);
    } catch {
      // Nothing to clear when storage is unavailable.
    }

    if (new URLSearchParams(location.search).get("openClinicianShare") === "1") {
      window.history.replaceState(null, "", location.pathname);
    }
  };
  const initialClinicalModuleTarget = React.useMemo(() => {
    const openRequest = readClinicalModulesOpenRequest();
    if (!isClinicalModulesOpenRequestForCurrentChild(openRequest)) return null;

    return getClinicalModuleModalTarget(currentChild.intake?.questionnaireAnswers ?? {});
  }, []);

  const [openSection, setOpenSection] = React.useState<string | null>("questionnaire");
  const [resultTab, setResultTab] = React.useState<"likely" | "unlikely" | "explore">("likely");
  const [showDiagnosticAssessmentModules, setShowDiagnosticAssessmentModules] = React.useState(false);

  const teachers = secondaryUsers.filter(u => u.role.toLowerCase() === "teacher");
  const primaryTeacher = teachers[0];

  const [teacherStatus, setTeacherStatus] = React.useState<TeacherChecklistStatus>(() => {
    const saved = localStorage.getItem(`teacher-status-${currentChild.id}`);
    return (saved as TeacherChecklistStatus) || 'todo';
  });

  const [teacherName, setTeacherName] = React.useState(() => {
    return localStorage.getItem(`teacher-name-${currentChild.id}`) || primaryTeacher?.name || "";
  });

  const [teacherEmail, setTeacherEmail] = React.useState(() => {
    return localStorage.getItem(`teacher-email-${currentChild.id}`) || primaryTeacher?.email || "";
  });

  const [teacherMessage, setTeacherMessage] = React.useState(() => {
    return localStorage.getItem(`teacher-message-${currentChild.id}`) || "";
  });

  const [teacherInviteError, setTeacherInviteError] = React.useState("");
  const [teacherContactPermission, setTeacherContactPermission] = React.useState(false);
  const [teacherAssessmentPermission, setTeacherAssessmentPermission] = React.useState(false);
  const [isTeacherInviteModalOpen, setIsTeacherInviteModalOpen] = React.useState(false);
  const [isConfirmingTeacherInvite, setIsConfirmingTeacherInvite] = React.useState(false);
  const [isMvpCheckoutModalOpen, setIsMvpCheckoutModalOpen] = React.useState(false);
  const [isClinicianShareModalOpen, setIsClinicianShareModalOpen] = React.useState(false);
  const [isChildPerspectiveModalOpen, setIsChildPerspectiveModalOpen] = React.useState(false);
  const [isChildPerspectiveSuccessVisible, setIsChildPerspectiveSuccessVisible] = React.useState(false);
  const [isClinicalInfoModalOpen, setIsClinicalInfoModalOpen] = React.useState(false);
  const [isDocumentUploadModalOpen, setIsDocumentUploadModalOpen] = React.useState(false);
  const [documentUploadStep, setDocumentUploadStep] = React.useState<DocumentUploadStep>(1);
  const [documentUploadFileName, setDocumentUploadFileName] = React.useState("");
  const [documentUploadTypeId, setDocumentUploadTypeId] = React.useState(DOCUMENT_TYPE_OPTIONS[0].typeId);
  const [documentUploadRightsConfirmed, setDocumentUploadRightsConfirmed] = React.useState(false);
  const [documentUploadThreadConfirmed, setDocumentUploadThreadConfirmed] = React.useState(false);
  const [documentPendingRemoval, setDocumentPendingRemoval] = React.useState<DocFile | null>(null);
  const [childPerspectiveModalQuestionIndex, setChildPerspectiveModalQuestionIndex] = React.useState(0);
  const [clinicalQuestionModalSection, setClinicalQuestionModalSection] = React.useState<string | null>(() => initialClinicalModuleTarget?.section ?? null);
  const [clinicalQuestionModalIndex, setClinicalQuestionModalIndex] = React.useState(() => initialClinicalModuleTarget?.index ?? 0);
  const [isClinicalModuleCoverVisible, setIsClinicalModuleCoverVisible] = React.useState(() => Boolean(initialClinicalModuleTarget));
  const [isClinicalModulesSuccessVisible, setIsClinicalModulesSuccessVisible] = React.useState(false);
  const [clinicianName, setClinicianName] = React.useState(() => {
    return localStorage.getItem(`clinician-name-${currentChild.id}`) ?? CLINICIAN_SHARE_DEFAULTS.name;
  });
  const [clinicianPractice, setClinicianPractice] = React.useState(() => {
    return localStorage.getItem(`clinician-practice-${currentChild.id}`) ?? CLINICIAN_SHARE_DEFAULTS.practice;
  });
  const [clinicianEmail, setClinicianEmail] = React.useState(() => {
    return localStorage.getItem(`clinician-email-${currentChild.id}`) ?? CLINICIAN_SHARE_DEFAULTS.email;
  });
  const [clinicianSharePermission, setClinicianSharePermission] = React.useState(false);
  const [clinicianShareError, setClinicianShareError] = React.useState("");
  const [isConfirmingClinicianShare, setIsConfirmingClinicianShare] = React.useState(false);
  const [preparationChecklistOpenOverrides, setPreparationChecklistOpenOverrides] = React.useState<Record<string, boolean>>({});

  const resetDocumentUploadModal = () => {
    setDocumentUploadStep(1);
    setDocumentUploadFileName("");
    setDocumentUploadTypeId(DOCUMENT_TYPE_OPTIONS[0].typeId);
    setDocumentUploadRightsConfirmed(false);
    setDocumentUploadThreadConfirmed(false);
  };

  const handleOpenDocumentUploadModal = () => {
    resetDocumentUploadModal();
    setIsDocumentUploadModalOpen(true);
  };

  const handleCloseDocumentUploadModal = () => {
    setIsDocumentUploadModalOpen(false);
    resetDocumentUploadModal();
  };

  const handleDocumentFileSelected = (fileName?: string) => {
    const cleanedFileName = fileName?.trim();
    if (!cleanedFileName) return;
    setDocumentUploadFileName(cleanedFileName);
  };

  const handleDocumentUploadStepSelect = (stepNumber: number) => {
    if (stepNumber === 1) {
      setDocumentUploadStep(1);
      return;
    }

    if (stepNumber === 2 && documentUploadFileName) {
      setDocumentUploadStep(2);
      return;
    }

    if (stepNumber === 3 && documentUploadFileName && documentUploadTypeId) {
      setDocumentUploadStep(3);
      return;
    }

    if (stepNumber === 4 && documentUploadFileName && documentUploadTypeId && documentUploadRightsConfirmed && documentUploadThreadConfirmed) {
      setDocumentUploadStep(4);
    }
  };

  const handleSaveDocumentToLocker = () => {
    if (!documentUploadFileName || !documentUploadTypeId || !documentUploadRightsConfirmed || !documentUploadThreadConfirmed) {
      return;
    }

    const documentType = DOCUMENT_TYPE_OPTIONS.find((option) => option.typeId === documentUploadTypeId) ?? DOCUMENT_TYPE_OPTIONS[0];
    const date = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());

    addFile({
      typeId: documentType.typeId,
      typeName: documentType.typeName,
      name: documentUploadFileName,
      date,
      uploadedBy: "you",
      shared: false,
      icon: FileText,
      childName: currentChild.name,
      childId: currentChild.id,
    });

    handleCloseDocumentUploadModal();
  };

  const handleRequestRemoveSharedDocument = (file: DocFile) => {
    setDocumentPendingRemoval(file);
  };

  const handleCancelRemoveSharedDocument = () => {
    setDocumentPendingRemoval(null);
  };

  const handleConfirmRemoveSharedDocument = () => {
    if (!documentPendingRemoval) {
      return;
    }

    removeFile(documentPendingRemoval);
    setDocumentPendingRemoval(null);
  };

  const handleOpenTeacherInviteModal = () => {
    setTeacherInviteError("");
    setIsConfirmingTeacherInvite(false);
    setIsTeacherInviteModalOpen(true);
  };

  const handleCloseTeacherInviteModal = () => {
    setTeacherInviteError("");
    setTeacherContactPermission(false);
    setTeacherAssessmentPermission(false);
    setIsConfirmingTeacherInvite(false);
    setIsTeacherInviteModalOpen(false);
  };

  const handleReviewTeacherInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      setTeacherInviteError("Teacher name is required");
      return;
    }
    if (!teacherEmail.trim() || !teacherEmail.includes("@")) {
      setTeacherInviteError("A valid email address is required");
      return;
    }
    if (!teacherContactPermission || !teacherAssessmentPermission) {
      setTeacherInviteError("Please confirm permission before sending the teacher invitation");
      return;
    }
    setTeacherInviteError("");
    setIsConfirmingTeacherInvite(true);
  };

  const handleBackToTeacherInviteDetails = () => {
    setTeacherInviteError("");
    setIsConfirmingTeacherInvite(false);
  };

  const handleConfirmTeacherInvite = () => {
    setTeacherStatus('sent');
    localStorage.setItem(`teacher-status-${currentChild.id}`, 'sent');
    localStorage.setItem(`teacher-name-${currentChild.id}`, teacherName);
    localStorage.setItem(`teacher-email-${currentChild.id}`, teacherEmail);
    if (teacherMessage.trim()) {
      localStorage.setItem(`teacher-message-${currentChild.id}`, teacherMessage.trim());
    } else {
      localStorage.removeItem(`teacher-message-${currentChild.id}`);
    }
    setTeacherMessage(teacherMessage.trim());
    setTeacherContactPermission(false);
    setTeacherAssessmentPermission(false);
    setIsConfirmingTeacherInvite(false);
    setIsTeacherInviteModalOpen(false);

    const alreadyExists = secondaryUsers.some(u => u.email.toLowerCase() === teacherEmail.toLowerCase());
    if (!alreadyExists) {
      addSecondaryUser({
        name: teacherName,
        role: "Teacher",
        email: teacherEmail,
        access: "partial"
      });
    }
  };

  const handleSimulateTeacherResponse = () => {
    setTeacherStatus('completed');
    localStorage.setItem(`teacher-status-${currentChild.id}`, 'completed');
  };

  const handleResetTeacherStatus = () => {
    setTeacherStatus('todo');
    localStorage.removeItem(`teacher-status-${currentChild.id}`);
    localStorage.removeItem(`teacher-message-${currentChild.id}`);
    setTeacherMessage("");
    setTeacherInviteError("");
    setTeacherContactPermission(false);
    setTeacherAssessmentPermission(false);
  };

  const handleOpenClinicianShareModal = () => {
    setClinicianShareError("");
    setIsConfirmingClinicianShare(false);
    setIsClinicianShareModalOpen(true);
  };

  const handleCloseClinicianShareModal = () => {
    setClinicianShareError("");
    setClinicianSharePermission(false);
    setIsConfirmingClinicianShare(false);
    setIsClinicianShareModalOpen(false);
  };

  const handleDownloadClinicalReport = () => {
    window.open(clinicalReportImg, '_blank');
  };

  const handleCareOptionsAnchorClick = () => {
    const careOptionsSection = document.getElementById("care-options-section");

    if (!careOptionsSection) return;

    careOptionsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `${location.pathname}${location.search}#care-options-section`);
  };

  const handleClinicalOutcomeActionClick = () => {
    if (currentProfileKey === "Noah") {
      return;
    }

    if (currentProfileKey === "Tom") {
      handleCareOptionsAnchorClick();
      return;
    }

    if (isMvp && canOpenClinicianShareModal) {
      handleOpenClinicianShareModal();
      return;
    }

    handleDownloadClinicalReport();
  };

  const handleReviewShareAssessmentPackage = (event: React.FormEvent) => {
    event.preventDefault();

    if (!clinicianName.trim()) {
      setClinicianShareError("Clinician name is required");
      return;
    }

    if (!clinicianPractice.trim()) {
      setClinicianShareError("Medical centre is required");
      return;
    }

    if (!clinicianEmail.trim() || !clinicianEmail.includes("@")) {
      setClinicianShareError("A valid email address is required");
      return;
    }

    if (!clinicianSharePermission) {
      setClinicianShareError("Please confirm permission before sharing the Assessment Package");
      return;
    }

    setClinicianShareError("");
    setIsConfirmingClinicianShare(true);
  };

  const handleBackToClinicianShareDetails = () => {
    setClinicianShareError("");
    setIsConfirmingClinicianShare(false);
  };

  const handleConfirmShareAssessmentPackage = () => {
    localStorage.setItem(`clinician-name-${currentChild.id}`, clinicianName.trim());
    localStorage.setItem(`clinician-practice-${currentChild.id}`, clinicianPractice.trim());
    localStorage.setItem(`clinician-email-${currentChild.id}`, clinicianEmail.trim());
    localStorage.setItem(`clinician-share-status-${currentChild.id}`, "shared");
    setClinicianName(clinicianName.trim());
    setClinicianPractice(clinicianPractice.trim());
    setClinicianEmail(clinicianEmail.trim());
    setClinicianSharePermission(false);
    setIsConfirmingClinicianShare(false);
    setIsClinicianShareModalOpen(false);
  };

  const isDiagnostic = isDiagnosticPathway(currentChild);
  const isMvpNewChildAssessmentCard = isMvp && usesMvpNewChildSetup(currentChild);
  const showAssessmentPathwayCard = (usesAssessmentCard(currentChild) || isMvpNewChildAssessmentCard) && !usesAssessmentProgressCard(currentChild);
  const isDiagnosticActive = isDiagnostic;
  const isNavigatorActive = !isDiagnostic;
  const currentProfileKey = getChildProfileKey(currentChild);
  React.useEffect(() => {
    setShowDiagnosticAssessmentModules(false);
    setIsClinicalModulesSuccessVisible(false);
    setIsChildPerspectiveSuccessVisible(false);
  }, [currentProfileKey, showDiagnosticAssessmentPlaceholder]);
  const showDiagnosticAssessmentPlaceholderCard =
    showDiagnosticAssessmentPlaceholder && !showDiagnosticAssessmentModules && (currentProfileKey === "Noah" || currentProfileKey === "Chloe");
  const showHeroClinicalPrepPanels = showQuestionnaireInAssessment && !showDiagnosticAssessmentPlaceholderCard && currentProfileKey !== "Tom";
  const assessmentProgressCardData = usesAssessmentProgressCard(currentChild)
    ? getAssessmentProgressCardData(currentChild)
    : undefined;
  const hasReturnedResults = hasReturnedAssessmentResults(currentChild);
  const diagnosticStarterSubtitle = currentProfileKey === "Tom"
    ? "Get started"
    : currentProfileKey === "Leo"
      ? "Depending"
      : currentProfileKey === "Isla"
        ? "In progress"
      : "Download sample";
  const assessmentHeaderDescriptionOverrides: Partial<Record<string, string>> = {
    Leo: "Leo’s Diagnostic Assessment is set up. Start the first module to begin preparing his Assessment Package.",
    Isla: "Isla’s modules are in progress. Keep going to move her Assessment Package toward Assessment Ready.",
  };
  const assessmentHeroQuoteOverrides: Partial<Record<string, string>> = {
    Leo: "Leo’s Diagnostic Assessment is set up. Start the first module to begin preparing his Assessment Package.",
    Isla: "Isla’s modules are in progress. Keep going to move her Assessment Package toward Assessment Ready.",
  };
  const hasCompletedAssessmentReport = isMvp && usesCompletedAssessmentReport(currentChild);
  const hideResultSection = isMvpNewChildAssessmentCard;
  
  const sessionStatus = getChildSessionStatus(currentChild);
  const isBooked = sessionStatus === "booked";
  const isCancelled = sessionStatus === "cancelled";

  const sessionDate = getSessionDate(currentChild, "long");
  const sessionTime = currentChild.intake?.sessionTime || DEFAULT_SESSION_TIME;

  const completedSections = currentChild.intake?.completedQuestionnaireSections || [];
  const questionnaireTotalSections = isMvp ? MVP_QUESTIONNAIRE_MODULES.length : 8;
  const completedClinicalSections = isMvp
    ? completedSections.filter((section) => MVP_QUESTIONNAIRE_MODULES.includes(section))
    : completedSections;
  const completedSectionCount = Math.min(completedClinicalSections.length, questionnaireTotalSections);
  const answeredMvpQuestions = Object.values(MVP_CLINICAL_MODULE_QUESTIONS)
    .flat()
    .filter((question) => isAnswered(currentChild.intake?.questionnaireAnswers?.[question.id])).length;
  const answeredMvpQuestionCount = Math.min(answeredMvpQuestions, MVP_QUESTIONNAIRE_QUESTION_COUNT);
  const childPerspectiveQuestions = MVP_WORKFLOW_QUESTIONS[CHILD_PERSPECTIVE_MODULE_TITLE] ?? [];
  const childPerspectiveQuestionCount = childPerspectiveQuestions.length;
  const questionnaireAnswers = currentChild.intake?.questionnaireAnswers ?? {};
  const answeredChildPerspectiveQuestionCount = childPerspectiveQuestions.filter((question) =>
    isAnswered(questionnaireAnswers[question.id])
  ).length;
  const childPerspectiveSidebarSteps = childPerspectiveQuestionCount > 0
    ? childPerspectiveQuestions.map((question, index) => ({
      num: index + 1,
      title: getChildPerspectiveStepTitle(question.text, index),
      desc: isAnswered(questionnaireAnswers[question.id]) ? "Answered" : "To do",
    }))
    : [{ num: 1, title: "Question", desc: "No questions available" }];
  const completedChildPerspectiveStepNumbers = childPerspectiveQuestions
    .map((question, index) => isAnswered(questionnaireAnswers[question.id]) ? index + 1 : null)
    .filter((stepNumber): stepNumber is number => stepNumber !== null);
  const childPerspectiveModalQuestion = childPerspectiveQuestions[childPerspectiveModalQuestionIndex] ?? childPerspectiveQuestions[0];
  const childPerspectiveModalAnswer = childPerspectiveModalQuestion
    ? String(questionnaireAnswers[childPerspectiveModalQuestion.id] ?? "")
    : "";
  const isFirstChildPerspectiveQuestion = childPerspectiveModalQuestionIndex === 0;
  const isLastChildPerspectiveQuestion = childPerspectiveModalQuestionIndex >= childPerspectiveQuestionCount - 1;
  const isChildPerspectiveSectionComplete = completedSections.includes(CHILD_PERSPECTIVE_MODULE_TITLE);
  const childPerspectiveProgress = hasCompletedAssessmentReport || isChildPerspectiveSectionComplete
    ? 100
    : childPerspectiveQuestionCount > 0
      ? Math.min(100, Math.round((answeredChildPerspectiveQuestionCount / childPerspectiveQuestionCount) * 100))
      : 0;
  const isChildPerspectiveComplete = childPerspectiveProgress === 100;
  const childPerspectiveMeta = isChildPerspectiveComplete
    ? "Child voice section complete"
    : childPerspectiveQuestionCount > 0
      ? `${answeredChildPerspectiveQuestionCount} of ${childPerspectiveQuestionCount} prompts answered`
      : "Invite your child to share their own view";
  const questionnaireProgress = hasCompletedAssessmentReport
    ? 100
    : isMvp && answeredMvpQuestions > 0
    ? Math.min(100, Math.round((answeredMvpQuestionCount / MVP_QUESTIONNAIRE_QUESTION_COUNT) * 100))
    : Math.min(100, Math.round((completedSectionCount / questionnaireTotalSections) * 100));
  const questionnaireCompletionMeta = questionnaireProgress === 100
    ? `All ${questionnaireTotalSections} developmental sections complete`
    : `${completedSectionCount} of ${questionnaireTotalSections} sections complete`;
  const clinicalModuleActionLabel = questionnaireProgress === 100
    ? "Review module"
    : questionnaireProgress > 0
      ? "Continue module"
      : "Start module";
  const clinicalModuleSections = MVP_QUESTIONNAIRE_MODULES;
  const activeClinicalModuleQuestions = clinicalQuestionModalSection
    ? MVP_CLINICAL_MODULE_QUESTIONS[clinicalQuestionModalSection] ?? []
    : [];
  const activeClinicalQuestion = activeClinicalModuleQuestions[clinicalQuestionModalIndex];
  const activeClinicalModuleIndex = Math.max(0, clinicalModuleSections.indexOf(clinicalQuestionModalSection ?? clinicalModuleSections[0]));
  const activeClinicalModuleStepNumber = activeClinicalModuleIndex + 1;
  const activeClinicalModuleTitle = clinicalQuestionModalSection?.replace(/^\d+\.\s*/, "") ?? "Clinical module";
  const activeClinicalModuleMeta = clinicalQuestionModalSection
    ? CLINICAL_MODULE_META[clinicalQuestionModalSection] ?? DEFAULT_CLINICAL_MODULE_META
    : DEFAULT_CLINICAL_MODULE_META;
  const clinicalQuestionOrdinal = clinicalModuleSections
    .slice(0, activeClinicalModuleIndex)
    .reduce((total, section) => total + (MVP_CLINICAL_MODULE_QUESTIONS[section]?.length ?? 0), 0) + clinicalQuestionModalIndex + 1;
  const isFirstClinicalQuestion = activeClinicalModuleIndex === 0 && clinicalQuestionModalIndex === 0;
  const isLastClinicalQuestion =
    activeClinicalModuleIndex === clinicalModuleSections.length - 1 &&
    clinicalQuestionModalIndex >= activeClinicalModuleQuestions.length - 1;
  const getClinicalModuleProgress = (section: string) => {
    const questions = MVP_CLINICAL_MODULE_QUESTIONS[section] ?? [];
    const answeredCount = questions.filter((question) => isAnswered(questionnaireAnswers[question.id])).length;
    const percent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

    return {
      answeredCount,
      percent,
      status: answeredCount === 0 ? "To do" : answeredCount === questions.length ? "Completed" : "In progress",
      totalCount: questions.length,
    };
  };
  const activeClinicalModuleProgress = clinicalQuestionModalSection
    ? getClinicalModuleProgress(clinicalQuestionModalSection)
    : { answeredCount: 0, percent: 0, status: "To do", totalCount: 0 };
  const isActiveClinicalModuleComplete =
    activeClinicalModuleProgress.totalCount > 0 &&
    activeClinicalModuleProgress.answeredCount === activeClinicalModuleProgress.totalCount;
  const clinicalModuleSidebarSteps = clinicalModuleSections.map((section, index) => {
    const moduleProgress = getClinicalModuleProgress(section);
    return {
      num: index + 1,
      title: section.replace(/^\d+\.\s*/, ""),
      desc: `${moduleProgress.answeredCount}/${moduleProgress.totalCount} questions`,
    };
  });
  const completedClinicalModuleStepNumbers = clinicalModuleSections
    .map((section, index) => {
      const moduleProgress = getClinicalModuleProgress(section);
      return moduleProgress.totalCount > 0 && moduleProgress.answeredCount === moduleProgress.totalCount
        ? index + 1
        : null;
    })
    .filter((stepNumber): stepNumber is number => stepNumber !== null);
  const areClinicalModulesComplete =
    clinicalModuleSections.length > 0 &&
    completedClinicalModuleStepNumbers.length === clinicalModuleSections.length;
  const childFiles = files.filter(f => f.childId === currentChild.id || f.childName === currentChild.name);
  const documentCount = childFiles.length;
  const selectedDocumentUploadType = DOCUMENT_TYPE_OPTIONS.find((option) => option.typeId === documentUploadTypeId) ?? DOCUMENT_TYPE_OPTIONS[0];
  const completedDocumentUploadSteps = [
    documentUploadFileName ? 1 : null,
    documentUploadTypeId ? 2 : null,
    documentUploadRightsConfirmed && documentUploadThreadConfirmed ? 3 : null,
    documentUploadStep === 4 ? 4 : null,
  ].filter((stepNumber): stepNumber is number => stepNumber !== null);
  const canAdvanceDocumentUploadStep =
    documentUploadStep === 1
      ? Boolean(documentUploadFileName)
      : documentUploadStep === 2
        ? Boolean(documentUploadTypeId)
        : documentUploadStep === 3
          ? documentUploadRightsConfirmed && documentUploadThreadConfirmed
          : Boolean(documentUploadFileName && documentUploadTypeId && documentUploadRightsConfirmed && documentUploadThreadConfirmed);
  const isSeededTeacherComplete = isMvp && (hasCompletedAssessmentReport || currentProfileKey === "Chloe");
  const teacherChecklistState = getTeacherChecklistState({
    teacherStatus,
    teacherName,
    teacherEmail,
    isSeededComplete: isSeededTeacherComplete,
  });
  const isAssessmentComplete = hasCompletedAssessmentReport;
  const isQuestionnaireSubmitted = hasCompletedAssessmentReport || hasSubmittedAssessmentQuestionnaire(currentChild);
  const isReadyForClinicalReview = isQuestionnaireSubmitted && questionnaireProgress === 100 && teacherChecklistState.done && documentCount > 0;
  const isWaitingClinicalReview = isQuestionnaireSubmitted && isReadyForClinicalReview;
  const isFollowUpComplete = isAssessmentComplete || isWaitingClinicalReview;
  const isNoahSharedPackage = currentProfileKey === "Noah" && isAssessmentComplete && !hasReturnedResults;
  const diagnosticAssessmentResourceGuides = React.useMemo(
    () => getResourceGuides(currentChild).slice(0, 3),
    [currentChild],
  );
  const sharedDocumentCount = documentCount === 0 && isAssessmentComplete ? 3 : documentCount;
  const renderSharedDocumentItem = (file: DocFile, index: number) => {
    const FileIcon = file.icon;

    return (
      <div
        key={`${file.childId ?? file.childName ?? currentChild.id}-${file.name}-${file.date}-${index}`}
        className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-700 font-sans"
      >
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-thread-light-green)] text-[var(--color-thread-ready-green)]">
          <FileIcon className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-[var(--color-thread-dark-slate)]">{file.name}</span>
          <span className="mt-0.5 block text-[10px] text-slate-400">{file.date}</span>
        </span>
        <button
          type="button"
          aria-label={`Remove ${file.name}`}
          onClick={() => handleRequestRemoveSharedDocument(file)}
          className="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/30"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };
  const isPackagePreparationChecklistView = preparationChecklistView === "package";
  const assessmentOverallProgress = hasCompletedAssessmentReport
    ? 100
    : assessmentProgressCardData?.progress ?? (isReadyForClinicalReview ? 100 : questionnaireProgress);
  const canOpenClinicianShareModal = !hasReturnedResults && (
    isWaitingClinicalReview ||
    (currentProfileKey === "Chloe" && assessmentOverallProgress === 100)
  );
  const progressCircleActionLabel = hasReturnedResults
    ? "Download"
    : isNoahSharedPackage
      ? "Shared"
    : canOpenClinicianShareModal
      ? "Share"
      : assessmentOverallProgress > 0
        ? "Continue"
        : "Start";
  const showOverallActionButton = (
    currentProfileKey === "Chloe" ||
    currentProfileKey === "Noah" ||
    currentProfileKey === "Ruby"
  ) && assessmentOverallProgress === 100;

  const handleAssessmentProgressCircleAction = () => {
    if (hasReturnedResults) {
      handleDownloadClinicalReport();
      return;
    }

    if (isNoahSharedPackage) {
      return;
    }

    if (canOpenClinicianShareModal) {
      handleOpenClinicianShareModal();
      return;
    }

    handleClinicalOutcomeActionClick();
  };

  const getUpdatedMvpCompletedSections = (updatedAnswers: Record<string, unknown>) => {
    const updatedCompletedSections = new Set(completedSections);

    Object.entries(MVP_WORKFLOW_QUESTIONS).forEach(([sectionName, questions]) => {
      const allAnswered = questions.length > 0 && questions.every((question) =>
        isAnswered(updatedAnswers[question.id])
      );

      if (allAnswered) {
        updatedCompletedSections.add(sectionName);
      } else {
        updatedCompletedSections.delete(sectionName);
      }
    });

    return Array.from(updatedCompletedSections);
  };

  const handleOpenClinicalModulesModal = (section?: string) => {
    const target = getClinicalModuleModalTarget(questionnaireAnswers, section);
    if (!target) return;

    setIsClinicalModulesSuccessVisible(false);
    setClinicalQuestionModalSection(target.section);
    setClinicalQuestionModalIndex(target.index);
    setIsClinicalModuleCoverVisible(true);
  };

  const handleSelectClinicalModule = (section: string) => {
    const target = getClinicalModuleModalTarget(questionnaireAnswers, section);
    if (!target) return;

    setIsClinicalModulesSuccessVisible(false);
    setClinicalQuestionModalSection(target.section);
    setClinicalQuestionModalIndex(target.index);
    setIsClinicalModuleCoverVisible(true);
  };

  const handleStartClinicalModule = () => {
    setIsClinicalModuleCoverVisible(false);
  };

  const handleSubmitQuestionnaire = () => {
    if (questionnaireProgress < 100) {
      return;
    }

    updateChild({
      ...currentChild,
      intake: {
        ...currentChild.intake,
        questionnaireAnswers,
        completedQuestionnaireSections: getUpdatedMvpCompletedSections(questionnaireAnswers),
        questionnaireSubmitted: true,
        questionnaireSubmittedAt: new Date().toISOString(),
      },
    });

    if (teacherChecklistState.done && documentCount > 0) {
      setClinicianShareError("");
      setClinicianSharePermission(false);
      setIsConfirmingClinicianShare(false);
      setIsClinicianShareModalOpen(true);
    }
  };

  const handleClinicalModulesAction = () => {
    if (showQuestionnaireInAssessment && isMvp) {
      if (questionnaireProgress === 100) {
        handleSubmitQuestionnaire();
        return;
      }

      handleOpenClinicalModulesModal();
      return;
    }

    navigate("/questionnaire");
  };

  React.useEffect(() => {
    const childKey = currentChild.id ?? currentChild.name;
    if (previousAssessmentChildKeyRef.current === childKey) {
      return;
    }

    previousAssessmentChildKeyRef.current = childKey;
    suppressAutoOpenForChildKeyRef.current = childKey;
    setIsTeacherInviteModalOpen(false);
    setIsMvpCheckoutModalOpen(false);
    setIsClinicianShareModalOpen(false);
    setIsChildPerspectiveModalOpen(false);
    setIsChildPerspectiveSuccessVisible(false);
    setIsClinicalInfoModalOpen(false);
    setIsDocumentUploadModalOpen(false);
    setDocumentPendingRemoval(null);
    setClinicalQuestionModalSection(null);
    setClinicalQuestionModalIndex(0);
    setIsClinicalModuleCoverVisible(false);
    setIsClinicalModulesSuccessVisible(false);
    setIsConfirmingClinicianShare(false);
    setClinicianShareError("");
    setClinicianSharePermission(false);
    resetDocumentUploadModal();
    clearClinicalModulesOpenRequest();
    clearClinicianShareOpenRequest();

    const releaseAutoOpenSuppression = window.setTimeout(() => {
      if (suppressAutoOpenForChildKeyRef.current === childKey) {
        suppressAutoOpenForChildKeyRef.current = null;
      }
    }, 0);

    return () => window.clearTimeout(releaseAutoOpenSuppression);
  }, [currentChild.id, currentChild.name]);

  React.useEffect(() => {
    const openRequest = readClinicalModulesOpenRequest();
    if (suppressAutoOpenForChildKeyRef.current === (currentChild.id ?? currentChild.name)) return;
    if (!isClinicalModulesOpenRequestForCurrentChild(openRequest)) return;

    const openRequestTimer = window.setTimeout(() => {
      handleOpenClinicalModulesModal();
    }, 100);

    return () => window.clearTimeout(openRequestTimer);
  }, [location.search, location.state, currentProfileKey, currentChild.id, currentChild.name]);

  React.useEffect(() => {
    const openRequest = readClinicianShareOpenRequest();
    if (suppressAutoOpenForChildKeyRef.current === (currentChild.id ?? currentChild.name)) return;
    if (!isClinicianShareOpenRequestForCurrentChild(openRequest) || !canOpenClinicianShareModal) return;

    const openRequestTimer = window.setTimeout(() => {
      handleOpenClinicianShareModal();
      clearClinicianShareOpenRequest();
    }, 100);

    return () => window.clearTimeout(openRequestTimer);
  }, [location.search, location.state, currentProfileKey, currentChild.id, currentChild.name, canOpenClinicianShareModal]);

  React.useEffect(() => {
    if (!clinicalQuestionModalSection) return;
    const cleanupRequestTimer = window.setTimeout(() => {
      try {
        sessionStorage.removeItem(OPEN_CLINICAL_MODULES_REQUEST_KEY);
      } catch {
        // Nothing to clear when storage is unavailable.
      }

    }, 60000);

    return () => window.clearTimeout(cleanupRequestTimer);
  }, [clinicalQuestionModalSection]);

  const handleClinicalQuestionAnswerChange = (questionId: string, value: string) => {
    const updatedAnswers = {
      ...questionnaireAnswers,
      [questionId]: value,
    };

    updateChild({
      ...currentChild,
      intake: {
        ...currentChild.intake,
        questionnaireAnswers: updatedAnswers,
        completedQuestionnaireSections: getUpdatedMvpCompletedSections(updatedAnswers),
      },
    });
  };

  const handleMarkClinicalQuestionNotSure = (questionId: string, options?: string[]) => {
    handleClinicalQuestionAnswerChange(questionId, getNotSureAnswerValue(options));
  };

  const handlePreviousClinicalQuestion = () => {
    if (!clinicalQuestionModalSection) return;
    if (isClinicalModuleCoverVisible) return;

    if (clinicalQuestionModalIndex > 0) {
      setClinicalQuestionModalIndex((index) => index - 1);
      return;
    }

    const previousSection = clinicalModuleSections[activeClinicalModuleIndex - 1];
    if (!previousSection) return;

    const previousQuestions = MVP_CLINICAL_MODULE_QUESTIONS[previousSection] ?? [];
    setClinicalQuestionModalSection(previousSection);
    setClinicalQuestionModalIndex(Math.max(0, previousQuestions.length - 1));
    setIsClinicalModuleCoverVisible(true);
  };

  const handleNextClinicalQuestion = () => {
    if (!clinicalQuestionModalSection) return;
    if (isClinicalModuleCoverVisible) {
      setIsClinicalModuleCoverVisible(false);
      return;
    }

    if (clinicalQuestionModalIndex < activeClinicalModuleQuestions.length - 1) {
      setClinicalQuestionModalIndex((index) => index + 1);
      return;
    }

    const nextSection = clinicalModuleSections[activeClinicalModuleIndex + 1];
    if (!nextSection) {
      if (areClinicalModulesComplete) {
        setIsClinicalModulesSuccessVisible(true);
      }
      setClinicalQuestionModalSection(null);
      setClinicalQuestionModalIndex(0);
      setIsClinicalModuleCoverVisible(false);
      return;
    }

    setClinicalQuestionModalSection(nextSection);
    setClinicalQuestionModalIndex(0);
    setIsClinicalModuleCoverVisible(true);
  };

  const handleOpenChildPerspectiveModal = () => {
    const firstUnansweredIndex = childPerspectiveQuestions.findIndex((question) =>
      !isAnswered(questionnaireAnswers[question.id])
    );
    setIsChildPerspectiveSuccessVisible(false);
    setChildPerspectiveModalQuestionIndex(firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0);
    setIsChildPerspectiveModalOpen(true);
  };

  const handleChildPerspectiveAnswerChange = (value: string) => {
    if (!childPerspectiveModalQuestion) return;

    const updatedAnswers = {
      ...questionnaireAnswers,
      [childPerspectiveModalQuestion.id]: value,
    };

    updateChild({
      ...currentChild,
      intake: {
        ...currentChild.intake,
        questionnaireAnswers: updatedAnswers,
        completedQuestionnaireSections: getUpdatedMvpCompletedSections(updatedAnswers),
      },
    });
  };

  const handlePreviousChildPerspectiveQuestion = () => {
    setChildPerspectiveModalQuestionIndex((index) => Math.max(0, index - 1));
  };

  const handleNextChildPerspectiveQuestion = () => {
    if (isLastChildPerspectiveQuestion) {
      if (isChildPerspectiveComplete) {
        setIsChildPerspectiveSuccessVisible(true);
      }
      setIsChildPerspectiveModalOpen(false);
      return;
    }

    setChildPerspectiveModalQuestionIndex((index) => Math.min(childPerspectiveQuestionCount - 1, index + 1));
  };

  const handleBookClick = () => {
    navigate('/setup?step=5&directSession=1');
  };

  const handleDiagnosticGetStartedClick = () => {
    if (isMvp) {
      setIsMvpCheckoutModalOpen(true);
      return;
    }

    handleBookClick();
  };

  const steps = [
    {
      num: "01",
      title: "Clinical Registration",
      desc: "Profile registered on the Diagnostic assessment pathway, securing clinical slots.",
      status: "completed",
    },
    {
      num: "02",
      title: "Developmental Questionnaire",
      desc: "Parent-completed diagnostic questionnaires covering learning, attention, sleep, and emotional health.",
      status: questionnaireProgress === 100 ? "completed" : "active",
    },
    {
      num: "03",
      title: "In-Depth Telehealth Assessment",
      desc: "A 60-minute developmental review with our specialized child clinician to discuss findings and observations.",
      status: isBooked ? "completed" : "pending",
    },
    {
      num: "04",
      title: "Clinical Formulation & Plan",
      desc: "Establish clinical benchmarks, customized co-regulation structures, and classroom accommodations.",
      status: "locked",
    },
  ];

  if (usesCompletedAssessmentReport(currentChild) && !isMvp) {
    const completedReport = buildCompletedAssessmentReport(currentChild.name, {
      returnedResults: hasReturnedResults,
    });

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className="pt-16 pb-24"
      >
        <PageContainer>
          <div className="space-y-16">
            <PageHeader
              kicker="Diagnostic assessment"
              title={completedReport.title}
              description={
                <SectionDescription>
                  {completedReport.intro}
                </SectionDescription>
              }
            />

            <HeroQuoteCard
              kicker="Diagnostic Outcome"
              quote={completedReport.quote}
              showQuotes={false}
              showDecoration={false}
              className="bg-white"
              evidenceLevel={3}
              evidenceText="Report Completed"
              evidenceVariant="green"
              rightNode={
                <HeroActionCard
                  icon={<FileText className="w-[22px] h-[22px] stroke-[1.7] text-[var(--color-thread-mid-green)]" />}
                  title="Download Report"
                  subtitle="PDF · 4.2 MB"
                  className="bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px] hover:bg-[var(--color-thread-light-green)]/90 cursor-pointer"
                  onClick={handleDownloadClinicalReport}
                />
              }
            />



            {/* AREAS OF FOCUS */}
            <div className="space-y-4 pt-10 border-t border-black/5">
              <div>
                <SectionLabel>Areas of focus</SectionLabel>
                <SectionTitle>Assessed clinical domains</SectionTitle>
                <SectionDescription>
                  {DEFAULT_CLINICIAN_NAME}'s clinical findings across key developmental domains. Click each domain to view observations and supportive next steps.
                </SectionDescription>
              </div>

              <div className="border-y border-black/10 mt-8">
                {completedReport.domains.map((domain) => (
                  <AreaItem
                    key={domain.title}
                    title={domain.title}
                    impact={domain.impact}
                    status={domain.status}
                    isCollapsible={true}
                    description={
                      <CompletedReportDomainDetails
                        summary={domain.summary}
                        evidence={domain.evidence}
                      />
                    }
                    sources={domain.sources}
                  />
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </motion.div>
    );
  }

  const clinicalConfidentialInformationModal = (
    <ModalShell
      isOpen={isClinicalInfoModalOpen}
      titleId="assessment-clinical-info-modal-title"
      size="small"
      panelClassName="p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <div className="space-y-2">
            <h2 id="assessment-clinical-info-modal-title" className="font-serif text-2xl font-normal leading-tight text-[var(--color-thread-heading)]">
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
  );
  const documentUploadModal = (
    <QuestionnaireModuleModalFrame
      isOpen={isDocumentUploadModalOpen}
      titleId="document-upload-modal-title"
      activeStep={documentUploadStep}
      completedSteps={completedDocumentUploadSteps}
      heading="Document upload"
      steps={DOCUMENT_UPLOAD_STEPS}
      closeLabel="Close document upload"
      onClose={handleCloseDocumentUploadModal}
      onStepSelect={(step) => handleDocumentUploadStepSelect(step.num)}
      mobileBehavior="stacked"
      footer={(
        <>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => setDocumentUploadStep((step) => (step > 1 ? ((step - 1) as DocumentUploadStep) : step))}
            disabled={documentUploadStep === 1}
            className={cn(MODAL_SECONDARY_BUTTON_CLASS, "disabled:cursor-not-allowed disabled:opacity-40")}
          >
            Back
          </Button>
          {documentUploadStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setDocumentUploadStep((step) => ((step + 1) as DocumentUploadStep))}
              disabled={!canAdvanceDocumentUploadStep}
              className="h-9 rounded-full px-4 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              {documentUploadStep === 3 ? "Review upload" : "Continue"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveDocumentToLocker}
              disabled={!canAdvanceDocumentUploadStep}
              className="h-9 rounded-full px-4 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              rightIcon={<LockKeyhole className="h-3.5 w-3.5" />}
            >
              Add to Locker
            </Button>
          )}
        </>
      )}
    >
            {documentUploadStep === 1 && (
              <div className="max-w-2xl space-y-7">
                <div className="space-y-3">
                  <span className={MODAL_KICKER_CLASS}>Step 1</span>
                  <h2 id="document-upload-modal-title" className={MODAL_TITLE_CLASS}>
                    Upload file
                  </h2>
                  <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
                    Add a supporting report, school letter, occupational therapy note, or other file for {currentChild.name}&apos;s Assessment Package.
                  </p>
                </div>

                <label
                  htmlFor="assessment-document-upload-input"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleDocumentFileSelected(event.dataTransfer.files[0]?.name);
                  }}
                  className="block cursor-pointer rounded-none rounded-tr-[32px] border-2 border-dashed border-black/10 bg-[var(--color-thread-light-green)]/30 p-10 text-center transition-all hover:border-[var(--color-thread-mid-green)] hover:bg-[var(--color-thread-light-green)]/50 focus-within:ring-2 focus-within:ring-[var(--color-thread-mid-green)]/25"
                >
                  <input
                    id="assessment-document-upload-input"
                    type="file"
                    className="sr-only"
                    onChange={(event) => handleDocumentFileSelected(event.target.files?.[0]?.name)}
                  />
                  <PageIcon variant="white" icon={<Upload className="h-[22px] w-[22px] stroke-[1.7]" />} className="mx-auto" />
                  <span className="mt-4 block text-[1rem] font-medium tracking-tight text-slate-900">
                    {documentUploadFileName || "Drop a file here, or click to select"}
                  </span>
                  <span className="mt-2 block text-[0.82rem] text-slate-500">
                    PDF, DOC, DOCX, XLS or PNG. Max size 25MB.
                  </span>
                </label>
              </div>
            )}

            {documentUploadStep === 2 && (
              <div className="max-w-2xl space-y-7">
                <div className="space-y-3">
                  <span className={MODAL_KICKER_CLASS}>Step 2</span>
                  <h2 id="document-upload-modal-title" className={MODAL_TITLE_CLASS}>
                    Associate file to document type
                  </h2>
                  <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
                    Choose how this document should appear in {currentChild.name}&apos;s secure Locker and assessment checklist.
                  </p>
                </div>

                <div className="rounded-none rounded-tr-[28px] bg-[var(--color-thread-off-white)] p-5">
                  <span className={MODAL_FIELD_LABEL_CLASS}>Selected file</span>
                  <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
                    <FileText className="h-4 w-4 shrink-0 text-[var(--color-thread-mid-green)]" />
                    <span className="min-w-0 truncate font-medium">{documentUploadFileName}</span>
                  </div>

                  <label className="mt-5 block">
                    <span className={MODAL_FIELD_LABEL_CLASS}>Document type</span>
                    <select
                      value={documentUploadTypeId}
                      onChange={(event) => setDocumentUploadTypeId(event.target.value)}
                      className="thread-select"
                    >
                      {DOCUMENT_TYPE_OPTIONS.map((option) => (
                        <option key={option.typeId} value={option.typeId}>
                          {option.typeName}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}

            {documentUploadStep === 3 && (
              <div className="max-w-2xl space-y-7">
                <div className="space-y-3">
                  <span className={MODAL_KICKER_CLASS}>Step 3</span>
                  <h2 id="document-upload-modal-title" className={MODAL_TITLE_CLASS}>
                    Secure Locker gate
                  </h2>
                  <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
                    Confirm this file can be stored in {currentChild.name}&apos;s encrypted document Locker.
                  </p>
                </div>

                <div className={MODAL_CONFIRM_PANEL_CLASS}>
                  <span className={MODAL_CONFIRM_TITLE_CLASS}>Document ready for Locker</span>
                  <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
                    <div className="font-medium">{documentUploadFileName}</div>
                    <div className="mt-1 text-xs text-slate-500">{selectedDocumentUploadType.typeName}</div>
                  </div>
                  <label className={MODAL_CONFIRM_ROW_CLASS}>
                    <input
                      type="checkbox"
                      checked={documentUploadRightsConfirmed}
                      onChange={(event) => setDocumentUploadRightsConfirmed(event.target.checked)}
                      className={MODAL_CHECKBOX_CLASS}
                    />
                    <span>I have the right to upload and share this document.</span>
                  </label>
                  <label className={MODAL_CONFIRM_ROW_CLASS}>
                    <input
                      type="checkbox"
                      checked={documentUploadThreadConfirmed}
                      onChange={(event) => setDocumentUploadThreadConfirmed(event.target.checked)}
                      className={MODAL_CHECKBOX_CLASS}
                    />
                    <span>I understand this document will become part of my child&apos;s Thread.</span>
                  </label>
                  <p className={MODAL_FINE_PRINT_CLASS}>
                    Your information is only shared with your permission.
                  </p>
                </div>
              </div>
            )}

            {documentUploadStep === 4 && (
              <ModalOutcomeScreen
                titleId="document-upload-modal-title"
                kicker="Confirm"
                icon={<LockKeyhole className="h-7 w-7 stroke-[1.8]" />}
                title="Confirm document upload"
                description={`Review the details below before this file is added to ${currentChild.name}'s secure Locker.`}
              >
                <div className={MODAL_CONFIRM_PANEL_CLASS}>
                  <span className={MODAL_CONFIRM_TITLE_CLASS}>Document to add</span>
                  <dl className="grid gap-3 text-sm">
                    <div>
                      <dt className="text-xs font-semibold text-slate-500">File</dt>
                      <dd className="mt-0.5 break-words text-[var(--color-thread-dark-slate)]">{documentUploadFileName}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-500">Document type</dt>
                      <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{selectedDocumentUploadType.typeName}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-slate-500">Locker</dt>
                      <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{currentChild.name}&apos;s secure document Locker</dd>
                    </div>
                  </dl>
                </div>

                <p className={MODAL_FINE_PRINT_CLASS}>
                  You can go back to change the document type or permissions before confirming.
                </p>
              </ModalOutcomeScreen>
            )}
    </QuestionnaireModuleModalFrame>
  );

  const removeSharedDocumentModal = (
    <ModalShell
      isOpen={Boolean(documentPendingRemoval)}
      titleId="remove-shared-document-title"
      size="small"
      panelClassName="p-6 sm:p-8"
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-ready-green)]">
              <X className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <h2 id="remove-shared-document-title" className="font-serif text-2xl font-normal leading-tight text-[var(--color-thread-heading)]">
                Remove shared document?
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                This will remove {documentPendingRemoval?.name ?? "this document"} from {currentChild.name}&apos;s shared document list.
              </p>
            </div>
          </div>
          <ModalCloseButton onClick={handleCancelRemoveSharedDocument} label="Close remove document confirmation" />
        </div>

        <div className={MODAL_CONFIRM_PANEL_CLASS}>
          <span className={MODAL_CONFIRM_TITLE_CLASS}>Document</span>
          <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-thread-light-green)] text-[var(--color-thread-ready-green)]">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium text-[var(--color-thread-dark-slate)]">
                {documentPendingRemoval?.name}
              </span>
              <span className="mt-0.5 block text-xs text-slate-400">
                {documentPendingRemoval?.date}
              </span>
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="tertiary"
            onClick={handleCancelRemoveSharedDocument}
            className={MODAL_SECONDARY_BUTTON_CLASS}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="dangerSolid"
            onClick={handleConfirmRemoveSharedDocument}
            className={MODAL_PRIMARY_BUTTON_CLASS}
          >
            Remove
          </Button>
        </div>
      </div>
    </ModalShell>
  );

  const clinicalProgressSummaryPanel = (
    <Card className="rounded-none rounded-tr-[32px] p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 max-sm:w-full">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Questionnaire Progress
          </span>
          <span className="shrink-0 text-xs font-semibold text-[var(--color-thread-mid-green)]">
            {questionnaireProgress}% Done
          </span>
        </div>
        <Button
          onClick={handleClinicalModulesAction}
          disabled={questionnaireProgress < 100}
          variant="primary"
          className={cn(
            "h-9 shrink-0 rounded-full px-4 text-xs font-semibold inline-flex items-center gap-2 max-sm:w-full max-sm:justify-center",
            questionnaireProgress < 100 && "opacity-50 cursor-not-allowed"
          )}
        >
          <Save className="w-4 h-4" />
          <span>Submit Questionnaire</span>
        </Button>
      </div>
      <ProgressBar
        value={questionnaireProgress}
        colorClass="bg-[var(--color-thread-mid-green)]"
        trackClassName="bg-slate-100"
      />
      <p className="text-xs text-slate-500">
        {answeredMvpQuestionCount} of {MVP_QUESTIONNAIRE_QUESTION_COUNT} total questions completed. Your progress is saved automatically.{" "}
        <ActionLink
          as="button"
          icon={null}
          onClick={() => setIsClinicalInfoModalOpen(true)}
          className="min-h-0 py-0 align-baseline text-xs font-semibold hover:text-[var(--color-thread-dark-green)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/25"
        >
          Confidential Clinical Information
        </ActionLink>
      </p>
    </Card>
  );

  if (showAssessmentPathwayCard) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className="pt-16 pb-24"
      >
        <PageContainer>
          <div className="space-y-16">
            <PageHeader
              kicker="Diagnostic assessment"
              title={`${currentChild.name}'s assessment.`}
              description={
                <SectionDescription>
                  {isMvp
                    ? assessmentHeaderDescriptionOverrides[currentProfileKey] || `Complete the details needed to prepare ${currentChild.name}'s Assessment Package for your child's clinician, such as your GP, paediatrician or psychiatrist.`
                    : `Manage preparation, tracking, and clinical details for ${currentChild.name}'s assessment pathway.`}
                </SectionDescription>
              }
            />

            <div className="space-y-6">
              <HeroQuoteCard
                kicker="A clear result"
                quote={isMvp
                  ? assessmentHeroQuoteOverrides[currentProfileKey] || "We help families prepare an Assessment Package designed to support clinical conversations and referral decisions."
                  : "A clinician reviews the information and explains whether ADHD looks likely, unlikely, or whether more information is needed - with clear next steps."}
                showQuotes={false}
                showDecoration={false}
                className="bg-white"
                rightNode={
                  <HeroActionCard
                    icon={<Stethoscope className={ASSESSMENT_READY_ICON_CLASS} />}
                    title="Assessment"
                    subtitle={diagnosticStarterSubtitle}
                    className={currentProfileKey === "Leo" ? "cursor-default" : undefined}
                    onClick={currentProfileKey === "Leo"
                      ? undefined
                      : diagnosticStarterSubtitle === "Get started"
                        ? handleCareOptionsAnchorClick
                        : handleDownloadClinicalReport}
                  />
                }
              />
              {showHeroClinicalPrepPanels && clinicalProgressSummaryPanel}
            </div>

            {!hideResultSection && (
              <div>
                <SectionLabel>
                  OUR RESULT
                </SectionLabel>
                <SectionTitle>
                  A clear answer, designed to guide decisions.
                </SectionTitle>

                <div className="mt-8 flex flex-col font-sans">
                  <TimelineItem
                    title="ADHD likely"
                    meta={isMvp ? "Assessment Ready evidence for clinical conversations" : "Clear pathways for school support and treatment options"}
                    content={isMvp
                      ? "If the clinical formulation determines ADHD is likely, the Assessment Package organises the evidence in plain language so it can support clinical conversations, referral decisions, and school communication."
                      : "If the clinical formulation determines ADHD is likely, we provide immediate, actionable pathways. This includes custom letter templates for school adjustments, GP-focused diagnostic documentation to support medical decisions, and play-based co-regulation structures to support your child at home."}
                    isFirst={true}
                    active={true}
                    isCollapsible={true}
                    hideMetrics={true}
                  />
                  <TimelineItem
                    title="ADHD unlikely"
                    meta="Investigating alternative developmental or environmental factors"
                    content="If ADHD is ruled unlikely, our clinical assessment doesn't stop there. We provide a detailed analysis of other observed domains (like sleep fatigue, school transition sensitivity, or physical wellbeing) to help you understand what other factors might be at play, and which specialists or resources to consult next."
                    isCollapsible={true}
                    hideMetrics={true}
                  />
                  <TimelineItem
                    title="More to explore"
                    meta="Targeted guidance for further clinical investigation"
                    content="When the presentation is complex or requires multi-disciplinary input, we identify exactly what needs deeper exploration. You receive structured observation logs and school coordination summaries to share with speech therapists, occupational therapists, or pediatricians to fast-track their diagnostic work."
                    isCollapsible={true}
                    hideMetrics={true}
                  />
                  <div className="border-b border-black/10" />
                </div>
              </div>
            )}

            {/* YOUR REPORT */}
            <div>
              <SectionLabel>
                YOUR REPORT
              </SectionLabel>
              <SectionTitle>
                More than a diagnosis. <br />A clear, usable picture.
              </SectionTitle>
              <SectionDescription>
                {isMvp
                  ? "Your Assessment Package is written in plain language and designed to support conversations with your child's clinician, referral decisions, and shared clinical understanding."
                  : "Your Threadline report is written in plain language and designed to guide your next step - not just label your child."}
              </SectionDescription>

              <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 pt-6 font-sans">
                <LockerItem
                  icon={<CheckCircle2 className={ASSESSMENT_SUPPORT_ICON_CLASS} />}
                  iconClassName={ASSESSMENT_SUPPORT_ICON_WRAPPER_CLASS}
                  title={isMvp ? "Assessment Package" : "Clear next steps"}
                  description={isMvp ? "A clear summary of the clinical picture, supporting evidence, and referral context." : "Practical guidance for what to do next: at home, at school, and with your child's clinician."}
                  cornerClass="rounded-tl-[32px]"
                />
                <LockerItem
                  icon={<Stethoscope className={ASSESSMENT_SUPPORT_ICON_CLASS} />}
                  iconClassName={ASSESSMENT_SUPPORT_ICON_WRAPPER_CLASS}
                  title="Support for your child's clinician"
                  description="An Assessment Package designed to support clinical conversations and referral decisions."
                  cornerClass="rounded-tr-[32px]"
                />
                <LockerItem
                  icon={<GraduationCap className={ASSESSMENT_SUPPORT_ICON_CLASS} />}
                  iconClassName={ASSESSMENT_SUPPORT_ICON_WRAPPER_CLASS}
                  title="Support for school"
                  description="A clear summary you can share with your child's school to guide appropriate support."
                  cornerClass="rounded-br-[32px]"
                />
              </div>
            </div>

            {/* YOUR CARE OPTIONS */}
            <div id="care-options-section" className="space-y-6 pt-6">
              <div id="care-options-header" className="space-y-2">
                <SectionLabel>Your Care Options</SectionLabel>
                <SectionTitle>Diagnostic assessment</SectionTitle>
                <SectionDescription>
                  For families seeking answers.
                </SectionDescription>
              </div>

              <div id="care-options-grid" className="max-w-4xl font-sans">
          {/* Left Card: Diagnostic assessment */}
                <Card id="care-option-diagnostic" className="bg-[var(--color-thread-light-green)] border border-black/5 rounded-2xl shadow-none w-full">
                  <div className="p-6 sm:p-7.5">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">
                      {/* Left Column: Description */}
                      <div className="flex-1 space-y-4">
                        <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)]">
                          {isMvp
                            ? "An Assessment Package designed to organise the clinical picture for conversations with your child's clinician."
                            : "A comprehensive assessment to understand your child&apos;s strengths and challenges, and whether a neurodevelopmental condition may explain what you&apos;re seeing."}
                        </p>
                      </div>

                      {/* Right Column: Points */}
                      <div className="flex-1 border-t md:border-t-0 md:border-l border-black/5 pt-6 md:pt-0 md:pl-10">
                        <ul className="space-y-2.5 pt-1">
                          {(isMvp
                            ? [
                                'Prepared Assessment Package',
                                'Evidence summary for clinical conversations',
                                'Referral decision support',
                                'School communication summary',
                              ]
                            : [
                                'Comprehensive multidisciplinary assessment',
                                'Personalised report',
                                'Clear recommendations',
                                'Access to Navigator',
                              ]).map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-[0.9rem] text-[var(--color-thread-dark-slate)] leading-snug">
                              <Check className="w-[15px] h-[15px] text-[var(--color-thread-mid-green)] mt-0.5 flex-shrink-0 stroke-[2.5]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-7 pt-6 border-t border-black/5 flex w-full items-center justify-between gap-4 max-sm:flex-col max-sm:items-stretch">
                      {isDiagnosticActive ? (
                        <div className="flex items-center justify-end w-full">
                          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] rounded-full text-[0.85rem] font-semibold">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>{isMvp ? "Assessment Ready" : "Current plan"}</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline font-serif">
                            <span className="text-2xl sm:text-[1.85rem] font-normal text-[var(--color-thread-heading)] leading-none tracking-tight">{formatAssessmentPackagePrice(DIAGNOSTIC_ASSESSMENT_PRICE)}</span>
                            <span className="text-[0.82rem] text-[var(--color-thread-gray)] ml-2.5 font-normal font-sans">One-off, includes GST</span>
                          </div>
                          <Button
                            id="get-started-diagnostic"
                            type="button"
                            variant="forest"
                            onClick={handleDiagnosticGetStartedClick}
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          >
                            Start your journey
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </PageContainer>
        {isMvp && (
          <MvpDiagnosticCheckoutModal
            childName={currentChild.name}
            isOpen={isMvpCheckoutModalOpen}
            onClose={() => setIsMvpCheckoutModalOpen(false)}
            onContinue={handleBookClick}
          />
        )}
        {clinicalConfidentialInformationModal}
        {documentUploadModal}
        {removeSharedDocumentModal}
        </motion.div>
      );
    }

  const teacherChecklistContent = (
    <TeacherQuestionnaireChecklistContent
      childName={currentChild.name}
      teacherStatus={teacherStatus}
      teacherName={teacherName}
      teacherEmail={teacherEmail}
      teacherMessage={teacherMessage}
      teacherInviteError={teacherInviteError}
      teacherContactPermission={teacherContactPermission}
      teacherAssessmentPermission={teacherAssessmentPermission}
      primaryTeacher={primaryTeacher}
      isSeededComplete={isSeededTeacherComplete}
      isInviteModalOpen={isTeacherInviteModalOpen}
      isConfirmingInvite={isConfirmingTeacherInvite}
      onTeacherNameChange={setTeacherName}
      onTeacherEmailChange={setTeacherEmail}
      onTeacherMessageChange={setTeacherMessage}
      onTeacherContactPermissionChange={setTeacherContactPermission}
      onTeacherAssessmentPermissionChange={setTeacherAssessmentPermission}
      onOpenTeacherInvite={handleOpenTeacherInviteModal}
      onCloseTeacherInvite={handleCloseTeacherInviteModal}
      onReviewTeacherInvite={handleReviewTeacherInvite}
      onBackToTeacherInviteDetails={handleBackToTeacherInviteDetails}
      onConfirmTeacherInvite={handleConfirmTeacherInvite}
      onSimulateTeacherResponse={handleSimulateTeacherResponse}
      onResetTeacherStatus={handleResetTeacherStatus}
    />
  );
  const teacherChecklistRowContent = (
    <TeacherQuestionnaireChecklistContent
      childName={currentChild.name}
      teacherStatus={teacherStatus}
      teacherName={teacherName}
      teacherEmail={teacherEmail}
      teacherMessage={teacherMessage}
      teacherInviteError={teacherInviteError}
      teacherContactPermission={teacherContactPermission}
      teacherAssessmentPermission={teacherAssessmentPermission}
      primaryTeacher={primaryTeacher}
      isSeededComplete={isSeededTeacherComplete}
      isInviteModalOpen={isTeacherInviteModalOpen}
      isConfirmingInvite={isConfirmingTeacherInvite}
      onTeacherNameChange={setTeacherName}
      onTeacherEmailChange={setTeacherEmail}
      onTeacherMessageChange={setTeacherMessage}
      onTeacherContactPermissionChange={setTeacherContactPermission}
      onTeacherAssessmentPermissionChange={setTeacherAssessmentPermission}
      onOpenTeacherInvite={handleOpenTeacherInviteModal}
      onCloseTeacherInvite={handleCloseTeacherInviteModal}
      onReviewTeacherInvite={handleReviewTeacherInvite}
      onBackToTeacherInviteDetails={handleBackToTeacherInviteDetails}
      onConfirmTeacherInvite={handleConfirmTeacherInvite}
      onSimulateTeacherResponse={handleSimulateTeacherResponse}
      onResetTeacherStatus={handleResetTeacherStatus}
      layout="unboxed"
    />
  );
  const renderClinicalModulesChecklistContent = () => (
    <div className="max-w-[62ch] space-y-4 pt-1">
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        The module maps out primary developmental areas including focus, sleep, school transitions, and co-regulation patterns, helping your child&apos;s clinician prepare a rich diagnostic overview.
      </p>
      <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} space-y-4 pt-2`}>
        <Button
          variant="secondary"
          onClick={handleClinicalModulesAction}
          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>{showQuestionnaireInAssessment ? clinicalModuleActionLabel : questionnaireProgress === 100 ? "Review Answers" : "Continue Module"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
  const childPerspectiveChecklistContent = (
    <div className="max-w-[62ch] space-y-4 pt-1">
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        A child-friendly section captures your child&apos;s own view of focus, school, friendships, sleep, and daily routines so their voice sits alongside parent and clinical inputs.
      </p>
      <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} pt-2`}>
        <Button
          variant="secondary"
          onClick={handleOpenChildPerspectiveModal}
          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isChildPerspectiveComplete ? "Review Perspective" : "Answer Question"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
  const preparationChecklistItems = [
    {
      id: "questionnaire",
      done: isAssessmentComplete || questionnaireProgress === 100,
      active: !isAssessmentComplete && questionnaireProgress > 0 && questionnaireProgress < 100,
      todo: !isAssessmentComplete && questionnaireProgress === 0,
      title: "Clinical modules",
      meta: isAssessmentComplete || questionnaireProgress === 100
        ? `All ${questionnaireTotalSections} developmental sections complete`
        : questionnaireCompletionMeta,
      metaTag: isAssessmentComplete || questionnaireProgress === 100 ? "Completed" : "In Progress",
      progress: isAssessmentComplete ? 100 : questionnaireProgress,
      image: pediatricianQuestionsImage,
      imageAlt: "Clinical modules preparation",
      cornerClass: "rounded-tr-[32px]",
      description: renderClinicalModulesChecklistContent(),
    },
    {
      id: "child-perspective",
      done: isChildPerspectiveComplete,
      active: !isChildPerspectiveComplete && childPerspectiveProgress > 0,
      todo: !isChildPerspectiveComplete && childPerspectiveProgress === 0,
      title: "Child's own perspective",
      meta: childPerspectiveMeta,
      metaTag: isChildPerspectiveComplete ? "Completed" : childPerspectiveProgress > 0 ? "In Progress" : "Pending",
      progress: childPerspectiveProgress,
      image: breathingRhythmImage,
      imageAlt: "Child perspective reflection",
      cornerClass: "rounded-tl-[32px]",
      description: childPerspectiveChecklistContent,
    },
    {
      id: "teacher-questionnaire",
      done: teacherChecklistState.done,
      active: teacherChecklistState.active,
      todo: teacherChecklistState.todo,
      title: "Ask teacher to complete questionnaire",
      meta: teacherChecklistState.meta,
      metaTag: teacherChecklistState.metaTag,
      progress: teacherChecklistState.done ? 100 : teacherChecklistState.active ? 50 : 0,
      image: classroomSupportImage,
      imageAlt: "Classroom teacher questionnaire",
      cornerClass: "rounded-tl-[32px]",
      description: teacherChecklistContent,
      rowDescription: teacherChecklistRowContent,
    },
    {
      id: "documents",
      done: isAssessmentComplete || documentCount > 0,
      todo: !isAssessmentComplete && documentCount === 0,
      title: "Document upload",
      meta: isAssessmentComplete || documentCount > 0
        ? `${sharedDocumentCount} file${sharedDocumentCount > 1 ? "s" : ""} shared in secure locker`
        : "Upload supporting school or medical letters",
      metaTag: isAssessmentComplete ? "Completed" : documentCount > 0 ? "Shared" : "Pending",
      progress: isAssessmentComplete || documentCount > 0 ? 100 : 0,
      image: watercolorBgImage,
      imageAlt: "Supporting assessment documents",
      cornerClass: "rounded-br-[32px]",
      description: (
        <div className="max-w-[62ch] space-y-4 pt-1">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Sharing previous reports, school term summaries, or occupational therapy feedback helps prepare the Assessment Package. Every document is protected with AES-256 end-to-end encryption in your secure Locker.
          </p>

          {documentCount > 0 && (
            <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} space-y-2 mt-2`}>
              <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px] mb-2 font-sans">Shared Documents ({documentCount})</span>
              {childFiles.map((file, i) => (
                renderSharedDocumentItem(file, i)
              ))}
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="secondary"
              onClick={handleOpenDocumentUploadModal}
              className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{documentCount > 0 ? "Add another document" : "Upload document"}</span>
              <Upload className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "follow-up",
      done: isFollowUpComplete,
      active: !isFollowUpComplete && isReadyForClinicalReview,
      todo: !isFollowUpComplete && !isReadyForClinicalReview,
      title: "Follow-up questions & gaps",
      meta: isFollowUpComplete || isReadyForClinicalReview
        ? "Your child's clinician is reviewing submitted inputs"
        : "Unlocks after questionnaire and documents are submitted",
      metaTag: isFollowUpComplete ? "Completed" : isReadyForClinicalReview ? "Under Review" : "As Needed",
      progress: isFollowUpComplete ? 100 : isReadyForClinicalReview ? 50 : 0,
      image: breathingRhythmImage,
      imageAlt: "Clinical follow-up review",
      cornerClass: "rounded-bl-[32px]",
      description: (
        <div className="max-w-[62ch] space-y-4 pt-1 font-sans">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            After your questionnaire responses and uploaded documents are received, your child's clinician reviews everything to prepare the Assessment Package. If any developmental details are missing or need clarification, we will reach out with targeted follow-up questions to fill any diagnostic gaps.
          </p>

          {isReadyForClinicalReview ? (
            <ClinicalHighlight
              className={CHECKLIST_DETAIL_WIDTH_CLASS}
              icon={<Clock className="h-5 w-5" />}
              title="Clinical Review in Progress"
            >
              No action is required from you right now. Your child's clinician is currently cross-referencing your questionnaire responses, school documents, and teacher observations. We will notify you if any clarifying questions are needed.
            </ClinicalHighlight>
          ) : !isAssessmentComplete && (
            <p className="text-xs text-slate-400 italic">
              This phase begins automatically once all above checklists are complete.
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <div className="space-y-16">
          <PageHeader
            kicker="Diagnostic assessment"
            title={
              isPackagePreparationChecklistView
                ? `Prepare ${currentChild.name}'s Assessment Package`
                : isAssessmentComplete
                  ? `${currentChild.name}'s assessment is ready.`
                  : `${currentChild.name}'s assessment.`
            }
            description={
              <SectionDescription>
                {isMvp
                  ? assessmentHeaderDescriptionOverrides[currentProfileKey] || `Complete the details needed to prepare ${currentChild.name}'s Assessment Package for your child's clinician, such as your GP, paediatrician or psychiatrist.`
                  : `Manage preparation, tracking, and clinical details for ${currentChild.name}'s assessment pathway.`}
              </SectionDescription>
            }
          />

          {/* TOP PANEL: BOOKING STATUS CARD */}
          <div className="space-y-6">
            <HeroQuoteCard
              kicker={isAssessmentComplete ? "Diagnostic Outcome" : isWaitingClinicalReview ? "Waiting clinical review" : "A clear result"}
              quote={isMvp 
                ? isAssessmentComplete
                  ? hasReturnedResults
                    ? `${currentChild.name}'s Assessment Package has been sent back by the clinician. Results are available now.`
                    : `${currentChild.name}'s Assessment Package has been shared with your child's clinician, who is now preparing the clinical formulation.`
                  : isWaitingClinicalReview
                  ? `${currentChild.name}'s questionnaire, teacher input, and documents are complete. Share the package with your child's clinician so they can use it to support formulation.`
                  : assessmentHeroQuoteOverrides[currentProfileKey] || "We help families prepare an Assessment Package designed to support clinical conversations and referral decisions."
                : "A clinician reviews the information and explains whether ADHD looks likely, unlikely, or whether more information is needed - with clear next steps."}
              showQuotes={false}
              showDecoration={false}
              rightNode={
                showAssessmentProgressCircle ? (
                  <OverallProgressCircleCard
                    progress={assessmentOverallProgress}
                    actionLabel={progressCircleActionLabel}
                    onAction={handleAssessmentProgressCircleAction}
                    showActionButton={showOverallActionButton}
                    disabled={isNoahSharedPackage}
                  />
                ) : (
                  <HeroActionCard
                    icon={isAssessmentComplete
                      ? <FileText className={ASSESSMENT_READY_ICON_CLASS} />
                      : isWaitingClinicalReview
                      ? <Clock className={ASSESSMENT_READY_ICON_CLASS} />
                      : <Stethoscope className={ASSESSMENT_READY_ICON_CLASS} />
                    }
                    title="Assessment"
                    subtitle={
                      isAssessmentComplete
                        ? hasReturnedResults
                          ? "Results available"
                          : currentProfileKey === "Noah"
                          ? "Shared"
                          : "Ready to share"
                        : isWaitingClinicalReview
                          ? "Ready to share"
                          : diagnosticStarterSubtitle
                    }
                    className={isAssessmentComplete
                      ? isNoahSharedPackage
                        ? "bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px] cursor-default"
                        : "bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px] hover:bg-[var(--color-thread-light-green)]/90 cursor-pointer"
                      : isWaitingClinicalReview
                      ? "bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px] hover:bg-[var(--color-thread-light-green)]/90 cursor-pointer"
                      : ""}
                    onClick={isNoahSharedPackage ? undefined : isWaitingClinicalReview ? handleOpenClinicianShareModal : handleClinicalOutcomeActionClick}
                  />
                )
              }
            />
            {showHeroClinicalPrepPanels && clinicalProgressSummaryPanel}
            {showDiagnosticAssessmentPlaceholderCard && (
              <DiagnosticAssessmentReadyPanel
                childName={currentChild.name}
                isShared={currentProfileKey === "Noah"}
                resourceGuides={diagnosticAssessmentResourceGuides}
                onShare={handleOpenClinicianShareModal}
                onUploadAssessment={handleOpenDocumentUploadModal}
                onOpenResources={() => navigate("/resources")}
                onBackToModules={() => setShowDiagnosticAssessmentModules(true)}
              />
            )}
          </div>

          {/* PREPARATION CHECKLIST SECTION */}
          {!showDiagnosticAssessmentPlaceholderCard && (
          <div className="space-y-6">
            {!isPackagePreparationChecklistView && (
              <div>
                <SectionLabel>Preparation Checklist</SectionLabel>
                <SectionTitle>
                  Prepare {currentChild.name}&apos;s Assessment Package
                </SectionTitle>
                <SectionDescription>
                  Completing these key preparation steps gives your child&apos;s clinician the context needed to review {currentChild.name}&apos;s Thread and prepare the Assessment Package.
                </SectionDescription>
              </div>
            )}

            {preparationChecklistView === "changed" || isPackagePreparationChecklistView ? (
              <div className={isPackagePreparationChecklistView ? "border-y border-black/10 [&>*:first-child]:border-t-0" : "mt-8 border-y border-black/10 [&>*:first-child]:border-t-0"}>
                {preparationChecklistItems.map((item) => {
                  const defaultExpanded = !item.done && (item.active || item.metaTag === "In Progress");

                  return (
                    <AreaItem
                      key={item.id}
                      title={item.title}
                      className={isPackagePreparationChecklistView ? "thread-package-highlight" : undefined}
                      impact={item.meta}
                      titleClassName={
                        isPackagePreparationChecklistView
                          ? "text-[1.85rem] leading-tight text-[var(--color-thread-heading)]"
                          : undefined
                      }
                      status={item.metaTag}
                      leadingVisual={
                        isPackagePreparationChecklistView ? (
                          <ProgressRing
                            value={item.progress}
                            complete={item.done}
                            className="h-11 w-11 p-[3px]"
                            centerClassName={cn(
                              "text-[0.68rem] font-bold",
                              item.done || item.active || item.metaTag === "In Progress" || item.metaTag === "Under Review"
                                ? "bg-transparent text-[var(--color-thread-mid-green)]"
                                : "bg-transparent text-slate-400",
                            )}
                          >
                            {item.done ? <Check className="w-4 h-4 stroke-[1.8]" /> : null}
                          </ProgressRing>
                        ) : undefined
                      }
                      icon={
                        item.done ? (
                          <Check className="w-3 h-3 stroke-[2.4]" />
                        ) : item.active || item.metaTag === "In Progress" ? (
                          <Clock className="w-3 h-3 stroke-[2.4]" />
                        ) : (
                          <AlertCircle className="w-3 h-3 stroke-[2.4]" />
                        )
                      }
                      isCollapsible={true}
                      collapsibleIndicator="plus-minus"
                      isExpanded={preparationChecklistOpenOverrides[item.id] ?? defaultExpanded}
                      bodyAlignment={isPackagePreparationChecklistView ? "title" : "container"}
                      leadingVisualGapClassName={isPackagePreparationChecklistView ? "gap-5" : undefined}
                      bodyAlignmentOffsetClassName={isPackagePreparationChecklistView ? "ml-16" : undefined}
                      onToggle={() => {
                        setPreparationChecklistOpenOverrides((current) => ({
                          ...current,
                          [item.id]: !(current[item.id] ?? defaultExpanded),
                        }));
                      }}
                      description={item.rowDescription ?? item.description}
                    />
                  );
                })}
              </div>
            ) : preparationChecklistView === "cards" ? (
              <div className="mt-8 grid gap-6">
                <PreparationChecklistCard
                  done={isAssessmentComplete || questionnaireProgress === 100}
                  active={!isAssessmentComplete && questionnaireProgress > 0 && questionnaireProgress < 100}
                  todo={!isAssessmentComplete && questionnaireProgress === 0}
                  title="Clinical modules"
      meta={isAssessmentComplete || questionnaireProgress === 100
        ? `All ${questionnaireTotalSections} developmental sections complete`
        : questionnaireCompletionMeta}
                  metaTag={isAssessmentComplete || questionnaireProgress === 100 ? "Completed" : "In Progress"}
                  image={pediatricianQuestionsImage}
                  imageAlt="Clinical modules preparation"
                  cornerClass="rounded-tr-[32px]"
                    description={renderClinicalModulesChecklistContent()}
                />

                <PreparationChecklistCard
                  done={isChildPerspectiveComplete}
                  active={!isChildPerspectiveComplete && childPerspectiveProgress > 0}
                  todo={!isChildPerspectiveComplete && childPerspectiveProgress === 0}
                  title="Child's own perspective"
                  meta={childPerspectiveMeta}
                  metaTag={isChildPerspectiveComplete ? "Completed" : childPerspectiveProgress > 0 ? "In Progress" : "Pending"}
                  image={breathingRhythmImage}
                  imageAlt="Child perspective reflection"
                  cornerClass="rounded-tl-[32px]"
                  description={childPerspectiveChecklistContent}
                />

                <PreparationChecklistCard
                  done={teacherChecklistState.done}
                  active={teacherChecklistState.active}
                  todo={teacherChecklistState.todo}
                  title="Ask teacher to complete questionnaire"
                  meta={teacherChecklistState.meta}
                  metaTag={teacherChecklistState.metaTag}
                  image={classroomSupportImage}
                  imageAlt="Classroom teacher questionnaire"
                  cornerClass="rounded-tl-[32px]"
                  description={teacherChecklistRowContent}
                />

                <PreparationChecklistCard
                  done={isAssessmentComplete || documentCount > 0}
                  todo={!isAssessmentComplete && documentCount === 0}
                  title="Document upload"
                  meta={isAssessmentComplete || documentCount > 0
                    ? `${documentCount === 0 && isAssessmentComplete ? 3 : documentCount} file${(documentCount === 0 && isAssessmentComplete) || documentCount > 1 ? 's' : ''} shared in secure locker`
                    : "Upload supporting school or medical letters"}
                  metaTag={isAssessmentComplete ? "Completed" : (documentCount > 0 ? "Shared" : "Pending")}
                  image={watercolorBgImage}
                  imageAlt="Supporting assessment documents"
                  cornerClass="rounded-br-[32px]"
                  description={
                    <div className="max-w-[62ch] space-y-4 pt-1">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        Sharing previous reports, school term summaries, or occupational therapy feedback helps prepare the Assessment Package. Every document is protected with AES-256 end-to-end encryption in your secure Locker.
                      </p>

                      {documentCount > 0 && (
                        <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} space-y-2 mt-2`}>
                          <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px] mb-2 font-sans">Shared Documents ({documentCount})</span>
                          {childFiles.map((file, i) => (
                            renderSharedDocumentItem(file, i)
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          onClick={handleOpenDocumentUploadModal}
                          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{documentCount > 0 ? "Add another document" : "Upload document"}</span>
                          <Upload className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  }
                />

                <PreparationChecklistCard
                  done={isFollowUpComplete}
                  active={!isFollowUpComplete && isReadyForClinicalReview}
                  todo={!isFollowUpComplete && !isReadyForClinicalReview}
                  title="Follow-up questions & gaps"
                  meta={isFollowUpComplete || isReadyForClinicalReview
                    ? "Your child's clinician is reviewing submitted inputs"
                    : "Unlocks after questionnaire and documents are submitted"}
                  metaTag={isFollowUpComplete ? "Completed" : isReadyForClinicalReview ? "Under Review" : "As Needed"}
                  image={breathingRhythmImage}
                  imageAlt="Clinical follow-up review"
                  cornerClass="rounded-bl-[32px]"
                  description={
                    <div className="max-w-[62ch] space-y-4 pt-1 font-sans">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        After your questionnaire responses and uploaded documents are received, your child's clinician reviews everything to prepare the Assessment Package. If any developmental details are missing or need clarification, we will reach out with targeted follow-up questions to fill any diagnostic gaps.
                      </p>

                      {isReadyForClinicalReview ? (
                        <ClinicalHighlight
                          className={CHECKLIST_DETAIL_WIDTH_CLASS}
                          icon={<Clock className="h-5 w-5" />}
                          title="Clinical Review in Progress"
                        >
                          No action is required from you right now. Your child's clinician is currently cross-referencing your questionnaire responses, school documents, and teacher observations. We will notify you if any clarifying questions are needed.
                        </ClinicalHighlight>
                      ) : !isAssessmentComplete && (
                        <p className="text-xs text-slate-400 italic">
                          This phase begins automatically once all above checklists are complete.
                        </p>
                      )}
                    </div>
                  }
                />
              </div>
            ) : (
            <div className="relative mt-8">
              {/* Vertical Line */}
              <div className="absolute left-[11px] top-3.5 bottom-5 w-[2px] bg-black/10" />

              <div className="space-y-8">
                <TimelineStep
                  done={isAssessmentComplete || questionnaireProgress === 100}
                  active={!isAssessmentComplete && questionnaireProgress > 0 && questionnaireProgress < 100}
                  todo={!isAssessmentComplete && questionnaireProgress === 0}
                  title="Clinical modules"
                  meta={isAssessmentComplete || questionnaireProgress === 100 
                    ? `All ${questionnaireTotalSections} developmental sections complete` 
                    : `${completedSectionCount} of ${questionnaireTotalSections} sections complete`}
                  metaTag={isAssessmentComplete || questionnaireProgress === 100 ? "Completed" : "In Progress"}
                  description={
                      renderClinicalModulesChecklistContent()
                  }
                />

                <TimelineStep
                  done={isChildPerspectiveComplete}
                  active={!isChildPerspectiveComplete && childPerspectiveProgress > 0}
                  todo={!isChildPerspectiveComplete && childPerspectiveProgress === 0}
                  title="Child's own perspective"
                  meta={childPerspectiveMeta}
                  metaTag={isChildPerspectiveComplete ? "Completed" : childPerspectiveProgress > 0 ? "In Progress" : "Pending"}
                  description={childPerspectiveChecklistContent}
                />

                <TimelineStep
                  done={teacherChecklistState.done}
                  active={teacherChecklistState.active}
                  todo={teacherChecklistState.todo}
                  title="Ask teacher to complete questionnaire"
                  meta={teacherChecklistState.meta}
                  metaTag={teacherChecklistState.metaTag}
                  description={teacherChecklistRowContent}
                />

                <TimelineStep
                  done={isAssessmentComplete || documentCount > 0}
                  todo={!isAssessmentComplete && documentCount === 0}
                  title="Document upload"
                  meta={isAssessmentComplete || documentCount > 0 
                    ? `${documentCount === 0 && isAssessmentComplete ? 3 : documentCount} file${(documentCount === 0 && isAssessmentComplete) || documentCount > 1 ? 's' : ''} shared in secure locker` 
                    : "Upload supporting school or medical letters"}
                  metaTag={isAssessmentComplete ? "Completed" : (documentCount > 0 ? "Shared" : "Pending")}
                  description={
                    <div className="max-w-[62ch] space-y-4 pt-1">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        Sharing previous reports, school term summaries, or occupational therapy feedback helps prepare the Assessment Package. Every document is protected with AES-256 end-to-end encryption in your secure Locker.
                      </p>

                      {documentCount > 0 && (
                        <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} space-y-2 mt-2`}>
                          <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px] mb-2 font-sans">Shared Documents ({documentCount})</span>
                          {childFiles.map((file, i) => (
                            renderSharedDocumentItem(file, i)
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          onClick={handleOpenDocumentUploadModal}
                          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{documentCount > 0 ? "Add another document" : "Upload document"}</span>
                          <Upload className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  }
                />

                <TimelineStep
                  done={isFollowUpComplete}
                  active={!isFollowUpComplete && isReadyForClinicalReview}
                  todo={!isFollowUpComplete && !isReadyForClinicalReview}
                  title="Follow-up questions & gaps"
                  meta={isFollowUpComplete || isReadyForClinicalReview
                    ? "Your child's clinician is reviewing submitted inputs"
                    : "Unlocks after questionnaire and documents are submitted"}
                  metaTag={isFollowUpComplete ? "Completed" : isReadyForClinicalReview ? "Under Review" : "As Needed"}
                  description={
                    <div className="max-w-[62ch] space-y-4 pt-1 font-sans">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        After your questionnaire responses and uploaded documents are received, your child's clinician reviews everything to prepare the Assessment Package. If any developmental details are missing or need clarification, we will reach out with targeted follow-up questions to fill any diagnostic gaps.
                      </p>
                      
                      {isReadyForClinicalReview ? (
                        <ClinicalHighlight
                          className={CHECKLIST_DETAIL_WIDTH_CLASS}
                          icon={<Clock className="h-5 w-5" />}
                          title="Clinical Review in Progress"
                        >
                          No action is required from you right now. Your child's clinician is currently cross-referencing your questionnaire responses, school documents, and teacher observations. We will notify you if any clarifying questions are needed.
                        </ClinicalHighlight>
                      ) : !isAssessmentComplete && (
                        <p className="text-xs text-slate-400 italic">
                          This phase begins automatically once all above checklists are complete.
                        </p>
                      )}
                    </div>
                  }
                />
              </div>
              </div>
            )}
          </div>
          )}
        </div>
      </PageContainer>
      <QuestionnaireModuleModalFrame
        isOpen={Boolean(clinicalQuestionModalSection) || isClinicalModulesSuccessVisible}
        titleId="clinical-question-modal-title"
        activeStep={isClinicalModulesSuccessVisible ? clinicalModuleSections.length : activeClinicalModuleStepNumber}
        completedSteps={completedClinicalModuleStepNumbers}
        heading="Clinical modules"
        steps={clinicalModuleSidebarSteps}
        closeLabel="Close clinical modules question"
        onClose={() => {
          clearClinicalModulesOpenRequest();
          setIsClinicalModulesSuccessVisible(false);
          setClinicalQuestionModalSection(null);
          setClinicalQuestionModalIndex(0);
          setIsClinicalModuleCoverVisible(false);
        }}
        onStepSelect={(step) => {
          const selectedSection = clinicalModuleSections[step.num - 1];
          if (selectedSection) {
            handleSelectClinicalModule(selectedSection);
          }
        }}
        footer={!isClinicalModuleCoverVisible && !isClinicalModulesSuccessVisible ? (
          <>
            <Button
              variant="secondary"
              onClick={handlePreviousClinicalQuestion}
              disabled={isFirstClinicalQuestion}
              className={MODAL_SECONDARY_BUTTON_CLASS}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextClinicalQuestion}
              className={MODAL_PRIMARY_BUTTON_CLASS}
            >
              {isLastClinicalQuestion ? "Done" : "Next"}
            </Button>
          </>
        ) : undefined}
      >
        {isClinicalModulesSuccessVisible ? (
          <ModalOutcomeScreen
            titleId="clinical-question-modal-title"
            icon={<CheckCircle2 className="h-7 w-7 stroke-[1.8]" />}
            title="Clinical modules complete"
            description={`All clinical module questions for ${currentChild.name} are complete. Threadline will keep these answers in the Assessment Package preparation view.`}
            actionLabel="Back to preparation"
            onAction={() => {
              clearClinicalModulesOpenRequest();
              setIsClinicalModulesSuccessVisible(false);
            }}
          />
        ) : isClinicalModuleCoverVisible && clinicalQuestionModalSection ? (
          <div className="max-w-2xl space-y-7">
            <div className="space-y-3">
              <span className={MODAL_KICKER_CLASS}>
                Module {activeClinicalModuleStepNumber}
              </span>
              <h2 id="clinical-question-modal-title" className={MODAL_TITLE_CLASS}>
                {activeClinicalModuleTitle}
              </h2>
              <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
                {activeClinicalModuleMeta.description}
              </p>
            </div>

            <div className="rounded-none rounded-tr-[28px] bg-[var(--color-thread-off-white)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Module progress
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--color-thread-dark-slate)]">
                    {activeClinicalModuleProgress.answeredCount} of {activeClinicalModuleProgress.totalCount} questions complete
                  </p>
                </div>
                <Button
                  onClick={handleStartClinicalModule}
                  className={MODAL_PRIMARY_BUTTON_CLASS}
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  {isActiveClinicalModuleComplete ? "Review module" : "Start module"}
                </Button>
              </div>
            </div>
          </div>
        ) : activeClinicalQuestion ? (
          <div className="max-w-2xl space-y-7">
            <div className="space-y-3">
              <span className={MODAL_KICKER_CLASS}>
                {activeClinicalModuleTitle}
              </span>
              <h2 id="clinical-question-modal-title" className={MODAL_TITLE_CLASS}>
                {activeClinicalQuestion.text.replace(/\$\{childName\}/g, currentChild.name)}
              </h2>
              {activeClinicalQuestion.subtext && (
                <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
                  {activeClinicalQuestion.subtext.replace(/\$\{childName\}/g, currentChild.name)}
                </p>
              )}
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Question {clinicalQuestionOrdinal} of {MVP_QUESTIONNAIRE_QUESTION_COUNT}
              </p>
            </div>

            {activeClinicalQuestion.type === "choice" && activeClinicalQuestion.options ? (
              <div className="space-y-2.5">
                {activeClinicalQuestion.options.map((option, optionIndex) => {
                  const selected = questionnaireAnswers[activeClinicalQuestion.id] === option;
                  const letter = String.fromCharCode(65 + optionIndex);

                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleClinicalQuestionAnswerChange(activeClinicalQuestion.id, option)}
                      className={cn(
                        "w-full rounded-none rounded-tr-[20px] border p-4 text-left transition-colors",
                        selected
                          ? "border-[var(--color-thread-mid-green)]/30 bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)]"
                          : "border-black/10 bg-white text-[var(--color-thread-dark-slate)] hover:border-black/20 hover:bg-[var(--color-thread-off-white)]/60",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border text-[0.66rem] font-medium",
                            selected
                              ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-mid-green)] text-white"
                              : "border-black/10 bg-white text-slate-400",
                          )}
                        >
                          {letter}
                        </span>
                        <span className="text-[0.95rem]">{option}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block">
                  <span className={MODAL_FIELD_LABEL_CLASS}>Answer</span>
                  <textarea
                    value={String(questionnaireAnswers[activeClinicalQuestion.id] ?? "")}
                    onChange={(event) => handleClinicalQuestionAnswerChange(activeClinicalQuestion.id, event.target.value)}
                    placeholder={activeClinicalQuestion.placeholder || "Type your answer here..."}
                    rows={5}
                    className="min-h-[150px] w-full resize-y rounded-none rounded-tr-[24px] border border-black/10 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none transition focus:border-[var(--color-thread-mid-green)] focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/15"
                  />
                </label>

                <div className={QUESTION_NOT_SURE_PROMPT_CLASS}>
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" aria-hidden="true" />
                    <p className="leading-relaxed">
                      {NOT_SURE_PROMPT_TEXT}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleMarkClinicalQuestionNotSure(activeClinicalQuestion.id, activeClinicalQuestion.options)}
                    className={MODAL_SECONDARY_BUTTON_CLASS}
                  >
                    {questionnaireAnswers[activeClinicalQuestion.id] === getNotSureAnswerValue(activeClinicalQuestion.options)
                      ? "Marked not sure"
                      : "Mark as not sure"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </QuestionnaireModuleModalFrame>
      <QuestionnaireModuleModalFrame
        isOpen={isChildPerspectiveModalOpen || isChildPerspectiveSuccessVisible}
        titleId="child-perspective-question-title"
        activeStep={isChildPerspectiveSuccessVisible ? Math.max(1, childPerspectiveQuestionCount) : childPerspectiveQuestionCount > 0 ? childPerspectiveModalQuestionIndex + 1 : 1}
        completedSteps={completedChildPerspectiveStepNumbers}
        heading="Child perspective"
        steps={childPerspectiveSidebarSteps}
        closeLabel="Close child perspective question"
        onClose={() => {
          setIsChildPerspectiveModalOpen(false);
          setIsChildPerspectiveSuccessVisible(false);
        }}
        onStepSelect={(step) => {
          setIsChildPerspectiveSuccessVisible(false);
          setIsChildPerspectiveModalOpen(true);
          setChildPerspectiveModalQuestionIndex(Math.max(0, step.num - 1));
        }}
        footer={!isChildPerspectiveSuccessVisible ? (
          <>
              <Button
                variant="secondary"
                onClick={handlePreviousChildPerspectiveQuestion}
                disabled={isFirstChildPerspectiveQuestion}
                className={MODAL_SECONDARY_BUTTON_CLASS}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextChildPerspectiveQuestion}
                className={MODAL_PRIMARY_BUTTON_CLASS}
              >
                {isLastChildPerspectiveQuestion ? "Done" : "Next"}
              </Button>
          </>
        ) : undefined}
      >
        {isChildPerspectiveSuccessVisible ? (
          <ModalOutcomeScreen
            titleId="child-perspective-question-title"
            icon={<CheckCircle2 className="h-7 w-7 stroke-[1.8]" />}
            title="Child perspective complete"
            description={`${currentChild.name}'s child perspective prompts are complete. These answers will stay separate from the clinical modules and remain part of the Assessment Package preparation.`}
            actionLabel="Back to preparation"
            onAction={() => {
              setIsChildPerspectiveSuccessVisible(false);
            }}
          />
        ) : (
        <div className="max-w-2xl space-y-7">
          <div className="space-y-3">
            <span className={MODAL_KICKER_CLASS}>Child&apos;s own perspective</span>
            <h2 id="child-perspective-question-title" className={MODAL_TITLE_CLASS}>
              {childPerspectiveModalQuestion?.text ?? "Child perspective"}
            </h2>
            <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
              Capture this answer directly here. These five prompts sit outside the Clinical modules and keep your child&apos;s own view separate.
            </p>
            {childPerspectiveQuestionCount > 0 && (
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Question {childPerspectiveModalQuestionIndex + 1} of {childPerspectiveQuestionCount}
              </p>
            )}
          </div>

          <label className="block">
            <span className={MODAL_FIELD_LABEL_CLASS}>Answer</span>
            <textarea
              value={childPerspectiveModalAnswer}
              onChange={(event) => handleChildPerspectiveAnswerChange(event.target.value)}
              placeholder="Type the child's words or a short supported answer..."
              rows={5}
              className="min-h-[180px] w-full resize-y rounded-none rounded-tr-[24px] border border-black/10 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none transition focus:border-[var(--color-thread-mid-green)] focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/15"
            />
          </label>
        </div>
        )}
      </QuestionnaireModuleModalFrame>
      {clinicalConfidentialInformationModal}
      {documentUploadModal}
      {removeSharedDocumentModal}
        {isMvp && canOpenClinicianShareModal && (
          <MvpClinicianShareModal
          clinicianName={clinicianName}
          clinicianPractice={clinicianPractice}
          clinicianEmail={clinicianEmail}
          sharePermission={clinicianSharePermission}
          shareError={clinicianShareError}
          isConfirmingShare={isConfirmingClinicianShare}
          isOpen={isClinicianShareModalOpen}
          onClinicianNameChange={setClinicianName}
          onClinicianPracticeChange={setClinicianPractice}
          onClinicianEmailChange={setClinicianEmail}
          onSharePermissionChange={setClinicianSharePermission}
          onBackToDetails={handleBackToClinicianShareDetails}
          onClose={handleCloseClinicianShareModal}
          onReviewShare={handleReviewShareAssessmentPackage}
          onConfirmShare={handleConfirmShareAssessmentPackage}
        />
      )}
    </motion.div>
  );
}
