import React from 'react';
import { EmbedBadge, BadgeVariant, BadgeSize } from '../../wugweb/EmbedBadge';
import { Copy, Check } from 'lucide-react';

export function EmbedBadgesDoc() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const variants: BadgeVariant[] = ['designed', 'empowered'];
  const sizes: BadgeSize[] = ['s', 'm', 'l'];

  const generateHTMLCode = (variant: BadgeVariant, size: BadgeSize) => {
    const utmCampaign = variant === 'designed' ? 'designed-by' : 'empowered-by';
    const badgeText = variant === 'designed' ? 'Designed by' : 'Empowered by';
    
    return `<!-- ${badgeText} Wugweb Badge -->
<a href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=${utmCampaign}" target="_blank" rel="noopener noreferrer">
  <img src="https://wugweb.com/badges/${variant}-${size}.svg" alt="${badgeText} Wugweb" />
</a>`;
  };

  const generateReactCode = (variant: BadgeVariant, size: BadgeSize) => {
    const utmCampaign = variant === 'designed' ? 'designed-by' : 'empowered-by';
    
    return `import { EmbedBadge } from './components/wugweb/EmbedBadge';

<EmbedBadge
  variant="${variant}"
  size="${size}"
  href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=${utmCampaign}"
  target="_blank"
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
          Embed Badges
        </h1>
        <p style={{ 
          fontSize: 'var(--text-lg)',
          color: 'var(--muted-foreground)',
          margin: 0,
          marginTop: 'var(--spacing-2)',
        }}>
          Show your support by embedding a Wugweb badge on your website or README with UTM tracking.
        </p>
      </div>

      {/* Introduction */}
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
          About These Badges
        </h2>
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-3)',
        }}>
          <p style={{ 
            fontSize: 'var(--text-base)',
            color: 'var(--foreground)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            These badges are designed to help you showcase your use of Wugweb design system. 
            They include UTM tracking parameters to help us understand how our community is using and sharing our work.
          </p>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-4)',
            marginTop: 'var(--spacing-2)',
          }}>
            <div style={{
              padding: 'var(--spacing-4)',
              backgroundColor: 'var(--accent-subtle)',
              borderRadius: 'var(--radius-2)',
              border: '1px solid var(--accent)',
            }}>
              <h3 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--accent)',
                marginBottom: 'var(--spacing-2)',
                margin: 0,
              }}>
                "Designed by" Variant
              </h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                margin: 0,
                lineHeight: 1.5,
              }}>
                Shows the W icon. Perfect for footer attribution or project credits.
              </p>
            </div>

            <div style={{
              padding: 'var(--spacing-4)',
              backgroundColor: 'var(--accent-subtle)',
              borderRadius: 'var(--radius-2)',
              border: '1px solid var(--accent)',
            }}>
              <h3 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--accent)',
                marginBottom: 'var(--spacing-2)',
                margin: 0,
              }}>
                "Empowered by" Variant
              </h3>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                margin: 0,
                lineHeight: 1.5,
              }}>
                Shows the full logo. Ideal for landing pages and documentation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Variants Grid */}
      {variants.map((variant) => (
        <div 
          key={variant}
          style={{ 
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-3)',
            padding: 'var(--spacing-6)',
            marginBottom: 'var(--spacing-6)',
          }}
        >
          <h2 style={{ 
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-4)',
            margin: 0,
            textTransform: 'capitalize',
          }}>
            {variant === 'designed' ? '"Designed by" Badge' : '"Empowered by" Badge'}
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--spacing-4)',
          }}>
            {sizes.map((size) => {
              const htmlCode = generateHTMLCode(variant, size);
              const reactCode = generateReactCode(variant, size);
              const htmlId = `${variant}-${size}-html`;
              const reactId = `${variant}-${size}-react`;
              
              return (
                <div
                  key={`${variant}-${size}`}
                  style={{
                    backgroundColor: 'var(--muted)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-2)',
                    padding: 'var(--spacing-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-4)',
                  }}
                >
                  {/* Size Label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--foreground)',
                    }}>
                      {size.toUpperCase()} Size
                    </span>
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      padding: '2px 6px',
                      backgroundColor: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                      borderRadius: 'var(--radius-1)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {size === 's' ? 'Small' : size === 'm' ? 'Medium' : 'Large'}
                    </span>
                  </div>

                  {/* Preview */}
                  <div style={{
                    backgroundColor: '#0A0A0A',
                    borderRadius: 'var(--radius-2)',
                    padding: 'var(--spacing-6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100px',
                  }}>
                    <EmbedBadge
                      variant={variant}
                      size={size}
                      href="https://wugweb.com"
                      target="_blank"
                    />
                  </div>

                  {/* HTML Code */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--spacing-2)',
                    }}>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--muted-foreground)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        HTML
                      </span>
                      <button
                        onClick={() => handleCopy(htmlCode, htmlId)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: copiedCode === htmlId ? 'var(--success)' : 'var(--accent)',
                          color: copiedCode === htmlId ? 'var(--success-foreground)' : 'var(--accent-foreground)',
                          border: 'none',
                          borderRadius: 'var(--radius-1)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'Inter Tight, sans-serif',
                          fontWeight: 'var(--font-weight-medium)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {copiedCode === htmlId ? (
                          <>
                            <Check size={12} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre style={{
                      fontSize: 'var(--text-xs)',
                      padding: 'var(--spacing-3)',
                      backgroundColor: 'var(--card)',
                      borderRadius: 'var(--radius-2)',
                      overflow: 'auto',
                      margin: 0,
                      fontFamily: 'monospace',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                      lineHeight: 1.5,
                    }}>
                      {htmlCode}
                    </pre>
                  </div>

                  {/* React Code */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--spacing-2)',
                    }}>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--muted-foreground)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        REACT
                      </span>
                      <button
                        onClick={() => handleCopy(reactCode, reactId)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: copiedCode === reactId ? 'var(--success)' : 'var(--accent)',
                          color: copiedCode === reactId ? 'var(--success-foreground)' : 'var(--accent-foreground)',
                          border: 'none',
                          borderRadius: 'var(--radius-1)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'Inter Tight, sans-serif',
                          fontWeight: 'var(--font-weight-medium)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {copiedCode === reactId ? (
                          <>
                            <Check size={12} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre style={{
                      fontSize: 'var(--text-xs)',
                      padding: 'var(--spacing-3)',
                      backgroundColor: 'var(--card)',
                      borderRadius: 'var(--radius-2)',
                      overflow: 'auto',
                      margin: 0,
                      fontFamily: 'monospace',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                      lineHeight: 1.5,
                    }}>
                      {reactCode}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Usage Guidelines */}
      <div style={{ 
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-3)',
        padding: 'var(--spacing-6)',
      }}>
        <h2 style={{ 
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-4)',
          margin: 0,
        }}>
          Usage Guidelines
        </h2>
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-3)',
        }}>
          <div>
            <h3 style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
              margin: 0,
            }}>
              Where to Place
            </h3>
            <ul style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              margin: 0,
              paddingLeft: 'var(--spacing-4)',
              lineHeight: 1.6,
            }}>
              <li>Footer sections of websites and web applications</li>
              <li>README files in GitHub repositories</li>
              <li>Documentation pages</li>
              <li>About or Credits pages</li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
              margin: 0,
            }}>
              UTM Tracking
            </h3>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              margin: 0,
              lineHeight: 1.6,
            }}>
              All badges include UTM parameters to help track referrals:
            </p>
            <ul style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              margin: 0,
              marginTop: 'var(--spacing-2)',
              paddingLeft: 'var(--spacing-4)',
              lineHeight: 1.6,
            }}>
              <li><code style={{ 
                backgroundColor: 'var(--muted)', 
                padding: '2px 4px', 
                borderRadius: 'var(--radius-1)',
                fontFamily: 'monospace',
              }}>utm_source=badge</code></li>
              <li><code style={{ 
                backgroundColor: 'var(--muted)', 
                padding: '2px 4px', 
                borderRadius: 'var(--radius-1)',
                fontFamily: 'monospace',
              }}>utm_medium=referral</code></li>
              <li><code style={{ 
                backgroundColor: 'var(--muted)', 
                padding: '2px 4px', 
                borderRadius: 'var(--radius-1)',
                fontFamily: 'monospace',
              }}>utm_campaign=designed-by</code> or <code style={{ 
                backgroundColor: 'var(--muted)', 
                padding: '2px 4px', 
                borderRadius: 'var(--radius-1)',
                fontFamily: 'monospace',
              }}>empowered-by</code></li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)',
              margin: 0,
            }}>
              License
            </h3>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              margin: 0,
              lineHeight: 1.6,
            }}>
              These badges are free to use on any project that utilizes the Wugweb design system. 
              Please keep the link to wugweb.com intact to help us grow our community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
