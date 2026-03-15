import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface MenuItemProps {
  label: string;
  icon?: LucideIcon;
  iconPosition?: 'leading' | 'trailing' | 'none';
  trailingIcon?: LucideIcon;
  shortcut?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'destructive' | 'subtle';
  ariaRole?: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox';
  ariaChecked?: boolean;
}

export function MenuItem({
  label,
  icon: Icon,
  iconPosition = 'none',
  trailingIcon: TrailingIcon,
  shortcut,
  selected = false,
  disabled = false,
  onClick,
  size = 'md',
  tone = 'default',
  ariaRole = 'menuitem',
  ariaChecked,
}: MenuItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPressed(true);
      onClick?.();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(false);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'var(--spacing-1) var(--spacing-2)',
      fontSize: 'var(--text-xs)',
      iconSize: 14,
      gap: 'var(--spacing-1)',
      minHeight: '32px',
    },
    md: {
      padding: 'var(--spacing-2) var(--spacing-3)',
      fontSize: 'var(--text-sm)',
      iconSize: 16,
      gap: 'var(--spacing-2)',
      minHeight: '36px',
    },
    lg: {
      padding: 'var(--spacing-3) var(--spacing-4)',
      fontSize: 'var(--text-base)',
      iconSize: 18,
      gap: 'var(--spacing-2)',
      minHeight: '44px',
    },
  };

  // Tone configurations
  const getToneColors = () => {
    if (tone === 'destructive') {
      return {
        text: disabled ? 'var(--muted-foreground)' : 'var(--destructive)',
        hoverBg: disabled ? 'transparent' : 'var(--destructive-subtle)',
        selectedBg: 'var(--destructive-subtle)',
        icon: disabled ? 'var(--muted-foreground)' : 'var(--destructive)',
      };
    }
    
    if (tone === 'subtle') {
      return {
        text: disabled ? 'var(--muted-foreground)' : 'var(--muted-foreground)',
        hoverBg: disabled ? 'transparent' : 'var(--surface-700)',
        selectedBg: 'var(--surface-700)',
        icon: disabled ? 'var(--muted-foreground)' : 'var(--muted-foreground)',
      };
    }

    // Default tone
    return {
      text: disabled ? 'var(--muted-foreground)' : 'var(--foreground)',
      hoverBg: disabled ? 'transparent' : 'var(--surface-700)',
      selectedBg: 'var(--surface-700)',
      icon: disabled ? 'var(--muted-foreground)' : 'var(--foreground)',
    };
  };

  const colors = getToneColors();
  const config = sizeConfig[size];

  const getBackgroundColor = () => {
    if (disabled) return 'transparent';
    if (selected) return colors.selectedBg;
    if (isPressed) return 'var(--surface-600)';
    if (isHovered) return colors.hoverBg;
    return 'transparent';
  };

  return (
    <div
      role={ariaRole}
      aria-checked={ariaRole !== 'menuitem' ? ariaChecked : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: config.gap,
        padding: config.padding,
        minHeight: config.minHeight,
        fontSize: config.fontSize,
        fontFamily: 'Inter Tight, sans-serif',
        color: colors.text,
        background: getBackgroundColor(),
        borderRadius: 'var(--radius-sm)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        outline: 'none',
        transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}
      className="menu-item"
    >
      <style>{`
        .menu-item:focus-visible {
          outline: 2px solid var(--ring);
          outline-offset: 2px;
        }

        .menu-item:active:not([aria-disabled="true"]) {
          transform: scale(0.98);
        }
      `}</style>

      {/* Selection Indicator */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '60%',
            background: tone === 'destructive' ? 'var(--destructive)' : 'var(--accent)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}
        />
      )}

      {/* Leading Icon */}
      {Icon && iconPosition === 'leading' && (
        <Icon
          size={config.iconSize}
          style={{
            color: colors.icon,
            flexShrink: 0,
          }}
        />
      )}

      {/* Label */}
      <span
        style={{
          flex: 1,
          fontWeight: selected ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
          lineHeight: '1.5',
        }}
      >
        {label}
      </span>

      {/* Shortcut */}
      {shortcut && (
        <span
          style={{
            fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-xs)',
            color: 'var(--muted-foreground)',
            fontFamily: 'monospace',
            opacity: disabled ? 0.5 : 0.7,
            flexShrink: 0,
          }}
        >
          {shortcut}
        </span>
      )}

      {/* Trailing Icon */}
      {((Icon && iconPosition === 'trailing') || TrailingIcon) && (
        <>{TrailingIcon ? (
          <TrailingIcon
            size={config.iconSize}
            style={{
              color: colors.icon,
              flexShrink: 0,
            }}
          />
        ) : Icon && iconPosition === 'trailing' ? (
          <Icon
            size={config.iconSize}
            style={{
              color: colors.icon,
              flexShrink: 0,
            }}
          />
        ) : null}</>
      )}
    </div>
  );
}
