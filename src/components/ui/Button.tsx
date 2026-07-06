import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { buttonPress } from '../../lib/motion-presets';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'mint' | 'slate' | 'white' | 'muted' | 'link' | 'forest' | 'danger' | 'dangerSolid';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'mint', isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const variants = {
      mint: 'thread-button--mint',
      slate: 'thread-button--slate',
      white: 'thread-button--white',
      muted: 'thread-button--muted',
      link: 'thread-button--link',
      forest: 'thread-button--forest',
      danger: 'thread-button--danger',
      dangerSolid: 'thread-button--danger-solid',
    };

    return (
      <motion.button
        ref={ref as any}
        {...buttonPress}
        className={cn(
          'thread-button',
          variants[variant],
          className
        )}
        disabled={isLoading || props.disabled}
        {...(props as any)}
      >
        {isLoading && (
          <svg className="thread-button__spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="thread-button__icon thread-button__icon--left">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="thread-button__icon thread-button__icon--right">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
