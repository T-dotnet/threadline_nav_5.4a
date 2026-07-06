import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface IconItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconClassName?: string;
  containerClassName?: string;
}

export const IconItem = React.forwardRef<HTMLDivElement, IconItemProps>(
  ({ className, icon: Icon, title, description, iconClassName, containerClassName, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('thread-icon-item', className)} {...props}>
        <div className={cn('thread-icon-item__icon-wrap', containerClassName)}>
          <Icon className={cn('thread-icon-item__icon', iconClassName)} />
        </div>
        <div>
          <h4 className="thread-icon-item__title">{title}</h4>
          {description && (
            <p className="thread-icon-item__description">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);
IconItem.displayName = 'IconItem';
