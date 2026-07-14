import React from "react";
import { ArrowRight, FileText, LockKeyhole, Upload, X } from "lucide-react";
import type { DocFile } from "../../context/LockerContext";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ModalCloseButton, ModalShell } from "../ui/ModalShell";
import { ModalOutcomeScreen } from "../ui/ModalOutcomeScreen";
import { PageIcon } from "../ui/PageIcon";
import { QuestionnaireModuleModalFrame } from "./QuestionnaireModuleModalFrame";
import {
  MODAL_BODY_CLASS,
  MODAL_CHECKBOX_CLASS,
  MODAL_CONFIRM_PANEL_CLASS,
  MODAL_CONFIRM_ROW_CLASS,
  MODAL_CONFIRM_TITLE_CLASS,
  MODAL_FIELD_LABEL_CLASS,
  MODAL_FINE_PRINT_CLASS,
  MODAL_KICKER_CLASS,
  MODAL_PRIMARY_BUTTON_CLASS,
  MODAL_SECONDARY_BUTTON_CLASS,
  MODAL_TITLE_CLASS,
} from "./workflowStyles";

type DocumentUploadStep = 1 | 2 | 3 | 4;

export interface DocumentUploadResult {
  file: File;
  typeId: string;
  typeName: string;
  name: string;
  date: string;
}

interface DocumentUploadWorkflowProps {
  childName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: DocumentUploadResult) => void;
}

