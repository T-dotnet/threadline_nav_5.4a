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
  ShieldCheck,
  Stethoscope,
  Heart,
  ChevronRight,
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
  Check
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
import { ProgressBar } from "./ui/ProgressBar";
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
  isDiagnosticPathway,
  usesAssessmentCard,
  usesAssessmentProgressCard,
  usesCompletedAssessmentReport,
  usesMvpNewChildSetup,
  getChildSessionStatus,
  getSessionDate,
} from "../lib/childStatus";
import { DEFAULT_CLINICIAN_NAME, DEFAULT_CLINICIAN_SHORT_NAME } from "../lib/clinicalProvider";
import { MVP_WORKFLOW_QUESTIONS } from "../lib/familyJourneyQuestionBank";
import { isAnswered } from "../questionnaire";

import clinicalReportImg from "../assets/images/clinical_report_placeholder_1783000795444.jpg";
import pediatricianQuestionsImage from "../assets/images/optimized/abstract-pediatrician-questions-900.jpg";
import classroomSupportImage from "../assets/images/optimized/abstract-classroom-support-900.jpg";
import breathingRhythmImage from "../assets/images/optimized/abstract-breathing-coregulation-900.jpg";
import watercolorBgImage from "../assets/images/optimized/abstract-assessment-documents-900.jpg";

const MVP_QUESTIONNAIRE_MODULES = Object.keys(MVP_WORKFLOW_QUESTIONS);
const MVP_QUESTIONNAIRE_QUESTION_COUNT = Object.values(MVP_WORKFLOW_QUESTIONS).flat().length;
const CHECKLIST_DETAIL_WIDTH_CLASS = "w-full max-w-lg";

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

