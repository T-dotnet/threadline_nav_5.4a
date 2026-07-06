import React from 'react';
import { cn } from '../../lib/utils';

interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className, ...props }: SectionLabelProps) {
  return (
    <span 
      className={cn(
        "thread-section-label",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