interface RemoveSharedDocumentModalProps {
  childName: string;
  document: DocFile | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DOCUMENT_UPLOAD_STEPS = [
  { num: 1, title: "Upload file", desc: "Select source" },
  { num: 2, title: "Document type", desc: "Associate file" },
  { num: 3, title: "Locker gate", desc: "Confirm access" },
  { num: 4, title: "Confirm upload", desc: "Final review" },
];

const DOCUMENT_TYPE_OPTIONS = [
  { typeId: "report", typeName: "Report" },
  { typeId: "schoolpack", typeName: "School Pack" },
  { typeId: "school", typeName: "School" },
  { typeId: "clinical", typeName: "Clinical" },
];

const DEFAULT_DOCUMENT_TYPE = DOCUMENT_TYPE_OPTIONS[0];

export function DocumentUploadWorkflow({
  childName,
  isOpen,
  onClose,
  onSave,
}: DocumentUploadWorkflowProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [step, setStep] = React.useState<DocumentUploadStep>(1);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [typeId, setTypeId] = React.useState(DEFAULT_DOCUMENT_TYPE.typeId);
  const [rightsConfirmed, setRightsConfirmed] = React.useState(false);
  const [threadConfirmed, setThreadConfirmed] = React.useState(false);

  const fileName = selectedFile?.name ?? "";
  const selectedDocumentType =
    DOCUMENT_TYPE_OPTIONS.find((option) => option.typeId === typeId) ?? DEFAULT_DOCUMENT_TYPE;
  const completedSteps = [
    fileName ? 1 : null,
    typeId ? 2 : null,
    rightsConfirmed && threadConfirmed ? 3 : null,
    step === 4 ? 4 : null,
  ].filter((stepNumber): stepNumber is number => stepNumber !== null);
  const canAdvance =
    step === 1
      ? Boolean(fileName)
      : step === 2
        ? Boolean(typeId)
        : step === 3
          ? rightsConfirmed && threadConfirmed
          : Boolean(fileName && typeId && rightsConfirmed && threadConfirmed);

  const reset = () => {
    setStep(1);
    setSelectedFile(null);
    setTypeId(DEFAULT_DOCUMENT_TYPE.typeId);
    setRightsConfirmed(false);
    setThreadConfirmed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleFileSelected = (file?: File) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleStepSelect = (stepNumber: number) => {
    if (stepNumber === 1) {
      setStep(1);
    } else if (stepNumber === 2 && fileName) {
      setStep(2);
    } else if (stepNumber === 3 && fileName && typeId) {
      setStep(3);
    } else if (stepNumber === 4 && fileName && typeId && rightsConfirmed && threadConfirmed) {
      setStep(4);
    }
  };

  const handleSave = () => {
    if (!canAdvance || !selectedFile) return;

    const date = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());

    onSave({
      file: selectedFile,
      typeId: selectedDocumentType.typeId,
      typeName: selectedDocumentType.typeName,
      name: fileName,
      date,
    });
    close();
  };

  return (
    <QuestionnaireModuleModalFrame
      isOpen={isOpen}
      titleId="document-upload-modal-title"
      activeStep={step}
      completedSteps={completedSteps}
      heading="Document upload"
      steps={DOCUMENT_UPLOAD_STEPS}
      closeLabel="Close document upload"
      onClose={close}
      onStepSelect={(selectedStep) => handleStepSelect(selectedStep.num)}
      footer={(
        <>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => setStep((currentStep) => (currentStep > 1 ? ((currentStep - 1) as DocumentUploadStep) : currentStep))}
            disabled={step === 1}
            className={cn(MODAL_SECONDARY_BUTTON_CLASS, "disabled:cursor-not-allowed disabled:opacity-40")}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep((currentStep) => ((currentStep + 1) as DocumentUploadStep))}
              disabled={!canAdvance}
              className="h-9 rounded-full px-4 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              {step === 3 ? "Review upload" : "Continue"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={!canAdvance}
              className="h-9 rounded-full px-4 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
              rightIcon={<LockKeyhole className="h-3.5 w-3.5" />}
            >
              Add to Locker
            </Button>
          )}
        </>
      )}
    >
      {step === 1 && (
        <div className="max-w-2xl space-y-7">
          <div className="space-y-3">
            <span className={MODAL_KICKER_CLASS}>Step 1</span>
            <h2 id="document-upload-modal-title" className={MODAL_TITLE_CLASS}>Upload file</h2>
            <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
              Add a supporting report, school letter, occupational therapy note, or other file for {childName}&apos;s Assessment Package.
            </p>
          </div>

          <div>
            <input
              ref={fileInputRef}
              id="assessment-document-upload-input"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png"
              className="sr-only"
              onChange={(event) => handleFileSelected(event.currentTarget.files?.[0])}
            />
            <button
            type="button"
            aria-describedby="assessment-document-upload-help"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              handleFileSelected(event.dataTransfer.files[0]);
            }}
            className="block w-full cursor-pointer rounded-none rounded-tr-[32px] border-2 border-dashed border-black/10 bg-[var(--color-thread-light-green)]/30 p-10 text-center transition-all hover:border-[var(--color-thread-mid-green)] hover:bg-[var(--color-thread-light-green)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/25"
          >
            <PageIcon variant="white" icon={<Upload className="h-[22px] w-[22px] stroke-[1.7]" />} className="mx-auto" />
            <span className="mt-4 block text-[1rem] font-medium tracking-tight text-slate-900">
              {fileName || "Drop a file here, or click to select"}
            </span>
            <span id="assessment-document-upload-help" className="mt-2 block text-sm text-[var(--color-thread-muted-text)]">
              PDF, DOC, DOCX, XLS, XLSX or PNG. Max size 25MB.
            </span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-2xl space-y-7">
          <div className="space-y-3">
            <span className={MODAL_KICKER_CLASS}>Step 2</span>
            <h2 id="document-upload-modal-title" className={MODAL_TITLE_CLASS}>Associate file to document type</h2>
            <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
              Choose how this document should appear in {childName}&apos;s secure Locker and assessment checklist.
            </p>
          </div>

          <div className="rounded-none rounded-tr-[28px] bg-[var(--color-thread-off-white)] p-5">
            <span className={MODAL_FIELD_LABEL_CLASS}>Selected file</span>
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
              <FileText className="h-4 w-4 shrink-0 text-[var(--color-thread-mid-green)]" />
              <span className="min-w-0 truncate font-medium">{fileName}</span>
            </div>

            <label className="mt-5 block">
              <span className={MODAL_FIELD_LABEL_CLASS}>Document type</span>
              <select value={typeId} onChange={(event) => setTypeId(event.target.value)} className="thread-select">
                {DOCUMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.typeId} value={option.typeId}>{option.typeName}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-2xl space-y-7">
          <div className="space-y-3">
            <span className={MODAL_KICKER_CLASS}>Step 3</span>
            <h2 id="document-upload-modal-title" className={MODAL_TITLE_CLASS}>Secure Locker gate</h2>
            <p className={`${MODAL_BODY_CLASS} max-w-xl`}>
              Confirm this file can be stored in {childName}&apos;s encrypted document Locker.
            </p>
          </div>

          <div className={MODAL_CONFIRM_PANEL_CLASS}>
            <span className={MODAL_CONFIRM_TITLE_CLASS}>Document ready for Locker</span>
            <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
              <div className="font-medium">{fileName}</div>
              <div className="mt-1 text-xs text-[var(--color-thread-muted-text)]">{selectedDocumentType.typeName}</div>
            </div>
            <label className={MODAL_CONFIRM_ROW_CLASS}>
              <input
                type="checkbox"
                checked={rightsConfirmed}
                onChange={(event) => setRightsConfirmed(event.target.checked)}
                className={MODAL_CHECKBOX_CLASS}
              />
              <span>I have the right to upload and share this document.</span>
            </label>
            <label className={MODAL_CONFIRM_ROW_CLASS}>
              <input
                type="checkbox"
                checked={threadConfirmed}
                onChange={(event) => setThreadConfirmed(event.target.checked)}
                className={MODAL_CHECKBOX_CLASS}
              />
              <span>I understand this document will become part of my child&apos;s Thread.</span>
            </label>
            <p className={MODAL_FINE_PRINT_CLASS}>Your information is only shared with your permission.</p>
          </div>
        </div>
      )}

      {step === 4 && (
        <ModalOutcomeScreen
          titleId="document-upload-modal-title"
          kicker="Confirm"
          icon={<LockKeyhole className="h-7 w-7 stroke-[1.8]" />}
          title="Confirm document upload"
          description={`Review the details below before this file is added to ${childName}'s secure Locker.`}
        >
          <div className={MODAL_CONFIRM_PANEL_CLASS}>
            <span className={MODAL_CONFIRM_TITLE_CLASS}>Document to add</span>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-[var(--color-thread-muted-text)]">File</dt>
                <dd className="mt-0.5 break-words text-[var(--color-thread-dark-slate)]">{fileName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[var(--color-thread-muted-text)]">Document type</dt>
                <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{selectedDocumentType.typeName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[var(--color-thread-muted-text)]">Locker</dt>
                <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{childName}&apos;s secure document Locker</dd>
              </div>
            </dl>
          </div>
          <p className={MODAL_FINE_PRINT_CLASS}>
            You can go back to change the document type or permissions before confirming.
          </p>
        </ModalOutcomeScreen>
      )}
    </QuestionnaireModuleModalFrame>
  );
}

