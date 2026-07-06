import * as React from "react"
import { FactRow } from "./FactRow"

interface ClinicalWeightingProps {
  facts?: Record<string, string>;
  className?: string;
}

export function ClinicalWeighting({ facts, className }: ClinicalWeightingProps) {
  if (!facts || Object.keys(facts).length === 0) return null;

  return (
    <div className={`bg-white p-6 rounded-none rounded-tr-[36px] h-fit ${className || ""}`}>
      <span className="text-[0.6rem] tracking-[0.14em] uppercase text-slate-500 font-medium mb-3 block">
        Clinical weighting
      </span>
      <div className="grid grid-cols-2 gap-x-12 gap-y-1 max-md:grid-cols-1">
        {Object.entries(facts).map(([label, value]) => (
          <FactRow key={label} label={label} value={value as string} />
        ))}
      </div>
    </div>
  );
}
