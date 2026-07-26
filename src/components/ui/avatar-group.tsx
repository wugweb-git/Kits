"use client";

import * as React from "react";

import { cn } from "./utils";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
}

export function AvatarGroup({ max = 3, className, children, ...props }: AvatarGroupProps) {
  const childArray = React.Children.toArray(children);
  const visible = childArray.slice(0, max);
  const remaining = childArray.length - max;

  return (
    <div
      data-slot="avatar-group"
      className={cn("flex -space-x-2", className)}
      {...props}
    >
      {visible}
      {remaining > 0 && (
        <div
          className="flex size-10 items-center justify-center rounded-full bg-muted text-xs font-medium"
          aria-label={`${remaining} more`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}