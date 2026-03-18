import React from 'react';
import { Header } from './components/ds/Header';
import { Footer } from './components/ds/Footer';
import { Overview } from './components/ds/pages/OverviewNew';
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
import { RadioGroupDoc } from './components/ds/pages/RadioGroupDoc';
import { ToggleDoc } from './components/ds/pages/ToggleDoc';
import { SwitchDoc } from './components/ds/pages/SwitchDoc';
import { SelectDoc } from './components/ds/pages/SelectDoc';
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
import { DialogDoc } from './components/ds/pages/DialogDoc';
import { FormDoc } from './components/ds/pages/FormDoc';
import { TooltipDoc } from './components/ds/pages/TooltipDoc';
import { TextareaDoc } from './components/ds/pages/TextareaDoc';
import { ToasterDoc } from './components/ds/pages/ToasterDoc';
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
import { EmbedBadgesDoc } from './components/ds/pages/EmbedBadgesDoc';
import { LogoSystemDoc } from './components/ds/pages/LogoSystemDoc';
import { LogoShowcase } from './components/ds/pages/LogoShowcase';
import { PhoneInputDoc } from './components/ds/pages/PhoneInputDoc';
import { ChartsOverview } from './components/ds/pages/ChartsOverview';
import { AreaChartDoc } from './components/ds/pages/AreaChartDoc';
import { BarChartDoc } from './components/ds/pages/BarChartDoc';
import { BlocksOverviewComplete } from './components/ds/pages/BlocksOverviewComplete';
import { PageWrapper, PageHeader } from './components/ds/PageWrapper';
import { TopNavigation } from './components/ds/TopNavigation';
import { ContextualSidebar } from './components/ds/ContextualSidebar';
import { useBreakpoint } from './hooks/useMediaQuery';
import { Toaster } from 'sonner@2.0.3';
import './styles/animations.css';

