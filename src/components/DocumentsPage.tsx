import { motion } from "motion/react";
import {
  Search,
  Lock,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { PageHeader } from "./ui/PageHeader";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionDescription } from "./ui/SectionDescription";
import { ActionLink } from "./ui/ActionLink";
import { FadeInScroll } from "./ui/FadeInScroll";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { FilterTab } from "./ui/FilterTab";
import { FileItem } from "./ui/FileItem";
import { ChecklistItem } from "./ui/ChecklistItem";
import { PageContainer } from "./ui/PageContainer";
import { WatercolorPanel } from "./ui/WatercolorPanel";
import { DocumentUploadDropzone } from "./ui/DocumentUploadDropzone";
import { useCurrentChild } from "../context/ChildContext";
import { useLocker } from "../context/LockerContext";
import { getRotatingCornerClass } from "../lib/cornerStyles";

const MAX_UPLOAD_SIZE_BYTES = 25 * 1024 * 1024;
const SUPPORTED_UPLOAD_EXTENSIONS = new Set(["pdf", "doc", "docx", "xls", "xlsx", "png"]);

function getUploadError(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!SUPPORTED_UPLOAD_EXTENSIONS.has(extension)) {
    return "Choose a PDF, DOC, DOCX, XLS, XLSX or PNG file.";
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return "Choose a file smaller than 25MB.";
  }

  return "";
}

