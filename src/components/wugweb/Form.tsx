import React from 'react';

export interface FormProps {
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Form children (form fields) */
  children: React.ReactNode;
  /** Submit handler */
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Submit button text */
  submitButtonText?: string;
  /** Optional className for custom styling */
  className?: string;
  /** Form layout */
  layout?: 'vertical' | 'horizontal' | 'inline';
  /** Background variant */
  variant?: 'default' | 'accent' | 'card';
}

export function Form({
  title,
  description,
  children,
  onSubmit,
  submitButtonText = 'Submit',
  className = '',
  layout = 'vertical',
  variant = 'default',
}: FormProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'accent':
        return 'var(--accent)';
      case 'card':
        return 'var(--card)';
      default:
        return 'transparent';
    }
  };

  const getTitleColor = () => {
    switch (variant) {
      case 'accent':
        return 'var(--accent-foreground)';
      default:
        return 'var(--foreground)';
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-[var(--spacing-3)] p-[var(--spacing-5)] rounded-[var(--radius-lg)] ${className}`}
      style={{
        backgroundColor: getBackgroundColor(),
      }}
    >
      {(title || description) && (
        <div className="flex flex-col gap-[var(--spacing-1)]">
          {title && (
            <h2
              style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: getTitleColor(),
                lineHeight: '1.2',
              }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-regular)',
                color: getTitleColor(),
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}

      <div
        className={`flex gap-[var(--spacing-2)] ${
          layout === 'vertical'
            ? 'flex-col'
            : layout === 'horizontal'
            ? 'flex-row items-end'
            : 'flex-row items-center flex-wrap'
        }`}
      >
        {children}
      </div>
    </form>
  );
}

export interface FormFieldProps {
  /** Field label */
  label: string;
  /** Field name */
  name: string;
  /** Field type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** Placeholder text */
  placeholder?: string;
  /** Required field */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Field value */
  value?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Optional className for custom styling */
  className?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  value,
  onChange,
  error,
  helperText,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-[6px] flex-1 ${className}`}>
      <label
        htmlFor={name}
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--destructive)' }}> *</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="w-full px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-md)] border border-solid transition-all"
        style={{
          backgroundColor: 'var(--input-background)',
          borderColor: error ? 'var(--destructive)' : 'var(--border)',
          color: 'var(--foreground)',
          fontSize: 'var(--text-base)',
          transitionDuration: 'var(--motion-duration-fast)',
          outline: 'none',
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = 'var(--ring)';
            e.target.style.boxShadow = 'var(--focus-ring-accent)';
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error
            ? 'var(--destructive)'
            : 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
      />

      {error && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--destructive)',
          }}
        >
          {error}
        </span>
      )}

      {helperText && !error && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
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

export interface FormSubmitButtonProps {
  /** Button text */
  children: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Optional className for custom styling */
  className?: string;
}

export function FormSubmitButton({
  children,
  disabled = false,
  loading = false,
  variant = 'primary',
  className = '',
}: FormSubmitButtonProps) {
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
      type="submit"
      disabled={disabled || loading}
      className={`px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] transition-all ${className}`}
      style={{
        ...getVariantStyles(),
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-weight-medium)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? '0.6' : '1',
        transitionDuration: 'var(--motion-duration-fast)',
        transitionTimingFunction: 'var(--motion-easing-standard)',
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}