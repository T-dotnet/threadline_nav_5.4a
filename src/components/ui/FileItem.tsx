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
        "group flex flex-col items-stretch gap-3 bg-white p-4 transition-all hover:bg-black/[0.01] sm:flex-row sm:items-center sm:gap-4 sm:p-4.5",
        cornerClass,
      )}
    >
      <div className="flex min-w-0 items-start gap-3 sm:contents">
        <div className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]">
          <Icon className="h-5 w-5 stroke-[1.7]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-base font-normal leading-[1.3] tracking-tight text-[var(--color-thread-dark-slate)] sm:text-[1.12rem]">
              {name}
            </div>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-thread-gray)]">
            <span className="font-medium uppercase tracking-[0.1em] text-[var(--color-thread-mid-green)]">
              {typeName}
            </span>
            {childName && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-normal uppercase tracking-wider text-slate-700">
                {childName}
              </span>
            )}
            <span>{date}</span>
            <span>Uploaded by {uploadedBy === "threadline" ? "Threadline" : "you"}</span>
          </div>
          <div
            className={cn(
              "mt-2.5 flex items-center gap-1.75 text-sm",
              shared ? "font-medium text-[var(--color-thread-mid-green)]" : "text-[var(--color-thread-muted-text)]",
            )}
          >
            {shared && (
              <div className="h-[7px] w-[7px] rounded-full bg-[var(--color-thread-mid-green)]" />
            )}
            {shared ? `Shared with ${sharedWith}` : "Not shared yet"}
          </div>
        </div>
      </div>
      <Button
        onClick={onToggleShare}
        variant="tertiary"
        className="min-h-11 w-full flex-shrink-0 justify-center text-sm sm:w-auto"
      >
        {shared ? "Make private" : "Share with care circle"}
      </Button>
    </div>
  );
}
