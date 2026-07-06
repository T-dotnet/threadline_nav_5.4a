import React from 'react';
import { cn } from '../../lib/utils';

interface EvidenceMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  level: number;
  variant?: 'default' | 'light' | 'green';
}

export const EvidenceMeter = React.forwardRef<HTMLDivElement, EvidenceMeterProps>(
  ({ className, level, variant = 'default', ...props }, ref) => {
    // Determine circle classes based on consolidated master variant: 'default' | 'light'
    const getCircleClasses = (l: number) => {
      const isActive = l <= level;
      const resolvedVariant = variant === 'green' ? 'light' : variant;

      switch (resolvedVariant) {
        case 'light':
          return isActive ? 'bg-white' : 'bg-white/35';
        case 'default':
        default:
          return isActive ? 'bg-[var(--color-thread-mid-green)]' : 'bg-[var(--color-thread-mid-green)]/20';
      }
    };

    return (
      <div
        ref={ref}
        className={cn('thread-evidence-meter', className)}
        {...props}
      >
        {[1, 2, 3].map((l) => (
          <i
            key={l}
            className={cn(
              'thread-evidence-meter__dot',
              getCircleClasses(l)
            )}
          />
        ))}
      </div>
    );
  }
);

EvidenceMeter.displayName = 'EvidenceMeter';
