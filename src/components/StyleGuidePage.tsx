import { motion } from "motion/react";
import { 
  Palette, 
  Type, 
  Layers, 
  ToggleLeft, 
  Check, 
  Copy, 
  ExternalLink,
  Sparkles,
  Info,
  Sliders,
  Code,
  Terminal,
  RefreshCw,
  Play,
  Heart,
  HelpCircle,
  Eye,
  CreditCard,
  Star,
  Bookmark,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Activity,
  ArrowUpRight,
  Minus,
  Plus,
  FileText,
  Share2,
  Lock,
  Settings,
  Database,
  Users,
  Layout,
  Maximize,
  Columns,
  ShieldCheck,
  ShieldHalf
} from "lucide-react";
import { useState } from "react";
import { Page } from "../types";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { ProgressBar } from "./ui/ProgressBar";
import { ActionLink } from "./ui/ActionLink";
import { PlanProgressCard } from "./ui/PlanProgressCard";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { cn } from "../lib/utils";
import { AreaItem } from "./ui/AreaItem";
import { TimelineItem } from "./ui/TimelineItem";
import { ClinicalWeighting } from "./ui/ClinicalWeighting";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { EvidenceBadge } from "./ui/EvidenceBadge";
import { InsightCard } from "./ui/InsightCard";
import { LockerItem } from "./ui/LockerItem";
import { Switch } from "./ui/Switch";
import { FilterTab } from "./ui/FilterTab";
import { FileItem } from "./ui/FileItem";
import { IconButton } from "./ui/IconButton";
import { QuickLink } from "./ui/QuickLink";
import { ValueCard } from "./ui/ValueCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { AICopilotBar } from "./ui/AICopilotBar";
import { ChecklistItem } from "./ui/ChecklistItem";
import { THREADLINE_THEME_TOKENS } from "../lib/visualStyles";

import { PageContainer } from "./ui/PageContainer";

interface StyleGuidePageProps {
  onPageChange: (page: Page) => void;
}

