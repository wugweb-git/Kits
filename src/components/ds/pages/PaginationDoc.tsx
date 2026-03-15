import React from 'react';
import { Copy, Check, ChevronRight, Info, FileCode, ChevronLeft, ChevronsLeft, ChevronsRight, Code2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Pagination } from '../../wugweb/Pagination';

export function PaginationDoc() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(10);
  const [showFirstLast, setShowFirstLast] = React.useState(false);
  const [showEllipsis, setShowEllipsis] = React.useState(true);
  const [compactMode, setCompactMode] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [showAdvancedTokens, setShowAdvancedTokens] = React.useState(false);
  const [expandedCodeBlocks, setExpandedCodeBlocks] = React.useState<{ [key: string]: boolean }>({
    react: true,
    html: false,
    css: false,
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(label);
      toast.success(`Copied ${label}`);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const toggleCodeBlock = (key: string) => {
    setExpandedCodeBlocks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const coreTokens = [
    { name: 'Active Page BG', token: '--accent', value: 'rgba(255, 190, 26, 1.00)', category: 'Color' },
    { name: 'Active Page Text', token: '--accent-foreground', value: 'rgba(0, 0, 0, 1.00)', category: 'Color' },
    { name: 'Default Page Text', token: '--foreground', value: 'rgba(255, 255, 255, 1.00)', category: 'Color' },
    { name: 'Disabled Text', token: '--muted-foreground', value: 'rgba(161, 161, 161, 1.00)', category: 'Color' },
    { name: 'Border Color', token: '--border', value: 'rgba(50, 50, 50, 1.00)', category: 'Color' },
    { name: 'Hover Background', token: '--surface-700', value: 'rgba(38, 38, 38, 1.00)', category: 'Color' },
    { name: 'Border Radius', token: '--radius-sm', value: '4px', category: 'Border' },
    { name: 'Button Spacing', token: '--spacing-1', value: '8px', category: 'Spacing' },
  ];

  const advancedTokens = [
    { name: 'Font Family', token: 'Inter Tight', value: 'Inter Tight, sans-serif', category: 'Typography' },
    { name: 'Font Size (sm)', token: '--text-xs', value: '12px', category: 'Typography' },
    { name: 'Font Size (md)', token: '--text-sm', value: '14px', category: 'Typography' },
    { name: 'Font Size (lg)', token: '--text-base', value: '16px', category: 'Typography' },
    { name: 'Font Weight (active)', token: '--font-weight-medium', value: '500', category: 'Typography' },
    { name: 'Padding (sm)', token: '4px 8px', value: '4px 8px', category: 'Spacing' },
    { name: 'Padding (md)', token: '6px 10px', value: '6px 10px', category: 'Spacing' },
    { name: 'Padding (lg)', token: '8px 12px', value: '8px 12px', category: 'Spacing' },
    { name: 'Transition Duration', token: '--motion-duration-fast', value: '80ms', category: 'Motion' },
    { name: 'Transition Easing', token: '--motion-easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', category: 'Motion' },
    { name: 'Focus Ring', token: '--ring', value: 'rgba(255, 190, 26, 0.5)', category: 'Color' },
  ];

  const allTokens = showAdvancedTokens ? [...coreTokens, ...advancedTokens] : coreTokens;

  const reactCode = `import { Pagination } from './components/wugweb/Pagination';

function MyPage() {
  const [currentPage, setCurrentPage] = React.useState(1);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={${totalPages}}
      onChange={setCurrentPage}
      size="${selectedSize}"
      ${showFirstLast ? 'showFirstLast' : ''}
      ${!showEllipsis ? 'showEllipsis={false}' : ''}
      ${compactMode ? 'compact' : ''}
      ${disabled ? 'disabled' : ''}
      ariaLabel="Pagination navigation"
    />
  );
}`;

  const htmlCode = `<nav aria-label="Pagination navigation">
  <!-- First Page Button (optional) -->
  <button aria-label="First page" ${currentPage === 1 ? 'disabled' : ''}>
    <svg><!-- Double chevron left icon --></svg>
  </button>
  
  <!-- Previous Button -->
  <button aria-label="Previous page" ${currentPage === 1 ? 'disabled' : ''}>
    <svg><!-- Chevron left icon --></svg>
  </button>
  
  <!-- Page Number 1 -->
  <button aria-label="Page 1" aria-current="${currentPage === 1 ? 'page' : 'false'}">
    1
  </button>
  
  <!-- Ellipsis (when needed) -->
  <div aria-hidden="true">...</div>
  
  <!-- Current Page -->
  <button aria-label="Page ${currentPage}" aria-current="page" class="active">
    ${currentPage}
  </button>
  
  <!-- More pages... -->
  
  <!-- Next Button -->
  <button aria-label="Next page" ${currentPage === totalPages ? 'disabled' : ''}>
    <svg><!-- Chevron right icon --></svg>
  </button>
  
  <!-- Last Page Button (optional) -->
  <button aria-label="Last page" ${currentPage === totalPages ? 'disabled' : ''}>
    <svg><!-- Double chevron right icon --></svg>
  </button>
</nav>`;

  const cssCode = `/* Pagination Navigation */
nav[aria-label*="Pagination"] {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-family: Inter Tight, sans-serif;
}

/* Base Button Styles */
.pagination-button {
  font-family: Inter Tight, sans-serif;
  border-radius: var(--radius-sm);
  transition: all var(--motion-duration-fast) var(--motion-easing-standard);
  cursor: pointer;
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

/* Navigation Buttons (Prev/Next/First/Last) */
.pagination-nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px; /* md size */
  background: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
}

.pagination-nav-button:hover:not(:disabled) {
  background: var(--surface-700);
  border-color: var(--accent);
}

/* Page Number Buttons */
.pagination-page-button {
  padding: 6px 10px; /* md size */
  font-size: var(--text-sm);
  background: transparent;
  border: 1px solid transparent;
  color: var(--foreground);
  min-width: 28px;
  text-align: center;
}

.pagination-page-button:hover:not(:disabled):not(.active) {
  background: var(--surface-700);
  border-color: var(--border);
}

/* Active Page */
.pagination-page-button.active {
  background: var(--accent);
  color: var(--accent-foreground);
  border-color: var(--accent);
  font-weight: var(--font-weight-medium);
}

/* Ellipsis */
.pagination-ellipsis {
  padding: 6px 8px;
  font-size: var(--text-sm);
  color: var(--muted-foreground);
  user-select: none;
}

/* Focus State */
.pagination-button:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Size Variants */
.pagination-sm .pagination-nav-button {
  padding: 4px;
}

.pagination-sm .pagination-page-button {
  padding: 4px 8px;
  font-size: var(--text-xs);
  min-width: 24px;
}

.pagination-lg .pagination-nav-button {
  padding: 8px;
}

.pagination-lg .pagination-page-button {
  padding: 8px 12px;
  font-size: var(--text-base);
  min-width: 32px;
}

/* Responsive - Compact Mode */
@media (max-width: 768px) {
  nav[aria-label*="Pagination"] {
    gap: var(--spacing-2);
  }
}`;

  return (
    <>
      {/* Responsive Styles */}
      <style>{`
        .pagination-doc-root {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          font-family: Inter Tight, sans-serif;
          box-sizing: border-box;
        }

        .pagination-doc-section {
          margin-bottom: var(--spacing-8);
        }

        .pagination-doc-card {
          background: var(--surface-800);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-5);
          width: 100%;
          box-sizing: border-box;
        }

        .pagination-doc-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-5);
          width: 100%;
        }

        .pagination-doc-grid-auto {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-4);
          width: 100%;
        }

        @media (max-width: 680px) {
          .pagination-doc-grid-auto {
            grid-template-columns: 1fr;
          }
        }

        .pagination-doc-token-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-3);
          width: 100%;
        }

        @media (max-width: 680px) {
          .pagination-doc-token-grid {
            grid-template-columns: 1fr;
          }
        }

        .pagination-doc-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
          width: 100%;
        }

        /* Tablet - 768px to 1024px */
        @media (max-width: 1024px) {
          .pagination-doc-section {
            margin-bottom: var(--spacing-6);
          }

          .pagination-doc-grid-2 {
            grid-template-columns: 1fr;
            gap: var(--spacing-4);
          }
          
          .pagination-doc-card {
            padding: var(--spacing-4);
          }
          
          .pagination-doc-token-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .pagination-doc-grid-auto {
            grid-template-columns: 1fr;
          }
        }

        /* Mobile - up to 768px */
        @media (max-width: 768px) {
          .pagination-doc-section {
            margin-bottom: var(--spacing-5);
          }

          .pagination-doc-card {
            padding: var(--spacing-3);
          }

          .pagination-doc-grid-2,
          .pagination-doc-grid-auto {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }

          .pagination-doc-token-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-2);
          }

          .pagination-doc-controls {
            grid-template-columns: 1fr;
            gap: var(--spacing-3);
          }

          h1 {
            font-size: var(--text-2xl) !important;
          }

          h2 {
            font-size: var(--text-xl) !important;
          }

          h3 {
            font-size: var(--text-lg) !important;
          }
        }

        /* Extra small mobile - up to 480px */
        @media (max-width: 480px) {
          .pagination-doc-card {
            padding: var(--spacing-2);
          }

          .pagination-doc-section {
            margin-bottom: var(--spacing-4);
          }

          .pagination-doc-token-grid {
            grid-template-columns: 1fr;
          }

          .pagination-doc-grid-2 {
            gap: var(--spacing-2);
          }

          .pagination-doc-controls {
            gap: var(--spacing-2);
          }

          h1 {
            font-size: var(--text-xl) !important;
          }

          h2 {
            font-size: var(--text-lg) !important;
          }
        }

        .code-block-collapsed {
          max-height: 0;
          overflow: hidden;
          transition: max-height 180ms var(--motion-easing-emphasized);
        }

        .code-block-expanded {
          max-height: 1500px;
          overflow: hidden;
          transition: max-height 180ms var(--motion-easing-emphasized);
        }

        .anatomy-card {
          padding: var(--spacing-3);
          background: var(--surface-900);
          border: 2px dashed var(--accent);
          border-radius: var(--radius-md);
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .anatomy-card {
            padding: var(--spacing-2);
          }
        }

        .pagination-preview-wrapper {
          display: flex;
          justify-content: center;
          overflow-x: auto;
          padding: var(--spacing-4);
          width: 100%;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 768px) {
          .pagination-preview-wrapper {
            justify-content: flex-start;
            padding: var(--spacing-2);
          }
        }

        /* Ensure pagination components don't break layout on mobile */
        .pagination-preview-wrapper nav {
          flex-shrink: 0;
          min-width: max-content;
        }

        /* Make anatomy labels more compact on mobile */
        @media (max-width: 768px) {
          .anatomy-card-label {
            font-size: var(--text-xs) !important;
            margin-bottom: var(--spacing-1) !important;
          }

          .pagination-preview-display {
            padding: var(--spacing-3) !important;
          }
        }

        @media (max-width: 480px) {
          .pagination-preview-display {
            padding: var(--spacing-2) !important;
          }

          /* Ensure buttons in controls wrap properly */
          button {
            white-space: nowrap;
            min-width: auto;
          }
        }

        /* Better text wrapping on all mobile sizes */
        @media (max-width: 768px) {
          p {
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          /* Ensure anatomy section descriptions wrap properly */
          .pagination-doc-grid-2 > div {
            min-width: 0;
          }
        }

        /* Very small screens - ensure nothing overflows */
        @media (max-width: 375px) {
          .anatomy-card {
            padding: var(--spacing-1) !important;
          }

          .pagination-preview-wrapper {
            padding: var(--spacing-1) !important;
          }
        }
      `}</style>

      <div className="pagination-doc-root">
        
        {/* Header */}
        <header style={{
          marginBottom: 'var(--spacing-8)',
          paddingBottom: 'var(--spacing-6)',
          borderBottom: '1px solid var(--border)',
          width: '100%',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            marginBottom: 'var(--spacing-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--muted-foreground)',
            flexWrap: 'wrap',
          }}>
            <span>Components</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--foreground)' }}>Pagination</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--spacing-4)',
            flexWrap: 'wrap',
            width: '100%',
          }}>
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <h1 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                margin: 0,
                marginBottom: 'var(--spacing-2)',
                color: 'var(--foreground)',
              }}>
                Pagination
              </h1>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--muted-foreground)',
                margin: 0,
                lineHeight: '1.6',
              }}>
                A navigation component that allows users to navigate through pages of content. Supports multiple sizes, ellipsis for long ranges, first/last navigation, and compact mobile mode.
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--spacing-2)',
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'inline-flex',
                padding: '8px 16px',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--accent)',
                flexShrink: 0,
              }}>
                v1.0.0
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
                padding: '8px 16px',
                background: 'var(--success-subtle)',
                border: '1px solid var(--success)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--success)',
                flexShrink: 0,
              }}>
                <FileCode size={14} />
                Figma Import
              </div>
            </div>
          </div>
        </header>

        {/* Anatomy Section */}
        <section className="pagination-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Anatomy
          </h2>

          <div className="pagination-doc-card">
            <div className="pagination-doc-grid-2">
              {/* Visual Anatomy */}
              <div style={{ width: '100%' }}>
                <div style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-4)',
                }}>
                  Pagination Structure
                </div>

                {/* Anatomical Breakdown */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-4)',
                  width: '100%',
                }}>
                  {/* Basic Pagination */}
                  <div className="anatomy-card">
                    <div className="anatomy-card-label" style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      Basic Pagination
                    </div>
                    <div className="pagination-preview-wrapper">
                      <Pagination currentPage={1} totalPages={5} size="md" />
                    </div>
                  </div>

                  {/* With Ellipsis */}
                  <div className="anatomy-card">
                    <div className="anatomy-card-label" style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      With Ellipsis (Long Range)
                    </div>
                    <div className="pagination-preview-wrapper">
                      <Pagination currentPage={5} totalPages={20} size="md" />
                    </div>
                  </div>

                  {/* Size Variants */}
                  <div className="anatomy-card">
                    <div className="anatomy-card-label" style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-3)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      Size Variants
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-3)',
                      width: '100%',
                    }}>
                      <div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          marginBottom: 'var(--spacing-2)',
                        }}>
                          Small (12px)
                        </div>
                        <div className="pagination-preview-wrapper">
                          <Pagination currentPage={2} totalPages={5} size="sm" />
                        </div>
                      </div>
                      <div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          marginBottom: 'var(--spacing-2)',
                        }}>
                          Medium (14px)
                        </div>
                        <div className="pagination-preview-wrapper">
                          <Pagination currentPage={2} totalPages={5} size="md" />
                        </div>
                      </div>
                      <div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--muted-foreground)',
                          marginBottom: 'var(--spacing-2)',
                        }}>
                          Large (16px)
                        </div>
                        <div className="pagination-preview-wrapper">
                          <Pagination currentPage={2} totalPages={5} size="lg" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Mode */}
                  <div className="anatomy-card">
                    <div className="anatomy-card-label" style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--accent)',
                      marginBottom: 'var(--spacing-2)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      Compact Mode (Mobile)
                    </div>
                    <div className="pagination-preview-wrapper">
                      <Pagination currentPage={3} totalPages={10} size="md" compact />
                    </div>
                  </div>
                </div>
              </div>

              {/* Anatomy Labels */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
                width: '100%',
              }}>
                <AnatomyItem
                  label="Navigation Container"
                  description="Semantic <nav> with aria-label"
                  token="font-family: Inter Tight"
                />
                <AnatomyItem
                  label="Previous/Next Buttons"
                  description="Chevron icons for navigation"
                  token="padding: 6px, border: 1px var(--border)"
                />
                <AnatomyItem
                  label="First/Last Buttons"
                  description="Optional double-chevron navigation"
                  token="same as prev/next"
                />
                <AnatomyItem
                  label="Page Number Buttons"
                  description="Clickable page numbers"
                  token="padding: 6px 10px, min-width: 28px"
                />
                <AnatomyItem
                  label="Active Page"
                  description="Current page with highlight"
                  token="bg: var(--accent), font-weight: medium"
                />
                <AnatomyItem
                  label="Ellipsis"
                  description="... indicator for hidden pages"
                  token="color: var(--muted-foreground)"
                />
                <AnatomyItem
                  label="Hover State"
                  description="Background changes on hover"
                  token="bg: var(--surface-700), 80ms transition"
                />
                <AnatomyItem
                  label="Disabled State"
                  description="Faded appearance when disabled"
                  token="opacity: 0.4, cursor: not-allowed"
                />
                <AnatomyItem
                  label="Focus Ring"
                  description="Keyboard focus indicator"
                  token="outline: 2px var(--ring)"
                />
                <AnatomyItem
                  label="Button Spacing"
                  description="Gap between all elements"
                  token="gap: var(--spacing-1)"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Preview */}
        <section className="pagination-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Interactive Preview
          </h2>

          <div className="pagination-doc-card">
            {/* Controls */}
            <div className="pagination-doc-controls" style={{
              marginBottom: 'var(--spacing-5)',
            }}>
              {/* Size Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Size
                </label>
                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-1)',
                  flexWrap: 'wrap',
                }}>
                  {(['sm', 'md', 'lg'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '8px 16px',
                        fontSize: 'var(--text-sm)',
                        fontFamily: 'Inter Tight, sans-serif',
                        fontWeight: 'var(--font-weight-medium)',
                        background: selectedSize === size ? 'var(--accent)' : 'var(--surface-700)',
                        color: selectedSize === size ? 'var(--accent-foreground)' : 'var(--foreground)',
                        border: '1px solid',
                        borderColor: selectedSize === size ? 'var(--accent)' : 'var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Pages Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Total Pages
                </label>
                <select
                  value={totalPages}
                  onChange={(e) => {
                    const newTotal = parseInt(e.target.value);
                    setTotalPages(newTotal);
                    if (currentPage > newTotal) setCurrentPage(newTotal);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'Inter Tight, sans-serif',
                    background: 'var(--surface-700)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="5">5 pages</option>
                  <option value="10">10 pages</option>
                  <option value="20">20 pages</option>
                  <option value="50">50 pages</option>
                  <option value="100">100 pages</option>
                </select>
              </div>

              {/* Current Page Control */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Current Page
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= totalPages) {
                      setCurrentPage(value);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'Inter Tight, sans-serif',
                    background: 'var(--surface-700)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
              </div>

              {/* Options */}
              <div style={{ width: '100%' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  Options
                </label>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-2)',
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                  }}>
                    <input
                      type="checkbox"
                      checked={showFirstLast}
                      onChange={(e) => setShowFirstLast(e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                    Show first/last
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                  }}>
                    <input
                      type="checkbox"
                      checked={showEllipsis}
                      onChange={(e) => setShowEllipsis(e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                    Show ellipsis
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                  }}>
                    <input
                      type="checkbox"
                      checked={compactMode}
                      onChange={(e) => setCompactMode(e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                    Compact mode
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                  }}>
                    <input
                      type="checkbox"
                      checked={disabled}
                      onChange={(e) => setDisabled(e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                    Disabled
                  </label>
                </div>
              </div>
            </div>

            {/* Preview Display */}
            <div className="pagination-preview-display" style={{
              background: 'var(--surface-900)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-6)',
              overflow: 'auto',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <div style={{
                marginBottom: 'var(--spacing-2)',
                fontSize: 'var(--text-xs)',
                color: 'var(--muted-foreground)',
              }}>
                Page {currentPage} of {totalPages}
              </div>
              <div className="pagination-preview-wrapper">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={setCurrentPage}
                  size={selectedSize}
                  showFirstLast={showFirstLast}
                  showEllipsis={showEllipsis}
                  compact={compactMode}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="pagination-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Code Examples
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
            width: '100%',
          }}>
            <CodeBlock
              title="React"
              code={reactCode}
              language="tsx"
              copied={copiedCode === 'React code'}
              onCopy={() => copyToClipboard(reactCode, 'React code')}
              expanded={expandedCodeBlocks.react}
              onToggle={() => toggleCodeBlock('react')}
            />

            <CodeBlock
              title="HTML"
              code={htmlCode}
              language="html"
              copied={copiedCode === 'HTML code'}
              onCopy={() => copyToClipboard(htmlCode, 'HTML code')}
              expanded={expandedCodeBlocks.html}
              onToggle={() => toggleCodeBlock('html')}
            />

            <CodeBlock
              title="CSS with Design Tokens"
              code={cssCode}
              language="css"
              copied={copiedCode === 'CSS code'}
              onCopy={() => copyToClipboard(cssCode, 'CSS code')}
              expanded={expandedCodeBlocks.css}
              onToggle={() => toggleCodeBlock('css')}
            />
          </div>
        </section>

        {/* Design Tokens */}
        <section className="pagination-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Design Tokens
          </h2>

          <div className="pagination-doc-card">
            <div className="pagination-doc-token-grid">
              {allTokens.map((token) => (
                <button
                  key={token.name}
                  onClick={() => copyToClipboard(typeof token.token === 'string' && token.token.startsWith('--') ? `var(${token.token})` : token.token, token.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-4)',
                    background: 'var(--surface-900)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                    textAlign: 'left',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'var(--surface-700)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--surface-900)';
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      background: 'var(--surface-800)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--muted-foreground)',
                      marginBottom: '6px',
                    }}>
                      {token.category}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground)',
                      marginBottom: '4px',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {token.name}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontFamily: 'monospace',
                      color: 'var(--accent)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {token.token.startsWith('--') ? `var(${token.token})` : token.token}
                    </div>
                  </div>
                  {copiedCode === token.name ? (
                    <Check size={18} style={{ color: 'var(--success)', flexShrink: 0, marginLeft: 'var(--spacing-2)' }} />
                  ) : (
                    <Copy size={18} style={{ color: 'var(--muted-foreground)', flexShrink: 0, marginLeft: 'var(--spacing-2)' }} />
                  )}
                </button>
              ))}
            </div>

            {/* Show More Toggle */}
            <div style={{
              marginTop: 'var(--spacing-4)',
              textAlign: 'center',
            }}>
              <button
                onClick={() => setShowAdvancedTokens(!showAdvancedTokens)}
                style={{
                  padding: '8px 16px',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'Inter Tight, sans-serif',
                  fontWeight: 'var(--font-weight-medium)',
                  background: 'var(--surface-700)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
                }}
              >
                {showAdvancedTokens ? 'Show Less' : 'Show Advanced Tokens'}
              </button>
            </div>

            <div style={{
              marginTop: 'var(--spacing-5)',
              padding: 'var(--spacing-4)',
              background: 'var(--accent-subtle)',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              gap: 'var(--spacing-2)',
            }}>
              <Info size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                lineHeight: '1.6',
              }}>
                All pagination tokens are defined in <code style={{
                  padding: '3px 8px',
                  background: 'var(--surface-900)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'monospace',
                  color: 'var(--accent)',
                }}>/styles/globals.css</code>. Colors and spacing follow the 8-point grid system.
              </p>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="pagination-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Usage Guidelines
          </h2>

          <div className="pagination-doc-grid-auto">
            <GuidelineCard
              title="✅ DO: Show current page clearly"
              description="Always make the active page visually distinct with a strong color contrast. Users need to know exactly where they are in the content."
              type="do"
            />
            <GuidelineCard
              title="✅ DO: Use ellipsis for long ranges"
              description="When showing many pages, use ellipsis (...) to indicate hidden pages. Show first, last, and pages around the current position."
              type="do"
            />
            <GuidelineCard
              title="❌ DON'T: Show too many page numbers"
              description="Avoid displaying dozens of page numbers. This creates visual clutter and makes the interface hard to use. Limit to 7-9 visible page numbers maximum."
              type="dont"
            />
            <GuidelineCard
              title="❌ DON'T: Use on infinite scroll"
              description="Don't add pagination to content that uses infinite scrolling. These patterns conflict and confuse users about how to navigate the content."
              type="dont"
            />
          </div>
        </section>

        {/* Accessibility */}
        <section className="pagination-doc-section">
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-5)',
            color: 'var(--foreground)',
          }}>
            Accessibility
          </h2>

          <div className="pagination-doc-card">
            <div style={{
              display: 'grid',
              gap: 'var(--spacing-5)',
              width: '100%',
            }}>
              <AccessibilityItem
                title="Semantic HTML & ARIA"
                items={[
                  'Wrap pagination in <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);"><nav></code> with descriptive <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-label</code>',
                  'Add <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-current="page"</code> to the active page button',
                  'Use descriptive <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">aria-label</code> on navigation buttons ("Previous page", "Next page", "First page", "Last page")',
                  'Buttons must be <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);"><button></code> elements, not divs or spans',
                  'Use <code style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace; color: var(--accent);">disabled</code> attribute on buttons that cannot be activated',
                ]}
              />
              <AccessibilityItem
                title="Keyboard Navigation"
                items={[
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Tab</kbd> - Navigate through page buttons and navigation controls',
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Enter</kbd> or <kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Space</kbd> - Activate focused button to navigate to page',
                  '<kbd style="background: var(--surface-700); padding: 2px 6px; border-radius: var(--radius-sm); font-family: monospace;">Shift + Tab</kbd> - Navigate backwards through controls',
                  'Left/Right arrow keys (optional) - Move between adjacent pages',
                  'Visible focus indicator required on all buttons (var(--ring))',
                ]}
              />
              <AccessibilityItem
                title="Screen Reader Support"
                items={[
                  'Screen readers announce "Pagination navigation" from aria-label',
                  'Current page is announced as "current page" via aria-current',
                  'Disabled buttons are skipped or announced as "disabled"',
                  'Page numbers are announced: "Page 1", "Page 2", etc.',
                  'Navigation buttons announce their purpose clearly',
                ]}
              />
              <AccessibilityItem
                title="Visual Accessibility"
                items={[
                  'Active page must have at least 3:1 contrast with inactive pages',
                  'Text must have at least 4.5:1 contrast ratio (WCAG AA)',
                  'Hover/focus states must be distinguishable without relying on color alone',
                  'Disabled buttons should be visually muted (40% opacity)',
                  'Focus ring must be visible with 3:1 contrast (var(--ring))',
                ]}
              />
              <AccessibilityItem
                title="Mobile & Touch"
                items={[
                  'Touch targets must be at least 44×44px on mobile devices',
                  'Ensure adequate spacing between buttons (8px minimum)',
                  'Consider compact mode for narrow viewports (shows "Page X of Y")',
                  'Buttons should be large enough to tap accurately',
                  'Maintain readability at all viewport sizes',
                ]}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function AnatomyItem({ label, description, token }: { label: string; description: string; token: string }) {
  return (
    <div style={{
      padding: 'var(--spacing-4)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-semibold)',
        color: 'var(--foreground)',
        marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--muted-foreground)',
        marginBottom: 'var(--spacing-2)',
        lineHeight: '1.5',
      }}>
        {description}
      </div>
      <code style={{
        fontSize: 'var(--text-xs)',
        fontFamily: 'monospace',
        color: 'var(--accent)',
        background: 'var(--surface-800)',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-block',
      }}>
        {token}
      </code>
    </div>
  );
}

