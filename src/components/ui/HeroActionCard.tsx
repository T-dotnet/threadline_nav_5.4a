import React from 'react';
import { cn } from '../../lib/utils';
import { PageIcon } from './PageIcon';

interface HeroActionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export function HeroActionCard({ icon, title, subtitle, className, ...props }: HeroActionCardProps) {
  return (
    <div 
      className={cn(
        "relative bg-[var(--hero-secondary-bg)] p-6 rounded-tl-[32px] flex-shrink-0 cursor-pointer transition-all w-[180px] text-center group flex flex-col items-center justify-center text-[var(--hero-secondary-text)]",
        className
      )}
      {...props}
    >
      <PageIcon icon={icon} className="mx-auto" />
      <span className="font-medium text-[1.05rem] tracking-tight block">
        {title}
      </span>
      {subtitle && (
        <span className="opacity-70 text-[0.8rem] mt-1">
          {subtitle}
        </span>
      )}
    </div>
  );
}
