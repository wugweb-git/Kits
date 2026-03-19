import React from 'react';
import svgPaths2sy3 from '../../../imports/svg-2sy3hewp8j';
import svgPaths1zih from '../../../imports/svg-1zih1s7a43';
import svgPaths9z8e from '../../../imports/svg-9z8efy4yir';
import svgPathsa85v from '../../../imports/svg-a85vuqadrq';

// Complete Icon Library extracted from Figma component set
// All icons follow the 8-point grid system and use design tokens

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// === ARROWS & NAVIGATION ICONS ===

export function ArrowRightIcon({ size = 24, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths9z8e.p34a7f440} fill={color} />
      </svg>
    </div>
  );
}

export function ArrowLeftIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.p129dfe00} fill={color} />
      </svg>
    </div>
  );
}

export function ChevronDownIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d="M4 6L8 10L12 6" stroke={color} strokeLinecap="round" strokeWidth="1.33333" />
      </svg>
    </div>
  );
}

export function ChevronUpIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d="M12 10L8 6L4 10" stroke={color} strokeLinecap="round" strokeWidth="1.33333" />
      </svg>
    </div>
  );
}

export function ChevronLeftIcon({ size = 24, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d="M15 6L9 12L15 18" stroke={color} strokeLinecap="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function ArrowUpIcon({ size = 20, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <path d={svgPaths1zih.p17c46900} fill={color} />
      </svg>
    </div>
  );
}

// === INTERFACE ICONS ===

export function InfoIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths2sy3.p9026100} fill={color} />
      </svg>
    </div>
  );
}

export function HelpIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths2sy3.p59e23c0} fill={color} />
      </svg>
    </div>
  );
}

export function SearchIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths2sy3.p25599100} stroke={color} strokeLinecap="round" strokeWidth="1.33333" />
      </svg>
    </div>
  );
}

export function SearchMagnifierIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.p23cbd540} stroke={color} strokeLinecap="round" strokeWidth="1.33333" />
      </svg>
    </div>
  );
}

export function SearchZoomIcon({ size = 24, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPathsa85v.p8fca100} stroke={color} strokeLinecap="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function CloseIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.p21d6ac00} stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function MenuIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.p3855dc00} fill={color} />
      </svg>
    </div>
  );
}

export function MoreIcon({ size = 24, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths1zih.p349e1af0} fill={color} />
      </svg>
    </div>
  );
}

export function HomeIcon({ size = 18, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 19">
        <path clipRule="evenodd" d={svgPathsa85v.p14abea00} fill={color} fillRule="evenodd" />
      </svg>
    </div>
  );
}

// === MEDIA & CONTENT ICONS ===

export function MailIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g>
          <path d={svgPathsa85v.p17070980} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPathsa85v.p120c8200} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

export function MailOpenIcon({ size = 20, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <path d={svgPathsa85v.p187a01c0} fill={color} />
      </svg>
    </div>
  );
}

export function MailSendIcon({ size = 24, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPathsa85v.p1d840a00} fill={color} />
      </svg>
    </div>
  );
}

export function StarIcon({ size = 26, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <path d={svgPathsa85v.p25805ec0} fill={color} />
      </svg>
    </div>
  );
}

export function PlayPauseIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.p24caba00} fill={color} />
      </svg>
    </div>
  );
}

// === ACTIONS & EDITING ICONS ===

export function EditIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.p1eac0e00} fill={color} />
      </svg>
    </div>
  );
}

export function TrashIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.p109c03f0} fill={color} />
      </svg>
    </div>
  );
}

export function LockIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.pd23a300} fill={color} />
      </svg>
    </div>
  );
}

// === SYSTEM & UTILITY ICONS ===

export function ExpandIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 15">
        <path d={svgPaths1zih.p21f94e80} fill={color} />
      </svg>
    </div>
  );
}

export function QRCodeIcon({ size = 14, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 14">
        <path d={svgPaths1zih.p71c2d80} fill={color} />
      </svg>
    </div>
  );
}

export function MinusIcon({ size = 17, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 9">
        <path d={svgPaths1zih.p2d9f0780} fill={color} />
      </svg>
    </div>
  );
}

export function UnderlineIcon({ size = 18, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 15">
        <path d={svgPathsa85v.p86a5400} fill={color} />
      </svg>
    </div>
  );
}

export function LoadingSpinnerIcon({ size = 24, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPathsa85v.p35f4ca00} fill={color} />
      </svg>
    </div>
  );
}

export function CircleIcon({ size = 24, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPathsa85v.p1f13b600} fill={color} />
      </svg>
    </div>
  );
}

export function ClockIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths1zih.p1a991e80} fill={color} />
      </svg>
    </div>
  );
}

export function ScanIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.p8e0d170} fill={color} />
      </svg>
    </div>
  );
}

