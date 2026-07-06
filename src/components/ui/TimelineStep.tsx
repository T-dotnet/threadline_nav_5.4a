import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TimelineStepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  meta: string;
  metaTag?: string;
  description: string | React.ReactNode;
  done?: boolean;
  active?: boolean;
  todo?: boolean;
  titleClassName?: string;
}

export const TimelineStep = React.forwardRef<HTMLDivElement, TimelineStepProps>(
  ({ className, titleClassName, title, meta, metaTag, description, done = false, active = false, todo = false, ...props }, ref) => {
    // If no metaTag is provided, auto-calculate it based on step state
    const resolvedMetaTag = metaTag || (done ? "Done" : active ? "In progress" : "To do");

    return (
      <div
        ref={ref}
        className={cn("thread-timeline-step", className)}
        {...props}
      >
        <div
          className={cn(
            "thread-timeline-step__marker",
            done && "thread-timeline-step__marker--done",
            active && "thread-timeline-step__marker--active",
            todo && "thread-timeline-step__marker--todo",
          )}
        >
          {done && <Check className="thread-timeline-step__check" />}
          {active && (
            <div className="thread-timeline-step__active-dot" />
          )}
        </div>
        <div className="thread-timeline-step__content">
          <div
            className={cn(
              "thread-timeline-step__title",
              done && "thread-timeline-step__title--done",
              titleClassName,
            )}
          >
            {title}
          </div>
          <div className="thread-timeline-step__meta">
            <span className="thread-timeline-step__status">
              {resolvedMetaTag}
            </span>
            <span>{meta}</span>
          </div>
          {typeof description === 'string' ? (
            <p className="thread-timeline-step__description">
              {description}
            </p>
          ) : (
            <div className="thread-timeline-step__description">
              {description}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TimelineStep.displayName = 'TimelineStep';
