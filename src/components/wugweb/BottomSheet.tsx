import React from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  /** Whether the bottom sheet is open */
  isOpen: boolean;
  /** Callback when the sheet should close */
  onClose: () => void;
  /** Sheet content */
  children: React.ReactNode;
  /** Sheet title */
  title?: string;
  /** Sheet height */
  height?: 'sm' | 'md' | 'lg' | 'full' | string;
  /** Show overlay */
  showOverlay?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Show drag handle */
  showDragHandle?: boolean;
  /** Enable swipe to close */
  swipeToClose?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

const heightMap = {
  sm: '40vh',
  md: '60vh',
  lg: '80vh',
  full: '100vh',
};

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  height = 'md',
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showDragHandle = true,
  swipeToClose = true,
  className = '',
}: BottomSheetProps) {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartY, setDragStartY] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);

  const sheetHeight = typeof height === 'string' && heightMap[height as keyof typeof heightMap] 
    ? heightMap[height as keyof typeof heightMap] 
    : height;

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sheet is open
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

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!swipeToClose || !showDragHandle) return;
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !swipeToClose) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const offset = Math.max(0, clientY - dragStartY);
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging || !swipeToClose) return;
    setIsDragging(false);
    
    // Close if dragged more than 100px
    if (dragOffset > 100) {
      onClose();
    }
    
    setDragOffset(0);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragOffset]);

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

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed left-0 right-0 bottom-0 flex flex-col ${className}`}
        style={{
          height: sheetHeight,
          backgroundColor: 'var(--surface-800)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          transform: isOpen 
            ? `translateY(${dragOffset}px)` 
            : 'translateY(100%)',
          transition: isDragging 
            ? 'none' 
            : `transform var(--motion-duration-normal) var(--motion-easing-emphasized)`,
          zIndex: 1001,
          maxHeight: '100vh',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
      >
        {/* Drag Handle */}
        {showDragHandle && (
          <div
            className="flex items-center justify-center pt-[8px] pb-[4px] cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div
              style={{
                width: '40px',
                height: '4px',
                backgroundColor: 'var(--border)',
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>
        )}

        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between px-[var(--spacing-2)] py-[var(--spacing-1)] border-b border-solid border-[var(--border)]"
            style={{
              backgroundColor: 'var(--surface-800)',
            }}
          >
            <h3
              id="bottom-sheet-title"
              style={{
                fontSize: 'var(--text-lg)',
                fontFamily: 'Inter Tight, sans-serif',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                margin: 0,
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
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
              aria-label="Close sheet"
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
