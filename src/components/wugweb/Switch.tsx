"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../ui/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn(
      "peer inline-flex shrink-0 items-center box-border outline-none transition-all",
      "border border-transparent",
      "data-[state=unchecked]:bg-[var(--muted)]",
      "data-[state=checked]:bg-[var(--primary)]",
      "focus-visible:border-[var(--ring)]",
      "focus-visible:ring-[3px]",
      "focus-visible:ring-[var(--ring)]/20",
      "disabled:cursor-not-allowed",
      "disabled:opacity-50",
      className,
    )}
    style={{
      height: '24px',
      width: '44px',
      borderRadius: 'var(--radius-full)',
    }}
    {...props}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "pointer-events-none block transition-transform",
        "bg-[var(--background)]",
        "data-[state=unchecked]:bg-[var(--muted-foreground)]",
        "data-[state=checked]:bg-[var(--primary-foreground)]",
        "data-[state=checked]:translate-x-[calc(100%-2px)]",
        "data-[state=unchecked]:translate-x-0",
      )}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: 'var(--radius-full)',
      }}
    />
  </SwitchPrimitive.Root>
));

Switch.displayName = "Switch";

export { Switch };
