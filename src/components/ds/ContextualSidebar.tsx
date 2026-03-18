import React from 'react';
import {
  Home, Book, Palette, Type, Maximize, Circle, Grid3x3, Eye, FileText,
  FormInput, CheckSquare, ToggleRight, Sliders, Calendar, Hash,
  BarChart2, Table2, LineChart, PieChart, Radar, Target,
  Layout, Box, MessageSquare, Navigation, Image, Zap, Badge,
  Blocks, FileCode, Package, Lightbulb, BookOpen, GitBranch,
  Clock, Users, Search, Phone, FileText as TextIcon, Filter,
  List, Award, Bell, Tag, Square, Menu, ChevronRight, X,
  TrendingUp, Activity, Layers
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  isNew?: boolean;
  items?: SidebarItem[];
}

interface ContextualSidebarProps {
  currentSection: string;
  currentPage: string;
  currentSubPage?: string;
  onNavigate: (page: string, subPage?: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

/**
 * ContextualSidebar Component
 * 
 * Smart sidebar that changes content based on current section.
 * Uses CSS variables from /styles/globals.css for theming.
 */
export function ContextualSidebar({
  currentSection,
  currentPage,
  currentSubPage,
  onNavigate,
  isOpen = true,
  onClose,
  isMobile = false,
}: ContextualSidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Get navigation items based on current section
  const getNavigationItems = (): SidebarItem[] => {
    switch (currentSection) {
      case 'docs':
        return [
          { id: 'introduction', label: 'Introduction', icon: Home },
          { id: 'installation', label: 'Installation', icon: Package },
          { id: 'getting-started', label: 'Getting Started', icon: Zap },
          { id: 'token-architecture', label: 'Token Architecture', icon: Layers, isNew: true },
          { id: 'system-layers', label: 'System Layers', icon: GitBranch, isNew: true },
          {
            id: 'design-tokens',
            label: 'Design Tokens',
            icon: Palette,
            items: [
              { id: 'colors', label: 'Colors', icon: Palette },
              { id: 'typography', label: 'Typography', icon: Type },
              { id: 'spacing', label: 'Spacing', icon: Maximize },
              { id: 'radius', label: 'Border Radius', icon: Circle },
              { id: 'grid', label: 'Grid System', icon: Grid3x3 },
            ],
          },
          { id: 'theming', label: 'Theming', icon: Palette },
          { id: 'accessibility', label: 'Accessibility', icon: Eye },
          { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
        ];

      case 'components':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          {
            id: 'form-controls',
            label: 'Form Controls',
            icon: FormInput,
            badge: '16',
            items: [
              { id: 'input', label: 'Input', icon: FormInput },
              { id: 'search-input', label: 'Search Input', icon: Search, badge: 'New' },
              { id: 'number-input', label: 'Number Input', icon: Hash, badge: 'New' },
              { id: 'phone-input', label: 'Phone Input', icon: Phone, badge: 'New' },
              { id: 'textarea', label: 'Textarea', icon: TextIcon },
              { id: 'checkbox', label: 'Checkbox', icon: CheckSquare },
              { id: 'radio-group', label: 'Radio Group', icon: CheckSquare },
              { id: 'switch', label: 'Switch', icon: ToggleRight },
              { id: 'select', label: 'Select', icon: Filter },
              { id: 'native-select', label: 'Native Select', icon: Filter, badge: 'New' },
              { id: 'combobox', label: 'Combobox', icon: Search, badge: 'New' },
              { id: 'slider', label: 'Slider', icon: Sliders },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'date-picker', label: 'Date Picker', icon: Calendar, badge: 'New' },
              { id: 'time-picker', label: 'Time Picker', icon: Clock, badge: 'New' },
              { id: 'file-input', label: 'File Input', icon: FileText, badge: 'New' },
              { id: 'wysiwyg', label: 'WYSIWYG Editor', icon: FileCode, badge: 'New' },
            ],
          },
          {
            id: 'data-display',
            label: 'Data Display',
            icon: Table2,
            badge: '8',
            items: [
              { id: 'table', label: 'Table', icon: Table2 },
              { id: 'data-table', label: 'Data Table', icon: Table2, badge: 'New' },
              { id: 'card', label: 'Card', icon: Square },
              { id: 'list-group', label: 'List Group', icon: List, badge: 'New' },
              { id: 'badge', label: 'Badge', icon: Badge },
              { id: 'chip', label: 'Chip', icon: Tag },
              { id: 'avatar', label: 'Avatar', icon: Users },
              { id: 'kbd', label: 'Keyboard Key', icon: Hash, badge: 'New' },
            ],
          },
          {
            id: 'navigation',
            label: 'Navigation',
            icon: Navigation,
            badge: '8',
            items: [
              { id: 'header', label: 'Header', icon: Menu },
              { id: 'breadcrumb', label: 'Breadcrumb', icon: ChevronRight },
              { id: 'pagination', label: 'Pagination', icon: Hash },
              { id: 'tabs', label: 'Tabs', icon: Square },
              { id: 'mega-menu', label: 'Mega Menu', icon: Menu, badge: 'New' },
              { id: 'bottom-navigation', label: 'Bottom Navigation', icon: Menu, badge: 'New' },
              { id: 'side-menu', label: 'Side Menu', icon: Menu },
              { id: 'stepper', label: 'Stepper', icon: ChevronRight, badge: 'New' },
            ],
          },
          {
            id: 'feedback',
            label: 'Feedback',
            icon: MessageSquare,
            badge: '10',
            items: [
              { id: 'alert', label: 'Alert', icon: Bell },
              { id: 'banner', label: 'Banner', icon: Layout, badge: 'New' },
              { id: 'toast', label: 'Toast', icon: Bell },
              { id: 'progress', label: 'Progress', icon: Target },
              { id: 'spinner', label: 'Spinner', icon: Target, badge: 'New' },
              { id: 'skeleton', label: 'Skeleton', icon: Square },
              { id: 'empty-state', label: 'Empty State', icon: Box, badge: 'New' },
              { id: 'indicator', label: 'Indicator', icon: Circle, badge: 'New' },
              { id: 'rating', label: 'Rating', icon: Award, badge: 'New' },
            ],
          },
          {
            id: 'overlays',
            label: 'Overlays',
            icon: Box,
            badge: '6',
            items: [
              { id: 'dialog', label: 'Dialog', icon: Square },
              { id: 'alert-dialog', label: 'Alert Dialog', icon: Bell },
              { id: 'drawer', label: 'Drawer', icon: Menu },
              { id: 'bottom-sheet', label: 'Bottom Sheet', icon: Layout },
              { id: 'popover', label: 'Popover', icon: MessageSquare },
              { id: 'tooltip', label: 'Tooltip', icon: MessageSquare },
            ],
          },
          {
            id: 'layout',
            label: 'Layout',
            icon: Layout,
            badge: '8',
            items: [
              { id: 'accordion', label: 'Accordion', icon: ChevronRight },
              { id: 'collapsible', label: 'Collapsible', icon: ChevronRight },
              { id: 'divider', label: 'Divider', icon: Hash },
              { id: 'jumbotron', label: 'Jumbotron', icon: Layout, badge: 'New' },
              { id: 'timeline', label: 'Timeline', icon: Clock, badge: 'New' },
              { id: 'cta-banner', label: 'CTA Banner', icon: Layout },
              { id: 'input-group', label: 'Input Group', icon: FormInput, badge: 'New' },
            ],
          },
          {
            id: 'utilities',
            label: 'Utilities',
            icon: Zap,
            badge: '5',
            items: [
              { id: 'button-group', label: 'Button Group', icon: Square, badge: 'New' },
              { id: 'clipboard', label: 'Clipboard', icon: FileText, badge: 'New' },
              { id: 'speed-dial', label: 'Speed Dial', icon: Zap, badge: 'New' },
              { id: 'chat-bubble', label: 'Chat Bubble', icon: MessageSquare, badge: 'New' },
              { id: 'device-mockup', label: 'Device Mockup', icon: Image, badge: 'New' },
            ],
          },
        ];

      case 'charts':
        return [
          { id: 'overview', label: 'Overview', icon: BarChart2 },
          { id: 'area-chart', label: 'Area Chart', icon: TrendingUp, isNew: true },
          { id: 'bar-chart', label: 'Bar Chart', icon: BarChart2, isNew: true },
          { id: 'line-chart', label: 'Line Chart', icon: Activity, isNew: true },
          { id: 'pie-chart', label: 'Pie Chart', icon: PieChart, isNew: true },
          { id: 'radar-chart', label: 'Radar Chart', icon: Activity, isNew: true },
          { id: 'radial-chart', label: 'Radial Chart', icon: Circle, isNew: true },
          { id: 'data-table', label: 'Data Table', icon: Table2, isNew: true },
        ];

      case 'blocks':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'hero-sections', label: 'Hero Sections', icon: Layout },
          { id: 'feature-grids', label: 'Feature Grids', icon: Grid3x3 },
          { id: 'pricing-tables', label: 'Pricing Tables', icon: Table2 },
          { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
          { id: 'cta-sections', label: 'CTA Sections', icon: Zap },
          { id: 'forms', label: 'Forms', icon: FormInput },
          { id: 'navbars', label: 'Navbars', icon: Menu },
          { id: 'footers', label: 'Footers', icon: Layout },
        ];

      case 'templates':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'dashboard', label: 'Dashboard', icon: BarChart2, isNew: true },
          { id: 'landing-page', label: 'Landing Page', icon: Layout, isNew: true },
          { id: 'marketing-site', label: 'Marketing Site', icon: Zap },
          { id: 'documentation', label: 'Documentation', icon: Book },
          { id: 'portfolio', label: 'Portfolio', icon: Image },
          { id: 'e-commerce', label: 'E-commerce', icon: Package },
        ];

