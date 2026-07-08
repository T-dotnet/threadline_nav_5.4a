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
  BookOpen,
  Eye,
  MessageSquare,
  Lightbulb,
  Video,
  Download,
  GraduationCap,
  Check,
  LockKeyhole,
  Tag
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
import { ProcessStepperSidebar } from "./ui/ProcessStepperSidebar";
import { PreparationChecklistCard } from "./ui/PreparationChecklistCard";
import { ActionLink } from "./ui/ActionLink";
import { TimelineItem } from "./ui/TimelineItem";
import { LockerItem } from "./ui/LockerItem";
import { ModalCloseButton, ModalShell } from "./ui/ModalShell";
import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { useLocker } from "../context/LockerContext";
import { useSecondaryUsers } from "../context/SecondaryUsersContext";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
  getChildProfileKey,
  getAssessmentProgressCardData,
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
import { MVP_WORKFLOW_QUESTIONS } from "../lib/familyJourneyQuestionBank";
import { isAnswered } from "../questionnaire";
import { cn } from "../lib/utils";

import clinicalReportImg from "../assets/images/clinical_report_placeholder_1783000795444.jpg";
import pediatricianQuestionsImage from "../assets/images/optimized/abstract-pediatrician-questions-900.jpg";
import classroomSupportImage from "../assets/images/optimized/abstract-classroom-support-900.jpg";
import breathingRhythmImage from "../assets/images/optimized/abstract-breathing-coregulation-900.jpg";
import watercolorBgImage from "../assets/images/optimized/abstract-assessment-documents-900.jpg";

const MVP_QUESTIONNAIRE_MODULES = Object.keys(MVP_WORKFLOW_QUESTIONS);
const MVP_QUESTIONNAIRE_QUESTION_COUNT = Object.values(MVP_WORKFLOW_QUESTIONS).flat().length;
const CHECKLIST_DETAIL_WIDTH_CLASS = "w-full max-w-lg";
const MODAL_KICKER_CLASS = "text-[0.68rem] tracking-[0.18em] uppercase font-medium text-[var(--color-thread-mid-green)]";
const MODAL_TITLE_CLASS = "mt-2 font-serif font-normal text-[1.75rem] sm:text-[2rem] leading-[1.08] tracking-tight text-[var(--color-thread-heading)]";
const MODAL_BODY_CLASS = "text-sm text-slate-600 leading-relaxed";
const MODAL_FIELD_LABEL_CLASS = "block text-xs font-semibold text-slate-600 mb-1.5";
const MODAL_CONFIRM_PANEL_CLASS = "space-y-3 rounded-none rounded-tr-[28px] bg-[var(--color-thread-off-white)] p-4";
const MODAL_CONFIRM_TITLE_CLASS = "block text-xs font-semibold text-slate-700";
const MODAL_CONFIRM_ROW_CLASS = "flex items-start gap-3 text-xs leading-relaxed text-slate-700";
const MODAL_CHECKBOX_CLASS = "mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--color-thread-mid-green)] focus:ring-[var(--color-thread-mid-green)]";
const MODAL_FINE_PRINT_CLASS = "text-[11px] leading-relaxed text-slate-500";
const MODAL_LINK_BUTTON_CLASS = "font-semibold text-[var(--color-thread-mid-green)] hover:underline";
const MODAL_SECONDARY_BUTTON_CLASS = "text-xs h-9 px-4 font-semibold rounded-full border-black/10 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer";
const MODAL_PRIMARY_BUTTON_CLASS = "text-xs h-9 px-4 font-semibold rounded-full cursor-pointer";
const DIAGNOSTIC_ASSESSMENT_PRICE = 1850;
const CHILD_PERSPECTIVE_MODULE_TITLE = "6. Child's Own Perspective";

type DiagnosticCheckoutStep = "legal" | "payment" | "complete";
type RequiredThreadConsent = "guardian" | "medical" | "terms";
type OptionalThreadConsent = "improveThreadline" | "improveAssessment";

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
      <div
        className="thread-questionnaire-module-progress relative h-20 w-20 shrink-0 rounded-full p-[5px]"
        style={{ "--section-progress": `${normalizedProgress}%` } as React.CSSProperties}
        aria-label={`Overall progress ${normalizedProgress}%`}
      >
        <div className="thread-package-progress-center flex h-full w-full items-center justify-center rounded-full bg-transparent" aria-hidden="true">
          <span className="sr-only">{normalizedProgress}%</span>
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

