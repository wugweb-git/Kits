import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Check, Copy, ChevronRight, Zap, Code2, Heart } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { Button } from '../../wugweb/Button';

export function EmbedBadgesDoc() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);
  
  const { isMobile, isTablet } = useBreakpoint();

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // Badge variants with GA tracking
  const badges = [
    {
      id: 'designed-by-dark',
      name: 'Designed by Wugweb',
      theme: 'Dark',
      size: 'Large',
      html: `<a href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=designed-by" target="_blank" rel="noopener noreferrer">
  <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="40" rx="8" fill="#121212"/>
    <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#2B2B2B"/>
    <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
    <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
    <text x="30" y="16" font-family="Inter Tight, sans-serif" font-size="10" font-weight="500" fill="#A1A1A1">DESIGNED BY</text>
    <text x="30" y="28" font-family="Inter Tight, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF">Wugweb</text>
  </svg>
</a>`,
      preview: (
        <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="40" rx="8" fill="#121212"/>
          <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#2B2B2B"/>
          <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
          <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
          <text x="30" y="16" fontFamily="Inter Tight, sans-serif" fontSize="10" fontWeight="500" fill="#A1A1A1">DESIGNED BY</text>
          <text x="30" y="28" fontFamily="Inter Tight, sans-serif" fontSize="13" fontWeight="600" fill="#FFFFFF">Wugweb</text>
        </svg>
      ),
    },
    {
      id: 'powered-by-dark',
      name: 'Powered by Wugweb',
      theme: 'Dark',
      size: 'Large',
      html: `<a href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=powered-by" target="_blank" rel="noopener noreferrer">
  <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="40" rx="8" fill="#121212"/>
    <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#2B2B2B"/>
    <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
    <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
    <text x="30" y="16" font-family="Inter Tight, sans-serif" font-size="10" font-weight="500" fill="#A1A1A1">POWERED BY</text>
    <text x="30" y="28" font-family="Inter Tight, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF">Wugweb</text>
  </svg>
</a>`,
      preview: (
        <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="40" rx="8" fill="#121212"/>
          <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#2B2B2B"/>
          <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
          <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
          <text x="30" y="16" fontFamily="Inter Tight, sans-serif" fontSize="10" fontWeight="500" fill="#A1A1A1">POWERED BY</text>
          <text x="30" y="28" fontFamily="Inter Tight, sans-serif" fontSize="13" fontWeight="600" fill="#FFFFFF">Wugweb</text>
        </svg>
      ),
    },
    {
      id: 'built-with-dark',
      name: 'Built with Wugweb',
      theme: 'Dark',
      size: 'Large',
      html: `<a href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=built-with" target="_blank" rel="noopener noreferrer">
  <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="40" rx="8" fill="#121212"/>
    <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#2B2B2B"/>
    <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
    <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
    <text x="30" y="16" font-family="Inter Tight, sans-serif" font-size="10" font-weight="500" fill="#A1A1A1">BUILT WITH</text>
    <text x="30" y="28" font-family="Inter Tight, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF">Wugweb</text>
  </svg>
</a>`,
      preview: (
        <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="40" rx="8" fill="#121212"/>
          <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#2B2B2B"/>
          <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
          <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
          <text x="30" y="16" fontFamily="Inter Tight, sans-serif" fontSize="10" fontWeight="500" fill="#A1A1A1">BUILT WITH</text>
          <text x="30" y="28" fontFamily="Inter Tight, sans-serif" fontSize="13" fontWeight="600" fill="#FFFFFF">Wugweb</text>
        </svg>
      ),
    },
    {
      id: 'made-with-light',
      name: 'Made with Wugweb',
      theme: 'Light',
      size: 'Large',
      html: `<a href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=made-with" target="_blank" rel="noopener noreferrer">
  <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="40" rx="8" fill="#FFFFFF"/>
    <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#E5E5E5"/>
    <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
    <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
    <text x="30" y="16" font-family="Inter Tight, sans-serif" font-size="10" font-weight="500" fill="#737373">MADE WITH</text>
    <text x="30" y="28" font-family="Inter Tight, sans-serif" font-size="13" font-weight="600" fill="#0A0A0A">Wugweb</text>
  </svg>
</a>`,
      preview: (
        <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="40" rx="8" fill="#FFFFFF"/>
          <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#E5E5E5"/>
          <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
          <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
          <text x="30" y="16" fontFamily="Inter Tight, sans-serif" fontSize="10" fontWeight="500" fill="#737373">MADE WITH</text>
          <text x="30" y="28" fontFamily="Inter Tight, sans-serif" fontSize="13" fontWeight="600" fill="#0A0A0A">Wugweb</text>
        </svg>
      ),
    },
    {
      id: 'designed-by-small',
      name: 'Designed by Wugweb',
      theme: 'Dark',
      size: 'Small',
      html: `<a href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=designed-by-sm" target="_blank" rel="noopener noreferrer">
  <svg width="140" height="28" viewBox="0 0 140 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="140" height="28" rx="6" fill="#121212"/>
    <rect x="0.5" y="0.5" width="139" height="27" rx="5.5" stroke="#2B2B2B"/>
    <path d="M8 14L10 10L12 14L10 18L8 14Z" fill="#FFBE1A"/>
    <path d="M12 14L14 10L16 14L14 18L12 14Z" fill="#FFBE1A" opacity="0.6"/>
    <text x="22" y="12" font-family="Inter Tight, sans-serif" font-size="8" font-weight="500" fill="#A1A1A1">DESIGNED BY</text>
    <text x="22" y="20" font-family="Inter Tight, sans-serif" font-size="10" font-weight="600" fill="#FFFFFF">Wugweb</text>
  </svg>
</a>`,
      preview: (
        <svg width="140" height="28" viewBox="0 0 140 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="140" height="28" rx="6" fill="#121212"/>
          <rect x="0.5" y="0.5" width="139" height="27" rx="5.5" stroke="#2B2B2B"/>
          <path d="M8 14L10 10L12 14L10 18L8 14Z" fill="#FFBE1A"/>
          <path d="M12 14L14 10L16 14L14 18L12 14Z" fill="#FFBE1A" opacity="0.6"/>
          <text x="22" y="12" fontFamily="Inter Tight, sans-serif" fontSize="8" fontWeight="500" fill="#A1A1A1">DESIGNED BY</text>
          <text x="22" y="20" fontFamily="Inter Tight, sans-serif" fontSize="10" fontWeight="600" fill="#FFFFFF">Wugweb</text>
        </svg>
      ),
    },
    {
      id: 'minimal-dark',
      name: 'Wugweb',
      theme: 'Dark',
      size: 'Minimal',
      html: `<a href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=minimal" target="_blank" rel="noopener noreferrer">
  <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="28" rx="6" fill="#121212"/>
    <rect x="0.5" y="0.5" width="99" height="27" rx="5.5" stroke="#2B2B2B"/>
    <path d="M8 14L10 10L12 14L10 18L8 14Z" fill="#FFBE1A"/>
    <path d="M12 14L14 10L16 14L14 18L12 14Z" fill="#FFBE1A" opacity="0.6"/>
    <text x="22" y="17" font-family="Inter Tight, sans-serif" font-size="11" font-weight="600" fill="#FFFFFF">Wugweb</text>
  </svg>
</a>`,
      preview: (
        <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="28" rx="6" fill="#121212"/>
          <rect x="0.5" y="0.5" width="99" height="27" rx="5.5" stroke="#2B2B2B"/>
          <path d="M8 14L10 10L12 14L10 18L8 14Z" fill="#FFBE1A"/>
          <path d="M12 14L14 10L16 14L14 18L12 14Z" fill="#FFBE1A" opacity="0.6"/>
          <text x="22" y="17" fontFamily="Inter Tight, sans-serif" fontSize="11" fontWeight="600" fill="#FFFFFF">Wugweb</text>
        </svg>
      ),
    },
    {
      id: 'accent-badge',
      name: 'Designed by Wugweb',
      theme: 'Accent',
      size: 'Large',
      html: `<a href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=accent" target="_blank" rel="noopener noreferrer">
  <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="40" rx="8" fill="#FFBE1A"/>
    <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#0A0A0A"/>
    <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#0A0A0A" opacity="0.6"/>
    <text x="30" y="16" font-family="Inter Tight, sans-serif" font-size="10" font-weight="500" fill="#0A0A0A" opacity="0.7">DESIGNED BY</text>
    <text x="30" y="28" font-family="Inter Tight, sans-serif" font-size="13" font-weight="700" fill="#0A0A0A">Wugweb</text>
  </svg>
</a>`,
      preview: (
        <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="40" rx="8" fill="#FFBE1A"/>
          <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#0A0A0A"/>
          <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#0A0A0A" opacity="0.6"/>
          <text x="30" y="16" fontFamily="Inter Tight, sans-serif" fontSize="10" fontWeight="500" fill="#0A0A0A" opacity="0.7">DESIGNED BY</text>
          <text x="30" y="28" fontFamily="Inter Tight, sans-serif" fontSize="13" fontWeight="700" fill="#0A0A0A">Wugweb</text>
        </svg>
      ),
    },
  ];

  return (
    <div 
      className="min-h-screen w-full"
      style={{ 
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        paddingLeft: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-padding-desktop-right)',
        paddingRight: isMobile ? 'var(--layout-padding-mobile)' : isTablet ? 'var(--layout-padding-tablet)' : 'var(--layout-padding-desktop-right)',
        paddingTop: spacing(isMobile ? 8 : isTablet ? 10 : 12),
        paddingBottom: spacing(isMobile ? 12 : isTablet ? 16 : 20),
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing(isMobile ? 8 : 12) }}>
        <div className="flex items-center gap-2" style={{ marginBottom: spacing(3) }}>
          <span style={{ 
            color: 'var(--muted-foreground)',
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '14px',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Resources
          </span>
          <ChevronRight size={16} color="var(--muted-foreground)" />
          <span style={{ 
            color: 'var(--foreground)',
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '14px',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Embed Badges
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: '1.2',
              marginBottom: spacing(2),
            }}>
              Embed Badges
            </h1>
            <p style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '18px',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--muted-foreground)',
              lineHeight: '1.6',
            }}>
              Show your support for Wugweb with these embeddable badges. Includes Google Analytics tracking for backlink monitoring.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" style={{
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
              backgroundColor: 'var(--accent-subtle)',
            }}>
              <Heart size={14} />
              Attribution
            </Badge>
            <Button variant="outline" size="sm" onClick={copyPageLink}>
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card style={{ 
        marginBottom: spacing(8),
        backgroundColor: 'var(--accent-subtle)',
        borderColor: 'var(--accent)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
          <div className="flex items-start gap-4">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-2)',
              backgroundColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Zap size={20} color="var(--accent-foreground)" />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: '16px',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: spacing(2),
                color: 'var(--foreground)',
              }}>
                Tracking Enabled
              </h3>
              <p style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: '14px',
                color: 'var(--muted-foreground)',
                lineHeight: '1.6',
              }}>
                All badges include UTM parameters for Google Analytics tracking. Monitor backlinks with <code style={{
                  backgroundColor: 'var(--background)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-1)',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                }}>utm_source=badge</code>, <code style={{
                  backgroundColor: 'var(--background)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-1)',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                }}>utm_medium=referral</code>, and campaign-specific identifiers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 gap-6" style={{ marginBottom: spacing(8) }}>
        {badges.map((badge) => (
          <Card key={badge.id} style={{ 
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-3)',
          }}>
            <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Preview */}
                <div style={{ 
                  flex: '0 0 auto',
                  backgroundColor: badge.theme === 'Light' ? 'var(--background)' : 'var(--surface-800)',
                  borderRadius: 'var(--radius-3)',
                  padding: 'var(--spacing-8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)',
                }}>
                  {badge.preview}
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <div className="flex items-center gap-2" style={{ marginBottom: spacing(2) }}>
                      <h3 style={{
                        fontFamily: 'Inter Tight, sans-serif',
                        fontSize: '18px',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--foreground)',
                      }}>
                        {badge.name}
                      </h3>
                      <Badge variant="outline" style={{
                        borderColor: 'var(--border)',
                        color: 'var(--muted-foreground)',
                        fontSize: '11px',
                      }}>
                        {badge.theme}
                      </Badge>
                      <Badge variant="outline" style={{
                        borderColor: 'var(--border)',
                        color: 'var(--muted-foreground)',
                        fontSize: '11px',
                      }}>
                        {badge.size}
                      </Badge>
                    </div>
                    <p style={{
                      fontFamily: 'Inter Tight, sans-serif',
                      fontSize: '14px',
                      color: 'var(--muted-foreground)',
                      lineHeight: '1.6',
                    }}>
                      Copy and paste this code into your website's HTML.
                    </p>
                  </div>

                  {/* Code Block */}
                  <div style={{
                    backgroundColor: 'var(--surface-800)',
                    borderRadius: 'var(--radius-2)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}>
                    <div className="flex items-center justify-between" style={{
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: 'var(--background)',
                    }}>
                      <div className="flex items-center gap-2">
                        <Code2 size={14} color="var(--muted-foreground)" />
                        <span style={{
                          fontFamily: 'Inter Tight, sans-serif',
                          fontSize: '12px',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--muted-foreground)',
                        }}>
                          HTML
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(badge.html, badge.id)}
                        style={{
                          padding: '4px 8px',
                          height: 'auto',
                        }}
                      >
                        {copiedCode === badge.id ? (
                          <>
                            <Check size={14} />
                            <span style={{ fontSize: '12px' }}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span style={{ fontSize: '12px' }}>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <div style={{ padding: 'var(--spacing-4)', overflowX: 'auto' }}>
                      <pre style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: 'var(--foreground)',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}>
                        {badge.html}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Guidelines */}
      <Card style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
          <h3 style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: '20px',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: spacing(6),
          }}>
            Tracking Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: '14px',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: spacing(3),
                color: 'var(--foreground)',
              }}>
                Google Analytics Parameters
              </h4>
              <div className="flex flex-col gap-2">
                <div style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '13px',
                  color: 'var(--muted-foreground)',
                }}>
                  <code style={{
                    backgroundColor: 'var(--surface-800)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-1)',
                    fontFamily: 'monospace',
                    color: 'var(--accent)',
                  }}>utm_source</code> = badge
                </div>
                <div style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '13px',
                  color: 'var(--muted-foreground)',
                }}>
                  <code style={{
                    backgroundColor: 'var(--surface-800)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-1)',
                    fontFamily: 'monospace',
                    color: 'var(--accent)',
                  }}>utm_medium</code> = referral
                </div>
                <div style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '13px',
                  color: 'var(--muted-foreground)',
                }}>
                  <code style={{
                    backgroundColor: 'var(--surface-800)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-1)',
                    fontFamily: 'monospace',
                    color: 'var(--accent)',
                  }}>utm_campaign</code> = designed-by / powered-by / built-with / etc.
                </div>
              </div>
            </div>

            <div>
              <h4 style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: '14px',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: spacing(3),
                color: 'var(--foreground)',
              }}>
                How to Track in GA4
              </h4>
              <ol style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: '13px',
                color: 'var(--muted-foreground)',
                paddingLeft: 'var(--spacing-5)',
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-2)',
              }}>
                <li>Navigate to Reports → Acquisition → Traffic acquisition</li>
                <li>Add filter: <code style={{ backgroundColor: 'var(--surface-800)', padding: '2px 4px', borderRadius: 'var(--radius-1)', fontFamily: 'monospace', fontSize: '12px' }}>Session source/medium = badge / referral</code></li>
                <li>View campaign breakdown for badge performance</li>
              </ol>
            </div>
          </div>

          <div style={{ 
            marginTop: spacing(6),
            padding: 'var(--spacing-4)',
            backgroundColor: 'var(--surface-800)',
            borderRadius: 'var(--radius-2)',
            border: '1px solid var(--border)',
          }}>
            <p style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: '13px',
              color: 'var(--muted-foreground)',
              margin: 0,
              lineHeight: '1.6',
            }}>
              <strong style={{ color: 'var(--foreground)' }}>Note:</strong> All badges link to <code style={{
                backgroundColor: 'var(--background)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-1)',
                fontFamily: 'monospace',
              }}>https://wugweb.com</code> with tracking parameters. Update the domain to match your website if needed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
