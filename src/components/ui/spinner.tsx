"use client";

import * as React from "react";

import { cn } from "./utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: "size-4 border-2",
    md: "size-6 border-2",
    lg: "size-8 border-3",
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      className={cn("animate-spin rounded-full border-current border-t-transparent", sizeClasses[size], className)}
      {...props}
    />
  );
}