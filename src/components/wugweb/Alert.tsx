import React from 'react';
import { LucideIcon, Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';

export interface AlertProps {
  title?: string;
  description: string;
  tone?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      title,
      description,
      tone = 'info',
      size = 'md',
      dismissible = false,
      onDismiss,
      className = '',
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isDismissing, setIsDismissing] = React.useState(false);

    // Get icon based on tone
    const getIcon = (): LucideIcon => {
      switch (tone) {
        case 'success':
          return CheckCircle;
        case 'warning':
          return AlertTriangle;
        case 'error':
          return AlertCircle;
        case 'neutral':
          return Info;
        case 'info':
        default:
          return Info;
      }
    };

    // Get tone styles using design tokens
    const getToneStyles = () => {
      const toneMap = {
        info: {
          background: 'var(--accent-subtle)',
          border: 'var(--accent)',
          iconColor: 'var(--accent)',
          textColor: 'var(--foreground)',
          titleColor: 'var(--foreground)',
        },
        success: {
          background: 'var(--success-subtle)',
          border: 'var(--success)',
          iconColor: 'var(--success)',
          textColor: 'var(--foreground)',
          titleColor: 'var(--foreground)',
        },
        warning: {
          background: 'rgba(255, 190, 26, 0.1)',
          border: 'var(--accent)',
          iconColor: 'var(--accent)',
          textColor: 'var(--foreground)',
          titleColor: 'var(--foreground)',
        },
        error: {
          background: 'var(--destructive-subtle)',
          border: 'var(--destructive)',
          iconColor: 'var(--destructive)',
          textColor: 'var(--foreground)',
          titleColor: 'var(--foreground)',
        },
        neutral: {
          background: 'var(--surface-800)',
          border: 'var(--border)',
          iconColor: 'var(--muted-foreground)',
          textColor: 'var(--foreground)',
          titleColor: 'var(--foreground)',
        },
      };

      return toneMap[tone];
    };

    // Size configurations
    const sizeStyles = {
      sm: {
        padding: 'var(--spacing-2)',
        gap: 'var(--spacing-2)',
        iconSize: 16,
        titleSize: 'var(--text-sm)',
        descriptionSize: 'var(--text-sm)',
      },
      md: {
        padding: 'var(--spacing-3)',
        gap: 'var(--spacing-3)',
        iconSize: 20,
        titleSize: 'var(--text-base)',
        descriptionSize: 'var(--text-sm)',
      },
    };

    const Icon = getIcon();
    const currentTone = getToneStyles();
    const currentSize = sizeStyles[size];

    const handleDismiss = () => {
      setIsDismissing(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }, 180); // Match dismissal animation duration
    };

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={tone === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        className={className}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: currentSize.gap,
          padding: currentSize.padding,
          background: currentTone.background,
          border: `1px solid ${currentTone.border}`,
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--core-font-family-base)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          opacity: isDismissing ? 0 : 1,
          transform: isDismissing ? 'translateY(-8px)' : 'translateY(0)',
          transition: `opacity var(--motion-duration-slow) var(--motion-easing-standard), transform var(--motion-duration-slow) var(--motion-easing-standard)`,
        }}
      >
        {/* Leading Icon */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: currentTone.iconColor,
            marginTop: title ? '2px' : '0',
          }}
        >
          <Icon size={currentSize.iconSize} strokeWidth={2} />
        </div>

        {/* Content: Title + Description */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: title ? '4px' : '0',
            minWidth: 0,
          }}
        >
          {title && (
            <div
              style={{
                fontSize: currentSize.titleSize,
                fontWeight: 'var(--font-weight-semibold)',
                color: currentTone.titleColor,
                lineHeight: '1.5',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {title}
            </div>
          )}
          <div
            style={{
              fontSize: currentSize.descriptionSize,
              fontWeight: 'var(--font-weight-regular)',
              color: currentTone.textColor,
              lineHeight: '1.6',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {description}
          </div>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            type="button"
            aria-label="Dismiss alert"
            onClick={handleDismiss}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: size === 'sm' ? '20px' : '24px',
              height: size === 'sm' ? '20px' : '24px',
              padding: '0',
              background: isHovered ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: currentTone.iconColor,
              transition: `all var(--motion-duration-fast) var(--motion-easing-standard)`,
              outline: 'none',
            }}
          >
            <X size={size === 'sm' ? 14 : 16} strokeWidth={2} />
          </button>
        )}

        {/* Focus Ring for Dismiss Button */}
        <style>{`
          button:focus-visible {
            box-shadow: ${
              tone === 'error'
                ? 'var(--focus-ring-destructive)'
                : 'var(--focus-ring-accent)'
            };
            outline: none;
          }
        `}</style>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
