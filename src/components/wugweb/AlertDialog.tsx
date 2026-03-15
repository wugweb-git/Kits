import React from 'react';
import { X, ChevronLeft } from 'lucide-react';

export interface AlertDialogProps {
  /** Whether the alert dialog is open */
  isOpen: boolean;
  /** Callback when the dialog should close */
  onClose: () => void;
  /** Alert title */
  title: string;
  /** Alert description/content */
  description: string;
  /** Optional action buttons */
  actions?: React.ReactNode;
  /** Show back button instead of close */
  showBackButton?: boolean;
  /** Back button callback */
  onBack?: () => void;
  /** Variant/severity */
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

const variantColorMap = {
  default: {
    background: 'var(--surface-900)',
    titleColor: 'var(--foreground)',
  },
  destructive: {
    background: 'var(--destructive)',
    titleColor: 'var(--destructive-foreground)',
  },
  warning: {
    background: 'var(--accent)',
    titleColor: 'var(--accent-foreground)',
  },
  info: {
    background: 'var(--primary)',
    titleColor: 'var(--primary-foreground)',
  },
};

export function AlertDialog({
  isOpen,
  onClose,
  title,
  description,
  actions,
  showBackButton = false,
  onBack,
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}: AlertDialogProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const variantStyles = variantColorMap[variant];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--overlay-background)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn var(--motion-duration-normal) var(--motion-easing-standard)',
        }}
      >
        {/* Dialog */}
        <div
          ref={dialogRef}
          className={`bg-white rounded-[var(--radius-md)] max-w-[432px] w-full ${className}`}
          style={{
            animation: 'slideIn var(--motion-duration-normal) var(--motion-easing-emphasized)',
            border: '1px solid var(--border)',
          }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* Content */}
          <div className="flex gap-[var(--spacing-1)] items-start p-[var(--spacing-2)] rounded-[inherit]">
            <div className="flex-1 flex flex-col gap-[var(--spacing-1)]">
              {/* Header */}
              <div className="flex gap-[var(--spacing-1)] items-center">
                {showBackButton ? (
                  <button
                    onClick={handleBackClick}
                    className="flex items-center justify-center shrink-0 hover:bg-[var(--muted)] rounded-[var(--radius-sm)] transition-colors"
                    style={{
                      width: '24px',
                      height: '24px',
                      color: variantStyles.titleColor,
                      transitionDuration: 'var(--motion-duration-fast)',
                    }}
                    aria-label="Go back"
                  >
                    <ChevronLeft size={24} />
                  </button>
                ) : null}

                <h2
                  id="alert-dialog-title"
                  className="flex-1"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: variantStyles.titleColor,
                  }}
                >
                  {title}
                </h2>
              </div>

              {/* Description */}
              <p
                id="alert-dialog-description"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-regular)',
                  color: 'var(--muted-foreground)',
                  lineHeight: '1.5',
                }}
              >
                {description}
              </p>

              {/* Actions */}
              {actions && (
                <div className="flex gap-[var(--spacing-1)] mt-[var(--spacing-1)] justify-end">
                  {actions}
                </div>
              )}
            </div>

            {/* Close button */}
            {!showBackButton && (
              <button
                onClick={onClose}
                className="flex items-center justify-center shrink-0 p-[4px] rounded-[var(--radius-sm)] hover:bg-[var(--muted)] transition-colors"
                style={{
                  color: 'var(--muted-foreground)',
                  transitionDuration: 'var(--motion-duration-fast)',
                }}
                aria-label="Close alert"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
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

export interface AlertDialogActionsProps {
  /** Primary action button */
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'destructive';
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function AlertDialogActions({
  primaryAction,
  secondaryAction,
}: AlertDialogActionsProps) {
  return (
    <>
      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          className="px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-md)] transition-all"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            transitionDuration: 'var(--motion-duration-fast)',
          }}
        >
          {secondaryAction.label}
        </button>
      )}
      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          className="px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-md)] transition-all"
          style={{
            backgroundColor:
              primaryAction.variant === 'destructive'
                ? 'var(--destructive)'
                : 'var(--primary)',
            color:
              primaryAction.variant === 'destructive'
                ? 'var(--destructive-foreground)'
                : 'var(--primary-foreground)',
            border: 'none',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            transitionDuration: 'var(--motion-duration-fast)',
          }}
        >
          {primaryAction.label}
        </button>
      )}
    </>
  );
}
