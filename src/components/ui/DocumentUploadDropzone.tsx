import type { DragEventHandler, MouseEventHandler } from "react";
import { Upload } from "lucide-react";
import { cn } from "../../lib/utils";
import { PageIcon } from "./PageIcon";

interface DocumentUploadDropzoneProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onDrop?: DragEventHandler<HTMLButtonElement>;
  helpId?: string;
  className?: string;
}

export function DocumentUploadDropzone({
  onClick,
  onDrop,
  helpId = "documents-locker-upload-help",
  className,
}: DocumentUploadDropzoneProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-describedby={helpId}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      className={cn(
        "group mt-2 min-h-44 w-full cursor-pointer rounded-tr-2xl border-1.5 border-dashed border-black/10 bg-[var(--color-thread-light-green)]/30 p-6 text-center transition-all hover:border-[var(--color-thread-mid-green)] hover:bg-[var(--color-thread-light-green)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/40 sm:mt-4 sm:rounded-tr-[24px] sm:p-10",
        className,
      )}
    >
      <PageIcon
        variant="white"
        icon={<Upload className="h-[22px] w-[22px] stroke-[1.7]" />}
        className="mx-auto"
      />
      <div className="text-base font-medium tracking-tight text-slate-900">
        <span className="sm:hidden">Tap to choose a file</span>
        <span className="hidden sm:inline">
          Drag and drop a file here, or click to upload manually
        </span>
      </div>
      <div id={helpId} className="mt-2 text-sm text-[var(--color-thread-muted-text)]">
        PDF, DOC, DOCX, XLS, XLSX or PNG. Max size 25MB.
      </div>
    </button>
  );
}
