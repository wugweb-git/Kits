import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';

// Define the variant configuration based on the design system
const socialButtonVariants = cva(
  // Base layout and typography
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'box-border',
    'font-semibold',
    'font-["Inter_Tight"]',
    'whitespace-nowrap',
    'transition-all',
    'duration-100',
    'ease-out',
    'select-none',
    'shrink-0', // Lock sizing
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
        default: [
          'bg-[var(--social-background)]',
          'text-[var(--social-foreground)]',
          'border',
          'border-[var(--social-border)]',
          'hover:brightness-95',
          'active:scale-[0.96]',
          'shadow-sm',
        ],
        outline: [
          'bg-transparent',
          'text-[var(--foreground)]',
          'border',
          'border-[var(--border)]',
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
      },
      size: {
        // Locked sizes matching the main Button component for consistency
        xl: [
          'h-[70px]',
          'min-h-[70px]',
          'max-h-[70px]',
          'px-[24px]',
          'gap-[12px]',
          'rounded-[12px]',
        ],
        lg: [
          'h-[56px]',
          'min-h-[56px]',
          'max-h-[56px]',
          'px-[20px]',
          'gap-[10px]',
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
      state: {
        default: '',
        active: '', 
        disabled: 'opacity-50 pointer-events-none',
        loading: 'cursor-wait',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        state: 'active',
        class: 'scale-[0.96] brightness-95',
      },
      {
        variant: 'outline',
        state: 'active',
        class: 'scale-[0.96] bg-[var(--surface-800)]',
      },
      {
        variant: 'ghost',
        state: 'active',
        class: 'scale-[0.96] bg-[var(--surface-800)]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md', // Social buttons usually default to md or lg
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
const textStyles = {
  xl: { fontSize: 'var(--text-xl)', lineHeight: '30px' },
  lg: { fontSize: 'var(--text-lg)', lineHeight: '28px' },
  md: { fontSize: 'var(--text-base)', lineHeight: '24px' },
  sm: { fontSize: 'var(--text-sm)', lineHeight: '20px' },
};

export interface SocialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof socialButtonVariants> {
  icon?: React.ReactNode;
  loading?: boolean;
}

export const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  (
    {
      className,
      variant,
      size = 'md',
      state,
      fullWidth,
      icon,
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
    const iconSize = iconSizes[size || 'md'];
    
    // Select the correct typography style object based on size
    const currentTextStyle = textStyles[size || 'md'];

    return (
      <button
        ref={ref}
        className={cn(socialButtonVariants({ variant, size, state: effectiveState, fullWidth, className }))}
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
            {icon && (
              <span 
                className="flex items-center justify-center shrink-0"
                style={{ width: iconSize, height: iconSize }}
              >
                {React.isValidElement(icon) 
                  ? React.cloneElement(icon as React.ReactElement, { 
                      width: iconSize, 
                      height: iconSize,
                      className: cn((icon.props as any).className, "block")
                    })
                  : icon}
              </span>
            )}
            
            {children && (
              <span 
                className="truncate"
                style={{ 
                  fontWeight: 'inherit',
                  fontFamily: 'inherit',
                  ...currentTextStyle
                }}
              >
                {children}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

SocialButton.displayName = 'SocialButton';