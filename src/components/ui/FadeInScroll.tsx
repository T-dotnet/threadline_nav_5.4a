import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface FadeInScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
}

export const FadeInScroll = React.forwardRef<HTMLDivElement, FadeInScrollProps>(
  ({ className, children, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ 
          duration: 0.5, 
          ease: [0.21, 0.47, 0.32, 0.98],
          delay 
        }}
        className={className}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);
FadeInScroll.displayName = 'FadeInScroll';
