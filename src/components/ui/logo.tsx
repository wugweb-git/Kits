"use client";

import * as React from "react";

import { cn } from "./utils";

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function Logo({ className, alt = "Logo", ...props }: LogoProps) {
  return (
    <span data-slot="logo" className={cn("inline-flex items-center", className)}>
      <img alt={alt} className="h-6 w-auto" {...props} />
      <span className="sr-only">{alt}</span>
    </span>
  );
}