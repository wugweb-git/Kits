import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Calendar } from '../../wugweb/Calendar';
import { Copy, Check, ChevronRight, ExternalLink, Info, CheckCircle2, XCircle } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';

export function CalendarDoc() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [showQuickSelector, setShowQuickSelector] = React.useState(true);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  
  const { isMobile, isTablet, breakpoint } = useBreakpoint();

  const handleTokenClick = (token: string, label: string, value?: string) => {
    setHighlightedToken(token);
    setTimeout(() => setHighlightedToken(null), 2000);
  };

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

  const jsxCode = `import { Calendar } from './components/wugweb/Calendar';

function DatePicker() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div style={{ padding: '24px', background: 'var(--surface-900)', borderRadius: 'var(--radius-lg)' }}>
      <Calendar
        selectedDate={date}
        onSelectDate={setDate}
        showQuickSelector={true}
        minDate={new Date('2024-01-01')}
        maxDate={new Date('2025-12-31')}
      />
    </div>
  );
}

// Design Tokens Used:
// Surface: var(--surface-900)
// Text: var(--foreground)
// Selected Date Bg: var(--foreground)
// Selected Date Text: var(--background)
// Hover: var(--muted)
// Spacing: var(--spacing-6) (24px)`;

  const sectionGap = spacing.sectionGap[breakpoint];

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: sectionGap, position: 'relative' }}>
      
      {/* Premium Header */}
      <section className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px', width: '100%', boxSizing: 'border-box' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
          <span>Components</span>
          <ChevronRight size={16} />
          <span>Inputs</span>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--foreground)' }}>Calendar</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2, fontFamily: 'Inter Tight, sans-serif' }}>
                Calendar
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)', fontFamily: 'Inter Tight, sans-serif' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontFamily: 'Inter Tight, sans-serif' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontFamily: 'Inter Tight, sans-serif' }}>Inputs</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6, fontFamily: 'Inter Tight, sans-serif' }}>
              A date picker component that allows users to select dates with month/year navigation. Includes an optional quick selector for common date ranges like Today, Yesterday, This Week, etc.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>Variants</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Inter Tight, sans-serif' }}>2</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>Tokens</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Inter Tight, sans-serif' }}>6</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>WCAG</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Inter Tight, sans-serif' }}>AA</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Button onClick={copyPageLink} variant="outline" size="sm" className="smooth-transition button-press" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)', fontFamily: 'Inter Tight, sans-serif' }}>
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="outline" size="sm" className="smooth-transition button-press" style={{ gap: '8px', background: 'var(--background)', borderColor: 'var(--border)', fontFamily: 'Inter Tight, sans-serif' }}>
                <ExternalLink size={16} />
                View in Figma
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="animate-fade-in-up" style={{ animationDelay: '100ms', width: '100%', boxSizing: 'border-box' }}>
        <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={showQuickSelector} 
                      onChange={(e) => setShowQuickSelector(e.target.checked)}
                      style={{ accentColor: 'var(--foreground)' }}
                    />
                    Show Quick Selector
                 </label>
                 
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setViewMode('desktop')}
                      style={{
                        padding: '6px 12px',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: viewMode === 'desktop' ? 'var(--background)' : 'var(--foreground)',
                        background: viewMode === 'desktop' ? 'var(--foreground)' : 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      style={{
                        padding: '6px 12px',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: viewMode === 'mobile' ? 'var(--background)' : 'var(--foreground)',
                        background: viewMode === 'mobile' ? 'var(--foreground)' : 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Mobile
                    </button>
                 </div>
              </div>

              <div style={{ 
                padding: isMobile ? '24px 16px' : '48px', 
                background: 'var(--muted)', 
                borderRadius: 'var(--radius-md)', 
                display: 'flex', 
                alignItems: 'flex-start', // changed from center to flex-start to allow mobile expansion
                justifyContent: 'center', 
                minHeight: '400px', 
                overflowX: 'auto' 
              }}>
                <div style={{ 
                  width: viewMode === 'mobile' ? '375px' : '100%', 
                  maxWidth: viewMode === 'mobile' ? '375px' : 'none',
                  transition: 'width 0.3s ease'
                }}>
                  <Calendar 
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    showQuickSelector={showQuickSelector}
                    orientation={viewMode === 'mobile' ? 'vertical' : 'horizontal'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
                  Current Selection
                </h3>
                <div style={{ 
                  padding: '12px', 
                  background: 'var(--background)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  fontSize: 'var(--text-sm)',
                  color: selectedDate ? 'var(--foreground)' : 'var(--muted-foreground)'
                }}>
                  {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No date selected'}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </section>

      {/* Anatomy */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms', width: '100%', boxSizing: 'border-box' }}>
        <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '24px', fontFamily: 'Inter Tight, sans-serif' }}>Anatomy</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '32px' }}>
              
              {/* Visual Anatomy */}
              <div style={{ 
                background: 'var(--surface-900)', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-md)',
                padding: '32px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
              }}>
                 <div style={{ 
                   width: '100%', 
                   maxWidth: '300px',
                   border: '1px dashed var(--accent)',
                   borderRadius: 'var(--radius-lg)',
                   padding: '12px',
                   position: 'relative'
                 }}>
                   {/* Header Area */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px dashed var(--accent)', paddingBottom: '8px' }}>
                     <div style={{ width: '24px', height: '24px', background: 'var(--surface-700)', borderRadius: '4px' }}></div>
                     <div style={{ width: '100px', height: '24px', background: 'var(--surface-700)', borderRadius: '4px' }}></div>
                     <div style={{ width: '24px', height: '24px', background: 'var(--surface-700)', borderRadius: '4px' }}></div>
                   </div>

                   {/* Days Grid */}
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                     {Array.from({ length: 7 }).map((_, i) => (
                       <div key={i} style={{ height: '24px', background: 'var(--surface-800)', borderRadius: '4px', opacity: 0.5 }}></div>
                     ))}
                     {Array.from({ length: 14 }).map((_, i) => (
                       <div key={`day-${i}`} style={{ height: '32px', background: i === 6 ? 'var(--foreground)' : 'var(--surface-800)', borderRadius: '50%' }}></div>
                     ))}
                   </div>

                   {/* Anatomy Labels */}
                   <div style={{ 
                     position: 'absolute', 
                     top: '-12px', 
                     left: '12px', 
                     fontSize: '10px', 
                     color: 'var(--accent)', 
                     background: 'var(--surface-900)', 
                     padding: '0 4px',
                     fontFamily: 'monospace'
                   }}>
                     Calendar Container
                   </div>
                   
                   <div style={{ 
                     position: 'absolute', 
                     top: '45%', 
                     right: '-90px', 
                     fontSize: '10px', 
                     color: 'var(--accent)', 
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     fontFamily: 'monospace'
                   }}>
                     <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }}></div>
                     Selected Day
                   </div>
                 </div>
              </div>

              {/* Anatomy Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px', fontFamily: 'Inter Tight, sans-serif' }}>Calendar Container</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
                    The main wrapper containing navigation and date grid.
                  </p>
                  <code style={{ fontSize: 'var(--text-xs)', background: 'var(--muted)', padding: '2px 6px', borderRadius: '4px', marginTop: '8px', display: 'inline-block' }}>bg: var(--surface-900)</code>
                </div>

                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px', fontFamily: 'Inter Tight, sans-serif' }}>Navigation Header</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
                    Controls for switching months and displaying current period.
                  </p>
                  <code style={{ fontSize: 'var(--text-xs)', background: 'var(--muted)', padding: '2px 6px', borderRadius: '4px', marginTop: '8px', display: 'inline-block' }}>padding: var(--spacing-2)</code>
                </div>

                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px', fontFamily: 'Inter Tight, sans-serif' }}>Selected Day</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
                    The currently active date selection.
                  </p>
                  <code style={{ fontSize: 'var(--text-xs)', background: 'var(--muted)', padding: '2px 6px', borderRadius: '4px', marginTop: '8px', display: 'inline-block' }}>bg: var(--foreground)</code>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </section>

      {/* Design Tokens */}
      <section className="animate-fade-in-up" style={{ animationDelay: '300ms', width: '100%', boxSizing: 'border-box' }}>
        <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <CardContent style={{ padding: isMobile ? '24px' : '32px' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '24px', fontFamily: 'Inter Tight, sans-serif' }}>Design Tokens</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              <TokenCard 
                label="Surface Color" 
                value="#1C1C1C" 
                token="--surface-900"
                isHighlighted={highlightedToken === '--surface-900'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Text Color" 
                value="#FFFFFF" 
                token="--foreground"
                isHighlighted={highlightedToken === '--foreground'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Selected Date Bg" 
                value="#FFFFFF" 
                token="--foreground"
                isHighlighted={highlightedToken === '--foreground'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Selected Date Text" 
                value="#000000" 
                token="--background"
                isHighlighted={highlightedToken === '--background'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Hover Background" 
                value="#262626" 
                token="--muted"
                isHighlighted={highlightedToken === '--muted'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Border Radius" 
                value="12px" 
                token="--radius-lg"
                isHighlighted={highlightedToken === '--radius-lg'}
                onClick={handleTokenClick}
              />
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Code Examples */}
      <section className="animate-fade-in-up" style={{ animationDelay: '400ms', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '24px', fontFamily: 'Inter Tight, sans-serif' }}>Code Examples</h2>
        <CollapsibleCodeBlock code={jsxCode} language="tsx" />
      </section>

      {/* Usage Guidelines */}
      <CollapsibleCodeBlock
        title="Usage Guidelines"
        isOpen={showGuidelines}
        onToggle={() => setShowGuidelines(!showGuidelines)}
        animationDelay="400ms"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
             <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
               <CardContent style={{ padding: '24px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'rgba(0, 158, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <CheckCircle2 size={18} style={{ color: '#009E69' }} />
                   </div>
                   <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0, fontFamily: 'Inter Tight, sans-serif' }}>Do</h3>
                 </div>
                 <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
                   <li>Use the quick selector for common date ranges</li>
                   <li>Disable unavailable dates visually and interactively</li>
                   <li>Allow users to type dates manually where speed is critical</li>
                   <li>Clearly indicate the current day for reference</li>
                 </ul>
               </CardContent>
             </Card>

             <Card style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
               <CardContent style={{ padding: '24px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'rgba(239, 67, 67, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <XCircle size={18} style={{ color: 'var(--destructive)' }} />
                   </div>
                   <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', margin: 0, fontFamily: 'Inter Tight, sans-serif' }}>Don't</h3>
                 </div>
                 <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
                   <li>Don't force users to click many times to reach a distant date</li>
                   <li>Don't use ambiguous date formats (DD/MM vs MM/DD)</li>
                   <li>Don't hide the day of the week labels</li>
                   <li>Don't rely solely on color to indicate availability</li>
                 </ul>
               </CardContent>
             </Card>
          </div>
        </div>
      </CollapsibleCodeBlock>
    </div>
  );
}
