"use client";

import * as React from "react";

import { cn } from "./utils";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 1 | 2 | 3 | 4 | 6 | 8;
}

export function Grid({ cols = 1, gap = 4, className, ...props }: GridProps) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    6: "grid-cols-6",
    12: "grid-cols-12",
  }[cols];

  const gapClass = {
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
  }[gap];

  return (
    <div
      data-slot="grid"
      className={cn("grid", colsClass, gapClass, className)}
      {...props}
    />
  );
}