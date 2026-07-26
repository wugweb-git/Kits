"use client";

import * as React from "react";

import { cn } from "./utils";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ButtonGroup({ className, ...props }: ButtonGroupProps) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn("inline-flex items-center rounded-md", className)}
      {...props}
    />
  );
}