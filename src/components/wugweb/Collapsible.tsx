import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface CollapsibleProps {
  /** The header/trigger content */
  header: React.ReactNode;
  /** The collapsible content */
  children: React.ReactNode;
  /** Whether the collapsible starts open */
  defaultOpen?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Optional className for custom styling */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Icon position */
  iconPosition?: 'left' | 'right';
}

export function Collapsible({
  header,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  className = '',
  disabled = false,
  iconPosition = 'right',
}: CollapsibleProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(defaultOpen);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isOpen;
    setInternalIsOpen(newState);
    onOpenChange?.(newState);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <button
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        className="flex items-center gap-[var(--spacing-1)] w-full text-left transition-opacity"
        style={{
          opacity: disabled ? '0.5' : '1',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {iconPosition === 'left' && (
          <div className="flex items-center justify-center">
            {isOpen ? (
              <ChevronUp
                size={16}
                className="text-[var(--muted-foreground)] transition-transform"
                style={{
                  transitionDuration: 'var(--motion-duration-normal)',
                  transitionTimingFunction: 'var(--motion-easing-standard)',
                }}
              />
            ) : (
              <ChevronDown
                size={16}
                className="text-[var(--muted-foreground)] transition-transform"
                style={{
                  transitionDuration: 'var(--motion-duration-normal)',
                  transitionTimingFunction: 'var(--motion-easing-standard)',
                }}
              />
            )}
          </div>
        )}

        <div className="flex-1">{header}</div>

        {iconPosition === 'right' && (
          <div className="flex items-center justify-center">
            <ChevronDown
              size={16}
              className="text-[var(--muted-foreground)] transition-transform"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transitionDuration: 'var(--motion-duration-normal)',
                transitionTimingFunction: 'var(--motion-easing-standard)',
              }}
            />
          </div>
        )}
      </button>

      <div
        className="overflow-hidden transition-all"
        style={{
          maxHeight: isOpen ? '1000px' : '0',
          opacity: isOpen ? '1' : '0',
          transitionDuration: 'var(--motion-duration-normal)',
          transitionTimingFunction: 'var(--motion-easing-standard)',
        }}
      >
        <div className="pt-[var(--spacing-1)]">{children}</div>
      </div>
    </div>
  );
}

export interface CollapsibleItemProps {
  /** The label for the item */
  label: string;
  /** The value/content of the item */
  value: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Optional className for custom styling */
  className?: string;
}

export function CollapsibleItem({
  label,
  value,
  icon,
  className = '',
}: CollapsibleItemProps) {
  return (
    <div
      className={`flex items-center gap-[var(--spacing-1)] p-[var(--spacing-1)] bg-[var(--input-background)] border border-solid border-[var(--border)] rounded-[var(--radius-md)] ${className}`}
    >
      {icon && (
        <div className="flex items-center justify-center w-[16px] h-[16px] text-[var(--muted-foreground)]">
          {icon}
        </div>
      )}
      <div className="flex-1 flex flex-col gap-[4px]">
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--muted-foreground)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--foreground)',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export interface CollapsibleSectionProps {
  /** Section title */
  title: string;
  /** Section description */
  description?: string;
  /** Section items */
  items: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
  /** Whether the section starts open */
  defaultOpen?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

export function CollapsibleSection({
  title,
  description,
  items,
  defaultOpen = false,
  className = '',
}: CollapsibleSectionProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={className}
      header={
        <div className="flex flex-col gap-[4px]">
          <h4
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
            }}
          >
            {title}
          </h4>
          {description && (
            <p
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--muted-foreground)',
              }}
            >
              {description}
            </p>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-[6px]">
        {items.map((item, index) => (
          <CollapsibleItem
            key={index}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>
    </Collapsible>
  );
}
