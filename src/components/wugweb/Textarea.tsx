import * as React from "react";
import { cn } from "../ui/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "flex w-full min-w-0 box-border outline-none transition-all resize-none",
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
          error && "border-[var(--destructive)] ring-[var(--destructive)]/20",
          className,
        )}
        style={{
          minHeight: '100px',
          padding: '12px',
          borderRadius: 'var(--radius-2)',
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-regular)',
          lineHeight: '1.6',
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };