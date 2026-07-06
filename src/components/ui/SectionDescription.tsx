import React from 'react';
import { cn } from '../../lib/utils';

interface SectionDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionDescription({ children, className, ...props }: SectionDescriptionProps) {
  return (
    <p 
      className={cn(
        "thread-section-description",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
