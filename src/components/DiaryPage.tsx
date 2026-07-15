import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  HeartPulse,
  NotebookPen,
  Paperclip,
  Pencil,
  Plus,
  School,
  Trash2,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCurrentChild } from "../context/ChildContext";
import type { DiaryEntry } from "../types";
import { cn } from "../lib/utils";
import { createId } from "../lib/diary";
import watercolorBg from "../assets/images/optimized/watercolor-bg-900.jpg";
import { FadeInScroll } from "./ui/FadeInScroll";
import { PageContainer } from "./ui/PageContainer";
import { PageHeader } from "./ui/PageHeader";
import { PageMetaRow } from "./ui/PageMetaRow";
import { SectionDescription } from "./ui/SectionDescription";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { FloatingActionButton } from "./ui/FloatingActionButton";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { ModalCloseButton, ModalShell } from "./ui/ModalShell";
import { DiaryEntryForm } from "./diary/DiaryEntryForm";
import { useDiaryEntryDraft } from "./diary/useDiaryEntryDraft";

function formatEntryDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getEntryPreviewText(entry: DiaryEntry) {
  const text = entry.note.trim() || "Saved with attachments only.";
  const words = text.split(/\s+/);
  return {
    short: words.slice(0, 20).join(" "),
    long: words.slice(0, 42).join(" "),
    shortTruncated: words.length > 20,
    longTruncated: words.length > 42,
  };
}

type BentoBlockType = "full" | "pair" | "trio" | "quad" | "feature";
type DiaryThemeDefinition = {
  id: string;
  label: string;
  icon: LucideIcon;
  tags: string[];
  keywords: string[];
};

const DIARY_THEME_DEFINITIONS: DiaryThemeDefinition[] = [
  {
    id: "food",
    label: "Food",
    icon: Utensils,
    tags: ["food", "meal", "meals", "nutrition"],
    keywords: ["snack", "breakfast", "lunch", "appetite", "food"],
  },
  {
    id: "school",
    label: "School",
    icon: School,
    tags: ["school", "learning", "teacher"],
    keywords: ["school pickup", "teacher", "class", "term report", "reading group", "pickup"],
  },
  {
    id: "activities",
    label: "Activities",
    icon: Activity,
    tags: ["activity", "activities", "art", "play", "movement"],
    keywords: ["drawing", "artwork", "park", "game", "swimming", "built", "lego", "club"],
  },
  {
    id: "health",
    label: "Health",
    icon: HeartPulse,
    tags: ["health", "sleep"],
    keywords: ["sleep", "slept", "stomach", "ache", "headache", "medicine", "sensory", "rest"],
  },
];

// Decide how to arrange the entry cards while keeping featured blocks varied:
// 1 -> one full-width card, 2 -> a 2-up row, 3 -> one large + two small,
// 4 -> a 2x2 grid. Larger counts alternate feature blocks with non-feature
// blocks, preferring 2x2 after a feature whenever four entries are available.
function buildBentoBlocks(count: number): { type: BentoBlockType; size: number }[] {
  const blocks: { type: BentoBlockType; size: number }[] = [];
  let remaining = count;

  if (remaining <= 4) {
    if (remaining === 1) return [{ type: "full", size: 1 }];
    if (remaining === 2) return [{ type: "pair", size: 2 }];
    if (remaining === 3) return [{ type: "feature", size: 3 }];
    return [{ type: "quad", size: 4 }];
  }

  let shouldFeature = true;

  while (remaining > 0) {
    if (shouldFeature && remaining >= 3 && remaining !== 4) {
      blocks.push({ type: "feature", size: 3 });
      remaining -= 3;
      shouldFeature = false;
    } else if (remaining >= 4) {
      blocks.push({ type: "quad", size: 4 });
      remaining -= 4;
      shouldFeature = true;
    } else if (remaining === 3) {
      blocks.push({ type: "trio", size: 3 });
      remaining -= 3;
      shouldFeature = true;
    } else if (remaining === 2) {
      blocks.push({ type: "pair", size: 2 });
      remaining -= 2;
      shouldFeature = true;
    } else {
      blocks.push({ type: "full", size: 1 });
      remaining -= 1;
      shouldFeature = true;
    }
  }

  return blocks;
}

