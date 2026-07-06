import * as React from "react"
import { cn } from "../../lib/utils"
import { SectionDescription } from "./SectionDescription"
import { SectionLabel } from "./SectionLabel"
import { FactRow } from "./FactRow"
import { ArrowRight } from "lucide-react"

export function PriorityCard({
  tag,
  title,
  meta,
  why,
  facts = {},
  dependency,
  cornerClass = "rounded-[20px]",
  className,
}: any) {
  return (
    <div
      className={cn(
        "relative bg-white p-8 mb-6 overflow-hidden",
        cornerClass,
        className
      )}
    >
      <div className="flex gap-4 items-start mb-4 relative">
        <span className="text-[0.75rem] tracking-[0.1em] uppercase font-medium px-4 py-2 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex-shrink-0 mt-1">
          {tag}
        </span>
        <div className="flex-1">
          <div className="font-sans font-medium text-[1.22rem] tracking-tight text-[var(--color-thread-dark-slate)] mb-1">
            {title}
          </div>
          <div className="text-[0.82rem] text-[var(--color-thread-gray)]">
            {meta}
          </div>
        </div>
      </div>
      <SectionDescription className="mb-5 relative">
        {why}
      </SectionDescription>
      <div className="bg-[var(--color-thread-off-white)] rounded-[20px] px-6 py-4 mb-6 relative">
        <SectionLabel className="mb-2">
          {tag === "Next" ? "Why it ranks here" : "Why it can wait"}
        </SectionLabel>
        <div className="grid grid-cols-2 gap-x-9 max-md:grid-cols-1">
          {facts && Object.entries(facts).map(([k, v]) => (
            <FactRow key={k} label={k} value={v as string} />
          ))}
        </div>
      </div>
      <div className="text-[0.88rem] flex items-center gap-2.5 text-[var(--color-thread-gray)] leading-tight relative">
        <ArrowRight className="w-[15px] h-[15px] flex-shrink-0 stroke-[2] text-[var(--color-thread-placeholder)]" />
        <span dangerouslySetInnerHTML={{ __html: dependency }} />
      </div>
    </div>
  );
}
