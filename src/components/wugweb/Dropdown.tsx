import React from 'react';
import { ChevronDownIcon } from './CompleteIconLibrary';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
  leadingIcon?: React.ReactNode;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  size = 'md',
  disabled = false,
  error = false,
  className,
  style,
  leadingIcon,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Size configurations
  const sizeConfig = {
    sm: {
      height: '32px',
      padding: '6px var(--spacing-1)',
      fontSize: 'var(--text-sm)',
      iconSize: 14,
    },
    md: {
      height: '40px',
      padding: '8px var(--spacing-2)',
      fontSize: 'var(--text-base)',
      iconSize: 16,
    },
    lg: {
      height: '48px',
      padding: '12px var(--spacing-2)',
      fontSize: 'var(--text-base)',
      iconSize: 18,
    },
  };

  const config = sizeConfig[size];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          const option = options[focusedIndex];
          if (!option.disabled) {
            onChange?.(option.value);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => {
            let next = prev + 1;
            while (next < options.length && options[next].disabled) {
              next++;
            }
            return next < options.length ? next : prev;
          });
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => {
            let next = prev - 1;
            while (next >= 0 && options[next].disabled) {
              next--;
            }
            return next >= 0 ? next : prev;
          });
        }
        break;
      case 'Home':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(options.findIndex(opt => !opt.disabled));
        }
        break;
      case 'End':
        e.preventDefault();
        if (isOpen) {
          for (let i = options.length - 1; i >= 0; i--) {
            if (!options[i].disabled) {
              setFocusedIndex(i);
              break;
            }
          }
        }
        break;
    }
  };

  // Scroll focused item into view
  React.useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll('[role="option"]');
      items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        fontFamily: 'Inter Tight, sans-serif',
        ...style,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="dropdown-menu"
        style={{
          width: '100%',
          height: config.height,
          padding: config.padding,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-1)',
          fontSize: config.fontSize,
          fontFamily: 'inherit',
          fontWeight: 'var(--font-weight-regular)',
          color: disabled
            ? 'var(--muted-foreground)'
            : selectedOption
            ? 'var(--foreground)'
            : 'var(--muted-foreground)',
          background: disabled ? 'var(--muted)' : 'var(--input-background)',
          border: '2px solid',
          borderColor: error
            ? 'var(--destructive)'
            : isOpen
            ? 'var(--ring)'
            : 'var(--border)',
          borderRadius: 'var(--radius-md)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
          textAlign: 'left',
        }}
        onFocus={(e) => {
          if (!disabled && !error) {
            e.currentTarget.style.boxShadow = 'var(--focus-ring-accent)';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isOpen) {
            e.currentTarget.style.borderColor = 'var(--accent)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen && !error) {
            e.currentTarget.style.borderColor = 'var(--border)';
          }
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-1)',
          flex: 1,
          minWidth: 0,
        }}>
          {leadingIcon && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--muted-foreground)',
            }}>
              {leadingIcon}
            </span>
          )}
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDownIcon
          size={config.iconSize}
          style={{
            color: disabled ? 'var(--muted-foreground)' : 'var(--foreground)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--motion-duration-normal) var(--motion-easing-standard)',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          ref={menuRef}
          id="dropdown-menu"
          role="listbox"
          aria-activedescendant={focusedIndex >= 0 ? `option-${focusedIndex}` : undefined}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 50,
            minWidth: '100%',
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            animation: 'dropdown-enter var(--motion-duration-normal) var(--motion-easing-decelerate)',
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              onClick={() => {
                if (!option.disabled) {
                  onChange?.(option.value);
                  setIsOpen(false);
                  setFocusedIndex(-1);
                }
              }}
              onMouseEnter={() => !option.disabled && setFocusedIndex(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
                padding: config.padding,
                fontSize: config.fontSize,
                fontFamily: 'inherit',
                color: option.disabled
                  ? 'var(--muted-foreground)'
                  : option.value === value
                  ? 'var(--background)'
                  : 'var(--foreground)',
                background:
                  option.value === value
                    ? 'var(--foreground)'
                    : focusedIndex === index
                    ? 'var(--muted)'
                    : 'transparent',
                cursor: option.disabled ? 'not-allowed' : 'pointer',
                transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                fontWeight:
                  option.value === value
                    ? 'var(--font-weight-medium)'
                    : 'var(--font-weight-regular)',
              }}
            >
              {option.icon && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--muted-foreground)',
                }}>
                  {option.icon}
                </span>
              )}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown animation keyframes */}
      <style>{`
        @keyframes dropdown-enter {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
