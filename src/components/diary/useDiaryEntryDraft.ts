import { useCallback, useRef, useState, type ChangeEvent } from "react";
import type { DiaryAttachment, DiaryEntry } from "../../types";
import {
  MAX_ATTACHMENTS,
  MAX_FILE_BYTES,
  createId,
  formatFileSize,
  getAttachmentKind,
  isAllowedFile,
  readFileAsDataUrl,
} from "../../lib/diary";

export interface DiaryEntryDraft {
  note: string;
  tags: string[];
  attachments: DiaryAttachment[];
}

const EMPTY_DRAFT: DiaryEntryDraft = {
  note: "",
  tags: [],
  attachments: [],
};

export function useDiaryEntryDraft() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState(EMPTY_DRAFT.note);
  const [selectedTags, setSelectedTags] = useState<string[]>(EMPTY_DRAFT.tags);
  const [draftAttachments, setDraftAttachments] = useState<DiaryAttachment[]>(
    EMPTY_DRAFT.attachments,
  );
  const [error, setError] = useState("");

  const resetDraft = useCallback((entry?: Pick<DiaryEntry, "note" | "tags" | "attachments">) => {
    setNote(entry?.note ?? EMPTY_DRAFT.note);
    setSelectedTags(entry?.tags ?? EMPTY_DRAFT.tags);
    setDraftAttachments(entry?.attachments ?? EMPTY_DRAFT.attachments);
    setError("");
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  }, []);

  const pickFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAttachmentChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = Array.from(event.target.files || []);
      if (fileList.length === 0) return;

      if (draftAttachments.length + fileList.length > MAX_ATTACHMENTS) {
        setError(`Add up to ${MAX_ATTACHMENTS} attachments per diary entry.`);
        event.target.value = "";
        return;
      }

      const invalidFile = fileList.find((file) => !isAllowedFile(file));
      if (invalidFile) {
        setError("Use images or short documents such as PDF, DOC, DOCX, TXT, or RTF.");
        event.target.value = "";
        return;
      }

      const oversizedFile = fileList.find((file) => file.size > MAX_FILE_BYTES);
      if (oversizedFile) {
        setError("Keep each diary attachment under 2 MB so entries stay lightweight.");
        event.target.value = "";
        return;
      }

      try {
        const parsedFiles = await Promise.all(
          fileList.map(async (file) => ({
            id: createId("attachment"),
            name: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeLabel: formatFileSize(file.size),
            kind: getAttachmentKind(file),
            dataUrl: await readFileAsDataUrl(file),
          })),
        );
        setDraftAttachments((prev) => [...prev, ...parsedFiles]);
        setError("");
      } catch {
        setError("One of the files could not be added. Please try again.");
      } finally {
        event.target.value = "";
      }
    },
    [draftAttachments.length],
  );

  const removeDraftAttachment = useCallback((attachmentId: string) => {
    setDraftAttachments((prev) => prev.filter((attachment) => attachment.id !== attachmentId));
  }, []);

  const validateDraft = useCallback(() => {
    if (!note.trim() && draftAttachments.length === 0) {
      setError("Add a note or at least one attachment before saving.");
      return false;
    }

    return true;
  }, [draftAttachments.length, note]);

  const getEntryDraft = useCallback(
    (): DiaryEntryDraft => ({
      note: note.trim(),
      tags: selectedTags,
      attachments: draftAttachments,
    }),
    [draftAttachments, note, selectedTags],
  );

  return {
    fileInputRef,
    note,
    setNote,
    selectedTags,
    draftAttachments,
    error,
    resetDraft,
    toggleTag,
    pickFiles,
    handleAttachmentChange,
    removeDraftAttachment,
    validateDraft,
    getEntryDraft,
  };
}
