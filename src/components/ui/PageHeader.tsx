import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: string;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  titleClassName?: string;
  titleWidthClassName?: string;
  kickerClassName?: string;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, kicker, title, description, action, titleClassName, titleWidthClassName, kickerClassName, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('thread-page-header', className)} {...props}>
        <div className="thread-page-header__layout">
          <div className="thread-page-header__body">
            {kicker && (
              <span className={cn(
                "thread-page-header__kicker",
                kickerClassName
              )}>
                {kicker}
              </span>
            )}
            <h1 className={cn(
              "thread-page-header__title",
              titleWidthClassName,
              titleClassName
            )}>
              {title}
            </h1>
            {description && (
              <div className="thread-page-header__description-wrap">
                {typeof description === 'string' ? (
                  <p className="thread-page-header__description">
                    {description}
                  </p>
                ) : (
                  description
                )}
              </div>
            )}
          </div>
          {action && (
            <div className="thread-page-header__action">
              {action}
            </div>
          )}
        </div>
      </div>
    );
  }
);
PageHeader.displayName = 'PageHeader';
