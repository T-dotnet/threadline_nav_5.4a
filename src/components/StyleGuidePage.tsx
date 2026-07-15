import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Code2,
  Copy,
  Monitor,
  Moon,
  PanelLeft,
  RotateCcw,
  Search,
  Smartphone,
  Sun,
  Tablet,
  X,
} from "lucide-react";
import type { Page } from "../types";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { MvpStoryPreview } from "./style-guide/MvpStoryPreview";
import {
  STORIES,
  STORY_BY_ID,
  STORY_GROUPS,
  type StoryGroupId,
  type StoryId,
} from "./style-guide/mvpCatalogue";
import { NEXT_EXAMPLES } from "./style-guide/nextExamples";

interface StyleGuidePageProps {
  onPageChange: (page: Page) => void;
}

type CanvasTone = "white" | "mint" | "dark";
type PreviewViewport = "desktop" | "tablet" | "mobile";

const CANVAS_TONES: Record<CanvasTone, string> = {
  white: "bg-white",
  mint: "bg-[var(--color-thread-light-green)]/45",
  dark: "bg-[var(--color-thread-heading)]",
};

const VIEWPORT_WIDTHS: Record<PreviewViewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

const VIEWPORT_OPTIONS = [
  { id: "desktop" as const, label: "Desktop", icon: Monitor },
  { id: "tablet" as const, label: "Tablet", icon: Tablet },
  { id: "mobile" as const, label: "Mobile", icon: Smartphone },
];

function CatalogueMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-7 w-7">
        <span className="absolute left-0 top-1 h-5 w-5 rounded-full border border-[var(--color-thread-mid-green)]/45" />
        <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-[var(--color-thread-heading)]" />
      </div>
      <div>
        <div className="text-[0.92rem] font-medium tracking-tight text-[var(--color-thread-heading)]">Threadline</div>
        <div className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-[var(--color-thread-muted-text)]">MVP system</div>
      </div>
    </div>
  );
}

