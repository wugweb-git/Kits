"use client";

import * as React from "react";

import { cn } from "./utils";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "outline";
}

export function Tag({ variant = "default", className, ...props }: TagProps) {
  const variantClasses: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-accent text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border bg-transparent",
  };

  return (
    <span
      data-slot="tag"
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}