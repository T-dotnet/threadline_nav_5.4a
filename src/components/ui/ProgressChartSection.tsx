import * as React from "react";
import { cn } from "../../lib/utils";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { SectionLabel } from "./SectionLabel";
import { SectionTitle } from "./SectionTitle";
import { SectionDescription } from "./SectionDescription";
import { FadeInScroll } from "./FadeInScroll";
import { ProgressChartSectionProps } from "../../types";

export function ProgressChartSection({
  label,
  title,
  chartLabel,
  chartSubtitle,
  data,
  description,
  xAxisLabels,
  activeLabelIndex,
  statusPill,
  className,
}: ProgressChartSectionProps) {
  const activePoint =
    activeLabelIndex !== undefined
      ? data[Math.min(activeLabelIndex, data.length - 1)]
      : undefined;

  return (
    <FadeInScroll className={cn("mb-24", className)}>
      <div>
        <SectionLabel className="mb-2">
          {label}
        </SectionLabel>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <SectionTitle className="mb-0">
            {title}
          </SectionTitle>
          {statusPill && (
            <span className="rounded-full bg-[var(--color-thread-light-green)] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[var(--color-thread-mid-green)]">
              {statusPill}
            </span>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-thread-light-green)] border-[var(--color-thread-light-gray)] rounded-tr-[36px] p-7.5 pb-4">
        <SectionLabel className="mb-2">
          {chartLabel}
        </SectionLabel>
        <h3 className="text-[1.15rem] font-medium tracking-tight text-[var(--color-thread-dark-slate)] mb-5.5">
          {chartSubtitle}
        </h3>

        <div className="h-[220px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={1}
            minHeight={1}
            initialDimension={{ width: 1, height: 220 }}
          >
            <AreaChart
              data={data}
              accessibilityLayer={false}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-thread-mid-green)"
                    stopOpacity={0.14}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-thread-mid-green)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide={true} />
              <YAxis hide={true} domain={[0, 200]} reversed />
              {activePoint && (
                <>
                  <ReferenceLine
                    x={activePoint.name}
                    stroke="var(--color-thread-mid-green)"
                    strokeOpacity={0.1}
                    strokeWidth={8}
                  />
                </>
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-thread-mid-green)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1500}
              />
              {activePoint && (
                <>
                  <ReferenceLine
                    x={activePoint.name}
                    stroke="var(--color-thread-mid-green)"
                    strokeOpacity={0.32}
                    strokeWidth={1.5}
                  />
                  <ReferenceDot
                    x={activePoint.name}
                    y={activePoint.value}
                    r={5.5}
                    fill="var(--color-thread-off-white)"
                    stroke="var(--color-thread-mid-green)"
                    strokeWidth={2.5}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          className="grid mt-3 text-[0.72rem] text-[var(--color-thread-gray)] tracking-[0.03em] uppercase font-medium"
          style={{ gridTemplateColumns: `repeat(${xAxisLabels.length}, minmax(0, 1fr))` }}
        >
          {xAxisLabels.map((label, i) => (
            <span 
              key={i} 
              className={cn(
                "text-center",
                i === activeLabelIndex && "font-medium text-[var(--color-thread-dark-slate)]"
              )}
              aria-hidden={!label}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <SectionDescription className="mt-6">
        {description}
      </SectionDescription>
    </FadeInScroll>
  );
}
