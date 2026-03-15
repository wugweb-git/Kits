import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionProps {
  /** The content to display as the accordion header */
  title: string;
  /** The content to display when the accordion is expanded */
  children: React.ReactNode;
  /** Whether the accordion should start in an open state */
  defaultOpen?: boolean;
  /** Optional icon to display before the title */
  icon?: React.ReactNode;
  /** Optional className for custom styling */
  className?: string;
  /** Callback when the accordion is toggled */
  onToggle?: (isOpen: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  icon,
  className = '',
  onToggle,
  disabled = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div
      className={`bg-white border border-solid border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden ${className}`}
      style={{
        opacity: disabled ? '0.5' : '1',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <button
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        className="w-full flex items-center justify-between p-[var(--spacing-1)] gap-[var(--spacing-1)] bg-white hover:bg-[var(--muted)] transition-colors"
        style={{
          transitionDuration: 'var(--motion-duration-fast)',
          transitionTimingFunction: 'var(--motion-easing-standard)',
        }}
      >
        <div className="flex items-center gap-[var(--spacing-1)] flex-1">
          {icon && (
            <div className="shrink-0 w-[16px] h-[16px] flex items-center justify-center text-[var(--muted-foreground)]">
              {icon}
            </div>
          )}
          <span
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--foreground)',
              textAlign: 'left',
            }}
          >
            {title}
          </span>
        </div>
        
        <ChevronDown
          size={16}
          className="shrink-0 text-[var(--muted-foreground)] transition-transform"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transitionDuration: 'var(--motion-duration-normal)',
            transitionTimingFunction: 'var(--motion-easing-standard)',
          }}
        />
      </button>

      <div
        className="overflow-hidden transition-all"
        style={{
          maxHeight: isOpen ? '500px' : '0',
          transitionDuration: 'var(--motion-duration-normal)',
          transitionTimingFunction: 'var(--motion-easing-standard)',
        }}
      >
        <div
          className="p-[var(--spacing-1)]"
          style={{
            borderTop: isOpen ? '1px solid var(--border)' : 'none',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface AccordionGroupProps {
  /** Array of accordion items */
  items: Array<{
    title: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
  }>;
  /** Whether only one accordion can be open at a time */
  allowMultiple?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

export function AccordionGroup({
  items,
  allowMultiple = true,
  className = '',
}: AccordionGroupProps) {
  const [openIndexes, setOpenIndexes] = React.useState<number[]>(
    items.map((item, index) => (item.defaultOpen ? index : -1)).filter(i => i !== -1)
  );

  const handleToggle = (index: number, isOpen: boolean) => {
    if (allowMultiple) {
      setOpenIndexes(prev =>
        isOpen ? [...prev, index] : prev.filter(i => i !== index)
      );
    } else {
      setOpenIndexes(isOpen ? [index] : []);
    }
  };

  return (
    <div className={`flex flex-col gap-[var(--spacing-1)] ${className}`}>
      {items.map((item, index) => (
        <Accordion
          key={index}
          title={item.title}
          icon={item.icon}
          defaultOpen={openIndexes.includes(index)}
          onToggle={(isOpen) => handleToggle(index, isOpen)}
        >
          {item.content}
        </Accordion>
      ))}
    </div>
  );
}
