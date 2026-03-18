import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Check, ChevronRight, Package, Palette, Code2, FileText } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { Button } from '../../wugweb/Button';

interface ComponentStatus {
  name: string;
  category: 'Core' | 'Form' | 'Overlay' | 'Navigation' | 'Data Display' | 'Feedback';
  status: 'Complete' | 'In Progress' | 'Planned';
  hasDoc: boolean;
  designTokens: string[];
}

export function ComponentSummary() {
  const { isMobile, isTablet } = useBreakpoint();

  const components: ComponentStatus[] = [
    // Core Components
    { name: 'Button', category: 'Core', status: 'Complete', hasDoc: true, designTokens: ['--primary', '--secondary', '--accent'] },
    { name: 'Social Button', category: 'Core', status: 'Complete', hasDoc: true, designTokens: ['--primary', '--accent'] },
    { name: 'CTA Banner', category: 'Core', status: 'Complete', hasDoc: true, designTokens: ['--accent', '--radius-5'] },
    
    // Form Controls
    { name: 'Label', category: 'Form', status: 'Complete', hasDoc: false, designTokens: ['--foreground'] },
    { name: 'Input', category: 'Form', status: 'Complete', hasDoc: true, designTokens: ['--input-background', '--border', '--ring'] },
    { name: 'Textarea', category: 'Form', status: 'Complete', hasDoc: true, designTokens: ['--input-background', '--border', '--ring'] },
    { name: 'Checkbox', category: 'Form', status: 'Complete', hasDoc: true, designTokens: ['--primary', '--border', '--ring'] },
    { name: 'Radio Group', category: 'Form', status: 'Complete', hasDoc: true, designTokens: ['--primary', '--border', '--ring'] },
    { name: 'Switch', category: 'Form', status: 'Complete', hasDoc: true, designTokens: ['--primary', '--muted', '--ring'] },
    { name: 'Select', category: 'Form', status: 'Complete', hasDoc: true, designTokens: ['--popover', '--accent', '--border'] },
    
    // Overlays & Feedback
    { name: 'Dialog', category: 'Overlay', status: 'Complete', hasDoc: true, designTokens: ['--card', '--border', '--radius-3'] },
    { name: 'Toast', category: 'Feedback', status: 'Complete', hasDoc: true, designTokens: ['--popover', '--success', '--destructive'] },
  ];

  const getStatusColor = (status: ComponentStatus['status']) => {
    switch (status) {
      case 'Complete':
        return 'var(--success)';
      case 'In Progress':
        return 'var(--accent)';
      case 'Planned':
        return 'var(--muted-foreground)';
    }
  };

  const getCategoryCount = (category: ComponentStatus['category']) => {
    return components.filter(c => c.category === category).length;
  };

  const completedCount = components.filter(c => c.status === 'Complete').length;
  const inProgressCount = components.filter(c => c.status === 'In Progress').length;
  const plannedCount = components.filter(c => c.status === 'Planned').length;
  const totalCount = components.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

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
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Components
          </span>
          <ChevronRight size={16} color="var(--muted-foreground)" />
          <span style={{ 
            color: 'var(--foreground)',
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            Overview
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: isMobile ? 'var(--text-2xl)' : 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: '1.2',
              marginBottom: spacing(2),
            }}>
              Component Overview
            </h1>
            <p style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-regular)',
              color: 'var(--muted-foreground)',
              lineHeight: '1.6',
            }}>
              A comprehensive library of reusable components built with accessibility, customization, and best practices in mind.
            </p>

            {/* Badges */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-3)',
              flexWrap: 'wrap',
              marginTop: 'var(--spacing-4)',
            }}>
              <img 
                src="https://img.shields.io/npm/v/wugweb-kits?style=flat-square&color=0EA5E9" 
                alt="NPM Version"
                style={{ height: '20px' }}
              />
              <img 
                src="https://img.shields.io/npm/l/wugweb-kits?style=flat-square&color=0EA5E9" 
                alt="License"
                style={{ height: '20px' }}
              />
              <img 
                src="https://img.shields.io/badge/components-127+-0EA5E9?style=flat-square" 
                alt="Components Count"
                style={{ height: '20px' }}
              />
              <img 
                src="https://img.shields.io/badge/TypeScript-Ready-0EA5E9?style=flat-square" 
                alt="TypeScript"
                style={{ height: '20px' }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" style={{
              borderColor: 'var(--success)',
              color: 'var(--success)',
              backgroundColor: 'var(--success-subtle)',
            }}>
              {completionPercentage}% Complete
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: spacing(8) }}>
        <Card style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-3)',
        }}>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: spacing(3) }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-2)',
                backgroundColor: 'var(--accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Package size={20} color="var(--accent)" />
              </div>
              <div>
                <div style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--foreground)',
                }}>
                  {totalCount}
                </div>
              </div>
            </div>
            <div style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}>
              Total Components
            </div>
          </CardContent>
        </Card>

        <Card style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-3)',
        }}>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: spacing(3) }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-2)',
                backgroundColor: 'var(--success-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Check size={20} color="var(--success)" />
              </div>
              <div>
                <div style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--foreground)',
                }}>
                  {completedCount}
                </div>
              </div>
            </div>
            <div style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}>
              Completed
            </div>
          </CardContent>
        </Card>

        <Card style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-3)',
        }}>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: spacing(3) }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-2)',
                backgroundColor: 'var(--accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FileText size={20} color="var(--accent)" />
              </div>
              <div>
                <div style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--foreground)',
                }}>
                  {components.filter(c => c.hasDoc).length}
                </div>
              </div>
            </div>
            <div style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}>
              Documented
            </div>
          </CardContent>
        </Card>

        <Card style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-3)',
        }}>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: spacing(3) }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-2)',
                backgroundColor: 'var(--accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Palette size={20} color="var(--accent)" />
              </div>
              <div>
                <div style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--foreground)',
                }}>
                  100%
                </div>
              </div>
            </div>
            <div style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
            }}>
              Token Coverage
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Component List */}
      <Card style={{ 
        marginBottom: spacing(8),
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
          <h3 style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: spacing(6),
          }}>
            Component Library
          </h3>

          {['Core', 'Form', 'Overlay', 'Feedback'].map((category) => {
            const categoryComponents = components.filter(c => c.category === category);
            if (categoryComponents.length === 0) return null;

            return (
              <div key={category} style={{ marginBottom: spacing(6) }}>
                <div className="flex items-center gap-3" style={{ marginBottom: spacing(4) }}>
                  <h4 style={{
                    fontFamily: 'Inter Tight, sans-serif',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--foreground)',
                  }}>
                    {category}
                  </h4>
                  <Badge variant="outline" style={{
                    borderColor: 'var(--border)',
                    color: 'var(--muted-foreground)',
                  }}>
                    {categoryComponents.length} components
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {categoryComponents.map((component) => (
                    <div
                      key={component.name}
                      className="flex items-center justify-between p-3"
                      style={{
                        borderRadius: 'var(--radius-2)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface-800)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: getStatusColor(component.status),
                          }}
                        />
                        <div>
                          <div style={{
                            fontFamily: 'Inter Tight, sans-serif',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--foreground)',
                          }}>
                            {component.name}
                          </div>
                          <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                            {component.designTokens.slice(0, 3).map((token) => (
                              <code
                                key={token}
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: 'var(--text-xs)',
                                  color: 'var(--muted-foreground)',
                                  backgroundColor: 'var(--background)',
                                  padding: 'var(--spacing-1) var(--spacing-2)',
                                  borderRadius: 'var(--radius-1)',
                                }}
                              >
                                {token}
                              </code>
                            ))}
                            {component.designTokens.length > 3 && (
                              <span style={{
                                fontFamily: 'Inter Tight, sans-serif',
                                fontSize: 'var(--text-xs)',
                                color: 'var(--muted-foreground)',
                              }}>
                                +{component.designTokens.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {component.hasDoc && (
                          <Badge variant="outline" style={{
                            borderColor: 'var(--success)',
                            color: 'var(--success)',
                            backgroundColor: 'var(--success-subtle)',
                            fontSize: 'var(--text-xs)',
                          }}>
                            <FileText size={12} />
                            Docs
                          </Badge>
                        )}
                        <Badge variant="outline" style={{
                          borderColor: getStatusColor(component.status),
                          color: getStatusColor(component.status),
                          fontSize: 'var(--text-xs)',
                        }}>
                          {component.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Design Principles */}
      <Card style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-3)',
      }}>
        <CardContent style={{ padding: isMobile ? 'var(--spacing-6)' : 'var(--spacing-8)' }}>
          <h3 style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: spacing(6),
          }}>
            Design Principles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: spacing(3) }}>
                <Check size={16} color="var(--success)" />
                <h4 style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}>
                  CSS Variables First
                </h4>
              </div>
              <p style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                lineHeight: '1.6',
              }}>
                All components use CSS variables from <code style={{
                  backgroundColor: 'var(--surface-800)',
                  padding: 'var(--spacing-1) var(--spacing-2)',
                  borderRadius: 'var(--radius-1)',
                  fontFamily: 'monospace',
                  fontSize: 'var(--text-xs)',
                }}>/styles/global.css</code> for colors, spacing, typography, and borders.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: spacing(3) }}>
                <Check size={16} color="var(--success)" />
                <h4 style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}>
                  Inter Tight Typography
                </h4>
              </div>
              <p style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                lineHeight: '1.6',
              }}>
                All text uses the Inter Tight font family with consistent weight scales (regular, medium, semibold, bold) defined in the design tokens.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: spacing(3) }}>
                <Check size={16} color="var(--success)" />
                <h4 style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}>
                  Explicit Sizing
                </h4>
              </div>
              <p style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                lineHeight: '1.6',
              }}>
                Components use explicit pixel values via inline styles to ensure visible size changes and override potential global conflicts.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: spacing(3) }}>
                <Check size={16} color="var(--success)" />
                <h4 style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                }}>
                  Accessibility by Default
                </h4>
              </div>
              <p style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'var(--text-sm)',
                color: 'var(--muted-foreground)',
                lineHeight: '1.6',
              }}>
                All components are built with Radix UI primitives ensuring keyboard navigation, screen reader support, and ARIA compliance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}