"use client";

import * as React from "react";

import { cn } from "./utils";

export interface DeviceMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "phone" | "tablet" | "laptop" | "desktop";
}

export function DeviceMockup({ type = "phone", className, children, ...props }: DeviceMockupProps) {
  const typeClasses: Record<string, string> = {
    phone: "rounded-[2rem] border-8 border-muted",
    tablet: "rounded-[1.5rem] border-8 border-muted",
    laptop: "rounded-t-lg border-4 border-muted",
    desktop: "rounded-lg border-4 border-muted",
  };

  return (
    <div
      data-slot="device-mockup"
      className={cn("overflow-hidden bg-card", typeClasses[type], className)}
      {...props}
    >
      {children}
    </div>
  );
}