const DIAGNOSTIC_DISCOUNT_CODES = {
  THREAD20: {
    label: "Threadline family discount",
    percentage: 20,
  },
  CARE10: {
    label: "Care access discount",
    percentage: 10,
  },
};

const DIAGNOSTIC_DISCOUNT_CODE_EXAMPLE = Object.keys(DIAGNOSTIC_DISCOUNT_CODES)[0];

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
  onTeacherNameChange: (value: string) => void;
  onTeacherEmailChange: (value: string) => void;
  onTeacherMessageChange: (value: string) => void;
  onTeacherContactPermissionChange: (value: boolean) => void;
  onTeacherAssessmentPermissionChange: (value: boolean) => void;
  onOpenTeacherInvite: () => void;
  onCloseTeacherInvite: () => void;
  onSendTeacherInvite: (event: React.FormEvent) => void;
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
  onTeacherNameChange,
  onTeacherEmailChange,
  onTeacherMessageChange,
  onTeacherContactPermissionChange,
  onTeacherAssessmentPermissionChange,
  onOpenTeacherInvite,
  onCloseTeacherInvite,
  onSendTeacherInvite,
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
            <span className="text-slate-400 text-[10px] ml-auto shrink-0">12 Jun 2024</span>
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
        <form onSubmit={onSendTeacherInvite}>
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
                  onClick={onCloseTeacherInvite}
                  className={MODAL_SECONDARY_BUTTON_CLASS}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className={MODAL_PRIMARY_BUTTON_CLASS}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Send invitation
                </Button>
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
  isOpen: boolean;
  onClinicianNameChange: (value: string) => void;
  onClinicianPracticeChange: (value: string) => void;
  onClinicianEmailChange: (value: string) => void;
  onSharePermissionChange: (value: boolean) => void;
  onClose: () => void;
  onDownload: () => void;
  onShare: (event: React.FormEvent) => void;
}