function buildCompletedAssessmentReport(childName: string) {
  const possessiveName = `${childName}'s`;

  return {
    title: `${possessiveName} assessment is complete.`,
    intro: `All preparatory steps and document uploads have been completed. ${DEFAULT_CLINICIAN_NAME} has finalized ${possessiveName} clinical formulation and diagnostic report.`,
    quote: `${possessiveName} clinical formulation and diagnostic report are finalized, ready for review, and can be shared with your GP.`,
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

interface PreparationChecklistCardProps {
  title: string;
  meta: string;
  metaTag: string;
  description: React.ReactNode;
  image: string;
  imageAlt: string;
  cornerClass?: string;
  done?: boolean;
  active?: boolean;
  todo?: boolean;
}

function PreparationChecklistCard({
  title,
  meta,
  metaTag,
  description,
  image,
  imageAlt,
  cornerClass = "rounded-tr-[32px]",
  done = false,
  active = false,
  todo = false,
}: PreparationChecklistCardProps) {
  const statusClass = done
    ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]"
    : active
    ? "bg-[var(--color-thread-cream)] text-[var(--color-thread-heading)]"
    : "bg-slate-100 text-slate-500";

  return (
    <Card className={`grid grid-cols-[minmax(0,1fr)_220px] rounded-none ${cornerClass} bg-white p-0 shadow-none max-md:grid-cols-1`}>
      <div className="p-6 sm:p-7">
        <div className="mb-4 flex items-start gap-4">
          <div
            className={[
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              done
                ? "bg-[var(--color-thread-mid-green)] text-white"
                : active
                ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]"
                : todo
                ? "bg-slate-100 text-slate-400"
                : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            {done ? (
              <Check className="h-4 w-4 stroke-[3]" />
            ) : active ? (
              <Clock className="h-4 w-4 stroke-[2]" />
            ) : (
              <AlertCircle className="h-4 w-4 stroke-[2]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-sans text-[1.06rem] font-medium leading-snug text-slate-950">
                {title}
              </h3>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.12em] ${statusClass}`}>
                {metaTag}
              </span>
            </div>
            <p className="mt-1 text-[0.78rem] leading-relaxed text-slate-500">
              {meta}
            </p>
          </div>
        </div>

        <div className="pl-0 md:pl-[52px]">
          {description}
        </div>
      </div>

      <div className="relative min-h-[180px] overflow-hidden bg-white max-md:order-first md:h-full">
        <div className="absolute inset-x-0 bottom-0 top-8 overflow-hidden rounded-tl-[28px] bg-slate-100">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </Card>
  );
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
    meta: "Share questionnaire link with homeroom teacher",
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
  primaryTeacher?: TeacherContact;
  isSeededComplete: boolean;
  isInviteModalOpen: boolean;
  onTeacherNameChange: (value: string) => void;
  onTeacherEmailChange: (value: string) => void;
  onTeacherMessageChange: (value: string) => void;
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
  primaryTeacher,
  isSeededComplete,
  isInviteModalOpen,
  onTeacherNameChange,
  onTeacherEmailChange,
  onTeacherMessageChange,
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
            variant="mint"
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
              variant="mint"
              onClick={onSimulateTeacherResponse}
              className="text-xs h-9 px-4 font-semibold rounded-full cursor-pointer"
            >
              Simulate Teacher Response (Mark Done)
            </Button>
            <Button
              variant="slate"
              onClick={onResetTeacherStatus}
              className="text-xs h-9 px-4 font-semibold rounded-full border-black/10 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
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
              <span className="text-[0.68rem] tracking-[0.18em] uppercase font-medium text-[var(--color-thread-mid-green)]">
                Teacher questionnaire
              </span>
              <h2
                id="teacher-invite-modal-title"
                className="mt-2 font-serif font-normal text-[1.75rem] sm:text-[2rem] leading-[1.08] tracking-tight text-[var(--color-thread-heading)]"
              >
                Send questionnaire invitation.
              </h2>
            </div>
            <ModalCloseButton
              onClick={onCloseTeacherInvite}
              label="Close teacher invitation modal"
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8">
            <p className="text-sm text-slate-600 leading-relaxed">
              The teacher will receive a secure link for {childName}&apos;s school-focused observer form.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="teacher-invite-name">
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
                <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="teacher-invite-email">
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
              <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="teacher-invite-message">
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
                  variant="slate"
                  onClick={onCloseTeacherInvite}
                  className="text-xs h-9 px-4 font-semibold rounded-full border-black/10 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="mint"
                  className="text-xs h-9 px-4 font-semibold rounded-full cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Send invitation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

export default function AssessmentPage() {
  const { currentChild } = useCurrentChild();
  const { isMvp, preparationChecklistView } = useDisplayMode();
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
  const [isTeacherInviteModalOpen, setIsTeacherInviteModalOpen] = React.useState(false);

  const handleOpenTeacherInviteModal = () => {
    setTeacherInviteError("");
    setIsTeacherInviteModalOpen(true);
  };

  const handleCloseTeacherInviteModal = () => {
    setTeacherInviteError("");
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
  };

  const isDiagnostic = isDiagnosticPathway(currentChild);
  const isMvpNewChildAssessmentCard = isMvp && usesMvpNewChildSetup(currentChild);
  const showAssessmentPathwayCard = (usesAssessmentCard(currentChild) || isMvpNewChildAssessmentCard) && !usesAssessmentProgressCard(currentChild);
  const isDiagnosticActive = isDiagnostic;
  const isNavigatorActive = !isDiagnostic;
  const currentProfileKey = getChildProfileKey(currentChild);
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
  const questionnaireProgress = hasCompletedAssessmentReport
    ? 100
    : isMvp && answeredMvpQuestions > 0
    ? Math.min(100, Math.round((answeredMvpQuestionCount / MVP_QUESTIONNAIRE_QUESTION_COUNT) * 100))
    : Math.min(100, Math.round((completedSectionCount / questionnaireTotalSections) * 100));
  const questionnaireCompletionMeta = questionnaireProgress === 100
    ? `All ${questionnaireTotalSections} developmental sections complete`
    : `${completedSectionCount} of ${questionnaireTotalSections} sections complete`;

  const handleBookClick = () => {
    navigate('/setup?step=5&directSession=1');
  };

  const steps = [
    {
      num: "01",
      title: "Clinical Registration",
      desc: "Profile registered on the Diagnostic Assessment pathway, securing clinical slots.",
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
    const completedReport = buildCompletedAssessmentReport(currentChild.name);

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
              kicker="Diagnostic Assessment"
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
                  onClick={() => window.open(clinicalReportImg, '_blank')}
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
              kicker="Diagnostic Assessment"
              title={`${currentChild.name}'s assessment.`}
              description={
                <SectionDescription>
                  {isMvp
                    ? `Complete the details needed to prepare ${currentChild.name}'s structured report for GP and referral conversations.`
                    : `Manage preparation, tracking, and clinical details for ${currentChild.name}'s assessment pathway.`}
                </SectionDescription>
              }
            />

            <HeroQuoteCard
              kicker="A clear result"
              quote={isMvp
                ? "We prepare a structured report designed to support clinical conversations and referral decisions."
                : "A clinician reviews the information and explains whether ADHD looks likely, unlikely, or whether more information is needed - with clear next steps."}
              showQuotes={false}
              className="bg-white"
              rightNode={
                <HeroActionCard
                  icon={<Stethoscope className="w-[22px] h-[22px] stroke-[1.7]" />}
                  title="Clinical outcome"
                  subtitle="Download sample"
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
                    meta={isMvp ? "Report-ready evidence for GP and referral decisions" : "Clear pathways for school support and treatment options"}
                    content={isMvp
                      ? "If the clinical formulation determines ADHD is likely, the report organises the evidence in plain language so it can support GP conversations, referral decisions, and school communication."
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
                  ? "Your Threadline report is written in plain language and designed to support GP conversations, referral decisions, and shared clinical understanding."
                  : "Your Threadline report is written in plain language and designed to guide your next step - not just label your child."}
              </SectionDescription>

              <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 pt-6 font-sans">
                <LockerItem
                  icon={<CheckCircle2 className="w-[19px] h-[19px] stroke-[1.8]" />}
                  title={isMvp ? "Structured report" : "Clear next steps"}
                  description={isMvp ? "A clear summary of the clinical picture, supporting evidence, and referral context." : "Practical guidance for what to do next: at home, at school, and with your GP."}
                  cornerClass="rounded-tl-[32px]"
                />
                <LockerItem
                  icon={<Stethoscope className="w-[19px] h-[19px] stroke-[1.8]" />}
                  title="Support for your GP"
                  description="A structured report designed to support clinical conversations and referral decisions."
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
                {/* Left Card: Diagnostic Assessment */}
                <Card id="care-option-diagnostic" className="bg-white border border-black/5 rounded-2xl shadow-none w-full">
                  <div className="p-6 sm:p-7.5">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">
                      {/* Left Column: Description */}
                      <div className="flex-1 space-y-4">
                        <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)]">
                          {isMvp
                            ? "A structured assessment report designed to organise the clinical picture for GP conversations and referral decisions."
                            : "A comprehensive assessment to understand your child&apos;s strengths and challenges, and whether a neurodevelopmental condition may explain what you&apos;re seeing."}
                        </p>
                      </div>

                      {/* Right Column: Points */}
                      <div className="flex-1 border-t md:border-t-0 md:border-l border-black/5 pt-6 md:pt-0 md:pl-10">
                        <ul className="space-y-2.5 pt-1">
                          {(isMvp
                            ? [
                                'Structured clinical report',
                                'Evidence summary for GP conversations',
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
                            <span>{isMvp ? "Current assessment" : "Current plan"}</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline font-serif">
                            <span className="text-2xl sm:text-[1.85rem] font-normal text-[var(--color-thread-heading)] leading-none tracking-tight">$1,850</span>
                            <span className="text-[0.82rem] text-[var(--color-thread-gray)] ml-2.5 font-normal font-sans">One-off</span>
                          </div>
                          <Button id="learn-more-diagnostic" variant="forest" className="px-8 min-h-[48px] text-[1rem]" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                            Get started
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
      </motion.div>
    );
  }

  const childFiles = files.filter(f => f.childId === currentChild.id || f.childName === currentChild.name);
  const documentCount = childFiles.length;
  const isSeededTeacherComplete = isMvp && (hasCompletedAssessmentReport || currentProfileKey === "Chloe");
  const teacherChecklistState = getTeacherChecklistState({
    teacherStatus,
    teacherName,
    teacherEmail,
    isSeededComplete: isSeededTeacherComplete,
  });
  const teacherChecklistContent = (
    <TeacherQuestionnaireChecklistContent
      childName={currentChild.name}
      teacherStatus={teacherStatus}
      teacherName={teacherName}
      teacherEmail={teacherEmail}
      teacherMessage={teacherMessage}
      teacherInviteError={teacherInviteError}
      primaryTeacher={primaryTeacher}
      isSeededComplete={isSeededTeacherComplete}
      isInviteModalOpen={isTeacherInviteModalOpen}
      onTeacherNameChange={setTeacherName}
      onTeacherEmailChange={setTeacherEmail}
      onTeacherMessageChange={setTeacherMessage}
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
      primaryTeacher={primaryTeacher}
      isSeededComplete={isSeededTeacherComplete}
      isInviteModalOpen={isTeacherInviteModalOpen}
      onTeacherNameChange={setTeacherName}
      onTeacherEmailChange={setTeacherEmail}
      onTeacherMessageChange={setTeacherMessage}
      onOpenTeacherInvite={handleOpenTeacherInviteModal}
      onCloseTeacherInvite={handleCloseTeacherInviteModal}
      onSendTeacherInvite={handleSendTeacherInvite}
      onSimulateTeacherResponse={handleSimulateTeacherResponse}
      onResetTeacherStatus={handleResetTeacherStatus}
      layout="unboxed"
    />
  );
  const isAssessmentComplete = hasCompletedAssessmentReport;
  const isReadyForClinicalReview = questionnaireProgress === 100 && teacherChecklistState.done && documentCount > 0;
  const isWaitingClinicalReview = currentProfileKey === "Chloe" && isReadyForClinicalReview;
  const isFollowUpComplete = isAssessmentComplete || isWaitingClinicalReview;
  const sharedDocumentCount = documentCount === 0 && isAssessmentComplete ? 3 : documentCount;
  const preparationChecklistItems = [
    {
      id: "questionnaire",
      done: isAssessmentComplete || questionnaireProgress === 100,
      active: !isAssessmentComplete && questionnaireProgress > 0 && questionnaireProgress < 100,
      todo: !isAssessmentComplete && questionnaireProgress === 0,
      title: "Clinical Questionnaire",
      meta: isAssessmentComplete || questionnaireProgress === 100
        ? `All ${questionnaireTotalSections} developmental sections complete`
        : questionnaireCompletionMeta,
      metaTag: isAssessmentComplete || questionnaireProgress === 100 ? "Completed" : "In Progress",
      image: pediatricianQuestionsImage,
      imageAlt: "Clinical questionnaire preparation",
      cornerClass: "rounded-tr-[32px]",
      description: (
        <div className="max-w-[62ch] space-y-4 pt-1">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            The questionnaire maps out primary developmental areas including focus, sleep, school transitions, and co-regulation patterns, allowing {DEFAULT_CLINICIAN_SHORT_NAME} to compile a rich diagnostic overview.
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
              className="mb-5 w-full"
            />
            <Button
              variant="mint"
              onClick={() => navigate("/questionnaire")}
              className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{questionnaireProgress === 100 ? "Review Answers" : "Continue Questionnaire"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "teacher-questionnaire",
      done: teacherChecklistState.done,
      active: teacherChecklistState.active,
      todo: teacherChecklistState.todo,
      title: "Ask teacher to complete questionnaire",
      meta: teacherChecklistState.meta,
      metaTag: teacherChecklistState.metaTag,
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
      title: "Document Upload",
      meta: isAssessmentComplete || documentCount > 0
        ? `${sharedDocumentCount} file${sharedDocumentCount > 1 ? "s" : ""} shared in secure locker`
        : "Upload supporting school or medical letters",
      metaTag: isAssessmentComplete ? "Completed" : documentCount > 0 ? "Shared" : "Pending",
      image: watercolorBgImage,
      imageAlt: "Supporting assessment documents",
      cornerClass: "rounded-br-[32px]",
      description: (
        <div className="max-w-[62ch] space-y-4 pt-1">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Sharing previous reports, GP letters, school term summaries, or occupational therapy feedback helps compile a holistic co-regulation picture. Every document is protected with AES-256 end-to-end encryption in your secure Locker.
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
              variant="mint"
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
      title: "Follow-up Questions & Gaps",
      meta: isFollowUpComplete || isReadyForClinicalReview
        ? "Clinician is reviewing submitted inputs"
        : "Unlocks after questionnaire and documents are submitted",
      metaTag: isFollowUpComplete ? "Completed" : isReadyForClinicalReview ? "Under Review" : "As Needed",
      image: breathingRhythmImage,
      imageAlt: "Clinical follow-up review",
      cornerClass: "rounded-bl-[32px]",
      description: (
        <div className="max-w-[62ch] space-y-4 pt-1 font-sans">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            After your questionnaire responses and uploaded documents are received, our clinical team reviews everything to prepare the assessment. If any developmental details are missing or need clarification, we will reach out with targeted follow-up questions to fill any diagnostic gaps.
          </p>

          {isReadyForClinicalReview ? (
            <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} bg-slate-50 border-0 p-4 rounded-xl shadow-none ring-0 space-y-2 text-xs text-slate-600`}>
              <div className="flex items-center gap-2 text-[var(--color-thread-mid-green)] font-semibold mb-1">
                <Clock className="w-4 h-4" />
                <span>Clinical Review in Progress</span>
              </div>
              <p className="leading-relaxed">
                No action is required from you right now. The clinician is currently cross-referencing your questionnaire responses, school documents, and teacher observations. We will notify you if any clarifying questions are needed.
              </p>
            </div>
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
            kicker="Diagnostic Assessment"
            title={isAssessmentComplete ? `${currentChild.name}'s assessment is ready.` : `${currentChild.name}'s assessment.`}
            description={
              <SectionDescription>
                {isMvp
                  ? `Complete the details needed to prepare ${currentChild.name}'s structured report for GP and referral conversations.`
                  : `Manage preparation, tracking, and clinical details for ${currentChild.name}'s assessment pathway.`}
              </SectionDescription>
            }
          />

          {/* TOP PANEL: BOOKING STATUS CARD */}
          <HeroQuoteCard
            kicker={isAssessmentComplete ? "Diagnostic Outcome" : isWaitingClinicalReview ? "Waiting clinical review" : "A clear result"}
            quote={isMvp 
              ? isAssessmentComplete
                ? `${currentChild.name}'s clinical formulation and diagnostic report are finalized, ready for review, and can be shared with your GP.`
                : isWaitingClinicalReview
                ? `${currentChild.name}'s questionnaire, teacher input, and documents are complete. The clinical reviewer is now preparing the formulation.`
                : "We prepare a structured report designed to support clinical conversations and referral decisions."
              : "A clinician reviews the information and explains whether ADHD looks likely, unlikely, or whether more information is needed - with clear next steps."}
            showQuotes={false}
            rightNode={
              <HeroActionCard
                icon={isAssessmentComplete
                  ? <FileText className="w-[22px] h-[22px] stroke-[1.7] text-[var(--color-thread-mid-green)]" />
                  : isWaitingClinicalReview
                  ? <Clock className="w-[22px] h-[22px] stroke-[1.7] text-[var(--color-thread-mid-green)]" />
                  : <Stethoscope className="w-[22px] h-[22px] stroke-[1.7]" />
                }
                title={isAssessmentComplete ? "Download Report" : isWaitingClinicalReview ? "Clinical review" : "Clinical outcome"}
                subtitle={isAssessmentComplete ? "PDF · 4.2 MB" : isWaitingClinicalReview ? "Waiting review" : "Download sample"}
                className={isAssessmentComplete
                  ? "bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px] hover:bg-[var(--color-thread-light-green)]/90 cursor-pointer"
                  : isWaitingClinicalReview
                  ? "bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px] cursor-default"
                  : ""}
                onClick={isWaitingClinicalReview ? undefined : () => window.open(clinicalReportImg, '_blank')}
              />
            }
          />

          {/* PREPARATION CHECKLIST SECTION */}
          <div className="space-y-6">
            <div>
              <SectionLabel>Preparation Checklist</SectionLabel>
              <SectionTitle>Prepare for {currentChild.name}&apos;s assessment</SectionTitle>
              <SectionDescription>
                Completing these key developmental milestones provides {DEFAULT_CLINICIAN_SHORT_NAME} with the rich context needed to construct {currentChild.name}'s clinical formulation.
              </SectionDescription>
            </div>

            {preparationChecklistView === "changed" ? (
              <div className="mt-8 border-y border-black/10">
                {preparationChecklistItems.map((item) => (
                  <AreaItem
                    key={item.id}
                    title={item.title}
                    impact={item.meta}
                    status={item.metaTag}
                    icon={
                      item.done ? (
                        <Check className="w-3 h-3 stroke-[2.4]" />
                      ) : item.active ? (
                        <Clock className="w-3 h-3 stroke-[2.4]" />
                      ) : (
                        <AlertCircle className="w-3 h-3 stroke-[2.4]" />
                      )
                    }
                    description={item.rowDescription ?? item.description}
                  />
                ))}
              </div>
            ) : preparationChecklistView === "cards" ? (
              <div className="mt-8 grid gap-6">
                <PreparationChecklistCard
                  done={isAssessmentComplete || questionnaireProgress === 100}
                  active={!isAssessmentComplete && questionnaireProgress > 0 && questionnaireProgress < 100}
                  todo={!isAssessmentComplete && questionnaireProgress === 0}
                  title="Clinical Questionnaire"
      meta={isAssessmentComplete || questionnaireProgress === 100
        ? `All ${questionnaireTotalSections} developmental sections complete`
        : questionnaireCompletionMeta}
                  metaTag={isAssessmentComplete || questionnaireProgress === 100 ? "Completed" : "In Progress"}
                  image={pediatricianQuestionsImage}
                  imageAlt="Clinical questionnaire preparation"
                  cornerClass="rounded-tr-[32px]"
                  description={
                    <div className="space-y-4 pt-1">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        The questionnaire maps out primary developmental areas including focus, sleep, school transitions, and co-regulation patterns, allowing {DEFAULT_CLINICIAN_SHORT_NAME} to compile a rich diagnostic overview.
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
                          variant="mint"
                          onClick={() => navigate("/questionnaire")}
                          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{questionnaireProgress === 100 ? "Review Answers" : "Continue Questionnaire"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  }
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
                  title="Document Upload"
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
                        Sharing previous reports, GP letters, school term summaries, or occupational therapy feedback helps compile a holistic co-regulation picture. Every document is protected with AES-256 end-to-end encryption in your secure Locker.
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
                          variant="mint"
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
                  title="Follow-up Questions & Gaps"
                  meta={isFollowUpComplete || isReadyForClinicalReview
                    ? "Clinician is reviewing submitted inputs"
                    : "Unlocks after questionnaire and documents are submitted"}
                  metaTag={isFollowUpComplete ? "Completed" : isReadyForClinicalReview ? "Under Review" : "As Needed"}
                  image={breathingRhythmImage}
                  imageAlt="Clinical follow-up review"
                  cornerClass="rounded-bl-[32px]"
                  description={
                    <div className="max-w-[62ch] space-y-4 pt-1 font-sans">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        After your questionnaire responses and uploaded documents are received, our clinical team reviews everything to prepare the assessment. If any developmental details are missing or need clarification, we will reach out with targeted follow-up questions to fill any diagnostic gaps.
                      </p>

                      {isReadyForClinicalReview ? (
                        <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} bg-slate-50 border-0 p-4 rounded-xl shadow-none ring-0 space-y-2 text-xs text-slate-600`}>
                          <div className="flex items-center gap-2 text-[var(--color-thread-mid-green)] font-semibold mb-1">
                            <Clock className="w-4 h-4" />
                            <span>Clinical Review in Progress</span>
                          </div>
                          <p className="leading-relaxed">
                            No action is required from you right now. The clinician is currently cross-referencing your questionnaire responses, school documents, and teacher observations. We will notify you if any clarifying questions are needed.
                          </p>
                        </div>
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
                  title="Clinical Questionnaire"
                  meta={isAssessmentComplete || questionnaireProgress === 100 
                    ? `All ${questionnaireTotalSections} developmental sections complete` 
                    : `${completedSectionCount} of ${questionnaireTotalSections} sections complete`}
                  metaTag={isAssessmentComplete || questionnaireProgress === 100 ? "Completed" : "In Progress"}
                  description={
                    <div className="space-y-4 pt-1">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        The questionnaire maps out primary developmental areas including focus, sleep, school transitions, and co-regulation patterns, allowing {DEFAULT_CLINICIAN_SHORT_NAME} to compile a rich diagnostic overview.
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
                          variant="mint"
                          onClick={() => navigate("/questionnaire")}
                          className="text-xs h-9 px-4 font-semibold rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{questionnaireProgress === 100 ? "Review Answers" : "Continue Questionnaire"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  }
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
                  title="Document Upload"
                  meta={isAssessmentComplete || documentCount > 0 
                    ? `${documentCount === 0 && isAssessmentComplete ? 3 : documentCount} file${(documentCount === 0 && isAssessmentComplete) || documentCount > 1 ? 's' : ''} shared in secure locker` 
                    : "Upload supporting school or medical letters"}
                  metaTag={isAssessmentComplete ? "Completed" : (documentCount > 0 ? "Shared" : "Pending")}
                  description={
                    <div className="max-w-[62ch] space-y-4 pt-1">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        Sharing previous reports, GP letters, school term summaries, or occupational therapy feedback helps compile a holistic co-regulation picture. Every document is protected with AES-256 end-to-end encryption in your secure Locker.
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
                          variant="mint"
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
                  title="Follow-up Questions & Gaps"
                  meta={isFollowUpComplete || isReadyForClinicalReview
                    ? "Clinician is reviewing submitted inputs" 
                    : "Unlocks after questionnaire and documents are submitted"}
                  metaTag={isFollowUpComplete ? "Completed" : isReadyForClinicalReview ? "Under Review" : "As Needed"}
                  description={
                    <div className="max-w-[62ch] space-y-4 pt-1 font-sans">
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">
                        After your questionnaire responses and uploaded documents are received, our clinical team reviews everything to prepare the assessment. If any developmental details are missing or need clarification, we will reach out with targeted follow-up questions to fill any diagnostic gaps.
                      </p>
                      
                      {isReadyForClinicalReview ? (
                        <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} bg-slate-50 border-0 p-4 rounded-xl shadow-none ring-0 space-y-2 text-xs text-slate-600`}>
                          <div className="flex items-center gap-2 text-[var(--color-thread-mid-green)] font-semibold mb-1">
                            <Clock className="w-4 h-4" />
                            <span>Clinical Review in Progress</span>
                          </div>
                          <p className="leading-relaxed">
                            No action is required from you right now. The clinician is currently cross-referencing your questionnaire responses, school documents, and teacher observations. We will notify you if any clarifying questions are needed.
                          </p>
                        </div>
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
    </motion.div>
  );
}
