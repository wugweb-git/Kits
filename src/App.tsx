import React from 'react';
import { Sidebar } from './components/ds/Sidebar';
import { Header } from './components/ds/Header';
import { Footer } from './components/ds/Footer';
import { Overview } from './components/ds/pages/Overview';
import { Tokens } from './components/ds/pages/Tokens';
import { Components } from './components/ds/pages/Components';
import { Patterns } from './components/ds/pages/Patterns';
import { Playground } from './components/ds/pages/Playground';
import { Accessibility } from './components/ds/pages/Accessibility';
import { Guidelines } from './components/ds/pages/Guidelines';
import { Contribute } from './components/ds/pages/Contribute';
import { Changelog } from './components/ds/pages/Changelog';
import { FigmaImportGuide } from './components/ds/pages/FigmaImportGuide';
import { ComponentGallery } from './components/ds/pages/ComponentGallery';
import { ComponentDoc } from './components/ds/pages/ComponentDoc';
import { ButtonShowcase } from './components/ds/pages/ButtonShowcase';
import { ButtonDoc } from './components/ds/pages/ButtonDoc';
import { InputTextDoc } from './components/ds/pages/InputTextDoc';
import { CheckboxDoc } from './components/ds/pages/CheckboxDoc';
import { ToggleDoc } from './components/ds/pages/ToggleDoc';
import { SliderDoc } from './components/ds/pages/SliderDoc';
import { CardDoc } from './components/ds/pages/CardDoc';
import { TagDoc } from './components/ds/pages/TagDoc';
import { SocialButtonDoc } from './components/ds/pages/SocialButtonDoc';
import { AllComponentsShowcase } from './components/ds/pages/AllComponentsShowcase';
import { RadioButtonDoc } from './components/ds/pages/RadioButtonDoc';
import { IconDocNew } from './components/ds/pages/IconDocNew';
import { DropdownDoc } from './components/ds/pages/DropdownDoc';
import { HeaderDoc } from './components/ds/pages/HeaderDoc';
import { BreadcrumbDoc } from './components/ds/pages/BreadcrumbDoc';
import { PaginationDoc } from './components/ds/pages/PaginationDoc';
import { MenuItemDoc } from './components/ds/pages/MenuItemDoc';
import { ChipDoc } from './components/ds/pages/ChipDoc';
import { AlertDoc } from './components/ds/pages/AlertDoc';
import { BadgeDoc } from './components/ds/pages/BadgeDoc';
import { TeamCardDoc } from './components/ds/pages/TeamCardDoc';
import { TopicTileDoc } from './components/ds/pages/TopicTileDoc';
import { CTABannerDoc } from './components/ds/pages/CTABannerDoc';
import { AccordionDoc } from './components/ds/pages/AccordionDoc';
import { AvatarDoc } from './components/ds/pages/AvatarDoc';
import { CalendarDoc } from './components/ds/pages/CalendarDoc';
import { CollapsibleDoc } from './components/ds/pages/CollapsibleDoc';
import { DrawerDoc } from './components/ds/pages/DrawerDoc';
import { AlertDialogDoc } from './components/ds/pages/AlertDialogDoc';
import { FormDoc } from './components/ds/pages/FormDoc';
import { TooltipDoc } from './components/ds/pages/TooltipDoc';
import { TextareaDoc } from './components/ds/pages/TextareaDoc';
import { PopoverDoc } from './components/ds/pages/PopoverDoc';
import { TabsDoc } from './components/ds/pages/TabsDoc';
import { BottomSheetDoc } from './components/ds/pages/BottomSheetDoc';
import { DividerDoc } from './components/ds/pages/DividerDoc';
import { SideMenuDoc } from './components/ds/pages/SideMenuDoc';
import { TableDoc } from './components/ds/pages/TableDoc';
import { ChartDoc } from './components/ds/pages/ChartDoc';
import { ProgressDoc } from './components/ds/pages/ProgressDoc';
import { SkeletonDoc } from './components/ds/pages/SkeletonDoc';
import { LogoDoc } from './components/ds/pages/LogoDoc';
import { FooterLinksDoc } from './components/ds/pages/FooterLinksDoc';
import { NavigationMenuDoc } from './components/ds/pages/NavigationMenuDoc';
import { GridDoc } from './components/ds/pages/GridDoc';
import { useBreakpoint } from './hooks/useMediaQuery';
import { Toaster } from './components/ui/sonner';
import './styles/animations.css';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState('overview');
  const [currentSubPage, setCurrentSubPage] = React.useState<string | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = React.useState(false);

  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const handleNavigate = (page: string, subPage?: string) => {
    // Trigger page transition animation
    setIsPageTransitioning(true);
    
    setTimeout(() => {
      setCurrentPage(page);
      setCurrentSubPage(subPage);
      setSelectedComponentId(null);
      setIsPageTransitioning(false);
      
      // Close sidebar on mobile/tablet after navigation
      if (isMobile || isTablet) {
        setIsSidebarOpen(false);
      }
      
      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const handleViewComponent = (componentId: string) => {
    setIsPageTransitioning(true);
    
    setTimeout(() => {
      setSelectedComponentId(componentId);
      setCurrentPage('component-doc');
      setIsPageTransitioning(false);
      
      if (isMobile || isTablet) {
        setIsSidebarOpen(false);
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPage = () => {
    // If viewing a component doc
    if (currentPage === 'component-doc' && selectedComponentId) {
      return <ComponentDoc componentId={selectedComponentId} />;
    }

    switch (currentPage) {
      case 'overview':
        return <Overview onNavigate={handleNavigate} />;
      case 'tokens':
        if (currentSubPage === 'grid') {
          return <GridDoc />;
        }
        return <Tokens currentSubPage={currentSubPage} />;
      case 'components':
        if (currentSubPage === 'gallery') {
          return <ComponentGallery onViewComponent={handleViewComponent} />;
        }
        if (currentSubPage === 'import-guide') {
          return <FigmaImportGuide />;
        }
        if (currentSubPage === 'buttons') {
          return <ButtonShowcase />;
        }
        if (currentSubPage === 'button-dark') {
          return <ButtonDoc />;
        }
        if (currentSubPage === 'input-text') {
          return <InputTextDoc />;
        }
        if (currentSubPage === 'checkbox') {
          return <CheckboxDoc />;
        }
        if (currentSubPage === 'toggle') {
          return <ToggleDoc />;
        }
        if (currentSubPage === 'slider') {
          return <SliderDoc />;
        }
        if (currentSubPage === 'card') {
          return <CardDoc />;
        }
        if (currentSubPage === 'tag') {
          return <TagDoc />;
        }
        if (currentSubPage === 'social-button') {
          return <SocialButtonDoc />;
        }
        if (currentSubPage === 'all-components') {
          return <AllComponentsShowcase />;
        }
        if (currentSubPage === 'radio') {
          return <RadioButtonDoc />;
        }
        if (currentSubPage === 'icon') {
          return <IconDocNew />;
        }
        if (currentSubPage === 'dropdown') {
          return <DropdownDoc />;
        }
        if (currentSubPage === 'header') {
          return <HeaderDoc />;
        }
        if (currentSubPage === 'breadcrumb') {
          return <BreadcrumbDoc />;
        }
        if (currentSubPage === 'pagination') {
          return <PaginationDoc />;
        }
        if (currentSubPage === 'menu-item') {
          return <MenuItemDoc />;
        }
        if (currentSubPage === 'navigation-menu') {
          return <NavigationMenuDoc />;
        }
        if (currentSubPage === 'chip') {
          return <ChipDoc />;
        }
        if (currentSubPage === 'alert') {
          return <AlertDoc />;
        }
        if (currentSubPage === 'badge') {
          return <BadgeDoc />;
        }
        if (currentSubPage === 'team-card') {
          return <TeamCardDoc />;
        }
        if (currentSubPage === 'topic-tile') {
          return <TopicTileDoc />;
        }
        if (currentSubPage === 'cta-banner') {
          return <CTABannerDoc />;
        }
        if (currentSubPage === 'accordion') {
          return <AccordionDoc />;
        }
        if (currentSubPage === 'avatar') {
          return <AvatarDoc />;
        }
        if (currentSubPage === 'calendar') {
          return <CalendarDoc />;
        }
        if (currentSubPage === 'collapsible') {
          return <CollapsibleDoc />;
        }
        if (currentSubPage === 'drawer') {
          return <DrawerDoc />;
        }
        if (currentSubPage === 'alert-dialog') {
          return <AlertDialogDoc />;
        }
        if (currentSubPage === 'form') {
          return <FormDoc />;
        }
        if (currentSubPage === 'tooltip') {
          return <TooltipDoc />;
        }
        if (currentSubPage === 'textarea') {
          return <TextareaDoc />;
        }
        if (currentSubPage === 'popover') {
          return <PopoverDoc />;
        }
        if (currentSubPage === 'tabs') {
          return <TabsDoc />;
        }
        if (currentSubPage === 'bottom-sheet') {
          return <BottomSheetDoc />;
        }
        if (currentSubPage === 'divider') {
          return <DividerDoc />;
        }
        if (currentSubPage === 'side-menu') {
          return <SideMenuDoc />;
        }
        if (currentSubPage === 'table') {
          return <TableDoc />;
        }
        if (currentSubPage === 'chart') {
          return <ChartDoc />;
        }
        if (currentSubPage === 'progress') {
          return <ProgressDoc />;
        }
        if (currentSubPage === 'skeleton') {
          return <SkeletonDoc />;
        }
        if (currentSubPage === 'logo') {
          return <LogoDoc />;
        }
        if (currentSubPage === 'footer-links') {
          return <FooterLinksDoc />;
        }
        return <Components currentSubPage={currentSubPage} />;
      case 'patterns':
        return <Patterns />;
      case 'playground':
        return <Playground />;
      case 'accessibility':
        return <Accessibility />;
      case 'guidelines':
        return <Guidelines />;
      case 'contribute':
        return <Contribute />;
      case 'changelog':
        return <Changelog />;
      default:
        return <Overview onNavigate={handleNavigate} />;
    }
  };

  // Close sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1000)', position: 'relative' }}>
      {/* Toast notifications */}
      <Toaster position="bottom-right" />
      
      {/* Site Shell — Responsive Architecture */}
      <div style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header — Fixed at top, 64px height, full width */}
        <Header 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onToggleSidebar={handleToggleSidebar}
          showMenuButton={isMobile || isTablet}
        />
        
        {/* Main Layout Container: Sidebar + Content */}
        <div style={{ 
          display: 'flex',
          marginTop: 'var(--header-height)', // 64px
          position: 'relative',
          width: '100%',
          minHeight: 'calc(100vh - var(--header-height))',
          flex: 1
        }}>
          
          {/* Desktop Sidebar — Sticky, 280px fixed width */}
          {isDesktop && (
            <aside style={{
              position: 'sticky',
              top: 'var(--header-height)', // Stick below header
              left: 0,
              width: 'var(--sidebar-width)', // 280px
              height: 'calc(100vh - var(--header-height))',
              flexShrink: 0,
              boxSizing: 'border-box',
              overflowY: 'auto',
              overflowX: 'hidden',
              zIndex: 10,
              background: 'var(--surface-900)',
              borderRight: '1px solid var(--border)'
            }}>
              <Sidebar 
                currentPage={currentPage} 
                onNavigate={handleNavigate} 
                currentSubPage={currentSubPage}
                isOpen={true}
                onClose={() => {}}
                isMobile={false}
                isTablet={false}
              />
            </aside>
          )}

          {/* Mobile/Tablet Sidebar — Drawer Overlay */}
          {(isMobile || isTablet) && isSidebarOpen && (
            <>
              {/* Overlay backdrop */}
              <div 
                className="animate-fade-in"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'var(--overlay-background)',
                  zIndex: 50,
                  backdropFilter: 'blur(8px)'
                }}
                onClick={handleOverlayClick}
              />
              
              {/* Sidebar drawer */}
              <div 
                className="animate-slide-in-left"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: isMobile ? 'min(86%, 360px)' : '360px',
                  height: '100vh',
                  background: 'var(--surface-900)',
                  zIndex: 60,
                  overflow: 'auto',
                  borderRight: '1px solid var(--border)'
                }}
              >
                <Sidebar 
                  currentPage={currentPage} 
                  onNavigate={handleNavigate} 
                  currentSubPage={currentSubPage}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </div>
            </>
          )}
          
          {/* Main Content — Fluid width, responsive padding */}
          <main 
            className={isPageTransitioning ? 'page-transition-exit-active' : 'page-transition-enter-active'}
            style={{ 
              flex: 1,
              width: '100%',
              minHeight: 'calc(100vh - var(--header-height))',
              boxSizing: 'border-box',
              opacity: isPageTransitioning ? 0 : 1,
              transform: isPageTransitioning ? 'translateY(20px)' : 'translateY(0)',
              transition: 'opacity var(--motion-duration-normal) var(--motion-easing-emphasized), transform var(--motion-duration-normal) var(--motion-easing-emphasized)',
              paddingLeft: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-content-gap-desktop)', // 40px gap on desktop
              paddingRight: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-padding-desktop-right)',
              paddingTop: 'var(--spacing-4)', // 32px top padding
              paddingBottom: 'var(--spacing-8)', // 64px bottom padding
              overflowX: 'hidden'
            }}
          >
            {renderPage()}
          </main>
        </div>

        {/* Footer — Full width, outside main content flow */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}