import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: 'default' | 'search';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, variant = 'default', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'thread-input',
          variant === 'default' && 'thread-input--default',
          variant === 'search' && 'thread-input--search',
          error && 'thread-input--error',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
