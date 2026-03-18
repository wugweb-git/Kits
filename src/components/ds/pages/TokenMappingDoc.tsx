import React from 'react';
import { Copy, Check, Search, Filter, ChevronDown } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard } from '../PageWrapper';
import { Badge } from '../../wugweb/Badge';

const F = 'Inter Tight, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/* ─── Full token → scope → usage → output map ──────────────── */
type TokenType = 'color' | 'spacing' | 'size' | 'radius' | 'typography' | 'shadow' | 'gradient' | 'border' | 'opacity' | 'motion' | 'z-index' | 'breakpoint' | 'icon' | 'asset';
type TokenLevel = 'global' | 'alias' | 'semantic' | 'component';

interface TokenMapRow {
  tokenType: TokenType;
  tokenName: string;
  level: TokenLevel;
  figmaScope: string;
  uiUsage: string;
  cssOutput: string;
  tailwindClass: string;
  exampleValue: string;
  componentExamples: string[];
}

const TOKEN_MAP: TokenMapRow[] = [
  /* ── COLOR ── */
  { tokenType: 'color', tokenName: '--accent', level: 'semantic', figmaScope: 'Fill', uiUsage: 'CTAs, active states, brand highlights', cssOutput: 'background-color / color', tailwindClass: 'bg-accent / text-accent', exampleValue: 'rgba(255,190,26,1)', componentExamples: ['Button.primary', 'Badge.accent', 'Sidebar.active'] },
  { tokenType: 'color', tokenName: '--foreground', level: 'semantic', figmaScope: 'Text', uiUsage: 'Primary body text, headings', cssOutput: 'color', tailwindClass: 'text-foreground', exampleValue: 'rgba(255,255,255,1)', componentExamples: ['Heading', 'Body', 'Label'] },
  { tokenType: 'color', tokenName: '--muted-foreground', level: 'semantic', figmaScope: 'Text', uiUsage: 'Secondary text, placeholders, captions', cssOutput: 'color', tailwindClass: 'text-muted-foreground', exampleValue: 'rgba(161,161,161,1)', componentExamples: ['Caption', 'Placeholder', 'Helper text'] },
  { tokenType: 'color', tokenName: '--background', level: 'semantic', figmaScope: 'Fill', uiUsage: 'Page canvas background', cssOutput: 'background-color', tailwindClass: 'bg-background', exampleValue: 'rgba(18,18,18,1)', componentExamples: ['<body>', 'PageWrapper', 'Shell'] },
  { tokenType: 'color', tokenName: '--card', level: 'semantic', figmaScope: 'Fill', uiUsage: 'Raised surface: cards, panels, modals', cssOutput: 'background-color', tailwindClass: 'bg-card', exampleValue: 'rgba(28,28,28,1)', componentExamples: ['Card', 'Dialog', 'Sidebar', 'Dropdown'] },
  { tokenType: 'color', tokenName: '--muted', level: 'semantic', figmaScope: 'Fill', uiUsage: 'Hover states, sunken areas, table headers', cssOutput: 'background-color', tailwindClass: 'bg-muted', exampleValue: 'rgba(38,38,38,1)', componentExamples: ['Button.ghost hover', 'Input bg', 'Table header'] },
  { tokenType: 'color', tokenName: '--border', level: 'semantic', figmaScope: 'Stroke', uiUsage: 'Dividers, input strokes, card edges', cssOutput: 'border-color', tailwindClass: 'border-border', exampleValue: 'rgba(43,43,43,1)', componentExamples: ['Input', 'Card edge', 'Divider'] },
  { tokenType: 'color', tokenName: '--destructive', level: 'semantic', figmaScope: 'Fill / Text', uiUsage: 'Error states, delete actions, alerts', cssOutput: 'color / background-color', tailwindClass: 'text-destructive / bg-destructive', exampleValue: 'rgba(239,67,67,1)', componentExamples: ['Button.destructive', 'Alert.error', 'FormError'] },
  { tokenType: 'color', tokenName: '--success', level: 'semantic', figmaScope: 'Fill / Text', uiUsage: 'Positive feedback, complete states', cssOutput: 'color / background-color', tailwindClass: 'text-success', exampleValue: 'rgba(34,197,94,1)', componentExamples: ['Alert.success', 'Badge.success', 'Toaster'] },
  { tokenType: 'color', tokenName: '--warning', level: 'semantic', figmaScope: 'Fill / Text', uiUsage: 'Caution, pending, intermediate states', cssOutput: 'color / background-color', tailwindClass: 'text-warning', exampleValue: 'rgba(234,179,8,1)', componentExamples: ['Badge.warning', 'Alert.warning'] },
  { tokenType: 'color', tokenName: '--info', level: 'semantic', figmaScope: 'Fill / Text', uiUsage: 'Informational, links, help states', cssOutput: 'color / background-color', tailwindClass: 'text-info', exampleValue: 'rgba(59,130,246,1)', componentExamples: ['Alert.info', 'Badge.info', 'Link'] },
  { tokenType: 'color', tokenName: '--accent-subtle', level: 'semantic', figmaScope: 'Fill', uiUsage: 'Tinted accent background (pills, highlights)', cssOutput: 'background-color', tailwindClass: '—', exampleValue: 'rgba(255,190,26,0.10)', componentExamples: ['Tag', 'Chip', 'Pill badge', 'Sidebar active bg'] },
  { tokenType: 'color', tokenName: '--input-border-focus', level: 'semantic', figmaScope: 'Stroke', uiUsage: 'Input border on focus state', cssOutput: 'border-color', tailwindClass: '—', exampleValue: 'rgba(255,190,26,1)', componentExamples: ['Input:focus', 'Textarea:focus', 'Select:focus'] },
  { tokenType: 'color', tokenName: '--overlay-background', level: 'semantic', figmaScope: 'Fill', uiUsage: 'Modal backdrop, drawer overlay', cssOutput: 'background-color', tailwindClass: '—', exampleValue: 'rgba(0,0,0,0.60)', componentExamples: ['Dialog backdrop', 'Drawer overlay', 'Menu overlay'] },

  /* ── SPACING ── */
  { tokenType: 'spacing', tokenName: '--spacing-1', level: 'semantic', figmaScope: 'Gap / Padding', uiUsage: 'Minimum gap: icon+label, badge padding', cssOutput: 'gap / padding / margin', tailwindClass: 'gap-1 / p-1', exampleValue: '4px', componentExamples: ['Badge gap', 'Icon+text gap'] },
  { tokenType: 'spacing', tokenName: '--spacing-2', level: 'semantic', figmaScope: 'Gap / Padding', uiUsage: 'Tight inline spacing, chip gap', cssOutput: 'gap / padding', tailwindClass: 'gap-2 / p-2', exampleValue: '8px', componentExamples: ['Tag padding', 'Button icon gap', 'Inline elements'] },
  { tokenType: 'spacing', tokenName: '--spacing-3', level: 'semantic', figmaScope: 'Gap / Padding', uiUsage: 'Input padding X, menu item gap', cssOutput: 'padding', tailwindClass: 'gap-3 / p-3', exampleValue: '12px', componentExamples: ['Input padding-x', 'MenuItem gap', 'Tooltip padding'] },
  { tokenType: 'spacing', tokenName: '--spacing-4', level: 'semantic', figmaScope: 'Gap / Padding', uiUsage: 'Base component padding, card gap', cssOutput: 'padding', tailwindClass: 'gap-4 / p-4', exampleValue: '16px', componentExamples: ['Card body gap', 'Section gap sm'] },
  { tokenType: 'spacing', tokenName: '--spacing-5', level: 'semantic', figmaScope: 'Padding', uiUsage: 'Button padding-x MD, card padding tight', cssOutput: 'padding', tailwindClass: 'p-5', exampleValue: '20px', componentExamples: ['Button.md padding-x', 'ListItem padding'] },
  { tokenType: 'spacing', tokenName: '--spacing-6', level: 'semantic', figmaScope: 'Padding', uiUsage: 'Card padding, dialog padding, section gap', cssOutput: 'padding', tailwindClass: 'p-6', exampleValue: '24px', componentExamples: ['Card padding', 'Dialog padding', 'Section sub-gap'] },
  { tokenType: 'spacing', tokenName: '--spacing-8', level: 'semantic', figmaScope: 'Margin', uiUsage: 'Section dividers, large component gaps', cssOutput: 'margin / gap', tailwindClass: 'gap-8', exampleValue: '32px', componentExamples: ['Section gap', 'PageSection margin'] },
  { tokenType: 'spacing', tokenName: '--spacing-12', level: 'semantic', figmaScope: 'Margin', uiUsage: 'Page section spacing (mobile)', cssOutput: 'margin', tailwindClass: 'mb-12', exampleValue: '48px', componentExamples: ['PageHeader margin', 'Section spacing tablet'] },
  { tokenType: 'spacing', tokenName: '--space-section-lg', level: 'semantic', figmaScope: 'Padding', uiUsage: 'Section vertical spacing desktop', cssOutput: 'padding-top / padding-bottom', tailwindClass: '.section-spacing', exampleValue: '64px', componentExamples: ['Hero section', 'Feature section', 'Pricing section'] },

  /* ── SIZE ── */
  { tokenType: 'size', tokenName: '--size-icon-xs', level: 'semantic', figmaScope: 'Width / Height', uiUsage: 'Smallest icon (16px) — meta, captions', cssOutput: 'width / height', tailwindClass: '.icon-xs', exampleValue: '16px', componentExamples: ['Inline badge icon', 'Caption icon'] },
  { tokenType: 'size', tokenName: '--size-icon-sm', level: 'semantic', figmaScope: 'Width / Height', uiUsage: 'Small icon (20px) — buttons, inputs', cssOutput: 'width / height', tailwindClass: '.icon-sm', exampleValue: '20px', componentExamples: ['Input prefix icon', 'Button sm icon'] },
  { tokenType: 'size', tokenName: '--size-icon-md', level: 'semantic', figmaScope: 'Width / Height', uiUsage: 'Default icon (24px) — nav, cards', cssOutput: 'width / height', tailwindClass: '.icon-md', exampleValue: '24px', componentExamples: ['Nav icon', 'Card icon', 'Default lucide'] },
  { tokenType: 'size', tokenName: '--size-icon-lg', level: 'semantic', figmaScope: 'Width / Height', uiUsage: 'Large icon (32px) — empty states, features', cssOutput: 'width / height', tailwindClass: '.icon-lg', exampleValue: '32px', componentExamples: ['Feature icon', 'EmptyState icon'] },
  { tokenType: 'size', tokenName: '--size-touch-min', level: 'semantic', figmaScope: 'Width / Height', uiUsage: 'WCAG minimum touch target (44px)', cssOutput: 'min-width / min-height', tailwindClass: '—', exampleValue: '44px', componentExamples: ['Button', 'IconButton', 'MenuTrigger'] },
  { tokenType: 'size', tokenName: '--size-container-xl', level: 'semantic', figmaScope: 'Frame width', uiUsage: 'Page max-width at desktop', cssOutput: 'max-width', tailwindClass: '—', exampleValue: '1280px', componentExamples: ['PageWrapper', 'SectionContainer'] },

  /* ── RADIUS ── */
  { tokenType: 'radius', tokenName: '--radius-sm', level: 'semantic', figmaScope: 'Corner radius', uiUsage: 'Small UI: code pills, tooltips, kbd', cssOutput: 'border-radius', tailwindClass: 'rounded-sm', exampleValue: '4px', componentExamples: ['Tooltip', 'Kbd', 'Code pill', 'Badge sm'] },
  { tokenType: 'radius', tokenName: '--radius-md', level: 'semantic', figmaScope: 'Corner radius', uiUsage: 'Default UI: buttons, inputs, menu items', cssOutput: 'border-radius', tailwindClass: 'rounded-md', exampleValue: '8px', componentExamples: ['Button', 'Input', 'Select', 'Dropdown item'] },
  { tokenType: 'radius', tokenName: '--radius-lg', level: 'semantic', figmaScope: 'Corner radius', uiUsage: 'Cards, panels, dialogs', cssOutput: 'border-radius', tailwindClass: 'rounded-lg', exampleValue: '12px', componentExamples: ['Card', 'Dialog', 'Popover', 'Drawer'] },
  { tokenType: 'radius', tokenName: '--radius-full', level: 'semantic', figmaScope: 'Corner radius', uiUsage: 'Pills, avatars, circular buttons', cssOutput: 'border-radius', tailwindClass: 'rounded-full', exampleValue: '9999px', componentExamples: ['Badge', 'Tag', 'Avatar', 'Chip', 'Toggle'] },

  /* ── TYPOGRAPHY ── */
  { tokenType: 'typography', tokenName: '--fluid-display', level: 'semantic', figmaScope: 'Text style', uiUsage: 'Hero headlines, splash screens', cssOutput: 'font-size (clamp)', tailwindClass: '.type-display', exampleValue: 'clamp(2.5rem,5.5vw+0.5rem,5rem)', componentExamples: ['HeroSection', 'LandingPage H1'] },
  { tokenType: 'typography', tokenName: '--fluid-h1', level: 'semantic', figmaScope: 'Text style', uiUsage: 'Page-level headings, primary titles', cssOutput: 'font-size (clamp)', tailwindClass: '.type-h1', exampleValue: 'clamp(2rem,4vw+0.5rem,3rem)', componentExamples: ['PageHeader', 'Modal title'] },
  { tokenType: 'typography', tokenName: '--ts-h2-size', level: 'semantic', figmaScope: 'Text style', uiUsage: 'Section headings', cssOutput: 'font-size', tailwindClass: '—', exampleValue: '2.25rem / 36px', componentExamples: ['PageSection title', 'Feature heading'] },
  { tokenType: 'typography', tokenName: '--ts-h4-size', level: 'semantic', figmaScope: 'Text style', uiUsage: 'Card titles, UI labels', cssOutput: 'font-size', tailwindClass: '—', exampleValue: '1.25rem / 20px', componentExamples: ['Card title', 'Sidebar group', 'Table heading'] },
  { tokenType: 'typography', tokenName: '--ts-body-md-size', level: 'semantic', figmaScope: 'Text style', uiUsage: 'Default paragraph text', cssOutput: 'font-size', tailwindClass: '—', exampleValue: '1rem / 16px', componentExamples: ['Body copy', 'Description text'] },
  { tokenType: 'typography', tokenName: '--ts-label-md-size', level: 'semantic', figmaScope: 'Text style', uiUsage: 'Form labels, UI labels, metadata', cssOutput: 'font-size', tailwindClass: '—', exampleValue: '0.875rem / 14px', componentExamples: ['FormLabel', 'Input label', 'MenuItem'] },
  { tokenType: 'typography', tokenName: '--ts-caption-size', level: 'semantic', figmaScope: 'Text style', uiUsage: 'Captions, timestamps, helper text', cssOutput: 'font-size', tailwindClass: '—', exampleValue: '0.75rem / 12px', componentExamples: ['Badge', 'Timestamp', 'Tooltip text'] },

  /* ── SHADOW ── */
  { tokenType: 'shadow', tokenName: '--elevation-1', level: 'semantic', figmaScope: 'Effects', uiUsage: 'Subtle card lift, resting state', cssOutput: 'box-shadow', tailwindClass: '.elevation-1', exampleValue: '0 1px 2px rgba(0,0,0,0.40)', componentExamples: ['Card resting', 'Chip'] },
  { tokenType: 'shadow', tokenName: '--elevation-3', level: 'semantic', figmaScope: 'Effects', uiUsage: 'Dropdown, popover, tooltip', cssOutput: 'box-shadow', tailwindClass: '.elevation-3', exampleValue: '0 4px 12px rgba(0,0,0,0.50)', componentExamples: ['Dropdown', 'Popover', 'Tooltip'] },
  { tokenType: 'shadow', tokenName: '--elevation-4', level: 'semantic', figmaScope: 'Effects', uiUsage: 'Dialog, drawer, modal', cssOutput: 'box-shadow', tailwindClass: '.elevation-4', exampleValue: '0 8px 24px rgba(0,0,0,0.55)', componentExamples: ['Dialog', 'Drawer', 'BottomSheet'] },
  { tokenType: 'shadow', tokenName: '--shadow-raised', level: 'semantic', figmaScope: 'Effects', uiUsage: 'Hover elevation for interactive cards', cssOutput: 'box-shadow', tailwindClass: '—', exampleValue: '0 4px 12px rgba(0,0,0,0.50)', componentExamples: ['Card:hover', 'Button:active'] },

  /* ── GRADIENT ── */
  { tokenType: 'gradient', tokenName: '--gradient-brand', level: 'semantic', figmaScope: 'Fill (gradient)', uiUsage: 'Brand hero backgrounds, CTA buttons', cssOutput: 'background', tailwindClass: '.gradient-brand', exampleValue: 'linear-gradient(135deg, #FFBE1A, #FFE278)', componentExamples: ['HeroSection bg', 'CTAButton', 'Feature accent'] },
  { tokenType: 'gradient', tokenName: '--gradient-brand-subtle', level: 'semantic', figmaScope: 'Fill (gradient)', uiUsage: 'Tinted section backgrounds, cards', cssOutput: 'background', tailwindClass: '.gradient-brand-subtle', exampleValue: 'linear-gradient(135deg, rgba(255,190,26,.15), rgba(255,190,26,.03))', componentExamples: ['Feature section bg', 'Highlight card'] },
  { tokenType: 'gradient', tokenName: '--gradient-overlay', level: 'semantic', figmaScope: 'Fill (gradient)', uiUsage: 'Image overlays for text legibility', cssOutput: 'background', tailwindClass: '.gradient-overlay', exampleValue: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.85))', componentExamples: ['HeroImage overlay', 'Card image overlay'] },

  /* ── BORDER ── */
  { tokenType: 'border', tokenName: '--border-default', level: 'semantic', figmaScope: 'Stroke', uiUsage: 'Standard element borders', cssOutput: 'border', tailwindClass: '—', exampleValue: '1px solid var(--border)', componentExamples: ['Card', 'Input', 'Divider', 'Table row'] },
  { tokenType: 'border', tokenName: '--border-accent', level: 'semantic', figmaScope: 'Stroke', uiUsage: 'Highlighted / selected elements', cssOutput: 'border', tailwindClass: '—', exampleValue: '1px solid var(--accent)', componentExamples: ['Input:focus', 'Card:selected', 'Active nav'] },
  { tokenType: 'border', tokenName: '--border-focus', level: 'semantic', figmaScope: 'Stroke', uiUsage: 'Keyboard focus indicator border', cssOutput: 'border', tailwindClass: '—', exampleValue: '2px solid var(--accent)', componentExamples: ['Input:focus', 'Button:focus'] },

  /* ── OPACITY ── */
  { tokenType: 'opacity', tokenName: '--opacity-disabled', level: 'semantic', figmaScope: 'Opacity', uiUsage: 'Disabled UI elements', cssOutput: 'opacity', tailwindClass: '—', exampleValue: '0.4', componentExamples: ['Button:disabled', 'Input:disabled', 'Select:disabled'] },
  { tokenType: 'opacity', tokenName: '--opacity-placeholder', level: 'semantic', figmaScope: 'Opacity', uiUsage: 'Placeholder text, ghost content', cssOutput: 'opacity', tailwindClass: '—', exampleValue: '0.35', componentExamples: ['Input placeholder', 'Skeleton text'] },
  { tokenType: 'opacity', tokenName: '--opacity-ghost', level: 'semantic', figmaScope: 'Opacity', uiUsage: 'Watermark, extremely subtle elements', cssOutput: 'opacity', tailwindClass: '—', exampleValue: '0.15', componentExamples: ['Watermark', 'Ghost button hover overlay'] },

  /* ── MOTION ── */
  { tokenType: 'motion', tokenName: '--motion-duration-fast', level: 'semantic', figmaScope: '❌ code only', uiUsage: 'Button hover, icon swaps, micro-interactions', cssOutput: 'transition-duration', tailwindClass: '—', exampleValue: '80ms', componentExamples: ['Button:hover', 'Icon swap', 'Badge appear'] },
  { tokenType: 'motion', tokenName: '--motion-duration-slow', level: 'semantic', figmaScope: '❌ code only', uiUsage: 'Dropdown open, tooltip appear, overlay fade', cssOutput: 'transition-duration', tailwindClass: '—', exampleValue: '200ms', componentExamples: ['Dropdown', 'Tooltip', 'Overlay fade'] },
  { tokenType: 'motion', tokenName: '--motion-duration-long', level: 'semantic', figmaScope: '❌ code only', uiUsage: 'Modal enter, drawer slide, page transition', cssOutput: 'transition-duration', tailwindClass: '—', exampleValue: '320ms', componentExamples: ['Modal open', 'Drawer slide', 'Page transition'] },
  { tokenType: 'motion', tokenName: '--motion-easing-standard', level: 'semantic', figmaScope: '❌ code only', uiUsage: 'General transitions (enter + exit)', cssOutput: 'transition-timing-function', tailwindClass: '—', exampleValue: 'cubic-bezier(0.4,0,0.2,1)', componentExamples: ['Most transitions'] },
  { tokenType: 'motion', tokenName: '--motion-easing-emphasized', level: 'semantic', figmaScope: '❌ code only', uiUsage: 'Modals, drawers entering from off-screen', cssOutput: 'transition-timing-function', tailwindClass: '—', exampleValue: 'cubic-bezier(0.2,0,0,1)', componentExamples: ['Modal', 'Drawer', 'BottomSheet'] },

  /* ── Z-INDEX ── */
  { tokenType: 'z-index', tokenName: '--z-index-dropdown', level: 'semantic', figmaScope: '❌ code only', uiUsage: 'Dropdown menus, autocomplete lists', cssOutput: 'z-index', tailwindClass: '—', exampleValue: '100', componentExamples: ['Dropdown', 'Combobox', 'Select'] },
  { tokenType: 'z-index', tokenName: '--z-index-modal', level: 'semantic', figmaScope: '❌ code only', uiUsage: 'Dialogs, modals, drawers', cssOutput: 'z-index', tailwindClass: '—', exampleValue: '400', componentExamples: ['Dialog', 'Drawer', 'AlertDialog'] },
  { tokenType: 'z-index', tokenName: '--z-index-tooltip', level: 'semantic', figmaScope: '❌ code only', uiUsage: 'Tooltips — always on top of overlays', cssOutput: 'z-index', tailwindClass: '—', exampleValue: '600', componentExamples: ['Tooltip'] },
  { tokenType: 'z-index', tokenName: '--z-index-toast', level: 'semantic', figmaScope: '❌ code only', uiUsage: 'Toast notifications', cssOutput: 'z-index', tailwindClass: '—', exampleValue: '700', componentExamples: ['Toaster'] },

  /* ── BREAKPOINTS ── */
  { tokenType: 'breakpoint', tokenName: '--breakpoint-md', level: 'global', figmaScope: '❌ code only', uiUsage: 'Tablet layout changes (768px)', cssOutput: '@media (min-width: 768px)', tailwindClass: 'md:', exampleValue: '768px', componentExamples: ['Grid layout', 'Sidebar show/hide', 'Nav mobile/desktop'] },
  { tokenType: 'breakpoint', tokenName: '--breakpoint-lg', level: 'global', figmaScope: '❌ code only', uiUsage: 'Desktop layout (1024px)', cssOutput: '@media (min-width: 1024px)', tailwindClass: 'lg:', exampleValue: '1024px', componentExamples: ['Sidebar permanently visible', 'Multi-column grid'] },

  /* ── ICON / ASSET ── */
  { tokenType: 'icon', tokenName: '--size-icon-md', level: 'semantic', figmaScope: 'Width / Height (SVG)', uiUsage: 'Default lucide icon size in components', cssOutput: 'width / height on SVG', tailwindClass: '.icon-md', exampleValue: '24px', componentExamples: ['NavIcon', 'ButtonIcon', 'CardIcon'] },
  { tokenType: 'asset', tokenName: 'CDN / figma:asset', level: 'global', figmaScope: 'Image fill', uiUsage: 'Logos, hero images, illustrations', cssOutput: 'src / background-image', tailwindClass: '—', exampleValue: 'https://wugweb.online/assets/…', componentExamples: ['Logo', 'HeroImage', 'TeamCard avatar'] },
];

