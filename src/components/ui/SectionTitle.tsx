import React from 'react';
import { cn } from '../../lib/utils';

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className, ...props }: SectionTitleProps) {
  return (
    <h2 
      className={cn(
        "thread-section-title",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
