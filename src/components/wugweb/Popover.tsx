import React from 'react';
import { X } from 'lucide-react';

export interface PopoverProps {
  /** Trigger element */
  trigger: React.ReactNode;
  /** Popover content */
  children: React.ReactNode;
  /** Whether the popover is open (controlled) */
  isOpen?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Position of the popover */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether to close on outside click */
  closeOnOutsideClick?: boolean;
  /** Whether to close on escape key */
  closeOnEscape?: boolean;
  /** Optional title */
  title?: string;
  /** Optional className for custom styling */
  className?: string;
}

export function Popover({
  trigger,
  children,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  position = 'bottom-start',
  showCloseButton = false,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  title,
  className = '',
}: PopoverProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(defaultOpen);
  const [popoverPosition, setPopoverPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const newState = !isOpen;
    setInternalIsOpen(newState);
    onOpenChange?.(newState);
  };

  const handleClose = () => {
    setInternalIsOpen(false);
    onOpenChange?.(false);
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - popoverRect.height - gap;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + gap;
        break;
      case 'top-start':
        top = triggerRect.top - popoverRect.height - gap;
        left = triggerRect.left;
        break;
      case 'top-end':
        top = triggerRect.top - popoverRect.height - gap;
        left = triggerRect.right - popoverRect.width;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + gap;
        left = triggerRect.left;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + gap;
        left = triggerRect.right - popoverRect.width;
        break;
    }

    // Ensure popover stays within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + popoverRect.width > window.innerWidth - padding) {
      left = window.innerWidth - popoverRect.width - padding;
    }
    if (top < padding) top = padding;
    if (top + popoverRect.height > window.innerHeight - padding) {
      top = window.innerHeight - popoverRect.height - padding;
    }

    setPopoverPosition({ top, left });
  };

  React.useEffect(() => {
    if (isOpen) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        isOpen &&
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnOutsideClick, closeOnEscape]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className="inline-block cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="false"
          className={`fixed z-[1000] ${className}`}
          style={{
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
            backgroundColor: 'var(--popover)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            minWidth: '200px',
            maxWidth: '400px',
            animation: 'popoverFadeIn var(--motion-duration-normal) var(--motion-easing-emphasized)',
          }}
        >
          {(title || showCloseButton) && (
            <div
              className="flex items-center justify-between px-[var(--spacing-2)] py-[var(--spacing-1)] border-b border-solid border-[var(--border)]"
            >
              {title && (
                <h3
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'Inter Tight, sans-serif',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--popover-foreground)',
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center p-[4px] rounded-[var(--radius-sm)] hover:bg-[var(--muted)] transition-colors"
                  style={{
                    color: 'var(--muted-foreground)',
                    transitionDuration: 'var(--motion-duration-fast)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  aria-label="Close popover"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          <div
            className="p-[var(--spacing-2)]"
            style={{
              color: 'var(--popover-foreground)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'Inter Tight, sans-serif',
            }}
          >
            {children}
          </div>
        </div>
      )}

      <style>{`
        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
