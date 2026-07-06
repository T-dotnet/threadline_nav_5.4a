import React from 'react';
import { cn } from '../../lib/utils';
import { EvidenceMeter } from './EvidenceMeter';

interface EvidenceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  level: number;
  label?: string;
  layout?: 'row' | 'col';
  align?: 'start' | 'end' | 'center';
  variant?: 'default' | 'light' | 'green';
  labelClassName?: string;
}

export const EvidenceBadge = React.forwardRef<HTMLDivElement, EvidenceBadgeProps>(
  ({ className, level, label, layout = 'row', align = 'start', variant = 'default', labelClassName, ...props }, ref) => {
    // If no label is provided, resolve automatically based on level
    const resolvedLabel = label || (
      level === 3 ? "Strong evidence" :
      level === 2 ? "Moderate evidence" :
      "Emerging"
    );

    const resolvedVariant = variant === 'green' ? 'light' : variant;

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex gap-2",
          layout === 'col' ? "flex-col" : "flex-row items-center",
          align === 'start' && (layout === 'col' ? "items-start text-left" : "justify-start"),
          align === 'end' && (layout === 'col' ? "items-end text-right" : "justify-end"),
          align === 'center' && (layout === 'col' ? "items-center text-center" : "justify-center"),
          className
        )}
        {...props}
      >
        {/* We can place the meter first or second depending on layout, 
            but standard is meter first/top then the text under or beside it. */}
        <EvidenceMeter level={level} variant={variant} />
        {resolvedLabel && (
          <span
            className={cn(
              "text-[0.64rem] tracking-[0.1em] uppercase font-medium",
              resolvedVariant === 'light' && "text-white/80 font-medium",
              resolvedVariant === 'default' && "text-[var(--color-thread-gray)]",
              labelClassName
            )}
          >
            {resolvedLabel}
          </span>
        )}
      </div>
    );
  }
);

EvidenceBadge.displayName = 'EvidenceBadge';