export default function StyleGuidePage({ onPageChange }: StyleGuidePageProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Live Component Playground States
  const [pgVariant, setPgVariant] = useState<'mint' | 'slate' | 'white' | 'muted' | 'link' | 'forest'>('forest');
  const [pgText, setPgText] = useState('Explore Clinical Insights');
  const [pgIsLoading, setPgIsLoading] = useState(false);
  const [pgIsDisabled, setPgIsDisabled] = useState(false);
  const [pgLeftIcon, setPgLeftIcon] = useState(true);
  const [pgRightIcon, setPgRightIcon] = useState(false);
  const [pgPreviewBg, setPgPreviewBg] = useState<'light' | 'forest' | 'slate'>('light');
  const [pgLogs, setPgLogs] = useState<string[]>([
    `Playground successfully initialized with 'forest' variant.`
  ]);

  // Interactive Card Template states
  const [genericCardStatus, setGenericCardStatus] = useState<'active' | 'completed'>('active');
  const [prioritySubtasks, setPrioritySubtasks] = useState<boolean[]>([true, false, false]);
  const [strategyExpanded, setStrategyExpanded] = useState<boolean>(true);
  const [valueCardForest, setValueCardForest] = useState<boolean>(true);
  const [resourceBookmarked, setResourceBookmarked] = useState<boolean>(false);
  const [quarterProgressValue, setQuarterProgressValue] = useState<number>(75);
  const [synthesisExpanded, setSynthesisExpanded] = useState<boolean>(false);
  const [demoSwitchOn, setDemoSwitchOn] = useState<boolean>(true);
  const [demoProgress, setDemoProgress] = useState<number>(45);
  const [demoFilter, setDemoFilter] = useState<string>("classroom");
  const [demoFileShared, setDemoFileShared] = useState<boolean>(true);
  const [demoUserAccess, setDemoUserAccess] = useState<'full' | 'partial'>('full');

  // Dynamic Theme States inside StyleGuidePage
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("thread-theme") || "energetic";
    } catch {
      return "energetic";
    }
  });
  const [font, setFont] = useState(() => {
    try {
      return localStorage.getItem("thread-font") || "modern-serif";
    } catch {
      return "modern-serif";
    }
  });
  const [heroStyle, setHeroStyle] = useState(() => {
    try {
      return localStorage.getItem("thread-hero-style") || "white";
    } catch {
      return "white";
    }
  });
  const [secondaryStyle, setSecondaryStyle] = useState(() => {
    try {
      return localStorage.getItem("thread-secondary-style") || "light";
    } catch {
      return "light";
    }
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    try {
      localStorage.setItem("thread-theme", newTheme);
    } catch (e) {
      console.warn(e);
    }
    document.documentElement.setAttribute("data-theme", newTheme);
    addLog(`Switched global theme to: ${newTheme === 'energetic' ? 'Energetic Mint' : 'Classic Vintage'}`);
  };

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
    try {
      localStorage.setItem("thread-font", newFont);
    } catch (e) {
      console.warn(e);
    }
    document.documentElement.setAttribute("data-font", newFont);
    addLog(`Switched serif typeface to: ${newFont === 'modern-serif' ? 'Fraunces' : 'Frank Ruhl Libre'}`);
  };

  const handleHeroStyleChange = (newStyle: string) => {
    setHeroStyle(newStyle);
    try {
      localStorage.setItem("thread-hero-style", newStyle);
    } catch (e) {
      console.warn(e);
    }
    document.documentElement.setAttribute("data-hero-style", newStyle);
    addLog(`Switched primary hero style to: ${newStyle === 'white' ? 'White Canvas' : 'Solid Accent'}`);
  };

  const handleSecondaryStyleChange = (newStyle: string) => {
    setSecondaryStyle(newStyle);
    try {
      localStorage.setItem("thread-secondary-style", newStyle);
    } catch (e) {
      console.warn(e);
    }
    document.documentElement.setAttribute("data-hero-secondary", newStyle);
    addLog(`Switched secondary background highlight to: ${newStyle === 'light' ? 'Mint Soft' : 'Forest Dark'}`);
  };

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setPgLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(null), 2000);
      } else {
        throw new Error('Clipboard not available');
      }
    } catch (err) {
      console.warn('Failed to copy text: ', err);
    }
  };

  const activeThemeTokens = THREADLINE_THEME_TOKENS[theme] ?? THREADLINE_THEME_TOKENS.energetic;

  // Color Definitions from index.css
  const colors = [
    { 
      name: "Mid Green (Primary Accent)", 
      value: activeThemeTokens.midGreen, 
      variable: "var(--color-thread-mid-green)", 
      desc: "Main brand action color, active states, active progression bars. Consolidated with Theme Forest and Deep Forest." 
    },
    { 
      name: "Light Green (Soft Background)", 
      value: activeThemeTokens.lightGreen, 
      variable: "var(--color-thread-light-green)", 
      desc: "Subtle backgrounds, select item states, buttons highlight background" 
    },
    { 
      name: "Heading Green", 
      value: activeThemeTokens.heading, 
      variable: "var(--color-thread-heading)", 
      desc: "Primary heading color, used for titles and core identity typography." 
    },
    { 
      name: "Darkest (High Contrast)", 
      value: activeThemeTokens.darkest, 
      variable: "var(--color-thread-darkest)", 
      desc: "Deepest emerald for maximum contrast text and dark UI elements." 
    },
    { 
      name: "Cream (Warm Contrast)", 
      value: "#EEE9D9", 
      variable: "var(--color-thread-cream)", 
      desc: "Cozy warm layout dividers, container outlines, retro accents" 
    },
    { 
      name: "Off White (Main Canvas)", 
      value: activeThemeTokens.offWhite, 
      variable: "var(--color-thread-off-white)", 
      desc: "Body and slate-level background canvases across pages" 
    },
    { 
      name: "Dark Slate (Body Copy)", 
      value: "#1F2937", 
      variable: "var(--color-thread-dark-slate)", 
      desc: "Standard high contrast reading text and labels" 
    },
    { 
      name: "Gray (Secondary Text)", 
      value: "#6B7280", 
      variable: "var(--color-thread-gray)", 
      desc: "De-emphasized subtitles, clinical review timestamps, metadata" 
    },
  ];

  // Font families description from index.css and source code
  const fonts = [
    {
      family: `Hero Page Title (${font === 'modern-serif' ? 'Fraunces' : 'Frank Ruhl'} display)`,
      usage: "Primary visual anchor of main pages. Sets an empathetic, premium, human clinical-arts mood.",
      sample: "Here's where to put your energy today, Sarah.",
      classes: "font-serif text-[3.8rem] leading-[4.3rem] tracking-[-0.075rem] text-[var(--color-thread-heading)]",
      size: "3.8rem (60.8px)",
      lineHeight: "4.3rem (68.8px)",
      weight: "400 (Regular)"
    },
    {
      family: `Subheading / Key Quote (${font === 'modern-serif' ? 'Fraunces' : 'Frank Ruhl'} serif)`,
      usage: "Key synthesis callouts, clinician diagnosis blocks, and core priority summaries.",
      sample: "“Maya is showing marked improvements in auditory processing, though focus remains heavily tethered to circadian stability.”",
      classes: "font-serif text-[1.55rem] leading-[1.34] tracking-tight text-[var(--hero-text)] font-normal",
      size: "1.55rem (24.8px)",
      lineHeight: "1.34 (33.2px)",
      weight: "400 (Regular)"
    },
    {
      family: `Card Title / Section Header (${font === 'modern-serif' ? 'Fraunces' : 'Frank Ruhl'} medium-serif)`,
      usage: "Container category headers, interactive module titles, and diagnostic row headers.",
      sample: "Transition Support & School Letters",
      classes: "font-serif text-[1.25rem] text-[var(--color-thread-heading)] font-normal",
      size: "1.25rem (20px)",
      lineHeight: "Default",
      weight: "400 (Regular)"
    },
    {
      family: `Child Row Card Title (${font === 'modern-serif' ? 'Fraunces' : 'Frank Ruhl'} medium-serif)`,
      usage: "Individual child visual cards and directory list main titles.",
      sample: "Maya",
      classes: "font-serif font-normal text-[1.8rem] tracking-tight leading-none text-[var(--color-thread-heading)]",
      size: "1.8rem (28.8px)",
      lineHeight: "1 (none)",
      weight: "400 (Regular)"
    },
    {
      family: `Clinician Synthesis Quote (${font === 'modern-serif' ? 'Fraunces' : 'Frank Ruhl'} serif)`,
      usage: "Compact clinician summary narratives, professional quotes, and clinical evidence callouts.",
      sample: "“Maya finds it hard to sustain focus in structured tasks, especially in the classroom.”",
      classes: "font-serif font-normal text-[1.38rem] leading-[1.4] tracking-tight text-[var(--color-thread-heading)]",
      size: "1.38rem (22px)",
      lineHeight: "1.4 (30.8px)",
      weight: "400 (Regular)"
    },
    {
      family: 'Large Sans-Serif Page/Section Header (Sans-serif Medium)',
      usage: "Primary visual headings for high level clinical content groupings (such as 'Strengths to build on.').",
      sample: "Strengths to build on.",
      classes: "font-sans font-medium text-[2rem] leading-[1.05] tracking-[-1.12px] text-[var(--color-thread-heading)]",
      size: "2rem (32px)",
      lineHeight: "1.05 (33.6px)",
      weight: "500 (Medium)"
    },
    {
      family: 'Secondary Card Heading (Sans-serif Semibold)',
      usage: "Sub-section headings, card inner group titles, and primary grid module names.",
      sample: "Priority Milestones & Development Track",
      classes: "font-sans font-medium text-[1.12rem] tracking-tight text-slate-900",
      size: "1.12rem (17.9px)",
      lineHeight: "Default",
      weight: "600 (Semibold)"
    },
    {
      family: 'Tertiary Widget Heading / Action Label (Sans-serif Small Bold)',
      usage: "Context labels, form section separators, small card item headers, and grid subtitles.",
      sample: "Recommended Focus Area",
      classes: "font-sans font-medium text-[0.88rem] tracking-tight text-slate-800",
      size: "0.88rem (14px)",
      lineHeight: "Default",
      weight: "700 (Bold)"
    },
    {
      family: `Serif Display Numerals & Percentages (${font === 'modern-serif' ? 'Fraunces' : 'Frank Ruhl'} Display)`,
      usage: "Large-format scores, percentages, milestone metrics counters, and key numerical figures.",
      sample: "95% achieved",
      classes: "font-serif text-[3.2rem] leading-none tracking-tight text-[var(--color-thread-heading)]",
      size: "3.2rem (51.2px)",
      lineHeight: "1 (none)",
      weight: "400 (Regular)"
    },
    {
      family: 'Standard Body Copy (Inter Sans UI font)',
      usage: "Core descriptive paragraphs, bullet points, narrative summaries, and form text entry lists.",
      sample: "Strategies to manage ADHD-linked morning fatigue and prepare sensory transitions before she steps into the new classroom layout.",
      classes: "font-sans text-[0.98rem] text-slate-500 leading-relaxed font-normal",
      size: "0.98rem (15.6px)",
      lineHeight: "1.625 (relaxed)",
      weight: "400 (Regular)"
    },
    {
      family: 'Tracked Upper Tags & Labels (Bold upper tracking)',
      usage: "Section dividers, context tags, evidence formulation status ('STRONG FORMULATION'), time of day indicators, and dashboard category prefixes.",
      sample: "STRONG FORMULATION  ·  FAMILY SYNTHESIS  ·  TUESDAY MORNING",
      classes: "text-[0.68rem] tracking-[0.12em] uppercase font-medium text-[var(--color-thread-mid-green)] font-sans",
      size: "0.68rem (10.8px)",
      lineHeight: "Default",
      weight: "700 (Bold)"
    },
    {
      family: 'Interaction Button Copy (Semi-bold Pill Sans)',
      usage: "Primary and secondary action buttons with high click clarity and clean inner spacing curves.",
      sample: "Learn more insights",
      classes: "font-sans font-medium text-[0.82rem] leading-none text-slate-800",
      size: "0.82rem (13px)",
      lineHeight: "1 (none)",
      weight: "600 (Semibold)"
    },
    {
      family: 'Interactive Text Link (Underlined inline action)',
      usage: "Nested page navigators, subtle secondary actions, external references, and toggle buttons.",
      sample: "Style Guide & Design Tokens",
      classes: "font-sans text-[0.84rem] font-medium underline underline-offset-2 text-[var(--color-thread-dark-forest)] hover:text-[var(--color-thread-deep-forest)] transition-colors inline",
      size: "0.84rem (13.4px)",
      lineHeight: "Default",
      weight: "600 (Semibold)"
    },
    {
      family: 'Clinical Metrics / Status Stamps (High accuracy Monospace)',
      usage: "Evidence metrics ratios, date timestamps, system coordinates, or background configurations.",
      sample: "0.72rem · MONO · CODE · ACTIVE (3/3)",
      classes: "font-mono text-[0.72rem] text-slate-500 tracking-normal font-medium uppercase",
      size: "0.72rem (11.5px)",
      lineHeight: "Default",
      weight: "600 (Semibold)"
    },
    {
      family: 'Activity Context / Clinical Review Timestamp (Subtle Sans-serif)',
      usage: "Clinical target timestamps, progress calendar headers, and scheduled review notes.",
      sample: "Next clinical review: 12 September",
      classes: "font-sans text-[0.8rem] text-slate-600 tracking-normal font-normal",
      size: "0.8rem (12.8px)",
      lineHeight: "Default",
      weight: "400 (Regular)"
    },
    {
      family: 'Diagnostic Observer Source Pill (Mini Capsule Label)',
      usage: "Miniature pill-badges detailing contributors to an observed trait (such as 'You', 'Teacher', 'Clinician', 'Maya').",
      sample: "You · Teacher · Clinician · Maya",
      classes: "font-sans text-[0.7rem] font-medium text-[var(--color-thread-dark-slate)]",
      size: "0.7rem (11.2px)",
      lineHeight: "Default",
      weight: "600 (Semibold)"
    }
  ];

  // Rounded Corner Container Types seen in actual code
  const shapes = [
    { name: "Dynamic Top Right Card Curve", class: "rounded-tr-[36px]", desc: "Used specifically on premium Synthesis Cards, providing an organic, editorial visual language" },
    { name: "Dynamic Bottom Left Card Curve", class: "rounded-bl-[32px]", desc: "Used for this Quarter's planning progress charts and calendar scheduling card blocks" },
    { name: "Full Component Back Canvas Slate", class: "rounded-2xl", desc: "Found on generic modal screens, user notifications settings tiles, and primary interactive containers" },
    { name: "Pill/Utility Controls", class: "rounded-full", desc: "Rounded-full standard profiles, learning actions buttons, active switch profiles badges, indicators" }
  ];

  // Button design specs, classes, and file usages
  const buttonsInfo = [
    {
      variant: 'primary',
      name: 'Primary CTA',
      classCode: 'bg-[var(--color-thread-dark-forest)] text-white font-medium text-[0.82rem] px-4.5 py-2.5 rounded-full hover:bg-[var(--color-thread-deep-forest)] transition-all shadow-sm',
      usage: 'Use for the main action in a flow: starting, continuing, confirming, submitting, saving, paying, or sharing clinical information.',
      whereUsed: 'Setup flow, Assessment checkout, Questionnaire submission, modal confirmation footers',
      sampleText: 'Establish Care Milestone'
    },
    {
      variant: 'secondary',
      name: 'Secondary CTA',
      classCode: 'bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] font-medium text-[0.82rem] px-4.5 py-2.5 rounded-full hover:opacity-95 shadow-sm transition-all',
      usage: 'Use for supportive actions that move to related context without committing a major step: learn more, open insight, review, or manage.',
      whereUsed: 'Home synthesis cards, resource links, document manager links, insight cards',
      sampleText: 'View Emerging Details'
    },
    {
      variant: 'slate',
      name: 'Slate Global Confirm',
      classCode: 'bg-slate-900 text-white text-[0.98rem] font-medium px-6 py-3 rounded-full hover:bg-slate-800 transition-colors shadow-sm',
      usage: 'Utilized across high-importance system inputs, configuration saving prompts, settings modifications, or global dashboard profile settings saves.',
      whereUsed: 'SettingsPage (Save active clinical settings logs), AddChildModal (Primary details trigger callback)',
      sampleText: 'Confirm and Save Plan'
    },
    {
      variant: 'white',
      name: 'White Contrast',
      classCode: 'bg-white text-[var(--color-thread-dark-forest)] font-medium text-[0.82rem] px-4.5 py-2.5 rounded-full hover:bg-slate-50 shadow-sm transition-all',
      usage: 'High value interactive actions positioned directly over dark organic backgrounds or custom media card panels.',
      whereUsed: 'TopBar (Active child selector menu items, child context selector buttons), HomePage (File upload dropzone frame)',
      sampleText: 'Upload Assessment File'
    },
    {
      variant: 'tertiary',
      name: 'Tertiary Control',
      classCode: 'text-[0.84rem] font-medium text-slate-600 hover:text-slate-900 bg-[var(--color-thread-off-white)] hover:bg-[var(--color-thread-light-green)] border border-black/5 px-4 py-2 rounded-full transition-colors whitespace-nowrap',
      usage: 'Use for quiet but still button-shaped actions: cancel, filter, reset, reschedule, review completed work, or low-risk alternatives.',
      whereUsed: 'Modal cancel buttons, settings controls, completed setup actions, timeline category toggles',
      sampleText: 'Filter Timeline'
    },
    {
      variant: 'ghost',
      name: 'Ghost Navigation',
      classCode: 'bg-transparent text-[var(--color-thread-gray)] hover:bg-[var(--color-thread-light-green)]/55 hover:text-[var(--color-thread-heading)] font-medium text-[0.84rem] px-3 py-2 rounded-full transition-colors',
      usage: 'Use for low-emphasis navigation or reversible movement where a filled tertiary pill would feel too heavy.',
      whereUsed: 'Back buttons, previous-step controls, low-emphasis modal navigation',
      sampleText: 'Read Full Evaluation Letter'
    }
  ];

  // Card styles, structures, templates and codebase usages mapped to custom presets
  const cardsInfo = [
    {
      name: "Generic UI Wrapper Card",
      type: "Wrapper Shell Layout",
      classCode: "bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50 overflow-hidden relative transition-all duration-300",
      usage: "A translucent glassmorphic viewport shell that forms the standard wrapper for modules, lists, and form segments.",
      whereUsed: "src/components/ui/Card.tsx, AllChildrenPage.tsx, TopBar.tsx",
      sampleType: "generic"
    },
    {
      name: "Priority Card",
      type: "Action Rank Milestone",
      classCode: "relative bg-white p-7.5 mb-4.5 overflow-hidden rounded-[20px] shadow-premium",
      usage: "Accommodates detailed text lists, meta tags, and rank order info alongside nested off-white info panels.",
      whereUsed: "src/components/PrioritiesPage.tsx (PriorityCard)",
      sampleType: "priority"
    },
    {
      name: "Strategy Card",
      type: "Interlocking Playbook Block",
      classCode: "bg-white p-6.5 shadow-premium rounded-[18px]",
      usage: "Used in roadmaps and multi-step plans to bundle step lists separated by hairline dividers with aligned lead icon indicators.",
      whereUsed: "src/components/RoadmapPage.tsx (StrategyCard)",
      sampleType: "strategy"
    },
    {
      name: "Strength Observation",
      type: "Top-Right Asymmetric Accent",
      classCode: "bg-white p-6.5 rounded-tr-[32px] flex flex-col text-left",
      usage: "Designed for clinical strengths highlights, where asymmetric rounded-tr styling complements high-contrast circular iconography frames.",
      whereUsed: "src/components/UnderstandingPage.tsx (StrengthCard)",
      sampleType: "strength"
    },
    {
      name: "Value Circle Card (Solid / Light)",
      type: "Zen Radial Watermark",
      classCode: "p-7.5 relative overflow-hidden rounded-[20px] bg-[var(--color-thread-dark-forest)] text-white or bg-[var(--color-thread-cream)] text-[var(--color-thread-darkest)]",
      usage: "Displays core values and qualitative assessments carrying decorative concentric SVG circle background overlays.",
      whereUsed: "src/components/UnderstandingPage.tsx (ValueCard), src/components/EmergingDetailsPage.tsx",
      sampleType: "value"
    },
    {
      name: "Resource Guide Card",
      type: "Visual Reference Item",
      classCode: "bg-white flex flex-col cursor-pointer transition-all group overflow-hidden rounded-tr-[32px] hover:scale-[1.02]",
      usage: "Grid-structured card encapsulating media-aspect covers (16:9), text containers with tracking elements, and summary metadata footers.",
      whereUsed: "src/components/ResourcesPage.tsx (GuideCard)",
      sampleType: "guide"
    },
    {
      name: "Synthesis Card (Asymmetric)",
      type: "Premium Editorial Card",
      classCode: "relative p-8 border rounded-tr-[36px] overflow-hidden flex flex-col justify-between h-[300px] bg-[var(--color-thread-dark-forest)] text-white border-transparent",
      usage: "A large focal card used as a visual anchor. Uses customized top-right curve and ambient background rings.",
      whereUsed: "src/components/AllChildrenPage.tsx (Synthesis Card)",
      sampleType: "synthesis"
    },
    {
      name: "Quarter Plan Card (Asymmetric)",
      type: "Premium Editorial Card",
      classCode: "relative p-8 border border-black/5 rounded-bl-[32px] overflow-hidden flex flex-col justify-between h-[300px] bg-white text-[var(--color-thread-dark-slate)]",
      usage: "Used in pairing with the Synthesis Card, mirroring the visual layout with a custom asymmetric bottom-left corner.",
      whereUsed: "src/components/AllChildrenPage.tsx (Quarter Plan Card)",
      sampleType: "quarter"
    }
  ];

  const visualDirectionRules = [
    {
      title: "Calm, not clinical-cold",
      detail: "Use soft off-white canvases, asymmetric white cards, and human serif headlines so the app feels supportive for parents while still clinically credible.",
    },
    {
      title: "One clear next step",
      detail: "Every major card should answer: what is this, why does it matter, and what can the parent safely do next. Avoid stacking multiple primary CTAs.",
    },
    {
      title: "Progressive certainty",
      detail: "New-child screens must say what is locked, pending, or still being gathered. Assessed-child screens can use stronger synthesis language and progress metrics.",
    },
    {
      title: "Insight before administration",
      detail: "Scheduling, uploads, and filters should be visually quieter than recommendations, priorities, and review rhythm. Utility supports clarity; it should not dominate.",
    },
  ];

  const uxStateRules = [
    {
      state: "New child · Intake in progress",
      surface: "Home, Understanding, Priorities, Reviews",
      guidance: "Show preview value, locked/empty states, and setup launchers. Do not imply assessment conclusions before questionnaire and session context exist.",
    },
    {
      state: "Assessment pending · Session booked",
      surface: "Home and First session cards",
      guidance: "Show the booked session and a reschedule action on the session card footer beside the clinician name. Do not place reschedule inside the child profile selector.",
    },
    {
      state: "Assessed child · Active plan",
      surface: "Home, Priorities, Roadmap, Documents",
      guidance: "Lead with synthesis, Now/Next/Later reasoning, and practical plan steps. Keep supporting evidence available through secondary links.",
    },
    {
      state: "Completed quarter · 100%",
      surface: "Liam profile",
      guidance: "Shift copy from active intervention to maintenance, enrichment, archive, and future check-ins. Progress can be celebratory but should stay grounded.",
    },
  ];

  const componentUseRules = [
    {
      component: "HeroQuoteCard",
      use: "Top synthesis, recommendation rationale, or page-level insight.",
      avoid: "Do not use for simple upload prompts, filters, or procedural copy.",
    },
    {
      component: "PlanProgressCard / FirstSessionCard",
      use: "Right-side status card in Home and All Children. Put reschedule with the footer clinician/date context.",
      avoid: "Do not duplicate appointment actions in the child selector dropdown.",
    },
    {
      component: "FilterTab",
      use: "Small category controls, including document type and uploader filters such as Uploaded by you / Uploaded by Threadline.",
      avoid: "Avoid using tabs for primary navigation or multi-step setup flow.",
    },
    {
      component: "FileItem",
      use: "Document rows with type, date, uploader source, and share state.",
      avoid: "Do not hide file provenance when filters depend on it.",
    },
    {
      component: "TimelineItem",
      use: "Now/Next/Later plan lines on active profiles. For a completed quarter (100%), switch tags to New/Then/Later and pass hideMetrics (or progress=100) to drop clinical weighting, plan progress, and See details.",
      avoid: "Do not show clinical weighting or a 100% plan-progress bar on a closed quarter — it reads as active work still in flight.",
    },
    {
      component: "Secondary user access",
      use: "Settings only. Invite a partner, teacher, or carer and pick an access level: Full (mirrors the parent view) or Partial. Persist via SecondaryUsersContext so invitees survive navigation.",
      avoid: "Do not present Partial as finished — keep its TBD marker until its scoped permissions are defined, and don't reuse this for clinician roles.",
    },
  ];

  const systemHighlights = [
    { label: "Theme modes", value: "2", detail: "Energetic and Classic profiles" },
    { label: "Core tokens", value: "8", detail: "Color, type, surface, and motion anchors" },
    { label: "UI families", value: "19", detail: "Live component examples with source hints" },
  ];

  const quickSections = [
    { label: "Foundations", href: "#foundations", icon: Sparkles },
    { label: "Usage rules", href: "#usage-rules", icon: Check },
    { label: "Tokens", href: "#tokens", icon: Palette },
    { label: "Components", href: "#components", icon: Layers },
  ];

  const decisionChecks = [
    "Is the parent being shown one clear next action?",
    "Does the surface reflect the child's current assessment state?",
    "Can every clinical claim point back to source evidence?",
    "Are admin tasks quieter than insight, review, or setup progress?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pt-16 pb-24 font-sans"
    >
      <PageContainer>
        <div className="mb-5">
          <Button
            variant="white"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => onPageChange("all-children")}
          >
            Back to index
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8 grid grid-cols-1 xl:grid-cols-[1.16fr_0.84fr] gap-6 items-stretch">
          <section className="bg-white rounded-tr-[40px] border border-black/5 shadow-sm p-7 sm:p-10 overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 mb-7">
              <span className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.12em] uppercase text-[var(--color-thread-mid-green)] font-medium">
                <Palette className="w-3.5 h-3.5" />
                Threadline design system
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-[0.78rem] text-slate-500 font-medium">
                Product guidance and live tokens
              </span>
            </div>
            <h1 className="font-serif font-normal text-[2.45rem] sm:text-[3.35rem] md:text-[3.9rem] leading-[1.05] tracking-[-0.045rem] text-[var(--color-thread-heading)] max-w-[10ch]">
              A calmer system for complex care.
            </h1>
            <p className="text-[1rem] text-[var(--color-thread-gray)] mt-6 max-w-[64ch] leading-relaxed">
              Use this page to keep Threadline warm, structured, and clinically precise across preview states,
              assessment flows, review surfaces, documents, and setup.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {systemHighlights.map((item) => (
                <div key={item.label} className="rounded-2xl bg-[var(--color-thread-off-white)] border border-black/5 px-4 py-3.5">
                  <div className="font-serif text-[2rem] leading-none text-[var(--color-thread-heading)]">
                    {item.value}
                  </div>
                  <div className="mt-2 text-[0.72rem] tracking-[0.1em] uppercase font-medium text-[var(--color-thread-mid-green)]">
                    {item.label}
                  </div>
                  <p className="mt-1 text-[0.76rem] leading-snug text-slate-500">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="bg-[var(--color-thread-heading)] text-white rounded-bl-[34px] p-7 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[0.68rem] tracking-[0.14em] uppercase text-emerald-100/80 font-medium">
                North star
              </span>
              <h2 className="mt-4 font-serif text-[2rem] leading-tight tracking-tight text-white">
                Help parents understand what matters without making them feel behind.
              </h2>
              <p className="mt-5 text-[0.9rem] leading-relaxed text-emerald-50/75">
                Every surface should lower cognitive load, show provenance, and make the next safe action obvious.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              {decisionChecks.map((check) => (
                <div key={check} className="flex items-start gap-3 text-[0.84rem] leading-relaxed text-emerald-50/85">
                  <Check className="w-4 h-4 mt-0.5 text-emerald-100 shrink-0" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <nav className="sticky top-18 z-10 mb-12 bg-[var(--color-thread-off-white)]/90 backdrop-blur-md py-3 border-y border-black/5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {quickSections.map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.href}
                  href={section.href}
                  className="group flex items-center justify-between gap-3 rounded-full bg-white border border-black/5 px-4 py-3 text-[0.82rem] font-medium text-slate-600 shadow-sm hover:text-[var(--color-thread-heading)] hover:border-[var(--color-thread-mid-green)]/25 transition-all"
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[var(--color-thread-mid-green)]" />
                    {section.label}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-[var(--color-thread-mid-green)] transition-colors" />
                </a>
              );
            })}
          </div>
        </nav>

        {/* Grid of Contents */}
        <div className="space-y-16">
        <section id="foundations" className="scroll-mt-28 grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="bg-white rounded-tr-[36px] p-7 sm:p-8 border border-black/5 shadow-sm">
            <div className="flex items-center gap-3.5 mb-7">
              <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[1.5rem] font-serif font-normal text-[var(--color-thread-heading)]">
                  Foundations
                </h2>
                <p className="text-slate-500 text-[0.88rem] mt-0.5">
                  The product should feel warm, structured, and quietly expert.
                </p>
              </div>
            </div>
            <div className="space-y-3.5">
              {visualDirectionRules.map((rule, index) => (
                <div key={rule.title} className="grid grid-cols-[34px_1fr] gap-4 rounded-2xl bg-[var(--color-thread-off-white)] border border-black/5 p-4.5">
                  <span className="font-mono text-[0.72rem] text-[var(--color-thread-mid-green)] bg-white rounded-full h-8 w-8 flex items-center justify-center border border-black/5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-medium text-[0.98rem] text-[var(--color-thread-heading)] tracking-tight">
                      {rule.title}
                    </h3>
                    <p className="mt-1.5 text-[0.84rem] text-slate-500 leading-relaxed">
                      {rule.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-bl-[32px] p-7 sm:p-8 border border-black/5 shadow-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-7">
              <div>
                <span className="text-[0.68rem] tracking-[0.14em] uppercase text-[var(--color-thread-mid-green)] font-medium">
                  State model
                </span>
                <h2 className="mt-2 text-[1.5rem] font-serif font-normal text-[var(--color-thread-heading)]">
                  Child profile states drive layout, copy, and actions.
                </h2>
              </div>
              <Badge variant="clinical">Current app rules</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uxStateRules.map((rule) => (
                <div key={rule.state} className="rounded-2xl border border-black/5 bg-slate-50/70 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-[1rem] text-slate-900 tracking-tight">
                        {rule.state}
                      </h3>
                      <p className="mt-1 text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-thread-mid-green)] font-medium">
                        {rule.surface}
                      </p>
                    </div>
                    <Check className="w-4 h-4 text-[var(--color-thread-mid-green)] shrink-0 mt-1" />
                  </div>
                  <p className="mt-3 text-[0.84rem] text-slate-600 leading-relaxed">
                    {rule.guidance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="usage-rules" className="scroll-mt-28 bg-white rounded-tr-[36px] p-7 sm:p-8 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3.5 mb-7">
            <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-serif font-normal text-[var(--color-thread-heading)]">
                Component usage rules
              </h2>
              <p className="text-slate-500 text-[0.88rem] mt-0.5">
                Use these guardrails when building new pages or prompting AI to generate Threadline UI.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {componentUseRules.map((rule) => (
              <div key={rule.component} className="grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-4 rounded-2xl bg-[var(--color-thread-off-white)] border border-black/5 p-5">
                <div className="font-mono text-[0.78rem] text-slate-600">
                  {rule.component}
                </div>
                <div>
                  <span className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--color-thread-mid-green)] font-medium">Use</span>
                  <p className="mt-1 text-[0.84rem] text-slate-700 leading-relaxed">{rule.use}</p>
                </div>
                <div>
                  <span className="text-[0.65rem] uppercase tracking-[0.12em] text-slate-400 font-medium">Avoid</span>
                  <p className="mt-1 text-[0.84rem] text-slate-500 leading-relaxed">{rule.avoid}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Colors Palette Section */}
        <section id="tokens" className="scroll-mt-28 bg-white rounded-tr-[36px] p-6 sm:p-10 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-serif font-normal text-[var(--color-thread-heading)]">
                Dynamic Themes & Colors
              </h2>
              <p className="text-slate-500 text-[0.88rem] mt-0.5">
                Primary Tailwind custom utilities mapped to variable definitions supporting Energetic and Classic profiles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors.map((c) => (
              <div 
                key={c.name} 
                className="group relative p-5 bg-[var(--color-thread-off-white)] border border-black/5 rounded-xl hover:border-black/10 transition-all flex flex-col justify-between"
              >
                <div 
                  className="w-full h-[80px] rounded-lg shadow-inner mb-4 relative overflow-hidden"
                  style={{ backgroundColor: c.value }}
                >
                  <button
                    onClick={() => handleCopy(c.value, c.name)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[0.75rem] font-medium gap-1.5 transition-opacity"
                  >
                    {copiedText === c.name ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText === c.name ? "Copied!" : "Copy Hex"}
                  </button>
                </div>

                <div>
                  <h3 className="font-medium text-[0.92rem] text-slate-800 leading-tight">
                    {c.name}
                  </h3>
                  <code className="text-[0.72rem] text-[var(--color-thread-gray)] font-mono block mt-1.5">
                    {c.variable}
                  </code>
                  <p className="text-[0.75rem] text-slate-500 leading-snug mt-2.5">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Background Harmony & Contrast Matrix */}
          <div className="mt-12 pt-10 border-t border-black/5">
            <h3 className="text-[1.05rem] font-serif font-normal text-[var(--color-thread-heading)] mb-2">
              Background Color Harmony & Contrast Scan
            </h3>
            <p className="text-slate-500 text-[0.84rem] mb-6 max-w-[70ch]">
              Threadline uses selective dynamic backgrounds to divide information clusters. This matrix outlines compliant text colors, action accents, and label classes designed specifically for each background type.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Premium Forest Dark BG */}
              <div className="bg-[var(--color-thread-heading)] p-6 rounded-tr-[28px] rounded-bl-[20px] shadow-sm border border-black/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.62rem] tracking-[0.12em] uppercase font-medium text-emerald-100 bg-emerald-900/30 px-2 py-0.5 rounded-full">
                      Dark Background
                    </span>
                    <span className="text-[0.65rem] font-mono text-emerald-200/40">--color-thread-heading</span>
                  </div>
                  <h4 className="font-serif font-normal text-white text-[1.45rem] tracking-tight leading-tight mb-2">
                    Premium Identity Deep
                  </h4>
                  <p className="text-emerald-100/75 text-[0.84rem] leading-relaxed mb-4">
                    Reserved for high-impact headers and deep clinical insights. Provides maximum focus and eye-comfort.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                  <div className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-emerald-200/70 font-medium">Headings</span>
                    <span className="text-white font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-white" /> White (#FFF)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-emerald-200/70 font-medium">Body Text</span>
                    <span className="text-emerald-100/80 font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-100/80" /> Emerald Tint
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-emerald-200/70 font-medium">Accents</span>
                    <span className="text-[var(--color-thread-light-green)] font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-thread-light-green)]" /> Light Green
                    </span>
                  </div>
                </div>
              </div>

              {/* Cozy Warm Cream BG */}
              <div className="bg-[var(--color-thread-cream)] p-6 rounded-2xl shadow-sm border border-black/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.62rem] tracking-[0.12em] uppercase font-medium text-[var(--color-thread-darkest)] bg-white/45 px-2 py-0.5 rounded-full">
                      Warm Mid-tone
                    </span>
                    <span className="text-[0.65rem] font-mono text-amber-900/40">--color-thread-cream</span>
                  </div>
                  <h4 className="font-serif font-normal text-[var(--color-thread-heading)] text-[1.45rem] tracking-tight leading-tight mb-2">
                    Organic Cream Linen
                  </h4>
                  <p className="text-[var(--color-thread-dark-slate)] text-[0.84rem] leading-relaxed mb-4">
                    Excellent for dividers, review timelines, school layout boundaries, and tactile retro notes.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-black/10 space-y-2.5">
                  <div className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-slate-500 font-medium">Headings</span>
                    <span className="text-[var(--color-thread-heading)] font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-thread-heading)]" /> Forest Green
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-slate-500 font-medium">Body Description</span>
                    <span className="text-slate-800 font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-800" /> Slate 800
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-slate-500 font-medium">Accents / Muted</span>
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Slate 600
                    </span>
                  </div>
                </div>
              </div>

              {/* Soft Light Green BG */}
              <div className="bg-[var(--color-thread-light-green)] p-6 rounded-tl-[24px] rounded-br-[28px] shadow-sm border border-[var(--color-thread-mid-green)]/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.62rem] tracking-[0.12em] uppercase font-medium text-[var(--color-thread-mid-green)] bg-white/60 px-2 py-0.5 rounded-full">
                      Soft Highlight
                    </span>
                    <span className="text-[0.65rem] font-mono text-emerald-950/40">--color-thread-light-green</span>
                  </div>
                  <h4 className="font-serif font-normal text-[var(--color-thread-heading)] text-[1.45rem] tracking-tight leading-tight mb-2">
                    Mint Herbal Velvet
                  </h4>
                  <p className="text-emerald-950/70 text-[0.84rem] leading-relaxed mb-4">
                    Used for resource summaries, selected checkboxes, active toggles, and positive feedback badges.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--color-thread-mid-green)]/15 space-y-2.5">
                  <div className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-emerald-950/60 font-medium">Headings</span>
                    <span className="text-[var(--color-thread-heading)] font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-thread-heading)]" /> Forest Green
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-emerald-950/60 font-medium">Body Description</span>
                    <span className="text-slate-700 font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Slate 700
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[0.75rem]">
                    <span className="text-emerald-950/60 font-medium">Strong Accent</span>
                    <span className="text-[var(--color-thread-mid-green)] font-medium flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-thread-mid-green)]" /> Mid Green
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Micro Interaction Tool - Interactive Theme & Colors Customizer */}
            <div className="mt-8 p-6 sm:p-8 bg-slate-50 border border-black/5 rounded-2xl">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                  <span className="text-[0.68rem] tracking-[0.16em] uppercase text-[var(--color-thread-mid-green)] font-medium block">
                    Interactive Design System Customizer
                  </span>
                  <h3 className="text-[1.12rem] font-serif text-[var(--color-thread-heading)] font-normal mt-1">
                    Live Brand Identity & Variable Controller
                  </h3>
                </div>
                <div className="flex gap-2">
                  <span className="text-[0.72rem] text-slate-500 font-medium">Global State Sync:</span>
                  <span className="text-[0.72rem] bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    Live Active Mode
                  </span>
                </div>
              </div>

              <p className="text-[0.84rem] text-slate-600 leading-relaxed max-w-[85ch] mb-8">
                Adjust the design tokens below. All UI components across the entire application will dynamically adapt to the selected parameters using CSS-variable binding, maintaining perfect accessibility contrasts.
              </p>

              {/* Dynamic Settings Controller Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Theme Mood Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-[0.68rem] font-medium text-slate-400 uppercase tracking-wider">
                    Primary Theme Mood
                  </span>
                  <div className="flex bg-white rounded-xl p-1 border border-black/5 shadow-xs">
                    <button
                      onClick={() => handleThemeChange("energetic")}
                      className={cn(
                        "flex-1 text-center py-2 text-[0.8rem] font-medium rounded-lg transition-all cursor-pointer",
                        theme === "energetic"
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] shadow-sm font-medium"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Energetic
                    </button>
                    <button
                      onClick={() => handleThemeChange("classic")}
                      className={cn(
                        "flex-1 text-center py-2 text-[0.8rem] font-medium rounded-lg transition-all cursor-pointer",
                        theme === "classic"
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] shadow-sm font-medium"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Classic
                    </button>
                  </div>
                </div>

                {/* Typography Font Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-[0.68rem] font-medium text-slate-400 uppercase tracking-wider">
                    Serif Typography Font
                  </span>
                  <div className="flex bg-white rounded-xl p-1 border border-black/5 shadow-xs">
                    <button
                      onClick={() => handleFontChange("modern-serif")}
                      className={cn(
                        "flex-1 text-center py-2 text-[0.8rem] font-medium rounded-lg transition-all cursor-pointer",
                        font === "modern-serif"
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] shadow-sm font-medium"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Fraunces
                    </button>
                    <button
                      onClick={() => handleFontChange("classic-serif")}
                      className={cn(
                        "flex-1 text-center py-2 text-[0.8rem] font-medium rounded-lg transition-all cursor-pointer",
                        font === "classic-serif"
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] shadow-sm font-medium"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Frank Ruhl
                    </button>
                  </div>
                </div>

                {/* Primary Hero Cards Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-[0.68rem] font-medium text-slate-400 uppercase tracking-wider">
                    Primary Hero Style
                  </span>
                  <div className="flex bg-white rounded-xl p-1 border border-black/5 shadow-xs">
                    <button
                      onClick={() => handleHeroStyleChange("white")}
                      className={cn(
                        "flex-1 text-center py-2 text-[0.8rem] font-medium rounded-lg transition-all cursor-pointer",
                        heroStyle === "white"
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] shadow-sm font-medium"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      White
                    </button>
                    <button
                      onClick={() => handleHeroStyleChange("green")}
                      className={cn(
                        "flex-1 text-center py-2 text-[0.8rem] font-medium rounded-lg transition-all cursor-pointer",
                        heroStyle === "green"
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] shadow-sm font-medium"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Solid Green
                    </button>
                  </div>
                </div>

                {/* Secondary Highlight Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-[0.68rem] font-medium text-slate-400 uppercase tracking-wider">
                    Secondary Contrast
                  </span>
                  <div className="flex bg-white rounded-xl p-1 border border-black/5 shadow-xs">
                    <button
                      onClick={() => handleSecondaryStyleChange("light")}
                      className={cn(
                        "flex-1 text-center py-2 text-[0.8rem] font-medium rounded-lg transition-all cursor-pointer",
                        secondaryStyle === "light"
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] shadow-sm font-medium"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Mint Soft
                    </button>
                    <button
                      onClick={() => handleSecondaryStyleChange("dark")}
                      className={cn(
                        "flex-1 text-center py-2 text-[0.8rem] font-medium rounded-lg transition-all cursor-pointer",
                        secondaryStyle === "dark"
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] shadow-sm font-medium"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Forest Dark
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic State Feedback Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-black/5 bg-white/50 p-4 rounded-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[0.66rem] uppercase tracking-wider font-medium text-slate-400 block">
                      Active Palette Variables
                    </span>
                    <span className="text-[0.8rem] font-medium text-slate-700">
                      {theme === "energetic" ? `Mint Energetic (Emerald ${activeThemeTokens.midGreen})` : `Classic Vintage (Forest ${activeThemeTokens.midGreen})`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2.5 py-1.5 border border-black/5">
                    <span className="w-3 h-3 rounded-full border border-black/5" style={{ backgroundColor: activeThemeTokens.midGreen }} />
                    <span className="text-[0.7rem] font-mono text-slate-600 font-medium uppercase">{activeThemeTokens.midGreen}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2.5 py-1.5 border border-black/5">
                    <span className="w-3 h-3 rounded-full border border-black/5" style={{ backgroundColor: activeThemeTokens.lightGreen }} />
                    <span className="text-[0.7rem] font-mono text-slate-600 font-medium uppercase">{activeThemeTokens.lightGreen}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2.5 py-1.5 border border-black/5">
                    <span className="w-3 h-3 rounded-full border border-black/5" style={{ backgroundColor: activeThemeTokens.offWhite }} />
                    <span className="text-[0.7rem] font-mono text-slate-600 font-medium uppercase">{activeThemeTokens.offWhite}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section id="typography" className="scroll-mt-28 bg-white rounded-bl-[32px] p-6 sm:p-10 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-serif font-normal text-[var(--color-thread-heading)]">
                Typographic Hierarchy
              </h2>
              <p className="text-slate-500 text-[0.88rem] mt-0.5">
                Pairing serif displays for clinical human insights with modern high-legibility sans-serifs for dashboard metrics.
              </p>
            </div>
          </div>

          <div className="space-y-12 divide-y divide-black/5">
            {fonts.map((f, i) => (
              <div key={f.family} className={`pt-12 first:pt-0 flex flex-col lg:flex-row gap-8`}>
                <div className="w-full lg:w-[320px] flex-shrink-0">
                  <h3 className="font-medium text-[1rem] text-slate-900 leading-tight">
                    {f.family}
                  </h3>
                  <p className="text-[0.82rem] text-slate-500 mt-2.5 leading-relaxed">
                    {f.usage}
                  </p>
                  
                  <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-4">
                    <div className="space-y-1">
                      <span className="block text-[0.62rem] uppercase tracking-wider text-slate-400 font-medium">Size</span>
                      <span className="block text-[0.78rem] text-slate-700 font-mono">{(f as any).size}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[0.62rem] uppercase tracking-wider text-slate-400 font-medium">Line Height</span>
                      <span className="block text-[0.78rem] text-slate-700 font-mono">{(f as any).lineHeight}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[0.62rem] uppercase tracking-wider text-slate-400 font-medium">Weight</span>
                      <span className="block text-[0.78rem] text-slate-700 font-mono">{(f as any).weight}</span>
                    </div>
                    <div className="space-y-1 flex flex-col justify-end">
                      <button
                        onClick={() => handleCopy(f.classes, f.family)}
                        className="text-[0.65rem] bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-2 py-1 rounded inline-flex items-center gap-1.5 w-fit"
                      >
                        {copiedText === f.family ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3 h-3" />}
                        Copy class
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-[var(--color-thread-off-white)] p-8 rounded-2xl border border-black/5 flex items-center min-h-[140px]">
                  <span className={f.classes}>
                    {f.sample}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Font Weights & Variations Matrix */}
          <div className="mt-12 pt-10 border-t border-black/5">
            <h3 className="text-[1.05rem] font-serif font-normal text-[var(--color-thread-heading)] mb-2">
              Font Weights & Variations Comparison
            </h3>
            <p className="text-slate-500 text-[0.84rem] mb-6 max-w-[70ch]">
              Maintaining a clear, intentional typographic rhythm is about pairing weights correctly. Compare light, regular, medium, and bold expressions of our standard families below.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Serif Weights Comparison */}
              <div className="bg-[var(--color-thread-off-white)] p-6 rounded-2xl border border-black/5">
                <div className="flex items-center justify-between mb-4.5 border-b border-black/5 pb-3">
                  <span className="text-[0.68rem] tracking-[0.1em] uppercase font-medium text-slate-700">
                    {font === 'modern-serif' ? 'Fraunces' : 'Frank Ruhl Libre'} (Serif Style Family)
                  </span>
                  <span className="text-[0.7rem] bg-emerald-50 text-[var(--color-thread-mid-green)] font-medium px-2 py-0.5 rounded animate-pulse">
                    Clinical Elegant
                  </span>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="w-16 font-mono text-[0.7rem] text-slate-400 mt-1 uppercase">Regular</span>
                    <div>
                      <div className="font-serif font-normal text-[1.6rem] leading-tight text-[var(--color-thread-heading)]">
                        Humanized Growth Plans
                      </div>
                      <span className="text-[0.7rem] text-slate-400 font-mono">font-serif font-normal (400)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-t border-black/5 pt-4">
                    <span className="w-16 font-mono text-[0.7rem] text-slate-400 mt-1 uppercase">Medium</span>
                    <div>
                      <div className="font-serif font-medium text-[1.6rem] leading-tight text-slate-900">
                        Humanized Growth Plans
                      </div>
                      <span className="text-[0.7rem] text-slate-400 font-mono">font-serif font-medium (500)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sans-Serif Weights Comparison */}
              <div className="bg-[var(--color-thread-off-white)] p-6 rounded-2xl border border-black/5">
                <div className="flex items-center justify-between mb-4.5 border-b border-black/5 pb-3">
                  <span className="text-[0.68rem] tracking-[0.1em] uppercase font-medium text-slate-700">
                    Inter (Sans-Serif Style Family)
                  </span>
                  <span className="text-[0.7rem] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                    Neutral High-Legibility
                  </span>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="w-16 font-mono text-[0.7rem] text-slate-400 mt-1 uppercase">Regular</span>
                    <div>
                      <div className="font-sans font-normal text-[1.3rem] leading-tight text-slate-800 tracking-tight">
                        Support Strategies & Focus Tracker
                      </div>
                      <span className="text-[0.7rem] text-slate-400 font-mono">font-sans font-normal (400)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 border-t border-black/5 pt-4">
                    <span className="w-16 font-mono text-[0.7rem] text-slate-400 mt-1 uppercase">Medium</span>
                    <div>
                      <div className="font-sans font-medium text-[1.3rem] leading-tight text-slate-900 tracking-tight">
                        Support Strategies & Focus Tracker
                      </div>
                      <span className="text-[0.7rem] text-slate-400 font-mono">font-sans font-medium (500)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Architecture & State Management Section */}
        <section id="architecture" className="scroll-mt-28 bg-white rounded-tr-[36px] p-6 sm:p-10 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-serif font-normal text-[var(--color-thread-heading)]">
                State & Architecture
              </h2>
              <p className="text-slate-500 text-[0.88rem] mt-0.5">
                Centralized global state management and context providers ensuring data consistency across children profiles and clinical lockers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ChildContext Overview */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-[var(--color-thread-mid-green)]" />
                <h3 className="font-sans font-medium text-[1rem] text-slate-900">ChildContext (ChildProvider)</h3>
              </div>
              <p className="text-[0.84rem] text-slate-600 leading-relaxed mb-4">
                Manages the active child profile, the full children registry, and profile addition workflows. Accessible via the <code className="text-[0.7rem] bg-black/5 px-1 rounded font-mono">useCurrentChild()</code> hook.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-[0.72rem] font-mono text-slate-400 border-b border-black/5 pb-1">
                  <span>State Key</span>
                  <span>Description</span>
                </div>
                <div className="flex justify-between text-[0.72rem] text-slate-500">
                  <span className="font-medium text-slate-700">currentChild</span>
                  <span>Active child profile object</span>
                </div>
                <div className="flex justify-between text-[0.72rem] text-slate-500">
                  <span className="font-medium text-slate-700">childrenList</span>
                  <span>Array of all registered children</span>
                </div>
              </div>
            </div>

            {/* LockerContext Overview */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-[var(--color-thread-mid-green)]" />
                <h3 className="font-sans font-medium text-[1rem] text-slate-900">LockerContext (LockerProvider)</h3>
              </div>
              <p className="text-[0.84rem] text-slate-600 leading-relaxed mb-4">
                Handles clinical documentation, assessment uploads, and shared access states. Supports global search and filtering across the clinical repository.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-[0.72rem] font-mono text-slate-400 border-b border-black/5 pb-1">
                  <span>Method</span>
                  <span>Functionality</span>
                </div>
                <div className="flex justify-between text-[0.72rem] text-slate-500">
                  <span className="font-medium text-slate-700">setFilter()</span>
                  <span>Category-based filtering</span>
                </div>
                <div className="flex justify-between text-[0.72rem] text-slate-500">
                  <span className="font-medium text-slate-700">toggleShare()</span>
                  <span>Toggle file visibility with care circle</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Layout & Grid Section */}
        <section className="bg-white rounded-xl p-6 sm:p-10 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-serif font-normal text-[var(--color-thread-heading)]">
                Global Layout & Grid
              </h2>
              <p className="text-slate-500 text-[0.88rem] mt-0.5">
                The structural foundation ensuring consistent spacing, alignment, and responsiveness across the clinical platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grid Column 1: Shell Components */}
            <div className="md:col-span-2 space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-black/5">
                <div className="flex items-center gap-3 mb-4">
                  <Columns className="w-5 h-5 text-[var(--color-thread-mid-green)]" />
                  <h3 className="font-sans font-medium text-[1rem] text-slate-900">Application Shell (DashboardLayout)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[0.78rem] font-medium text-slate-700">Sidebar Rail</p>
                    <p className="text-[0.72rem] text-slate-500 leading-relaxed">
                      A fixed 280px left-anchored navigation component providing high-level routing across diagnosis, roadmap, and locker.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[0.78rem] font-medium text-slate-700">Action TopBar</p>
                    <p className="text-[0.72rem] text-slate-500 leading-relaxed">
                      A 72px fixed header containing the child profile switcher, global notifications, and primary user actions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Maximize className="w-5 h-5 text-slate-400" />
                    <h3 className="font-sans font-medium text-[1rem] text-slate-900">Content Grid & Containers</h3>
                  </div>
                  <Badge variant="active" className="text-[0.65rem]">Max-W 5XL</Badge>
                </div>
                <p className="text-[0.84rem] text-slate-600 mb-6">
                  Standardized content containment using the <code className="bg-slate-100 px-1 rounded text-[0.7rem] font-mono">PageContainer</code> component.
                </p>
                <div className="grid grid-cols-12 gap-2 h-24">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-[var(--color-thread-light-green)] opacity-30 rounded h-full flex items-center justify-center font-mono text-[0.6rem] text-[var(--color-thread-mid-green)]">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[0.65rem] font-mono text-slate-400">
                  <span>Fluid Padding (px-6)</span>
                  <span>Responsive Scaling (sm:px-8 md:px-12)</span>
                </div>
              </div>
            </div>

            {/* Grid Column 2: Spacing Rules */}
            <div className="p-6 bg-[var(--color-thread-off-white)] rounded-2xl border border-black/5">
              <h3 className="font-sans font-medium text-[1rem] text-slate-900 mb-4">Spacing Standards</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-1.5 h-10 bg-slate-300 rounded-full" />
                  <div>
                    <p className="text-[0.78rem] font-medium text-slate-800">Section Gaps</p>
                    <p className="text-[0.7rem] text-slate-500">40px (10 units) between major logical sections.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-6 bg-slate-300 rounded-full" />
                  <div>
                    <p className="text-[0.78rem] font-medium text-slate-800">Element Stacking</p>
                    <p className="text-[0.7rem] text-slate-500">24px (6 units) between related elements.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-4 bg-slate-300 rounded-full" />
                  <div>
                    <p className="text-[0.78rem] font-medium text-slate-800">Atomic Spacing</p>
                    <p className="text-[0.7rem] text-slate-500">8px-12px for internal component padding.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Containers, Shapes & Borders */}
        <section className="bg-white rounded-xl p-6 sm:p-10 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-serif font-normal text-[var(--color-thread-heading)]">
                Borders, Shapes & Backgrounds
              </h2>
              <p className="text-slate-500 text-[0.88rem] mt-0.5">
                Unique cornering presets and custom background effects creating signature organic shapes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {shapes.map((s) => (
                <div key={s.name} className="flex gap-4 p-4 border border-black/5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-11 h-11 bg-emerald-50 text-[var(--color-thread-mid-green)] font-mono text-[0.75rem] flex items-center justify-center font-medium border border-emerald-100/30 rounded-lg">
                    C3
                  </div>
                  <div>
                    <h4 className="font-medium text-[0.9rem] text-slate-900">{s.name}</h4>
                    <code className="text-[0.72rem] text-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)] px-1.5 py-0.5 rounded font-mono mt-1 inline-block">
                      {s.class}
                    </code>
                    <p className="text-[0.78rem] text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Background Showcase */}
            <div className="bg-[var(--color-thread-off-white)] border border-black/5 rounded-2xl p-6.5 flex flex-col justify-between">
              <div>
                <span className="text-[0.66rem] tracking-[0.16em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-2.5 block">
                  Watercolor Texture Accent
                </span>
                <p className="text-[0.86rem] text-slate-600 leading-relaxed mb-6">
                  Featured on the primary app backdrop canvas, linear gradient coupled with soft organic paint spots provides a warm clinical sensory atmosphere.
                </p>
              </div>

              {/* Visualized block */}
              <div className="w-full h-[120px] rounded-xl bg-watercolor flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur-md border border-neutral-200/50 rounded-full px-5 py-2 text-[0.82rem] font-medium tracking-wide shadow-sm text-slate-800">
                  bg-watercolor utility styled
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons and Custom Controls Section with Matrix Table */}
        <section className="bg-white rounded-tr-[36px] p-6 sm:p-10 border border-black/5 shadow-sm w-full font-sans">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
              <ToggleLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[1.50rem] font-serif font-normal text-[var(--color-thread-heading)]">
                Button Style Mapping & Codebase Matrix (BTN)
              </h2>
              <p className="text-slate-500 text-[0.88rem] mt-0.5">
                Detailed matrix mapping the core button styles used within the codebase, their usage guidelines, and codebase file sources.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Premium Bento Grid Layout for Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buttonsInfo.map((btn) => (
                <div 
                  key={btn.variant} 
                  className="bg-slate-50/50 border border-black/5 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Visual Live Preview with Grid Background */}
                  <div className="p-6 flex items-center justify-center bg-slate-100/50 border-b border-black/5 relative min-h-[160px] overflow-hidden select-none">
                    {/* Clean blueprint dot grid background */}
                    <div 
                      className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                      style={{ 
                        backgroundImage: 'radial-gradient(var(--color-thread-mid-green) 1px, transparent 1px)', 
                        backgroundSize: '16px 16px' 
                      }} 
                    />
                    
                    <div className="relative z-10 w-full flex justify-center">
                      <Button
                        variant={btn.variant as any}
                        onClick={() => {
                          addLog(`Blueprint: '${btn.name}' clicked! Triggering dynamic path callback...`);
                          // Dynamically map navigation page depending on target
                          const navigationMap: Record<string, string> = {
                            primary: "priorities",
                            secondary: "resources",
                            slate: "settings",
                            white: "all-children",
                            tertiary: "roadmap",
                            ghost: "documents"
                          };
                          const targetPage = navigationMap[btn.variant];
                          if (targetPage) onPageChange(targetPage as any);
                        }}
                        className="cursor-pointer select-none hover:scale-[1.02] transform active:scale-[0.98] transition-all px-5 py-2.5 text-[0.8rem] font-medium whitespace-nowrap inline-flex shadow-sm"
                      >
                        {btn.sampleText}
                      </Button>
                    </div>
                  </div>

                  {/* Spec sheets and mapping details */}
                  <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[0.66rem] uppercase tracking-wider font-medium text-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)] px-2.5 py-1 rounded-md">
                          variant="{btn.variant}"
                        </span>
                        <span className="text-[0.64rem] text-slate-400 font-mono">BTN-{btn.variant.toUpperCase()}</span>
                      </div>
                      <h3 className="font-serif font-normal text-[1.25rem] text-[var(--color-thread-heading)] leading-snug mb-2">
                        {btn.name}
                      </h3>
                      <p className="text-[0.82rem] text-slate-500 leading-relaxed mb-4">
                        {btn.usage}
                      </p>

                      {/* Codebase location mapping */}
                      <div className="mb-4">
                        <div className="text-[0.66rem] uppercase tracking-wider font-medium text-slate-400 mb-1.5">Codebase Integration Map</div>
                        <div className="flex flex-wrap gap-1">
                          {btn.whereUsed.split(', ').map((loc) => (
                            <span key={loc} className="text-[0.64rem] font-mono font-medium text-slate-600 bg-slate-100 border border-black/5 px-2 py-0.5 rounded break-all">
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Class spec sheet */}
                    <div className="border-t border-black/5 pt-4 mt-auto">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-[0.66rem] uppercase tracking-wider font-medium text-slate-400">Tailwind Design Classes</span>
                        <button
                          onClick={() => handleCopy(btn.classCode, btn.name)}
                          className="text-[0.7rem] font-medium text-[var(--color-thread-mid-green)] hover:opacity-80 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === btn.name ? (
                            <span className="flex items-center gap-1 text-emerald-600"><Check className="w-3 h-3" /> Classes Copied</span>
                          ) : (
                            <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy class string</span>
                          )}
                        </button>
                      </div>
                      <div className="font-mono text-[0.66rem] text-slate-500 leading-relaxed bg-[var(--color-thread-off-white)] p-2.5 rounded-lg border border-black/5 break-all max-h-[72px] overflow-y-auto">
                        {btn.classCode}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[var(--color-thread-light-green)]/35 rounded-2xl p-5 border border-[var(--color-thread-mid-green)]/15 text-[0.82rem] text-slate-700 leading-relaxed font-sans">
              <strong className="text-[var(--color-thread-heading)] font-medium block mb-0.5">Component Integration Checklist</strong>
              Fully unified button mapping allows seamless navigation and state flow testing. These exact variants render reliably within settings drawers, priority tables, dialog sheets, and diagnostic dashboards.
            </div>
          </div>
        </section>

        {/* Card Style Mapping & Template Matrix */}
        <section className="bg-white rounded-bl-[36px] p-6 sm:p-10 border border-black/5 shadow-sm w-full font-sans">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[1.50rem] font-serif font-normal text-[var(--color-thread-heading)]">
                Active Card Style Mapping & Codebase Templates
              </h2>
              <p className="text-slate-500 text-[0.88rem] mt-0.5">
                Mapping exact card visual layouts, custom curvature options, and qualitative structural presets documented from actual workspace pages.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Bento Grid Matrix of Mapped Cards */}
            <div className="grid grid-cols-1 gap-8">
              {cardsInfo.map((card) => (
                <div 
                  key={card.name} 
                  className="bg-slate-50/50 border border-black/5 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Left block: True Visual Live Preview with Grid Background */}
                  <div className="p-5 sm:p-8 flex items-center justify-center bg-slate-100/50 border-b lg:border-b-0 lg:border-r border-black/5 lg:w-[45%] relative min-h-[340px] sm:min-h-[380px] overflow-hidden select-none">
                    {/* Clean blueprint dot grid background */}
                    <div 
                      className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                      style={{ 
                        backgroundImage: 'radial-gradient(var(--color-thread-mid-green) 1px, transparent 1px)', 
                        backgroundSize: '16px 16px' 
                      }} 
                    />
                    
                    <div className="relative z-10 w-full flex justify-center">
                      {card.sampleType === 'generic' && (
                        <Card hoverable className="w-full max-w-[340px]">
                          <CardHeader>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[0.62rem] tracking-wider uppercase font-medium text-slate-400">CareTeam Node</span>
                              <span 
                                onClick={() => {
                                  const nextStatus = genericCardStatus === 'active' ? 'completed' : 'active';
                                  setGenericCardStatus(nextStatus);
                                  addLog(`Generic Card: Simulated clinician session state toggled to '${nextStatus}'`);
                                }}
                                className={cn(
                                  "text-[0.64rem] px-2.5 py-0.5 rounded-full font-medium cursor-pointer transition-colors",
                                  genericCardStatus === 'active' 
                                    ? 'bg-emerald-100 text-emerald-800 animate-pulse' 
                                    : 'bg-slate-100 text-slate-600'
                                )}
                              >
                                {genericCardStatus === 'active' ? '● LIVE SESSION' : '✓ COMPLETED'}
                              </span>
                            </div>
                            <CardTitle className="text-[1.12rem] leading-snug font-serif">
                              Speech & Language Assessment
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-[0.84rem] text-slate-500 leading-relaxed">
                              Initial diagnostics mapping phoneme markers and alveolar fricatives.
                            </p>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-thread-light-gray)]/50">
                              <div className="text-[0.74rem] text-slate-400 font-medium">SLP: Dr. C. Chen</div>
                              <button 
                                onClick={() => addLog("Generic Card CTA: Selected 'Review Diagnostics' channel.")}
                                className="text-[0.78rem] font-medium text-[var(--color-thread-mid-green)] hover:opacity-80 transition-opacity cursor-pointer inline-flex items-center gap-1"
                              >
                                Review Diagnostics &rarr;
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {card.sampleType === 'priority' && (
                        <div className="w-full max-w-[340px] bg-white p-7 overflow-hidden rounded-[20px] shadow-sm border border-black/5 flex flex-col text-left">
                          <div className="flex flex-col sm:flex-row gap-3.5 items-start mb-4 relative">
                            <span className="text-[0.75rem] tracking-[0.1em] uppercase font-medium px-4 py-2 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex-shrink-0 mt-1">
                              Next
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-sans font-medium text-[1.22rem] tracking-tight text-[var(--color-thread-dark-slate)] mb-1">
                                Emotional regulation
                              </div>
                              <div className="text-[0.82rem] text-[var(--color-thread-gray)] font-sans">
                                Moderate impact · prepare months ahead
                              </div>
                            </div>
                          </div>
                          <p className="text-[0.92rem] text-slate-500 leading-relaxed mb-5 relative">
                            Frustration around homework cycles gets real. Tackling attention first does double duty.
                          </p>
                          <div className="bg-[var(--color-thread-off-white)] rounded-[20px] px-5 py-4 mb-4 relative">
                            <span className="text-[0.72rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-2 block">
                              Why it ranks here
                            </span>
                            <div className="space-y-0 text-[0.82rem]">
                              <div className="flex justify-between border-b border-black/5 py-1.5">
                                <span className="text-slate-500">Functional impact</span>
                                <span className="font-medium text-slate-700">Moderate</span>
                              </div>
                              <div className="flex justify-between pt-1.5">
                                <span className="text-slate-500">Family burden</span>
                                <span className="font-medium text-slate-700">High</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-[0.82rem] flex items-center gap-2 text-slate-500 leading-tight mt-auto pt-3 border-t border-black/5">
                            <ArrowRight className="w-4 h-4 flex-shrink-0 text-[var(--color-thread-mid-green)]" />
                            <span>Linked to <strong>Classroom attention</strong></span>
                          </div>
                        </div>
                      )}

                      {card.sampleType === 'strategy' && (
                        <div className="w-full max-w-[340px] bg-white p-6 shadow-sm rounded-[18px] border border-black/5 flex flex-col text-left">
                          <div className="flex items-center gap-2.5 mb-3.5">
                            <div className="w-[34px] h-[34px] rounded-[9px] bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center flex-shrink-0">
                              <Activity className="w-4.5 h-4.5 stroke-[1.8]" />
                            </div>
                            <h3 className="text-[1.05rem] font-medium tracking-tight text-slate-800 font-sans">
                              At school
                            </h3>
                          </div>
                          <div className="flex flex-col">
                            {[
                              "Seat Maya near the front, away from busy pathways.",
                              "Break tasks into short, clear, manageable chunks.",
                              "Agree a quiet, subtle redirection signal."
                            ].map((item, i) => (
                              <div 
                                key={i} 
                                className={cn(
                                  "flex gap-2.5 py-2 text-[0.86rem] text-slate-600 leading-relaxed font-sans",
                                  i === 0 && "pt-0"
                                )}
                              >
                                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--color-thread-mid-green)] mt-[7px]" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {card.sampleType === 'strength' && (
                        <div className="w-full max-w-[340px] bg-white p-6.5 rounded-tr-[32px] border border-black/5 flex flex-col text-left shadow-sm">
                          <div className="w-[44px] h-[44px] rounded-[13px] bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)] mb-4">
                            <Star className="w-[18px] h-[18px] stroke-[1.8] fill-emerald-100" />
                          </div>
                          <h3 className="text-[1.16rem] font-medium tracking-tight text-[var(--color-thread-heading)] mb-2 leading-tight font-sans">
                            Creative Play
                          </h3>
                          <p className="text-[0.88rem] text-slate-500 leading-relaxed font-sans">
                            Displays rich imaginative flow, abstract play and artistic task retention. A real strength to build on.
                          </p>
                        </div>
                      )}

                      {card.sampleType === 'value' && (
                        <div 
                          onClick={() => {
                            setValueCardForest(!valueCardForest);
                            addLog(`Value Card: Swapped live preview theme to ${!valueCardForest ? "Solid Deep Forest" : "Warm Vintage Cream"}`);
                          }}
                          className={cn(
                            "p-7 relative overflow-hidden w-full max-w-[340px] h-[190px] rounded-[20px] transition-all duration-350 shadow-sm cursor-pointer flex flex-col justify-between text-left",
                            valueCardForest ? "bg-[var(--color-thread-dark-forest)] text-white" : "bg-[var(--color-thread-cream)] text-[var(--color-thread-darkest)]"
                          )}
                        >
                          <svg
                            className="absolute -right-[60px] -top-[70px] opacity-15 pointer-events-none"
                            width="200"
                            height="200"
                          >
                            <circle cx="100" cy="100" r="38" fill="none" stroke={valueCardForest ? "white" : "black"} strokeOpacity={valueCardForest ? "1" : "0.2"} strokeWidth="1" />
                            <circle cx="100" cy="100" r="68" fill="none" stroke={valueCardForest ? "white" : "black"} strokeOpacity={valueCardForest ? "1" : "0.2"} strokeWidth="1" />
                            <circle cx="100" cy="100" r="98" fill="none" stroke={valueCardForest ? "white" : "black"} strokeOpacity={valueCardForest ? "1" : "0.2"} strokeWidth="1" />
                          </svg>
                          <div className="relative">
                            <h3 className="text-[1.12rem] font-medium tracking-tight mb-1.5 relative font-sans">
                              Evidence &rArr; Formulation
                            </h3>
                            <p className={cn("text-[0.86rem] leading-relaxed relative", valueCardForest ? "text-white/85" : "text-slate-600 font-sans")}>
                              Every clinique is traced back to its source and confirmed with certified reviewers.
                            </p>
                          </div>
                          <span className="text-[0.66rem] font-mono tracking-wider opacity-65 font-medium block">
                            Click to Swap Style View &rarr;
                          </span>
                        </div>
                      )}

                      {card.sampleType === 'guide' && (
                        <div className="w-full max-w-[340px] bg-white flex flex-col cursor-pointer transition-all group overflow-hidden rounded-tr-[32px] shadow-sm border border-black/5 text-left">
                          <div className="w-full aspect-[16/9] overflow-hidden bg-slate-100 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-thread-light-green)]/70 to-[var(--color-thread-cream)]/40 z-[1]" />
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <span className="text-[0.58rem] tracking-[0.14em] uppercase text-[var(--color-thread-muted-green)] font-medium mb-2 font-sans">Parent Methods</span>
                            <h3 className="text-[1.12rem] font-medium tracking-tight leading-tight mb-1 text-slate-900 font-serif">
                              Interactive Vocalization Timing
                            </h3>
                            <p className="text-[0.84rem] text-slate-500 leading-relaxed font-sans">
                              Actionable feedback strategies mapping daily child-led verbal learning profiles.
                            </p>
                            <div className="flex items-center justify-between pt-3 mt-4 border-t border-black/5">
                              <span className="text-[0.74rem] text-slate-400 font-sans">12 min read</span>
                              <ActionLink variant="slate" as="span" className="text-[0.8rem] group-hover:text-[var(--color-thread-mid-green)]">
                                Read guide
                              </ActionLink>
                            </div>
                          </div>
                        </div>
                      )}

                      {card.sampleType === 'synthesis' && (
                        <div className="w-full max-w-[340px]">
                          <HeroQuoteCard
                            variant="green"
                            className="p-7 shadow-sm border border-black/5 text-left"
                            kicker="Clinician Synthesis Summary"
                            quote="Maya is showing marked improvements in auditory processing, though focus remains tethered to circadian stability."
                            evidenceLevel={3}
                            evidenceText="Strong formulation"
                            evidenceVariant="green"
                            action={
                              <button 
                                onClick={() => addLog("Synthesis Card Clinician Open Insights triggered.")}
                                className="bg-white text-[var(--color-thread-dark-forest)] font-medium text-[0.82rem] px-4 py-2 rounded-full hover:bg-slate-50 transition-all font-sans cursor-pointer shadow-xs inline-flex items-center gap-1"
                              >
                                Open Insights <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
                              </button>
                            }
                          />
                        </div>
                      )}

                      {card.sampleType === 'quarter' && (
                        <div className="w-full max-w-[340px]">
                          <PlanProgressCard
                            progress={quarterProgressValue}
                            statusText="on track — steady progress"
                            nextReview="12 September"
                            className="rounded-bl-[32px] border border-black/5"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right block: Spec sheets and mapping details */}
                  <div className="p-5 sm:p-8 flex flex-col justify-between lg:w-[55%] bg-white min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-3.5">
                        <span className="text-[0.66rem] uppercase tracking-wider font-medium text-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)] px-2.5 py-1 rounded-md">
                          {card.type}
                        </span>
                      </div>
                      <h3 className="font-serif font-normal text-[1.45rem] text-[var(--color-thread-heading)] leading-snug mb-3">
                        {card.name}
                      </h3>
                      <p className="text-[0.88rem] text-slate-500 leading-relaxed mb-6">
                        {card.usage}
                      </p>

                      {/* Codebase location mapping */}
                      <div className="mb-6">
                        <div className="text-[0.66rem] uppercase tracking-wider font-medium text-slate-400 mb-2.5">Codebase Integration Map</div>
                        <div className="flex flex-wrap gap-1.5">
                          {card.whereUsed.split(', ').map((loc) => (
                            <span key={loc} className="text-[0.68rem] font-mono font-medium text-slate-600 bg-slate-100 border border-black/5 px-2.5 py-1 rounded-md break-all">
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Class spec sheet */}
                    <div className="border-t border-black/5 pt-5 mt-auto">
                      <div className="flex items-center justify-between gap-4 mb-2.5">
                        <span className="text-[0.66rem] uppercase tracking-wider font-medium text-slate-400">Tailwind Design Classes</span>
                        <button
                          onClick={() => handleCopy(card.classCode, card.name)}
                          className="text-[0.74rem] font-medium text-[var(--color-thread-mid-green)] hover:opacity-80 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === card.name ? (
                            <span className="flex items-center gap-1 text-emerald-600"><Check className="w-3 h-3" /> Classes Copied</span>
                          ) : (
                            <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy class string</span>
                          )}
                        </button>
                      </div>
                      <div className="font-mono text-[0.68rem] text-slate-500 leading-relaxed bg-[var(--color-thread-off-white)] p-3 rounded-lg border border-black/5 break-all max-h-[84px] overflow-y-auto">
                        {card.classCode}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[var(--color-thread-cream)] text-[var(--color-thread-darkest)] rounded-2xl p-5 border border-black/5 text-[0.82rem] leading-relaxed font-sans mt-2">
              <strong className="text-[var(--color-thread-heading)] font-medium block mb-0.5">Card Curvature Guidelines</strong>
              Consistent corner presets help establish proper content hierarchy. Standardized wrapper modules employ symmetric <code className="text-xs bg-black/5 px-1 rounded font-mono font-medium">rounded-2xl</code> curves to preserve clean, nested interfaces, while premium landing segments leverage dynamic asymmetric strokes.
            </div>
          </div>
        </section>

        {/* Unified Design System Components */}
        <section id="components" className="scroll-mt-28 bg-white rounded-tr-[36px] p-6 sm:p-10 border border-black/5 shadow-sm">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-serif font-normal text-[var(--color-thread-heading)]">
                Unified Core Components (DS)
              </h2>
              <p className="text-slate-500 text-[0.88rem] mt-0.5">
                Consolidated and highly reusable functional blocks keeping the layout simple, consistent, and maintainable.
              </p>
            </div>
          </div>

          <div className="space-y-10">
            {/* Component 1: AreaItem */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">1. Area Status Item (AreaItem)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/AreaItem.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Used to display specific trend parameters, current status tags, and clinical observation highlights with dynamic background tags.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AreaItem
                  title="Classroom attention"
                  description="Focus in class is improving as the strategies take hold."
                  status="Improving"
                  icon={<ArrowUpRight className="w-3 h-3 stroke-[2.4]" />}
                />
                <AreaItem
                  title="Emotional regulation at home"
                  description="Holding steady — likely to ease further as attention improves."
                  status="Steady"
                  icon={<Minus className="w-3 h-3 stroke-[2.4]" />}
                />
              </div>
            </div>

            {/* Component 2: TimelineItem */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">2. Roadmap / Priority Timeline (TimelineItem)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/TimelineItem.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Unified component serving both collapsible accordion lines (on Dashboard/Home) and static prioritized lists (on Priorities). Includes built-in progress bars and supporting dependency links. For a completed quarter (100%) child such as Liam, tags shift to <strong>New · Then · Later</strong> and <code className="font-mono text-[0.8rem]">hideMetrics</code> (auto-applied when <code className="font-mono text-[0.8rem]">progress=100</code>) drops the clinical weighting, plan-progress, and See details affordances.
              </p>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5">
                  <span className="text-[0.68rem] font-medium text-slate-400 block mb-3 uppercase">Collapsible Accordion View (Dashboard)</span>
                  <TimelineItem
                    tag="Now"
                    title="Classroom attention"
                    meta="High impact · clearest theme across every source"
                    content="Tackling attention first reduces cognitive friction and supports secondary behaviors."
                    progress={35}
                    active
                    isCollapsible={true}
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5">
                  <span className="text-[0.68rem] font-medium text-slate-400 block mb-3 uppercase">Static/Always-Expanded View with Clinical Weighting (Priorities)</span>
                  <TimelineItem
                    tag="Next"
                    title="Emotional regulation at home"
                    meta="Moderate impact · prepare over coming months"
                    content="Holding steady — likely to ease further as core attention capacity improves."
                    facts={{
                      "Functional impact": "Moderate",
                      "Family burden": "High",
                      "School focus": "Developing"
                    }}
                    dependency="Linked to improvements in <strong>Classroom attention</strong> strategies."
                    progress={15}
                    isCollapsible={false}
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5">
                  <span className="text-[0.68rem] font-medium text-slate-400 block mb-3 uppercase">Completed Quarter · 100% (Maintenance — metrics hidden)</span>
                  <TimelineItem
                    tag="New"
                    title="This quarter's plan"
                    meta="100% complete · Maintenance active"
                    content="Goals for this quarter are met. Routines that helped stay steady while review evidence is gathered."
                    facts={{
                      "Plan progress": "100%",
                      "Clinical confidence": "High",
                    }}
                    dependency="Closes the current plan before a new <strong>New · Then · Later</strong> order is agreed."
                    progress={100}
                    active
                    isCollapsible={false}
                  />
                  <TimelineItem
                    tag="Then"
                    title="Next review session"
                    meta="12 December · Clinician-led decision"
                    content="The clinician reviews what stayed stable and whether enrichment, light maintenance, or a new focus is right."
                    facts={{
                      "Decision owner": "Clinician",
                      "Priority order": "Not set yet",
                    }}
                    dependency="The next <strong>New</strong>, <strong>Then</strong>, and <strong>Later</strong> priorities are decided after this review."
                    progress={0}
                    isCollapsible={false}
                    hideMetrics
                  />
                </div>
              </div>
            </div>

            {/* Component 3: Clinical Weighting */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">3. Clinical Weighting (ClinicalWeighting)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/ClinicalWeighting.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Encapsulated card layout designed to structure objective clinical markers side-by-side using FactRow elements.
              </p>
              <div className="max-w-md">
                <ClinicalWeighting
                  facts={{
                    "Assessed Area": "Auditory Processing",
                    "Severity Index": "Mild-Moderate",
                    "Evidence Count": "5 Sources"
                  }}
                  className="border border-black/5 shadow-xs"
                />
              </div>
            </div>

            {/* Component 4: Evidence Badge & Meter */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">4. Evidence Badge & Meter (EvidenceBadge / EvidenceMeter)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/EvidenceBadge.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Dynamic, micro-visual indicators reflecting formulation confidence and source levels throughout the application (e.g. key synthesis, details, resources).
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex items-center gap-4">
                  <span className="text-[0.66rem] font-medium text-slate-400 uppercase">Strong:</span>
                  <EvidenceBadge level={3} />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex items-center gap-4">
                  <span className="text-[0.66rem] font-medium text-slate-400 uppercase">Moderate:</span>
                  <EvidenceBadge level={2} />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex items-center gap-4">
                  <span className="text-[0.66rem] font-medium text-slate-400 uppercase">Emerging:</span>
                  <EvidenceBadge level={1} />
                </div>
              </div>
            </div>

            {/* Component 5: Clinical Insight Card */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">5. Clinical Insight Card (InsightCard)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/InsightCard.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Flexible card component mapping specific clinical and observation headers, supporting custom parent annotations and beautiful layout alignment.
              </p>
              <div className="max-w-md">
                <InsightCard
                  icon={<Activity className="w-5 h-5" />}
                  title="Auditory processing filters"
                  description="Displays rich imaginative flow and sound localization retention, supporting proactive listening strategies in crowded classrooms."
                />
              </div>
            </div>

            {/* Component 6: Resource Locker Item */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">6. Resource Locker Item (LockerItem)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/LockerItem.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Polished container with dedicated actions and elegant iconography used in resources and locker libraries for child-led strategies.
              </p>
              <div className="max-w-md">
                <LockerItem
                  icon={<Sparkles className="w-5 h-5" />}
                  title="Visual morning timers"
                  description="Structured checklists helping kids keep track of homework and transition cycles seamlessly."
                  action="Unlock Strategy Guide"
                />
              </div>
            </div>

            {/* Component 7: Contextual Badges */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">7. Contextual Badges (Badge)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/Badge.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Pill badges representing different prioritization categories (Now, Future, Clinical weightings, or Active selections) in metadata fields.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex items-center gap-3">
                  <span className="text-[0.66rem] font-medium text-slate-400 uppercase">Now:</span>
                  <Badge variant="now">Now</Badge>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex items-center gap-3">
                  <span className="text-[0.66rem] font-medium text-slate-400 uppercase">Future:</span>
                  <Badge variant="future">Future</Badge>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex items-center gap-3">
                  <span className="text-[0.66rem] font-medium text-slate-400 uppercase">Clinical:</span>
                  <Badge variant="clinical">Clinical Formulation</Badge>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex items-center gap-3">
                  <span className="text-[0.66rem] font-medium text-slate-400 uppercase">Active:</span>
                  <Badge variant="active">Active State</Badge>
                </div>
              </div>
            </div>

            {/* Component 8: Toggle Switch */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">8. Toggle Switch (Switch)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/Switch.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Interactive, accessible, and highly responsive boolean switch control employing smooth spring animations from motion.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex items-center gap-6 max-w-sm">
                <div className="flex-1">
                  <div className="text-[0.86rem] font-medium text-slate-800">Circadian Alert Notifications</div>
                  <div className="text-[0.74rem] text-slate-400">Send updates according to optimal focus cycles</div>
                </div>
                <Switch 
                  checked={demoSwitchOn} 
                  onCheckedChange={(val) => {
                    setDemoSwitchOn(val);
                    addLog(`Switch Component: Circadian notifications state set to '${val}'`);
                  }} 
                />
              </div>
            </div>

            {/* Component 9: Progress Bar */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">9. Standard Progress Bar (ProgressBar)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/ProgressBar.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Fluid layout progress meter tracking target metrics with graceful entering scale transitions.
              </p>
              <div className="p-5 bg-slate-50 rounded-xl border border-black/5 max-w-md space-y-4">
                <ProgressBar 
                  value={demoProgress} 
                  showLabel={true}
                />
                <div className="flex justify-between items-center gap-2 pt-2">
                  <button 
                    onClick={() => {
                      const nextVal = Math.max(0, demoProgress - 15);
                      setDemoProgress(nextVal);
                      addLog(`ProgressBar: Value decreased to ${nextVal}%`);
                    }}
                    className="text-xs font-medium text-slate-600 bg-white border border-black/5 px-2.5 py-1.5 rounded-lg shadow-xs hover:bg-slate-100 cursor-pointer"
                  >
                    -15% Decrease
                  </button>
                  <button 
                    onClick={() => {
                      const nextVal = Math.min(100, demoProgress + 15);
                      setDemoProgress(nextVal);
                      addLog(`ProgressBar: Value increased to ${nextVal}%`);
                    }}
                    className="text-xs font-medium text-[var(--color-thread-mid-green)] bg-white border border-black/5 px-2.5 py-1.5 rounded-lg shadow-xs hover:bg-slate-100 cursor-pointer"
                  >
                    +15% Increase
                  </button>
                </div>
              </div>
            </div>

            {/* Component 10: PageFooterCTA */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">10. Page Footer CTA Navigator (PageFooterCTA)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/PageFooterCTA.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Unified bottom navigation bar linking clinical steps with elegant editorial headings and predictable transitions.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-black/5">
                <PageFooterCTA
                  title="Understanding what's happening is the start."
                  buttonText="See what matters most"
                  onClick={() => {}}
                />
              </div>
            </div>

            {/* Component 11: Filter Category Selector (FilterTab) */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">11. Filter Category Selector (FilterTab)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/FilterTab.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Interactive pills used to toggle categories of clinical strategies, timelines, resources, and document provenance. Documents now support source filters such as Uploaded by you and Uploaded by Threadline.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex flex-wrap gap-2 items-center">
                {["all", "report", "uploaded-you", "uploaded-threadline"].map((cat) => (
                  <FilterTab 
                    key={cat} 
                    active={demoFilter === cat} 
                    label={
                      cat === "all"
                        ? "All files"
                        : cat === "uploaded-you"
                        ? "Uploaded by you"
                        : cat === "uploaded-threadline"
                        ? "Uploaded by Threadline"
                        : "Report"
                    } 
                    onClick={() => {
                      setDemoFilter(cat);
                      addLog(`FilterTab clicked: Active filter set to '${cat}'`);
                    }} 
                  />
                ))}
              </div>
            </div>

            {/* Component 12: Interactive File Share Item (FileItem) */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">12. Interactive File Share Item (FileItem)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/FileItem.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                File display listing for documentation, sources, or worksheets. Includes type, date, uploader source, and click-to-toggle shared access states.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-black/5 max-w-md">
                <FileItem
                  name="Speech_and_Language_2026.pdf"
                  typeName="Diagnostic Assessment"
                  date="14 Jan 2026"
                  uploadedBy="threadline"
                  shared={demoFileShared}
                  sharedWith="Clinician Team"
                  icon={FileText}
                  onToggleShare={() => {
                    setDemoFileShared(!demoFileShared);
                    addLog(`FileItem: Shared status toggled to '${!demoFileShared}'`);
                  }}
                />
              </div>
            </div>

            {/* Component 13: Circle Action Controls (IconButton) */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">13. Circle Action Controls (IconButton)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/IconButton.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Perfectly circular, high-contrast actions supporting sub-elements, status dots, and subtle icon scaling on hover. Widely used in TopBars and headers.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-black/5 flex gap-4 items-center">
                <IconButton 
                  hasBadge={true} 
                  onClick={() => addLog("IconButton: Notifications click triggered")}
                  title="Notifications"
                >
                  <Share2 className="w-4 h-4" />
                </IconButton>
                <IconButton 
                  hasBadge={false} 
                  onClick={() => addLog("IconButton: Settings control click triggered")}
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </IconButton>
              </div>
            </div>

            {/* Component 14: Action Navigator Link (QuickLink) */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">14. Action Navigator Link (QuickLink)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/QuickLink.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Full-width line navigation links featuring responsive trailing Chevrons. Designed for drawers or nested utility list navigation.
              </p>
              <div className="max-w-sm bg-white border border-black/5 rounded-xl p-4.5 shadow-sm">
                <QuickLink 
                  label="View full diagnostic assessment details" 
                  onClick={() => {
                    addLog("QuickLink: Opening Diagnostic Details view");
                    onPageChange("understanding");
                  }} 
                />
                <QuickLink 
                  label="Configure clinical weightings schema" 
                  onClick={() => {
                    addLog("QuickLink: Navigating to Settings panel");
                    onPageChange("settings");
                  }} 
                />
              </div>
            </div>

            {/* Component 15: Nested Detail Value Card (ValueCard) */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">15. Nested Detail Value Card (ValueCard)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/ValueCard.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Card layouts containing rich metadata with concentric circle SVG decorations. Supports solid theme blocks or clean white/cream layout backdrops.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ValueCard
                  title="Classroom Strategy"
                  content="Provide noise-dampening headphones during independent work to mitigate background classroom acoustic clutter."
                  solid={false}
                />
                <ValueCard
                  title="Target Priority"
                  content="Tackling active auditory focus limits downstream secondary social or emotional dysregulation events."
                  solid={true}
                />
              </div>
            </div>

            {/* Component 16: Top Hero Action Card (HeroActionCard) */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">16. Top Hero Action Card (HeroActionCard)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/HeroActionCard.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Highly interactive compact cards mapping core landing tasks, featuring dedicated icons and clean top-left/bottom-right layouts.
              </p>
              <div className="flex gap-4 overflow-x-auto pb-2">
                <HeroActionCard
                  icon={<Activity className="w-5 h-5 text-[var(--color-thread-mid-green)]" />}
                  title="Priorities"
                  subtitle="Tackle Now"
                  onClick={() => {
                    addLog("HeroActionCard: Navigating to Priorities page");
                    onPageChange("priorities");
                  }}
                />
                <HeroActionCard
                  icon={<FileText className="w-5 h-5 text-[var(--color-thread-mid-green)]" />}
                  title="Documents"
                  subtitle="3 Uploaded"
                  onClick={() => {
                    addLog("HeroActionCard: Navigating to Documents page");
                    onPageChange("documents");
                  }}
                />
              </div>
            </div>

            {/* Component 17: AI Copilot Input Bar (AICopilotBar) */}
            <div className="border-b border-black/5 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">17. AI Copilot Input Bar (AICopilotBar)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/AICopilotBar.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Floating conversational interface for AI-powered diagnostics. Supports text input, file attachments, and expandable clinical responses.
              </p>
              <div className="max-w-xl">
                <AICopilotBar currentChildName="Maya" placeholder="Ask anything about Maya's progress..." />
              </div>
            </div>

            {/* Component 18: Clinical Checklist Item (ChecklistItem) */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">18. Clinical Checklist Item (ChecklistItem)</h3>
                <span className="font-mono text-xs text-slate-400">src/components/ui/ChecklistItem.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Simple, high-contrast list item for diagnostic steps, observations, or required actions.
              </p>
              <div className="max-w-md p-6 bg-slate-50 rounded-xl border border-black/5">
                <ChecklistItem
                  title="Complete Auditory Screening"
                  description="Required to confirm environmental sound localization thresholds."
                />
              </div>
            </div>

            {/* Component 19: Secondary User Access */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-medium text-[1.12rem] text-slate-900">19. Secondary User Access (Settings)</h3>
                <span className="font-mono text-xs text-slate-400">src/context/SecondaryUsersContext.tsx</span>
              </div>
              <p className="text-slate-500 text-[0.88rem] mb-6">
                Workspace sharing pattern for inviting a partner, teacher, or carer. Each invitee carries a role and an access level — <strong>Full</strong> (mirrors the parent view) or <strong>Partial</strong> (limited scope, still <span className="font-mono text-[0.8rem]">TBD</span>). Invitees persist through <code className="font-mono text-[0.8rem]">SecondaryUsersContext</code> so they survive navigation like child profiles.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Access level selector */}
                <div className="p-5 bg-slate-50 rounded-xl border border-black/5">
                  <span className="text-[0.66rem] font-medium text-slate-400 block mb-3 uppercase tracking-wider">Access Level Selector</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setDemoUserAccess('full')}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all",
                        demoUserAccess === 'full'
                          ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                          : "border-black/5 hover:border-black/15 bg-white"
                      )}
                    >
                      <ShieldCheck className="w-5 h-5 text-[var(--color-thread-mid-green)] shrink-0 mt-0.5" />
                      <span className="flex flex-col">
                        <span className="font-medium text-[0.95rem] text-slate-900">Full access</span>
                        <span className="text-[0.74rem] text-slate-500 mt-0.5">Sees and manages everything</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoUserAccess('partial')}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-2xl border text-left transition-all",
                        demoUserAccess === 'partial'
                          ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/30 ring-2 ring-[var(--color-thread-mid-green)]/10"
                          : "border-black/5 hover:border-black/15 bg-white"
                      )}
                    >
                      <ShieldHalf className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                      <span className="flex flex-col">
                        <span className="font-medium text-[0.95rem] text-slate-900 flex items-center gap-2">
                          Partial
                          <span className="text-[0.6rem] tracking-[0.1em] uppercase font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">TBD</span>
                        </span>
                        <span className="text-[0.74rem] text-slate-500 mt-0.5">Limited scope — soon</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Invited user row */}
                <div className="p-5 bg-slate-50 rounded-xl border border-black/5">
                  <span className="text-[0.66rem] font-medium text-slate-400 block mb-3 uppercase tracking-wider">Invited User Row</span>
                  <div className="bg-white p-5 rounded-tr-[32px] shadow-premium-light flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-[42px] h-[42px] rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center font-medium text-[0.95rem] font-serif flex-shrink-0">
                        JW
                      </div>
                      <div>
                        <h4 className="font-medium text-[1rem] text-slate-900 tracking-tight">James Whitlock</h4>
                        <p className="text-[0.8rem] text-slate-500 mt-0.5">Partner · james@example.com</p>
                      </div>
                    </div>
                    <div className="flex bg-slate-100 rounded-xl p-1 border border-black/5">
                      <span className={cn("px-3 py-1.5 text-[0.74rem] font-medium rounded-lg", demoUserAccess === 'full' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>Full</span>
                      <span className={cn("px-3 py-1.5 text-[0.74rem] font-medium rounded-lg", demoUserAccess === 'partial' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>Partial</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Audit Meta Footer */}
      <div className="mt-14 pt-8 border-t border-black/5 flex justify-between items-center flex-wrap gap-4 text-[0.84rem] text-slate-500">
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[var(--color-thread-mid-green)]" />
          Active Threadline Style Guide · Dynamic stylesheet verification
        </span>
        <ActionLink
          onClick={() => onPageChange("settings")}
          variant="default"
          as="button"
        >
          Return to Settings page
        </ActionLink>
      </div>
      </PageContainer>
    </motion.div>
  );
}
