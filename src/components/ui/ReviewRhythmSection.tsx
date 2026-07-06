import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { FadeInScroll } from "./FadeInScroll";
import { SectionLabel } from "./SectionLabel";
import { SectionTitle } from "./SectionTitle";

export interface ReviewRhythmItem {
  state: string;
  title: string;
  meta: string;
  description: string;
  icon: ReactNode;
  active?: boolean;
}

interface ReviewRhythmSectionProps {
  items: ReviewRhythmItem[];
  className?: string;
  description?: string;
  title?: string;
}

export function ReviewRhythmSection({
  items,
  className,
  description = "We keep the picture current by tracking what changes, what stays stable, and what needs attention before the next full review.",
  title = "What happens between reviews.",
}: ReviewRhythmSectionProps) {
  return (
    <FadeInScroll className={cn("mb-24", className)}>
      <div className="max-w-[680px]">
        <SectionLabel>
          Your review rhythm
        </SectionLabel>
        <SectionTitle>
          {title}
        </SectionTitle>
        <p className="-mt-5 mb-8 text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {items.map((item) => (
          <div
            key={item.title}
            className={cn(
              "rounded-tr-[28px] p-6 transition-all",
              item.active
                ? "bg-[var(--color-thread-light-green)] shadow-premium-light"
                : "bg-white",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[var(--color-thread-light-green)]/60 text-[var(--color-thread-muted-green)] flex shrink-0 items-center justify-center">
                {item.icon}
              </div>
              <span className="rounded-full bg-white/75 px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.12em] text-[var(--color-thread-mid-green)]">
                {item.state}
              </span>
            </div>
            {item.meta && (
              <div className="mt-5 text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[var(--color-thread-mid-green)]">
                {item.meta}
              </div>
            )}
            <h3 className={cn(
              "text-[1.18rem] font-medium leading-tight tracking-tight text-[var(--color-thread-dark-slate)]",
              item.meta ? "mt-2" : "mt-5",
            )}>
              {item.title}
            </h3>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[0.94rem] leading-relaxed text-[var(--color-thread-gray)]">
        You do not need to track everything. We will flag the patterns that matter.
      </p>
    </FadeInScroll>
  );
}
