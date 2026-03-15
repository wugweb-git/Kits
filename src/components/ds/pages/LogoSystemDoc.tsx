import React from 'react';
import { Logo, LogoBrand, LogoState, LogoSize, LogoTheme, LogoContainer } from '../../wugweb/Logo';
import { Copy, Check } from 'lucide-react';

export function LogoSystemDoc() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    brand: 'wugweb' as LogoBrand,
    state: 'all' as LogoState | 'all',
    size: 'all' as LogoSize | 'all',
    theme: 'all' as LogoTheme | 'all',
    container: 'all' as LogoContainer | 'all',
  });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const brands: LogoBrand[] = ['wugweb', 'stayweb', 'nookweb', 'docweb', 'kits'];
  const states: LogoState[] = ['icon', 'full'];
  const sizes: LogoSize[] = ['s', 'm', 'l'];
  const themes: LogoTheme[] = ['dark', 'light'];
  const containers: LogoContainer[] = ['yes', 'no'];

  // Generate all combinations
  const allVariants = brands.flatMap(brand =>
    states.flatMap(state =>
      sizes.flatMap(size =>
        themes.flatMap(theme =>
          containers.map(container => ({
            brand,
            state,
            size,
            theme,
            container,
            id: `${brand}-${state}-${size}-${theme}-${container}`,
          }))
        )
      )
    )
  );

  // Filter variants
  const filteredVariants = allVariants.filter(variant => {
    if (filters.brand !== 'wugweb' && variant.brand !== filters.brand) return false;
    if (filters.state !== 'all' && variant.state !== filters.state) return false;
    if (filters.size !== 'all' && variant.size !== filters.size) return false;
    if (filters.theme !== 'all' && variant.theme !== filters.theme) return false;
    if (filters.container !== 'all' && variant.container !== filters.container) return false;
    return true;
  });

  const generateCode = (variant: typeof allVariants[0]) => {
    return `<Logo
  brand="${variant.brand}"
  state="${variant.state}"
  size="${variant.size}"
  theme="${variant.theme}"
  container="${variant.container}"
/>`;
  };

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'Inter Tight, sans-serif',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ 
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-2)',
          margin: 0,
        }}>
          Logo System
        </h1>
        <p style={{ 
          fontSize: 'var(--text-lg)',
          color: 'var(--muted-foreground)',
          margin: 0,
          marginTop: 'var(--spacing-2)',
        }}>
          Flexible logo component system for all Wugweb brands with comprehensive customization options.
        </p>
      </div>

      {/* Overview */}
      <div style={{ 
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-3)',
        padding: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-6)',
      }}>
        <h2 style={{ 
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-4)',
          margin: 0,
        }}>
          Configuration Options
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-4)',
        }}>
          {/* Brand */}
          <div>
            <h3 style={{ 
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
              margin: 0,
            }}>
              Brand
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
              {brands.map(brand => (
                <code key={brand} style={{ 
                  fontSize: 'var(--text-xs)',
                  padding: '4px 8px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-1)',
                  fontFamily: 'monospace',
                }}>
                  {brand}
                </code>
              ))}
            </div>
          </div>

          {/* State */}
          <div>
            <h3 style={{ 
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
              margin: 0,
            }}>
              State
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
              {states.map(state => (
                <code key={state} style={{ 
                  fontSize: 'var(--text-xs)',
                  padding: '4px 8px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-1)',
                  fontFamily: 'monospace',
                }}>
                  {state}
                </code>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 style={{ 
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
              margin: 0,
            }}>
              Size
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
              {sizes.map(size => (
                <code key={size} style={{ 
                  fontSize: 'var(--text-xs)',
                  padding: '4px 8px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-1)',
                  fontFamily: 'monospace',
                }}>
                  {size}
                </code>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <h3 style={{ 
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
              margin: 0,
            }}>
              Theme
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
              {themes.map(theme => (
                <code key={theme} style={{ 
                  fontSize: 'var(--text-xs)',
                  padding: '4px 8px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-1)',
                  fontFamily: 'monospace',
                }}>
                  {theme}
                </code>
              ))}
            </div>
          </div>

          {/* Container */}
          <div>
            <h3 style={{ 
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
              margin: 0,
            }}>
              Container
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
              {containers.map(container => (
                <code key={container} style={{ 
                  fontSize: 'var(--text-xs)',
                  padding: '4px 8px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-1)',
                  fontFamily: 'monospace',
                }}>
                  {container}
                </code>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-3)',
        padding: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-6)',
      }}>
        <h2 style={{ 
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-4)',
          margin: 0,
        }}>
          Filter Variants
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-4)',
        }}>
          {/* Brand Filter */}
          <div>
            <label style={{ 
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
            }}>
              Brand
            </label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value as LogoBrand })}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 'var(--text-sm)',
                fontFamily: 'Inter Tight, sans-serif',
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-2)',
                cursor: 'pointer',
              }}
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label style={{ 
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
            }}>
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value as LogoState | 'all' })}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 'var(--text-sm)',
                fontFamily: 'Inter Tight, sans-serif',
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-2)',
                cursor: 'pointer',
              }}
            >
              <option value="all">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label style={{ 
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
            }}>
              Size
            </label>
            <select
              value={filters.size}
              onChange={(e) => setFilters({ ...filters, size: e.target.value as LogoSize | 'all' })}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 'var(--text-sm)',
                fontFamily: 'Inter Tight, sans-serif',
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-2)',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Sizes</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Theme Filter */}
          <div>
            <label style={{ 
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
            }}>
              Theme
            </label>
            <select
              value={filters.theme}
              onChange={(e) => setFilters({ ...filters, theme: e.target.value as LogoTheme | 'all' })}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 'var(--text-sm)',
                fontFamily: 'Inter Tight, sans-serif',
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-2)',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Themes</option>
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          {/* Container Filter */}
          <div>
            <label style={{ 
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
            }}>
              Container
            </label>
            <select
              value={filters.container}
              onChange={(e) => setFilters({ ...filters, container: e.target.value as LogoContainer | 'all' })}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 'var(--text-sm)',
                fontFamily: 'Inter Tight, sans-serif',
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-2)',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Containers</option>
              {containers.map(container => (
                <option key={container} value={container}>{container}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ 
          marginTop: 'var(--spacing-4)',
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--accent-subtle)',
          borderRadius: 'var(--radius-2)',
          border: '1px solid var(--accent)',
        }}>
          <p style={{ 
            fontSize: 'var(--text-sm)',
            color: 'var(--foreground)',
            margin: 0,
          }}>
            Showing <strong>{filteredVariants.length}</strong> of <strong>{allVariants.length}</strong> total variants
          </p>
        </div>
      </div>

      {/* Variants Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 'var(--spacing-4)',
      }}>
        {filteredVariants.map((variant) => {
          const code = generateCode(variant);
          const isCopied = copiedCode === variant.id;
          
          return (
            <div
              key={variant.id}
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-3)',
                padding: 'var(--spacing-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
              }}
            >
              {/* Preview */}
              <div
                style={{
                  backgroundColor: variant.theme === 'dark' ? '#0A0A0A' : '#FAFAFA',
                  borderRadius: 'var(--radius-2)',
                  padding: 'var(--spacing-6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '120px',
                }}
              >
                <Logo
                  brand={variant.brand}
                  state={variant.state}
                  size={variant.size}
                  theme={variant.theme}
                  container={variant.container}
                />
              </div>

              {/* Info */}
              <div>
                <div style={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-1)',
                  marginBottom: 'var(--spacing-2)',
                }}>
                  <span style={{ 
                    fontSize: 'var(--text-xs)',
                    padding: '2px 6px',
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    borderRadius: 'var(--radius-1)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}>
                    {variant.brand}
                  </span>
                  <span style={{ 
                    fontSize: 'var(--text-xs)',
                    padding: '2px 6px',
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    borderRadius: 'var(--radius-1)',
                  }}>
                    {variant.state}
                  </span>
                  <span style={{ 
                    fontSize: 'var(--text-xs)',
                    padding: '2px 6px',
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    borderRadius: 'var(--radius-1)',
                  }}>
                    {variant.size}
                  </span>
                  <span style={{ 
                    fontSize: 'var(--text-xs)',
                    padding: '2px 6px',
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    borderRadius: 'var(--radius-1)',
                  }}>
                    {variant.theme}
                  </span>
                  <span style={{ 
                    fontSize: 'var(--text-xs)',
                    padding: '2px 6px',
                    backgroundColor: 'var(--muted)',
                    color: 'var(--muted-foreground)',
                    borderRadius: 'var(--radius-1)',
                  }}>
                    container: {variant.container}
                  </span>
                </div>

                {/* Code */}
                <div style={{ position: 'relative' }}>
                  <pre style={{
                    fontSize: 'var(--text-xs)',
                    padding: 'var(--spacing-3)',
                    backgroundColor: 'var(--muted)',
                    borderRadius: 'var(--radius-2)',
                    overflow: 'auto',
                    margin: 0,
                    fontFamily: 'monospace',
                    color: 'var(--foreground)',
                  }}>
                    {code}
                  </pre>
                  <button
                    onClick={() => handleCopy(code, variant.id)}
                    style={{
                      position: 'absolute',
                      top: 'var(--spacing-2)',
                      right: 'var(--spacing-2)',
                      padding: '6px',
                      backgroundColor: isCopied ? 'var(--success)' : 'var(--accent)',
                      color: isCopied ? 'var(--success-foreground)' : 'var(--accent-foreground)',
                      border: 'none',
                      borderRadius: 'var(--radius-1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    aria-label="Copy code"
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVariants.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-8)',
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-3)',
        }}>
          <p style={{ 
            fontSize: 'var(--text-lg)',
            color: 'var(--muted-foreground)',
            margin: 0,
          }}>
            No variants match the current filters.
          </p>
        </div>
      )}
    </div>
  );
}
