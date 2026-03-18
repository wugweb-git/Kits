"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select@2.1.6";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../ui/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between gap-2 box-border outline-none transition-all whitespace-nowrap",
      "bg-[var(--input-background)]",
      "text-[var(--foreground)]",
      "border border-[var(--border)]",
      "data-[placeholder]:text-[var(--muted-foreground)]",
      "focus:border-[var(--ring)]",
      "focus:ring-[3px]",
      "focus:ring-[var(--ring)]/20",
      "disabled:cursor-not-allowed",
      "disabled:opacity-50",
      "[&_svg]:pointer-events-none",
      "[&_svg]:shrink-0",
      "[&_svg]:opacity-50",
      className,
    )}
    style={{
      height: '40px',
      padding: '0 12px',
      borderRadius: 'var(--radius-2)',
      fontFamily: 'Inter Tight, sans-serif',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-regular)',
    }}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown size={16} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center",
      className
    )}
    style={{ padding: 'var(--spacing-1)' }}
    {...props}
  >
    <ChevronUp size={16} />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center",
      className
    )}
    style={{ padding: 'var(--spacing-1)' }}
    {...props}
  >
    <ChevronDown size={16} />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
        "bg-[var(--popover)]",
        "text-[var(--popover-foreground)]",
        "border border-[var(--border)]",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      style={{ borderRadius: 'var(--radius-2)' }}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
        style={{ padding: 'var(--spacing-1)' }}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("text-[var(--muted-foreground)]", className)}
    style={{
      padding: '6px 8px',
      fontFamily: 'Inter Tight, sans-serif',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-weight-medium)',
    }}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center gap-2 outline-none transition-colors",
      "text-[var(--foreground)]",
      "focus:bg-[var(--accent)]",
      "focus:text-[var(--accent-foreground)]",
      "data-[disabled]:pointer-events-none",
      "data-[disabled]:opacity-50",
      "[&_svg]:pointer-events-none",
      "[&_svg]:shrink-0",
      className,
    )}
    style={{
      padding: '6px 32px 6px 8px',
      borderRadius: 'var(--radius-1)',
      fontFamily: 'Inter Tight, sans-serif',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-regular)',
    }}
    {...props}
  >
    <span className="absolute right-2 flex items-center justify-center" style={{ width: '14px', height: '14px' }}>
      <SelectPrimitive.ItemIndicator>
        <Check size={14} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("bg-[var(--border)]", className)}
    style={{
      height: '1px',
      margin: 'var(--spacing-1) calc(-1 * var(--spacing-1))',
    }}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};