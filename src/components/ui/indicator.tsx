"use client";

import * as React from "react";

import { cn } from "./utils";

export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
}

export function Indicator({ color = "bg-success", className, ...props }: IndicatorProps) {
  return (
    <span
      data-slot="indicator"
      className={cn("inline-block size-2 rounded-full", color, className)}
      {...props}
    />
  );
}