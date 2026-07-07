import React from 'react';
import { cn } from '../../lib/utils';

interface InsightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  cornerClass?: string;
  hoverScale?: boolean;
  variant?: 'default' | 'premium';
}

export const InsightCard = React.forwardRef<HTMLDivElement, InsightCardProps>(
  ({ className, icon, title, description, cornerClass = "rounded-[24px]", hoverScale = true, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white p-6.5 text-left h-full flex flex-col transition-all duration-300 shadow-premium",
          hoverScale && "hover:scale-[1.02] hover:shadow-premium-hover",
          cornerClass,
          className
        )}
        {...props}
      >
        {icon && (
          <div className="w-[46px] h-[46px] rounded-[13px] bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)] mb-4.5 flex-shrink-0">
            {icon}
          </div>
        )}
        <h3 className="thread-sans-heading text-[1.14rem] md:text-[1.16rem] font-medium tracking-tight text-[var(--color-thread-heading)] mb-2.5 leading-tight font-sans">
          {title}
        </h3>
        <p className="text-[0.9rem] text-[var(--color-thread-gray)] leading-relaxed font-sans flex-1">
          {description}
        </p>
      </div>
    );
  }
);

InsightCard.displayName = 'InsightCard';
