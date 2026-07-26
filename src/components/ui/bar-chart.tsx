"use client";

import * as React from "react";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "./chart";

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: unknown[];
  config?: Record<string, { label?: React.ReactNode; icon?: React.ComponentType; color?: string }>;
}

export function BarChart({ data, config, className, ...props }: BarChartProps) {
  return (
    <div className={className} {...props}>
      <ChartContainer config={config || {}}>
        <ChartTooltipContent />
        <ChartLegendContent />
      </ChartContainer>
    </div>
  );
}