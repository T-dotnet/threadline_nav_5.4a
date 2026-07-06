import * as React from "react";
import { cn } from "../../lib/utils";
import { FadeInScroll } from "./FadeInScroll";
import { ActionLink } from "./ActionLink";
import { InsightSectionProps } from "../../types";

export function InsightSection({
  kicker,
  title,
  description,
  image,
  actionText,
  onActionClick,
  className,
  reverse = false,
  equalHeight = false,
  hierarchy = "default",
}: InsightSectionProps) {
  const isSupporting = hierarchy === "supporting";

  return (
    <div className={cn(
      "grid grid-cols-[1fr_2fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-12",
      equalHeight && "items-stretch",
      className
    )}>
      <FadeInScroll 
        className={cn(
          "md:h-full md:flex md:flex-col",
          reverse ? "md:col-start-2" : "md:col-start-1 md:row-start-1"
        )}
      >
        <div className={cn(
          "bg-white rounded-br-[32px] flex flex-col h-full",
          isSupporting ? "p-6" : "p-7.5",
          equalHeight && (isSupporting ? "min-h-[320px]" : "min-h-[400px]")
        )}>
          <span className={cn(
            "uppercase text-[var(--color-thread-mid-green)] font-medium",
            isSupporting ? "text-[0.62rem] tracking-[0.13em] mb-4" : "text-[0.66rem] tracking-[0.14em] mb-6"
          )}>
            {kicker}
          </span>
          <h3 className={cn(
            "font-medium tracking-tight leading-tight text-slate-900",
            isSupporting ? "text-[1.35rem] mb-3" : "text-[1.8rem] mb-4"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-slate-500 leading-relaxed flex-1",
            isSupporting ? "text-[0.96rem] mb-6" : "text-[1.05rem] mb-8"
          )}>
            {description}
          </p>
          {actionText && (
            <div className="mt-auto">
              <ActionLink variant="default" as="button" onClick={onActionClick}>
                {actionText}
              </ActionLink>
            </div>
          )}
        </div>
      </FadeInScroll>

      <FadeInScroll 
        delay={0.1} 
        className={cn(
          "md:h-full md:flex md:flex-col",
          reverse ? "md:col-start-1 md:row-start-1" : "md:col-start-2 md:row-start-1"
        )}
      >
        <div className={cn(
          "rounded-tl-[36px] overflow-hidden",
          isSupporting ? "h-[320px]" : "h-[400px]",
          equalHeight && (isSupporting ? "md:h-full md:min-h-[320px]" : "md:h-full md:min-h-[400px]")
        )}>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      </FadeInScroll>
    </div>
  );
}
