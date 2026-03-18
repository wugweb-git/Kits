import React from 'react';
import { Plus, Wrench, Zap, AlertTriangle, ExternalLink, Check } from 'lucide-react';
import { PageWrapper, PageHeader, PageSection } from '../PageWrapper';

const F = 'Inter Tight, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

type ChangeType = 'added' | 'improved' | 'fixed' | 'breaking';

interface Change { type: ChangeType; items: string[]; }
interface Release {
  version: string; date: string; type: 'major' | 'minor' | 'patch' | 'initial';
  summary?: string; changes: Change[];
}

const releases: Release[] = [
  {
    version: '2.1.0',
    date: 'March 2026',
    type: 'minor',
    summary: 'Block sub-pages, templates, illustrations, animations, and full resources section.',
    changes: [
      {
        type: 'added',
        items: [
          'All 8 Block sub-pages: Hero Sections, Feature Grids, Pricing Tables, Testimonials, CTA Sections, Forms, Navbars, Footers',
          'TemplatesOverview gallery with thumbnail mockups and hover states',
          'DashboardTemplate — full analytics dashboard with recharts, sidebar, KPI cards, data table',
          'LandingPageTemplate — scrollable SaaS landing page in browser chrome preview',
          '4 TemplateStubs (marketing-site, documentation, portfolio, e-commerce) with block composition plans',
          'IllustrationsDoc — 9 inline SVG illustrations (Empty States, Feedback, Product) with token-driven color',
          'AnimationsDoc — duration scale, easing visualizer, mood presets, 4 live interactive demos',
          'BrandGuidelinesDoc — color swatches, typography scale, voice & tone rules',
          'MarComDoc — approved messaging, social templates, press quotes, brand assets',
          'FigmaKitsDoc — 4 kit cards, sync pipeline, 6-step setup (real Figma + GitHub URLs)',
          'DownloadsDoc — npm/CSS/JSON/Tailwind/Style Dictionary downloads with copy buttons',
          'Animations added as top-level nav tab',
          'Templates sidebar fully wired with all 6 sub-pages',
          'Resources sidebar: icons, illustrations, animations, brand-guidelines, marcom, figma-kits, downloads',
          'BlockPageShell shared component with preview/code toggle, copy button',
        ],
      },
    ],
  },
  {
    version: '2.0.0',
    date: 'February 2026',
    type: 'major',
    summary: 'Complete token system refactor to 4-layer architecture. New doc pages. Favicon. Logo showcase.',
    changes: [
      {
        type: 'breaking',
        items: [
          'globals.css restructured: Core → Alias → Semantic → Component (4-layer W3C DTCG)',
          'All component tokens now reference semantic layer — no direct core access',
          'Alias layer added (--alias-color-brand-primary, --alias-surface-page, etc.)',
        ],
      },
      {
        type: 'added',
        items: [
          'LAYER 1.5 — ALIAS TOKENS: branding bridge enabling multi-brand theming via 1-file swap',
          'Z-index semantic tokens: --z-index-dropdown (100) through --z-index-toast (700)',
          'Border composite tokens: --border-default, --border-accent, --border-focus, --border-width-*',
          'Opacity semantic tokens: --opacity-disabled (0.4), --opacity-placeholder, --opacity-ghost',
          'TokenArchitectureDoc — full 4-layer system documentation with pipeline diagram',
          'SystemLayersDoc — TOKENS→STYLES→COMPONENTS→BLOCKS→SCREENS→FLOWS→PRODUCT reference',
          'LogoShowcase rebuilt with Kits_Logo.svg (real asset)',
          'Kits_Logo.svg wired as site favicon via useEffect in App.tsx',
          'BlocksOverviewComplete — 90+ block categories with Marketing/App/E-commerce UI',
          '8 new component docs: SearchInput, NumberInput, NativeSelect, Combobox, DatePicker, TimePicker, FileInput, WYSIWYG',
          '8 new component docs: DataTable, ListGroup, Kbd, MegaMenu, BottomNavigation, Stepper, Banner, Spinner',
          '5 new component docs: EmptyState, Indicator, Rating, Jumbotron, Timeline',
          '5 new component docs: ButtonGroup, Clipboard, SpeedDial, ChatBubble, DeviceMockup',
          '7 new chart docs: AreaChart, BarChart, LineChart, PieChart, RadarChart, RadialChart, ChartsOverview',
          'Token Export doc with downloadable global.json, alias.json, semantic.json, component.json',
          'MCP Connector doc with full pipeline, tool schemas, roadmap',
        ],
      },
      {
        type: 'improved',
        items: [
          'globals.css header: full architecture documentation with rules and token type list',
          'All block routing now hits real page components (not Patterns stub)',
          'ContextualSidebar fully expanded: all blocks, all resources, templates sub-pages',
          'TopNavigation: Animations tab added as dedicated section',
          'PageWrapper: all pages use CSS variable tokens only, no Tailwind fontSize/fontWeight classes',
        ],
      },
    ],
  },
  {
    version: '1.3.0',
    date: 'January 2026',
    type: 'minor',
    summary: 'Component count to 127+. Charts section. New feedback and utility components.',
    changes: [
      {
        type: 'added',
        items: [
          'Charts section with recharts: Area, Bar, Line, Pie, Radar, Radial',
          'ChartsOverview with comparison and use-case guide',
          'PhoneInput, InputGroup, Form composite doc',
          'RatingDoc, IndicatorDoc, EmptyStateDoc, BannerDoc, SpinnerDoc',
          'StepperDoc, MegaMenuDoc, BottomNavigationDoc',
          'ButtonGroupDoc, ClipboardDoc, SpeedDialDoc, ChatBubbleDoc, DeviceMockupDoc',
          'KbdDoc, ListGroupDoc, DataTableDoc',
        ],
      },
      {
        type: 'improved',
        items: [
          'Component sidebar: all sub-sections wired with badge counts',
          'All new docs follow PageWrapper pattern with CSS variable tokens only',
        ],
      },
    ],
  },
  {
    version: '1.2.0',
    date: 'December 2025',
    type: 'minor',
    summary: 'Form controls expansion. Search, Number, Native Select, Combobox, Date/Time pickers.',
    changes: [
      {
        type: 'added',
        items: [
          'SearchInputDoc — with live search, clear button, keyboard shortcut',
          'NumberInputDoc — increment/decrement, min/max validation',
          'NativeSelectDoc — semantic HTML <select> with token styling',
          'ComboboxDoc — searchable dropdown with multi-select',
          'DatePickerDoc — calendar popup, range selection',
          'TimePickerDoc — hour/minute/meridiem selection',
          'FileInputDoc — drag-and-drop with preview',
          'WYSIWYGDoc — rich text editor with toolbar',
          'Tokens Studio + GitHub sync documentation',
        ],
      },
    ],
  },
  {
    version: '1.1.0',
    date: 'November 2025',
    type: 'minor',
    summary: 'Logo system, embed badges, navigation docs, layout components.',
    changes: [
      {
        type: 'added',
        items: [
          'LogoSystemDoc — usage rules, variants, clear space, color combinations',
          'EmbedBadgesDoc — SVG badges for GitHub, npm, and Figma',
          'NavigationMenuDoc, DropdownDoc, SideMenuDoc, MenuItemDoc',
          'AccordionDoc, CollapsibleDoc, DrawerDoc, BottomSheetDoc',
          'JumbotronDoc, TimelineDoc, CTABannerDoc, TeamCardDoc, TopicTileDoc',
          'GridDoc — 12/8/4 column system with responsive breakpoints',
          'InstallationDoc, GettingStartedDoc, ThemingDoc',
        ],
      },
    ],
  },
  {
    version: '1.0.0',
    date: 'October 2025',
    type: 'minor',
    summary: 'Core component library stable. 40+ components. Full token system.',
    changes: [
      {
        type: 'added',
        items: [
          'Button: primary, secondary, outline, ghost, destructive — sm/md/lg/xl',
          'Badge, Tag, Chip — all variants and sizes',
          'Avatar — image, initials, fallback, group',
          'Card — with header, content, footer sub-components',
          'Input, Textarea, Checkbox, RadioGroup, Switch, Select, Slider, Calendar',
          'Alert, Dialog, AlertDialog, Popover, Tooltip, Tabs',
          'Table, Progress, Skeleton, Divider',
          'Header, Breadcrumb, Pagination',
          'Social Button (Google, GitHub, Apple)',
          'Complete token system: colors, typography, spacing, radius, shadow, motion',
        ],
      },
    ],
  },
  {
    version: '0.1.0',
    date: 'November 2024',
    type: 'initial',
    summary: 'Initial design system documentation site.',
    changes: [
      {
        type: 'added',
        items: [
          'Documentation site scaffold with sidebar navigation',
          'Basic token definitions: colors, spacing, radius',
          'Initial component stubs and overview page',
          'Accessibility guidelines and WCAG 2.1 AA reference',
          'Contribution guidelines',
        ],
      },
    ],
  },
];

