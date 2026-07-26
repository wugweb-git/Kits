"use client";

import * as React from "react";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "./chart";

export interface RadarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: unknown[];
  config?: Record<string, { label?: React.ReactNode; color?: string }>;
}

export function RadarChart({ data, config, className, ...props }: RadarChartProps) {
  return (
    <div className={className} {...props}>
      <ChartContainer config={config || {}}>
        <ChartTooltipContent />
        <ChartLegendContent />
      </ChartContainer>
    </div>
  );
}