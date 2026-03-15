import React from 'react';
import { 
  Home, Palette, Box, Grid3x3, Sparkles, Eye, FileText, Users, Clock,
  Droplet, Type, Maximize, Circle, Sunrise,
  RectangleHorizontal, FormInput, CreditCard, SquareDashedBottom, Hash, Image as ImageIcon,
  ChevronDown, Upload, BookOpen, X, CheckSquare, ToggleRight, Sliders, ChevronDown as ChevronDownIcon,
  Square, Tag, MessageSquare, Bell, Navigation as NavigationIcon, Menu, Image as MediaIcon,
  PlayCircle, Radio, UserCircle, Award, AlertCircle, BarChart2, Loader2, Layout, Award as BadgeIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { getLayoutPadding } from '../../utils/layout';
import logo from 'figma:asset/5e1c759341d10d01cfc46434d6f5695cb0c730b6.png';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string, subPage?: string) => void;
  currentSubPage?: string;
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { 
    id: 'tokens', 
    label: 'Tokens', 
    icon: Palette,
    subItems: [
      { id: 'colors', label: 'Colors', icon: Droplet },
      { id: 'typography', label: 'Typography', icon: Type },
      { id: 'spacing', label: 'Spacing', icon: Maximize },
      { id: 'radius', label: 'Radius', icon: Circle },
      { id: 'grid', label: 'Grid System', icon: Grid3x3 },
    ]
  },
  { 
    id: 'components', 
    label: 'Components', 
    icon: Box,
    componentSections: [
      {
        id: 'inputs',
        label: 'Inputs',
        icon: FormInput,
        items: [
          { id: 'input-text', label: 'Input Text', icon: FormInput },
          { id: 'checkbox', label: 'Checkbox', icon: CheckSquare },
          { id: 'radio', label: 'Radio Button', icon: Radio },
          { id: 'toggle', label: 'Toggle', icon: ToggleRight },
          { id: 'slider', label: 'Slider', icon: Sliders },
          { id: 'dropdown', label: 'Dropdown', icon: ChevronDownIcon },
          { id: 'calendar', label: 'Calendar', icon: ChevronDownIcon },
          { id: 'textarea', label: 'Textarea', icon: FormInput },
        ]
      },
      {
        id: 'data-display',
        label: 'Data Display',
        icon: BarChart2,
        items: [
          { id: 'chart', label: 'Chart', icon: BarChart2 },
          { id: 'progress', label: 'Progress', icon: Loader2 },
          { id: 'skeleton', label: 'Skeleton', icon: Layout },
        ]
      },
      {
        id: 'surfaces',
        label: 'Surfaces',
        icon: Square,
        items: [
          { id: 'button-dark', label: 'Button', icon: RectangleHorizontal },
          { id: 'social-button', label: 'Social Button', icon: RectangleHorizontal },
          { id: 'card', label: 'Card', icon: CreditCard },
          { id: 'topic-tile', label: 'Topic Tile', icon: Award },
          { id: 'team-card', label: 'Team Card', icon: UserCircle },
          { id: 'cta-banner', label: 'CTA Banner', icon: AlertCircle },
          { id: 'table', label: 'Table', icon: Square },
          { id: 'header', label: 'Header', icon: Menu },
          { id: 'footer-links', label: 'Footer Links', icon: Menu },
        ]
      },
      {
        id: 'feedback',
        label: 'Feedback',
        icon: MessageSquare,
        items: [
          { id: 'tag', label: 'Tag', icon: Tag },
          { id: 'chip', label: 'Chip', icon: Hash },
          { id: 'alert', label: 'Alert', icon: Bell },
          { id: 'alert-dialog', label: 'Alert Dialog', icon: AlertCircle },
          { id: 'badge', label: 'Badge', icon: Hash },
        ]
      },
      {
        id: 'navigation',
        label: 'Navigation',
        icon: NavigationIcon,
        items: [
          { id: 'breadcrumb', label: 'Breadcrumb', icon: ChevronDownIcon },
          { id: 'pagination', label: 'Pagination', icon: ChevronDownIcon },
          { id: 'side-menu', label: 'Side Menu', icon: Menu },
          { id: 'menu-item', label: 'Menu Item', icon: Menu },
          { id: 'navigation-menu', label: 'Navigation Menu', icon: Menu },
        ]
      },
      {
        id: 'layout',
        label: 'Layout',
        icon: Square,
        items: [
          { id: 'accordion', label: 'Accordion', icon: ChevronDownIcon },
          { id: 'bottom-sheet', label: 'Bottom Sheet', icon: ChevronDownIcon },
          { id: 'collapsible', label: 'Collapsible', icon: ChevronDownIcon },
          { id: 'divider', label: 'Divider', icon: Square },
          { id: 'drawer', label: 'Drawer', icon: Menu },
        ]
      },
      {
        id: 'forms',
        label: 'Forms',
        icon: FormInput,
        items: [
          { id: 'form', label: 'Form', icon: FormInput },
        ]
      },
      {
        id: 'overlay',
        label: 'Overlay',
        icon: Square,
        items: [
          { id: 'tooltip', label: 'Tooltip', icon: MessageSquare },
          { id: 'popover', label: 'Popover', icon: MessageSquare },
        ]
      },
      {
        id: 'tabs-section',
        label: 'Tabs & Navigation',
        icon: NavigationIcon,
        items: [
          { id: 'tabs', label: 'Tabs', icon: ChevronDownIcon },
        ]
      },
      {
        id: 'media',
        label: 'Media',
        icon: MediaIcon,
        items: [
          { id: 'avatar', label: 'Avatar', icon: ImageIcon },
          { id: 'logo', label: 'Logo', icon: PlayCircle },
          { id: 'icon', label: 'Icon', icon: ImageIcon },
        ]
      },
    ]
  },
  { id: 'patterns', label: 'Patterns', icon: Grid3x3 },
  { id: 'playground', label: 'Playground', icon: Sparkles },
  { 
    id: 'resources', 
    label: 'Resources', 
    icon: BookOpen,
    subItems: [
      { id: 'logo-showcase', label: 'Logo Showcase', icon: ImageIcon },
      { id: 'logo-system', label: 'Logo System', icon: BadgeIcon },
      { id: 'embed-badges', label: 'Embed Badges', icon: Award },
    ]
  },
  { id: 'accessibility', label: 'Accessibility', icon: Eye },
  { id: 'guidelines', label: 'Guidelines', icon: FileText },
  { id: 'contribute', label: 'Contribute', icon: Users },
  { id: 'changelog', label: 'Changelog', icon: Clock },
];

