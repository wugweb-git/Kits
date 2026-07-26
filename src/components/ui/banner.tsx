"use client";

import * as React from "react";

import { cn } from "./utils";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "error" | "success";
}

export function Banner({ variant = "info", className, ...props }: BannerProps) {
  const variantClasses: Record<string, string> = {
    info: "bg-info/10 text-info border-info",
    warning: "bg-warning/10 text-warning border-warning",
    error: "bg-destructive/10 text-destructive border-destructive",
    success: "bg-success/10 text-success border-success",
  };

  return (
    <div
      role="alert"
      data-slot="banner"
      className={cn(
        "w-full rounded-md border px-4 py-3 text-sm",
        variantClasses[variant] || variantClasses.info,
        className
      )}
      {...props}
    />
  );
}