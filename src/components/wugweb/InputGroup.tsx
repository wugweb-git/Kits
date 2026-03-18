import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputGroupProps {
  children: React.ReactNode;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  size?: 's' | 'm' | 'l';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * InputGroup Component
 * 
 * Wraps Input with attached icons or buttons.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <InputGroup leftIcon={User} rightElement={<Button>Submit</Button>}>
 *   <Input placeholder="Enter username" />
 * </InputGroup>
 */
export function InputGroup({
  children,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftElement,
  rightElement,
  size = 'm',
  className = '',
  style = {},
}: InputGroupProps) {
  const sizeStyles = {
    s: {
      height: '32px',
      iconSize: 16,
      padding: '0 8px',
    },
    m: {
      height: '40px',
      iconSize: 20,
      padding: '0 12px',
    },
    l: {
      height: '48px',
      iconSize: 24,
      padding: '0 16px',
    },
  };

  const currentSize = sizeStyles[size];

  // Clone the child input and modify its styles
  const input = React.Children.only(children);
  const modifiedInput = React.isValidElement(input)
    ? React.cloneElement(input, {
        style: {
          ...(input.props as any).style,
          paddingLeft: LeftIcon || leftElement ? '44px' : undefined,
          paddingRight: RightIcon || rightElement ? '44px' : undefined,
          borderTopRightRadius: rightElement ? 0 : undefined,
          borderBottomRightRadius: rightElement ? 0 : undefined,
          borderTopLeftRadius: leftElement ? 0 : undefined,
          borderBottomLeftRadius: leftElement ? 0 : undefined,
          borderRight: rightElement ? 'none' : undefined,
          borderLeft: leftElement ? 'none' : undefined,
        },
      } as any)
    : input;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        ...style,
      }}
    >
      {/* Left Element */}
      {leftElement && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: currentSize.height,
            padding: currentSize.padding,
            background: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRight: 'none',
            borderTopLeftRadius: 'var(--radius-md)',
            borderBottomLeftRadius: 'var(--radius-md)',
          }}
        >
          {leftElement}
        </div>
      )}

      {/* Left Icon */}
      {LeftIcon && !leftElement && (
        <LeftIcon
          size={currentSize.iconSize}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted-foreground)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Input */}
      <div style={{ flex: 1, position: 'relative' }}>{modifiedInput}</div>

      {/* Right Icon */}
      {RightIcon && !rightElement && (
        <RightIcon
          size={currentSize.iconSize}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted-foreground)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Right Element */}
      {rightElement && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: currentSize.height,
            padding: currentSize.padding,
            background: 'var(--muted)',
            border: '1px solid var(--border)',
            borderLeft: 'none',
            borderTopRightRadius: 'var(--radius-md)',
            borderBottomRightRadius: 'var(--radius-md)',
          }}
        >
          {rightElement}
        </div>
      )}
    </div>
  );
}
