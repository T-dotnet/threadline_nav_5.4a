import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | null;
  iconClassName?: string;
  variant?: 'default' | 'forest' | 'light' | 'slate' | 'mint';
  as?: 'button' | 'span' | 'a';
  // Extra typing helper to satisfy standard triggers/buttons
  onClick?: (e: React.MouseEvent<any>) => void;
  id?: string;
}

export const ActionLink = React.forwardRef<HTMLElement, ActionLinkProps>(
  ({ className, children, icon: Icon = ChevronRight, iconClassName, variant = 'default', as = 'button', onClick, id, ...props }, ref) => {
    const Component = as as any;

    const getVariantClasses = () => {
      // Map aliases to master styles: 'default' (primary brand green), 'light' (white)
      const resolvedVariant = 
        (variant === 'forest' || variant === 'slate') ? 'default' : variant;

      switch (resolvedVariant) {
        case 'light':
          return "thread-action-link--light";
        case 'mint':
          return "thread-action-link--mint";
        case 'default':
        default:
          return "thread-action-link--default";
      }
    };

    return (
      <Component
        ref={ref}
        id={id}
        onClick={onClick}
        className={cn(
          "thread-action-link group/action",
          getVariantClasses(),
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {Icon && (
          <Icon
            className={cn(
              "thread-action-link__icon",
              iconClassName
            )}
          />
        )}
      </Component>
    );
  }
);

ActionLink.displayName = 'ActionLink';
