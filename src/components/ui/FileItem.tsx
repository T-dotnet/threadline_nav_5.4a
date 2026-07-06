import * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./Button"

export function FileItem({
  name,
  typeName,
  date,
  uploadedBy,
  shared,
  sharedWith,
  icon: Icon,
  onToggleShare,
  cornerClass = "rounded-2xl",
  childName,
}: any) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 bg-white p-4.5 transition-all hover:bg-black/[0.01] group",
        cornerClass,
      )}
    >
      <div className="w-[42px] h-[42px] rounded-xl bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 stroke-[1.7]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-[1.12rem] font-medium tracking-tight leading-[1.3] text-[var(--color-thread-dark-slate)]">
            {name}
          </div>
        </div>
        <div className="flex items-center gap-3.5 mt-1.5 text-[0.78rem] text-[var(--color-thread-gray)]">
          <span className="text-[0.6rem] tracking-[0.12em] uppercase font-medium text-[var(--color-thread-mid-green)]">
            {typeName}
          </span>
          {childName && (
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[0.65rem] font-bold tracking-wider uppercase">
              {childName}
            </span>
          )}
          <span>
            {date}
          </span>
          <span>
            Uploaded by {uploadedBy === "threadline" ? "Threadline" : "you"}
          </span>
        </div>
        <div
          className={cn(
            "text-[0.85rem] mt-2.5 flex items-center gap-1.75",
            shared ? "text-[var(--color-thread-mid-green)] font-medium" : "text-slate-400",
          )}
        >
          {shared && (
            <div className="w-[7px] h-[7px] rounded-full bg-[var(--color-thread-mid-green)]" />
          )}
          {shared ? `Shared with ${sharedWith}` : "Not shared yet"}
        </div>
      </div>
      <Button
        onClick={onToggleShare}
        variant="muted"
        className="flex-shrink-0 text-[0.82rem]"
      >
        {shared ? "Make private" : "Share with care circle"}
      </Button>
    </div>
  );
}
