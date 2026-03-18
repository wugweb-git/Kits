import React from 'react';
import { cn } from '../ui/utils';
import { FileText } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority@0.7.1';

const bannerVariants = cva(
  "relative w-full overflow-hidden flex flex-col justify-between box-border",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] text-[var(--accent-foreground)]",
        secondary: "bg-[var(--surface-800)] text-[var(--foreground)] border border-[var(--border)]",
      },
      size: {
        default: "min-h-[312px] rounded-[20px] p-[32px] md:p-[40px]",
        sm: "min-h-[200px] rounded-[16px] p-[24px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CTABannerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof bannerVariants> {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
}

export function CTABanner({
  title = 'We speak your Industry\'s language.',
  subtitle = 'Partner with Wugweb for domain-driven design and development that delivers.',
  buttonLabel = 'Request Quote',
  onButtonClick,
  buttonIcon,
  className,
  variant,
  size,
  ...props
}: CTABannerProps) {
  return (
    <div 
      className={cn(bannerVariants({ variant, size, className }))}
      {...props}
    >
      {/* Top Section: Title */}
      <div className="w-full max-w-full md:max-w-[85%] lg:max-w-[70%] mb-8 md:mb-0 z-10">
        <h2 
          className="font-['Inter_Tight'] font-bold leading-[1.1] tracking-tight text-[var(--accent-foreground)]"
          style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
        >
          {title}
        </h2>
      </div>

      {/* Bottom Section: Subtitle & Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 z-10">
        <p 
          className="font-['Inter_Tight'] font-medium text-[var(--accent-foreground)] max-w-[600px] leading-[1.4]"
          style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}
        >
          {subtitle}
        </p>

        <button
          onClick={onButtonClick}
          className="shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          style={{
            height: '70px',
            padding: '0 32px',
            borderRadius: '12px',
            backgroundColor: 'var(--accent-foreground)',
            color: '#ffffff',
            fontSize: 'var(--text-xl)',
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.opacity = '1';
          }}
        >
          <span>{buttonLabel}</span>
          {buttonIcon || <FileText size={24} />}
        </button>
      </div>
    </div>
  );
}