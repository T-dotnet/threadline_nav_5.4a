import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { SectionDescription } from "./SectionDescription";
import { SectionLabel } from "./SectionLabel";
import { SectionTitle } from "./SectionTitle";
import { WatercolorPanel } from "./WatercolorPanel";

interface ActionPromptPanelProps {
  label: string;
  title: ReactNode;
  description: ReactNode;
  action: ReactNode;
  className?: string;
}

export function ActionPromptPanel({
  label,
  title,
  description,
  action,
  className,
}: ActionPromptPanelProps) {
  return (
    <WatercolorPanel className={cn("p-6 sm:p-8", className)}>
      <div className="bg-white rounded-tr-[28px] p-6 sm:p-8 shadow-premium flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-[60ch] lg:pr-8">
          <SectionLabel>{label}</SectionLabel>
          <SectionTitle>{title}</SectionTitle>
          <SectionDescription className="mb-0">{description}</SectionDescription>
        </div>

        <div className="lg:self-stretch lg:w-px lg:bg-black/10 lg:flex-shrink-0" />

        <div className="flex-shrink-0 lg:pl-2">{action}</div>
      </div>
    </WatercolorPanel>
  );
}