export default function StyleGuidePage({ onPageChange }: StyleGuidePageProps) {
  const [selectedStoryId, setSelectedStoryId] = useState<StoryId>("colors");
  const [searchQuery, setSearchQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Set<StoryGroupId>>(
    () => new Set(STORY_GROUPS.map((group) => group.id)),
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [canvasTone, setCanvasTone] = useState<CanvasTone>("white");
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [copied, setCopied] = useState(false);

  const selectedStory = STORY_BY_ID[selectedStoryId];
  const nextExample = NEXT_EXAMPLES[selectedStoryId];
  const visibleStoryIds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return new Set(STORIES.map((story) => story.id));
    return new Set(
      STORIES.filter((story) =>
        `${story.title} ${story.description} ${story.group}`.toLowerCase().includes(query),
      ).map((story) => story.id),
    );
  }, [searchQuery]);

  const selectStory = (storyId: StoryId) => {
    setSelectedStoryId(storyId);
    setSidebarOpen(false);
  };

  const toggleGroup = (groupId: StoryGroupId) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const resetPreview = () => {
    setCanvasTone("white");
    setViewport("desktop");
  };

  const copyCode = async () => {
    try {
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
        await navigator.clipboard.writeText(nextExample.code);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = nextExample.code;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copiedSuccessfully = document.execCommand("copy");
        textarea.remove();
        if (!copiedSuccessfully) throw new Error("Copy command failed");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const sidebar = (
    <>
      <div className="border-b border-black/[0.07] p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            variant="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search MVP stories"
            aria-label="Search MVP stories"
            className="min-h-9 pl-9 text-xs"
          />
        </div>
      </div>
      <nav aria-label="Design system stories" className="flex-1 overflow-y-auto px-3 py-4">
        {STORY_GROUPS.map((group) => {
          const visibleStories = group.storyIds.filter((id) => visibleStoryIds.has(id));
          if (visibleStories.length === 0) return null;
          const isOpen = openGroups.has(group.id) || Boolean(searchQuery);
          return (
            <div key={group.id} className="mb-4">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between px-2 py-1.5 text-left text-[0.67rem] font-medium uppercase tracking-[0.12em] text-[var(--color-thread-muted-text)] hover:text-[var(--color-thread-heading)]"
                aria-expanded={isOpen}
              >
                {group.label}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", !isOpen && "-rotate-90")} />
              </button>
              {isOpen && (
                <div className="mt-1 space-y-0.5">
                  {visibleStories.map((storyId) => {
                    const story = STORY_BY_ID[storyId];
                    const selected = selectedStoryId === storyId;
                    return (
                      <button
                        key={storyId}
                        type="button"
                        onClick={() => selectStory(storyId)}
                        aria-current={selected ? "page" : undefined}
                        className={cn(
                          "flex min-h-9 w-full items-center justify-between rounded-md px-2.5 text-left text-[0.82rem] transition-colors",
                          selected
                            ? "bg-[var(--color-thread-heading)] text-white"
                            : "text-slate-700 hover:bg-white hover:text-[var(--color-thread-heading)]",
                        )}
                      >
                        {story.title}
                        {selected && <ChevronRight className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {visibleStoryIds.size === 0 && (
          <p className="px-2 py-4 text-sm leading-6 text-[var(--color-thread-muted-text)]">No MVP stories match “{searchQuery}”.</p>
        )}
      </nav>
    </>
  );

  const controls = (
    <div className="space-y-7">
      <div>
        <h2 className="text-[0.67rem] font-medium uppercase tracking-[0.13em] text-[var(--color-thread-muted-text)]">Canvas</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {([
            ["white", "White", Sun],
            ["mint", "Mint", Clipboard],
            ["dark", "Dark", Moon],
          ] as const).map(([tone, label, Icon]) => (
            <button
              key={tone}
              type="button"
              onClick={() => setCanvasTone(tone)}
              aria-pressed={canvasTone === tone}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-lg border text-[0.68rem] font-medium transition-colors",
                canvasTone === tone
                  ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/60 text-[var(--color-thread-heading)]"
                  : "border-black/[0.08] bg-white text-slate-600 hover:border-black/20",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[0.67rem] font-medium uppercase tracking-[0.13em] text-[var(--color-thread-muted-text)]">Viewport</h2>
        <div className="mt-3 space-y-1.5">
          {VIEWPORT_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setViewport(id)}
              aria-pressed={viewport === id}
              className={cn(
                "flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-xs font-medium transition-colors",
                viewport === id ? "bg-[var(--color-thread-heading)] text-white" : "bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              <span className="flex items-center gap-2.5"><Icon className="h-3.5 w-3.5" />{label}</span>
              {viewport === id && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={resetPreview}
        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-black/[0.09] bg-white text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Reset preview
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eef3f0] font-sans text-[var(--color-thread-dark-slate)]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/[0.08] bg-white px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] text-slate-600 lg:hidden"
            aria-label="Open catalogue navigation"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <CatalogueMark />
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-[var(--color-thread-light-green)] px-3 py-1.5 text-[0.66rem] font-medium uppercase tracking-[0.1em] text-[var(--color-thread-heading)] sm:inline">MVP only</span>
          <button
            type="button"
            onClick={() => setControlsOpen((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] text-slate-600 xl:hidden"
            aria-label="Toggle preview controls"
            aria-expanded={controlsOpen}
          >
            <Code2 className="h-4 w-4" />
          </button>
          <Button variant="tertiary" className="min-h-9 px-3 text-xs" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => onPageChange("all-children")}>
            Back to app
          </Button>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1800px] lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_244px]">
        <aside className="hidden min-h-0 flex-col border-r border-black/[0.07] bg-[#edf5f0] lg:flex">{sidebar}</aside>

        <main className="min-w-0 bg-[#f8faf9]">
          <div className="border-b border-black/[0.07] bg-white px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
            <div className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[var(--color-thread-mid-green)]">
              {STORY_GROUPS.find((group) => group.id === selectedStory.group)?.label}
            </div>
            <h1 className="thread-serif-heading mt-2 text-[2rem] leading-tight text-[var(--color-thread-heading)] sm:text-[2.5rem]">{selectedStory.title}</h1>
            <p className="mt-3 max-w-3xl text-sm font-light leading-6 text-[var(--color-thread-muted-text)] sm:text-base sm:leading-7">{selectedStory.description}</p>
          </div>

          {controlsOpen && (
            <div className="border-b border-black/[0.07] bg-[#f2f6f4] p-5 xl:hidden">{controls}</div>
          )}

          <div className="space-y-7 p-4 sm:p-7 xl:p-9">
            <section aria-labelledby="guidance-heading" className="grid gap-3 md:grid-cols-2">
              <div className="border-l-2 border-[var(--color-thread-mid-green)] bg-white p-4 sm:p-5">
                <h2 id="guidance-heading" className="text-[0.67rem] font-medium uppercase tracking-[0.14em] text-[var(--color-thread-mid-green)]">Use for</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedStory.useFor}</p>
              </div>
              <div className="border-l-2 border-amber-400 bg-white p-4 sm:p-5">
                <h2 className="text-[0.67rem] font-medium uppercase tracking-[0.14em] text-amber-700">Avoid</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedStory.avoid}</p>
              </div>
            </section>

            <section aria-labelledby="preview-heading" className="overflow-hidden border border-black/[0.08] bg-white">
              <div className="flex min-h-12 items-center justify-between border-b border-black/[0.07] px-4 sm:px-5">
                <div>
                  <h2 id="preview-heading" className="text-sm font-medium text-slate-900">Preview</h2>
                  <p className="hidden text-[0.68rem] text-slate-500 sm:block">Live production component</p>
                </div>
                <span className="font-mono text-[0.67rem] text-slate-500">{viewport} · {canvasTone}</span>
              </div>
              <div className={cn("min-h-[280px] overflow-x-auto p-4 sm:p-7", CANVAS_TONES[canvasTone])}>
                <div
                  className="mx-auto min-w-[320px] transition-[width] duration-200"
                  style={{ width: VIEWPORT_WIDTHS[viewport], maxWidth: VIEWPORT_WIDTHS[viewport] }}
                >
                  <MvpStoryPreview storyId={selectedStoryId} />
                </div>
              </div>
            </section>

            <section aria-labelledby="states-heading" className="overflow-hidden border border-black/[0.08] bg-white">
              <div className="border-b border-black/[0.07] px-4 py-3.5 sm:px-5">
                <h2 id="states-heading" className="text-sm font-medium text-slate-900">States & variants</h2>
                <p className="mt-0.5 text-[0.68rem] text-slate-500">Supported MVP states rendered from the same component.</p>
              </div>
              <div className="bg-[#f8faf9] p-4 sm:p-6">
                <MvpStoryPreview storyId={selectedStoryId} states />
              </div>
            </section>

            <section aria-labelledby="code-heading" className="overflow-hidden border border-black/[0.08] bg-[#10221d] text-white">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <Code2 className="h-3.5 w-3.5 text-emerald-300" />
                  <h2 id="code-heading" className="text-xs font-medium">Next.js implementation</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden rounded bg-emerald-300/10 px-2 py-1 font-mono text-[0.62rem] text-emerald-200 sm:inline">{nextExample.language} · {nextExample.file}</span>
                  <button type="button" onClick={copyCode} className="flex min-h-8 items-center gap-2 rounded-md px-2.5 text-[0.68rem] text-white/70 hover:bg-white/10 hover:text-white">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="border-b border-white/10 px-4 py-2 font-mono text-[0.65rem] text-white/45 sm:hidden">{nextExample.file}</div>
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-emerald-100 sm:p-5"><code>{nextExample.code}</code></pre>
            </section>
          </div>
        </main>

        <aside className="hidden border-l border-black/[0.07] bg-[#f2f6f4] p-5 xl:block">
          <div className="sticky top-21">{controls}</div>
        </aside>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/30" aria-label="Close catalogue navigation" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex h-full w-[min(86vw,320px)] flex-col bg-[#edf5f0] shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-black/[0.07] px-4">
              <CatalogueMark />
              <button type="button" onClick={() => setSidebarOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600" aria-label="Close catalogue navigation">
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}
    </div>
  );
}
