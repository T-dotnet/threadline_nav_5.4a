import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { ChecklistItemProps } from "../../types";

export function ChecklistItem({
  title,
  description,
  className,
  icon = <Check className="thread-checklist-item__default-check" />,
}: ChecklistItemProps) {
  return (
    <div className={cn("thread-checklist-item", className)}>
      <div className="thread-checklist-item__icon">
        {icon}
      </div>
      <div>
        <h4 className="thread-checklist-item__title">
          {title}
        </h4>
        <p className="thread-checklist-item__description">
          {description}
        </p>
      </div>
    </div>
  );
}
