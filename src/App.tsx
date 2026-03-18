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
import { ButtonDoc } from './components/ds/pages/ButtonDoc';
import { InputTextDoc } from './components/ds/pages/InputTextDoc';
import { CheckboxDoc } from './components/ds/pages/CheckboxDoc';
import { RadioGroupDoc } from './components/ds/pages/RadioGroupDoc';
import { SwitchDoc } from './components/ds/pages/SwitchDoc';
import { SelectDoc } from './components/ds/pages/SelectDoc';
import { SliderDoc } from './components/ds/pages/SliderDoc';
import { CardDoc } from './components/ds/pages/CardDoc';
import { TagDoc } from './components/ds/pages/TagDoc';
import { SocialButtonDoc } from './components/ds/pages/SocialButtonDoc';
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
import KitsLogoUrl from './imports/Kits_Logo.svg';

// ── Newly wired doc pages ─────────────────────────────────────────────────────
// Form Controls
import { SearchInputDoc } from './components/ds/pages/SearchInputDoc';
import { NumberInputDoc } from './components/ds/pages/NumberInputDoc';
import { NativeSelectDoc } from './components/ds/pages/NativeSelectDoc';
import { ComboboxDoc } from './components/ds/pages/ComboboxDoc';
import { DatePickerDoc } from './components/ds/pages/DatePickerDoc';
import { TimePickerDoc } from './components/ds/pages/TimePickerDoc';
import { FileInputDoc } from './components/ds/pages/FileInputDoc';
import { WYSIWYGDoc } from './components/ds/pages/WYSIWYGDoc';
// Data Display
import { DataTableDoc } from './components/ds/pages/DataTableDoc';
import { ListGroupDoc } from './components/ds/pages/ListGroupDoc';
import { KbdDoc } from './components/ds/pages/KbdDoc';
// Navigation
import { MegaMenuDoc } from './components/ds/pages/MegaMenuDoc';
import { BottomNavigationDoc } from './components/ds/pages/BottomNavigationDoc';
import { StepperDoc } from './components/ds/pages/StepperDoc';
// Feedback
import { BannerDoc } from './components/ds/pages/BannerDoc';
import { SpinnerDoc } from './components/ds/pages/SpinnerDoc';
import { EmptyStateDoc } from './components/ds/pages/EmptyStateDoc';
import { IndicatorDoc } from './components/ds/pages/IndicatorDoc';
import { RatingDoc } from './components/ds/pages/RatingDoc';
// Layout
import { JumbotronDoc } from './components/ds/pages/JumbotronDoc';
import { TimelineDoc } from './components/ds/pages/TimelineDoc';
import { InputGroupDoc } from './components/ds/pages/InputGroupDoc';
// Utilities
import { ButtonGroupDoc } from './components/ds/pages/ButtonGroupDoc';
import { ClipboardDoc } from './components/ds/pages/ClipboardDoc';
import { SpeedDialDoc } from './components/ds/pages/SpeedDialDoc';
import { ChatBubbleDoc } from './components/ds/pages/ChatBubbleDoc';
import { DeviceMockupDoc } from './components/ds/pages/DeviceMockupDoc';
// Charts
import { LineChartDoc } from './components/ds/pages/LineChartDoc';
import { PieChartDoc } from './components/ds/pages/PieChartDoc';
import { RadarChartDoc } from './components/ds/pages/RadarChartDoc';
import { RadialChartDoc } from './components/ds/pages/RadialChartDoc';
// Docs section
import { InstallationDoc } from './components/ds/pages/InstallationDoc';
import { GettingStartedDoc } from './components/ds/pages/GettingStartedDoc';
import { ThemingDoc } from './components/ds/pages/ThemingDoc';
import { TokenArchitectureDoc } from './components/ds/pages/TokenArchitectureDoc';
import { TokenExportDoc } from './components/ds/pages/TokenExportDoc';
import { MCPConnectorDoc } from './components/ds/pages/MCPConnectorDoc';
import { TokenMappingDoc } from './components/ds/pages/TokenMappingDoc';
import { BreakpointsDoc } from './components/ds/pages/BreakpointsDoc';
import { TypographyDoc } from './components/ds/pages/TypographyDoc';
// ── Block sub-pages ────────────────────────────────────────────────────────────
import { HeroSectionsBlock } from './components/ds/pages/blocks/HeroSectionsBlock';
import { FeatureGridsBlock } from './components/ds/pages/blocks/FeatureGridsBlock';
import { PricingTablesBlock } from './components/ds/pages/blocks/PricingTablesBlock';
import { TestimonialsBlock } from './components/ds/pages/blocks/TestimonialsBlock';
import { CTASectionsBlock } from './components/ds/pages/blocks/CTASectionsBlock';
import { FormsBlock } from './components/ds/pages/blocks/FormsBlock';
import { NavbarsBlock } from './components/ds/pages/blocks/NavbarsBlock';
import { FootersBlock } from './components/ds/pages/blocks/FootersBlock';
// ── System architecture ────────────────────────────────────────────────────────
import { SystemLayersDoc } from './components/ds/pages/SystemLayersDoc';
// ── Templates ─────────────────────────────────────────────────────────────────
import { TemplatesOverview } from './components/ds/pages/TemplatesOverview';
import { DashboardTemplate } from './components/ds/pages/templates/DashboardTemplate';
import { LandingPageTemplate } from './components/ds/pages/templates/LandingPageTemplate';
import { TemplateStub } from './components/ds/pages/templates/TemplateStub';
// ── Illustrations & Animations ────────────────────────────────────────────────
import { IllustrationsDoc } from './components/ds/pages/IllustrationsDoc';
import { AnimationsDoc } from './components/ds/pages/AnimationsDoc';
// ── Resources sub-pages ───────────────────────────────────────────────────────
import { BrandGuidelinesDoc } from './components/ds/pages/BrandGuidelinesDoc';
import { MarComDoc } from './components/ds/pages/MarComDoc';
import { FigmaKitsDoc } from './components/ds/pages/FigmaKitsDoc';
import { DownloadsDoc } from './components/ds/pages/DownloadsDoc';
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Favicon injection ────────────────────────────────────────────────────
  React.useEffect(() => {
    // Update title
    document.title = 'Wugweb Kits — Design System';

    // Update/add description meta
    let descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.name = 'description';
      document.head.appendChild(descMeta);
    }
    descMeta.content = '127+ production-ready React components with a 4-layer CSS token system. Colors, typography, spacing, motion — design-to-code ready.';

    // Replace favicon with SVG logo
    const existing = document.querySelectorAll("link[rel*='icon']");
    existing.forEach(el => el.remove());

    const svgLink = document.createElement('link');
    svgLink.rel = 'icon';
    svgLink.type = 'image/svg+xml';
    svgLink.href = KitsLogoUrl;
    document.head.appendChild(svgLink);

    // Apple touch icon
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = KitsLogoUrl;
    document.head.appendChild(appleLink);
  }, []);
  // ────────────────────────────────────────────────────────────────────────

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
    setIsPageTransitioning(true);
    
    setTimeout(() => {
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
      
      if (isMobile || isTablet) {
        setIsSidebarOpen(false);
      }
      
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

    switch (currentSection) {
      // ── DOCS ──────────────────────────────────────────────────────────────
      case 'docs':
        if (currentSubPage === 'introduction' || currentSubPage === undefined) {
          return <Overview onNavigate={handleNavigate} />;
        }
        if (currentSubPage === 'getting-started') return <GettingStartedDoc />;
        if (currentSubPage === 'installation') return <InstallationDoc />;
        if (currentSubPage === 'theming') return <ThemingDoc />;
        if (currentSubPage === 'token-architecture') return <TokenArchitectureDoc />;
        if (currentSubPage === 'system-layers') return <SystemLayersDoc />;
        if (currentSubPage === 'token-export') return <TokenExportDoc />;
        if (currentSubPage === 'token-mapping') return <TokenMappingDoc />;
        if (currentSubPage === 'mcp-connector') return <MCPConnectorDoc />;
        if (currentSubPage === 'colors') return <Tokens currentSubPage="colors" />;
        if (currentSubPage === 'typography') return <TypographyDoc />;
        if (currentSubPage === 'spacing') return <Tokens currentSubPage="spacing" />;
        if (currentSubPage === 'radius') return <Tokens currentSubPage="radius" />;
        if (currentSubPage === 'breakpoints') return <BreakpointsDoc />;
        if (currentSubPage === 'grid') return <GridDoc />;
        if (currentSubPage === 'accessibility') return <Accessibility />;
        if (currentSubPage === 'guidelines') return <Guidelines />;
        return <Overview onNavigate={handleNavigate} />;

      // ── COMPONENTS ───────────────────────────────────────────────────────
      case 'components':
        if (currentSubPage === 'overview') return <ComponentGallery onViewComponent={handleViewComponent} />;

        // ── Core ──
        if (currentSubPage === 'button') return <ButtonDoc />;
        if (currentSubPage === 'badge') return <BadgeDoc />;
        if (currentSubPage === 'tag') return <TagDoc />;
        if (currentSubPage === 'chip') return <ChipDoc />;
        if (currentSubPage === 'avatar') return <AvatarDoc />;
        if (currentSubPage === 'card') return <CardDoc />;
        if (currentSubPage === 'divider') return <DividerDoc />;
        if (currentSubPage === 'social-button') return <SocialButtonDoc />;

        // ── Form Controls ──
        if (currentSubPage === 'input' || currentSubPage === 'input-text') return <InputTextDoc />;
        if (currentSubPage === 'search-input') return <SearchInputDoc />;
        if (currentSubPage === 'number-input') return <NumberInputDoc />;
        if (currentSubPage === 'native-select') return <NativeSelectDoc />;
        if (currentSubPage === 'combobox') return <ComboboxDoc />;
        if (currentSubPage === 'date-picker') return <DatePickerDoc />;
        if (currentSubPage === 'time-picker') return <TimePickerDoc />;
        if (currentSubPage === 'file-input') return <FileInputDoc />;
        if (currentSubPage === 'wysiwyg') return <WYSIWYGDoc />;
        if (currentSubPage === 'phone-input') return <PhoneInputDoc />;
        if (currentSubPage === 'checkbox') return <CheckboxDoc />;
        if (currentSubPage === 'radio-group') return <RadioGroupDoc />;
        if (currentSubPage === 'radio') return <RadioGroupDoc />;
        if (currentSubPage === 'switch' || currentSubPage === 'toggle') return <SwitchDoc />;
        if (currentSubPage === 'select') return <SelectDoc />;
        if (currentSubPage === 'slider') return <SliderDoc />;
        if (currentSubPage === 'calendar') return <CalendarDoc />;
        if (currentSubPage === 'textarea') return <TextareaDoc />;
        if (currentSubPage === 'input-group') return <InputGroupDoc />;
        if (currentSubPage === 'form') return <FormDoc />;

        // ── Data Display ──
        if (currentSubPage === 'data-table') return <DataTableDoc />;
        if (currentSubPage === 'list-group') return <ListGroupDoc />;
        if (currentSubPage === 'kbd') return <KbdDoc />;
        if (currentSubPage === 'table') return <TableDoc />;

        // ── Navigation ──
        if (currentSubPage === 'navigation-menu') return <NavigationMenuDoc />;
        if (currentSubPage === 'mega-menu') return <MegaMenuDoc />;
        if (currentSubPage === 'bottom-navigation') return <BottomNavigationDoc />;
        if (currentSubPage === 'stepper') return <StepperDoc />;
        if (currentSubPage === 'dropdown') return <DropdownDoc />;
        if (currentSubPage === 'header') return <HeaderDoc />;
        if (currentSubPage === 'breadcrumb') return <BreadcrumbDoc />;
        if (currentSubPage === 'pagination') return <PaginationDoc />;
        if (currentSubPage === 'menu-item') return <MenuItemDoc />;
        if (currentSubPage === 'tabs') return <TabsDoc />;
        if (currentSubPage === 'side-menu') return <SideMenuDoc />;

        // ── Feedback ──
        if (currentSubPage === 'banner') return <BannerDoc />;
        if (currentSubPage === 'spinner') return <SpinnerDoc />;
        if (currentSubPage === 'empty-state') return <EmptyStateDoc />;
        if (currentSubPage === 'indicator') return <IndicatorDoc />;
        if (currentSubPage === 'rating') return <RatingDoc />;
        if (currentSubPage === 'alert') return <AlertDoc />;
        if (currentSubPage === 'toast' || currentSubPage === 'toaster') return <ToasterDoc />;
        if (currentSubPage === 'progress') return <ProgressDoc />;
        if (currentSubPage === 'skeleton') return <SkeletonDoc />;
        if (currentSubPage === 'alert-dialog') return <AlertDialogDoc />;

        // ── Overlays ──
        if (currentSubPage === 'dialog') return <DialogDoc />;
        if (currentSubPage === 'drawer') return <DrawerDoc />;
        if (currentSubPage === 'popover') return <PopoverDoc />;
        if (currentSubPage === 'tooltip') return <TooltipDoc />;
        if (currentSubPage === 'bottom-sheet') return <BottomSheetDoc />;
        if (currentSubPage === 'collapsible') return <CollapsibleDoc />;
        if (currentSubPage === 'accordion') return <AccordionDoc />;

        // ── Layout ──
        if (currentSubPage === 'jumbotron') return <JumbotronDoc />;
        if (currentSubPage === 'timeline') return <TimelineDoc />;
        if (currentSubPage === 'chart') return <ChartDoc />;

        // ── Utilities ──
        if (currentSubPage === 'button-group') return <ButtonGroupDoc />;
        if (currentSubPage === 'clipboard') return <ClipboardDoc />;
        if (currentSubPage === 'speed-dial') return <SpeedDialDoc />;
        if (currentSubPage === 'chat-bubble') return <ChatBubbleDoc />;
        if (currentSubPage === 'device-mockup') return <DeviceMockupDoc />;
        if (currentSubPage === 'logo') return <LogoDoc />;
        if (currentSubPage === 'footer-links') return <FooterLinksDoc />;
        if (currentSubPage === 'cta-banner') return <CTABannerDoc />;
        if (currentSubPage === 'team-card') return <TeamCardDoc />;
        if (currentSubPage === 'topic-tile') return <TopicTileDoc />;

        return <ComponentGallery onViewComponent={handleViewComponent} />;

      // ── CHARTS ────────────────────────────────────────────────────────────
      case 'charts':
        if (currentSubPage === 'overview' || currentSubPage === undefined) return <ChartsOverview />;
        if (currentSubPage === 'area-chart') return <AreaChartDoc />;
        if (currentSubPage === 'bar-chart') return <BarChartDoc />;
        if (currentSubPage === 'line-chart') return <LineChartDoc />;
        if (currentSubPage === 'pie-chart') return <PieChartDoc />;
        if (currentSubPage === 'radar-chart') return <RadarChartDoc />;
        if (currentSubPage === 'radial-chart') return <RadialChartDoc />;
        if (currentSubPage === 'data-table') return <DataTableDoc />;
        return <ChartsOverview />;

      // ── BLOCKS ────────────────────────────────────────────────────────────
      case 'blocks':
        if (currentSubPage === 'overview' || currentSubPage === undefined) return <BlocksOverviewComplete />;
        if (currentSubPage === 'hero-sections') return <HeroSectionsBlock />;
        if (currentSubPage === 'feature-grids') return <FeatureGridsBlock />;
        if (currentSubPage === 'pricing-tables') return <PricingTablesBlock />;
        if (currentSubPage === 'testimonials') return <TestimonialsBlock />;
        if (currentSubPage === 'cta-sections') return <CTASectionsBlock />;
        if (currentSubPage === 'forms') return <FormsBlock />;
        if (currentSubPage === 'navbars') return <NavbarsBlock />;
        if (currentSubPage === 'footers') return <FootersBlock />;
        return <BlocksOverviewComplete />;

      // ── TEMPLATES ─────────────────────────────────────────────────────────
      case 'templates':
        if (currentSubPage === 'overview' || currentSubPage === undefined) return <TemplatesOverview onNavigate={handleNavigate} />;
        if (currentSubPage === 'dashboard') return <DashboardTemplate />;
        if (currentSubPage === 'landing-page') return <LandingPageTemplate />;
        if (currentSubPage === 'marketing-site') return <TemplateStub title="Marketing Site" description="Multi-page marketing site with blog, team, and contact sections." blocks={['Navigation header', 'Hero section', 'Features grid', 'Blog listing', 'Team section', 'Contact form', 'Full footer']} onBack={() => handleNavigate('templates', 'overview')} />;
        if (currentSubPage === 'documentation') return <TemplateStub title="Documentation Site" description="Technical docs with sidebar navigation, search, and code blocks." blocks={['Docs sidebar', 'Search modal', 'MDX content area', 'Code block', 'Prev/Next pagination', 'Table of contents', 'Breadcrumbs']} onBack={() => handleNavigate('templates', 'overview')} />;
        if (currentSubPage === 'portfolio') return <TemplateStub title="Portfolio / Agency" description="Creative portfolio with project showcase and case studies." blocks={['Minimal hero', 'Project grid', 'Case study page', 'About section', 'Services list', 'Contact form', 'Minimal footer']} onBack={() => handleNavigate('templates', 'overview')} />;
        if (currentSubPage === 'e-commerce') return <TemplateStub title="E-commerce Storefront" description="Product catalog, detail page, cart, and checkout flow." blocks={['Product catalog grid', 'Filter sidebar', 'Product detail page', 'Image gallery', 'Cart drawer', 'Checkout flow', 'Order confirmation']} onBack={() => handleNavigate('templates', 'overview')} />;
        return <TemplatesOverview onNavigate={handleNavigate} />;

      // ── ICONS ─────────────────────────────────────────────────────────────
      case 'icons':
        return <IconDocNew />;

      // ── ILLUSTRATIONS ─────────────────────────────────────────────────────
      case 'illustrations':
        return <IllustrationsDoc />;

      // ── ANIMATIONS ────────────────────────────────────────────────────────
      case 'animations':
        return <AnimationsDoc />;

      // ── RESOURCES ─────────────────────────────────────────────────────────
      case 'resources':
        if (currentSubPage === 'logo-system') return <LogoSystemDoc />;
        if (currentSubPage === 'logo-showcase') return <LogoShowcase />;
        if (currentSubPage === 'embed-badges') return <EmbedBadgesDoc />;
        if (currentSubPage === 'icons') return <IconDocNew />;
        if (currentSubPage === 'illustrations') return <IllustrationsDoc />;
        if (currentSubPage === 'animations') return <AnimationsDoc />;
        if (currentSubPage === 'brand-guidelines') return <BrandGuidelinesDoc />;
        if (currentSubPage === 'marcom') return <MarComDoc />;
        if (currentSubPage === 'figma-kits') return <FigmaKitsDoc />;
        if (currentSubPage === 'downloads') return <DownloadsDoc />;
        if (currentSubPage === 'contribute') return <Contribute />;
        if (currentSubPage === 'changelog') return <Changelog />;
        return <LogoShowcase />;

      // ── STANDALONE SECTIONS ───────────────────────────────────────────────
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

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-1000)', position: 'relative' }}>
      <Toaster position="bottom-right" />
      
      <div style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        <Header 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onToggleSidebar={handleToggleSidebar}
          showMenuButton={isMobile || isTablet}
        />
        
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
        
        <div style={{ 
          display: 'flex',
          position: 'relative',
          width: '100%',
          minHeight: 'calc(100vh - var(--header-height) - 48px)',
          flex: 1
        }}>
          
          {isDesktop && (
            <aside style={{
              position: 'sticky',
              top: 'calc(var(--header-height) + 48px)',
              left: 0,
              width: 'var(--sidebar-width)',
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

          {(isMobile || isTablet) && isSidebarOpen && (
            <>
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
              paddingLeft: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-content-gap-desktop)',
              paddingRight: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-padding-desktop-right)',
              paddingTop: 'var(--spacing-4)',
              paddingBottom: 'var(--spacing-8)',
              overflowX: 'hidden'
            }}
          >
            {renderPage()}
          </main>
        </div>

        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}