function CodeBlock({ 
  title, 
  code, 
  language, 
  copied, 
  onCopy,
  expanded,
  onToggle,
}: { 
  title: string; 
  code: string; 
  language: string; 
  copied: boolean; 
  onCopy: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-3)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-900)',
        flexWrap: 'wrap',
        gap: 'var(--spacing-2)',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--foreground)',
        }}>
          {title}
        </span>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-2)',
        }}>
          <button
            onClick={onToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              padding: '8px 12px',
              fontSize: 'var(--text-sm)',
              fontFamily: 'Inter Tight, sans-serif',
              fontWeight: 'var(--font-weight-medium)',
              background: 'var(--surface-700)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
            }}
          >
            <Code2 size={16} />
            <span>{expanded ? 'Hide' : 'Show'}</span>
          </button>
          <button
            onClick={onCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              padding: '8px 16px',
              fontSize: 'var(--text-sm)',
              fontFamily: 'Inter Tight, sans-serif',
              fontWeight: 'var(--font-weight-medium)',
              background: copied ? 'var(--success-subtle)' : 'var(--surface-700)',
              color: copied ? 'var(--success)' : 'var(--foreground)',
              border: '1px solid',
              borderColor: copied ? 'var(--success)' : 'var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all var(--motion-duration-fast) var(--motion-easing-standard)',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <div className={expanded ? 'code-block-expanded' : 'code-block-collapsed'}>
        <pre style={{
          margin: 0,
          padding: 'var(--spacing-5)',
          fontSize: 'var(--text-sm)',
          fontFamily: 'monospace',
          color: 'var(--foreground)',
          overflowX: 'auto',
          lineHeight: '1.7',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

function GuidelineCard({ title, description, type }: { title: string; description: string; type: 'do' | 'dont' }) {
  return (
    <div style={{
      background: 'var(--surface-800)',
      border: '2px solid',
      borderColor: type === 'do' ? 'var(--success)' : 'var(--destructive)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-5)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        margin: 0,
        marginBottom: 'var(--spacing-3)',
        color: type === 'do' ? 'var(--success)' : 'var(--destructive)',
      }}>
        {title}
      </h3>
      <p style={{
        margin: 0,
        fontSize: 'var(--text-base)',
        color: 'var(--foreground)',
        lineHeight: '1.6',
      }}>
        {description}
      </p>
    </div>
  );
}

function AccessibilityItem({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{
      padding: 'var(--spacing-5)',
      background: 'var(--surface-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-weight-semibold)',
        margin: 0,
        marginBottom: 'var(--spacing-4)',
        color: 'var(--foreground)',
      }}>
        {title}
      </h3>
      <ul style={{
        margin: 0,
        paddingLeft: 'var(--spacing-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
      }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              lineHeight: '1.7',
            }}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ul>
    </div>
  );
}
