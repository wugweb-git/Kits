"use client";

import * as React from "react";

import { cn } from "./utils";

export interface KbdProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
}

export function Kbd({ size = "md", className, ...props }: KbdProps) {
  const sizeClasses: Record<string, string> = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-2.5 py-1.5",
  };

  return (
    <span
      data-slot="kbd"
      className={cn(
        "rounded-md border border-border bg-muted font-mono",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}