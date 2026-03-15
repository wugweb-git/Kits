import React from 'react';

export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Label text for the tab */
  label: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Tab content */
  content: React.ReactNode;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

export interface TabsProps {
  /** Array of tab items */
  items: TabItem[];
  /** Default active tab ID */
  defaultValue?: string;
  /** Controlled active tab ID */
  value?: string;
  /** Callback when tab changes */
  onValueChange?: (value: string) => void;
  /** Optional className for custom styling */
  className?: string;
  /** Variant */
  variant?: 'default' | 'underline' | 'pills';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

export function Tabs({
  items,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className = '',
  variant = 'underline',
  size = 'md',
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || items[0]?.id || '');

  const activeValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;
    setInternalValue(tabId);
    onValueChange?.(tabId);
  };

  const sizeStyles = {
    sm: {
      padding: '4px 8px',
      fontSize: 'var(--text-xs)',
      height: '28px',
    },
    md: {
      padding: '6px 12px',
      fontSize: 'var(--text-sm)',
      height: '32px',
    },
    lg: {
      padding: '8px 16px',
      fontSize: 'var(--text-base)',
      height: '40px',
    },
  };

  const getVariantStyles = (isActive: boolean, disabled?: boolean) => {
    const baseStyles = {
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? '0.5' : '1',
      transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
      fontFamily: 'Inter Tight, sans-serif',
      fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
      ...sizeStyles[size],
    };

    switch (variant) {
      case 'underline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
          borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
          borderRadius: '0',
        };
      case 'pills':
        return {
          ...baseStyles,
          backgroundColor: isActive ? 'var(--accent)' : 'transparent',
          color: isActive ? 'var(--accent-foreground)' : 'var(--foreground)',
          borderRadius: 'var(--radius-full)',
          border: 'none',
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: isActive ? 'var(--muted)' : 'transparent',
          color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
        };
    }
  };

  const activeTab = items.find(item => item.id === activeValue);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Tab List */}
      <div
        className="flex items-center gap-[4px]"
        role="tablist"
        style={{
          borderBottom: variant === 'underline' ? '1px solid var(--border)' : 'none',
          padding: variant === 'pills' ? '4px' : '0',
          backgroundColor: variant === 'pills' ? 'var(--muted)' : 'transparent',
          borderRadius: variant === 'pills' ? 'var(--radius-full)' : '0',
        }}
      >
        {items.map((item) => {
          const isActive = item.id === activeValue;
          const variantStyles = getVariantStyles(isActive, item.disabled);

          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-disabled={item.disabled}
              onClick={() => handleTabClick(item.id, item.disabled)}
              className="flex items-center justify-center gap-[6px]"
              style={variantStyles}
            >
              {item.icon && (
                <div className="flex items-center justify-center">
                  {item.icon}
                </div>
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab && (
        <div
          role="tabpanel"
          className="mt-[var(--spacing-2)]"
          style={{
            animation: 'fadeIn var(--motion-duration-fast) var(--motion-easing-standard)',
          }}
        >
          {activeTab.content}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
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
