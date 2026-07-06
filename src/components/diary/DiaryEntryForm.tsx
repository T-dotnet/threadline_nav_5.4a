import { type ChangeEvent, type ReactNode, type RefObject } from "react";
import { FileText, Tag, Upload, X } from "lucide-react";
import type { DiaryAttachment } from "../../types";
import { cn } from "../../lib/utils";
import { DIARY_TAGS, MAX_ATTACHMENTS } from "../../lib/diary";
import { Button } from "../ui/Button";
import { SectionDescription } from "../ui/SectionDescription";

interface DiaryChildOption {
  id: string;
  name: string;
}

interface DiaryEntryFormProps {
  childName: string;
  description: ReactNode;
  childOptions?: DiaryChildOption[];
  selectedChildId?: string;
  note: string;
  selectedTags: string[];
  draftAttachments: DiaryAttachment[];
  error: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isSaving: boolean;
  submitLabel: string;
  onSelectedChildChange?: (childId: string) => void;
  onNoteChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
  onPickFiles: () => void;
  onAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function DiaryEntryForm({
  childName,
  description,
  childOptions = [],
  selectedChildId,
  note,
  selectedTags,
  draftAttachments,
  error,
  fileInputRef,
  isSaving,
  submitLabel,
  onSelectedChildChange,
  onNoteChange,
  onToggleTag,
  onPickFiles,
  onAttachmentChange,
  onRemoveAttachment,
  onCancel,
  onSubmit,
}: DiaryEntryFormProps) {
  const showChildSelector = childOptions.length > 1 && selectedChildId && onSelectedChildChange;

  return (
    <div className="px-6 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-col gap-6">
        <SectionDescription>{description}</SectionDescription>

        {showChildSelector && (
          <div className="space-y-3">
            <label
              htmlFor="diary-entry-child"
              className="text-[0.78rem] tracking-[0.12em] uppercase text-[var(--color-thread-mid-green)] font-medium block"
            >
              Child
            </label>
            <select
              id="diary-entry-child"
              value={selectedChildId}
              onChange={(event) => onSelectedChildChange(event.target.value)}
              className="thread-select"
            >
              {childOptions.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-[0.78rem] tracking-[0.12em] uppercase text-[var(--color-thread-mid-green)] font-medium block">
            Note
          </label>
          <textarea
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder={`What happened today for ${childName}?`}
            rows={5}
            className="thread-textarea thread-textarea--soft thread-textarea--diary"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[0.78rem] tracking-[0.12em] uppercase text-[var(--color-thread-mid-green)] font-medium">
            <Tag className="w-4 h-4 stroke-[1.8]" />
            Tags
          </div>
          <div className="flex flex-wrap gap-2.5">
            {DIARY_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.86rem] font-medium transition-all border cursor-pointer",
                    isSelected
                      ? "bg-[var(--color-thread-mid-green)] text-white border-[var(--color-thread-mid-green)]"
                      : "bg-[var(--color-thread-off-white)] text-[var(--color-thread-dark-slate)] border-black/8 hover:border-[var(--color-thread-mid-green)]/30 hover:bg-[var(--color-thread-light-green)]/50",
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <label className="text-[0.78rem] tracking-[0.12em] uppercase text-[var(--color-thread-mid-green)] font-medium block">
                Attachments
              </label>
              <p className="text-[0.88rem] text-[var(--color-thread-gray)] mt-1">
                Add up to {MAX_ATTACHMENTS} images or short documents, up to 2 MB each.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.rtf"
              className="hidden"
              onChange={onAttachmentChange}
            />
            <Button
              type="button"
              variant="white"
              leftIcon={<Upload className="w-4 h-4 stroke-[1.9]" />}
              onClick={onPickFiles}
            >
              Add images or docs
            </Button>
          </div>

          {draftAttachments.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {draftAttachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="border border-black/8 bg-[var(--color-thread-off-white)] rounded-2xl p-3 flex items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-black/5 flex items-center justify-center flex-shrink-0">
                    {attachment.kind === "image" ? (
                      <img
                        src={attachment.dataUrl}
                        alt={attachment.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <FileText className="w-5 h-5 text-[var(--color-thread-mid-green)] stroke-[1.8]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9rem] text-slate-900 font-medium truncate">
                      {attachment.name}
                    </p>
                    <p className="text-[0.78rem] text-slate-500 mt-1">
                      {attachment.kind === "image" ? "Image" : "Document"} · {attachment.sizeLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(attachment.id)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white transition-colors flex items-center justify-center cursor-pointer"
                    aria-label={`Remove ${attachment.name}`}
                  >
                    <X className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-[0.88rem] text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-black/5 pt-6 -mx-6 px-6 sm:-mx-8 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="muted" onClick={onCancel}>
            Close
          </Button>
          <Button type="button" variant="forest" onClick={onSubmit} isLoading={isSaving}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
