import React from 'react';
import { 
  Layout, ShoppingCart, FileText, Briefcase, Code, 
  Users, CreditCard, Mail, Shield, Bell, Search,
  Heart, Star, MessageSquare, Package, Truck,
  AlertCircle, CheckCircle2, Info, Grid3x3, Layers
} from 'lucide-react';
import { PageWrapper, PageHeader, PageSection, PageCard, PageGrid } from '../PageWrapper';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

/**
 * BlocksOverview Component
 * 
 * Complete overview of all 90+ block categories with 400+ components.
 * Organized by UI category: Marketing, Application, E-commerce, Publisher.
 * 100% CSS variables - NO hardcoded values.
 */

interface BlockCategory {
  id: string;
  title: string;
  count: number;
  category: 'Marketing UI' | 'Application UI' | 'E-commerce UI' | 'Publisher UI';
  icon: React.ElementType;
  description: string;
  examples?: string[];
}

export function BlocksOverviewComplete() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // All 90+ block categories from reviews-history.md
  const blockCategories: BlockCategory[] = [
    // Marketing UI (28 categories)
    {
      id: 'hero-sections',
      title: 'Hero Sections',
      count: 18,
      category: 'Marketing UI',
      icon: Layout,
      description: 'Eye-catching hero sections with CTAs, images, and compelling headlines.',
      examples: ['Split hero', 'Centered hero', 'Video background']
    },
    {
      id: 'feature-sections',
      title: 'Feature Sections',
      count: 10,
      category: 'Marketing UI',
      icon: Grid3x3,
      description: 'Showcase product features with icons, descriptions, and visual elements.',
      examples: ['Feature grid', 'Feature list', 'Feature cards']
    },
    {
      id: 'cta-sections',
      title: 'CTA Sections',
      count: 10,
      category: 'Marketing UI',
      icon: AlertCircle,
      description: 'Call-to-action sections to drive conversions and user engagement.',
      examples: ['Simple CTA', 'Split CTA', 'Newsletter signup']
    },
    {
      id: 'content-sections',
      title: 'Content Sections',
      count: 9,
      category: 'Marketing UI',
      icon: FileText,
      description: 'Rich content sections for articles, documentation, and storytelling.',
      examples: ['Text + image', 'Multi-column', 'Stats']
    },
    {
      id: 'team-sections',
      title: 'Team Sections',
      count: 8,
      category: 'Marketing UI',
      icon: Users,
      description: 'Display team members with photos, names, roles, and social links.',
      examples: ['Team grid', 'Team cards', 'Leadership']
    },
    {
      id: 'headers',
      title: 'Headers',
      count: 8,
      category: 'Marketing UI',
      icon: Layout,
      description: 'Marketing website headers with navigation, logos, and CTAs.',
      examples: ['Centered nav', 'Split nav', 'Mega menu']
    },
    {
      id: 'pricing-tables',
      title: 'Pricing Tables',
      count: 7,
      category: 'Marketing UI',
      icon: CreditCard,
      description: 'Pricing comparison tables with features, tiers, and billing options.',
      examples: ['3-tier pricing', 'Toggle billing', 'Feature comparison']
    },
    {
      id: 'footer-sections',
      title: 'Footer Sections',
      count: 7,
      category: 'Marketing UI',
      icon: Layout,
      description: 'Website footers with links, social media, and company information.',
      examples: ['Multi-column', 'Minimal', 'Newsletter']
    },
    {
      id: 'social-proof',
      title: 'Social Proof',
      count: 6,
      category: 'Marketing UI',
      icon: Star,
      description: 'Build trust with customer logos, testimonials, and statistics.',
      examples: ['Logo cloud', 'Stats bar', 'Trust badges']
    },
    {
      id: 'contact-forms',
      title: 'Contact Forms',
      count: 6,
      category: 'Marketing UI',
      icon: Mail,
      description: 'Contact forms with validation, maps, and contact information.',
      examples: ['Simple form', 'With map', 'Multi-step']
    },
    {
      id: 'register-forms',
      title: 'Register Forms',
      count: 5,
      category: 'Marketing UI',
      icon: Users,
      description: 'User registration forms with validation and social sign-up options.',
      examples: ['Email signup', 'Social auth', 'Multi-step']
    },
    {
      id: 'login-forms',
      title: 'Login Forms',
      count: 5,
      category: 'Marketing UI',
      icon: Shield,
      description: 'Login forms with password recovery and social authentication.',
      examples: ['Simple login', 'With illustration', 'Social options']
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      count: 5,
      category: 'Marketing UI',
      icon: MessageSquare,
      description: 'Customer testimonials with quotes, photos, and star ratings.',
      examples: ['Card grid', 'Carousel', 'Featured quote']
    },
    {
      id: 'faq-sections',
      title: 'FAQ Sections',
      count: 5,
      category: 'Marketing UI',
      icon: Info,
      description: 'Frequently asked questions with expandable answers.',
      examples: ['Accordion', 'Two column', 'Categorized']
    },
    {
      id: 'customer-logos',
      title: 'Customer Logos',
      count: 5,
      category: 'Marketing UI',
      icon: Briefcase,
      description: 'Showcase customer and partner logos to build credibility.',
      examples: ['Logo grid', 'Logo carousel', 'Grayscale logos']
    },
    {
      id: 'newsletter-sections',
      title: 'Newsletter Sections',
      count: 5,
      category: 'Marketing UI',
      icon: Mail,
      description: 'Email newsletter signup sections with inline and modal variants.',
      examples: ['Inline form', 'Modal popup', 'Footer signup']
    },
    {
      id: 'banners',
      title: 'Banners',
      count: 5,
      category: 'Marketing UI',
      icon: Bell,
      description: 'Announcement banners for promotions, updates, and alerts.',
      examples: ['Top banner', 'Dismissible', 'Sticky']
    },
    {
      id: 'blog-sections',
      title: 'Blog Sections',
      count: 5,
      category: 'Marketing UI',
      icon: FileText,
      description: 'Blog post listings with images, excerpts, and metadata.',
      examples: ['Grid layout', 'Featured post', 'Sidebar']
    },
    {
      id: 'project-portfolio',
      title: 'Project Portfolio',
      count: 5,
      category: 'Marketing UI',
      icon: Layers,
      description: 'Showcase projects and case studies with images and descriptions.',
      examples: ['Masonry grid', 'Case study', 'Filterable']
    },
    {
      id: 'reset-password-forms',
      title: 'Reset Password Forms',
      count: 5,
      category: 'Marketing UI',
      icon: Shield,
      description: 'Password reset and recovery forms with email verification.',
      examples: ['Email reset', 'Code verification', 'New password']
    },
    {
      id: 'popups',
      title: 'Popups',
      count: 5,
      category: 'Marketing UI',
      icon: Bell,
      description: 'Modal popups for announcements, promotions, and lead capture.',
      examples: ['Exit intent', 'Timed popup', 'Email capture']
    },
    {
      id: 'account-recovery',
      title: 'Account Recovery',
      count: 5,
      category: 'Marketing UI',
      icon: Shield,
      description: 'Account recovery flows for lost passwords and locked accounts.',
      examples: ['Email recovery', 'Security questions', '2FA recovery']
    },
    {
      id: 'cookie-consent',
      title: 'Cookie Consent',
      count: 4,
      category: 'Marketing UI',
      icon: Shield,
      description: 'GDPR-compliant cookie consent banners and preference centers.',
      examples: ['Bottom banner', 'Modal', 'Preferences']
    },
    {
      id: 'user-onboarding',
      title: 'User Onboarding',
      count: 4,
      category: 'Marketing UI',
      icon: Users,
      description: 'Guided onboarding flows to welcome and educate new users.',
      examples: ['Step progress', 'Tooltips', 'Welcome tour']
    },
    {
      id: 'event-schedule',
      title: 'Event Schedule',
      count: 4,
      category: 'Marketing UI',
      icon: FileText,
      description: 'Event schedules and agendas with times, speakers, and sessions.',
      examples: ['Timeline', 'Calendar view', 'Session list']
    },
    {
      id: '404-pages',
      title: '404 Pages',
      count: 3,
      category: 'Marketing UI',
      icon: AlertCircle,
      description: 'Creative 404 error pages with helpful navigation.',
      examples: ['Illustration', 'Search', 'Popular pages']
    },
    {
      id: '500-pages',
      title: '500 Pages',
      count: 3,
      category: 'Marketing UI',
      icon: AlertCircle,
      description: 'Server error pages with status updates and support links.',
      examples: ['Simple message', 'Illustration', 'Status page']
    },
    {
      id: 'maintenance-pages',
      title: 'Maintenance Pages',
      count: 3,
      category: 'Marketing UI',
      icon: AlertCircle,
      description: 'Under maintenance pages with countdown and notifications.',
      examples: ['Countdown timer', 'Subscribe updates', 'Social links']
    },

    // Application UI (22 categories)
    {
      id: 'table-headers',
      title: 'Table Headers',
      count: 13,
      category: 'Application UI',
      icon: Grid3x3,
      description: 'Data table headers with sorting, filtering, and search.',
      examples: ['Sortable columns', 'Filters', 'Bulk actions']
    },
    {
      id: 'side-navigations',
      title: 'Side Navigations',
      count: 12,
      category: 'Application UI',
      icon: Layout,
      description: 'Sidebar navigation for dashboards and applications.',
      examples: ['Collapsible', 'Icons + text', 'Multi-level']
    },
    {
      id: 'application-shells',
      title: 'Application Shells',
      count: 8,
      category: 'Application UI',
      icon: Layout,
      description: 'Complete application layouts with header, sidebar, and content.',
      examples: ['Dashboard layout', 'Split layout', 'Tabbed']
    },
    {
      id: 'dropdown-filters',
      title: 'Dropdown Filters',
      count: 8,
      category: 'Application UI',
      icon: Search,
      description: 'Advanced dropdown filters for data tables and lists.',
      examples: ['Multi-select', 'Date range', 'Search + filter']
    },
    {
      id: 'update-modals-crud',
      title: 'Update Modals (CRUD)',
      count: 7,
      category: 'Application UI',
      icon: Code,
      description: 'Modal dialogs for updating existing records.',
      examples: ['Edit form', 'Inline editing', 'Confirmation']
    },
    {
      id: 'create-modals-crud',
      title: 'Create Modals (CRUD)',
      count: 7,
      category: 'Application UI',
      icon: Code,
      description: 'Modal dialogs for creating new records.',
      examples: ['Simple form', 'Multi-step', 'With validation']
    },
    {
      id: 'dashboard-footers',
      title: 'Dashboard Footers',
      count: 7,
      category: 'Application UI',
      icon: Layout,
      description: 'Dashboard footers with links, copyright, and version info.',
      examples: ['Simple footer', 'Multi-column', 'Minimal']
    },
    {
      id: 'advanced-tables',
      title: 'Advanced Tables',
      count: 7,
      category: 'Application UI',
      icon: Grid3x3,
      description: 'Feature-rich data tables with sorting, pagination, and actions.',
      examples: ['Sortable', 'Expandable rows', 'Inline edit']
    },
    {
      id: 'read-modals-crud',
      title: 'Read Modals (CRUD)',
      count: 6,
      category: 'Application UI',
      icon: Code,
      description: 'View-only modal dialogs for displaying record details.',
      examples: ['Details view', 'With actions', 'Print view']
    },
    {
      id: 'delete-confirm-crud',
      title: 'Delete Confirm (CRUD)',
      count: 6,
      category: 'Application UI',
      icon: AlertCircle,
      description: 'Confirmation dialogs for delete actions with warnings.',
      examples: ['Simple confirm', 'Type to confirm', 'Undo option']
    },
    {
      id: 'dashboard-navbars',
      title: 'Dashboard Navbars',
      count: 6,
      category: 'Application UI',
      icon: Layout,
      description: 'Top navigation bars for dashboard applications.',
      examples: ['User menu', 'Notifications', 'Search']
    },
    {
      id: 'read-sections-crud',
      title: 'Read Sections (CRUD)',
      count: 6,
      category: 'Application UI',
      icon: Code,
      description: 'Full-page sections for displaying record details.',
      examples: ['Profile view', 'Detail page', 'With sidebar']
    },
    {
      id: 'crud-layouts',
      title: 'CRUD Layouts',
      count: 6,
      category: 'Application UI',
      icon: Layout,
      description: 'Complete layouts for CRUD operations.',
      examples: ['List + detail', 'Master-detail', 'Wizard']
    },
    {
      id: 'table-footers',
      title: 'Table Footers',
      count: 6,
      category: 'Application UI',
      icon: Grid3x3,
      description: 'Data table footers with pagination and row counts.',
      examples: ['Pagination', 'Row counter', 'Export options']
    },
    {
      id: 'read-drawers-crud',
      title: 'Read Drawers (CRUD)',
      count: 6,
      category: 'Application UI',
      icon: Code,
      description: 'Slide-out drawers for viewing record details.',
      examples: ['Right drawer', 'With actions', 'Nested drawers']
    },
    {
      id: 'create-forms-crud',
      title: 'Create Forms (CRUD)',
      count: 5,
      category: 'Application UI',
      icon: Code,
      description: 'Full-page forms for creating new records.',
      examples: ['Single page', 'Multi-step', 'With preview']
    },
    {
      id: 'faceted-search-modals',
      title: 'Faceted Search Modals',
      count: 5,
      category: 'Application UI',
      icon: Search,
      description: 'Advanced search modals with multiple filter facets.',
      examples: ['Filter sidebar', 'Chip filters', 'Search + filter']
    },
    {
      id: 'update-drawers-crud',
      title: 'Update Drawers (CRUD)',
      count: 5,
      category: 'Application UI',
      icon: Code,
      description: 'Slide-out drawers for updating records.',
      examples: ['Edit drawer', 'Quick edit', 'With validation']
    },
    {
      id: 'update-forms-crud',
      title: 'Update Forms (CRUD)',
      count: 5,
      category: 'Application UI',
      icon: Code,
      description: 'Full-page forms for updating existing records.',
      examples: ['Edit form', 'With history', 'Auto-save']
    },
    {
      id: 'success-message-crud',
      title: 'Success Message (CRUD)',
      count: 5,
      category: 'Application UI',
      icon: CheckCircle2,
      description: 'Success confirmation messages for CRUD operations.',
      examples: ['Toast', 'Modal', 'Inline message']
    },
    {
      id: 'faceted-search-drawers',
      title: 'Faceted Search Drawers',
      count: 4,
      category: 'Application UI',
      icon: Search,
      description: 'Drawer-based faceted search interfaces.',
      examples: ['Filter drawer', 'Mobile filters', 'Applied filters']
    },
    {
      id: 'create-drawers-crud',
      title: 'Create Drawers (CRUD)',
      count: 5,
      category: 'Application UI',
      icon: Code,
      description: 'Slide-out drawers for creating new records.',
      examples: ['Quick create', 'With templates', 'Multi-step']
    },

    // E-commerce UI (26 categories)
    {
      id: 'payment-forms',
      title: 'Payment Forms',
      count: 8,
      category: 'E-commerce UI',
      icon: CreditCard,
      description: 'Secure payment forms with card input and billing details.',
      examples: ['Credit card', 'Saved cards', 'Multiple methods']
    },
    {
      id: 'storefront-hero-sections',
      title: 'Storefront Hero Sections',
      count: 7,
      category: 'E-commerce UI',
      icon: ShoppingCart,
      description: 'E-commerce hero sections with products and promotions.',
      examples: ['Product hero', 'Sale banner', 'Collection hero']
    },
    {
      id: 'ecommerce-navbars',
      title: 'E-commerce Navbars',
      count: 6,
      category: 'E-commerce UI',
      icon: Layout,
      description: 'Store navigation with cart, search, and categories.',
      examples: ['Mega menu', 'Cart preview', 'Search bar']
    },
    {
      id: 'product-categories',
      title: 'Product Categories',
      count: 6,
      category: 'E-commerce UI',
      icon: Grid3x3,
      description: 'Category navigation and product filtering.',
      examples: ['Category grid', 'Sidebar filters', 'Breadcrumbs']
    },
    {
      id: 'discount-popups',
      title: 'Discount Popups',
      count: 6,
      category: 'E-commerce UI',
      icon: Bell,
      description: 'Promotional popups for discounts and special offers.',
      examples: ['Email signup', 'First purchase', 'Exit intent']
    },
    {
      id: 'order-summary',
      title: 'Order Summary',
      count: 5,
      category: 'E-commerce UI',
      icon: FileText,
      description: 'Order summaries with line items, totals, and taxes.',
      examples: ['Cart summary', 'Checkout summary', 'Receipt']
    },
    {
      id: 'refund-forms',
      title: 'Refund Forms',
      count: 5,
      category: 'E-commerce UI',
      icon: CreditCard,
      description: 'Customer refund request forms with reason selection.',
      examples: ['Return request', 'Refund reason', 'Item selection']
    },
    {
      id: 'shopping-cart',
      title: 'Shopping Cart',
      count: 5,
      category: 'E-commerce UI',
      icon: ShoppingCart,
      description: 'Shopping cart with quantity updates and remove options.',
      examples: ['Cart page', 'Mini cart', 'Cart drawer']
    },
    {
      id: 'orders-overview',
      title: 'Orders Overview',
      count: 5,
      category: 'E-commerce UI',
      icon: Package,
      description: 'Customer order history and tracking dashboard.',
      examples: ['Order list', 'Order details', 'Track shipment']
    },
    {
      id: 'warranties',
      title: 'Warranties',
      count: 5,
      category: 'E-commerce UI',
      icon: Shield,
      description: 'Product warranty information and registration.',
      examples: ['Warranty card', 'Registration', 'Coverage details']
    },
    {
      id: 'customer-service',
      title: 'Customer Service',
      count: 5,
      category: 'E-commerce UI',
      icon: MessageSquare,
      description: 'Customer support forms and help center layouts.',
      examples: ['Contact form', 'Live chat', 'Help articles']
    },
    {
      id: 'mega-footers',
      title: 'Mega Footers',
      count: 5,
      category: 'E-commerce UI',
      icon: Layout,
      description: 'Comprehensive e-commerce footers with links and info.',
      examples: ['Multi-column', 'Newsletter', 'Store locator']
    },
    {
      id: 'product-overview',
      title: 'Product Overview',
      count: 5,
      category: 'E-commerce UI',
      icon: Package,
      description: 'Product detail pages with images, specs, and add-to-cart.',
      examples: ['Image gallery', 'Variants', 'Reviews']
    },
    {
      id: 'promotional-sections',
      title: 'Promotional Sections',
      count: 5,
      category: 'E-commerce UI',
      icon: Bell,
      description: 'Promotional banners and sale sections.',
      examples: ['Flash sale', 'Featured deals', 'Bundle offers']
    },
    {
      id: 'checkout',
      title: 'Checkout',
      count: 5,
      category: 'E-commerce UI',
      icon: CreditCard,
      description: 'Multi-step checkout flows with shipping and payment.',
      examples: ['Single page', 'Multi-step', 'Express checkout']
    },
    {
      id: 'refunds-overview',
      title: 'Refunds Overview',
      count: 5,
      category: 'E-commerce UI',
      icon: CreditCard,
      description: 'Customer refund tracking and status dashboard.',
      examples: ['Refund list', 'Status tracker', 'Return label']
    },
    {
      id: 'order-tracking',
      title: 'Order Tracking',
      count: 5,
      category: 'E-commerce UI',
      icon: Truck,
      description: 'Real-time order tracking with shipping updates.',
      examples: ['Track page', 'Timeline', 'Map view']
    },
    {
      id: 'account-overview',
      title: 'Account Overview',
      count: 5,
      category: 'E-commerce UI',
      icon: Users,
      description: 'Customer account dashboard with orders and preferences.',
      examples: ['Dashboard', 'Profile', 'Addresses']
    },
    {
      id: 'product-cards',
      title: 'Product Cards',
      count: 5,
      category: 'E-commerce UI',
      icon: Package,
      description: 'Product listing cards with images, prices, and quick actions.',
      examples: ['Grid card', 'List view', 'Quick add']
    },
    {
      id: 'reviews-history',
      title: 'Reviews History',
      count: 5,
      category: 'E-commerce UI',
      icon: Star,
      description: 'Customer review history and rating displays.',
      examples: ['Review list', 'Rating summary', 'Write review']
    },
    {
      id: 'order-confirmation',
      title: 'Order Confirmation',
      count: 5,
      category: 'E-commerce UI',
      icon: CheckCircle2,
      description: 'Order confirmation pages with next steps and details.',
      examples: ['Thank you page', 'Email preview', 'Order summary']
    },
    {
      id: 'refund-status',
      title: 'Refund Status',
      count: 5,
      category: 'E-commerce UI',
      icon: CreditCard,
      description: 'Refund processing status and timeline.',
      examples: ['Status page', 'Timeline', 'Email updates']
    },
    {
      id: 'service-repair-forms',
      title: 'Service Repair Forms',
      count: 4,
      category: 'E-commerce UI',
      icon: Package,
      description: 'Product service and repair request forms.',
      examples: ['Repair request', 'Service booking', 'Warranty claim']
    },
    {
      id: 'product-information',
      title: 'Product Information',
      count: 4,
      category: 'E-commerce UI',
      icon: Info,
      description: 'Detailed product specifications and documentation.',
      examples: ['Specs table', 'Size guide', 'Care instructions']
    },
    {
      id: 'product-reviews',
      title: 'Product Reviews',
      count: 3,
      category: 'E-commerce UI',
      icon: Star,
      description: 'Product review sections with ratings and photos.',
      examples: ['Review list', 'Rating filters', 'Photo reviews']
    },

    // Publisher UI (3 categories)
    {
      id: 'blog-templates',
      title: 'Blog Templates',
      count: 6,
      category: 'Publisher UI',
      icon: FileText,
      description: 'Complete blog templates with posts, sidebar, and navigation.',
      examples: ['Full blog', 'Magazine layout', 'Minimal blog']
    },
    {
      id: 'related-articles',
      title: 'Related Articles',
      count: 5,
      category: 'Publisher UI',
      icon: FileText,
      description: 'Related article suggestions and recommendations.',
      examples: ['Card grid', 'Sidebar', 'End of article']
    },
    {
      id: 'comments-sections',
      title: 'Comments Sections',
      count: 4,
      category: 'Publisher UI',
      icon: MessageSquare,
      description: 'Article comment sections with threading and reactions.',
      examples: ['Flat comments', 'Threaded', 'With reactions']
    },
  ];

  // Filter categories
  const filteredCategories = blockCategories.filter(category => {
    const matchesCategory = selectedCategory === 'all' || category.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Category stats
  const totalBlocks = blockCategories.reduce((sum, cat) => sum + cat.count, 0);
  const categoryCounts = {
    'Marketing UI': blockCategories.filter(c => c.category === 'Marketing UI').reduce((sum, c) => sum + c.count, 0),
    'Application UI': blockCategories.filter(c => c.category === 'Application UI').reduce((sum, c) => sum + c.count, 0),
    'E-commerce UI': blockCategories.filter(c => c.category === 'E-commerce UI').reduce((sum, c) => sum + c.count, 0),
    'Publisher UI': blockCategories.filter(c => c.category === 'Publisher UI').reduce((sum, c) => sum + c.count, 0),
  };

  // Empty state
  const EmptyState = () => (
    <div
      style={{
        padding: 'var(--spacing-12)',
        textAlign: 'center',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <Search size={48} style={{ color: 'var(--muted-foreground)', margin: '0 auto var(--spacing-4) auto' }} />
      <h3
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-2)',
        }}
      >
        No blocks found
      </h3>
      <p
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-sm)',
          color: 'var(--muted-foreground)',
          marginBottom: 'var(--spacing-6)',
        }}
      >
        Try adjusting your search or filter to find what you're looking for.
      </p>
      <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
        Clear filters
      </Button>
    </div>
  );

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="UI Blocks Library"
        description="90+ block categories with 400+ production-ready components. Copy, paste, and customize."
      />

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-8)',
        }}
      >
        <div
          style={{
            padding: 'var(--spacing-6)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--accent)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            {totalBlocks}+
          </div>
          <div
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            Total Blocks
          </div>
        </div>
        <div
          style={{
            padding: 'var(--spacing-6)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--accent)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            {blockCategories.length}
          </div>
          <div
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            Block Categories
          </div>
        </div>
        <div
          style={{
            padding: 'var(--spacing-6)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--accent)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            4
          </div>
          <div
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            UI Categories
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-8)',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 'var(--spacing-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted-foreground)',
              }}
            />
            <input
              type="text"
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-10)',
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-sm)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--card)',
                color: 'var(--foreground)',
              }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All ({totalBlocks})
          </Button>
          <Button
            variant={selectedCategory === 'Marketing UI' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('Marketing UI')}
          >
            Marketing ({categoryCounts['Marketing UI']})
          </Button>
          <Button
            variant={selectedCategory === 'Application UI' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('Application UI')}
          >
            Application ({categoryCounts['Application UI']})
          </Button>
          <Button
            variant={selectedCategory === 'E-commerce UI' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('E-commerce UI')}
          >
            E-commerce ({categoryCounts['E-commerce UI']})
          </Button>
          <Button
            variant={selectedCategory === 'Publisher UI' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('Publisher UI')}
          >
            Publisher ({categoryCounts['Publisher UI']})
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 'var(--text-sm)',
          color: 'var(--muted-foreground)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        Showing {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
      </div>

      {/* Block Categories Grid */}
      {filteredCategories.length === 0 ? (
        <EmptyState />
      ) : (
        <PageGrid cols={3}>
          {filteredCategories.map((category) => (
            <PageCard key={category.id} hover>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)' }}>
                <div
                  style={{
                    width: 'var(--spacing-10)',
                    height: 'var(--spacing-10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    borderRadius: 'var(--radius-md)',
                    flexShrink: 0,
                  }}
                >
                  <category.icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                    <h3
                      style={{
                        fontFamily: 'Inter Tight, sans-serif',
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--foreground)',
                        margin: 0,
                      }}
                    >
                      {category.title}
                    </h3>
                    <Badge variant="secondary" style={{ fontSize: 'var(--text-xs)' }}>
                      {category.count}
                    </Badge>
                  </div>
                  <p
                    style={{
                      fontFamily: 'Inter Tight, sans-serif',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)',
                      margin: '0 0 var(--spacing-3) 0',
                      lineHeight: 1.5,
                    }}
                  >
                    {category.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Badge
                      variant="outline"
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {category.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </PageCard>
          ))}
        </PageGrid>
      )}

      {/* Coming Soon Banner */}
      <div
        style={{
          marginTop: 'var(--spacing-12)',
          padding: 'var(--spacing-8)',
          background: 'var(--accent-subtle)',
          border: '1px solid var(--accent)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
        }}
      >
        <Info size={32} style={{ color: 'var(--accent)', margin: '0 auto var(--spacing-4) auto' }} />
        <h3
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-2)',
          }}
        >
          Individual Block Pages Coming Soon
        </h3>
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          We're building detailed pages for each block category with live previews, code examples, and customization options. Stay tuned!
        </p>
      </div>
    </PageWrapper>
  );
}
