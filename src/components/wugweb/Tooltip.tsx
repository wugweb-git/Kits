import React from 'react';

export interface TooltipProps {
  /** Content to display in the tooltip */
  content: React.ReactNode;
  /** Element that triggers the tooltip */
  children: React.ReactNode;
  /** Position of the tooltip */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Optional className for custom styling */
  className?: string;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 });
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      calculatePosition();
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + gap;
        break;
    }

    // Ensure tooltip stays within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top < padding) top = padding;
    if (top + tooltipRect.height > window.innerHeight - padding) {
      top = window.innerHeight - tooltipRect.height - padding;
    }

    setTooltipPosition({ top, left });
  };

  React.useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible]);

  const getArrowStyles = () => {
    const arrowSize = 6;
    const baseStyles = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          bottom: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: 'var(--popover) transparent transparent transparent',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: `-${arrowSize}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: 'transparent transparent var(--popover) transparent',
        };
      case 'left':
        return {
          ...baseStyles,
          right: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: 'transparent transparent transparent var(--popover)',
        };
      case 'right':
        return {
          ...baseStyles,
          left: `-${arrowSize}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: 'transparent var(--popover) transparent transparent',
        };
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`fixed z-[9999] ${className}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            backgroundColor: 'var(--popover)',
            color: 'var(--popover-foreground)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 'var(--font-weight-regular)',
            lineHeight: '1.4',
            maxWidth: '320px',
            pointerEvents: 'none',
            animation: 'tooltipFadeIn var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
        >
          {content}
          <div style={getArrowStyles()} />
        </div>
      )}

      <style>{`
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: ${position === 'top' || position === 'bottom' 
              ? 'translateY(' + (position === 'top' ? '4px' : '-4px') + ')' 
              : 'translateX(' + (position === 'left' ? '4px' : '-4px') + ')'
            };
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
      `}</style>
    </>
  );
}