function MvpClinicianShareModal({
  clinicianName,
  clinicianPractice,
  clinicianEmail,
  sharePermission,
  shareError,
  isOpen,
  onClinicianNameChange,
  onClinicianPracticeChange,
  onClinicianEmailChange,
  onSharePermissionChange,
  onClose,
  onDownload,
  onShare,
}: MvpClinicianShareModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      titleId="clinician-share-modal-title"
      size="small"
      radiusClassName="rounded-none rounded-tr-[36px]"
    >
      <form onSubmit={onShare}>
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
                placeholder="Dr Sarah Jones"
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
                placeholder="sarah.jones@abcmedical.com"
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
                placeholder="ABC Medical Centre"
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

          {shareError && (
            <p className="text-xs text-red-500 font-medium">{shareError}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Button
              type="button"
              variant="tertiary"
              onClick={onDownload}
              className={MODAL_SECONDARY_BUTTON_CLASS}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download report
            </Button>
            <div className="ml-auto flex flex-wrap gap-3">
              <Button
                type="button"
                variant="tertiary"
                onClick={onClose}
                className={MODAL_SECONDARY_BUTTON_CLASS}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className={MODAL_PRIMARY_BUTTON_CLASS}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Share Assessment Package
              </Button>
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
  const [appliedDiscountCode, setAppliedDiscountCode] = React.useState<keyof typeof DIAGNOSTIC_DISCOUNT_CODES | null>(null);
  const [discountError, setDiscountError] = React.useState("");

  React.useEffect(() => {
    if (isOpen) return;
    setStep("legal");
    setRequiredConsents(DEFAULT_REQUIRED_THREAD_CONSENTS);
    setOptionalConsents(DEFAULT_OPTIONAL_THREAD_CONSENTS);
    setIsOptionalConsentsOpen(false);
    setDiscountCode("");
    setAppliedDiscountCode(null);
    setDiscountError("");
  }, [isOpen]);

  const canCreateThread = Object.values(requiredConsents).every(Boolean);
  const appliedDiscount = appliedDiscountCode ? DIAGNOSTIC_DISCOUNT_CODES[appliedDiscountCode] : null;
  const discountAmount = appliedDiscount
    ? Math.round(DIAGNOSTIC_ASSESSMENT_PRICE * (appliedDiscount.percentage / 100))
    : 0;
  const total = DIAGNOSTIC_ASSESSMENT_PRICE - discountAmount;
  const formattedTotal = total.toLocaleString("en-US");
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
    const normalizedCode = discountCode.trim().toUpperCase() as keyof typeof DIAGNOSTIC_DISCOUNT_CODES;

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
      maxWidthClassName="max-w-4xl"
      radiusClassName="rounded-none rounded-tr-[40px]"
      panelClassName="overflow-hidden"
    >
      <div className="grid min-h-[620px] grid-cols-[250px_minmax(0,1fr)] bg-white max-md:grid-cols-1">
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
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-thread-mid-green)]">
                {step === "legal" ? "Create your Thread" : step === "payment" ? "Secure checkout" : "Thread created"}
              </span>
              <h2
                id="diagnostic-checkout-title"
                className="mt-2 font-serif text-[1.85rem] font-normal leading-[1.08] tracking-tight text-[var(--color-thread-heading)] sm:text-[2.25rem]"
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
                <ClinicalHighlight icon={<LockKeyhole className="h-5 w-5" />}>
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
                      <label className="mb-1.5 block text-xs font-semibold text-slate-600" htmlFor="diagnostic-card-name">
                        Name on card
                      </label>
                      <input
                        id="diagnostic-card-name"
                        className="thread-input thread-input--default text-sm"
                        placeholder="Taylor Morgan"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-600" htmlFor="diagnostic-card-number">
                        Card number
                      </label>
                      <input
                        id="diagnostic-card-number"
                        className="thread-input thread-input--default text-sm"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-600" htmlFor="diagnostic-card-expiry">
                          Expiry
                        </label>
                        <input
                          id="diagnostic-card-expiry"
                          className="thread-input thread-input--default text-sm"
                          placeholder="12 / 30"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-600" htmlFor="diagnostic-card-cvc">
                          CVC
                        </label>
                        <input
                          id="diagnostic-card-cvc"
                          className="thread-input thread-input--default text-sm"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="space-y-4 rounded-none rounded-tr-[30px] border border-black/5 bg-white p-5">
                  <div>
                    <h3 className="text-base font-semibold text-[var(--color-thread-heading)]">Order summary</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Assessment Package for {childName}.
                    </p>
                  </div>

                  <div className="space-y-2 border-y border-black/5 py-4 text-sm">
                    <div className="flex justify-between gap-4 text-slate-600">
                      <span>Assessment Package</span>
                      <span>${DIAGNOSTIC_ASSESSMENT_PRICE.toLocaleString("en-US")}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between gap-4 text-[var(--color-thread-mid-green)]">
                        <span>{appliedDiscount.label}</span>
                        <span>-${discountAmount.toLocaleString("en-US")}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-4 pt-2 text-lg font-semibold text-slate-950">
                      <span>Total</span>
                      <span>${formattedTotal}</span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600" htmlFor="diagnostic-discount-code">
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
            <p className="text-xs leading-relaxed text-slate-500">
              Your information is only shared with your permission.
            </p>
            <div className="ml-auto flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              {step !== "complete" && (
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
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setStep("complete")}
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Pay ${formattedTotal}
                </Button>
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
  const { isMvp, preparationChecklistView, showAssessmentProgressCircle, showDiagnosticAssessmentPlaceholder } = useDisplayMode();
  const { files } = useLocker();
  const { secondaryUsers, addSecondaryUser } = useSecondaryUsers();
  const navigate = useNavigate();

  const [openSection, setOpenSection] = React.useState<string | null>("questionnaire");
  const [resultTab, setResultTab] = React.useState<"likely" | "unlikely" | "explore">("likely");

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
  const [isMvpCheckoutModalOpen, setIsMvpCheckoutModalOpen] = React.useState(false);
  const [isClinicianShareModalOpen, setIsClinicianShareModalOpen] = React.useState(false);
  const [isChildPerspectiveModalOpen, setIsChildPerspectiveModalOpen] = React.useState(false);
  const [clinicianName, setClinicianName] = React.useState(() => {
    return localStorage.getItem(`clinician-name-${currentChild.id}`) || "Dr Sarah Jones";
  });
  const [clinicianPractice, setClinicianPractice] = React.useState(() => {
    return localStorage.getItem(`clinician-practice-${currentChild.id}`) || "ABC Medical Centre";
  });
  const [clinicianEmail, setClinicianEmail] = React.useState(() => {
    return localStorage.getItem(`clinician-email-${currentChild.id}`) || "sarah.jones@abcmedical.com";
  });
  const [clinicianSharePermission, setClinicianSharePermission] = React.useState(false);
  const [clinicianShareError, setClinicianShareError] = React.useState("");
  const [preparationChecklistOpenOverrides, setPreparationChecklistOpenOverrides] = React.useState<Record<string, boolean>>({});

  const handleOpenTeacherInviteModal = () => {
    setTeacherInviteError("");
    setIsTeacherInviteModalOpen(true);
  };

  const handleCloseTeacherInviteModal = () => {
    setTeacherInviteError("");
    setTeacherContactPermission(false);
    setTeacherAssessmentPermission(false);
    setIsTeacherInviteModalOpen(false);
  };

  const handleSendTeacherInvite = (e: React.FormEvent) => {
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
    setIsClinicianShareModalOpen(true);
  };

  const handleCloseClinicianShareModal = () => {
    setClinicianShareError("");
    setClinicianSharePermission(false);
    setIsClinicianShareModalOpen(false);
  };

  const handleDownloadClinicalReport = () => {
    window.open(clinicalReportImg, '_blank');
  };

  const handleClinicalOutcomeActionClick = () => {
    if (isMvp && hasCompletedAssessmentReport && !hasReturnedResults) {
      handleOpenClinicianShareModal();
      return;
    }

    handleDownloadClinicalReport();
  };

  const handleShareAssessmentPackage = (event: React.FormEvent) => {
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
    localStorage.setItem(`clinician-name-${currentChild.id}`, clinicianName.trim());
    localStorage.setItem(`clinician-practice-${currentChild.id}`, clinicianPractice.trim());
    localStorage.setItem(`clinician-email-${currentChild.id}`, clinicianEmail.trim());
    localStorage.setItem(`clinician-share-status-${currentChild.id}`, "shared");
    setClinicianName(clinicianName.trim());
    setClinicianPractice(clinicianPractice.trim());
    setClinicianEmail(clinicianEmail.trim());
    setClinicianSharePermission(false);
    setIsClinicianShareModalOpen(false);
  };

  const isDiagnostic = isDiagnosticPathway(currentChild);
  const isMvpNewChildAssessmentCard = isMvp && usesMvpNewChildSetup(currentChild);
  const showAssessmentPathwayCard = (usesAssessmentCard(currentChild) || isMvpNewChildAssessmentCard) && !usesAssessmentProgressCard(currentChild);
  const isDiagnosticActive = isDiagnostic;
  const isNavigatorActive = !isDiagnostic;
  const currentProfileKey = getChildProfileKey(currentChild);
  const showDiagnosticAssessmentPlaceholderCard =
    showDiagnosticAssessmentPlaceholder && (currentProfileKey === "Noah" || currentProfileKey === "Chloe");
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
  const hasCompletedAssessmentReport = isMvp && usesCompletedAssessmentReport(currentChild);
  const hideResultSection = isMvpNewChildAssessmentCard;
  
  const sessionStatus = getChildSessionStatus(currentChild);
  const isBooked = sessionStatus === "booked";
  const isCancelled = sessionStatus === "cancelled";

  const sessionDate = getSessionDate(currentChild, "long");
  const sessionTime = currentChild.intake?.sessionTime || "4:00 pm";

  const completedSections = currentChild.intake?.completedQuestionnaireSections || [];
  const questionnaireTotalSections = isMvp ? MVP_QUESTIONNAIRE_MODULES.length : 8;
  const completedSectionCount = Math.min(completedSections.length, questionnaireTotalSections);
  const answeredMvpQuestions = Object.values(MVP_WORKFLOW_QUESTIONS)
    .flat()
    .filter((question) => isAnswered(currentChild.intake?.questionnaireAnswers?.[question.id])).length;
  const answeredMvpQuestionCount = Math.min(answeredMvpQuestions, MVP_QUESTIONNAIRE_QUESTION_COUNT);
  const childPerspectiveQuestions = MVP_WORKFLOW_QUESTIONS[CHILD_PERSPECTIVE_MODULE_TITLE] ?? [];
  const childPerspectiveQuestionCount = childPerspectiveQuestions.length;
  const questionnaireAnswers = currentChild.intake?.questionnaireAnswers ?? {};
  const answeredChildPerspectiveQuestionCount = childPerspectiveQuestions.filter((question) =>
    isAnswered(questionnaireAnswers[question.id])
  ).length;
  const childPerspectiveModalQuestion = childPerspectiveQuestions.find((question) =>
    !isAnswered(questionnaireAnswers[question.id])
  ) ?? childPerspectiveQuestions[0];
  const childPerspectiveModalAnswer = childPerspectiveModalQuestion
    ? String(questionnaireAnswers[childPerspectiveModalQuestion.id] ?? "")
    : "";
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
  const childFiles = files.filter(f => f.childId === currentChild.id || f.childName === currentChild.name);
  const documentCount = childFiles.length;
  const isSeededTeacherComplete = isMvp && (hasCompletedAssessmentReport || currentProfileKey === "Chloe");
  const teacherChecklistState = getTeacherChecklistState({
    teacherStatus,
    teacherName,
    teacherEmail,
    isSeededComplete: isSeededTeacherComplete,
  });
  const isAssessmentComplete = hasCompletedAssessmentReport;
  const isReadyForClinicalReview = questionnaireProgress === 100 && teacherChecklistState.done && documentCount > 0;
  const isWaitingClinicalReview = currentProfileKey === "Chloe" && isReadyForClinicalReview;
  const isFollowUpComplete = isAssessmentComplete || isWaitingClinicalReview;
  const sharedDocumentCount = documentCount === 0 && isAssessmentComplete ? 3 : documentCount;
  const isPackagePreparationChecklistView = preparationChecklistView === "package";
  const assessmentOverallProgress = hasCompletedAssessmentReport
    ? 100
    : assessmentProgressCardData?.progress ?? (isReadyForClinicalReview ? 100 : questionnaireProgress);
  const canShareAssessmentPackage = !hasReturnedResults && (
    isAssessmentComplete ||
    isWaitingClinicalReview ||
    (currentProfileKey === "Chloe" && assessmentOverallProgress === 100)
  );
  const progressCircleActionLabel = hasReturnedResults
    ? "Download"
    : canShareAssessmentPackage
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

    if (canShareAssessmentPackage) {
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
                    ? `Complete the details needed to prepare ${currentChild.name}'s Assessment Package for your child's clinician, such as your GP, paediatrician or psychiatrist.`
                    : `Manage preparation, tracking, and clinical details for ${currentChild.name}'s assessment pathway.`}
                </SectionDescription>
              }
            />

            <HeroQuoteCard
              kicker="A clear result"
              quote={isMvp
                ? "We help families prepare an Assessment Package designed to support clinical conversations and referral decisions."
                : "A clinician reviews the information and explains whether ADHD looks likely, unlikely, or whether more information is needed - with clear next steps."}
              showQuotes={false}
              showDecoration={false}
              className="bg-white"
              rightNode={
                <HeroActionCard
                  icon={<Stethoscope className="w-[22px] h-[22px] stroke-[1.7]" />}
                  title="Assessment"
                  subtitle={diagnosticStarterSubtitle}
                  onClick={() => window.open(clinicalReportImg, '_blank')}
                />
              }
            />

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
                  icon={<CheckCircle2 className="w-[19px] h-[19px] stroke-[1.8]" />}
                  title={isMvp ? "Assessment Package" : "Clear next steps"}
                  description={isMvp ? "A clear summary of the clinical picture, supporting evidence, and referral context." : "Practical guidance for what to do next: at home, at school, and with your child's clinician."}
                  cornerClass="rounded-tl-[32px]"
                />
                <LockerItem
                  icon={<Stethoscope className="w-[19px] h-[19px] stroke-[1.8]" />}
                  title="Support for your child's clinician"
                  description="An Assessment Package designed to support clinical conversations and referral decisions."
                  cornerClass="rounded-tr-[32px]"
                />
                <LockerItem
                  icon={<GraduationCap className="w-[19px] h-[19px] stroke-[1.8]" />}
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
                <Card id="care-option-diagnostic" className="bg-[#E5F1EB] border border-black/5 rounded-2xl shadow-none w-full">
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
                            <span className="text-2xl sm:text-[1.85rem] font-normal text-[var(--color-thread-heading)] leading-none tracking-tight">$1,850</span>
                            <span className="text-[0.82rem] text-[var(--color-thread-gray)] ml-2.5 font-normal font-sans">One-off</span>
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
      onTeacherNameChange={setTeacherName}
      onTeacherEmailChange={setTeacherEmail}
      onTeacherMessageChange={setTeacherMessage}
      onTeacherContactPermissionChange={setTeacherContactPermission}
      onTeacherAssessmentPermissionChange={setTeacherAssessmentPermission}
      onOpenTeacherInvite={handleOpenTeacherInviteModal}
      onCloseTeacherInvite={handleCloseTeacherInviteModal}
      onSendTeacherInvite={handleSendTeacherInvite}
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
      onTeacherNameChange={setTeacherName}
      onTeacherEmailChange={setTeacherEmail}
      onTeacherMessageChange={setTeacherMessage}
      onTeacherContactPermissionChange={setTeacherContactPermission}
      onTeacherAssessmentPermissionChange={setTeacherAssessmentPermission}
      onOpenTeacherInvite={handleOpenTeacherInviteModal}
      onCloseTeacherInvite={handleCloseTeacherInviteModal}
      onSendTeacherInvite={handleSendTeacherInvite}
      onSimulateTeacherResponse={handleSimulateTeacherResponse}
      onResetTeacherStatus={handleResetTeacherStatus}
      layout="unboxed"
    />
  );
  const childPerspectiveChecklistContent = (
    <div className="max-w-[62ch] space-y-4 pt-1">
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        A child-friendly section captures your child&apos;s own view of focus, school, friendships, sleep, and daily routines so their voice sits alongside parent and clinical inputs.
      </p>
      <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} pt-2`}>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-sans">
          <span className="font-medium">Child Perspective</span>
          <span className="font-semibold">{childPerspectiveProgress}% Done</span>
        </div>
        <ProgressBar
          value={childPerspectiveProgress}
          heightClass="h-2"
          trackClassName="bg-white"
          className="mb-5 w-full"
        />
        <Button
          variant="secondary"
          onClick={() => setIsChildPerspectiveModalOpen(true)}
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
      title: "Clinical module",
      meta: isAssessmentComplete || questionnaireProgress === 100
        ? `All ${questionnaireTotalSections} developmental sections complete`
        : questionnaireCompletionMeta,
      metaTag: isAssessmentComplete || questionnaireProgress === 100 ? "Completed" : "In Progress",
      progress: isAssessmentComplete ? 100 : questionnaireProgress,
      image: pediatricianQuestionsImage,
      imageAlt: "Clinical module preparation",
      cornerClass: "rounded-tr-[32px]",
      description: (
        <div className="max-w-[62ch] space-y-4 pt-1">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            The module maps out primary developmental areas including focus, sleep, school transitions, and co-regulation patterns, helping your child&apos;s clinician prepare a rich diagnostic overview.
          </p>
          <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} pt-2`}>
            {!isPackagePreparationChecklistView && (
              <>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-sans">
                  <span className="font-medium">Questionnaire Progress</span>
                  <span className="font-semibold">{questionnaireProgress}% Done</span>
                </div>
                <ProgressBar
                  value={questionnaireProgress}
                  heightClass="h-2"
                  trackClassName="bg-white"
                  className="mb-5 w-full"
                />
              </>
            )}
            <Button
              variant="secondary"
              onClick={() => navigate("/questionnaire")}
              className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{questionnaireProgress === 100 ? "Review Answers" : "Continue Module"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ),
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
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl font-sans">
                  <FileText className="w-4 h-4 text-[var(--color-thread-mid-green)] shrink-0" />
                  <span className="font-medium truncate">{file.name}</span>
                  <span className="text-slate-400 text-[10px] ml-auto shrink-0">{file.date}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/documents")}
              className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{documentCount > 0 ? "Manage Documents Locker" : "Go to Documents Manager"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
                  ? `Complete the details needed to prepare ${currentChild.name}'s Assessment Package for your child's clinician, such as your GP, paediatrician or psychiatrist.`
                  : `Manage preparation, tracking, and clinical details for ${currentChild.name}'s assessment pathway.`}
              </SectionDescription>
            }
          />

          {/* TOP PANEL: BOOKING STATUS CARD */}
          <HeroQuoteCard
            kicker={isAssessmentComplete ? "Diagnostic Outcome" : isWaitingClinicalReview ? "Waiting clinical review" : "A clear result"}
            quote={isMvp 
              ? isAssessmentComplete
                ? hasReturnedResults
                  ? `${currentChild.name}'s Assessment Package has been sent back by the clinician. Results are available now.`
                  : `${currentChild.name}'s Assessment Package has been shared with your child's clinician, who is now preparing the clinical formulation.`
                : isWaitingClinicalReview
                ? `${currentChild.name}'s questionnaire, teacher input, and documents are complete. Share the package with your child's clinician so they can use it to support formulation.`
                : "We help families prepare an Assessment Package designed to support clinical conversations and referral decisions."
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
                />
              ) : (
                <HeroActionCard
                  icon={isAssessmentComplete
                    ? <FileText className="w-[22px] h-[22px] stroke-[1.7] text-[var(--color-thread-mid-green)]" />
                    : isWaitingClinicalReview
                    ? <Clock className="w-[22px] h-[22px] stroke-[1.7] text-[var(--color-thread-mid-green)]" />
                    : <Stethoscope className="w-[22px] h-[22px] stroke-[1.7]" />
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
                    ? "bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px] hover:bg-[var(--color-thread-light-green)]/90 cursor-pointer"
                    : isWaitingClinicalReview
                    ? "bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px] cursor-default"
                    : ""}
                  onClick={isWaitingClinicalReview ? undefined : handleClinicalOutcomeActionClick}
                />
              )
            }
          />

          {/* PREPARATION CHECKLIST SECTION */}
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

            {showDiagnosticAssessmentPlaceholderCard ? (
              <div
                data-testid="diagnostic-assessment-placeholder"
                className="mt-8 min-h-[260px] rounded-tr-[32px] bg-white p-8 flex items-center justify-center"
              >
                <span className="text-[0.86rem] font-medium text-slate-400">
                  Placeholder
                </span>
              </div>
            ) : preparationChecklistView === "changed" || isPackagePreparationChecklistView ? (
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
                          <div
                            className={cn(
                              "thread-questionnaire-module-progress relative h-11 w-11 rounded-full p-[3px]",
                              item.done && "thread-package-progress--complete"
                            )}
                            style={{ "--section-progress": `${item.progress}%` } as React.CSSProperties}
                            aria-label={`${item.progress}% complete`}
                          >
                            <div
                              className={cn(
                                "thread-package-progress-center",
                                item.done && "thread-package-progress-center--complete",
                                "flex h-full w-full items-center justify-center rounded-full text-[0.68rem] font-bold transition-colors",
                                item.done
                                  ? "bg-transparent text-[#128560]"
                                : item.active || item.metaTag === "In Progress" || item.metaTag === "Under Review"
                                  ? "bg-transparent text-[#128560]"
                                  : "bg-transparent text-slate-400",
                              )}
                            >
                              {item.done ? <Check className="w-4 h-4 stroke-[1.8]" /> : null}
                            </div>
                          </div>
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
                  title="Clinical module"
      meta={isAssessmentComplete || questionnaireProgress === 100
        ? `All ${questionnaireTotalSections} developmental sections complete`
        : questionnaireCompletionMeta}
                  metaTag={isAssessmentComplete || questionnaireProgress === 100 ? "Completed" : "In Progress"}
                  image={pediatricianQuestionsImage}
                  imageAlt="Clinical module preparation"
                  cornerClass="rounded-tr-[32px]"
                  description={
                    <div className="space-y-4 pt-1">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        The module maps out primary developmental areas including focus, sleep, school transitions, and co-regulation patterns, helping your child&apos;s clinician prepare a rich diagnostic overview.
                      </p>
                      <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} pt-2`}>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-sans">
                          <span className="font-medium">Questionnaire Progress</span>
                          <span className="font-semibold">{questionnaireProgress}% Done</span>
                        </div>
                        <ProgressBar
                          value={questionnaireProgress}
                          heightClass="h-2"
                          className="mb-5"
                        />
                        <Button
                          variant="secondary"
                          onClick={() => navigate("/questionnaire")}
                          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{questionnaireProgress === 100 ? "Review Answers" : "Continue Module"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  }
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
                            <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl font-sans">
                              <FileText className="w-4 h-4 text-[var(--color-thread-mid-green)] shrink-0" />
                              <span className="font-medium truncate">{file.name}</span>
                              <span className="text-slate-400 text-[10px] ml-auto shrink-0">{file.date}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          onClick={() => navigate("/documents")}
                          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{documentCount > 0 ? "Manage Documents Locker" : "Go to Documents Manager"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
                  title="Clinical module"
                  meta={isAssessmentComplete || questionnaireProgress === 100 
                    ? `All ${questionnaireTotalSections} developmental sections complete` 
                    : `${completedSectionCount} of ${questionnaireTotalSections} sections complete`}
                  metaTag={isAssessmentComplete || questionnaireProgress === 100 ? "Completed" : "In Progress"}
                  description={
                    <div className="space-y-4 pt-1">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        The module maps out primary developmental areas including focus, sleep, school transitions, and co-regulation patterns, helping your child&apos;s clinician prepare a rich diagnostic overview.
                      </p>
                      <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} pt-2`}>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-sans">
                          <span className="font-medium">Questionnaire Progress</span>
                          <span className="font-semibold">{questionnaireProgress}% Done</span>
                        </div>
                        <ProgressBar
                          value={questionnaireProgress}
                          heightClass="h-2"
                          trackClassName="bg-white"
                          className="mb-5"
                        />
                        <Button
                          variant="secondary"
                          onClick={() => navigate("/questionnaire")}
                          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{questionnaireProgress === 100 ? "Review Answers" : "Continue Module"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
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
                            <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl font-sans">
                              <FileText className="w-4 h-4 text-[var(--color-thread-mid-green)] shrink-0" />
                              <span className="font-medium truncate">{file.name}</span>
                              <span className="text-slate-400 text-[10px] ml-auto shrink-0">{file.date}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          onClick={() => navigate("/documents")}
                          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{documentCount > 0 ? "Manage Documents Locker" : "Go to Documents Manager"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
        </div>
      </PageContainer>
      <ModalShell
        isOpen={isChildPerspectiveModalOpen}
        titleId="child-perspective-question-title"
        size="small"
        panelClassName="relative p-6 sm:p-7"
      >
        <ModalCloseButton
          onClick={() => setIsChildPerspectiveModalOpen(false)}
          label="Close child perspective question"
        />
        <div className="space-y-5">
          <div>
            <span className={MODAL_KICKER_CLASS}>Child&apos;s own perspective</span>
            <h2 id="child-perspective-question-title" className={MODAL_TITLE_CLASS}>
              {childPerspectiveModalQuestion?.text ?? "Child perspective"}
            </h2>
            <p className={`${MODAL_BODY_CLASS} mt-3`}>
              Capture the answer directly here. It will be saved into the Clinical module and counted toward this section&apos;s progress.
            </p>
          </div>

          <label className="block">
            <span className={MODAL_FIELD_LABEL_CLASS}>Answer</span>
            <textarea
              value={childPerspectiveModalAnswer}
              onChange={(event) => handleChildPerspectiveAnswerChange(event.target.value)}
              placeholder="Type the child's words or a short supported answer..."
              rows={5}
              className="min-h-[140px] w-full resize-y rounded-none rounded-tr-[24px] border border-black/10 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none transition focus:border-[var(--color-thread-mid-green)] focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/15"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Button
              variant="secondary"
              onClick={() => {
                setIsChildPerspectiveModalOpen(false);
                navigate("/questionnaire");
              }}
              className={MODAL_SECONDARY_BUTTON_CLASS}
            >
              Open full module
            </Button>
            <Button
              onClick={() => setIsChildPerspectiveModalOpen(false)}
              className={MODAL_PRIMARY_BUTTON_CLASS}
            >
              Done
            </Button>
          </div>
        </div>
      </ModalShell>
      {isMvp && isAssessmentComplete && (
        <MvpClinicianShareModal
          clinicianName={clinicianName}
          clinicianPractice={clinicianPractice}
          clinicianEmail={clinicianEmail}
          sharePermission={clinicianSharePermission}
          shareError={clinicianShareError}
          isOpen={isClinicianShareModalOpen}
          onClinicianNameChange={setClinicianName}
          onClinicianPracticeChange={setClinicianPractice}
          onClinicianEmailChange={setClinicianEmail}
          onSharePermissionChange={setClinicianSharePermission}
          onClose={handleCloseClinicianShareModal}
          onDownload={handleDownloadClinicalReport}
          onShare={handleShareAssessmentPackage}
        />
      )}
    </motion.div>
  );
}