export function ExpandFullscreenIcon({ size = 16, color = 'currentColor', className, style }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size, color, ...style }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPathsa85v.p19079300} fill={color} />
      </svg>
    </div>
  );
}

// Complete icon library catalog
export const completeIconLibrary = [
  // Arrows & Navigation
  { name: 'arrow-right', component: ArrowRightIcon, category: 'Arrows & Navigation', size: 24, description: 'Right arrow for navigation' },
  { name: 'arrow-left', component: ArrowLeftIcon, category: 'Arrows & Navigation', size: 16, description: 'Left arrow for back navigation' },
  { name: 'arrow-up', component: ArrowUpIcon, category: 'Arrows & Navigation', size: 20, description: 'Up arrow for scroll to top' },
  { name: 'chevron-down', component: ChevronDownIcon, category: 'Arrows & Navigation', size: 16, description: 'Chevron down for dropdowns' },
  { name: 'chevron-up', component: ChevronUpIcon, category: 'Arrows & Navigation', size: 16, description: 'Chevron up for collapse' },
  { name: 'chevron-left', component: ChevronLeftIcon, category: 'Arrows & Navigation', size: 24, description: 'Chevron left for navigation' },
  
  // Interface
  { name: 'info', component: InfoIcon, category: 'Interface', size: 16, description: 'Information indicator' },
  { name: 'help', component: HelpIcon, category: 'Interface', size: 16, description: 'Help and support' },
  { name: 'search', component: SearchIcon, category: 'Interface', size: 16, description: 'Search icon' },
  { name: 'search-magnifier', component: SearchMagnifierIcon, category: 'Interface', size: 16, description: 'Search with magnifying glass' },
  { name: 'search-zoom', component: SearchZoomIcon, category: 'Interface', size: 24, description: 'Zoom search' },
  { name: 'close', component: CloseIcon, category: 'Interface', size: 16, description: 'Close/dismiss icon' },
  { name: 'menu', component: MenuIcon, category: 'Interface', size: 16, description: 'Menu hamburger' },
  { name: 'more', component: MoreIcon, category: 'Interface', size: 24, description: 'More options (3 dots)' },
  { name: 'home', component: HomeIcon, category: 'Interface', size: 18, description: 'Home icon' },
  
  // Media & Content
  { name: 'mail', component: MailIcon, category: 'Media & Content', size: 16, description: 'Email/message' },
  { name: 'mail-open', component: MailOpenIcon, category: 'Media & Content', size: 20, description: 'Open email' },
  { name: 'mail-send', component: MailSendIcon, category: 'Media & Content', size: 24, description: 'Send email' },
  { name: 'star', component: StarIcon, category: 'Media & Content', size: 26, description: 'Star/favorite' },
  { name: 'play-pause', component: PlayPauseIcon, category: 'Media & Content', size: 16, description: 'Play/pause control' },
  
  // Actions & Editing
  { name: 'edit', component: EditIcon, category: 'Actions & Editing', size: 16, description: 'Edit/pencil' },
  { name: 'trash', component: TrashIcon, category: 'Actions & Editing', size: 16, description: 'Delete/trash' },
  { name: 'lock', component: LockIcon, category: 'Actions & Editing', size: 16, description: 'Lock/security' },
  
  // System & Utility
  { name: 'expand', component: ExpandIcon, category: 'System & Utility', size: 16, description: 'Expand view' },
  { name: 'expand-fullscreen', component: ExpandFullscreenIcon, category: 'System & Utility', size: 16, description: 'Fullscreen toggle' },
  { name: 'qr-code', component: QRCodeIcon, category: 'System & Utility', size: 14, description: 'QR code scanner' },
  { name: 'minus', component: MinusIcon, category: 'System & Utility', size: 17, description: 'Minus/subtract' },
  { name: 'underline', component: UnderlineIcon, category: 'System & Utility', size: 18, description: 'Underline decorator' },
  { name: 'loading', component: LoadingSpinnerIcon, category: 'System & Utility', size: 24, description: 'Loading spinner' },
  { name: 'circle', component: CircleIcon, category: 'System & Utility', size: 24, description: 'Circle shape' },
  { name: 'clock', component: ClockIcon, category: 'System & Utility', size: 16, description: 'Time/clock' },
  { name: 'scan', component: ScanIcon, category: 'System & Utility', size: 16, description: 'Scan/camera' },
];

// Get icons by category
export function getIconsByCategory(category: string) {
  return completeIconLibrary.filter(icon => icon.category === category);
}

// Get all categories
export function getAllCategories() {
  return Array.from(new Set(completeIconLibrary.map(icon => icon.category)));
}

// Search icons
export function searchIcons(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return completeIconLibrary.filter(icon =>
    icon.name.toLowerCase().includes(lowercaseQuery) ||
    icon.description.toLowerCase().includes(lowercaseQuery) ||
    icon.category.toLowerCase().includes(lowercaseQuery)
  );
}
