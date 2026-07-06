import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { EvidenceBadge } from './EvidenceBadge';

interface HeroQuoteCardProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: string;
  quote: string;
  evidenceLevel?: number;
  evidenceText?: string;
  evidenceVariant?: 'default' | 'light' | 'green';
  variant?: 'default' | 'green';
  action?: React.ReactNode;
  rightNode?: React.ReactNode;
  showQuotes?: boolean;
  description?: string | React.ReactNode;
}

export const HeroQuoteCard = React.forwardRef<HTMLDivElement, HeroQuoteCardProps>(
  ({ className, kicker, quote, evidenceLevel, evidenceText, evidenceVariant = 'default', variant = 'default', action, rightNode, showQuotes = true, description, ...props }, ref) => {
    const hasRightNode = !!rightNode;

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-tr-[36px] overflow-hidden",
          variant === 'green' 
            ? "bg-[var(--color-thread-mid-green)] text-white" 
            : "bg-[var(--hero-bg)] text-[var(--hero-text)]",
          hasRightNode
            ? "p-10 flex items-center justify-between gap-10 max-md:flex-col max-md:items-start"
            : "p-10 h-fit flex flex-col justify-between",
          className,
          "border-0"
        )}
        {...props}
      >
        {/* Elegant Concentric Rings background */}
        <svg
          className={cn(
            "absolute pointer-events-none transition-opacity",
            hasRightNode ? "-right-[100px] -bottom-[130px] w-[340px] h-[340px]" : "-right-[90px] -bottom-[120px] w-[320px] h-[320px]",
            variant === 'green' ? "text-white/10" : "text-[var(--hero-text)]"
          )}
          style={variant === 'default' ? { opacity: 'var(--hero-ring-opacity)' } : {}}
          viewBox="0 0 340 340"
        >
          <circle cx="170" cy="170" r="64" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="170" cy="170" r="112" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="170" cy="170" r="160" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>

        {hasRightNode ? (
          <>
            <div className="relative flex-1">
              {kicker && (
                <span className={cn("text-[0.75rem] tracking-[0.1em] uppercase font-medium mb-6 block", variant === 'green' ? 'text-emerald-200' : 'text-[var(--hero-accent)]')}>
                  {kicker}
                </span>
              )}
              <p className={cn("font-serif font-normal text-[1.55rem] leading-[1.34] tracking-tight max-w-[34ch] relative", description ? "mb-4" : "", variant === 'green' ? 'text-[1.38rem] leading-[1.4]' : '')}>
                {showQuotes ? `"${quote}"` : quote}
              </p>
              {description && (
                <div className="text-[1rem] opacity-70 leading-relaxed max-w-[54ch] relative mb-6">
                  {description}
                </div>
              )}
              {(evidenceLevel !== undefined || evidenceText) && (
                <div className="inline-flex items-center gap-2 mt-6 relative">
                  <EvidenceBadge
                    level={evidenceLevel ?? 0}
                    label={evidenceText}
                    variant={evidenceVariant}
                  />
                </div>
              )}
            </div>
            <div className="relative flex-shrink-0 max-md:w-full">
              {rightNode}
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              {kicker && (
                <span className={cn("text-[0.75rem] tracking-[0.1em] uppercase font-medium mb-6 block", variant === 'green' ? 'text-emerald-200' : 'text-[var(--hero-accent)]')}>
                  {kicker}
                </span>
              )}
              <p className={cn("font-serif font-normal text-[1.55rem] leading-[1.34] tracking-tight max-w-[38ch] relative", description ? "mb-4" : "mb-10", variant === 'green' ? 'text-[1.38rem] leading-[1.4]' : '')}>
                {showQuotes ? `"${quote}"` : quote}
              </p>
              {description && (
                <div className="text-[1rem] opacity-70 leading-relaxed max-w-[54ch] relative mb-8">
                  {description}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto mb-2 relative flex-wrap gap-4">
              {(evidenceLevel !== undefined || evidenceText) && (
                <div className="inline-flex items-center gap-2">
                  <EvidenceBadge
                    level={evidenceLevel ?? 0}
                    label={evidenceText}
                    variant={evidenceVariant}
                  />
                </div>
              )}
              {action && (
                <div className="flex-shrink-0">
                  {action}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

HeroQuoteCard.displayName = 'HeroQuoteCard';
