import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './Input';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 's' | 'm' | 'l';
  showClearButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SearchInput Component
 * 
 * Input field with search icon and optional clear button.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <SearchInput
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Search components..."
 *   showClearButton
 * />
 */
export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  disabled = false,
  size = 'm',
  showClearButton = true,
  className = '',
  style = {},
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onSearch) {
      onSearch('');
    }
  };

  const sizeStyles = {
    s: {
      height: '32px',
      fontSize: 'var(--text-sm)',
      iconSize: 16,
      padding: '0 32px 0 32px',
    },
    m: {
      height: '40px',
      fontSize: 'var(--text-base)',
      iconSize: 20,
      padding: '0 40px 0 40px',
    },
    l: {
      height: '48px',
      fontSize: 'var(--text-lg)',
      iconSize: 24,
      padding: '0 48px 0 48px',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: '100%',
        ...style,
      }}
    >
      {/* Search Icon */}
      <div
        style={{
          position: 'absolute',
          left: size === 's' ? '8px' : size === 'm' ? '12px' : '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'var(--muted-foreground)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Search size={currentSize.iconSize} />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: currentSize.fontSize,
          fontWeight: 'var(--font-weight-regular)',
          height: currentSize.height,
          width: '100%',
          padding: currentSize.padding,
          paddingRight: showClearButton && value ? '40px' : undefined,
          color: 'var(--foreground)',
          background: 'var(--input-background)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          transition: 'all var(--motion-duration-normal) var(--motion-easing-standard)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = 'var(--ring)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 190, 26, 0.1)';
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
      />

      {/* Clear Button */}
      {showClearButton && value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: size === 's' ? '8px' : size === 'm' ? '12px' : '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: 'var(--muted-foreground)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--foreground)';
            e.currentTarget.style.background = 'var(--muted)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--muted-foreground)';
            e.currentTarget.style.background = 'none';
          }}
        >
          <X size={currentSize.iconSize - 4} />
        </button>
      )}
    </div>
  );
}
