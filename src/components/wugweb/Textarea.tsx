import React from 'react';

export interface TextareaProps {
  /** Textarea value */
  value?: string;
  /** Default value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Whether the textarea is readonly */
  readOnly?: boolean;
  /** Number of visible text rows */
  rows?: number;
  /** Maximum length */
  maxLength?: number;
  /** Whether to show character count */
  showCount?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Required field */
  required?: boolean;
  /** Auto-resize based on content */
  autoResize?: boolean;
  /** Optional className for custom styling */
  className?: string;
}

export function Textarea({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  rows = 4,
  maxLength,
  showCount = false,
  error = false,
  errorMessage,
  label,
  helperText,
  required = false,
  autoResize = false,
  className = '',
}: TextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');

  const currentValue = value !== undefined ? value : internalValue;
  const charCount = currentValue.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    
    setInternalValue(newValue);
    onChange?.(e);

    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [autoResize, currentValue]);

  // Determine classes based on state
  const baseClasses = "w-full rounded-[var(--radius-md)] border border-solid resize-none transition-all outline-none placeholder:text-[var(--muted-foreground)]";
  
  let stateClasses = "";
  if (disabled) {
    stateClasses = "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed border-[var(--border)]";
  } else if (error) {
    stateClasses = "bg-[var(--input-background)] text-[var(--foreground)] border-[var(--destructive)] focus:border-[var(--destructive)] shadow-none";
  } else {
    // Default state: normal border, accent on hover, ring on focus
    // Matching Dropdown component behavior for hover state (var(--accent))
    stateClasses = "bg-[var(--input-background)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--accent)] focus:border-[var(--ring)] focus:shadow-[var(--focus-ring-accent)]";
  }

  return (
    <div className={`flex flex-col gap-[var(--spacing-2)] w-full ${className}`}>
      {label && (
        <label
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: disabled ? 'var(--muted-foreground)' : 'var(--foreground)',
            fontFamily: 'Inter Tight, sans-serif',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--destructive)', marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={currentValue}
          defaultValue={defaultValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          rows={autoResize ? undefined : rows}
          maxLength={maxLength}
          required={required}
          className={`${baseClasses} ${stateClasses}`}
          style={{
            padding: 'var(--spacing-3)',
            // Colors are handled by classes now to support hover
            fontSize: 'var(--text-base)',
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 'var(--font-weight-regular)',
            lineHeight: '1.5',
            transitionDuration: 'var(--motion-duration-fast)',
            transitionTimingFunction: 'var(--motion-easing-standard)',
            minHeight: autoResize ? '44px' : undefined,
          }}
        />

        {showCount && maxLength && (
          <div
            className="absolute bottom-[var(--spacing-2)] right-[var(--spacing-3)] pointer-events-none"
            style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'Inter Tight, sans-serif',
              color: charCount >= maxLength ? 'var(--destructive)' : 'var(--muted-foreground)',
              backgroundColor: disabled ? 'transparent' : 'var(--input-background)',
              paddingLeft: '4px'
            }}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>

      {(error && errorMessage) && (
        <span
          className="flex items-center gap-1 animate-fade-in-up"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--destructive)',
          }}
        >
          {errorMessage}
        </span>
      )}

      {(helperText && !error) && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--muted-foreground)',
          }}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}
