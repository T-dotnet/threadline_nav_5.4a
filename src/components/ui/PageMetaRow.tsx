import type { HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface PageMetaItem {
  icon?: LucideIcon;
  children: ReactNode;
}

interface PageMetaRowProps extends HTMLAttributes<HTMLDivElement> {
  items: PageMetaItem[];
  itemClassName?: string;
}

export function PageMetaRow({ items, className, itemClassName, ...props }: PageMetaRowProps) {
  return (
    <div
      className={cn("flex gap-4.5 text-[0.82rem] text-[var(--color-thread-gray)] flex-wrap", className)}
      {...props}
    >
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <span key={index} className={cn("flex items-center gap-1.5", itemClassName)}>
            {Icon && (
              <Icon className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />
            )}
            {item.children}
          </span>
        );
      })}
    </div>
  );
}
