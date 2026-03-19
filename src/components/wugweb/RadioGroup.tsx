"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "../ui/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      data-slot="radio-group"
      className={cn("grid", className)}
      style={{ gap: 'var(--spacing-3)' }}
      {...props}
    />
  );
});

RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-slot="radio-group-item"
      className={cn(
        "aspect-square shrink-0 box-border outline-none transition-all",
        "bg-[var(--input-background)]",
        "border border-[var(--border)]",
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
        borderRadius: 'var(--radius-full)',
      }}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <Circle 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          size={10}
          fill="var(--primary)"
          color="var(--primary)"
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
