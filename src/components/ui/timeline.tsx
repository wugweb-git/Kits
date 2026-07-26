"use client";

import * as React from "react";

import { cn } from "./utils";

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Timeline({ className, ...props }: TimelineProps) {
  return (
    <div
      data-slot="timeline"
      className={cn("relative", className)}
      {...props}
    >
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
      <div className="relative space-y-6 pl-10">{props.children}</div>
    </div>
  );
}