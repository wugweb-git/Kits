import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority@0.7.1';
import { Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';

// Define the variant configuration based on the Figma component
const buttonVariants = cva(
  // Base layout and typography
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'box-border',
    'whitespace-nowrap',
    'transition-all',
    'duration-100',
    'ease-out',
    'select-none',
    'shrink-0', // Lock sizing: prevents shrinking in flex containers
    // Focus states
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-[var(--ring)]',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-[var(--background)]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--primary)]', // White
          'text-[var(--primary-foreground)]',
          'border',
          'border-[var(--primary)]',
          'hover:brightness-90', // Simple hover effect
          'active:scale-[0.96]', // Native active state interaction
          'active:brightness-75', // Native active state visual
        ],
        secondary: [
          'bg-[var(--secondary)]', // Dark Gray
          'text-[var(--secondary-foreground)]',
          'border',
          'border-[var(--border)]',
          'hover:bg-[var(--surface-700)]',
          'active:scale-[0.96]',
        ],
        outline: [
          'bg-transparent',
          'text-[var(--foreground)]',
          'border',
          'border-[var(--surface-600)]',
          'hover:bg-[var(--surface-800)]',
          'active:scale-[0.96]',
        ],
        ghost: [
          'bg-transparent',
          'text-[var(--foreground)]',
          'border',
          'border-transparent',
          'hover:bg-[var(--surface-800)]',
          'active:scale-[0.96]',
        ],
        destructive: [
          'bg-[var(--destructive)]',
          'text-[var(--destructive-foreground)]',
          'border',
          'border-[var(--destructive)]',
          'hover:brightness-110',
          'active:scale-[0.96]',
        ],
      },
      size: {
        // Locked sizes: Fixed height, fixed padding, fixed radius
        // Typography is decoupled and handled by the textStyles object below via inline styles
        xl: [
          'h-[70px]',
          'min-h-[70px]',
          'max-h-[70px]',
          'px-[20px]',
          'gap-[8px]',
          'rounded-[12px]',
        ],
        lg: [
          'h-[56px]',
          'min-h-[56px]',
          'max-h-[56px]',
          'px-[16px]',
          'gap-[8px]',
          'rounded-[10px]',
        ],
        md: [
          'h-[48px]',
          'min-h-[48px]',
          'max-h-[48px]',
          'px-[16px]',
          'gap-[8px]',
          'rounded-[8px]',
        ],
        sm: [
          'h-[36px]',
          'min-h-[36px]',
          'max-h-[36px]',
          'px-[12px]',
          'gap-[6px]',
          'rounded-[6px]',
        ],
      },
      // Explicit State Variant
      state: {
        default: '',
        hover: '', // Visuals handled by variant hover: classes
        active: '', // Visuals handled by compoundVariants below
        disabled: 'opacity-50 pointer-events-none',
        loading: 'cursor-wait',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    compoundVariants: [
      // Primary Active (Forced state via prop)
      {
        variant: 'primary',
        state: 'active',
        class: 'scale-[0.96] brightness-75', // Strong visual darkening and scale
      },
      // Secondary Active (Forced state via prop)
      {
        variant: 'secondary',
        state: 'active',
        class: 'scale-[0.96] bg-[var(--surface-600)] text-[var(--foreground)] border-[var(--surface-500)]',
      },
      // Outline Active (Forced state via prop)
      {
        variant: 'outline',
        state: 'active',
        class: 'scale-[0.96] bg-[var(--surface-700)]',
      },
      // Ghost Active (Forced state via prop)
      {
        variant: 'ghost',
        state: 'active',
        class: 'scale-[0.96] bg-[var(--surface-700)]',
      },
      // Destructive Active (Forced state via prop)
      {
        variant: 'destructive',
        state: 'active',
        class: 'scale-[0.96] brightness-90',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'xl',
      state: 'default',
      fullWidth: false,
    },
  }
);

// Map size to icon dimensions
const iconSizes = {
  xl: 24,
  lg: 22,
  md: 20,
  sm: 16,
};

// Independent text styles for each size variant
// We use inline styles here to force the text size change and bypass any CSS specificity issues or conflicts
const textStyles = {
  xl: { fontSize: 'var(--text-xl)', lineHeight: '30px', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--core-font-family-base)' },
  lg: { fontSize: 'var(--text-lg)', lineHeight: '28px', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--core-font-family-base)' },
  md: { fontSize: 'var(--text-base)', lineHeight: '24px', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--core-font-family-base)' },
  sm: { fontSize: 'var(--text-sm)', lineHeight: '20px', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--core-font-family-base)' },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = 'xl',
      state,
      fullWidth,
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Determine effective state
    const effectiveState = disabled ? 'disabled' : loading ? 'loading' : state;
    const iconSize = iconSizes[size || 'xl'];
    
    // Select the correct typography style object based on size
    const currentTextStyle = textStyles[size || 'xl'];

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, state: effectiveState, fullWidth, className }))}
        disabled={disabled || loading || effectiveState === 'disabled'}
        style={style}
        {...props}
      >
        {loading ? (
          <Loader2 
            className="animate-spin" 
            size={iconSize} 
          />
        ) : (
          <>
            {leftIcon && (
              <span 
                className="flex items-center justify-center shrink-0"
                style={{ width: iconSize, height: iconSize }}
              >
                {/* Clone element to enforce size if it's an SVG, otherwise just render */}
                {React.isValidElement(leftIcon) 
                  ? React.cloneElement(leftIcon as React.ReactElement, { 
                      width: iconSize, 
                      height: iconSize,
                      className: cn((leftIcon.props as any).className, "block")
                    })
                  : leftIcon}
              </span>
            )}
            
            {children && (
              <span 
                className="truncate"
                style={{ 
                  // Inherit weight and family from the button container
                  fontWeight: 'inherit',
                  fontFamily: 'inherit',
                  // FORCE sizing via inline styles to ensure it overrides any global CSS
                  ...currentTextStyle
                }}
              >
                {children}
              </span>
            )}
            
            {rightIcon && (
              <span 
                className="flex items-center justify-center shrink-0"
                style={{ width: iconSize, height: iconSize }}
              >
                {React.isValidElement(rightIcon)
                  ? React.cloneElement(rightIcon as React.ReactElement, { 
                      width: iconSize, 
                      height: iconSize,
                      className: cn((rightIcon.props as any).className, "block")
                    })
                  : rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';