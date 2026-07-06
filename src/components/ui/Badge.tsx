import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'now' | 'future' | 'clinical' | 'active';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'clinical', ...props }, ref) => {
    const variants = {
      now: 'thread-badge--now',
      future: 'thread-badge--future',
      clinical: 'thread-badge--clinical',
      active: 'thread-badge--active',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'thread-badge',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
