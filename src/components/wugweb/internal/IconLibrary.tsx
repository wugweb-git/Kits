import React from 'react';
import svgPaths from '../../../imports/svg-2sy3hewp8j';

// Icon components exported from Figma component set
// All icons are 16x16 or 32x32, scalable via props

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Arrow Right Icon (32x32 base)
export function ArrowRightIcon({ size = 24, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path d={svgPaths.p1da3c100} fill={color} />
      </svg>
    </div>
  );
}

// Info Icon (16x16 base)
export function InfoIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths.p9026100} fill={color} />
      </svg>
    </div>
  );
}

// Help Icon (16x16 base)
export function HelpIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths.p59e23c0} fill={color} />
      </svg>
    </div>
  );
}

// Chevron Up Icon (16x16 base)
export function ChevronUpIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d="M12 10L8 6L4 10" stroke={color} strokeLinecap="round" strokeWidth="1.33333" />
      </svg>
    </div>
  );
}

// Arrow Icon (16x16 base)
export function ArrowIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths.p3304b700} fill={color} />
      </svg>
    </div>
  );
}

// Search Icon (16x16 base)
export function SearchIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths.p25599100} stroke={color} strokeLinecap="round" strokeWidth="1.33333" />
      </svg>
    </div>
  );
}

// Icon library for documentation
export const iconLibrary = [
  { name: 'arrow-right', component: ArrowRightIcon, category: 'Arrows', size: 32 },
  { name: 'arrow', component: ArrowIcon, category: 'Arrows', size: 16 },
  { name: 'chevron-up', component: ChevronUpIcon, category: 'Arrows', size: 16 },
  { name: 'info', component: InfoIcon, category: 'Interface', size: 16 },
  { name: 'help', component: HelpIcon, category: 'Interface', size: 16 },
  { name: 'search', component: SearchIcon, category: 'Interface', size: 16 },
];
