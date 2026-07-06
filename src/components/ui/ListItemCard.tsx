import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';
import { buttonPress } from '../../lib/motion-presets';

interface ListItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function ListItemCard({ children, className, active, ...props }: ListItemCardProps) {
  return (
    <motion.div 
      {...buttonPress}
      className={cn(
        "thread-list-item group",
        active
          ? "thread-list-item--active"
          : "thread-list-item--idle",
        className
      )}
      {...(props as any)}
    >
      <span className="thread-list-item__label">{children}</span>
      <ChevronRight className={cn(
        "thread-list-item__icon",
        active ? "thread-list-item__icon--active" : "thread-list-item__icon--idle"
      )} />
    </motion.div>
  );
}