      case 'resources':
        return [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'logo-system', label: 'Logo System', icon: Image },
          { id: 'icons', label: 'Icons', icon: Zap },
          { id: 'illustrations', label: 'Illustrations', icon: Image },
          { id: 'animations', label: 'Animations', icon: Activity },
          { id: 'brand-guidelines', label: 'Brand Guidelines', icon: BookOpen },
          { id: 'marcom', label: 'MarCom', icon: MessageSquare },
          { id: 'figma-kits', label: 'Figma Kits', icon: Package },
          { id: 'downloads', label: 'Downloads', icon: Package },
          { id: 'contribute', label: 'Contribute', icon: GitBranch },
          { id: 'changelog', label: 'Changelog', icon: Clock },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavigationItems();

  const renderNavItem = (item: SidebarItem, depth = 0) => {
    const hasSubItems = item.items && item.items.length > 0;
    const isExpanded = expandedSections.includes(item.id);
    const isActive = currentSubPage === item.id || currentPage === item.id;
    const Icon = item.icon;

    return (
      <div key={item.id}>
        <button
          type="button"
          onClick={() => {
            if (hasSubItems) {
              toggleSection(item.id);
            } else {
              onNavigate(currentSection, item.id);
            }
          }}
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-sm)',
            fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-2) var(--spacing-3)',
            paddingLeft: `calc(var(--spacing-3) + ${depth * 16}px)`,
            color: isActive ? 'var(--accent)' : 'var(--foreground)',
            background: isActive ? 'var(--accent-subtle)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'var(--muted)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <Icon size={16} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge && (
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                padding: '2px 6px',
                background: item.badge === 'New' ? 'var(--accent)' : 'var(--muted)',
                color: item.badge === 'New' ? 'var(--accent-foreground)' : 'var(--foreground)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {item.badge}
            </span>
          )}
          {hasSubItems && (
            <ChevronRight
              size={14}
              style={{
                flexShrink: 0,
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform var(--motion-duration-fast) var(--motion-easing-standard)',
              }}
            />
          )}
        </button>

        {/* Sub-items */}
        {hasSubItems && isExpanded && (
          <div style={{ marginTop: 'var(--spacing-1)' }}>
            {item.items!.map((subItem) => renderNavItem(subItem, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: 'Inter Tight, sans-serif',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--card)',
      }}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-4)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <h2
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              margin: 0,
              textTransform: 'capitalize',
            }}
          >
            {currentSection}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'var(--foreground)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 'var(--spacing-4)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          {navItems.map((item) => renderNavItem(item))}
        </div>
      </div>
    </div>
  );
}