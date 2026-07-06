import React from 'react';
import { cn } from '../../lib/utils';

interface ValueCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  title: string;
  content: string | React.ReactNode;
  solid?: boolean;
  variant?: 'default' | 'mint' | 'white';
  cornerClass?: string;
}

export const ValueCard = React.forwardRef<HTMLDivElement, ValueCardProps>(
  ({ className, title, content, solid = false, variant = 'default', cornerClass = "rounded-[20px]", ...props }, ref) => {
    const isMint = variant === 'mint';
    const isWhite = variant === 'white';
    const isSolid = solid && variant === 'default';
    const toneClassName = isSolid
      ? "thread-value-card--solid"
      : isMint
      ? "thread-value-card--mint"
      : isWhite
      ? "thread-value-card--white"
      : "thread-value-card--cream";

    return (
      <div
        ref={ref}
        className={cn(
          "thread-value-card",
          cornerClass,
          toneClassName,
          className,
          "border-0"
        )}
        {...props}
      >
        <svg
          className="thread-value-card__rings"
          width="240"
          height="240"
        >
          <circle
            cx="120"
            cy="120"
            r="48"
            fill="none"
            stroke={isSolid ? "white" : "black"}
            strokeOpacity={isSolid ? "1" : "0.2"}
            strokeWidth="1"
          />
          <circle
            cx="120"
            cy="120"
            r="82"
            fill="none"
            stroke={isSolid ? "white" : "black"}
            strokeOpacity={isSolid ? "1" : "0.2"}
            strokeWidth="1"
          />
          <circle
            cx="120"
            cy="120"
            r="116"
            fill="none"
            stroke={isSolid ? "white" : "black"}
            strokeOpacity={isSolid ? "1" : "0.2"}
            strokeWidth="1"
          />
        </svg>
        <h3 className="thread-value-card__title">
          {title}
        </h3>
        {typeof content === 'string' ? (
          <p
            className={cn(
              "thread-value-card__body",
              isSolid ? "thread-value-card__body--solid" : "thread-value-card__body--muted",
            )}
          >
            {content}
          </p>
        ) : (
          <div className="thread-value-card__body">
            {content}
          </div>
        )}
      </div>
    );
  }
);

ValueCard.displayName = 'ValueCard';