const TYPE_COLORS: Record<TokenType, string> = {
  color: 'var(--accent)',
  spacing: '#3B82F6',
  size: '#10B981',
  radius: '#8B5CF6',
  typography: '#F59E0B',
  shadow: '#6366F1',
  gradient: '#EC4899',
  border: '#14B8A6',
  opacity: '#78716C',
  motion: '#EF4444',
  'z-index': '#84CC16',
  breakpoint: '#06B6D4',
  icon: '#A78BFA',
  asset: '#FB923C',
};

const LEVEL_COLORS: Record<TokenLevel, string> = {
  global: 'var(--muted-foreground)',
  alias: '#3B82F6',
  semantic: 'var(--accent)',
  component: '#10B981',
};

const ALL_TYPES = Array.from(new Set(TOKEN_MAP.map(r => r.tokenType)));
const ALL_LEVELS: TokenLevel[] = ['global', 'alias', 'semantic', 'component'];

function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: MONO, fontSize: '11px', color: copied ? 'var(--success)' : 'var(--accent)', background: 'var(--muted)', border: 'var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '2px 7px', cursor: 'pointer', whiteSpace: 'nowrap' }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />} {text}
    </button>
  );
}

export function TokenMappingDoc() {
  const [search, setSearch] = React.useState('');
  const [filterType, setFilterType] = React.useState<TokenType | 'all'>('all');
  const [filterLevel, setFilterLevel] = React.useState<TokenLevel | 'all'>('all');

  const filtered = TOKEN_MAP.filter(row => {
    const matchSearch = search === '' || [row.tokenName, row.uiUsage, row.cssOutput, ...row.componentExamples].join(' ').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || row.tokenType === filterType;
    const matchLevel = filterLevel === 'all' || row.level === filterLevel;
    return matchSearch && matchType && matchLevel;
  });

  const grouped = filtered.reduce<Record<string, TokenMapRow[]>>((acc, row) => {
    if (!acc[row.tokenType]) acc[row.tokenType] = [];
    acc[row.tokenType].push(row);
    return acc;
  }, {});

  return (
    <PageWrapper maxWidth="1400px">
      <PageHeader
        badge="Token Mapping"
        title="Token → Scope → Output Map"
        description="The complete contract: every token type, its Figma scope, UI usage, CSS output, Tailwind class, and component examples. This is the enforced bridge between design and code."
      />

      {/* The missing piece callout */}
      <div style={{ background: 'var(--card)', border: 'var(--border-accent)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', marginBottom: 'var(--spacing-10)', display: 'flex', gap: 'var(--spacing-4)' }}>
        <div style={{ width: 4, background: 'var(--accent)', borderRadius: 'var(--radius-full)', flexShrink: 0 }} />
        <div>
          <p style={{ margin: '0 0 var(--spacing-2)', fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: F }}>Every token must answer 4 questions</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-3)' }}>
            {[['1. Where is it stored?', 'JSON (GitHub tokens/)'], ['2. Where is it applied?', 'Figma scope (fill, text, stroke…)'], ['3. Where is it used?', 'UI element + component'], ['4. Where does it end up?', 'CSS variable + Tailwind class']].map(([q, a]) => (
              <div key={q}>
                <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: F }}>{q}</p>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--muted)', borderRadius: 'var(--radius-md)', padding: '6px 12px', flex: 1, minWidth: 200, maxWidth: 340 }}>
          <Search size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tokens, usage, components…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontFamily: F, width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
          {(['all', ...ALL_TYPES] as (TokenType | 'all')[]).map(t => (
            <button key={t} onClick={() => setFilterType(t)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: filterType === t ? `1px solid ${t === 'all' ? 'var(--foreground)' : TYPE_COLORS[t as TokenType]}` : 'var(--border-default)', background: filterType === t ? `color-mix(in srgb, ${t === 'all' ? 'var(--foreground)' : TYPE_COLORS[t as TokenType]} 12%, transparent)` : 'transparent', color: filterType === t ? (t === 'all' ? 'var(--foreground)' : TYPE_COLORS[t as TokenType]) : 'var(--muted-foreground)', cursor: 'pointer', fontFamily: F, fontWeight: filterType === t ? 'var(--font-weight-semibold)' : undefined }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {(['all', ...ALL_LEVELS] as (TokenLevel | 'all')[]).map(l => (
            <button key={l} onClick={() => setFilterLevel(l)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: filterLevel === l ? `1px solid ${l === 'all' ? 'var(--foreground)' : LEVEL_COLORS[l as TokenLevel]}` : 'var(--border-default)', background: filterLevel === l ? `color-mix(in srgb, ${l === 'all' ? 'var(--foreground)' : LEVEL_COLORS[l as TokenLevel]} 12%, transparent)` : 'transparent', color: filterLevel === l ? (l === 'all' ? 'var(--foreground)' : LEVEL_COLORS[l as TokenLevel]) : 'var(--muted-foreground)', cursor: 'pointer', fontFamily: F, fontWeight: filterLevel === l ? 'var(--font-weight-semibold)' : undefined }}>
              {l}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: MONO, marginLeft: 'auto', whiteSpace: 'nowrap' }}>{filtered.length} tokens</span>
      </div>

      {/* Table */}
      {Object.entries(grouped).map(([type, rows]) => (
        <div key={type} style={{ marginBottom: 'var(--spacing-8)' }}>
          {/* Type header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)', padding: 'var(--spacing-2) 0' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[type as TokenType], flexShrink: 0 }} />
            <h3 style={{ margin: 0, fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--ts-h4-weight)', color: 'var(--foreground)', fontFamily: F, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{type}</h3>
            <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: MONO }}>{rows.length} tokens</span>
          </div>

          <div style={{ border: 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 100px 90px 160px 140px 130px 1fr', background: 'var(--muted)', borderBottom: 'var(--border-default)' }}>
              {['Token', 'Level', 'Figma Scope', 'CSS Output', 'Tailwind', 'Value', 'UI Usage / Components'].map(h => (
                <div key={h} style={{ padding: '8px 12px', fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div key={row.tokenName} style={{ display: 'grid', gridTemplateColumns: '220px 100px 90px 160px 140px 130px 1fr', borderBottom: i < rows.length - 1 ? 'var(--border-subtle)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                {/* Token name */}
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center' }}>
                  <CopyChip text={`var(${row.tokenName})`} />
                </div>
                {/* Level */}
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', color: LEVEL_COLORS[row.level], background: `color-mix(in srgb, ${LEVEL_COLORS[row.level]} 10%, transparent)`, padding: '2px 7px', borderRadius: 'var(--radius-full)', fontFamily: F, whiteSpace: 'nowrap' }}>{row.level}</span>
                </div>
                {/* Figma scope */}
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: row.figmaScope.startsWith('❌') ? 'var(--muted-foreground)' : 'var(--foreground)', fontFamily: F, opacity: row.figmaScope.startsWith('❌') ? 0.5 : 1 }}>{row.figmaScope}</span>
                </div>
                {/* CSS output */}
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: MONO }}>{row.cssOutput}</span>
                </div>
                {/* Tailwind */}
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center' }}>
                  {row.tailwindClass !== '—' ? (
                    <code style={{ fontSize: '11px', color: '#3B82F6', fontFamily: MONO }}>{row.tailwindClass}</code>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: MONO, opacity: 0.4 }}>—</span>
                  )}
                </div>
                {/* Value */}
                <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--muted-foreground)', fontFamily: MONO, wordBreak: 'break-all', lineHeight: 1.4 }}>{row.exampleValue}</span>
                </div>
                {/* Usage + components */}
                <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', justifyContent: 'center' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground)', fontFamily: F, lineHeight: 1.4 }}>{row.uiUsage}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {row.componentExamples.map(c => (
                      <span key={c} style={{ fontSize: '10px', padding: '1px 6px', background: 'var(--muted)', color: 'var(--muted-foreground)', borderRadius: 'var(--radius-sm)', fontFamily: MONO, whiteSpace: 'nowrap' }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Token contract summary */}
      <PageSection title="Token Contract Rules" description="These are non-negotiable for system integrity.">
        <PageCard>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              { icon: '✅', color: 'var(--success)', label: 'Always', items: ['Use semantic tokens in all components', 'var(--token) never hardcoded values', 'Component tokens reference semantic only', 'Naming: --{type}-{category}-{role}-{scale}'] },
              { icon: '❌', color: 'var(--destructive)', label: 'Never', items: ['Hardcode hex, px, or rgb() in components', 'Use core tokens directly in components', 'Skip the semantic layer (core → component)', 'Create tokens without a use-case'] },
              { icon: '🎯', color: 'var(--accent)', label: 'Figma scope rules', items: ['color → Fill / Text / Stroke only', 'spacing → Gap / Padding only', 'shadow → Effects only', 'motion / z-index / breakpoint → code only'] },
            ].map(({ icon, color, label, items }) => (
              <div key={label}>
                <p style={{ margin: '0 0 var(--spacing-3)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{icon} {label}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {items.map(r => (
                    <li key={r} style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F, paddingLeft: 'var(--spacing-3)', borderLeft: `2px solid ${color}`, marginLeft: 'var(--spacing-1)' }}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>
    </PageWrapper>
  );
}
