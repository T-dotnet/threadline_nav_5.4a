import type { StoryId } from "./mvpCatalogue";

interface NextExample {
  file: string;
  language: "CSS" | "TSX";
  code: string;
}

const staticExample = (component: string, usage: string): NextExample => ({
  file: `app/examples/${component.toLowerCase()}/page.tsx`,
  language: "TSX",
  code: `import { ${component} } from "@/components/ui/${component}";

export default function Example() {
  return (
    ${usage}
  );
}`,
});

export const NEXT_EXAMPLES: Record<StoryId, NextExample> = {
  colors: {
    file: "app/globals.css",
    language: "CSS",
    code: `:root {
  --color-thread-heading: #0b4636;
  --color-thread-mid-green: #108560;
  --color-thread-light-green: #e6f4ed;
  --color-thread-off-white: #f5f7f6;
}

.page-title {
  color: var(--color-thread-heading);
}`,
  },
  typography: {
    file: "app/layout.tsx",
    language: "TSX",
    code: `import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html className={\`\${inter.variable} \${fraunces.variable}\`}><body>{children}</body></html>;
}`,
  },
  "type-page-titles": staticExample("PageHeader", '<PageHeader title="All Children at a glance." />'),
  "type-section-titles": {
    file: "app/examples/section-heading/page.tsx",
    language: "TSX",
    code: `import { SectionDescription } from "@/components/ui/SectionDescription";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function SectionHeadingExample() {
  return <section><SectionLabel>Areas of focus</SectionLabel><SectionTitle>Assessed clinical domains</SectionTitle><SectionDescription>Clinical findings across key domains.</SectionDescription></section>;
}`,
  },
  "type-card-titles": {
    file: "app/examples/card-title/page.tsx",
    language: "TSX",
    code: `export default function CardTitleExample() {
  return <><h2 className="thread-profile-heading">Noah&apos;s Profile</h2><h3 className="thread-sans-heading text-lg font-medium">Assessment Package</h3></>;
}`,
  },
  "type-body": {
    file: "app/examples/body-copy/page.tsx",
    language: "TSX",
    code: `export default function BodyCopyExample() {
  return <><p className="max-w-[64ch] text-base leading-relaxed text-[var(--color-thread-gray)]">Primary body copy.</p><p className="text-sm leading-relaxed text-slate-600">Supporting explanation.</p></>;
}`,
  },
  "type-labels": {
    file: "app/examples/labels/page.tsx",
    language: "TSX",
    code: `import { SectionLabel } from "@/components/ui/SectionLabel";

export default function LabelExample() {
  return <><SectionLabel>Current summary</SectionLabel><span className="text-sm text-[var(--color-thread-muted-text)]">14 Jul 2026 · Uploaded by you</span></>;
}`,
  },
  "type-controls": {
    file: "app/examples/control-text/page.tsx",
    language: "TSX",
    code: `import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ControlTextExample() {
  return <><Button variant="primary">Continue</Button><Input placeholder="Search documents" /></>;
}`,
  },
  "type-data": staticExample("PlanProgressCard", '<PlanProgressCard progress={65} statusText="on track — steady progress" nextReview="24 Jul 2026" />'),
  spacing: {
    file: "app/examples/spacing/page.tsx",
    language: "TSX",
    code: `export default function SpacingExample() {
  return (
    <section className="space-y-6 p-4 sm:p-8">
      <header className="space-y-2">…</header>
      <div className="flex gap-3">…</div>
    </section>
  );
}`,
  },
  radius: {
    file: "app/examples/radius/page.tsx",
    language: "TSX",
    code: `export default function RadiusExample() {
  return (
    <section className="rounded-none rounded-tr-[24px] bg-[var(--color-thread-light-green)] p-6">
      Threadline feature surface
    </section>
  );
}`,
  },
  elevation: {
    file: "app/globals.css",
    language: "CSS",
    code: `.raised-surface {
  border: 0;
  box-shadow: var(--shadow-premium);
}

.structural-surface {
  border: 1px solid rgb(0 0 0 / 8%);
  box-shadow: none;
}`,
  },
  "image-watercolor": {
    file: "app/examples/watercolor/page.tsx",
    language: "TSX",
    code: `import { WatercolorPanel } from "@/components/ui/WatercolorPanel";

export default function WatercolorExample() {
  return <WatercolorPanel><div className="bg-white p-8">Branded supporting content</div></WatercolorPanel>;
}`,
  },
  "image-editorial": {
    file: "app/examples/editorial-image/page.tsx",
    language: "TSX",
    code: `import Image from "next/image";
import guideImage from "@/assets/images/optimized/abstract-sleep-rhythm-900.jpg";

export default function EditorialImageExample() {
  return <div className="relative aspect-video overflow-hidden"><Image src={guideImage} alt="How Sleep and ADHD Interact in Growing Brains" fill className="object-cover" /></div>;
}`,
  },
  "image-portrait": {
    file: "app/examples/portrait/page.tsx",
    language: "TSX",
    code: `import { Avatar } from "@/components/ui/Avatar";
import clinicianPhoto from "@/assets/images/optimized/dr-naomi-clark-720.jpg";

export default function PortraitExample() {
  return <Avatar src={clinicianPhoto.src} alt="Dr Naomi Clark" size="lg" />;
}`,
  },
  button: {
    file: "app/examples/button/page.tsx",
    language: "TSX",
    code: `import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ButtonExample() {
  return (
    <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
      Continue
    </Button>
  );
}`,
  },
  input: staticExample("Input", '<Input aria-label="Child name" placeholder="Enter name" />'),
  badge: staticExample("Badge", '<Badge variant="active">Active</Badge>'),
  switch: {
    file: "app/examples/switch/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/Switch";

export default function SwitchExample() {
  const [enabled, setEnabled] = useState(true);
  return <Switch aria-label="MVP Mode" checked={enabled} onCheckedChange={setEnabled} />;
}`,
  },
  "filter-tab": {
    file: "app/examples/filter-tab/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { FilterTab } from "@/components/ui/FilterTab";

export default function FilterExample() {
  const [active, setActive] = useState("All files");
  return <FilterTab label="All files" active={active === "All files"} onClick={() => setActive("All files")} />;
}`,
  },
  "action-link": staticExample("ActionLink", '<ActionLink as="button">Open profile</ActionLink>'),
  "icon-button": {
    file: "app/examples/icon-button/page.tsx",
    language: "TSX",
    code: `import { Bell } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

export default function IconButtonExample() {
  return <IconButton aria-label="Notifications" hasBadge><Bell className="h-4 w-4" /></IconButton>;
}`,
  },
  "segmented-control": {
    file: "app/examples/segmented-control/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const options = [{ value: "overview", label: "Overview" }, { value: "details", label: "Details" }] as const;

export default function SegmentedControlExample() {
  const [view, setView] = useState<"overview" | "details">("overview");
  return <SegmentedControl aria-label="Child view" options={[...options]} value={view} onChange={setView} />;
}`,
  },
  progress: staticExample("ProgressBar", "<ProgressBar value={12} max={17} showLabel />"),
  "page-header": staticExample("PageHeader", '<PageHeader kicker="Family overview" title="All Children at a glance." description="See each child’s progress." />'),
  "checklist-item": staticExample("ChecklistItem", '<ChecklistItem title="Parent questionnaire" description="Completed and ready for review." />'),
  accordion: staticExample("AreaItem", '<AreaItem title="Attention & focus" description="Clinical detail…" isCollapsible collapsibleIndicator="plus-minus" />'),
  "hero-quote-card": staticExample("HeroQuoteCard", '<HeroQuoteCard kicker="Current summary" quote="Noah’s Assessment Package is ready." />'),
  "plan-progress-card": staticExample("PlanProgressCard", '<PlanProgressCard progress={65} statusText="On track — steady progress" nextReview="24 Jul 2026" />'),
  "evidence-badge": staticExample("EvidenceBadge", '<EvidenceBadge level={2} label="Moderate evidence" />'),
  "question-option": {
    file: "app/examples/question-option/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { QuestionOption } from "@/components/ui/QuestionOption";

export default function QuestionOptionExample() {
  const [selected, setSelected] = useState(false);
  return <QuestionOption marker="A" selected={selected} onClick={() => setSelected(true)}>Often</QuestionOption>;
}`,
  },
  "article-item": {
    file: "app/examples/article-item/page.tsx",
    language: "TSX",
    code: `import { ListItemCard } from "@/components/ui/ListItemCard";

export default function ArticleItemExample() {
  return <ListItemCard role="button" tabIndex={0}>See the Assessment Package and how to read it</ListItemCard>;
}`,
  },
  "article-card": {
    file: "app/examples/article-card/page.tsx",
    language: "TSX",
    code: `import { GuideCard } from "@/components/ui/GuideCard";
import articleImage from "@/assets/images/optimized/abstract-bedtime-wind-down-900.jpg";

export default function ArticleCardExample() {
  return <GuideCard category="Tools & Templates" title="Developing a Calming Bedtime Wind-Down" description="A visual template with calming colour shifts." readTime="8 min read" image={articleImage.src} />;
}`,
  },
  "file-item": {
    file: "app/examples/doc-locker-file-item/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { FileItem } from "@/components/ui/FileItem";

export default function FileItemExample() {
  const [shared, setShared] = useState(false);
  return <FileItem name="Actionable Clarity Report" typeName="Report" childName="Maya" date="8 Jun 2026" uploadedBy="threadline" shared={shared} sharedWith="your care circle" icon={FileText} onToggleShare={() => setShared(!shared)} />;
}`,
  },
  "locker-item": {
    file: "app/examples/locker-item/page.tsx",
    language: "TSX",
    code: `import { FileCheck2 } from "lucide-react";
import { LockerItem } from "@/components/ui/LockerItem";

export default function LockerItemExample() {
  return <LockerItem icon={<FileCheck2 />} title="Assessment Package" description="See the organised evidence." action="Open file" />;
}`,
  },
  "clinical-highlight": staticExample("ClinicalHighlight", '<ClinicalHighlight title="Why this matters">Health details support clinical review.</ClinicalHighlight>'),
  "action-prompt": {
    file: "app/examples/action-prompt/page.tsx",
    language: "TSX",
    code: `import { ActionPromptPanel } from "@/components/ui/ActionPromptPanel";
import { Button } from "@/components/ui/Button";

export default function ActionPromptExample() {
  return <ActionPromptPanel label="Next step" title="Add school information." description="Invite a teacher or add a file." action={<Button variant="primary">Continue</Button>} />;
}`,
  },
  "not-sure-prompt": {
    file: "app/examples/not-sure/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { QuestionNotSurePrompt } from "@/components/ui/QuestionNotSurePrompt";

export default function NotSureExample() {
  const [marked, setMarked] = useState(false);
  return <QuestionNotSurePrompt marked={marked} onMark={() => setMarked(!marked)} />;
}`,
  },
  "settings-child-profile-row": {
    file: "app/settings/SettingsChildProfileRow.tsx",
    language: "TSX",
    code: `import { Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export function SettingsChildProfileRow({ child, active, onDelete }) {
  return <div className={active ? "thread-profile-card--active flex items-center justify-between gap-6 bg-white p-6" : "flex items-center justify-between gap-6 bg-white p-6 shadow-premium-light"}><div className="flex items-center gap-4"><Avatar size="lg" fallback={child.initial} className="thread-settings-avatar bg-[var(--color-thread-light-green)] font-serif text-[var(--color-thread-mid-green)]" /><div><h3 className="text-[1.1rem] font-medium">{child.name}</h3><p className="text-sm text-[var(--color-thread-muted-text)]">{child.summary}</p></div></div><Button variant="danger" className="h-11 w-11 px-0" aria-label={\`Delete \${child.name}\`} onClick={onDelete}><Trash2 className="h-4 w-4" /></Button></div>;
}`,
  },
  "settings-access-option": {
    file: "app/settings/AccessOption.tsx",
    language: "TSX",
    code: `import { ShieldCheck, ShieldHalf } from "lucide-react";

export function AccessOption({ value, selected, onSelect }) {
  const full = value === "full";
  const Icon = full ? ShieldCheck : ShieldHalf;
  return <button type="button" onClick={() => onSelect(value)} className={selected ? "flex min-h-16 items-start gap-3 rounded-2xl border border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 p-4 text-left ring-2 ring-[var(--color-thread-mid-green)]/10" : "flex min-h-16 items-start gap-3 rounded-2xl border border-black/5 bg-slate-50/40 p-4 text-left"}><Icon className="mt-0.5 h-5 w-5 text-[var(--color-thread-mid-green)]" /><span><strong className="block font-medium">{full ? "Full access" : "Partial access"}</strong><span className="text-xs text-[var(--color-thread-muted-text)]">{full ? "Sees and manages everything you can" : "Limited scope — configurable soon"}</span></span></button>;
}`,
  },
  "settings-secondary-user-row": {
    file: "app/settings/SettingsWorkspaceUserRow.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const options = [{ value: "full", label: "Full" }, { value: "partial", label: "Partial" }] as const;

export function SettingsWorkspaceUserRow() {
  const [access, setAccess] = useState<"full" | "partial">("full");
  return <div className="flex flex-col justify-between gap-5 bg-white p-6 shadow-premium-light sm:flex-row sm:items-center"><div className="flex items-center gap-4"><Avatar size="lg" fallback="AM" /><div><h3 className="font-medium">Alex Morgan</h3><p className="text-sm text-[var(--color-thread-muted-text)]">Partner · alex.morgan@example.com</p></div></div><div className="flex items-center gap-2.5"><SegmentedControl aria-label="Access level for Alex Morgan" options={[...options]} value={access} onChange={setAccess} /><Button variant="danger" className="h-11 w-11 px-0" aria-label="Remove Alex Morgan"><Trash2 className="h-4 w-4" /></Button></div></div>;
}`,
  },
  "assessment-module": {
    file: "app/examples/assessment-module/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { ProcessStepper } from "@/components/ui/ProcessStepper";

const steps = [
  { num: 1, title: "Child & Family Profile" },
  { num: 2, title: "Development & Medical History" },
];

export default function AssessmentModuleExample() {
  const [activeStep, setActiveStep] = useState(1);
  return <ProcessStepper activeStep={activeStep} heading="Assessment modules" steps={steps} onStepSelect={(step) => setActiveStep(step.num)} />;
}`,
  },
  modal: {
    file: "app/examples/modal/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ModalCloseButton, ModalShell } from "@/components/ui/ModalShell";

export default function ModalExample() {
  const [open, setOpen] = useState(false);
  return <><Button onClick={() => setOpen(true)}>Open modal</Button><ModalShell isOpen={open} titleId="modal-title" onRequestClose={() => setOpen(false)}><div className="p-8"><ModalCloseButton label="Close" onClick={() => setOpen(false)} /><h2 id="modal-title">Modal title</h2></div></ModalShell></>;
}`,
  },
  "modal-with-sidebar": {
    file: "app/examples/module-modal/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { QuestionnaireModuleModalFrame } from "@/components/assessment/QuestionnaireModuleModalFrame";

const steps = [{ num: 1, title: "Profile" }, { num: 2, title: "Development" }];

export default function ModuleModalExample() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(1);
  return <QuestionnaireModuleModalFrame isOpen={open} titleId="module-title" activeStep={step} heading="Assessment modules" steps={steps} closeLabel="Close modules" onClose={() => setOpen(false)} onStepSelect={(item) => setStep(item.num)}><h2 id="module-title">{steps[step - 1].title}</h2></QuestionnaireModuleModalFrame>;
}`,
  },
  "child-overview": {
    file: "app/all-children/ChildOverview.tsx",
    language: "TSX",
    code: `import { HeroQuoteCard } from "@/components/ui/HeroQuoteCard";
import { PlanProgressCard } from "@/components/ui/PlanProgressCard";

export function ChildOverview() {
  return <section><header><h2>Noah&apos;s Profile</h2><p>Age 9</p></header><div className="grid gap-6 md:grid-cols-[1.5fr_1fr]"><HeroQuoteCard kicker="Current summary" quote="Noah’s Assessment Package is ready." /><PlanProgressCard progress={100} statusText="submitted — Report shared" nextReview="" /></div></section>;
}`,
  },
  "help-centre-list": {
    file: "app/assessment/HelpCentreArticleList.tsx",
    language: "TSX",
    code: `import { ActionLink } from "@/components/ui/ActionLink";
import { ListItemCard } from "@/components/ui/ListItemCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

const articles = [
  "See the Assessment Package and how to read it",
  "Evidence used in Assessment Package",
  "File ownership. Manage files access using Doc locker",
];

export function HelpCentreArticleList() {
  return <section><SectionLabel>From Help Centre</SectionLabel><h3>Three guides to help you understand the Assessment Package and your files.</h3><div>{articles.map((title) => <ListItemCard key={title}>{title}</ListItemCard>)}</div><ActionLink href="/resources">Open Help Centre</ActionLink></section>;
}`,
  },
  "doc-locker-file-list": {
    file: "app/documents/DocLockerFileList.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { FileText, Search } from "lucide-react";
import { FileItem } from "@/components/ui/FileItem";
import { FilterTab } from "@/components/ui/FilterTab";
import { Input } from "@/components/ui/Input";

export function DocLockerFileList() {
  const [filter, setFilter] = useState("all");
  const [shared, setShared] = useState(false);

  return <section><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2" /><Input variant="search" placeholder="Search documents…" /></div><div className="flex gap-2"><FilterTab active={filter === "all"} label="All files" onClick={() => setFilter("all")} /><FilterTab active={filter === "report"} label="Report" onClick={() => setFilter("report")} /></div><FileItem name="Actionable Clarity Report" typeName="Report" childName="Maya" date="8 Jun 2026" uploadedBy="threadline" shared={shared} sharedWith="your care circle" icon={FileText} onToggleShare={() => setShared(!shared)} /></section>;
}`,
  },
  "resource-featured-guide": {
    file: "app/resources/FeaturedGuide.tsx",
    language: "TSX",
    code: `import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroQuoteCard } from "@/components/ui/HeroQuoteCard";
import { WatercolorPanel } from "@/components/ui/WatercolorPanel";

export function FeaturedGuide() {
  return <WatercolorPanel><HeroQuoteCard kicker="Featured guide" quote="Starting the upcoming school term with confidence." showQuotes={false} description="Strategies to manage ADHD-linked morning fatigue and prepare sensory transitions." action={<Button variant="secondary" rightIcon={<ChevronRight />}>Read article</Button>} /></WatercolorPanel>;
}`,
  },
  "resource-guide-browser": {
    file: "app/resources/ResourceGuideBrowser.tsx",
    language: "TSX",
    code: `"use client";

import { useMemo, useState } from "react";
import { GuideCard } from "@/components/ui/GuideCard";
import { FilterTab } from "@/components/ui/FilterTab";
import { Input } from "@/components/ui/Input";

export function ResourceGuideBrowser({ guides }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const results = useMemo(() => guides.filter((guide) => (filter === "all" || guide.catId === filter) && guide.title.toLowerCase().includes(search.toLowerCase())), [filter, guides, search]);
  return <section><Input variant="search" placeholder="Search guides…" value={search} onChange={(event) => setSearch(event.target.value)} /><div className="flex flex-wrap gap-2"><FilterTab active={filter === "all"} label="All guides" onClick={() => setFilter("all")} /><FilterTab active={filter === "tools"} label="Tools & Templates" onClick={() => setFilter("tools")} /></div><span>{results.length} articles found</span><div className="grid gap-6 md:grid-cols-2">{results.map((guide) => <GuideCard key={guide.title} {...guide} />)}</div></section>;
}`,
  },
  "resource-topic-directory": {
    file: "app/resources/ResourceTopicDirectory.tsx",
    language: "TSX",
    code: `import { ListItemCard } from "@/components/ui/ListItemCard";

const topics = ["Understanding ADHD", "Emotional Regulation", "School Support", "Learning & Cognition", "Daily Routines", "Working with Professionals"];

export function ResourceTopicDirectory() {
  return <div className="grid gap-6 md:grid-cols-3">{topics.map((topic) => <ListItemCard key={topic}>{topic}</ListItemCard>)}</div>;
}`,
  },
  "resource-aids-locker": {
    file: "app/resources/ResourceAidsLocker.tsx",
    language: "TSX",
    code: `import { Download, Play, Printer } from "lucide-react";
import { LockerItem } from "@/components/ui/LockerItem";
import { WatercolorPanel } from "@/components/ui/WatercolorPanel";

export function ResourceAidsLocker() {
  return <WatercolorPanel innerClassName="grid gap-6 md:grid-cols-3"><LockerItem icon={<Download />} title="Download templates" description="Editable letter templates and checklists." action="Download printable PDFs" /><LockerItem icon={<Play />} title="Watch short videos" description="5-minute play-based co-regulation tactics." action="Launch video player" /><LockerItem icon={<Printer />} title="Print classroom guides" description="Double-sided sheets for teachers and tutors." action="Generate print format" /></WatercolorPanel>;
}`,
  },
  "settings-parent-profile": {
    file: "app/settings/ParentProfileSettings.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SurfacePanel } from "@/components/ui/SurfacePanel";
import { Switch } from "@/components/ui/Switch";

export function ParentProfileSettings() {
  const [notifications, setNotifications] = useState(true);
  return <SurfacePanel><label>Primary Parent Nickname</label><Input defaultValue="Primary parent" /><label>Contact Notification Email</label><Input type="email" defaultValue="parent.threadline@example.com" /><div className="flex items-center justify-between"><span>Receive email notifications</span><Switch checked={notifications} onCheckedChange={setNotifications} /></div><Button variant="primary">Save Parent Profile</Button></SurfacePanel>;
}`,
  },
  "settings-secondary-user-invite": {
    file: "app/settings/SecondaryUserInvite.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { AccessOption } from "./AccessOption";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SurfacePanel } from "@/components/ui/SurfacePanel";

export function SecondaryUserInvite() {
  const [access, setAccess] = useState<"full" | "partial">("full");
  return <SurfacePanel><h3>Invite secondary user</h3><Input aria-label="Full name" placeholder="e.g. Alex Morgan" /><div className="flex gap-2"><button>Partner</button><button>Teacher</button><button>Family member</button><button>Carer</button></div><Input aria-label="Invitation email" type="email" placeholder="name@example.com" /><div className="grid gap-3.5 sm:grid-cols-2"><AccessOption value="full" selected={access === "full"} onSelect={setAccess} /><AccessOption value="partial" selected={access === "partial"} onSelect={setAccess} /></div><div className="flex gap-3"><Button variant="primary">Send invitation</Button><Button variant="tertiary">Cancel</Button></div></SurfacePanel>;
}`,
  },
  "settings-delete-profile": {
    file: "app/settings/DeleteProfileModal.tsx",
    language: "TSX",
    code: `import { Button } from "@/components/ui/Button";
import { ModalCloseButton, ModalShell } from "@/components/ui/ModalShell";

export function DeleteProfileModal({ open, childName, onCancel, onConfirm }) {
  return <ModalShell isOpen={open} onRequestClose={onCancel} titleId="delete-profile-title" size="small" panelClassName="relative p-7"><ModalCloseButton label="Close delete child profile confirmation" onClick={onCancel} /><span className="text-xs font-medium uppercase tracking-[0.16em] text-rose-600">Delete profile</span><h2 id="delete-profile-title" className="mt-3 font-serif text-[1.8rem]">Delete {childName}&apos;s profile?</h2><p className="mt-4 text-sm text-slate-600">This removes the child profile from Registered Children Profiles. This action cannot be undone.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end"><Button variant="tertiary" onClick={onCancel}>Cancel</Button><Button variant="dangerSolid" onClick={onConfirm}>Delete profile</Button></div></ModalShell>;
}`,
  },
  "document-upload": staticExample("DocumentUploadDropzone", "<DocumentUploadDropzone />"),
  "workspace-mode": {
    file: "app/examples/workspace-mode/page.tsx",
    language: "TSX",
    code: `"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/Switch";

export default function WorkspaceModeExample() {
  const [isMvp, setIsMvp] = useState(true);
  return <Switch aria-label="MVP Mode" checked={isMvp} onCheckedChange={setIsMvp} />;
}`,
  },
};
