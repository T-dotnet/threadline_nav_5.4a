import { motion } from "motion/react";
import {
  Search,
  ChevronRight,
  Lock,
  Users,
  Upload,
  FileText,
  Folder,
  Camera,
  Activity,
  Check,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useCallback, useMemo } from "react";
import { PageHeader } from "./ui/PageHeader";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionDescription } from "./ui/SectionDescription";
import { PageIcon } from "./ui/PageIcon";
import { ActionLink } from "./ui/ActionLink";
import { FadeInScroll } from "./ui/FadeInScroll";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { FilterTab } from "./ui/FilterTab";
import { FileItem } from "./ui/FileItem";
import { ChecklistItem } from "./ui/ChecklistItem";
import { PageContainer } from "./ui/PageContainer";
import { WatercolorPanel } from "./ui/WatercolorPanel";
import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { useLocker } from "../context/LockerContext";
import { isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";
import { getRotatingCornerClass } from "../lib/cornerStyles";

export default function DocumentsPage() {
  const { currentChild, showGlobalIcons } = useCurrentChild();
  const { search, setSearch, filter, setFilter, toggleShare, filteredFiles } = useLocker();
  const isNew = currentChild.isNew;
  
  const displayedFiles = useMemo(() => {
    if (!showGlobalIcons) {
      return filteredFiles.filter(f => f.childId === currentChild.id);
    }
    return filteredFiles;
  }, [filteredFiles, showGlobalIcons, currentChild.id]);

  const handleClear = useCallback(() => {
    setSearch("");
    setFilter("all");
  }, [setSearch, setFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="AES-256 secure storage"
        title={!showGlobalIcons ? `${currentChild.name}'s locker.` : "Documents locker."}
        titleClassName="md:leading-[4.5rem]"
        description={
          <>
            <SectionDescription>
              Store, view and share every clinical report, school summary and parent note for {!showGlobalIcons ? currentChild.name : "all your children"} — in one secure place.
            </SectionDescription>
            <div className="flex gap-4 mt-6 text-[0.82rem] text-[var(--color-thread-gray)] flex-wrap">
              <span className="flex items-center gap-2">
                <Lock className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
                End-to-end encrypted · AES-256
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
                {!showGlobalIcons ? `Secure child locker for ${currentChild.name}` : "Unified locker across all children"}
              </span>
            </div>
          </>
        }
        className="mb-24"
      />

      {/* Upload Section */}
      <FadeInScroll className="mb-24">
        <WatercolorPanel>
          <div className="bg-white rounded-bl-[32px] p-7.5 shadow-premium">
            <div className="mb-8">
              <SectionLabel>
                ADD TO LOCKER
              </SectionLabel>
              <SectionTitle className="mb-0">
                Add a document for {!showGlobalIcons ? currentChild.name : "your family"}.
              </SectionTitle>
            </div>
            <SectionDescription className="mb-10 max-w-[55ch]">
              Prepare and encrypt clinical paperwork, homework energy logs, school summaries, or letters manually.
            </SectionDescription>
            <div className="mt-4 border-1.5 border-dashed border-black/10 rounded-tr-[24px] p-10 text-center bg-[var(--color-thread-light-green)]/30 cursor-pointer hover:border-[var(--color-thread-mid-green)] hover:bg-[var(--color-thread-light-green)]/50 transition-all group">
              <PageIcon variant="white" icon={<Upload className="w-[22px] h-[22px] stroke-[1.7]" />} className="mx-auto" />
              <div className="text-[1rem] font-medium tracking-tight text-slate-900">
                Drag and drop a file here, or click to upload manually
              </div>
              <div className="text-[0.82rem] text-slate-500 mt-2">
                PDF, DOC, DOCX, XLS or PNG. Max size 25MB.
              </div>
            </div>
          </div>
        </WatercolorPanel>
      </FadeInScroll>

      {/* Files Section */}
      <FadeInScroll className="mb-24">
        <div className="mb-8">
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

        <div className="flex gap-2 flex-wrap mb-4">
          <FilterTab
            active={filter === "all"}
            label="All files"
            onClick={() => setFilter("all")}
          />
          <FilterTab
            active={filter === "report"}
            label="Report"
            onClick={() => setFilter("report")}
          />
          <FilterTab
            active={filter === "schoolpack"}
            label="School Pack"
            onClick={() => setFilter("schoolpack")}
          />
          <FilterTab
            active={filter === "school"}
            label="School"
            onClick={() => setFilter("school")}
          />
          <FilterTab
            active={filter === "clinical"}
            label="Clinical"
            onClick={() => setFilter("clinical")}
          />
          <FilterTab
            active={filter === "uploaded-you"}
            label="Uploaded by you"
            onClick={() => setFilter("uploaded-you")}
          />
          <FilterTab
            active={filter === "uploaded-threadline"}
            label="Uploaded by Threadline"
            onClick={() => setFilter("uploaded-threadline")}
          />
        </div>

        <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-4 mt-6 block">
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
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            Education & Advocacy
          </SectionLabel>
          <SectionTitle>
            About your files cupboard
          </SectionTitle>
        </div>

        <div className="bg-white rounded-none rounded-tr-[36px] p-7.5 overflow-hidden relative">
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