function entryMatchesTheme(entry: DiaryEntry, theme: DiaryThemeDefinition) {
  const tags = entry.tags.map((tag) => tag.toLowerCase());
  const note = entry.note.toLowerCase();
  return (
    tags.some((tag) => theme.tags.includes(tag)) ||
    theme.keywords.some((keyword) => note.includes(keyword))
  );
}

function noteTextIncludes(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function sentenceFromLatestEntry(entries: DiaryEntry[]) {
  return entries[0]?.note.trim().split(/(?<=[.!?])\s+/)[0] || "The latest note adds useful context.";
}

function buildMockAiThemeInsight(
  theme: DiaryThemeDefinition,
  matchingEntries: DiaryEntry[],
  childName: string,
) {
  const text = matchingEntries.map((entry) => entry.note).join(" ").toLowerCase();
  const insights: string[] = [];

  if (theme.id === "food") {
    if (noteTextIncludes(text, ["breakfast", "cereal", "snack"])) {
      insights.push(
        `Food choices and snack timing seem to help ${childName} settle through transitions.`,
      );
    }
    if (noteTextIncludes(text, ["dinner", "meltdown"])) {
      insights.push("Dinner timing may be worth watching after a harder pre-meal evening.");
    }
  }

  if (theme.id === "school") {
    if (noteTextIncludes(text, ["reading group", "teacher", "prompting"])) {
      insights.push(
        `${childName} is showing more independence at school, especially in reading group.`,
      );
    }
    if (noteTextIncludes(text, ["pickup", "term report", "focus notes"])) {
      insights.push("Pickup and report notes are useful signals for the next session.");
    }
  }

  if (theme.id === "activities") {
    if (noteTextIncludes(text, ["drawing", "artwork", "talked through every detail"])) {
      insights.push(
        `Creative activities are bringing out pride and easy communication for ${childName}.`,
      );
    }
    if (noteTextIncludes(text, ["swimming", "pool", "full lesson"])) {
      insights.push("Swimming looks positive when quiet recovery follows.");
    }
  }

  if (theme.id === "health") {
    if (noteTextIncludes(text, ["slept right through", "bright mood", "slow start"])) {
      insights.push(
        `Sleep seems closely linked to brighter, easier mornings for ${childName}.`,
      );
    }
    if (noteTextIncludes(text, ["quiet rest", "swimming", "rest afterward"])) {
      insights.push("Quiet recovery after bigger activities helps the day stay manageable.");
    }
  }

  if (insights.length === 0) {
    return `AI summary: ${sentenceFromLatestEntry(matchingEntries)}`;
  }

  return insights[0];
}

function buildThemeHighlights(entries: DiaryEntry[], childName: string) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const highlights = DIARY_THEME_DEFINITIONS.map((theme) => {
    const matchingEntries = sortedEntries.filter((entry) => entryMatchesTheme(entry, theme));
    if (matchingEntries.length === 0) return null;

    const latestAt = new Date(matchingEntries[0].createdAt).getTime();

    return {
      ...theme,
      count: matchingEntries.length,
      description: buildMockAiThemeInsight(theme, matchingEntries, childName),
      latestAt,
    };
  })
    .filter((theme): theme is NonNullable<typeof theme> => Boolean(theme))
    .sort((a, b) => b.count - a.count || b.latestAt - a.latestAt)
    .slice(0, 3);

  return highlights.length >= 2 ? highlights : [];
}

