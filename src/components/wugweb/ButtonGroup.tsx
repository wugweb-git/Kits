import React from 'react';

export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ButtonGroup Component
 * 
 * Groups multiple buttons together with connected borders.
 * Uses CSS variables from /styles/globals.css for theming.
 * 
 * @example
 * <ButtonGroup>
 *   <Button>First</Button>
 *   <Button>Second</Button>
 *   <Button>Third</Button>
 * </ButtonGroup>
 */
export function ButtonGroup({
  children,
  orientation = 'horizontal',
  className = '',
  style = {},
}: ButtonGroupProps) {
  const isHorizontal = orientation === 'horizontal';

  // Clone children and add styling
  const buttons = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    const childCount = React.Children.count(children);
    const isFirst = index === 0;
    const isLast = index === childCount - 1;

    const buttonStyle: React.CSSProperties = {
      margin: 0,
      ...(isHorizontal
        ? {
            borderTopRightRadius: isLast ? undefined : 0,
            borderBottomRightRadius: isLast ? undefined : 0,
            borderTopLeftRadius: isFirst ? undefined : 0,
            borderBottomLeftRadius: isFirst ? undefined : 0,
            borderRightWidth: isLast ? undefined : 0,
          }
        : {
            borderTopLeftRadius: isFirst ? undefined : 0,
            borderTopRightRadius: isFirst ? undefined : 0,
            borderBottomLeftRadius: isLast ? undefined : 0,
            borderBottomRightRadius: isLast ? undefined : 0,
            borderBottomWidth: isLast ? undefined : 0,
          }),
    };

    return React.cloneElement(child, {
      style: {
        ...buttonStyle,
        ...(child.props.style || {}),
      },
    } as any);
  });

  return (
    <div
      className={className}
      role="group"
      style={{
        display: 'inline-flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        ...style,
      }}
    >
      {buttons}
    </div>
  );
}
