import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, NotebookPen } from "lucide-react";
import { useCurrentChild } from "../context/ChildContext";
import type { DiaryEntry } from "../types";
import { createId } from "../lib/diary";
import { Button } from "./ui/Button";
import { FloatingActionButton } from "./ui/FloatingActionButton";
import { ModalCloseButton, ModalShell } from "./ui/ModalShell";
import { DiaryEntryForm } from "./diary/DiaryEntryForm";
import { useDiaryEntryDraft } from "./diary/useDiaryEntryDraft";

export default function QuickNoteComposer() {
  const { currentChild, childrenList, updateChild } = useCurrentChild();
  const navigate = useNavigate();
  const draft = useDiaryEntryDraft();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(currentChild.id || currentChild.name);
  const [savedChildName, setSavedChildName] = useState(currentChild.name);

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

  const openComposer = () => {
    draft.resetDraft();
    setShowSuccess(false);
    setSelectedChildId(currentChild.id || currentChild.name);
    setSavedChildName(currentChild.name);
    setIsComposerOpen(true);
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    setShowSuccess(false);
    draft.resetDraft();
  };

  const handleSaveEntry = () => {
    if (!draft.validateDraft()) return;

    setIsSaving(true);
    const entry: DiaryEntry = {
      id: createId("entry"),
      createdAt: new Date().toISOString(),
      ...draft.getEntryDraft(),
    };

    updateChild({
      ...selectedChild,
      diaryEntries: [entry, ...(selectedChild.diaryEntries || [])],
    });

    setSavedChildName(selectedChild.name);
    draft.resetDraft();
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleViewDiary = () => {
    closeComposer();
    navigate("/diary");
  };

  return (
    <>
      <ModalShell isOpen={isComposerOpen} titleId="quick-note-modal-title" size="small">
            {showSuccess ? (
              <div className="px-6 py-12 sm:px-10 sm:py-14 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[var(--color-thread-mid-green)] stroke-[1.8]" />
                </div>
                <h2
                  id="quick-note-modal-title"
                  className="mt-6 font-serif font-normal text-[1.75rem] sm:text-[2rem] leading-[1.08] tracking-tight text-[var(--color-thread-heading)]"
                >
                  Note saved.
                </h2>
                <p className="mt-3 max-w-[44ch] text-[0.95rem] leading-relaxed text-[var(--color-thread-gray)]">
                  Your note has been added to {savedChildName}'s diary. You can keep working here and review it any time.
                </p>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-center">
                  <Button type="button" variant="secondary" onClick={handleViewDiary}>
                    View in diary
                  </Button>
                  <Button type="button" variant="primary" onClick={closeComposer}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
                  <div>
                    <span className="text-[0.68rem] tracking-[0.18em] uppercase font-medium text-[var(--color-thread-mid-green)]">
                      Quick note
                    </span>
                    <h2
                      id="quick-note-modal-title"
                      className="mt-2 font-serif font-normal text-[1.75rem] sm:text-[2rem] leading-[1.08] tracking-tight text-[var(--color-thread-heading)]"
                    >
                      Add a note for {selectedChild.name}.
                    </h2>
                  </div>
                  <ModalCloseButton
                    onClick={closeComposer}
                    label="Close add note modal"
                    className="cursor-pointer"
                  />
                </div>

                <DiaryEntryForm
                  childName={selectedChild.name}
                  description={`Capture a quick everyday observation without leaving this page. It is saved straight to ${selectedChild.name}'s diary.`}
                  childOptions={childOptions}
                  selectedChildId={selectedChildId}
                  note={draft.note}
                  selectedTags={draft.selectedTags}
                  draftAttachments={draft.draftAttachments}
                  error={draft.error}
                  fileInputRef={draft.fileInputRef}
                  isSaving={isSaving}
                  submitLabel="Save diary entry"
                  onSelectedChildChange={setSelectedChildId}
                  onNoteChange={draft.setNote}
                  onToggleTag={draft.toggleTag}
                  onPickFiles={draft.pickFiles}
                  onAttachmentChange={draft.handleAttachmentChange}
                  onRemoveAttachment={draft.removeDraftAttachment}
                  onCancel={closeComposer}
                  onSubmit={handleSaveEntry}
                />
              </>
            )}
      </ModalShell>

      <FloatingActionButton
        onClick={openComposer}
        label="Add note"
        icon={<NotebookPen className="w-5 h-5 stroke-[2]" />}
      />
    </>
  );
}