export function RemoveSharedDocumentModal({
  childName,
  document,
  onClose,
  onConfirm,
}: RemoveSharedDocumentModalProps) {
  return (
    <ModalShell
      isOpen={Boolean(document)}
      onRequestClose={onClose}
      titleId="remove-shared-document-title"
      size="small"
      panelClassName="p-6 sm:p-8"
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-ready-green)]">
              <X className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <h2 id="remove-shared-document-title" className="font-serif text-2xl leading-tight text-[var(--color-thread-heading)]">
                Remove shared document?
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                This will remove {document?.name ?? "this document"} from {childName}&apos;s shared document list.
              </p>
            </div>
          </div>
          <ModalCloseButton onClick={onClose} label="Close remove document confirmation" />
        </div>

        <div className={MODAL_CONFIRM_PANEL_CLASS}>
          <span className={MODAL_CONFIRM_TITLE_CLASS}>Document</span>
          <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-thread-light-green)] text-[var(--color-thread-ready-green)]">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium text-[var(--color-thread-dark-slate)]">{document?.name}</span>
              <span className="mt-0.5 block text-xs text-[var(--color-thread-muted-text)]">{document?.date}</span>
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="tertiary" onClick={onClose} className={MODAL_SECONDARY_BUTTON_CLASS}>
            Cancel
          </Button>
          <Button type="button" variant="dangerSolid" onClick={onConfirm} className={MODAL_PRIMARY_BUTTON_CLASS}>
            Remove
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
