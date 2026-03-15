import * as React from "react";
import { cn } from "../ui/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "flex w-full min-w-0 box-border outline-none transition-all",
          "bg-[var(--input-background)]",
          "text-[var(--foreground)]",
          "border border-[var(--border)]",
          "placeholder:text-[var(--muted-foreground)]",
          "focus-visible:border-[var(--ring)]",
          "focus-visible:ring-[3px]",
          "focus-visible:ring-[var(--ring)]/20",
          "disabled:pointer-events-none",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          "file:inline-flex",
          "file:border-0",
          "file:bg-transparent",
          "file:text-[var(--foreground)]",
          "file:font-medium",
          error && "border-[var(--destructive)] ring-[var(--destructive)]/20",
          className,
        )}
        style={{
          height: '40px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-2)',
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: '16px',
          fontWeight: 'var(--font-weight-regular)',
          lineHeight: '1.5',
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
