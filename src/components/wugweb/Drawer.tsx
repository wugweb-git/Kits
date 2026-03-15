import React from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback when the drawer should close */
  onClose: () => void;
  /** Drawer content */
  children: React.ReactNode;
  /** Drawer title */
  title?: string;
  /** Drawer position */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** Drawer size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Show overlay */
  showOverlay?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

const sizeMap = {
  sm: '320px',
  md: '448px',
  lg: '640px',
  xl: '768px',
  full: '100%',
};

export function Drawer({
  isOpen,
  onClose,
  children,
  title,
  position = 'right',
  size = 'md',
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}: DrawerProps) {
  const drawerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when drawer is open
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

  const getDrawerStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      backgroundColor: 'var(--surface-800)',
      transition: `transform var(--motion-duration-normal) var(--motion-easing-emphasized)`,
      zIndex: 1001,
    };

    switch (position) {
      case 'left':
        return {
          ...baseStyles,
          top: 0,
          left: 0,
          width: sizeMap[size],
          height: '100vh',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        };
      case 'right':
        return {
          ...baseStyles,
          top: 0,
          right: 0,
          width: sizeMap[size],
          height: '100vh',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        };
      case 'top':
        return {
          ...baseStyles,
          top: 0,
          left: 0,
          width: '100vw',
          height: sizeMap[size],
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
        };
      case 'bottom':
        return {
          ...baseStyles,
          bottom: 0,
          left: 0,
          width: '100vw',
          height: sizeMap[size],
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        };
    }
  };

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--overlay-background)',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: `opacity var(--motion-duration-normal) var(--motion-easing-standard)`,
            zIndex: 1000,
          }}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`flex flex-col ${className}`}
        style={getDrawerStyles()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between p-[var(--spacing-2)] border-b border-solid border-[var(--border)]"
            style={{
              backgroundColor: 'var(--surface-800)',
            }}
          >
            <h3
              id="drawer-title"
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex items-center justify-center p-[var(--spacing-1)] rounded-[var(--radius-sm)] hover:bg-[var(--muted)] transition-colors"
              style={{
                color: 'var(--muted-foreground)',
                transitionDuration: 'var(--motion-duration-fast)',
              }}
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-[var(--spacing-2)]"
          style={{
            backgroundColor: 'var(--surface-800)',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export interface DrawerTriggerProps {
  /** Button content */
  children: React.ReactNode;
  /** Callback when button is clicked */
  onClick: () => void;
  /** Optional className for custom styling */
  className?: string;
  /** Variant */
  variant?: 'primary' | 'secondary' | 'outline';
}

export function DrawerTrigger({
  children,
  onClick,
  className = '',
  variant = 'primary',
}: DrawerTriggerProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--secondary)',
          color: 'var(--secondary-foreground)',
          border: 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        };
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-md)] transition-all ${className}`}
      style={{
        ...getVariantStyles(),
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        transitionDuration: 'var(--motion-duration-fast)',
        transitionTimingFunction: 'var(--motion-easing-standard)',
      }}
    >
      {children}
    </button>
  );
}
