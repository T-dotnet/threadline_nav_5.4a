import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "../../lib/utils"
import { ActionLink } from "./ActionLink"
import { ArrowRight } from "lucide-react"
import { ClinicalWeighting } from "./ClinicalWeighting"

interface TimelineItemProps {
  tag?: string;
  title: string;
  meta: string;
  content: string | React.ReactNode;
  facts?: Record<string, string>;
  dependency?: string;
  progress?: number;
  active?: boolean;
  isFirst?: boolean;
  isCollapsible?: boolean;
  hideMetrics?: boolean;
  variant?: "default" | "priorityRows";
}

export function TimelineItem({
  tag,
  title,
  meta,
  content,
  facts = {},
  dependency,
  progress = 0,
  active = false,
  isFirst = false,
  isCollapsible = false,
  hideMetrics = false,
  variant = "default",
}: TimelineItemProps) {
  const [isOpen, setIsOpen] = useState(isCollapsible ? active : true);
  const isPriorityRows = variant === "priorityRows";

  // When the quarter plan is complete (or metrics are hidden), drop clinical weighting,
  // plan progress and "See details".
  const isComplete = progress === 100;
  const hideMetricsRow = isComplete || hideMetrics;
  const hasFacts = facts && Object.keys(facts).length > 0 && !hideMetricsRow;
  const hasTag = Boolean(tag?.trim());

  const handleHeaderClick = () => {
    if (isCollapsible) {
      setIsOpen(!isOpen);
    }
  };

  const headerContent = (
    <>
        <div
          className={cn(
            "flex-1 flex flex-col items-start gap-1.5 md:flex-row md:items-center md:gap-4",
            isPriorityRows && "md:grid md:grid-cols-[7rem_1fr] md:items-center md:gap-0"
          )}
        >
          {hasTag && (
            <span
              className={cn(
                "text-[0.75rem] tracking-[0.15em] font-medium md:w-12 flex-shrink-0 uppercase",
                isPriorityRows && "text-[1rem] tracking-[0.24em] md:w-auto",
                active
                  ? "text-[var(--color-thread-mid-green)]"
                  : "text-[var(--color-thread-placeholder)]",
              )}
            >
              {tag}
            </span>
          )}
          <div className="flex-1">
            <div
              className={cn(
                "thread-sans-heading text-[1.18rem] font-medium tracking-tight",
                isPriorityRows && "text-[1.85rem] leading-tight",
                active
                  ? "text-[var(--color-thread-heading)]"
                  : "text-[var(--color-thread-dark-slate)]",
              )}
            >
              {title}
              <div
                className={cn(
                  "text-[0.8rem] text-[var(--color-thread-gray)] font-normal mt-0.5 tracking-normal",
                  isPriorityRows && "mt-2 text-[1.05rem]"
                )}
              >
                {meta}
              </div>
            </div>
          </div>
        </div>

        {/* Plus/Minus Toggle Icon for collapsible view */}
        {isCollapsible && (
          <div
            className={cn(
              "flex-shrink-0 w-[22px] h-[22px] relative mt-1 md:mt-0",
              isPriorityRows && "mr-1 mt-2 h-9 w-9"
            )}
          >
            <div className="absolute left-0 top-1/2 w-full h-[1.5px] bg-[var(--color-thread-dark-slate)] transition-all" />
            <div
              className={cn(
                "absolute top-0 left-1/2 h-full w-[1.5px] bg-[var(--color-thread-dark-slate)] transition-all",
                isOpen && "scale-y-0",
              )}
            />
          </div>
        )}
    </>
  );

  return (
    <div
      className={cn(
        "border-t border-black/10 transition-all",
        isPriorityRows && "border-black/15",
        isCollapsible && "group hover:bg-black/[0.02]",
        isCollapsible && isOpen && "bg-black/[0.01]",
        isPriorityRows && isOpen && "bg-[var(--color-thread-off-white)]/55"
      )}
    >
      {isCollapsible ? (
        <motion.button
          type="button"
          aria-expanded={isOpen}
          onClick={handleHeaderClick}
          whileTap={{ backgroundColor: "rgba(0,0,0,0.04)" }}
          className={cn(
            "flex w-full cursor-pointer items-start justify-between gap-4 rounded-sm px-2 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-thread-mid-green)] md:items-center",
            isPriorityRows && "px-4 py-10 sm:px-5 md:px-4 md:py-11"
          )}
        >
          {headerContent}
        </motion.button>
      ) : (
        <motion.div
          className={cn(
            "flex items-start justify-between gap-4 px-2 py-6 md:items-center",
            isPriorityRows && "px-4 py-10 sm:px-5 md:px-4 md:py-11"
          )}
        >
          {headerContent}
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isCollapsible ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className={cn(
              "pb-12",
              hasTag ? "px-16 max-md:px-2" : "px-2",
              isCollapsible && "pb-6.5",
              isCollapsible && hasTag && "max-md:px-0",
              isPriorityRows && hasTag && "px-4 pb-12 md:pl-[8rem] md:pr-26"
            )}>
              <div className="grid grid-cols-1 gap-12">
                <div className={cn(
                  "grid grid-cols-1 gap-6",
                  hasFacts ? "grid-cols-[1fr,1fr] gap-12 max-lg:grid-cols-1 max-lg:gap-8" : ""
                )}>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[0.6rem] tracking-[0.14em] uppercase text-slate-500 font-medium mb-2 block">
                        Why this matters most
                      </span>
                      <p
                        className={cn(
                          "text-[0.96rem] text-slate-500 leading-relaxed max-w-[60ch]",
                          isPriorityRows && "text-[1.24rem] leading-[1.65] text-slate-500"
                        )}
                      >
                        {content}
                      </p>
                    </div>

                    {dependency && (
                      <div className="text-[0.88rem] flex items-center gap-2.5 text-slate-500 leading-tight">
                        <ArrowRight className="w-[15px] h-[15px] flex-shrink-0 stroke-[2] text-[var(--color-thread-placeholder)]" />
                        <span dangerouslySetInnerHTML={{ __html: dependency }} />
                      </div>
                    )}
                  </div>

                  {hasFacts && (
                    <ClinicalWeighting facts={facts} />
                  )}
                </div>
              </div>

              {!hideMetricsRow && (
                <div className={cn("mt-4 pt-3.5 flex items-center justify-between", isPriorityRows && "pt-5")}>
                  <span className={cn("text-[0.78rem] text-slate-500 font-medium", isPriorityRows && "text-[1rem]")}>
                    Plan Progress: {progress}%
                  </span>
                  <ActionLink variant="slate" as="span">
                    See details
                  </ActionLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
