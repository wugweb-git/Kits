import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { GridOverlay } from '../GridOverlay';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { Layout, Columns, Maximize, Eye, EyeOff, MoveHorizontal, Square, PanelLeft, Grip, Smartphone, Tablet, Monitor } from 'lucide-react';

export function GridDoc() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeLayout, setActiveLayout] = useState<'12-col' | '2-col' | '3-col' | 'sidebar'>('12-col');
  const { isMobile, isTablet, breakpoint } = useBreakpoint();
  const [manualBreakpoint, setManualBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | null>(null);
  
  const currentBreakpoint = manualBreakpoint || breakpoint;
  const isPreviewMobile = currentBreakpoint === 'mobile';
  const isPreviewTablet = currentBreakpoint === 'tablet';
  // If not mobile or tablet, assume desktop or larger
  
  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      
      <GridOverlay isVisible={showOverlay} />

      {/* Header */}
      <section className="animate-fade-in-up" style={{ width: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', margin: 0, lineHeight: 1.2 }}>
                8pt Grid System
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)' }}>System</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)' }}>Responsive</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
              Our layout system is built on an 8pt grid. This means all spacing, margins, and gutters are multiples of 8px. This creates a consistent visual rhythm and makes layout decisions easier.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Button 
                onClick={() => setShowOverlay(!showOverlay)} 
                variant={showOverlay ? "default" : "outline"}
                style={{ gap: '8px', borderColor: 'var(--accent)', color: showOverlay ? 'var(--accent-foreground)' : 'var(--accent)', background: showOverlay ? 'var(--accent)' : 'transparent' }}
              >
                {showOverlay ? <EyeOff size={16} /> : <Eye size={16} />}
                {showOverlay ? 'Hide Grid Overlay' : 'Show Grid Overlay'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Playground */}
      <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
         <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '24px', color: 'var(--foreground)' }}>Interactive Playground</h2>
         
         <div style={{ 
           border: '1px solid var(--border)', 
           borderRadius: 'var(--radius-lg)', 
           background: 'var(--surface-900)',
           overflow: 'hidden'
         }}>
           {/* Controls */}
           <div style={{ 
             padding: '24px', 
             borderBottom: '1px solid var(--border)',
             display: 'flex',
             flexDirection: isMobile ? 'column' : 'row',
             justifyContent: 'space-between',
             alignItems: isMobile ? 'flex-start' : 'center',
             gap: '16px'
           }}>
             <div style={{ display: 'flex', gap: '8px' }}>
               <Button 
                 variant={activeLayout === '12-col' ? 'default' : 'outline'}
                 size="sm"
                 onClick={() => setActiveLayout('12-col')}
                 style={{ gap: '8px' }}
               >
                 <Grip size={16} />
                 12 Columns
               </Button>
               <Button 
                 variant={activeLayout === '2-col' ? 'default' : 'outline'}
                 size="sm"
                 onClick={() => setActiveLayout('2-col')}
                 style={{ gap: '8px' }}
               >
                 <Columns size={16} />
                 2 Columns
               </Button>
               <Button 
                 variant={activeLayout === '3-col' ? 'default' : 'outline'}
                 size="sm"
                 onClick={() => setActiveLayout('3-col')}
                 style={{ gap: '8px' }}
               >
                 <Layout size={16} />
                 3 Columns
               </Button>
               <Button 
                 variant={activeLayout === 'sidebar' ? 'default' : 'outline'}
                 size="sm"
                 onClick={() => setActiveLayout('sidebar')}
                 style={{ gap: '8px' }}
               >
                 <PanelLeft size={16} />
                 Sidebar
               </Button>
             </div>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Preview Viewport:</span>
               
               <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-1000)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                 <button 
                   onClick={() => setManualBreakpoint('mobile')}
                   style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '6px', 
                     padding: '4px 12px', 
                     borderRadius: 'var(--radius-sm)',
                     background: isPreviewMobile ? 'var(--accent)' : 'transparent',
                     color: isPreviewMobile ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                     fontSize: 'var(--text-xs)',
                     fontWeight: isPreviewMobile ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                     transition: 'all var(--motion-duration-normal)',
                     border: 'none',
                     cursor: 'pointer'
                   }}
                 >
                   <Smartphone size={14} />
                   <span>Mobile</span>
                 </button>

                 <button 
                   onClick={() => setManualBreakpoint('tablet')}
                   style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '6px', 
                     padding: '4px 12px', 
                     borderRadius: 'var(--radius-sm)',
                     background: isPreviewTablet ? 'var(--accent)' : 'transparent',
                     color: isPreviewTablet ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                     fontSize: 'var(--text-xs)',
                     fontWeight: isPreviewTablet ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                     transition: 'all var(--motion-duration-normal)',
                     border: 'none',
                     cursor: 'pointer'
                   }}
                 >
                   <Tablet size={14} />
                   <span>Tablet</span>
                 </button>

                 <button 
                   onClick={() => setManualBreakpoint('desktop')}
                   style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '6px', 
                     padding: '4px 12px', 
                     borderRadius: 'var(--radius-sm)',
                     background: !isPreviewMobile && !isPreviewTablet ? 'var(--accent)' : 'transparent',
                     color: !isPreviewMobile && !isPreviewTablet ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                     fontSize: 'var(--text-xs)',
                     fontWeight: !isPreviewMobile && !isPreviewTablet ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                     transition: 'all var(--motion-duration-normal)',
                     border: 'none',
                     cursor: 'pointer'
                   }}
                 >
                   <Monitor size={14} />
                   <span>Desktop</span>
                 </button>
               </div>
             </div>
           </div>

           {/* Preview Area */}
           <div style={{ 
             padding: isPreviewMobile ? '16px' : '40px', 
             background: 'var(--surface-950)',
             minHeight: '300px',
             position: 'relative'
           }}>
             <div style={{ 
               display: 'grid',
               gridTemplateColumns: `repeat(${isPreviewMobile ? 4 : isPreviewTablet ? 8 : 12}, 1fr)`,
               gap: isPreviewMobile ? '16px' : isPreviewTablet ? '16px' : '24px',
               width: '100%',
               height: '100%'
             }}>
               {/* Grid Visualizer Background */}
               {Array.from({ length: isPreviewMobile ? 4 : isPreviewTablet ? 8 : 12 }).map((_, i) => (
                 <div 
                   key={i} 
                   style={{ 
                     height: '100%', 
                     minHeight: '200px',
                     background: 'var(--surface-800)',
                     border: '1px dashed var(--border)',
                     borderRadius: 'var(--radius-md)',
                     opacity: 0.3,
                     gridColumn: 'span 1',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontSize: 'var(--text-xs)',
                     color: 'var(--muted-foreground)'
                   }}
                 >
                   {i + 1}
                 </div>
               ))}
               
               {/* Active Layout Overlay */}
               <div style={{ 
                 position: 'absolute',
                 top: isPreviewMobile ? '16px' : '40px',
                 left: isPreviewMobile ? '16px' : '40px',
                 right: isPreviewMobile ? '16px' : '40px',
                 bottom: isPreviewMobile ? '16px' : '40px',
                 display: 'grid',
                 gridTemplateColumns: `repeat(${isPreviewMobile ? 4 : isPreviewTablet ? 8 : 12}, 1fr)`,
                 gap: isPreviewMobile ? '16px' : isPreviewTablet ? '16px' : '24px',
                 pointerEvents: 'none'
               }}>
                  {activeLayout === '12-col' && Array.from({ length: isPreviewMobile ? 4 : isPreviewTablet ? 8 : 12 }).map((_, i) => (
                    <div key={i} style={{ 
                      gridColumn: 'span 1',
                      background: 'rgba(255, 190, 26, 0.2)',
                      border: '1px solid var(--accent)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-weight-bold)'
                    }}>
                      Span 1
                    </div>
                  ))}

                  {activeLayout === '2-col' && (
                    <>
                      <div style={{ 
                        gridColumn: isPreviewMobile ? 'span 4' : 'span 6', // Full width on mobile, half on larger
                        gridRow: isPreviewMobile ? '1' : 'auto',
                        background: 'rgba(255, 190, 26, 0.2)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        {isPreviewMobile ? 'Span 4' : isPreviewTablet ? 'Span 4' : 'Span 6'}
                      </div>
                      <div style={{ 
                        gridColumn: isPreviewMobile ? 'span 4' : isPreviewTablet ? 'span 4' : 'span 6',
                        gridRow: isPreviewMobile ? '2' : 'auto',
                        background: 'rgba(255, 190, 26, 0.2)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        {isPreviewMobile ? 'Span 4' : isPreviewTablet ? 'Span 4' : 'Span 6'}
                      </div>
                    </>
                  )}

                  {activeLayout === '3-col' && (
                    <>
                      <div style={{ 
                        gridColumn: isPreviewMobile ? 'span 4' : 'span 4',
                        gridRow: isPreviewMobile ? '1' : 'auto',
                        background: 'rgba(255, 190, 26, 0.2)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        Span 4
                      </div>
                      <div style={{ 
                        gridColumn: isPreviewMobile ? 'span 4' : isPreviewTablet ? 'span 4' : 'span 4',
                        gridRow: isPreviewMobile ? '2' : 'auto',
                        background: 'rgba(255, 190, 26, 0.2)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        Span 4
                      </div>
                      <div style={{ 
                        gridColumn: isPreviewMobile ? 'span 4' : isPreviewTablet ? 'span 4' : 'span 4', // On tablet 8 cols, so this wraps or needs adjustment. 
                        // Actually 8 cols means 4+4 fills a row. Third one wraps. This is correct behavior for 3-col grid on 8-col system.
                        gridRow: isPreviewMobile ? '3' : 'auto',
                        background: 'rgba(255, 190, 26, 0.2)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        Span 4
                      </div>
                    </>
                  )}

                  {activeLayout === 'sidebar' && (
                    <>
                      <div style={{ 
                        gridColumn: isPreviewMobile ? 'span 4' : isPreviewTablet ? 'span 3' : 'span 3',
                        gridRow: isPreviewMobile ? '1' : 'auto',
                        background: 'rgba(255, 190, 26, 0.2)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        {isPreviewMobile ? 'Span 4' : 'Span 3'}
                      </div>
                      <div style={{ 
                        gridColumn: isPreviewMobile ? 'span 4' : isPreviewTablet ? 'span 5' : 'span 9',
                        gridRow: isPreviewMobile ? '2' : 'auto',
                        background: 'rgba(255, 190, 26, 0.2)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        {isPreviewMobile ? 'Span 4' : isPreviewTablet ? 'Span 5' : 'Span 9'}
                      </div>
                    </>
                  )}
               </div>
             </div>
           </div>
           
           {/* Code Snippet */}
           <div style={{ padding: '24px', background: 'var(--surface-1000)', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBottom: '8px', fontFamily: 'monospace' }}>
                // Tailwind CSS Implementation
              </p>
              <code style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>
                {activeLayout === '12-col' && 'grid grid-cols-12 gap-6'}
                {activeLayout === '2-col' && 'grid grid-cols-1 md:grid-cols-2 gap-6'}
                {activeLayout === '3-col' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}
                {activeLayout === 'sidebar' && 'grid grid-cols-1 lg:grid-cols-12 gap-6'}
              </code>
           </div>
         </div>
      </section>

      {/* Grid Specifications */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '24px', color: 'var(--foreground)' }}>Grid Specifications</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
          
          {/* Desktop */}
          <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
            <CardContent style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Layout size={24} className="text-accent" />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Desktop</h3>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Columns</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>12</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Gutter</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>24px</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Margin</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>48px</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Max Width</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>1440px</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Tablet */}
          <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
            <CardContent style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Columns size={24} className="text-accent" />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Tablet</h3>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Columns</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>8</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Gutter</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>16px</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Margin</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>32px</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Fluid</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>100%</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Mobile */}
          <Card style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
            <CardContent style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Maximize size={24} className="text-accent" />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>Mobile</h3>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Columns</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>4</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Gutter</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>16px</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Margin</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>16px</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Fluid</span>
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>100%</span>
                </li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Implementation */}
      <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-semibold)', marginBottom: '24px', color: 'var(--foreground)' }}>Implementation</h2>
        
        <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)', marginBottom: '16px' }}>
            The grid tokens are available as CSS variables. You can use them to build consistent layouts that adapt to different screen sizes.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'var(--surface-800)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <code style={{ color: 'var(--accent)', minWidth: '200px' }}>--grid-columns-desktop</code>
              <span style={{ color: 'var(--muted-foreground)' }}>12 columns</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'var(--surface-800)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <code style={{ color: 'var(--accent)', minWidth: '200px' }}>--grid-gutter-desktop</code>
              <span style={{ color: 'var(--muted-foreground)' }}>24px (3 * 8px)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'var(--surface-800)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <code style={{ color: 'var(--accent)', minWidth: '200px' }}>--grid-margin-desktop</code>
              <span style={{ color: 'var(--muted-foreground)' }}>48px (6 * 8px)</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
