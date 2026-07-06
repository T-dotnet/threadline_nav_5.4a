import React from 'react';
import { cn } from '../../lib/utils';
import { EvidenceBadge } from './EvidenceBadge';
import { ActionLink } from './ActionLink';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface AreaItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  impact?: string;
  evidence?: number;
  status?: string;
  icon?: React.ReactNode;
  description: string | React.ReactNode;
  sources?: string[];
  actionText?: string;
  onAction?: () => void;
  actionPlacement?: 'footer' | 'header' | 'after-sources';
  bodyAlignment?: 'container' | 'title';
  isCollapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  leadingVisual?: React.ReactNode;
}

export const AreaItem = React.forwardRef<HTMLDivElement, AreaItemProps>(
  ({ className, title, impact = "", evidence, status, icon, description, sources, actionText, onAction, actionPlacement = 'footer', bodyAlignment = 'container', isCollapsible = false, isExpanded: externalExpanded, onToggle, leadingVisual, ...props }, ref) => {
    const [internalExpanded, setInternalExpanded] = React.useState(false);
    const isExpanded = isCollapsible ? (externalExpanded !== undefined ? externalExpanded : internalExpanded) : true;
    const bodyAlignmentClass = bodyAlignment === 'title' && leadingVisual ? 'ml-14' : '';

    const handleToggle = () => {
      if (!isCollapsible) return;
      if (onToggle) {
        onToggle();
      } else {
        setInternalExpanded(!internalExpanded);
      }
    };

    const headerContent = (
      <>
        <div className="flex items-center gap-3">
          {isCollapsible && (
            <ChevronDown
              className={cn(
                "w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0",
                isExpanded ? "transform rotate-180" : ""
              )}
            />
          )}
          {leadingVisual && (
            <div className="shrink-0">
              {leadingVisual}
            </div>
          )}
          <div>
            <div className="text-[1.22rem] font-medium tracking-tight text-[var(--color-thread-dark-slate)]">
              {title}
            </div>
            {impact && (
              <div className="text-[0.78rem] text-[var(--color-thread-gray)] mt-1 font-sans">
                {impact}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end flex-shrink-0 pt-1">
          {evidence !== undefined && (
            <EvidenceBadge
              level={evidence}
              layout="col"
              align="end"
              variant="default"
              labelClassName="font-medium"
            />
          )}
          {status && (
            <span
              className={cn(
                "text-[0.6rem] tracking-[0.1em] uppercase font-medium px-2.75 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap mt-0.75",
                (status === "Suggested" || status === "Strength" || status === "Complete" || status === "Completed" || status === "Shared" || status === "MET") &&
                  "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]",
                (status === "Optional" || status === "Steady" || status === "To be assessed" || status === "Pending" || status === "To do" || status === "As Needed" || status === "UNCERTAIN") &&
                  "bg-[var(--color-thread-off-white)] text-[var(--color-thread-gray)] border border-black/10",
                (status === "In place" || status === "Improving" || status === "In Progress") &&
                  "bg-[var(--color-thread-mid-green)] text-white",
                (status === "Emerging" || status === "Pending Response" || status === "Under Review" || status === "NOT MET") &&
                  "bg-[var(--color-thread-cream)] text-[var(--color-thread-darkest)]",
              )}
            >
              {icon}
              {status}
            </span>
          )}
          {actionText && onAction && actionPlacement === 'header' && !isCollapsible && (
            <ActionLink
              variant="forest"
              as="button"
              onClick={onAction}
              icon={ArrowRight}
              className="text-[0.84rem] mt-0.75"
            >
              {actionText}
            </ActionLink>
          )}
        </div>
      </>
    );

    return (
      <div
        ref={ref}
        className={cn("border-t border-black/10 py-6 px-0.5", className)}
        {...props}
      >
        {isCollapsible ? (
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={handleToggle}
            className="flex w-full cursor-pointer select-none items-start justify-between gap-4.5 rounded-sm text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-thread-mid-green)] max-md:flex-wrap"
          >
            {headerContent}
          </button>
        ) : (
          <div className="flex items-start justify-between gap-4.5 max-md:flex-wrap">
            {headerContent}
          </div>
        )}
        
        {isExpanded && (
          <div className="transition-all duration-300">
            {typeof description === 'string' ? (
              <div className={cn("mt-3 max-w-[62ch]", bodyAlignmentClass)}>
                <p className="text-[0.96rem] text-[var(--color-thread-gray)] leading-relaxed font-sans">
                  {description}
                </p>
                {actionText && onAction && actionPlacement === 'footer' && (
                  <ActionLink
                    variant="forest"
                    as="button"
                    onClick={onAction}
                    icon={ArrowRight}
                    className="text-[0.84rem] mt-4"
                  >
                    {actionText}
                  </ActionLink>
                )}
              </div>
            ) : (
              <div className={cn("mt-3", bodyAlignmentClass)}>
                {description}
              </div>
            )}

            {sources && sources.length > 0 && (
              <div className={cn("flex gap-1.75 flex-wrap mt-3.5", bodyAlignmentClass)}>
                {sources.map((s: string) => (
                  <span
                    key={s}
                    className="text-[0.7rem] text-[var(--color-thread-gray)] border border-black/10 rounded-full px-2.5 py-1"
                  >
                    <strong className="text-[var(--color-thread-dark-slate)] font-medium">
                      {s}
                    </strong>
                  </span>
                ))}
              </div>
            )}

            {actionText && onAction && actionPlacement === 'after-sources' && (
              <ActionLink
                variant="forest"
                as="button"
                onClick={onAction}
                icon={ArrowRight}
                className={cn("text-[0.84rem] mt-4", bodyAlignmentClass)}
              >
                {actionText}
              </ActionLink>
            )}
          </div>
        )}
      </div>
    );
  }
);

AreaItem.displayName = 'AreaItem';
