"use client";

import * as React from "react";
import { Chart as ChartContainer, ChartTooltipContent, ChartLegendContent } from "./chart";

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: unknown[];
  config?: Record<string, { label?: React.ReactNode; icon?: React.ComponentType; color?: string }>;
}

export function AreaChart({ data, config, className, ...props }: AreaChartProps) {
  return (
    <div className={className} {...props}>
      <ChartContainer config={config || {}}>
        <ChartTooltipContent />
        <ChartLegendContent />
      </ChartContainer>
    </div>
  );
}