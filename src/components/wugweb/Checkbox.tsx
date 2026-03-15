"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox@1.1.4";
import { Check } from "lucide-react";
import { cn } from "../ui/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      "peer shrink-0 box-border outline-none transition-all",
      "bg-[var(--input-background)]",
      "border border-[var(--border)]",
      "data-[state=checked]:bg-[var(--primary)]",
      "data-[state=checked]:text-[var(--primary-foreground)]",
      "data-[state=checked]:border-[var(--primary)]",
      "focus-visible:border-[var(--ring)]",
      "focus-visible:ring-[3px]",
      "focus-visible:ring-[var(--ring)]/20",
      "disabled:cursor-not-allowed",
      "disabled:opacity-50",
      className,
    )}
    style={{
      width: '20px',
      height: '20px',
      borderRadius: 'var(--radius-1)',
    }}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="flex items-center justify-center text-current"
    >
      <Check size={14} strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