export default function DiaryPage() {
  const { currentChild, childrenList, updateChild } = useCurrentChild();
  const location = useLocation();
  const navigate = useNavigate();
  const draft = useDiaryEntryDraft();
  const { resetDraft } = draft;
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(currentChild.id || currentChild.name);

  const allEntries = useMemo(() => {
    return childrenList.flatMap((child) => 
      (child.diaryEntries || []).map((entry) => ({
        ...entry,
        childName: child.name,
        childId: child.id || child.name
      }))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [childrenList]);

  const entries = allEntries;
  const childOptions = useMemo(
    () => childrenList.map((child) => ({ id: child.id || child.name, name: child.name })),
    [childrenList],
  );
  const selectedChild = useMemo(
    () =>
      childrenList.find((child) => (child.id || child.name) === selectedChildId) ||
      currentChild,
    [childrenList, currentChild, selectedChildId],
  );
  const diarySummary = useMemo(() => {
    if (entries.length === 0) {
      return {
        title: "No diary entries yet.",
        body: `Once you add a note, this space will pull together the main themes, routines, and supporting uploads that are starting to stand out across all children.`,
      };
    }

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latestEntry = sortedEntries[0];
    const recentTags = Array.from(
      new Set(sortedEntries.flatMap((entry) => entry.tags).filter(Boolean)),
    ).slice(0, 3);
    const hasAttachments = sortedEntries.some((entry) => entry.attachments.length > 0);
    const latestNote = latestEntry.note.trim();

    const summaryParts = [
      recentTags.length > 0
        ? `Recent themes are ${recentTags.join(", ").toLowerCase()}.`
        : `The diary is building a general picture across all children.`,
      hasAttachments
        ? "Some entries already include images or documents to support the written notes."
        : "So far the diary is mostly text-based, which keeps the everyday observations easy to skim.",
      latestNote
        ? `The latest note says, "${latestNote}"`
        : `The most recent update was saved on ${formatEntryDate(latestEntry.createdAt)}.`,
    ];

    return {
      title: `A quick picture of the diary so far.`,
      body: summaryParts.join(" "),
    };
  }, [entries]);
  const themeHighlights = useMemo(
    () => (entries.length > 4 ? buildThemeHighlights(entries, "your children") : []),
    [entries],
  );

  const openComposer = () => {
    setEditingId(null);
    setSelectedChildId(currentChild.id || currentChild.name);
    resetDraft();
    setIsComposerOpen(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("compose") !== "1") return;

    setEditingId(null);
    setSelectedChildId(currentChild.id || currentChild.name);
    resetDraft();
    setIsComposerOpen(true);

    params.delete("compose");
    const nextSearch = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  }, [location.pathname, location.search, navigate, resetDraft]);

  const openEditComposer = (entry: DiaryEntry & { childId?: string }) => {
    setEditingId(entry.id);
    const associatedChild = childrenList.find(child => (child.diaryEntries || []).some(e => e.id === entry.id));
    setSelectedChildId(associatedChild?.id || entry.childId || currentChild.id || currentChild.name);
    resetDraft(entry);
    setIsComposerOpen(true);
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    setEditingId(null);
  };

  const handleSaveEntry = () => {
    if (!draft.validateDraft()) return;

    setIsSaving(true);
    const entryDraft = draft.getEntryDraft();

    if (editingId) {
      const targetChild = childrenList.find(child => (child.diaryEntries || []).some(entry => entry.id === editingId));
      if (targetChild) {
        updateChild({
          ...targetChild,
          diaryEntries: (targetChild.diaryEntries || []).map((entry) =>
            entry.id === editingId
              ? { ...entry, ...entryDraft }
              : entry,
          ),
        });
      }
    } else {
      const entry: DiaryEntry = {
        id: createId("entry"),
        createdAt: new Date().toISOString(),
        ...entryDraft,
      };

      const targetChild = childrenList.find(child => (child.id || child.name) === selectedChildId) || currentChild;
      updateChild({
        ...targetChild,
        diaryEntries: [entry, ...(targetChild.diaryEntries || [])],
      });
    }

    resetDraft();
    setIsSaving(false);
    setIsComposerOpen(false);
    setEditingId(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    const targetChild = childrenList.find(child => (child.diaryEntries || []).some(entry => entry.id === entryId));
    if (targetChild) {
      updateChild({
        ...targetChild,
        diaryEntries: (targetChild.diaryEntries || []).filter((entry) => entry.id !== entryId),
      });
    }
  };

  const renderEntryCard = (
    entry: DiaryEntry & { childName?: string },
    isFeature: boolean,
    positionClassName: string,
  ) => {
    const imageAttachment = entry.attachments.find((attachment) => attachment.kind === "image");
    const cardImage = imageAttachment?.dataUrl || watercolorBg;
    const preview = getEntryPreviewText(entry);

    return (
      <div
        key={entry.id}
        className={cn(
          "group relative overflow-hidden",
          positionClassName,
          isFeature ? "text-white" : "bg-white text-[var(--color-thread-heading)]",
        )}
      >
        {isFeature && (
          <>
            <img
              src={cardImage}
              alt={imageAttachment?.name || "Watercolor diary background"}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-slate-950/10" />
          </>
        )}

        <div className="relative h-full p-5 sm:p-6 flex flex-col">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={() => openEditComposer(entry)}
              className={cn(
                "inline-flex items-center justify-center w-9 h-9 rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100",
                isFeature
                  ? "bg-white/14 text-white hover:bg-white/22"
                  : "bg-white/80 text-slate-500 hover:text-[var(--color-thread-mid-green)]",
              )}
              aria-label="Edit entry"
            >
              <Pencil className="w-4 h-4 stroke-[1.8]" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteEntry(entry.id)}
              className={cn(
                "inline-flex items-center justify-center w-9 h-9 rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100",
                isFeature
                  ? "bg-white/14 text-white hover:bg-white/22"
                  : "bg-white/80 text-slate-500 hover:text-rose-600",
              )}
              aria-label="Remove entry"
            >
              <Trash2 className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>

          <div className="mt-auto">
            <div
              className={cn(
                "flex items-center gap-2 text-[0.72rem] tracking-[0.12em] uppercase font-medium flex-wrap",
                isFeature ? "text-white/80" : "text-[var(--color-thread-gray)]",
              )}
            >
              <CalendarDays className="w-4 h-4 stroke-[1.8]" />
              {formatEntryDate(entry.createdAt)}
              {entry.childName && (
                <span className={cn(
                  "ml-1 px-1.5 py-0.5 rounded text-[0.65rem] font-medium tracking-wider uppercase",
                  isFeature ? "bg-white/18 text-white border border-white/10" : "bg-slate-100 text-slate-700"
                )}>
                  {entry.childName}
                </span>
              )}
            </div>

            {entry.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.slice(0, isFeature ? 4 : 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="clinical"
                    className={cn(isFeature && "bg-white/14 text-white border-white/10")}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <p
              className={cn(
                "mt-4 whitespace-pre-wrap",
                isFeature
 ? "font-serif text-[1.55rem] leading-[1.34] tracking-tight max-w-[34ch] line-clamp-5"
                  : "text-[0.95rem] leading-relaxed line-clamp-2",
              )}
            >
              {isFeature
                ? `${preview.long}${preview.longTruncated ? "..." : ""}`
                : `${preview.short}${preview.shortTruncated ? "..." : ""}`}
            </p>

            {!isFeature && entry.attachments.length > 0 && (
              <div
                className={cn(
                  "mt-4 inline-flex items-center gap-2 text-[0.78rem] font-medium",
                  "text-[var(--color-thread-mid-green)]",
                )}
              >
                <Paperclip className="w-4 h-4 stroke-[1.8]" />
                {entry.attachments.length} attachment{entry.attachments.length === 1 ? "" : "s"}
              </div>
            )}

            {isFeature && imageAttachment && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/14 px-3.5 py-2 text-[0.8rem] font-medium text-white">
                <Paperclip className="w-4 h-4 stroke-[1.8]" />
                Text on image
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEntryBlocks = () => {
    const blocks = buildBentoBlocks(entries.length);
    let cursor = 0;

    return blocks.map((block, blockIndex) => {
      const slice = entries.slice(cursor, cursor + block.size);
      cursor += block.size;

      if (block.type === "full") {
        return (
          <div key={blockIndex} className="grid grid-cols-1">
            {renderEntryCard(slice[0], true, "rounded-tr-[36px] min-h-[320px]")}
          </div>
        );
      }

      if (block.type === "pair") {
        return (
          <div key={blockIndex} className="grid gap-4 sm:grid-cols-2">
            {slice.map((entry) =>
              renderEntryCard(entry, false, "rounded-bl-[28px] min-h-[240px]"),
            )}
          </div>
        );
      }

      if (block.type === "trio") {
        return (
          <div key={blockIndex} className="grid gap-4 md:grid-cols-3">
            {slice.map((entry) =>
              renderEntryCard(entry, false, "rounded-bl-[28px] min-h-[220px]"),
            )}
          </div>
        );
      }

      if (block.type === "quad") {
        return (
          <div key={blockIndex} className="grid gap-4 sm:grid-cols-2">
            {slice.map((entry) =>
              renderEntryCard(entry, false, "rounded-bl-[28px] min-h-[210px]"),
            )}
          </div>
        );
      }

      // feature: one large card with two small cards stacked beside it
      return (
        <div key={blockIndex} className="grid gap-4 lg:grid-cols-3 lg:auto-rows-[200px]">
          {renderEntryCard(
            slice[0],
            true,
            "rounded-tr-[36px] min-h-[360px] lg:col-span-2 lg:row-span-2",
          )}
          {slice.slice(1).map((entry) =>
            renderEntryCard(entry, false, "rounded-bl-[28px] min-h-[200px]"),
          )}
        </div>
      );
    });
  };

  const renderThemeHighlights = () => {
    if (themeHighlights.length === 0) return null;

    return (
      <div
        className={cn(
          "mt-5 grid gap-4",
          themeHighlights.length === 2 && "md:grid-cols-2",
          themeHighlights.length === 3 && "md:grid-cols-3",
        )}
      >
        {themeHighlights.map((theme) => {
          const Icon = theme.icon;

          return (
            <article
              key={theme.id}
              className="bg-white rounded-tr-[28px] p-6 sm:p-7 text-[var(--color-thread-heading)]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]">
                  <Icon className="h-4.5 w-4.5 stroke-[1.8]" />
                </span>
                <div>
                  <SectionLabel className="mb-0">
                    {theme.label}
                  </SectionLabel>
                  <p className="mt-2 text-[0.86rem] font-medium leading-relaxed text-[var(--color-thread-gray)]">
                    AI summary from {theme.count} {theme.count === 1 ? "note" : "notes"}.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[0.94rem] leading-relaxed text-[var(--color-thread-dark-slate)]">
                {theme.description}
              </p>

            </article>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <ModalShell isOpen={isComposerOpen} titleId="diary-entry-modal-title">
            <div className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
              <div>
                <span className="text-[0.68rem] tracking-[0.18em] uppercase font-medium text-[var(--color-thread-mid-green)]">
                  {editingId ? "Edit entry" : "New entry"}
                </span>
                <h2
                  id="diary-entry-modal-title"
 className="mt-2 font-serif text-[1.75rem] sm:text-[2rem] leading-[1.08] tracking-tight text-[var(--color-thread-heading)]"
                >
                  {editingId ? "Edit note for" : "Add a note for"} {editingId ? (childrenList.find(child => (child.diaryEntries || []).some(entry => entry.id === editingId))?.name || currentChild.name) : selectedChild.name}.
                </h2>
              </div>
              <ModalCloseButton
                onClick={closeComposer}
                label="Close add note modal"
                className="cursor-pointer"
              />
            </div>

            <DiaryEntryForm
              childName={editingId ? (childrenList.find(child => (child.diaryEntries || []).some(entry => entry.id === editingId))?.name || currentChild.name) : selectedChild.name}
              description="Use the diary for quick everyday observations. If a full clinical report needs to be stored, keep using the Documents section."
              childOptions={editingId ? undefined : childOptions}
              selectedChildId={editingId ? undefined : selectedChildId}
              note={draft.note}
              selectedTags={draft.selectedTags}
              draftAttachments={draft.draftAttachments}
              error={draft.error}
              fileInputRef={draft.fileInputRef}
              isSaving={isSaving}
              submitLabel={editingId ? "Save changes" : "Save diary entry"}
              onSelectedChildChange={editingId ? undefined : setSelectedChildId}
              onNoteChange={draft.setNote}
              onToggleTag={draft.toggleTag}
              onPickFiles={draft.pickFiles}
              onAttachmentChange={draft.handleAttachmentChange}
              onRemoveAttachment={draft.removeDraftAttachment}
              onCancel={closeComposer}
              onSubmit={handleSaveEntry}
            />
      </ModalShell>

      <PageContainer>
        <PageHeader
          kicker="Daily diary"
          title="Observations diary."
          titleClassName="md:leading-[1.12] tracking-normal break-words"
          description={
            <>
              <SectionDescription>
                Add a quick note, tag what it relates to, and keep images or short documents beside the moment they belong to, across all children.
              </SectionDescription>
              <PageMetaRow
                className="mt-6 gap-4"
                itemClassName="gap-2"
                items={[
                  { icon: NotebookPen, children: "Simple daily observations" },
                  { icon: Paperclip, children: "Images and short documents" },
                ]}
              />
            </>
          }
        />

        <FadeInScroll className="mb-16">
          <div className="grid grid-cols-[1.6fr_1fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-6">
            <HeroQuoteCard
              kicker="Diary summary"
              quote={diarySummary.title}
              showQuotes={false}
              description={diarySummary.body}
              className="h-full min-h-[250px] [&_p]:break-words"
              action={
                <Button
                  type="button"
                  variant="primary"
                  onClick={openComposer}
                  rightIcon={<Plus className="w-3.5 h-3.5 stroke-[2]" />}
                >
                  Add note for child
                </Button>
              }
            />

            <div className="bg-[var(--color-thread-light-green)] rounded-tr-[36px] p-8 sm:p-10 flex flex-col justify-between min-h-[250px] shadow-premium-light">
              <div>
                <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-6 block">
                  Entry count
                </span>
 <div className="font-serif text-[4.2rem] sm:text-[5rem] leading-none tracking-tight text-[var(--color-thread-heading)]">
                  {entries.length}
                </div>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-thread-dark-slate)]">
                  {entries.length === 1 ? "entry saved so far" : "entries saved so far"}
                </p>
              </div>
              <p className="text-[0.82rem] leading-relaxed text-[var(--color-thread-gray)] max-w-[22ch]">
                Quick day-to-day notes stay grouped here, while larger reports can still live in Documents.
              </p>
            </div>
          </div>
          {renderThemeHighlights()}
        </FadeInScroll>

        <FadeInScroll>
          <div className="mb-8">
            <SectionLabel>Recent entries</SectionLabel>
            <SectionTitle className="mb-3">The latest notes at a glance.</SectionTitle>
            <SectionDescription>
              Each card keeps the written note, chosen tags, and attachments together so it is easy to spot repeated themes.
            </SectionDescription>
          </div>

          {entries.length === 0 ? (
            <div className="bg-white border border-dashed border-black/10 rounded-tr-[32px] rounded-bl-[32px] p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-[var(--color-thread-light-green)]/50 mx-auto flex items-center justify-center mb-4">
                <NotebookPen className="w-6 h-6 text-[var(--color-thread-mid-green)] stroke-[1.8]" />
              </div>
              <SectionTitle className="mb-3 text-[1.6rem]">No diary entries yet.</SectionTitle>
              <SectionDescription className="mx-auto">
                Start with one short note, then tag it with things like sleep, food, or school so the first pattern is easy to find later.
              </SectionDescription>
            </div>
          ) : (
            <div className="space-y-4">{renderEntryBlocks()}</div>
          )}
        </FadeInScroll>
      </PageContainer>

      <FloatingActionButton
        onClick={openComposer}
        label="Add note"
        icon={<NotebookPen className="w-5 h-5 stroke-[2]" />}
      />
    </motion.div>
  );
}