export default function DocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentChild } = useCurrentChild();
  const { search, setSearch, filter, setFilter, toggleShare, filteredFiles, addFile } = useLocker();
  const isNew = currentChild.isNew;
  const [hasConfirmedFirstUpload, setHasConfirmedFirstUpload] = useState(false);
  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const [uploadRightsConfirmed, setUploadRightsConfirmed] = useState(false);
  const [uploadThreadConfirmed, setUploadThreadConfirmed] = useState(false);
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const canContinueUpload = uploadRightsConfirmed && uploadThreadConfirmed;
  
  const displayedFiles = filteredFiles;

  const handleClear = useCallback(() => {
    setSearch("");
    setFilter("all");
  }, [setSearch, setFilter]);

  const addDocumentToLocker = useCallback((file: File) => {
    const date = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());

    addFile({
      typeId: "clinical",
      typeName: "Clinical",
      name: file.name,
      date,
      uploadedBy: "you",
      shared: false,
      icon: FileText,
    });
    setSearch("");
    setFilter("all");
    setPendingUploadFile(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [addFile, setFilter, setSearch]);

  const handleFileSelected = useCallback((file?: File) => {
    if (!file) return;

    const error = getUploadError(file);
    if (error) {
      setPendingUploadFile(null);
      setUploadError(error);
      return;
    }

    setUploadError("");

    if (!hasConfirmedFirstUpload) {
      setPendingUploadFile(file);
      setShowUploadConfirmation(true);
      return;
    }

    addDocumentToLocker(file);
  }, [addDocumentToLocker, hasConfirmedFirstUpload]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUploadContinue = useCallback(() => {
    if (!canContinueUpload) {
      return;
    }

    setHasConfirmedFirstUpload(true);
    setShowUploadConfirmation(false);

    if (pendingUploadFile) {
      addDocumentToLocker(pendingUploadFile);
      return;
    }

    fileInputRef.current?.click();
  }, [addDocumentToLocker, canContinueUpload, pendingUploadFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 pt-10 sm:pb-16 sm:pt-16"
    >
      <PageContainer>
        <PageHeader
        kicker="AES-256 secure storage"
        title="Documents locker."
        titleClassName="thread-page-header__title--serif max-w-none sm:max-w-[75%] md:leading-[4.5rem]"
        description={
          <>
            <SectionDescription>
              Store, view and share every clinical report, school summary and parent note for all your children — in one secure place.
            </SectionDescription>
            <div className="mt-5 flex flex-col gap-2 text-sm text-[var(--color-thread-gray)] sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-4">
              <span className="flex items-center gap-2">
                <Lock className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
                End-to-end encrypted · AES-256
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
                Unified locker across all children
              </span>
            </div>
          </>
        }
        className="mb-14 sm:mb-24"
      />

      {/* Upload Section */}
      <FadeInScroll className="mb-14 sm:mb-24">
        <WatercolorPanel className="!p-3 sm:!p-12">
          <div className="rounded-bl-2xl bg-white p-4 shadow-premium sm:rounded-bl-[32px] sm:p-7.5">
            <div className="mb-5 sm:mb-8">
              <SectionLabel>
                ADD TO LOCKER
              </SectionLabel>
              <SectionTitle className="mb-0">
                Add a document for your family.
              </SectionTitle>
            </div>
            <SectionDescription className="mb-6 max-w-[55ch] sm:mb-10">
              Prepare and encrypt clinical paperwork, homework energy logs, school summaries, or letters manually.
            </SectionDescription>
            <input
              ref={fileInputRef}
              id="documents-locker-file-input"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png"
              className="sr-only"
              onChange={(event) => {
                handleFileSelected(event.currentTarget.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
            <DocumentUploadDropzone
              onClick={handleUploadClick}
              onDrop={(event) => {
                event.preventDefault();
                handleFileSelected(event.dataTransfer.files[0]);
              }}
            />

            {uploadError && (
              <p role="alert" className="mt-3 text-sm font-medium text-red-700">
                {uploadError}
              </p>
            )}

            {showUploadConfirmation && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-none rounded-tr-2xl bg-[var(--color-thread-off-white)] p-4 sm:rounded-tr-[28px] sm:p-5"
              >
                <span className="block text-[0.66rem] font-medium uppercase tracking-[0.16em] text-[var(--color-thread-mid-green)]">
                  Uploading Documents
                </span>
                <h3 className="mt-3 text-[1.35rem] font-medium tracking-tight text-slate-900">
                  Before you upload
                </h3>
                <div className="mt-4 space-y-3">
                  {pendingUploadFile && (
                    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
                      <FileText className="h-4 w-4 shrink-0 text-[var(--color-thread-mid-green)]" />
                      <span className="min-w-0 truncate font-medium">{pendingUploadFile.name}</span>
                    </div>
                  )}
                  <span className="block text-xs font-medium text-slate-700">
                    Please confirm:
                  </span>
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm leading-relaxed text-slate-700">
                    <input
                      type="checkbox"
                      checked={uploadRightsConfirmed}
                      onChange={(event) => setUploadRightsConfirmed(event.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-[var(--color-thread-mid-green)] focus:ring-[var(--color-thread-mid-green)]"
                    />
                    <span>I have the right to upload and share these documents.</span>
                  </label>
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2 text-sm leading-relaxed text-slate-700">
                    <input
                      type="checkbox"
                      checked={uploadThreadConfirmed}
                      onChange={(event) => setUploadThreadConfirmed(event.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-[var(--color-thread-mid-green)] focus:ring-[var(--color-thread-mid-green)]"
                    />
                    <span>
                      I understand these documents will become part of my child&apos;s Thread.
                    </span>
                  </label>
                  <p className="text-xs leading-relaxed text-[var(--color-thread-muted-text)]">
                    Learn more:{" "}
                    <button
                      type="button"
                      className="font-medium text-[var(--color-thread-mid-green)] hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--color-thread-muted-text)]">
                    Your information is only shared with your permission.
                  </p>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleUploadContinue}
                    disabled={!canContinueUpload}
                    className="inline-flex min-h-11 w-full cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-medium disabled:cursor-not-allowed sm:w-auto"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </WatercolorPanel>
      </FadeInScroll>

      {/* Files Section */}
      <FadeInScroll className="mb-14 sm:mb-24">
        <div className="mb-6 sm:mb-8">
          <SectionLabel>
            YOUR DOCUMENTS
          </SectionLabel>
          <SectionTitle className="mb-0">
            Everything in one place.
          </SectionTitle>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-slate-400 stroke-[1.8]" />
          <Input
            type="text"
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="search"
          />
        </div>

        <div className="-mx-6 mb-4 flex snap-x gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          <FilterTab
            active={filter === "all"}
            label="All files"
            onClick={() => setFilter("all")}
            className="shrink-0 snap-start"
          />
          <FilterTab
            active={filter === "report"}
            label="Report"
            onClick={() => setFilter("report")}
            className="shrink-0 snap-start"
          />
          <FilterTab
            active={filter === "schoolpack"}
            label="School Pack"
            onClick={() => setFilter("schoolpack")}
            className="shrink-0 snap-start"
          />
          <FilterTab
            active={filter === "school"}
            label="School"
            onClick={() => setFilter("school")}
            className="shrink-0 snap-start"
          />
          <FilterTab
            active={filter === "clinical"}
            label="Clinical"
            onClick={() => setFilter("clinical")}
            className="shrink-0 snap-start"
          />
          <FilterTab
            active={filter === "uploaded-you"}
            label="Uploaded by you"
            onClick={() => setFilter("uploaded-you")}
            className="shrink-0 snap-start"
          />
          <FilterTab
            active={filter === "uploaded-threadline"}
            label="Uploaded by Threadline"
            onClick={() => setFilter("uploaded-threadline")}
            className="shrink-0 snap-start"
          />
        </div>

        <span className="mb-4 mt-5 block text-xs font-medium text-[var(--color-thread-muted-text)] sm:mt-6 sm:uppercase sm:tracking-[0.12em]">
          {displayedFiles.length} {displayedFiles.length === 1 ? "file" : "files"}{" "}
          · sorted by clinical document type
        </span>

        {displayedFiles.length > 0 ? (
          <div className="flex flex-col gap-3">
            {displayedFiles.map((file, i) => {
              const cornerClass = getRotatingCornerClass(i, 20);
              return (
                <FileItem
                  key={file.name}
                  {...file}
                  onToggleShare={() => toggleShare(i)}
                  cornerClass={cornerClass}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-black/10 rounded-2xl text-slate-500">
            {isNew ? "No documents added yet." : "No documents match your search."}
            <ActionLink
              variant="default"
              as="button"
              onClick={handleClear}
              className="mt-3 block mx-auto font-medium"
            >
              Clear search
            </ActionLink>
          </div>
        )}
      </FadeInScroll>

      {/* Education & Advocacy Section */}
      <FadeInScroll className="mb-14 sm:mb-24">
        <div>
          <SectionLabel>
            Education & Advocacy
          </SectionLabel>
          <SectionTitle>
            About your files cupboard
          </SectionTitle>
        </div>

        <div className="relative overflow-hidden rounded-none rounded-tr-2xl bg-white p-5 sm:rounded-tr-[36px] sm:p-7.5">
          <SectionDescription className="mb-8 relative z-10 max-w-[64ch]">
            Clinical descriptions are frequently heavy and trigger unnecessary parenting alarmism. Threadline's summaries and Packs translation translate heavy raw medical reports into active school checklists.
          </SectionDescription>

          <div className="flex flex-col gap-6 relative z-10">
            <ChecklistItem
              title="Clinical Grade"
              description="All documents are timestamped and clinical summaries are clinically verified."
            />
            <ChecklistItem
              title="100% Private"
              description="Your records are securely encrypted and can never be traded with insurers."
            />
            <ChecklistItem
              title="School Packs"
              description="Dynamic sheets focus strictly on school energy needs to help homeroom teachers integrate accommodations easily."
            />
            <ChecklistItem
              title="Doctor Connection"
              description="Let clinical associates view parent evening logs instantly."
            />
          </div>
        </div>
      </FadeInScroll>
      </PageContainer>
    </motion.div>
  );
}
