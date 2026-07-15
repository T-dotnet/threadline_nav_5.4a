import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  ChevronRight,
  Download,
  FileCheck2,
  FileText,
  Folder,
  Info,
  LockKeyhole,
  Plus,
  Play,
  Printer,
  Search,
  ShieldCheck,
  ShieldHalf,
  Trash2,
  X,
} from "lucide-react";
import { QuestionnaireModuleModalFrame } from "../assessment/QuestionnaireModuleModalFrame";
import { ActionLink } from "../ui/ActionLink";
import { ActionPromptPanel } from "../ui/ActionPromptPanel";
import { AreaItem } from "../ui/AreaItem";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ClinicalHighlight } from "../ui/ClinicalHighlight";
import { ChecklistItem } from "../ui/ChecklistItem";
import { DocumentUploadDropzone } from "../ui/DocumentUploadDropzone";
import { EvidenceBadge } from "../ui/EvidenceBadge";
import { FileItem } from "../ui/FileItem";
import { FilterTab } from "../ui/FilterTab";
import { Input } from "../ui/Input";
import { IconButton } from "../ui/IconButton";
import { LockerItem } from "../ui/LockerItem";
import { ModalCloseButton, ModalShell } from "../ui/ModalShell";
import { PageHeader } from "../ui/PageHeader";
import { PlanProgressCard } from "../ui/PlanProgressCard";
import { ProcessStepper, type ProcessStep } from "../ui/ProcessStepper";
import { ProgressBar } from "../ui/ProgressBar";
import { QuestionNotSurePrompt } from "../ui/QuestionNotSurePrompt";
import { QuestionOption } from "../ui/QuestionOption";
import { SegmentedControl } from "../ui/SegmentedControl";
import { SectionDescription } from "../ui/SectionDescription";
import { SectionLabel } from "../ui/SectionLabel";
import { SectionTitle } from "../ui/SectionTitle";
import { Switch } from "../ui/Switch";
import { SurfacePanel } from "../ui/SurfacePanel";
import { WatercolorPanel } from "../ui/WatercolorPanel";
import { HeroQuoteCard } from "../ui/HeroQuoteCard";
import { GuideCard } from "../ui/GuideCard";
import { ListItemCard } from "../ui/ListItemCard";
import articleImage from "../../assets/images/optimized/abstract-bedtime-wind-down-900.jpg";
import watercolorImage from "../../assets/images/optimized/watercolor-bg-900.jpg";
import clinicianPhoto from "../../assets/images/optimized/dr-naomi-clark-720.jpg";
import { getRotatingCornerClass } from "../../lib/cornerStyles";
import { getResourceGuides } from "../../lib/resourceGuides";
import { cn } from "../../lib/utils";
import type { StoryId } from "./mvpCatalogue";

interface MvpStoryPreviewProps {
  storyId: StoryId;
  states?: boolean;
}

const MODULE_STEPS: ProcessStep[] = [
  { num: 1, title: "Child & Family Profile", desc: "About your child and family" },
  { num: 2, title: "Development & Medical History", desc: "Health and development details" },
  { num: 3, title: "Parent ADHD Questionnaire", desc: "What you notice at home" },
  { num: 4, title: "School Information", desc: "Learning and classroom context" },
  { num: 5, title: "Review & Submit", desc: "Check your Assessment Package" },
];

const COLOR_TOKENS = [
  ["Heading", "--color-thread-heading", "#0B4636"],
  ["Emerald", "--color-thread-mid-green", "#108560"],
  ["Light green", "--color-thread-light-green", "#E6F4ED"],
  ["Off white", "--color-thread-off-white", "#F5F7F6"],
  ["Dark slate", "--color-thread-dark-slate", "#0A1F1B"],
  ["Muted text", "--color-thread-muted-text", "#52635D"],
] as const;

const ASSESSMENT_PACKAGE_ARTICLES = [
  "See the Assessment Package and how to read it",
  "Evidence used in Assessment Package",
  "File ownership. Manage files access using Doc locker",
] as const;

const DOC_LOCKER_FILES = [
  {
    id: "report",
    typeId: "report",
    typeName: "Report",
    name: "Actionable Clarity Report",
    date: "8 Jun 2026",
    uploadedBy: "threadline",
    shared: false,
    sharedWith: "your care circle",
    icon: FileText,
    childName: "Maya",
  },
  {
    id: "school-pack",
    typeId: "schoolpack",
    typeName: "School Pack",
    name: "School Clarity Pack",
    date: "8 Jun 2026",
    uploadedBy: "threadline",
    shared: true,
    sharedWith: "Homeroom Teacher",
    icon: Folder,
    childName: "Maya",
  },
  {
    id: "clinical",
    typeId: "clinical",
    typeName: "Clinical",
    name: "Parent Observations Log — Sleep Prep",
    date: "12 Jun 2026",
    uploadedBy: "you",
    shared: true,
    sharedWith: "Clinical reviewer",
    icon: Activity,
    childName: "Noah",
  },
] as const;

const DOC_LOCKER_FILTERS = [
  { id: "all", label: "All files" },
  { id: "report", label: "Report" },
  { id: "schoolpack", label: "School Pack" },
  { id: "clinical", label: "Clinical" },
] as const;

const RESOURCE_GUIDES = getResourceGuides({
  name: "your child",
  isNew: false,
  age: 8,
  initial: "Y",
});

const RESOURCE_FILTERS = [
  { id: "all", label: "All guides" },
  { id: "tools", label: "Tools & Templates" },
  { id: "health", label: "Health & Clinical" },
  { id: "classroom", label: "Classroom Strategies" },
  { id: "emotional", label: "Emotional Regulation" },
] as const;

const RESOURCE_TOPICS = [
  "Understanding ADHD",
  "Emotional Regulation",
  "School Support",
  "Learning & Cognition",
  "Daily Routines",
  "Working with Professionals",
] as const;

const SETTINGS_ACCESS_OPTIONS: Array<{ value: SettingsAccessLevel; label: string }> = [
  { value: "full", label: "Full" },
  { value: "partial", label: "Partial" },
];

const SETTINGS_ROLES = ["Partner", "Teacher", "Family member", "Carer"] as const;

const SETTINGS_PROFILES = [
  { name: "Noah", initial: "N", detail: "Age 9 · Next Review on 24 Jul 2026", active: true },
  { name: "Chloe", initial: "C", detail: "Age 11 · Next Review on 18 Aug 2026", active: false },
] as const;

function StateLabel({ children }: { children: string }) {
  return (
    <span className="mb-2 block text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[var(--color-thread-muted-text)]">
      {children}
    </span>
  );
}

function StateCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-black/[0.07] bg-white p-4">
      <StateLabel>{label}</StateLabel>
      {children}
    </div>
  );
}

function TypeSample({
  name,
  spec,
  children,
}: {
  name: string;
  spec: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 border-b border-black/[0.08] py-6 first:pt-0 last:border-0 last:pb-0 md:grid-cols-[160px_minmax(0,1fr)]">
      <div>
        <div className="text-xs font-medium text-[var(--color-thread-heading)]">{name}</div>
        <div className="mt-1 font-mono text-[0.64rem] leading-5 text-[var(--color-thread-muted-text)]">{spec}</div>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

type SettingsAccessLevel = "full" | "partial";

function SettingsAccessOption({
  value,
  selected,
  onSelect,
}: {
  value: SettingsAccessLevel;
  selected: boolean;
  onSelect: (value: SettingsAccessLevel) => void;
}) {
  const fullAccess = value === "full";
  const Icon = fullAccess ? ShieldCheck : ShieldHalf;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "flex min-h-[64px] items-start gap-3 rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
          : "border-black/5 bg-slate-50/40 hover:border-black/15 hover:bg-slate-50/90",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0",
          fullAccess
            ? "text-[var(--color-thread-mid-green)]"
            : "text-[var(--color-thread-muted-text)]",
        )}
      />
      <span className="flex flex-col">
        <span className="text-base font-medium text-slate-900">
          {fullAccess ? "Full access" : "Partial access"}
        </span>
        <span className="mt-0.5 text-xs text-[var(--color-thread-muted-text)]">
          {fullAccess
            ? "Sees and manages everything you can"
            : "Limited scope — configurable soon"}
        </span>
      </span>
    </button>
  );
}

function SettingsDeleteProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ModalShell
      isOpen={open}
      onRequestClose={onClose}
      titleId="catalogue-delete-profile-title"
      size="small"
      radiusClassName="rounded-tr-[28px] rounded-bl-[28px]"
      panelClassName="relative p-7"
    >
      <ModalCloseButton onClick={onClose} label="Close delete child profile confirmation" />
      <span className="block text-xs font-medium uppercase tracking-[0.16em] text-rose-600">
        Delete profile
      </span>
      <h2
        id="catalogue-delete-profile-title"
        className="mt-3 font-serif text-[1.8rem] leading-tight tracking-tight text-[var(--color-thread-heading)]"
      >
        Delete Noah&apos;s profile?
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        This removes the child profile from Registered Children Profiles. This action cannot be undone.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="dangerSolid" onClick={onClose}>
          Delete profile
        </Button>
      </div>
    </ModalShell>
  );
}