export default function App() {
  const [currentSection, setCurrentSection] = React.useState('docs');
  const [currentPage, setCurrentPage] = React.useState('overview');
  const [currentSubPage, setCurrentSubPage] = React.useState<string | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = React.useState(false);

  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const handleSectionChange = (section: string) => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      setCurrentSection(section);
      setCurrentPage('overview');
      setCurrentSubPage(undefined);
      setIsPageTransitioning(false);
      if (isMobile || isTablet) {
        setIsSidebarOpen(false);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const handleNavigate = (page: string, subPage?: string) => {
    // Trigger page transition animation
    setIsPageTransitioning(true);
    
    setTimeout(() => {
      // Update section if navigating to standalone pages
      if (['patterns', 'playground', 'accessibility', 'guidelines', 'contribute', 'changelog'].includes(page)) {
        setCurrentSection(page);
        setCurrentPage(page);
        setCurrentSubPage(undefined);
      } else {
        setCurrentPage(page);
        setCurrentSubPage(subPage);
      }
      
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

    // Route based on section
    switch (currentSection) {
      case 'docs':
        // Docs section routing
        if (currentSubPage === 'introduction' || currentSubPage === undefined) {
          return <Overview onNavigate={handleNavigate} />;
        }
        if (currentSubPage === 'colors' || currentSubPage === 'typography' || currentSubPage === 'spacing' || currentSubPage === 'radius') {
          return <Tokens currentSubPage={currentSubPage} />;
        }
        if (currentSubPage === 'grid') {
          return <GridDoc />;
        }
        if (currentSubPage === 'accessibility') {
          return <Accessibility />;
        }
        if (currentSubPage === 'guidelines') {
          return <Guidelines />;
        }
        return <Overview onNavigate={handleNavigate} />;

      case 'components':
        // Existing component routing
        if (currentSubPage === 'overview') {
          return <ComponentGallery onViewComponent={handleViewComponent} />;
        }
        if (currentSubPage === 'input' || currentSubPage === 'input-text') {
          return <InputTextDoc />;
        }
        if (currentSubPage === 'checkbox') {
          return <CheckboxDoc />;
        }
        if (currentSubPage === 'radio-group') {
          return <RadioGroupDoc />;
        }
        if (currentSubPage === 'switch') {
          return <SwitchDoc />;
        }
        if (currentSubPage === 'select') {
          return <SelectDoc />;
        }
        if (currentSubPage === 'slider') {
          return <SliderDoc />;
        }
        if (currentSubPage === 'calendar') {
          return <CalendarDoc />;
        }
        if (currentSubPage === 'textarea') {
          return <TextareaDoc />;
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
        if (currentSubPage === 'radio') {
          return <RadioButtonDoc />;
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
        if (currentSubPage === 'collapsible') {
          return <CollapsibleDoc />;
        }
        if (currentSubPage === 'drawer') {
          return <DrawerDoc />;
        }
        if (currentSubPage === 'alert-dialog') {
          return <AlertDialogDoc />;
        }
        if (currentSubPage === 'dialog') {
          return <DialogDoc />;
        }
        if (currentSubPage === 'form') {
          return <FormDoc />;
        }
        if (currentSubPage === 'tooltip') {
          return <TooltipDoc />;
        }
        if (currentSubPage === 'toast' || currentSubPage === 'toaster') {
          return <ToasterDoc />;
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
        return <ComponentGallery onViewComponent={handleViewComponent} />;

      case 'charts':
        // Charts section routing
        if (currentSubPage === 'overview' || currentSubPage === undefined) {
          return <ChartsOverview />;
        }
        if (currentSubPage === 'phone-input') {
          return <PhoneInputDoc />;
        }
        if (currentSubPage === 'area-chart') {
          return <AreaChartDoc />;
        }
        if (currentSubPage === 'bar-chart') {
          return <BarChartDoc />;
        }
        // For now, show ChartsOverview for all chart pages
        return <ChartsOverview />;

      case 'blocks':
        // Blocks section routing
        if (currentSubPage === 'overview' || currentSubPage === undefined) {
          return <BlocksOverviewComplete />;
        }
        // For now, all block pages show Patterns until individual pages created
        return <Patterns />;

      case 'templates':
        // Templates section routing
        if (currentSubPage === 'overview' || currentSubPage === undefined) {
          return <Playground />;
        }
        // For now, all template pages show Playground until individual pages created
        return <Playground />;

      case 'icons':
        // Icons section
        return <IconDocNew />;

      case 'illustrations':
        // Illustrations section
        // Create placeholder for now
        return (
          <PageWrapper>
            <PageHeader
              title="Illustrations"
              description="Beautiful illustrations for your design system. Coming soon."
            />
          </PageWrapper>
        );

      case 'resources':
        if (currentSubPage === 'logo-system') {
          return <LogoSystemDoc />;
        }
        if (currentSubPage === 'logo-showcase') {
          return <LogoShowcase />;
        }
        if (currentSubPage === 'embed-badges') {
          return <EmbedBadgesDoc />;
        }
        // Default to logo showcase for resources overview
        return <LogoShowcase />;

      case 'patterns':
        // Patterns page - show design patterns
        return <Patterns />;

      case 'playground':
        // Playground page
        return <Playground />;

      case 'accessibility':
        // Accessibility page
        return <Accessibility />;

      case 'guidelines':
        // Guidelines page
        return <Guidelines />;

      case 'contribute':
        // Contribute page
        return <Contribute />;

      case 'changelog':
        // Changelog page
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
        
        {/* Top Navigation Tabs */}
        <div style={{ 
          position: 'sticky',
          top: 'var(--header-height)',
          zIndex: 20,
          background: 'var(--background)',
        }}>
          <TopNavigation
            currentSection={currentSection}
            onSectionChange={handleSectionChange}
            onToggleSidebar={handleToggleSidebar}
            showMenuButton={isMobile || isTablet}
          />
        </div>
        
        {/* Main Layout Container: Sidebar + Content */}
        <div style={{ 
          display: 'flex',
          position: 'relative',
          width: '100%',
          minHeight: 'calc(100vh - var(--header-height) - 48px)',
          flex: 1
        }}>
          
          {/* Desktop Sidebar — Sticky, 280px fixed width */}
          {isDesktop && (
            <aside style={{
              position: 'sticky',
              top: 'calc(var(--header-height) + 48px)', // Stick below header + tabs
              left: 0,
              width: 'var(--sidebar-width)', // 280px
              height: 'calc(100vh - var(--header-height) - 48px)',
              flexShrink: 0,
              boxSizing: 'border-box',
              overflowY: 'auto',
              overflowX: 'hidden',
              zIndex: 10,
              background: 'var(--card)',
              borderRight: '1px solid var(--border)'
            }}>
              <ContextualSidebar
                currentSection={currentSection}
                currentPage={currentPage}
                currentSubPage={currentSubPage}
                onNavigate={handleNavigate}
                isOpen={true}
                onClose={() => {}}
                isMobile={false}
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
                  background: 'var(--card)',
                  zIndex: 60,
                  overflow: 'auto',
                  borderRight: '1px solid var(--border)'
                }}
              >
                <ContextualSidebar
                  currentSection={currentSection}
                  currentPage={currentPage}
                  currentSubPage={currentSubPage}
                  onNavigate={handleNavigate}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  isMobile={isMobile}
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