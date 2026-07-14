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
  Check,
  LockKeyhole,
  Save,
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
import { PreparationChecklistCard } from "./ui/PreparationChecklistCard";
import { ActionLink } from "./ui/ActionLink";
import { ListItemCard } from "./ui/ListItemCard";
import { TimelineItem } from "./ui/TimelineItem";
import { LockerItem } from "./ui/LockerItem";
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
import {
  DIAGNOSTIC_ASSESSMENT_PRICE,
  formatAssessmentPackagePrice,
} from "../lib/assessmentCheckout";
import { CLINICIAN_SHARE_DEFAULTS } from "../lib/clinicianSharing";
import { DEFAULT_SESSION_TIME } from "../lib/sessionDefaults";
import { isAnswered } from "../questionnaire";
import { cn } from "../lib/utils";
import {
  getTeacherChecklistState,
  TeacherQuestionnaireChecklistContent,
  type TeacherChecklistStatus,
} from "./assessment/TeacherQuestionnaireWorkflow";
import { MvpClinicianShareModal } from "./assessment/MvpClinicianShareModal";
import { MvpDiagnosticCheckoutModal } from "./assessment/MvpDiagnosticCheckoutModal";
import { QuestionnaireModuleModalFrame } from "./assessment/QuestionnaireModuleModalFrame";
import {
  DocumentUploadWorkflow,
  RemoveSharedDocumentModal,
  type DocumentUploadResult,
} from "./assessment/DocumentUploadWorkflow";
import {
  CLINICAL_MODULE_QUESTION_COUNT as MVP_QUESTIONNAIRE_QUESTION_COUNT,
  CLINICAL_MODULE_SECTIONS as MVP_QUESTIONNAIRE_MODULES,
  ClinicalModulesChecklistContent,
  ClinicalModulesWorkflow,
  getClinicalModuleModalTarget,
} from "./assessment/ClinicalModulesWorkflow";

import clinicalReportImg from "../assets/images/clinical_report_placeholder_1783000795444.jpg";
import pediatricianQuestionsImage from "../assets/images/optimized/abstract-pediatrician-questions-900.jpg";
import classroomSupportImage from "../assets/images/optimized/abstract-classroom-support-900.jpg";
import breathingRhythmImage from "../assets/images/optimized/abstract-breathing-coregulation-900.jpg";
import watercolorBgImage from "../assets/images/optimized/abstract-assessment-documents-900.jpg";

const OPEN_CLINICAL_MODULES_REQUEST_KEY = "threadline-open-clinical-modules-request";
const OPEN_CLINICIAN_SHARE_REQUEST_KEY = "threadline-open-clinician-share-request";
const SEEDED_MOCK_PROFILE_IDS = new Set([
  "child-tom",
  "child-ava",
  "child-leo",
  "child-isla",
  "child-chloe",
  "child-noah",
  "child-maya",
  "child-liam",
  "child-ruby",
]);
const MVP_ONBOARDING_QUESTION_COUNT = 6;
const MVP_TOTAL_QUESTION_COUNT = MVP_ONBOARDING_QUESTION_COUNT + MVP_QUESTIONNAIRE_QUESTION_COUNT;
const CHECKLIST_DETAIL_WIDTH_CLASS = "w-full max-w-lg";
const ASSESSMENT_PACKAGE_HELP_CENTRE_ARTICLES = [
  "See the Assessment Package and how to read it",
  "Evidence used in Assessment Package",
  "File ownership. Manage files access using Doc locker",
] as const;
const MODAL_KICKER_CLASS = "text-xs tracking-[0.14em] uppercase font-medium text-[var(--color-thread-mid-green)]";
const MODAL_TITLE_CLASS = "thread-optional-sans-heading mt-2 font-serif text-2xl sm:text-3xl leading-tight tracking-tight text-[var(--color-thread-heading)]";
const MODAL_BODY_CLASS = "text-sm text-slate-600 leading-relaxed";
const MODAL_FIELD_LABEL_CLASS = "block text-xs font-medium text-slate-600 mb-1.5";
const MODAL_SECONDARY_BUTTON_CLASS = "text-xs h-9 px-4 font-medium rounded-full border-black/10 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer";
const MODAL_PRIMARY_BUTTON_CLASS = "text-xs h-9 px-4 font-medium rounded-full cursor-pointer";
const ASSESSMENT_READY_ICON_CLASS = "w-[22px] h-[22px] stroke-[1.7] text-[var(--color-thread-ready-green)]";

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

