import React from 'react';
import { cn } from '../../lib/utils';

interface PageIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  variant?: 'white' | 'secondary';
  className?: string;
}

export function PageIcon({ icon, variant = 'secondary', className, ...props }: PageIconProps) {
  return (
    <div
      className={cn(
        "w-[48px] h-[48px] rounded-[13px] flex items-center justify-center mb-4 transition-transform shadow-sm flex-shrink-0 group-hover:scale-105",
        variant === 'white' 
          ? "bg-white text-[var(--color-thread-mid-green)]" 
          : "bg-[var(--hero-secondary-icon-bg)] text-[var(--hero-secondary-icon-text)]",
        className
      )}
      {...props}
    >
      {icon}
    </div>
  );
}
