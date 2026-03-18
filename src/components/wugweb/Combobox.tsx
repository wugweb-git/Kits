import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  size?: 's' | 'm' | 'l';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Combobox Component
 * 
 * Searchable dropdown with autocomplete.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <Combobox
 *   value={selected}
 *   onChange={setSelected}
 *   options={frameworks}
 *   placeholder="Select framework..."
 * />
 */
export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  disabled = false,
  size = 'm',
  className = '',
  style = {},
}: ComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch('');
  };

  const sizeStyles = {
    s: {
      height: '32px',
      fontSize: 'var(--text-sm)',
      padding: '0 36px 0 12px',
      iconSize: 16,
    },
    m: {
      height: '40px',
      fontSize: 'var(--text-base)',
      padding: '0 44px 0 16px',
      iconSize: 20,
    },
    l: {
      height: '48px',
      fontSize: 'var(--text-lg)',
      padding: '0 52px 0 20px',
      iconSize: 24,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', width: '100%', ...style }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: currentSize.fontSize,
          fontWeight: 'var(--font-weight-regular)',
          height: currentSize.height,
          width: '100%',
          padding: currentSize.padding,
          textAlign: 'left',
          color: selectedOption ? 'var(--foreground)' : 'var(--muted-foreground)',
          background: 'var(--input-background)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
          opacity: disabled ? 0.5 : 1,
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = 'var(--ring)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 190, 26, 0.1)';
          }
        }}
        onBlur={(e) => {
          if (!isOpen) {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        {selectedOption?.label || placeholder}
      </button>

      {/* Chevron Icon */}
      <ChevronsUpDown
        size={currentSize.iconSize}
        style={{
          position: 'absolute',
          right: size === 's' ? '10px' : size === 'm' ? '12px' : '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--muted-foreground)',
          pointerEvents: 'none',
        }}
      />

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 38px -10px rgba(0, 0, 0, 0.3), 0 10px 20px -15px rgba(0, 0, 0, 0.2)',
            maxHeight: '300px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search Input */}
          <div style={{ padding: 'var(--spacing-2)', borderBottom: '1px solid var(--border)' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
              style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: currentSize.fontSize,
                fontWeight: 'var(--font-weight-regular)',
                width: '100%',
                padding: 'var(--spacing-2)',
                color: 'var(--foreground)',
                background: 'var(--input-background)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
              }}
            />
          </div>

          {/* Options List */}
          <div style={{ overflowY: 'auto', maxHeight: '250px' }}>
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: currentSize.fontSize,
                  padding: 'var(--spacing-4)',
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                }}
              >
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    style={{
                      fontFamily: 'Inter Tight, sans-serif',
                      fontSize: currentSize.fontSize,
                      fontWeight: 'var(--font-weight-regular)',
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      textAlign: 'left',
                      color: isSelected ? 'var(--accent-foreground)' : 'var(--foreground)',
                      background: isSelected ? 'var(--accent)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'var(--muted)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check size={currentSize.iconSize} />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
