"use client";

import * as React from "react";

import { cn } from "./utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export function EmptyState({ icon, title, description, className, ...props }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn("flex flex-col items-center justify-center text-center p-8", className)}
      {...props}
    >
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>}
    </div>
  );
}