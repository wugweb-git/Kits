import React from 'react';
import { 
  Home, Palette, Box, Grid3x3, Sparkles, Eye, FileText, Users, Clock,
  Droplet, Type, Maximize, Circle, Sunrise,
  RectangleHorizontal, FormInput, CreditCard, SquareDashedBottom, Hash, Image as ImageIcon,
  ChevronDown, Upload, BookOpen, X, CheckSquare, ToggleRight, Sliders, ChevronDown as ChevronDownIcon,
  Square, Tag, MessageSquare, Bell, Navigation as NavigationIcon, Menu, Image as MediaIcon,
  PlayCircle, Radio
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../ui/utils';

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
    subItems: [
      { id: 'import-guide', label: 'Import Guide', icon: Upload },
      { id: 'gallery', label: 'Gallery', icon: BookOpen },
      { id: 'inputs-category', label: 'Inputs', icon: FormInput, isCategory: true },
      { id: 'input-text', label: 'Input Text', icon: FormInput, indent: true },
      { id: 'checkbox', label: 'Checkbox', icon: CheckSquare, indent: true },
      { id: 'radio', label: 'Radio Button', icon: Radio, indent: true },
      { id: 'toggle', label: 'Toggle', icon: ToggleRight, indent: true },
      { id: 'slider', label: 'Slider', icon: Sliders, indent: true },
      { id: 'dropdown', label: 'Dropdown', icon: ChevronDownIcon, indent: true },
      { id: 'surfaces-category', label: 'Surfaces', icon: Square, isCategory: true },
      { id: 'button-dark', label: 'Button', icon: RectangleHorizontal, indent: true },
      { id: 'card', label: 'Card', icon: CreditCard, indent: true },
      { id: 'header', label: 'Header', icon: Menu, indent: true },
      { id: 'feedback-category', label: 'Feedback', icon: MessageSquare, isCategory: true },
      { id: 'tag', label: 'Tag', icon: Tag, indent: true },
      { id: 'chip', label: 'Chip', icon: Hash, indent: true },
      { id: 'alert', label: 'Alert', icon: Bell, indent: true },
      { id: 'badge', label: 'Badge', icon: Hash, indent: true },
      { id: 'navigation-category', label: 'Navigation', icon: NavigationIcon, isCategory: true },
      { id: 'breadcrumb', label: 'Breadcrumb', icon: ChevronDownIcon, indent: true },
      { id: 'menu-item', label: 'Menu Item', icon: Menu, indent: true },
      { id: 'pagination', label: 'Pagination', icon: ChevronDownIcon, indent: true },
      { id: 'media-category', label: 'Media', icon: MediaIcon, isCategory: true },
      { id: 'avatar', label: 'Avatar', icon: ImageIcon, indent: true },
      { id: 'logo', label: 'Logo', icon: PlayCircle, indent: true },
      { id: 'icon', label: 'Icon', icon: ImageIcon, indent: true },
    ]
  },
  { id: 'patterns', label: 'Patterns', icon: Grid3x3 },
  { id: 'playground', label: 'Playground', icon: Sparkles },
  { id: 'accessibility', label: 'Accessibility', icon: Eye },
  { id: 'guidelines', label: 'Guidelines', icon: FileText },
  { id: 'contribute', label: 'Contribute', icon: Users },
  { id: 'changelog', label: 'Changelog', icon: Clock },
];