const CHILD_PERSPECTIVE_STEP_TITLES: Record<string, string> = {
  "What is hardest for you?": "Hardest part",
  "What helps you when things are hard?": "What helps",
  "What do grown ups get wrong about you?": "Misunderstood",
  "What are you good at?": "Strengths",
  "What kind of support would you like?": "Support wanted",
};

const getChildPerspectiveStepTitle = (questionText: string, index: number) =>
  CHILD_PERSPECTIVE_STEP_TITLES[questionText] ?? `Question ${index + 1}`;

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
          className="h-9 min-h-0 px-5 text-sm font-medium"
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
  isShared,
  showStatusTitle,
  helpCentreArticles,
  onShare,
  onUploadAssessment,
  onOpenResources,
  onBackToModules,
}: {
  isShared: boolean;
  showStatusTitle: boolean;
  helpCentreArticles: readonly string[];
  onShare: () => void;
  onUploadAssessment: () => void;
  onOpenResources: () => void;
  onBackToModules: () => void;
}) {
  return (
    <div
      data-testid="diagnostic-assessment-ready-panel"
      className="mt-8 pb-10 sm:pb-12"
    >
      <div className="grid gap-8 rounded-none rounded-tr-[32px] bg-white px-6 py-8 shadow-none sm:px-8 sm:py-10 lg:grid-cols-[minmax(220px,280px)_1px_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <PageIcon
            variant="white"
            icon={<Check className="h-[22px] w-[22px] stroke-[2]" />}
            className="mb-4 bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] shadow-none"
          />

          <h3 className="thread-optional-sans-heading font-serif text-[1.75rem] leading-tight tracking-tight text-[var(--color-thread-heading)]">
            {showStatusTitle
              ? isShared
                ? "Assessment has been shared"
                : "Assessment ready to share"
              : "All set"}
          </h3>

          <div className="mt-6 flex flex-col items-center gap-3 lg:items-start">
            <Button
              variant="forest"
              onClick={isShared ? onUploadAssessment : onShare}
              rightIcon={isShared ? <Upload className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              className="h-10 px-5 text-xs font-medium"
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

        <div className="hidden h-full w-px bg-black/10 lg:block" />

        <div className="min-w-0 text-left">
          <SectionLabel>From Help Centre</SectionLabel>
          <h4 className="thread-optional-sans-heading mt-2 font-serif text-[1.28rem] leading-tight tracking-tight text-[var(--color-thread-heading)]">
            Three guides to help you understand the Assessment Package and your files.
          </h4>

          <div className="mt-5 space-y-2">
            {helpCentreArticles.map((articleTitle) => (
              <ListItemCard
                key={articleTitle}
                onClick={onOpenResources}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenResources();
                  }
                }}
                role="button"
                tabIndex={0}
                className="bg-[var(--color-thread-off-white)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/30"
              >
                {articleTitle}
              </ListItemCard>
            ))}
          </div>
          <ActionLink
            variant="forest"
            as="button"
            onClick={onOpenResources}
            className="mt-5 text-sm"
          >
            Open Help Centre
          </ActionLink>
        </div>
      </div>
    </div>
  );
}

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
      <p className="text-base text-[var(--color-thread-gray)] leading-relaxed font-sans">
        {summary}
      </p>
      <div className="bg-white p-5 rounded-none rounded-tr-[32px] text-sm space-y-4 font-sans text-slate-700">
        {evidence.map((item) => {
          const Icon = iconByType[item.type];
          return (
            <div key={item.label} className="flex gap-3">
              <Icon
                className={[
                  "w-4 h-4 shrink-0 mt-0.5",
                  item.type === "recommendation" ? "text-[var(--color-thread-mid-green)]" : "text-[var(--color-thread-muted-text)]",
                ].join(" ")}
              />
              <div>
                <span className="font-medium text-slate-900 block mb-0.5">{item.label}</span>
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

export default function AssessmentPage() {
  const { currentChild, updateChild } = useCurrentChild();
  const {
    isMvp,
    preparationChecklistView,
    hideAssessmentHeroCard,
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

  const handleOpenDocumentUploadModal = () => {
    setIsDocumentUploadModalOpen(true);
  };

  const handleCloseDocumentUploadModal = () => {
    setIsDocumentUploadModalOpen(false);
  };

  const handleSaveDocumentToLocker = ({ file: _file, ...document }: DocumentUploadResult) => {
    // The frontend keeps the selected File available at this boundary for the backend upload adapter.
    void _file;
    addFile({
      ...document,
      uploadedBy: "you",
      shared: false,
      icon: FileText,
      childName: currentChild.name,
      childId: currentChild.id,
    });
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
  const usesTomLikeNewChildAssessment = usesMvpNewChildSetup(currentChild);
  const isMvpNewChildAssessmentCard = isMvp && usesTomLikeNewChildAssessment;
  const showAssessmentPathwayCard = (usesAssessmentCard(currentChild) || isMvpNewChildAssessmentCard) && !usesAssessmentProgressCard(currentChild);
  const isDiagnosticActive = isDiagnostic;
  const isNavigatorActive = !isDiagnostic;
  const currentProfileKey = getChildProfileKey(currentChild);
  const shouldHideAssessmentHeroCard = isMvpNewChildAssessmentCard || (
    hideAssessmentHeroCard
    && currentProfileKey !== "Tom"
    && !usesTomLikeNewChildAssessment
  );
  React.useEffect(() => {
    setShowDiagnosticAssessmentModules(false);
    setIsClinicalModulesSuccessVisible(false);
    setIsChildPerspectiveSuccessVisible(false);
  }, [currentProfileKey, showDiagnosticAssessmentPlaceholder]);
  const showDiagnosticAssessmentPlaceholderCard =
    showDiagnosticAssessmentPlaceholder && !showDiagnosticAssessmentModules && (currentProfileKey === "Noah" || currentProfileKey === "Chloe");
  const showHeroClinicalPrepPanels = showQuestionnaireInAssessment && !showDiagnosticAssessmentPlaceholderCard && currentProfileKey !== "Tom";
  const showClinicalProgressSummaryPanel = showHeroClinicalPrepPanels || isMvpNewChildAssessmentCard;
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
  const isDiagnosticStarterActionable =
    diagnosticStarterSubtitle === "Get started" || diagnosticStarterSubtitle === "Download sample";
  const assessmentHeaderDescriptionOverrides: Partial<Record<string, string>> = {
    Leo: "Leo’s Diagnostic Assessment is set up. Start the first module to begin preparing his Assessment Package.",
    Isla: "Isla’s modules are in progress. Keep going to move her Assessment Package toward Assessment Ready.",
    Chloe: "Chloe’s Assessment Package is ready. Share it with her GP, paediatrician or psychiatrist for clinical review.",
    Noah: "Noah’s Assessment Package has been shared with his clinician and is awaiting review.",
  };
  const assessmentHeaderDescription = usesTomLikeNewChildAssessment
    ? "We help families prepare an Assessment Package designed to support clinical conversations and referral decisions."
    : assessmentHeaderDescriptionOverrides[currentProfileKey]
      || `Complete the details needed to prepare ${currentChild.name}'s Assessment Package for your child's clinician, such as your GP, paediatrician or psychiatrist.`;
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
  const onboardingQuestionChecks = [
    Boolean(currentChild.name.trim()),
    currentChild.age > 0,
    Boolean(currentChild.intake?.stateOrTerritory),
    Boolean(currentChild.intake?.journeyStage),
    Boolean(currentChild.intake?.notices?.length),
    Boolean(currentChild.intake?.availableInfo?.length),
  ];
  const answeredOnboardingQuestionCount = onboardingQuestionChecks.filter(Boolean).length;
  const isSeededMockProfile = Boolean(currentChild.id && SEEDED_MOCK_PROFILE_IDS.has(currentChild.id));
  const isOnboardingFlowComplete = hasCompletedAssessmentReport ||
    isSeededMockProfile ||
    !currentChild.isNew ||
    answeredOnboardingQuestionCount === MVP_ONBOARDING_QUESTION_COUNT;
  const creditedOnboardingQuestionCount = isOnboardingFlowComplete
    ? MVP_ONBOARDING_QUESTION_COUNT
    : answeredOnboardingQuestionCount;
  const onboardingFlowProgress = isOnboardingFlowComplete
    ? 100
    : Math.round((answeredOnboardingQuestionCount / MVP_ONBOARDING_QUESTION_COUNT) * 100);
  const onboardingFlowMeta = isOnboardingFlowComplete
    ? "Onboarding flow complete"
    : `${answeredOnboardingQuestionCount} of ${MVP_ONBOARDING_QUESTION_COUNT} onboarding questions complete`;
  const creditedClinicalQuestionCount = hasCompletedAssessmentReport
    ? MVP_QUESTIONNAIRE_QUESTION_COUNT
    : answeredMvpQuestionCount;
  const completedMvpProgressQuestionCount = Math.min(
    creditedOnboardingQuestionCount + creditedClinicalQuestionCount,
    MVP_TOTAL_QUESTION_COUNT,
  );
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
  const isQuestionnaireSubmitted = hasCompletedAssessmentReport || hasSubmittedAssessmentQuestionnaire(currentChild);
  const isReadyForClinicalReview = isQuestionnaireSubmitted && questionnaireProgress === 100 && teacherChecklistState.done && documentCount > 0;
  const isWaitingClinicalReview = isQuestionnaireSubmitted && isReadyForClinicalReview;
  const isFollowUpComplete = isAssessmentComplete || isWaitingClinicalReview;
  const isNoahSharedPackage = currentProfileKey === "Noah" && isAssessmentComplete && !hasReturnedResults;
  const teacherChecklistProgress = teacherChecklistState.done ? 100 : teacherChecklistState.active ? 50 : 0;
  const documentUploadProgress = isAssessmentComplete || documentCount > 0 ? 100 : 0;
  const followUpProgress = isFollowUpComplete ? 100 : isReadyForClinicalReview ? 50 : 0;
  const clinicalModulesMetaTag = isAssessmentComplete || questionnaireProgress === 100
    ? "Completed"
    : questionnaireProgress > 0
      ? "In Progress"
      : "Pending";
  const preparationModuleProgressValues = [
    onboardingFlowProgress,
    questionnaireProgress,
    childPerspectiveProgress,
    teacherChecklistProgress,
    documentUploadProgress,
    followUpProgress,
  ];
  const completedPreparationModuleCount = preparationModuleProgressValues.filter((progress) => progress === 100).length;
  const preparationModuleTotalCount = preparationModuleProgressValues.length;
  const preparationModuleProgress = Math.round(
    preparationModuleProgressValues.reduce((total, progress) => total + progress, 0) / preparationModuleTotalCount,
  );
  const assessmentQuestionProgress = MVP_TOTAL_QUESTION_COUNT > 0
    ? Math.round((completedMvpProgressQuestionCount / MVP_TOTAL_QUESTION_COUNT) * 100)
    : 0;
  const clinicalProgressSummaryValue = hasCompletedAssessmentReport ? 100 : assessmentQuestionProgress;
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
          <span className="mt-0.5 block text-xs text-[var(--color-thread-muted-text)]">{file.date}</span>
        </span>
        <button
          type="button"
          aria-label={`Remove ${file.name}`}
          onClick={() => handleRequestRemoveSharedDocument(file)}
          className="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[var(--color-thread-muted-text)] transition-colors hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/30"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  };
  const isPackagePreparationChecklistView = preparationChecklistView === "package";
  const assessmentOverallProgress = hasCompletedAssessmentReport
    ? 100
    : isMvp
      ? preparationModuleProgress
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
      onRequestClose={() => setIsClinicalInfoModalOpen(false)}
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
 <h2 id="assessment-clinical-info-modal-title" className="font-serif text-2xl leading-tight text-[var(--color-thread-heading)]">
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
    <DocumentUploadWorkflow
      key={currentChild.id}
      childName={currentChild.name}
      isOpen={isDocumentUploadModalOpen}
      onClose={handleCloseDocumentUploadModal}
      onSave={handleSaveDocumentToLocker}
    />
  );

  const removeSharedDocumentModal = (
    <RemoveSharedDocumentModal
      childName={currentChild.name}
      document={documentPendingRemoval}
      onClose={handleCancelRemoveSharedDocument}
      onConfirm={handleConfirmRemoveSharedDocument}
    />
  );

  const clinicalProgressSummaryPanel = (
    <Card className="rounded-none rounded-tr-[32px] p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 max-sm:w-full">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-thread-muted-text)]">
            Preparation Progress
          </span>
          <span className="shrink-0 text-xs font-medium text-[var(--color-thread-mid-green)]">
            {clinicalProgressSummaryValue}% Done
          </span>
        </div>
        {!isMvpNewChildAssessmentCard && (
          <Button
            onClick={handleClinicalModulesAction}
            disabled={questionnaireProgress < 100}
            variant="primary"
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-xs font-medium inline-flex items-center gap-2 max-sm:w-full max-sm:justify-center",
              questionnaireProgress < 100 && "opacity-50 cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" />
            <span>Submit Questionnaire</span>
          </Button>
        )}
      </div>
      <ProgressBar
        value={clinicalProgressSummaryValue}
        colorClass="bg-[var(--color-thread-mid-green)]"
        trackClassName="bg-slate-100"
      />
      <p className="text-xs text-[var(--color-thread-muted-text)]">
        {completedMvpProgressQuestionCount} of {MVP_TOTAL_QUESTION_COUNT} total questions completed. Your progress is saved automatically.{" "}
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
  );
  const diagnosticAssessmentPackageCard = (
    <div id="care-options-section" className="w-full pt-2 font-sans">
      <Card id="care-option-diagnostic" className="w-full overflow-hidden rounded-none rounded-tr-[32px] bg-[var(--color-thread-light-green)]">
        <div className="p-6 sm:p-7.5">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">
            <div className="space-y-4 md:basis-2/3">
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
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-thread-dark-slate)] leading-snug">
                    <Check className="w-[15px] h-[15px] text-[var(--color-thread-mid-green)] mt-0.5 flex-shrink-0 stroke-[2.5]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 border-t md:basis-1/3 md:border-t-0 md:border-l border-black/5 pt-6 md:pt-0 md:pl-10">
              <div className="flex flex-col items-start gap-1 font-serif">
                <span className="text-2xl sm:text-[1.85rem] font-normal text-[var(--color-thread-heading)] leading-none tracking-tight">{formatAssessmentPackagePrice(DIAGNOSTIC_ASSESSMENT_PRICE)}</span>
                <span className="text-sm text-[var(--color-thread-muted-text)] font-normal font-sans">One-off, includes GST</span>
              </div>
              {!isDiagnosticActive && (
                <Button
                  id="get-started-diagnostic"
                  type="button"
                  variant="forest"
                  onClick={handleDiagnosticGetStartedClick}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Start your journey
                </Button>
              )}
            </div>
          </div>

          {isDiagnosticActive && (
            <div className="mt-7 flex w-full items-center justify-end border-t border-black/5 pt-6">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] rounded-full text-sm font-medium">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{isMvp ? "Assessment Ready" : "Current plan"}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
  const hidePreparationAccordionButtons = isMvpNewChildAssessmentCard;
  const onboardingFlowChecklistContent = (
    <div className="max-w-[62ch] space-y-4 pt-1">
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        The onboarding flow captures the first family context: who your child is, where you are in the process, what feels hardest right now, and which evidence already exists.
      </p>
      {!hidePreparationAccordionButtons && !isOnboardingFlowComplete && currentChild.isNew && (
        <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} pt-2`}>
          <Button
            variant="secondary"
            onClick={() => navigate("/setup?from=assessment")}
            className="text-xs h-9 px-4 font-medium rounded-full inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Complete onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
  const newChildTeacherChecklistContent = (
    <div className="max-w-[62ch] space-y-4 pt-1">
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        Teacher input adds a school-based view of attention, learning, emotional wellbeing, and classroom participation so the Assessment Package is not based on family context alone.
      </p>
    </div>
  );
  const newChildTeacherChecklistRowContent = newChildTeacherChecklistContent;
  const newChildClinicalModulesChecklistContent = (
    <ClinicalModulesChecklistContent showAction={false} />
  );
  const newChildChildPerspectiveChecklistContent = (
    <div className="max-w-[62ch] space-y-4 pt-1">
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        A child-friendly section captures your child&apos;s own view of focus, school, friendships, sleep, and daily routines so their voice sits alongside parent and clinical inputs.
      </p>
      {!hidePreparationAccordionButtons && (
        <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} pt-2`}>
        <Button
          variant="secondary"
          onClick={handleOpenChildPerspectiveModal}
          className="text-xs h-9 px-4 font-medium rounded-full inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isChildPerspectiveComplete ? "Review Perspective" : "Answer Question"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
        </div>
      )}
    </div>
  );
  const newChildPreparationChecklistItems = [
    {
      id: "onboarding-flow",
      done: isOnboardingFlowComplete,
      active: !isOnboardingFlowComplete && onboardingFlowProgress > 0,
      todo: !isOnboardingFlowComplete && onboardingFlowProgress === 0,
      title: "Onboarding flow",
      meta: onboardingFlowMeta,
      metaTag: isOnboardingFlowComplete ? "Completed" : onboardingFlowProgress > 0 ? "In Progress" : "Pending",
      progress: onboardingFlowProgress,
      description: onboardingFlowChecklistContent,
    },
    {
      id: "questionnaire",
      done: isAssessmentComplete || questionnaireProgress === 100,
      active: !isAssessmentComplete && questionnaireProgress > 0 && questionnaireProgress < 100,
      todo: !isAssessmentComplete && questionnaireProgress === 0,
      title: "Clinical modules",
      meta: isAssessmentComplete || questionnaireProgress === 100
        ? `All ${questionnaireTotalSections} developmental sections complete`
        : questionnaireCompletionMeta,
      metaTag: clinicalModulesMetaTag,
      progress: isAssessmentComplete ? 100 : questionnaireProgress,
      description: newChildClinicalModulesChecklistContent,
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
      description: newChildChildPerspectiveChecklistContent,
    },
    {
      id: "teacher-questionnaire",
      done: teacherChecklistState.done,
      active: teacherChecklistState.active,
      todo: teacherChecklistState.todo,
      title: "Ask teacher to complete questionnaire",
      meta: teacherChecklistState.meta,
      metaTag: teacherChecklistState.metaTag,
      progress: teacherChecklistProgress,
      description: newChildTeacherChecklistContent,
      rowDescription: newChildTeacherChecklistRowContent,
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
      progress: documentUploadProgress,
      description: (
        <div className="max-w-[62ch] space-y-4 pt-1">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Sharing previous reports, school term summaries, or occupational therapy feedback helps prepare the Assessment Package. Every document is protected with AES-256 end-to-end encryption in your secure Locker.
          </p>

          {documentCount > 0 && (
            <div className={`${CHECKLIST_DETAIL_WIDTH_CLASS} space-y-2 mt-2`}>
              <span className="text-[var(--color-thread-muted-text)] block uppercase font-medium tracking-wider text-xs mb-2 font-sans">Shared Documents ({documentCount})</span>
              {childFiles.map((file, i) => (
                renderSharedDocumentItem(file, i)
              ))}
            </div>
          )}

          {!hidePreparationAccordionButtons && (
            <div className="pt-2">
            <Button
              variant="secondary"
              onClick={handleOpenDocumentUploadModal}
              className="text-xs h-9 px-4 font-medium rounded-full inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{documentCount > 0 ? "Add another document" : "Upload document"}</span>
              <Upload className="w-3.5 h-3.5" />
            </Button>
            </div>
          )}
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
      progress: followUpProgress,
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
            <p className="text-xs text-[var(--color-thread-muted-text)] italic">
              This phase begins automatically once all above checklists are complete.
            </p>
          )}
        </div>
      ),
    },
  ];
  const newChildPreparationChecklistSection = isMvpNewChildAssessmentCard ? (
    <div className="space-y-6">
      {!isPackagePreparationChecklistView && (
        <div>
          <SectionLabel>Preparation Checklist</SectionLabel>
          <SectionTitle>
            Prepare {currentChild.name}&apos;s Assessment Package
          </SectionTitle>
                <SectionDescription>
            {completedPreparationModuleCount} of {preparationModuleTotalCount} preparation modules complete. Completing these key preparation steps gives your child&apos;s clinician the context needed to review {currentChild.name}&apos;s Thread and prepare the Assessment Package.
          </SectionDescription>
        </div>
      )}

      <div className={isPackagePreparationChecklistView ? "border-y border-black/10 [&>*:first-child]:border-t-0" : "mt-8 border-y border-black/10 [&>*:first-child]:border-t-0"}>
        {newChildPreparationChecklistItems.map((item) => {
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
                      "text-xs font-medium",
                      item.done || item.active || item.metaTag === "In Progress" || item.metaTag === "Under Review"
                        ? "bg-transparent text-[var(--color-thread-mid-green)]"
                        : "bg-transparent text-[var(--color-thread-muted-text)]",
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
    </div>
  ) : null;

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
                    ? assessmentHeaderDescription
                    : `Manage preparation, tracking, and clinical details for ${currentChild.name}'s assessment pathway.`}
                </SectionDescription>
              }
            />

            <div className="space-y-6">
              {!shouldHideAssessmentHeroCard && <HeroQuoteCard
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
                    onClick={isDiagnosticStarterActionable
                      ? diagnosticStarterSubtitle === "Get started"
                        ? handleCareOptionsAnchorClick
                        : handleDownloadClinicalReport
                      : undefined}
                  />
                }
              />}
              {showClinicalProgressSummaryPanel && clinicalProgressSummaryPanel}
              {diagnosticAssessmentPackageCard}
            </div>

            {newChildPreparationChecklistSection}

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
  const clinicalModulesChecklistContent = (
    <ClinicalModulesChecklistContent
      actionLabel={showQuestionnaireInAssessment ? clinicalModuleActionLabel : questionnaireProgress === 100 ? "Review Answers" : "Continue Module"}
      onAction={handleClinicalModulesAction}
    />
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
          className="text-xs h-9 px-4 font-medium rounded-full inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isChildPerspectiveComplete ? "Review Perspective" : "Answer Question"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
  const preparationChecklistItems = [
    {
      id: "onboarding-flow",
      done: isOnboardingFlowComplete,
      active: !isOnboardingFlowComplete && onboardingFlowProgress > 0,
      todo: !isOnboardingFlowComplete && onboardingFlowProgress === 0,
      title: "Onboarding flow",
      meta: onboardingFlowMeta,
      metaTag: isOnboardingFlowComplete ? "Completed" : onboardingFlowProgress > 0 ? "In Progress" : "Pending",
      progress: onboardingFlowProgress,
      image: watercolorBgImage,
      imageAlt: "Onboarding flow preparation",
      cornerClass: "rounded-tl-[32px]",
      description: onboardingFlowChecklistContent,
    },
    {
      id: "questionnaire",
      done: isAssessmentComplete || questionnaireProgress === 100,
      active: !isAssessmentComplete && questionnaireProgress > 0 && questionnaireProgress < 100,
      todo: !isAssessmentComplete && questionnaireProgress === 0,
      title: "Clinical modules",
      meta: isAssessmentComplete || questionnaireProgress === 100
        ? `All ${questionnaireTotalSections} developmental sections complete`
        : questionnaireCompletionMeta,
      metaTag: clinicalModulesMetaTag,
      progress: isAssessmentComplete ? 100 : questionnaireProgress,
      image: pediatricianQuestionsImage,
      imageAlt: "Clinical modules preparation",
      cornerClass: "rounded-tr-[32px]",
      description: clinicalModulesChecklistContent,
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
      progress: teacherChecklistProgress,
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
      progress: documentUploadProgress,
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
              <span className="text-[var(--color-thread-muted-text)] block uppercase font-medium tracking-wider text-xs mb-2 font-sans">Shared Documents ({documentCount})</span>
              {childFiles.map((file, i) => (
                renderSharedDocumentItem(file, i)
              ))}
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="secondary"
              onClick={handleOpenDocumentUploadModal}
              className="text-xs h-9 px-4 font-medium rounded-full inline-flex items-center gap-1.5 cursor-pointer"
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
      progress: followUpProgress,
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
            <p className="text-xs text-[var(--color-thread-muted-text)] italic">
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
              currentProfileKey === "Noah" || currentProfileKey === "Chloe"
                ? `${currentChild.name}'s Assessment Package`
                  : isPackagePreparationChecklistView
                    ? `Prepare ${currentChild.name}'s Assessment Package`
                    : isAssessmentComplete
                      ? `${currentChild.name}'s assessment is ready.`
                      : `${currentChild.name}'s assessment.`
            }
            description={
              <SectionDescription>
                {isMvp
                  ? assessmentHeaderDescription
                  : `Manage preparation, tracking, and clinical details for ${currentChild.name}'s assessment pathway.`}
              </SectionDescription>
            }
          />

          {/* TOP PANEL: BOOKING STATUS CARD */}
          <div className="space-y-6">
            {!shouldHideAssessmentHeroCard && <HeroQuoteCard
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
                    onClick={isNoahSharedPackage
                      ? undefined
                      : isWaitingClinicalReview
                        ? handleOpenClinicianShareModal
                        : isDiagnosticStarterActionable
                          ? handleClinicalOutcomeActionClick
                          : undefined}
                  />
                )
              }
            />}
            {showClinicalProgressSummaryPanel && clinicalProgressSummaryPanel}
            {showDiagnosticAssessmentPlaceholderCard && (
              <DiagnosticAssessmentReadyPanel
                isShared={currentProfileKey === "Noah"}
                showStatusTitle={shouldHideAssessmentHeroCard}
                helpCentreArticles={ASSESSMENT_PACKAGE_HELP_CENTRE_ARTICLES}
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
                  {completedPreparationModuleCount} of {preparationModuleTotalCount} preparation modules complete. Completing these key preparation steps gives your child&apos;s clinician the context needed to review {currentChild.name}&apos;s Thread and prepare the Assessment Package.
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
                              "text-xs font-medium",
                              item.done || item.active || item.metaTag === "In Progress" || item.metaTag === "Under Review"
                                ? "bg-transparent text-[var(--color-thread-mid-green)]"
                                : "bg-transparent text-[var(--color-thread-muted-text)]",
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
                  done={isOnboardingFlowComplete}
                  active={!isOnboardingFlowComplete && onboardingFlowProgress > 0}
                  todo={!isOnboardingFlowComplete && onboardingFlowProgress === 0}
                  title="Onboarding flow"
                  meta={onboardingFlowMeta}
                  metaTag={isOnboardingFlowComplete ? "Completed" : onboardingFlowProgress > 0 ? "In Progress" : "Pending"}
                  image={watercolorBgImage}
                  imageAlt="Onboarding flow preparation"
                  cornerClass="rounded-tl-[32px]"
                  description={onboardingFlowChecklistContent}
                />

                <PreparationChecklistCard
                  done={isAssessmentComplete || questionnaireProgress === 100}
                  active={!isAssessmentComplete && questionnaireProgress > 0 && questionnaireProgress < 100}
                  todo={!isAssessmentComplete && questionnaireProgress === 0}
                  title="Clinical modules"
                  meta={isAssessmentComplete || questionnaireProgress === 100
        ? `All ${questionnaireTotalSections} developmental sections complete`
        : questionnaireCompletionMeta}
                  metaTag={clinicalModulesMetaTag}
                  image={pediatricianQuestionsImage}
                  imageAlt="Clinical modules preparation"
                  cornerClass="rounded-tr-[32px]"
                    description={clinicalModulesChecklistContent}
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
                          <span className="text-[var(--color-thread-muted-text)] block uppercase font-medium tracking-wider text-xs mb-2 font-sans">Shared Documents ({documentCount})</span>
                          {childFiles.map((file, i) => (
                            renderSharedDocumentItem(file, i)
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          onClick={handleOpenDocumentUploadModal}
                          className="text-xs h-9 px-4 font-medium rounded-full inline-flex items-center gap-1.5 cursor-pointer"
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
                        <p className="text-xs text-[var(--color-thread-muted-text)] italic">
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
                  done={isOnboardingFlowComplete}
                  active={!isOnboardingFlowComplete && onboardingFlowProgress > 0}
                  todo={!isOnboardingFlowComplete && onboardingFlowProgress === 0}
                  title="Onboarding flow"
                  meta={onboardingFlowMeta}
                  metaTag={isOnboardingFlowComplete ? "Completed" : onboardingFlowProgress > 0 ? "In Progress" : "Pending"}
                  description={onboardingFlowChecklistContent}
                />

                <TimelineStep
                  done={isAssessmentComplete || questionnaireProgress === 100}
                  active={!isAssessmentComplete && questionnaireProgress > 0 && questionnaireProgress < 100}
                  todo={!isAssessmentComplete && questionnaireProgress === 0}
                  title="Clinical modules"
                  meta={isAssessmentComplete || questionnaireProgress === 100 
                    ? `All ${questionnaireTotalSections} developmental sections complete` 
                    : `${completedSectionCount} of ${questionnaireTotalSections} sections complete`}
                  metaTag={clinicalModulesMetaTag}
                  description={
                      clinicalModulesChecklistContent
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
                          <span className="text-[var(--color-thread-muted-text)] block uppercase font-medium tracking-wider text-xs mb-2 font-sans">Shared Documents ({documentCount})</span>
                          {childFiles.map((file, i) => (
                            renderSharedDocumentItem(file, i)
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          onClick={handleOpenDocumentUploadModal}
                          className="text-xs h-9 px-4 font-medium rounded-full inline-flex items-center gap-1.5 cursor-pointer"
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
                        <p className="text-xs text-[var(--color-thread-muted-text)] italic">
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
      <ClinicalModulesWorkflow
        childName={currentChild.name}
        questionnaireAnswers={questionnaireAnswers}
        activeSection={clinicalQuestionModalSection}
        activeQuestionIndex={clinicalQuestionModalIndex}
        isCoverVisible={isClinicalModuleCoverVisible}
        isSuccessVisible={isClinicalModulesSuccessVisible}
        onActiveSectionChange={setClinicalQuestionModalSection}
        onActiveQuestionIndexChange={setClinicalQuestionModalIndex}
        onCoverVisibleChange={setIsClinicalModuleCoverVisible}
        onSuccessVisibleChange={setIsClinicalModulesSuccessVisible}
        onAnswerChange={handleClinicalQuestionAnswerChange}
        onBackToPreparation={() => {
          clearClinicalModulesOpenRequest();
          setIsClinicalModulesSuccessVisible(false);
        }}
        onClose={() => {
          clearClinicalModulesOpenRequest();
          setIsClinicalModulesSuccessVisible(false);
          setClinicalQuestionModalSection(null);
          setClinicalQuestionModalIndex(0);
          setIsClinicalModuleCoverVisible(false);
        }}
      />
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
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-thread-muted-text)]">
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