export function MvpStoryPreview({ storyId, states = false }: MvpStoryPreviewProps) {
  const [enabled, setEnabled] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All files");
  const [selectedAnswer, setSelectedAnswer] = useState("Often");
  const [docShareStates, setDocShareStates] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DOC_LOCKER_FILES.map((file) => [file.id, file.shared])),
  );
  const [lockerFilter, setLockerFilter] = useState("all");
  const [lockerSearch, setLockerSearch] = useState("");
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [showResourceEmpty, setShowResourceEmpty] = useState(states);
  const [notSure, setNotSure] = useState(false);
  const [activeStep, setActiveStep] = useState(2);
  const [segmentView, setSegmentView] = useState<"overview" | "details">("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarModalOpen, setSidebarModalOpen] = useState(false);
  const [settingsNickname, setSettingsNickname] = useState("Primary parent");
  const [settingsEmail, setSettingsEmail] = useState("parent.threadline@example.com");
  const [settingsNotifications, setSettingsNotifications] = useState(true);
  const [settingsAccess, setSettingsAccess] = useState<SettingsAccessLevel>("full");
  const [settingsUserAccess, setSettingsUserAccess] = useState<SettingsAccessLevel>("full");
  const [settingsRole, setSettingsRole] = useState("Partner");
  const [settingsInviteName, setSettingsInviteName] = useState("");
  const [settingsInviteEmail, setSettingsInviteEmail] = useState("");
  const [deleteProfileOpen, setDeleteProfileOpen] = useState(false);

  if (storyId === "colors") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {COLOR_TOKENS.map(([label, token, hex]) => (
          <div key={token} className="overflow-hidden rounded-lg border border-black/[0.08] bg-white">
            <div className="h-20" style={{ backgroundColor: `var(${token})` }} />
            <div className="p-3">
              <div className="text-sm font-medium text-slate-900">{label}</div>
              <div className="mt-1 font-mono text-[0.68rem] text-slate-500">{token}</div>
              <div className="mt-0.5 font-mono text-[0.68rem] text-slate-500">{hex}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (storyId === "typography") {
    return (
      <div>
        <TypeSample name="Fraunces" spec="Light 300 · display">
          <p className="font-serif text-4xl leading-tight text-[var(--color-thread-heading)] sm:text-5xl">Your child’s story, clearly organised.</p>
        </TypeSample>
        <TypeSample name="Inter Light" spec="300 · product headings">
          <p className="thread-sans-heading text-3xl leading-tight text-[var(--color-thread-heading)]">Assessment progress and next steps.</p>
        </TypeSample>
        <TypeSample name="Inter Regular" spec="400 · body">
          <p className="max-w-2xl text-base leading-7 text-[var(--color-thread-gray)]">Gather key assessment information and keep next steps organised.</p>
        </TypeSample>
        <TypeSample name="Inter Medium" spec="500 · labels & controls">
          <p className="text-sm font-medium text-slate-900">Medium labels support clear, dependable actions.</p>
        </TypeSample>
      </div>
    );
  }

  if (storyId === "type-page-titles") {
    return (
      <div>
        <TypeSample name="Page title" spec="Fraunces 300 · 2.75rem MVP · 1.1">
          <h1 className="thread-page-header__title max-w-3xl">All Children at a glance.</h1>
        </TypeSample>
        <TypeSample name="Serif override" spec="Fraunces 300 · responsive display">
          <h1 className="thread-page-header__title thread-page-header__title--serif max-w-3xl">Documents locker.</h1>
        </TypeSample>
        <TypeSample name="Modal title" spec="Fraunces 300 · 1.875rem · 1.25">
          <h2 className="font-serif text-3xl leading-tight text-[var(--color-thread-heading)]">Before you continue, please confirm.</h2>
        </TypeSample>
      </div>
    );
  }

  if (storyId === "type-section-titles") {
    return (
      <div>
        <TypeSample name="Section label" spec="Inter 500 · 0.75rem · uppercase · 0.1em">
          <SectionLabel className="mb-0">Areas of focus</SectionLabel>
        </TypeSample>
        <TypeSample name="Section title" spec="Inter 300 in MVP · 2rem · 1.05">
          <SectionTitle className="mb-0">Assessed clinical domains</SectionTitle>
        </TypeSample>
        <TypeSample name="Section description" spec="Inter 400 · 1rem · relaxed · max 64ch">
          <SectionDescription className="mb-0">Clinical findings across key developmental domains, with the source evidence kept visible.</SectionDescription>
        </TypeSample>
      </div>
    );
  }

  if (storyId === "type-card-titles") {
    return (
      <div>
        <TypeSample name="Profile heading" spec="Inter 300 · 1.8rem · 1.0 · tight">
          <h2 className="thread-profile-heading">Noah's Profile</h2>
        </TypeSample>
        <TypeSample name="Card heading" spec="Inter 500 · 1.14rem · tight">
          <h3 className="thread-sans-heading text-[1.14rem] font-medium tracking-tight text-[var(--color-thread-heading)]">Assessment Package</h3>
        </TypeSample>
        <TypeSample name="List heading" spec="Inter 500 · 1rem · snug">
          <h3 className="text-base font-medium leading-snug text-[var(--color-thread-heading)]">Development & medical history</h3>
        </TypeSample>
      </div>
    );
  }

  if (storyId === "type-body") {
    return (
      <div>
        <TypeSample name="Page introduction" spec="Inter 400 · 1rem · relaxed · max 55ch">
          <p className="thread-page-header__description">See each child's Assessment Package progress, from onboarding and questionnaires to clinical review and results.</p>
        </TypeSample>
        <TypeSample name="Body" spec="Inter 400 · 1rem · relaxed · max 64ch">
          <p className="max-w-[64ch] text-base leading-relaxed text-[var(--color-thread-gray)]">Development and health details help your child’s clinician interpret assessment evidence in context.</p>
        </TypeSample>
        <TypeSample name="Supporting" spec="Inter 400 · 0.875rem · relaxed">
          <p className="max-w-[64ch] text-sm leading-relaxed text-slate-600">You can save your progress and return to this module at any time.</p>
        </TypeSample>
        <TypeSample name="Caption" spec="Inter 400 · 0.75rem · snug">
          <p className="text-xs leading-snug text-[var(--color-thread-muted-text)]">PDF, DOC, DOCX, XLS, XLSX or PNG. Max size 25MB.</p>
        </TypeSample>
      </div>
    );
  }

  if (storyId === "type-labels") {
    return (
      <div>
        <TypeSample name="Category label" spec="Inter 500 · 0.75rem · uppercase · 0.1em">
          <SectionLabel className="mb-0">Current summary</SectionLabel>
        </TypeSample>
        <TypeSample name="Field label" spec="Inter 500 · 0.875rem · compact">
          <label className="thread-label mb-0">Child name</label>
        </TypeSample>
        <TypeSample name="Metadata" spec="Inter 400 · 0.875rem">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-thread-muted-text)]"><span>14 Jul 2026</span><span>Uploaded by you</span><span>Noah</span></div>
        </TypeSample>
        <TypeSample name="Status label" spec="Inter 500 · 0.68rem · uppercase · 0.1em">
          <Badge variant="active">Active</Badge>
        </TypeSample>
      </div>
    );
  }

  if (storyId === "type-controls") {
    return (
      <div>
        <TypeSample name="Primary action" spec="Inter 500 · 0.82rem">
          <Button variant="primary">Continue</Button>
        </TypeSample>
        <TypeSample name="Action link" spec="Inter 500 · 0.84rem">
          <ActionLink as="button">Open profile</ActionLink>
        </TypeSample>
        <TypeSample name="Input" spec="Inter 500 · 0.95rem · placeholder 400">
          <Input className="max-w-md" placeholder="Search documents" />
        </TypeSample>
        <TypeSample name="Filter" spec="Inter 500 · compact control">
          <FilterTab active label="All files" />
        </TypeSample>
      </div>
    );
  }

  if (storyId === "type-data") {
    return (
      <div>
        <TypeSample name="Primary progress" spec="Fraunces 300 · 4rem · 1.0 · -0.034em">
          <div className="font-serif text-[4rem] leading-[4rem] tracking-[-2.2px] text-[var(--color-thread-heading)]">65%</div>
        </TypeSample>
        <TypeSample name="Progress status" spec="Inter 400 · 1.125rem · snug">
          <p className="text-[1.125rem] leading-snug text-[var(--color-thread-heading)]">on track —<br /><span className="text-[0.95em] text-[var(--color-thread-muted-text)]">steady progress</span></p>
        </TypeSample>
        <TypeSample name="Bounded count" spec="Inter 500 · 0.75rem · tabular">
          <div className="flex gap-8 text-xs font-medium tabular-nums text-[var(--color-thread-muted-text)]"><span>12 of 17 complete</span><span>Step 2 of 5</span></div>
        </TypeSample>
        <TypeSample name="Date & time" spec="Inter 400/500 · 0.875rem · tabular">
          <div className="flex gap-8 text-sm tabular-nums text-slate-700"><span>24 Jul 2026</span><span className="font-medium">10:30 AM</span></div>
        </TypeSample>
      </div>
    );
  }

  if (storyId === "spacing") {
    return (
      <div className="space-y-3">
        {[4, 8, 12, 16, 24, 32, 48, 64].map((space) => (
          <div key={space} className="flex items-center gap-4">
            <span className="w-9 font-mono text-xs text-slate-500">{space}</span>
            <div className="h-3 rounded-sm bg-[var(--color-thread-mid-green)]" style={{ width: `${space * 3}px` }} />
          </div>
        ))}
      </div>
    );
  }

  if (storyId === "radius") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <StateCell label="Input · 12px">
          <div className="h-20 rounded-xl border border-black/10 bg-white" />
        </StateCell>
        <StateCell label="Feature · asymmetric">
          <div className="h-20 rounded-none rounded-tr-[24px] bg-[var(--color-thread-light-green)]" />
        </StateCell>
        <StateCell label="Pill · full">
          <div className="h-12 rounded-full bg-[var(--color-thread-heading)]" />
        </StateCell>
      </div>
    );
  }

  if (storyId === "elevation") {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-tr-[24px] border border-black/[0.08] bg-white p-6">
          <StateLabel>Structural border</StateLabel>
          <p className="text-sm text-slate-600">Default product surface</p>
        </div>
        <div className="shadow-premium rounded-tr-[24px] bg-white p-6">
          <StateLabel>Premium shadow</StateLabel>
          <p className="text-sm text-slate-600">Raised or overlay surface</p>
        </div>
      </div>
    );
  }

  if (storyId === "image-watercolor") {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <figure className="min-w-0">
          <div className="aspect-[16/9] overflow-hidden rounded-br-[24px]">
            <img
              src={watercolorImage}
              alt="Threadline green and plum watercolor texture"
              className="h-full w-full object-cover"
              decoding="async"
            />
          </div>
          <figcaption className="mt-3 text-xs leading-5 text-[var(--color-thread-muted-text)]">
            Raw asset · watercolor-bg-900.jpg · decorative use normally has empty alt text
          </figcaption>
        </figure>
        <div>
          <WatercolorPanel className="h-full !p-5 sm:!p-8">
            <div className="rounded-br-[20px] bg-white p-6">
              <SectionLabel className="mb-2">Applied surface</SectionLabel>
              <h3 className="thread-sans-heading text-xl text-[var(--color-thread-heading)]">Quiet branded context.</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--color-thread-muted-text)]">
                The shared overlay keeps body copy readable while preserving the watercolor character.
              </p>
            </div>
          </WatercolorPanel>
        </div>
      </div>
    );
  }

  if (storyId === "image-editorial") {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        {RESOURCE_GUIDES.slice(0, 4).map((guide) => (
          <figure key={guide.title} className="min-w-0">
            <div className="aspect-[16/9] overflow-hidden rounded-tr-[20px] bg-[var(--color-thread-off-white)]">
              <img
                src={guide.image}
                alt={guide.title}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <figcaption className="mt-3">
              <span className="block text-sm font-medium leading-snug text-[var(--color-thread-heading)]">{guide.title}</span>
              <span className="mt-1 block text-xs text-[var(--color-thread-muted-text)]">16:9 crop · optimized 900px asset</span>
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  if (storyId === "image-portrait") {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
        <figure className="min-w-0">
          <div className="aspect-square max-w-sm overflow-hidden rounded-tr-[24px]">
            <img
              src={clinicianPhoto}
              alt="Dr Naomi Clark"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </div>
          <figcaption className="mt-3 text-xs leading-5 text-[var(--color-thread-muted-text)]">
            Source portrait · optimized 720px square · identify the person in alt text
          </figcaption>
        </figure>
        <div className="rounded-tr-[24px] bg-[var(--color-thread-off-white)] p-6 sm:p-8">
          <StateLabel>Avatar crops</StateLabel>
          <div className="mt-5 flex flex-wrap items-end gap-7">
            <div className="text-center">
              <Avatar src={clinicianPhoto} alt="Dr Naomi Clark" size="sm" />
              <span className="mt-2 block text-xs text-[var(--color-thread-muted-text)]">Small</span>
            </div>
            <div className="text-center">
              <Avatar src={clinicianPhoto} alt="Dr Naomi Clark" size="md" />
              <span className="mt-2 block text-xs text-[var(--color-thread-muted-text)]">Medium</span>
            </div>
            <div className="text-center">
              <Avatar src={clinicianPhoto} alt="Dr Naomi Clark" size="lg" />
              <span className="mt-2 block text-xs text-[var(--color-thread-muted-text)]">Large</span>
            </div>
          </div>
          <div className="mt-7 border-t border-black/[0.08] pt-5">
            <div className="text-base font-medium text-[var(--color-thread-heading)]">Dr Naomi Clark</div>
            <div className="mt-1 text-xs leading-5 text-[var(--color-thread-muted-text)]">Consultant Child Psychologist · PhD, MAPS</div>
          </div>
        </div>
      </div>
    );
  }

  if (storyId === "button") {
    if (states) {
      return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StateCell label="Default"><Button variant="primary">Continue</Button></StateCell>
          <StateCell label="Focus"><Button variant="primary" className="ring-2 ring-[var(--color-thread-mid-green)]/40 ring-offset-2">Continue</Button></StateCell>
          <StateCell label="Loading"><Button variant="primary" isLoading>Saving</Button></StateCell>
          <StateCell label="Disabled"><Button variant="primary" disabled>Continue</Button></StateCell>
        </div>
      );
    }
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
        <Button variant="secondary">Save & exit</Button>
        <Button variant="tertiary">Not now</Button>
        <Button variant="danger">Remove</Button>
      </div>
    );
  }

  if (storyId === "input") {
    return states ? (
      <div className="grid gap-4 sm:grid-cols-3">
        <StateCell label="Default"><Input placeholder="Enter name" /></StateCell>
        <StateCell label="Error"><Input error defaultValue="Noah" aria-invalid="true" /></StateCell>
        <StateCell label="Disabled"><Input disabled value="Isla" readOnly /></StateCell>
      </div>
    ) : (
      <label className="block max-w-md">
        <span className="mb-2 block text-sm font-medium text-slate-800">Search documents</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input variant="search" className="pl-10" placeholder="Search by file name" />
        </div>
      </label>
    );
  }

  if (storyId === "badge") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="active">Active</Badge>
        <Badge variant="now">Now</Badge>
        <Badge variant="future">Next</Badge>
        <Badge variant="clinical">Clinical</Badge>
      </div>
    );
  }

  if (storyId === "switch") {
    return states ? (
      <div className="grid gap-3 sm:grid-cols-2">
        <StateCell label="Off"><Switch checked={false} onCheckedChange={() => undefined} /></StateCell>
        <StateCell label="On"><Switch checked onCheckedChange={() => undefined} /></StateCell>
      </div>
    ) : (
      <label className="flex max-w-md items-center justify-between gap-6 rounded-xl border border-black/[0.08] bg-white p-4">
        <span>
          <span className="block text-sm font-medium text-slate-900">MVP Mode</span>
          <span className="mt-1 block text-xs text-slate-500">Show the focused MVP workspace.</span>
        </span>
        <Switch aria-label="MVP Mode" checked={enabled} onCheckedChange={setEnabled} />
      </label>
    );
  }

  if (storyId === "filter-tab") {
    const tabs = ["All files", "Clinical", "School"];
    return (
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <FilterTab key={tab} label={tab} active={activeFilter === tab} onClick={() => setActiveFilter(tab)} />
        ))}
      </div>
    );
  }

  if (storyId === "action-link") {
    return (
      <div className="flex flex-wrap items-center gap-8">
        <ActionLink as="button">Open profile</ActionLink>
        <div className="bg-[var(--color-thread-heading)] p-5">
          <ActionLink as="button" variant="light">View results</ActionLink>
        </div>
      </div>
    );
  }

  if (storyId === "icon-button") {
    return (
      <div className="flex items-center gap-3">
        <IconButton aria-label="Notifications" hasBadge><Bell className="h-4.5 w-4.5" /></IconButton>
        <IconButton aria-label="Download"><Download className="h-4.5 w-4.5" /></IconButton>
      </div>
    );
  }

  if (storyId === "segmented-control") {
    return (
      <SegmentedControl<"overview" | "details">
        aria-label="Child view"
        options={[
          { value: "overview", label: "Overview" },
          { value: "details", label: "Details" },
        ]}
        value={segmentView}
        onChange={setSegmentView}
        className="max-w-sm"
      />
    );
  }

  if (storyId === "progress") {
    return states ? (
      <div className="grid gap-4 sm:grid-cols-3">
        <StateCell label="Not started"><ProgressBar value={0} showLabel /></StateCell>
        <StateCell label="In progress"><ProgressBar value={42} showLabel /></StateCell>
        <StateCell label="Complete"><ProgressBar value={100} showLabel /></StateCell>
      </div>
    ) : <ProgressBar value={12} max={17} showLabel className="max-w-xl" />;
  }

  if (storyId === "page-header") {
    return (
      <PageHeader
        kicker="Family overview"
        title="All Children at a glance."
        description="See each child's Assessment Package progress, from onboarding and questionnaires to clinical review and results."
        action={<Button variant="secondary">Add child</Button>}
        className="mb-0"
      />
    );
  }

  if (storyId === "checklist-item") {
    return (
      <div className="max-w-xl space-y-3">
        <ChecklistItem title="Parent questionnaire" description="Completed and ready for clinical review." />
        <ChecklistItem title="School information" description="Teacher invitation sent to the nominated school contact." />
      </div>
    );
  }

  if (storyId === "accordion") {
    return (
      <div className="max-w-3xl border-y border-black/10">
        <AreaItem
          title="Attention & focus"
          impact="Seen across home and school"
          evidence={3}
          status="Complete"
          description="Information from parent observations and school feedback shows a consistent pattern of attention changing with task demand."
          sources={["Parent questionnaire", "Teacher feedback"]}
          isCollapsible
          defaultExpanded={!states}
          collapsibleIndicator="plus-minus"
        />
        <AreaItem
          title="Development & medical history"
          impact="Health and development context"
          status="To do"
          description="Add the remaining background information so your child's clinician can interpret the evidence in context."
          isCollapsible
          collapsibleIndicator="plus-minus"
        />
      </div>
    );
  }

  if (storyId === "hero-quote-card") {
    return (
      <HeroQuoteCard
        variant={states ? "green" : "default"}
        kicker="Current summary"
        quote="Noah's Assessment Package is ready for review and has been shared with your child's clinician."
        action={<Button variant={states ? "white" : "secondary"}>Open profile</Button>}
        className="max-w-3xl"
      />
    );
  }

  if (storyId === "plan-progress-card") {
    return (
      <div className="h-[300px] max-w-sm">
        <PlanProgressCard
          title="Assessment progress"
          progress={states ? 100 : 65}
          statusText={states ? "submitted — Report shared" : "on track — steady progress"}
          nextReview={states ? "" : "24 Jul 2026"}
          className="h-full bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)]"
        />
      </div>
    );
  }

  if (storyId === "evidence-badge") {
    return (
      <div className="flex flex-wrap items-center gap-8">
        <EvidenceBadge level={1} />
        <EvidenceBadge level={2} />
        <EvidenceBadge level={3} />
      </div>
    );
  }

  if (storyId === "question-option") {
    const answers = states ? ["Never", "Sometimes", "Often"] : ["Rarely", "Often"];
    return (
      <div className="max-w-2xl space-y-3">
        {answers.map((answer, index) => (
          <QuestionOption
            key={answer}
            marker={String.fromCharCode(65 + index)}
            selected={selectedAnswer === answer}
            onClick={() => setSelectedAnswer(answer)}
          >
            {answer}
          </QuestionOption>
        ))}
      </div>
    );
  }

  if (storyId === "article-item") {
    return (
      <div className="max-w-2xl space-y-2">
        <ListItemCard
          role="button"
          tabIndex={0}
          active={states}
          className="bg-[var(--color-thread-off-white)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/30"
        >
          See the Assessment Package and how to read it
        </ListItemCard>
      </div>
    );
  }

  if (storyId === "article-card") {
    return (
      <div className="max-w-md">
        <GuideCard
          category="Tools & Templates"
          title="Developing a Calming Bedtime Wind-Down"
          description="A visual template with calming colour shifts — steps to swap screen time for sensory, hands-on cues that help Noah settle."
          readTime="8 min read"
          image={articleImage}
          onClick={() => undefined}
          secondaryActionText={states ? "Saved" : undefined}
          onSecondaryAction={states ? () => undefined : undefined}
        />
      </div>
    );
  }

  if (storyId === "file-item") {
    const filesToShow = states ? DOC_LOCKER_FILES.slice(0, 2) : DOC_LOCKER_FILES;

    return (
      <div className="flex max-w-4xl flex-col gap-3 bg-[var(--color-thread-off-white)] p-3">
        {filesToShow.map((file, index) => (
          <FileItem
            key={file.id}
            {...file}
            shared={docShareStates[file.id]}
            cornerClass={getRotatingCornerClass(index, 20)}
            onToggleShare={() => setDocShareStates((current) => ({
              ...current,
              [file.id]: !current[file.id],
            }))}
          />
        ))}
      </div>
    );
  }

  if (storyId === "locker-item") {
    return (
      <div className="max-w-sm">
        <LockerItem
          icon={<FileCheck2 className="h-5 w-5" />}
          title="Assessment Package"
          description="See the organised evidence prepared for clinical review."
          action="Open file"
        />
      </div>
    );
  }

  if (storyId === "clinical-highlight") {
    return (
      <ClinicalHighlight icon={<Info className="h-5 w-5" />} title="Why this matters" className="max-w-2xl">
        Development and health details help your child’s clinician interpret assessment evidence in context.
      </ClinicalHighlight>
    );
  }

  if (storyId === "action-prompt") {
    return (
      <ActionPromptPanel
        label="Next step"
        title="Add school information."
        description="Invite a teacher or add information you already have from school."
        action={<Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>}
      />
    );
  }

  if (storyId === "not-sure-prompt") {
    return <QuestionNotSurePrompt marked={notSure} onMark={() => setNotSure((value) => !value)} />;
  }

  if (storyId === "settings-child-profile-row") {
    const profiles = states ? SETTINGS_PROFILES : SETTINGS_PROFILES.slice(0, 1);

    return (
      <>
        <div className="max-w-3xl space-y-4">
          {profiles.map((profile, index) => (
          <div
            key={profile.name}
            className={cn(
              "flex items-center justify-between gap-6 bg-white p-6 transition-all",
              profile.active
                ? "thread-profile-card--active"
                : "shadow-premium-light hover:shadow-md",
              index % 2 === 0 ? "rounded-tr-[24px]" : "rounded-bl-[24px]",
            )}
          >
            <div className="flex min-w-0 items-center gap-4">
              <Avatar
                size="lg"
                fallback={profile.initial}
                className="thread-settings-avatar shrink-0 bg-[var(--color-thread-light-green)] font-serif text-[1.2rem] text-[var(--color-thread-mid-green)]"
              />
              <div className="min-w-0">
                <h3 className="text-[1.1rem] font-medium tracking-tight text-slate-900">
                  {profile.name}
                </h3>
                <p className="mt-0.5 text-sm text-[var(--color-thread-muted-text)]">
                  {profile.detail}
                </p>
              </div>
            </div>
            <Button
              variant="danger"
              type="button"
              onClick={() => setDeleteProfileOpen(true)}
              className="h-11 w-11 shrink-0 px-0 py-0"
              aria-label={`Delete ${profile.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          ))}
        </div>
        <SettingsDeleteProfileModal
          open={deleteProfileOpen}
          onClose={() => setDeleteProfileOpen(false)}
        />
      </>
    );
  }

  if (storyId === "settings-access-option") {
    return (
      <div className="grid max-w-2xl grid-cols-1 gap-3.5 sm:grid-cols-2">
        <SettingsAccessOption
          value="full"
          selected={settingsAccess === "full"}
          onSelect={setSettingsAccess}
        />
        <SettingsAccessOption
          value="partial"
          selected={settingsAccess === "partial"}
          onSelect={setSettingsAccess}
        />
      </div>
    );
  }

  if (storyId === "settings-secondary-user-row") {
    return (
      <div className="flex max-w-3xl flex-col justify-between gap-5 rounded-tr-[24px] bg-white p-6 shadow-premium-light transition-all sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar
            size="lg"
            fallback="AM"
            className="thread-settings-avatar shrink-0 bg-[var(--color-thread-light-green)] font-serif text-base text-[var(--color-thread-mid-green)]"
          />
          <div className="min-w-0">
            <h3 className="text-[1.1rem] font-medium tracking-tight text-slate-900">Alex Morgan</h3>
            <p className="mt-0.5 break-words text-sm text-[var(--color-thread-muted-text)]">
              Partner · alex.morgan@example.com
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <SegmentedControl<SettingsAccessLevel>
            aria-label="Access level for Alex Morgan"
            options={SETTINGS_ACCESS_OPTIONS}
            value={settingsUserAccess}
            onChange={setSettingsUserAccess}
            className="w-auto min-w-[132px] border border-black/5 bg-slate-100"
            optionClassName="min-h-11 px-3.5 text-xs font-medium"
          />
          <Button
            variant="danger"
            type="button"
            className="h-11 w-11 shrink-0 px-0 py-0"
            aria-label="Remove Alex Morgan"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (storyId === "assessment-module") {
    return (
      <div className="max-w-md">
        <ProcessStepper
          activeStep={activeStep}
          completedSteps={[1]}
          heading="Assessment modules"
          steps={MODULE_STEPS}
          onStepSelect={(step) => setActiveStep(step.num)}
        />
      </div>
    );
  }

  if (storyId === "modal") {
    return (
      <>
        <Button variant="primary" onClick={() => setModalOpen(true)}>Open modal</Button>
        <ModalShell
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          titleId="catalogue-modal-title"
          size="small"
          panelClassName="p-6 sm:p-8"
        >
          <div className="flex items-start justify-between gap-5">
            <div>
              <h2 id="catalogue-modal-title" className="thread-serif-heading text-2xl text-[var(--color-thread-heading)]">Not sure? That’s fine.</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">We’ll mark this as not collected yet so you remember it is open—not blank.</p>
            </div>
            <ModalCloseButton onClick={() => setModalOpen(false)} label="Close modal example" />
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="tertiary" onClick={() => setModalOpen(false)}>Go back</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Mark as not collected</Button>
          </div>
        </ModalShell>
      </>
    );
  }

  if (storyId === "modal-with-sidebar") {
    return (
      <>
        <Button variant="primary" onClick={() => setSidebarModalOpen(true)}>Open module modal</Button>
        <QuestionnaireModuleModalFrame
          isOpen={sidebarModalOpen}
          titleId="catalogue-sidebar-modal-title"
          activeStep={activeStep}
          completedSteps={[1]}
          heading="Assessment modules"
          steps={MODULE_STEPS}
          closeLabel="Close module example"
          onClose={() => setSidebarModalOpen(false)}
          onStepSelect={(step) => setActiveStep(step.num)}
          footer={
            <>
              <Button variant="tertiary" onClick={() => setSidebarModalOpen(false)}>Back</Button>
              <Button variant="primary" onClick={() => setSidebarModalOpen(false)}>Save & continue</Button>
            </>
          }
        >
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-thread-mid-green)]">Module {activeStep}</span>
          <h2 id="catalogue-sidebar-modal-title" className="thread-serif-heading mt-3 text-3xl text-[var(--color-thread-heading)]">{MODULE_STEPS[activeStep - 1]?.title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-thread-muted-text)]">Complete this module at your own pace. You can save and return at any time.</p>
          <div className="mt-8 space-y-3">
            <QuestionOption marker="A" selected={selectedAnswer === "Often"} onClick={() => setSelectedAnswer("Often")}>Often</QuestionOption>
            <QuestionOption marker="B" selected={selectedAnswer === "Sometimes"} onClick={() => setSelectedAnswer("Sometimes")}>Sometimes</QuestionOption>
          </div>
        </QuestionnaireModuleModalFrame>
      </>
    );
  }

  if (storyId === "child-overview") {
    return (
      <section className="max-w-5xl border-b border-black/5 pb-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-thread-mid-green)] font-serif text-[1.05rem] font-medium text-white shadow-sm">N</div>
            <div>
              <h2 className="thread-profile-heading">Noah's Profile</h2>
              <span className="mt-1 block text-sm font-medium text-[var(--color-thread-muted-text)]">Age 9</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[1.5fr_1fr] gap-6 max-md:grid-cols-1 max-md:gap-y-8">
          <HeroQuoteCard
            variant={states ? "green" : "default"}
            className="h-auto p-8 md:h-[300px]"
            kicker="Current summary"
            quote="Noah's Assessment Package is ready for review and has been shared with your child's clinician."
            action={<Button variant={states ? "white" : "secondary"}>Open profile</Button>}
          />
          <div className="h-auto md:h-[300px]">
            <PlanProgressCard
              title="Assessment progress"
              progress={100}
              statusText="submitted — Report shared"
              nextReview=""
              className="h-full bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)]"
            />
          </div>
        </div>
      </section>
    );
  }

  if (storyId === "help-centre-list") {
    return (
      <section className="max-w-3xl bg-white p-6 sm:p-8">
        <SectionLabel>From Help Centre</SectionLabel>
        <h3 className="thread-optional-sans-heading mt-2 font-serif text-[1.28rem] leading-tight tracking-tight text-[var(--color-thread-heading)]">
          Three guides to help you understand the Assessment Package and your files.
        </h3>
        <div className="mt-5 space-y-2">
          {ASSESSMENT_PACKAGE_ARTICLES.map((articleTitle, index) => (
            <ListItemCard
              key={articleTitle}
              role="button"
              tabIndex={0}
              active={states && index === 0}
              className="bg-[var(--color-thread-off-white)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/30"
            >
              {articleTitle}
            </ListItemCard>
          ))}
        </div>
        <ActionLink variant="forest" as="button" className="mt-5 text-sm">
          Open Help Centre
        </ActionLink>
      </section>
    );
  }

  if (storyId === "doc-locker-file-list") {
    const normalizedSearch = lockerSearch.trim().toLowerCase();
    const displayedFiles = DOC_LOCKER_FILES.filter((file) => {
      const matchesFilter = lockerFilter === "all" || file.typeId === lockerFilter;
      const matchesSearch = !normalizedSearch || file.name.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });

    return (
      <section className="max-w-5xl">
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 stroke-[1.8] text-slate-400" />
          <Input
            type="text"
            placeholder="Search documents…"
            value={lockerSearch}
            onChange={(event) => setLockerSearch(event.target.value)}
            variant="search"
          />
        </div>
        <div className="-mx-3 mb-4 flex snap-x gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {DOC_LOCKER_FILTERS.map((filter) => (
            <FilterTab
              key={filter.id}
              active={lockerFilter === filter.id}
              label={filter.label}
              onClick={() => setLockerFilter(filter.id)}
              className="shrink-0 snap-start"
            />
          ))}
        </div>
        <span className="mb-4 mt-5 block text-xs font-medium text-[var(--color-thread-muted-text)] sm:mt-6 sm:uppercase sm:tracking-[0.12em]">
          {displayedFiles.length} {displayedFiles.length === 1 ? "file" : "files"} · sorted by clinical document type
        </span>
        <div className="flex flex-col gap-3 bg-[var(--color-thread-off-white)] p-3">
          {displayedFiles.map((file, index) => (
            <FileItem
              key={file.id}
              {...file}
              shared={docShareStates[file.id]}
              cornerClass={getRotatingCornerClass(index, 20)}
              onToggleShare={() => setDocShareStates((current) => ({
                ...current,
                [file.id]: !current[file.id],
              }))}
            />
          ))}
        </div>
      </section>
    );
  }

  if (storyId === "resource-featured-guide") {
    return (
      <WatercolorPanel>
        <HeroQuoteCard
          kicker="Featured guide"
          quote="Starting the upcoming school term with confidence."
          showQuotes={false}
          className="mb-0 shadow-premium"
          description="Strategies to manage ADHD-linked morning fatigue and prepare sensory transitions before your child steps into the new classroom."
          action={
            <Button
              variant="secondary"
              className="relative"
              rightIcon={<ChevronRight className="h-3.5 w-3.5 stroke-[2]" />}
            >
              Read article
            </Button>
          }
        />
      </WatercolorPanel>
    );
  }

  if (storyId === "resource-guide-browser") {
    const normalizedSearch = resourceSearch.trim().toLowerCase();
    const filteredGuides = showResourceEmpty
      ? []
      : RESOURCE_GUIDES.filter((guide) => {
          const matchesSearch =
            guide.title.toLowerCase().includes(normalizedSearch) ||
            guide.description.toLowerCase().includes(normalizedSearch);
          const matchesFilter = resourceFilter === "all" || guide.catId === resourceFilter;
          return matchesSearch && matchesFilter;
        });

    const clearResourceFilters = () => {
      setResourceSearch("");
      setResourceFilter("all");
      setShowResourceEmpty(false);
    };

    return (
      <section className="max-w-5xl">
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 stroke-[1.8] text-[var(--color-thread-muted-text)]" />
          <Input
            type="text"
            placeholder="Search guides…"
            value={resourceSearch}
            onChange={(event) => {
              setResourceSearch(event.target.value);
              setShowResourceEmpty(false);
            }}
            variant="search"
          />
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {RESOURCE_FILTERS.map((filter) => (
            <FilterTab
              key={filter.id}
              active={resourceFilter === filter.id}
              label={filter.label}
              onClick={() => {
                setResourceFilter(filter.id);
                setShowResourceEmpty(false);
              }}
            />
          ))}
        </div>
        <span className="mb-6 block text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-thread-muted-text)]">
          {filteredGuides.length} {filteredGuides.length === 1 ? "article" : "articles"} found
        </span>
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {filteredGuides.map((guide, index) => (
              <GuideCard key={guide.title} {...guide} cornerClass={getRotatingCornerClass(index)} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 py-10 text-center text-[var(--color-thread-muted-text)]">
            No guides match your search.
            <ActionLink
              variant="default"
              as="button"
              onClick={clearResourceFilters}
              className="mx-auto mt-3 block font-medium"
            >
              Clear search
            </ActionLink>
          </div>
        )}
      </section>
    );
  }

  if (storyId === "resource-topic-directory") {
    return (
      <div className="grid max-w-5xl grid-cols-3 gap-6 max-md:grid-cols-1">
        {RESOURCE_TOPICS.map((topic, index) => (
          <ListItemCard
            key={topic}
            active={states && index === 0}
            className="border-white/5 bg-white transition-all"
          >
            {topic}
          </ListItemCard>
        ))}
      </div>
    );
  }

  if (storyId === "resource-aids-locker") {
    return (
      <WatercolorPanel innerClassName="grid grid-cols-3 gap-6 max-md:grid-cols-1">
        <LockerItem
          icon={<Download className="h-[19px] w-[19px] stroke-[1.8]" />}
          title="Download templates"
          description="Editable letter templates, transition checklists and customisable behaviour journals."
          action="Download printable PDFs"
          cornerClass="rounded-tl-[32px]"
          className="border border-black/[0.03] shadow-premium"
        />
        <LockerItem
          icon={<Play className="h-[19px] w-[19px] stroke-[1.8]" />}
          title="Watch short videos"
          description="5-minute play-based co-regulation tactics designed for real parents."
          action="Launch video player"
          cornerClass="rounded-tr-[32px]"
          className="border border-black/[0.03] shadow-premium"
        />
        <LockerItem
          icon={<Printer className="h-[19px] w-[19px] stroke-[1.8]" />}
          title="Print classroom guides"
          description="Double-sided sheets designed for teachers, tutors and clinical aides."
          action="Generate print format"
          cornerClass="rounded-br-[32px]"
          className="border border-black/[0.03] shadow-premium"
        />
      </WatercolorPanel>
    );
  }

  if (storyId === "settings-parent-profile") {
    return (
      <div className="grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-[1fr_1.5fr] md:gap-12">
        <div>
          <h2 className="text-[1.1rem] font-medium tracking-tight text-slate-900">
            Parent Metadata
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-thread-muted-text)]">
            Update your contact details and how you&apos;d like to be addressed in the application.
          </p>
        </div>
        <SurfacePanel>
          <div className="mb-6">
            <label
              htmlFor="catalogue-parent-nickname"
              className="mb-2.5 block text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-thread-muted-text)]"
            >
              Primary Parent Nickname
            </label>
            <Input
              id="catalogue-parent-nickname"
              type="text"
              value={settingsNickname}
              onChange={(event) => setSettingsNickname(event.target.value)}
              disabled={states}
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="catalogue-parent-email"
              className="mb-2.5 block text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-thread-muted-text)]"
            >
              Contact Notification Email
            </label>
            <Input
              id="catalogue-parent-email"
              type="email"
              value={settingsEmail}
              onChange={(event) => setSettingsEmail(event.target.value)}
              className="mb-4"
              disabled={states}
            />
            <div className="mb-2 mt-6 flex items-center justify-between gap-5 border-t border-black/5 py-2">
              <span className="text-sm font-medium text-slate-700">
                Receive email notifications
              </span>
              <Switch
                aria-label="Receive email notifications"
                aria-disabled={states}
                checked={settingsNotifications}
                onCheckedChange={(checked) => {
                  if (!states) setSettingsNotifications(checked);
                }}
                className={states ? "cursor-not-allowed opacity-50" : undefined}
              />
            </div>
          </div>
          <Button variant="primary" disabled={states}>
            {states ? "Profile saved" : "Save Parent Profile"}
          </Button>
        </SurfacePanel>
      </div>
    );
  }

  if (storyId === "settings-secondary-user-invite") {
    const canSendInvite = settingsInviteName.trim() !== "" && settingsInviteEmail.trim() !== "";

    return (
      <SurfacePanel className="max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-5">
          <h3 className="text-[1.05rem] font-medium tracking-tight text-slate-900">
            Invite secondary user
          </h3>
          <IconButton
            type="button"
            className="h-8 w-8 border-0 bg-transparent text-[var(--color-thread-muted-text)] hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="mb-5">
          <label
            htmlFor="catalogue-secondary-user-name"
            className="mb-2.5 block text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-thread-muted-text)]"
          >
            Full name
          </label>
          <Input
            id="catalogue-secondary-user-name"
            type="text"
            value={settingsInviteName}
            onChange={(event) => setSettingsInviteName(event.target.value)}
            placeholder="e.g. Alex Morgan"
          />
        </div>
        <div className="mb-5">
          <span className="mb-2.5 block text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-thread-muted-text)]">
            Role
          </span>
          <div className="flex flex-wrap gap-2">
            {SETTINGS_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSettingsRole(role)}
                className={cn(
                  "min-h-[40px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  settingsRole === role
                    ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/40 text-[var(--style-light-surface-text)]"
                    : "border-black/10 bg-white text-slate-600 hover:border-black/20",
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="catalogue-secondary-user-email"
            className="mb-2.5 block text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-thread-muted-text)]"
          >
            Invitation email
          </label>
          <Input
            id="catalogue-secondary-user-email"
            type="email"
            value={settingsInviteEmail}
            onChange={(event) => setSettingsInviteEmail(event.target.value)}
            placeholder="name@example.com"
          />
        </div>
        <div className="mb-7">
          <span className="mb-3 block text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-thread-muted-text)]">
            Access level
          </span>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <SettingsAccessOption
              value="full"
              selected={settingsAccess === "full"}
              onSelect={setSettingsAccess}
            />
            <SettingsAccessOption
              value="partial"
              selected={settingsAccess === "partial"}
              onSelect={setSettingsAccess}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="primary" disabled={!canSendInvite}>
            Send invitation
          </Button>
          <Button variant="tertiary">Cancel</Button>
        </div>
      </SurfacePanel>
    );
  }

  if (storyId === "settings-delete-profile") {
    return (
      <>
        <Button variant="danger" onClick={() => setDeleteProfileOpen(true)}>
          Delete Noah&apos;s profile
        </Button>
        <SettingsDeleteProfileModal
          open={deleteProfileOpen}
          onClose={() => setDeleteProfileOpen(false)}
        />
      </>
    );
  }

  if (storyId === "document-upload") {
    return (
      <div className="max-w-3xl rounded-bl-[32px] bg-white p-5 shadow-premium sm:p-8">
        <span className="text-[0.66rem] font-medium uppercase tracking-[0.16em] text-[var(--color-thread-mid-green)]">Add to locker</span>
        <h3 className="thread-serif-heading mt-3 text-2xl text-[var(--color-thread-heading)]">Add a document for your family.</h3>
        <DocumentUploadDropzone helpId="catalogue-document-upload-help" onClick={() => undefined} />
      </div>
    );
  }

  return (
    <div className="max-w-xl rounded-tr-[28px] bg-white p-6 shadow-premium">
      <div className="flex items-start justify-between gap-6 border-b border-black/[0.08] pb-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-medium text-slate-900">Workspace Mode</h3>
            <p className="mt-1 text-sm text-[var(--color-thread-muted-text)]">Internal product controls</p>
          </div>
        </div>
        <ShieldCheck className="h-5 w-5 text-[var(--color-thread-mid-green)]" />
      </div>
      <div className="mt-5 flex items-center justify-between gap-5 rounded-xl bg-[var(--color-thread-off-white)] p-4">
        <div>
          <div className="text-sm font-medium text-slate-900">MVP Mode</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">Use the focused family workspace and MVP navigation.</div>
        </div>
        <Switch aria-label="MVP Mode" checked={enabled} onCheckedChange={setEnabled} />
      </div>
      <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />} className="mt-5">Open design system</Button>
    </div>
  );
}