export function SidebarRefactored({ 
  currentPage, 
  onNavigate, 
  currentSubPage, 
  isOpen = true, 
  onClose, 
  isMobile = false, 
  isTablet = false 
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['tokens', 'components']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleNavClick = (page: string, subPage?: string) => {
    onNavigate(page, subPage);
  };

  const isDrawer = isMobile;
  const isStickySidebar = !isMobile;

  return (
    <aside 
      className={cn(
        "transition-all",
        isDrawer && isOpen && 'animate-slide-in-left'
      )}
      style={{
        position: isDrawer ? 'fixed' : 'sticky',
        left: isDrawer ? (isOpen ? '0' : '-100%') : '0',
        top: isDrawer ? '0' : 'calc(56px + var(--spacing-4))',
        height: isDrawer ? '100vh' : 'calc(100vh - 56px - var(--spacing-4))',
        width: '280px',
        border: '1px solid var(--surface-800)',
        borderRadius: isStickySidebar ? 'var(--radius-lg)' : '0',
        background: 'var(--surface-950)',
        overflowY: 'auto',
        zIndex: isDrawer ? 50 : 10,
        transition: isDrawer ? 'left var(--motion-duration-slow) var(--motion-easing-emphasized)' : 'none',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--muted) var(--surface-950)',
        flexShrink: 0,
        display: isStickySidebar || isOpen ? 'block' : 'none'
      }}
    >
      <div style={{ padding: '24px', paddingBottom: '80px' }}>
        {/* Header with close button */}
        <div 
          style={{ 
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ flex: 1 }}>
            <h2 className="text-sidebar-foreground animate-fade-in">Wugweb Kits</h2>
            <p 
              className="text-muted-foreground animate-fade-in" 
              style={{ 
                fontSize: 'var(--text-sm)', 
                marginTop: '8px',
                animationDelay: '40ms'
              }}
            >
              Design System Docs
            </p>
          </div>
          
          {/* ✅ Using library Button component */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:text-accent ml-2"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </Button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isExpanded = expandedSections.includes(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            
            return (
              <div 
                key={item.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* ✅ Using library Button component */}
                <Button
                  variant={isActive && !currentSubPage ? "default" : "ghost"}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleSection(item.id);
                      if (!isExpanded) {
                        handleNavClick(item.id);
                      }
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  className="w-full justify-between button-press"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive && !currentSubPage ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  
                  {hasSubItems && (
                    <ChevronDown 
                      size={16}
                      style={{
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform var(--motion-duration-fast) var(--motion-easing-standard)'
                      }}
                    />
                  )}
                </Button>

                {/* Sub items */}
                {hasSubItems && isExpanded && (
                  <div 
                    className="animate-fade-in-up"
                    style={{ 
                      marginTop: '4px',
                      marginLeft: '12px',
                      paddingLeft: '18px',
                      borderLeft: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    {item.subItems.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = currentPage === item.id && currentSubPage === subItem.id;
                      const isCategory = (subItem as any).isCategory;
                      const isIndented = (subItem as any).indent;
                      
                      // Category labels (non-clickable)
                      if (isCategory) {
                        return (
                          <div
                            key={subItem.id}
                            className="flex items-center gap-3"
                            style={{
                              padding: 'var(--spacing-2) var(--spacing-3)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 'var(--font-weight-semibold)',
                              opacity: 0.7,
                              marginTop: subIndex > 0 ? 'var(--spacing-3)' : '0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              color: 'var(--sidebar-foreground)'
                            }}
                          >
                            <SubIcon size={14} />
                            <span>{subItem.label}</span>
                          </div>
                        );
                      }
                      
                      // ✅ Using library Button component for sub-items
                      return (
                        <Button
                          key={subItem.id}
                          variant={isSubActive ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleNavClick(item.id, subItem.id)}
                          className={cn(
                            "w-full justify-start gap-3 button-press",
                            isIndented && "pl-6"
                          )}
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: isSubActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                            animationDelay: `${subIndex * 40}ms`
                          }}
                        >
                          <SubIcon size={16} />
                          <span>{subItem.label}</span>
                        </Button>
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
          position: 'sticky',
          bottom: 0,
          padding: '16px 24px',
          backdropFilter: 'blur(8px)',
          background: 'var(--sidebar)'
        }}
      >
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>
          Version 0.1.0
        </p>
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)', marginTop: '4px' }}>
          © 2024 Wugweb Kits
        </p>
      </div>
    </aside>
  );
}
