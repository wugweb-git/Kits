"use client";

import * as React from "react";
import { ChartContainer } from "./chart";

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: unknown[];
  config?: Record<string, { label?: React.ReactNode; color?: string }>;
}

export function PieChart({ data, config, className, ...props }: PieChartProps) {
  return (
    <div className={className} {...props}>
      <ChartContainer config={config || {}} />
    </div>
  );
}