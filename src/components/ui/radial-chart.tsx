"use client";

import * as React from "react";
import { ChartContainer } from "./chart";

export interface RadialChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: unknown[];
  config?: Record<string, { label?: React.ReactNode; color?: string }>;
}

export function RadialChart({ data, config, className, ...props }: RadialChartProps) {
  return (
    <div className={className} {...props}>
      <ChartContainer config={config || {}} />
    </div>
  );
}