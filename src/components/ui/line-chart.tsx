"use client";

import * as React from "react";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "./chart";

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: unknown[];
  config?: Record<string, { label?: React.ReactNode; color?: string }>;
}

export function LineChart({ data, config, className, ...props }: LineChartProps) {
  return (
    <div className={className} {...props}>
      <ChartContainer config={config || {}}>
        <ChartTooltipContent />
        <ChartLegendContent />
      </ChartContainer>
    </div>
  );
}