export function Sidebar({ currentPage, onNavigate, currentSubPage, isOpen = true, onClose, isMobile = false, isTablet = false }: SidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['tokens', 'components']);
  const [expandedComponentSections, setExpandedComponentSections] = React.useState<string[]>(['inputs', 'data-display', 'surfaces', 'feedback', 'navigation', 'layout', 'forms', 'overlay', 'tabs-section', 'media']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleComponentSection = (sectionId: string) => {
    setExpandedComponentSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleNavClick = (page: string, subPage?: string) => {
    onNavigate(page, subPage);
  };

  // On mobile, show as drawer (overlay)
  // On tablet/desktop, show as sticky sidebar
  const isDrawer = isMobile || isTablet;
  const isStickySidebar = !isMobile && !isTablet;

  return (
    <aside 
      className={isDrawer && isOpen ? 'drawer-slide-in' : ''}
      style={{
        position: isDrawer ? 'fixed' : 'relative',
        left: isDrawer ? (isOpen ? '0' : '-100%') : '0',
        top: isDrawer ? '0' : '0',
        height: isDrawer ? '100vh' : '100%',
        width: 'var(--sidebar-width)',
        borderRight: '1px solid var(--surface-800)',
        borderTopRightRadius: isStickySidebar ? 'var(--radius-lg)' : '0',
        borderBottomRightRadius: isStickySidebar ? 'var(--radius-lg)' : '0',
        background: 'var(--surface-950)',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: isDrawer ? 50 : 10,
        transition: isDrawer ? 'left var(--motion-duration-medium) var(--motion-easing-standard)' : 'none',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--muted) var(--surface-950)',
        flexShrink: 0,
        display: isStickySidebar || isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Sidebar Nav Container */}
      <div style={{ 
        padding: 'var(--spacing-3)', 
        paddingBottom: 'var(--spacing-6)',
        boxSizing: 'border-box',
        flex: '1 1 auto',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isExpanded = expandedSections.includes(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const hasComponentSections = item.componentSections && item.componentSections.length > 0;
            
            return (
              <div 
                key={item.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Main nav item */}
                <button
                  onClick={() => {
                    if (hasSubItems || hasComponentSections) {
                      toggleSection(item.id);
                      if (!isExpanded) {
                        handleNavClick(item.id);
                      }
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  className={`smooth-transition button-press`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive && !currentSubPage ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                    background: isActive && !currentSubPage && !hasComponentSections ? 'var(--accent)' : 'transparent',
                    color: isActive && !currentSubPage && !hasComponentSections ? 'var(--accent-foreground)' : 'var(--sidebar-foreground)',
                    fontFamily: 'Inter Tight, sans-serif',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!(isActive && !currentSubPage && !hasComponentSections)) {
                      e.currentTarget.style.color = 'var(--accent)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(isActive && !currentSubPage && !hasComponentSections)) {
                      e.currentTarget.style.color = 'var(--sidebar-foreground)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  
                  {(hasSubItems || hasComponentSections) && (
                    <div
                      style={{
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform var(--motion-duration-short) var(--motion-easing-soft)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ChevronDown size={16} />
                    </div>
                  )}
                </button>

                {/* Regular Sub items (for Tokens) */}
                {hasSubItems && isExpanded && (
                  <div 
                    className="animate-fade-in-up"
                    style={{ 
                      marginTop: 'var(--spacing-1)',
                      marginLeft: 'var(--spacing-1)',
                      paddingLeft: 'var(--spacing-2)',
                      borderLeft: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {item.subItems.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = currentPage === item.id && currentSubPage === subItem.id;
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavClick(item.id, subItem.id)}
                          className="smooth-transition button-press"
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-1)',
                            padding: '6px var(--spacing-1)',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 'var(--text-sm)',
                            textAlign: 'left',
                            animationDelay: `${subIndex * 40}ms`,
                            fontWeight: isSubActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                            background: isSubActive ? 'var(--accent)' : 'transparent',
                            color: isSubActive ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                            fontFamily: 'Inter Tight, sans-serif',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            position: 'relative',
                            borderLeft: isSubActive ? '3px solid var(--accent)' : '3px solid transparent',
                            paddingLeft: 'calc(var(--spacing-1) - 3px)',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.color = 'var(--accent)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.color = 'var(--muted-foreground)';
                            }
                          }}
                        >
                          <SubIcon size={16} />
                          <span>{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Component Sections (for Components with collapsible categories) */}
                {hasComponentSections && isExpanded && (
                  <div 
                    className="animate-fade-in-up"
                    style={{ 
                      marginTop: 'var(--spacing-1)',
                      marginLeft: 'var(--spacing-1)',
                      paddingLeft: 'var(--spacing-2)',
                      borderLeft: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-1)',
                      boxSizing: 'border-box',
                    }}
                  >
                    {item.componentSections.map((section, sectionIndex) => {
                      const SectionIcon = section.icon;
                      const isSectionExpanded = expandedComponentSections.includes(section.id);
                      
                      return (
                        <div key={section.id} style={{ width: '100%' }}>
                          {/* Section Header */}
                          <button
                            onClick={() => toggleComponentSection(section.id)}
                            className="smooth-transition button-press"
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px var(--spacing-1)',
                              borderRadius: 'var(--radius-sm)',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: 'var(--text-xs)',
                              textAlign: 'left',
                              fontWeight: 'var(--font-weight-semibold)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              background: 'transparent',
                              color: 'var(--sidebar-foreground)',
                              fontFamily: 'Inter Tight, sans-serif',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              boxSizing: 'border-box',
                              opacity: 0.8,
                              marginTop: sectionIndex > 0 ? 'var(--spacing-1)' : '0',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '1';
                              e.currentTarget.style.color = 'var(--accent)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '0.8';
                              e.currentTarget.style.color = 'var(--sidebar-foreground)';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                              <SectionIcon size={14} />
                              <span>{section.label}</span>
                            </div>
                            <div
                              style={{
                                transform: isSectionExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                                transition: 'transform var(--motion-duration-short) var(--motion-easing-soft)',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <ChevronDown size={14} />
                            </div>
                          </button>

                          {/* Section Items */}
                          {isSectionExpanded && (
                            <div
                              style={{
                                marginTop: '4px',
                                paddingLeft: 'var(--spacing-2)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                opacity: isSectionExpanded ? 1 : 0,
                                transform: isSectionExpanded ? 'translateY(0)' : 'translateY(-8px)',
                                transition: `opacity var(--motion-duration-short) var(--motion-easing-soft), transform var(--motion-duration-short) var(--motion-easing-soft)`,
                                boxSizing: 'border-box',
                              }}
                            >
                              {section.items.map((componentItem, componentIndex) => {
                                const ComponentIcon = componentItem.icon;
                                const isComponentActive = currentPage === item.id && currentSubPage === componentItem.id;
                                
                                return (
                                  <button
                                    key={componentItem.id}
                                    onClick={() => handleNavClick(item.id, componentItem.id)}
                                    className="smooth-transition button-press"
                                    style={{
                                      width: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 'var(--spacing-1)',
                                      padding: '6px var(--spacing-1)',
                                      borderRadius: 'var(--radius-sm)',
                                      border: 'none',
                                      cursor: 'pointer',
                                      fontSize: 'var(--text-sm)',
                                      textAlign: 'left',
                                      fontWeight: isComponentActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                                      background: isComponentActive ? 'var(--accent)' : 'transparent',
                                      color: isComponentActive ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                                      fontFamily: 'Inter Tight, sans-serif',
                                      whiteSpace: 'nowrap',
                                      textOverflow: 'ellipsis',
                                      overflow: 'hidden',
                                      boxSizing: 'border-box',
                                      position: 'relative',
                                      borderLeft: isComponentActive ? '3px solid var(--accent)' : '3px solid transparent',
                                      paddingLeft: 'calc(var(--spacing-1) - 3px)',
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isComponentActive) {
                                        e.currentTarget.style.color = 'var(--accent)';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isComponentActive) {
                                        e.currentTarget.style.color = 'var(--muted-foreground)';
                                      }
                                    }}
                                  >
                                    <ComponentIcon size={16} />
                                    <span>{componentItem.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Version Footer */}
      <div 
        className="border-t border-border bg-sidebar"
        style={{
          flexShrink: 0,
          padding: 'var(--spacing-2) var(--spacing-3)',
          backdropFilter: 'blur(8px)',
          background: 'var(--sidebar)',
          borderBottomRightRadius: isStickySidebar ? 'var(--radius-lg)' : '0',
          boxSizing: 'border-box',
        }}
      >
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)', margin: 0 }}>
          Version 0.1.0
        </p>
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)', marginTop: '4px', margin: 0 }}>
          © 2024 Wugweb Kits
        </p>
      </div>
    </aside>
  );
}