const typeConfig: Record<ChangeType, { icon: React.ElementType; color: string; label: string }> = {
  added:    { icon: Plus,          color: 'var(--success)',     label: 'Added' },
  improved: { icon: Zap,           color: 'var(--info)',        label: 'Improved' },
  fixed:    { icon: Wrench,        color: 'var(--warning)',     label: 'Fixed' },
  breaking: { icon: AlertTriangle, color: 'var(--destructive)', label: 'Breaking' },
};

const releaseTypeColor: Record<string, string> = {
  major:   'var(--accent)',
  minor:   'var(--info)',
  patch:   'var(--success)',
  initial: 'var(--muted-foreground)',
};

export function Changelog() {
  const [expanded, setExpanded] = React.useState<string[]>(['2.1.0', '2.0.0']);

  const toggle = (v: string) => setExpanded(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  return (
    <PageWrapper>
      <PageHeader
        badge="Changelog"
        title="Changelog"
        description="Every release of Wugweb Kits, from v0.1.0 to today. Full history of what was added, improved, and fixed."
        actions={
          <a href="https://github.com/wugweb-git/Kits/releases" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--accent)', textDecoration: 'none', fontFamily: F }}>
            GitHub Releases <ExternalLink size={14} />
          </a>
        }
      />

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', marginBottom: 'var(--spacing-10)', padding: 'var(--spacing-5)', background: 'var(--card)', borderRadius: 'var(--radius-lg)', border: 'var(--border-default)' }}>
        {[
          { val: releases.length, label: 'Releases' },
          { val: '127+', label: 'Components' },
          { val: '4', label: 'Token layers' },
          { val: '90+', label: 'Block patterns' },
          { val: '6', label: 'Chart types' },
          { val: '6', label: 'Templates' },
        ].map(s => (
          <div key={s.label}>
            <p style={{ margin: 0, fontSize: 'var(--ts-h3-size)', fontWeight: 'var(--font-weight-bold)', color: 'var(--accent)', fontFamily: F }}>{s.val}</p>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: F }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 'var(--spacing-8)' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 11, top: 0, bottom: 0, width: 1, background: 'var(--border)', zIndex: 0 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          {releases.map(release => {
            const isOpen = expanded.includes(release.version);
            return (
              <div key={release.version} style={{ position: 'relative' }}>
                {/* Timeline dot */}
                <div style={{ position: 'absolute', left: -32, top: 20, width: 10, height: 10, borderRadius: '50%', background: releaseTypeColor[release.type], border: '2px solid var(--background)', zIndex: 1 }} />

                {/* Release card */}
                <div style={{ background: 'var(--card)', border: release.version.startsWith('2') ? 'var(--border-accent)' : 'var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  {/* Header row — clickable */}
                  <button
                    onClick={() => toggle(release.version)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', padding: 'var(--spacing-4) var(--spacing-5)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', flexWrap: 'wrap' }}
                  >
                    {/* Version badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', flexShrink: 0 }}>
                      <code style={{ fontSize: 'var(--ts-h4-size)', fontWeight: 'var(--font-weight-bold)', color: releaseTypeColor[release.type], fontFamily: MONO }}>v{release.version}</code>
                      <span style={{ fontSize: '10px', fontWeight: 'var(--font-weight-bold)', padding: '2px 8px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.06em', background: `color-mix(in srgb, ${releaseTypeColor[release.type]} 12%, transparent)`, color: releaseTypeColor[release.type], fontFamily: F }}>{release.type}</span>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: MONO, flexShrink: 0 }}>{release.date}</span>
                    {release.summary && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F, flex: 1 }}>{release.summary}</span>}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', marginLeft: 'auto', fontFamily: F, flexShrink: 0 }}>{isOpen ? 'Collapse ↑' : 'Expand ↓'}</span>
                  </button>

                  {/* Change groups */}
                  {isOpen && (
                    <div style={{ borderTop: 'var(--border-default)', padding: 'var(--spacing-5)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
                      {release.changes.map((group, gi) => {
                        const cfg = typeConfig[group.type];
                        const Icon = cfg.icon;
                        return (
                          <div key={gi}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
                              <Icon size={13} style={{ color: cfg.color }} />
                              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F }}>{cfg.label}</span>
                            </div>
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                              {group.items.map(item => (
                                <li key={item} style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: F, lineHeight: 1.6 }}>
                                  <span style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }}>·</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
