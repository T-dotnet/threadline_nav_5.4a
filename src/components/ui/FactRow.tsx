import React from 'react';
import { cn } from '../../lib/utils';
import { EvidenceMeter } from './EvidenceMeter';

interface FactRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  solid?: boolean;
  showDots?: boolean;
}

export const FactRow = React.forwardRef<HTMLDivElement, FactRowProps>(
  ({ className, label, value, solid = false, showDots = true, ...props }, ref) => {
    const getDots = (val: string) => {
      const v = val.toLowerCase();
      if (v === 'high' || v === 'strong') return 3;
      if (v === 'moderate') return 2;
      if (v === 'low') return 1;
      return 0;
    };

    const dots = showDots ? getDots(value) : 0;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-3.5 py-2.5 text-[0.86rem]",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            solid ? "text-white/70" : "text-[var(--color-thread-gray)]",
          )}
        >
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-medium",
              solid ? "text-white" : "text-[var(--color-thread-dark-slate)]",
            )}
          >
            {value}
          </span>
          {dots > 0 && (
            <EvidenceMeter
              level={dots}
              variant={solid ? 'light' : 'default'}
              className="ml-1 scale-[0.85] origin-right"
            />
          )}
        </div>
      </div>
    );
  }
);

FactRow.displayName = 'FactRow';
