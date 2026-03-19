"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../ui/utils";

function Label({
  className,
  htmlFor,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-[var(--spacing-2)] select-none",
        "text-[var(--foreground)]",
        "group-data-[disabled=true]:pointer-events-none",
        "group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-50",
        className,
      )}
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: '1.5',
      }}
      {...props}
    />
  );
}

export { Label };