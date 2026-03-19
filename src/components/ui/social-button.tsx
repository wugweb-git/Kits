import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const socialButtonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--social-background)] text-[var(--social-foreground)] border border-[var(--social-border)] hover:bg-[var(--social-background)]/90 active:scale-[0.98]",
        outline:
          "border border-[var(--border)] bg-transparent text-foreground hover:bg-accent/10 hover:text-accent",
        ghost:
          "hover:bg-accent/10 hover:text-accent",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-9 px-3 py-2",
        lg: "h-12 px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface SocialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof socialButtonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
}

const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ className, variant, size, asChild = false, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        data-slot="social-button"
        className={cn(socialButtonVariants({ variant, size, className }))}
        style={{
          borderRadius: 'var(--radius-md)',
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-medium)',
        }}
        ref={ref}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </Comp>
    );
  }
);

SocialButton.displayName = "SocialButton";

export { SocialButton, socialButtonVariants };
