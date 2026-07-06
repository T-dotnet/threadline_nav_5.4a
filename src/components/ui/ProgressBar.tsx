import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  colorClass?: string;
  heightClass?: string;
  trackClassName?: string;
  showLabel?: boolean;
  isSecondary?: boolean;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, colorClass = 'bg-[var(--color-thread-mid-green)]', heightClass = 'h-1.5', trackClassName, showLabel = false, isSecondary = false, ...props }, ref) => {
    const safeMax = max > 0 ? max : 100;
    const percentage = Math.min(100, Math.max(0, (value / safeMax) * 100));
    
    return (
      <div className={className} {...props}>
        {showLabel && (
          <div className="thread-progress__meta">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div ref={ref} className={cn('thread-progress__track', isSecondary ? 'thread-progress__track--secondary' : 'thread-progress__track--primary', heightClass, trackClassName)}>
          <motion.div 
            className={cn('thread-progress__fill', colorClass)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  }
);
ProgressBar.displayName = 'ProgressBar';
