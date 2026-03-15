import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Dropdown, DropdownOption } from '../../wugweb/Dropdown';
import { Copy, Check, ChevronRight, ExternalLink, Info, CheckCircle2, XCircle } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useMediaQuery';
import { spacing } from '../../../utils/responsive';
import { TokenCard } from '../components/TokenCard';
import { CollapsibleCodeBlock } from '../components/CollapsibleCodeBlock';

export function DropdownDoc() {
  const [selectedValue, setSelectedValue] = React.useState<string>('');
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [highlightedToken, setHighlightedToken] = React.useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = React.useState(true);
  const [showAccessibility, setShowAccessibility] = React.useState(true);
  
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

  const sampleOptions: DropdownOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
    { value: 'option5', label: 'Option 5' },
  ];

  const jsxCode = `import { Dropdown } from './components/wugweb/Dropdown';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

<div style={{ width: '100%', maxWidth: '320px' }}>
  <label style={{ 
    display: 'block', 
    marginBottom: '8px', 
    fontSize: 'var(--text-sm)', 
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--foreground)'
  }}>
    Select Option
  </label>
  <Dropdown
    options={options}
    value={value}
    onChange={setValue}
    placeholder="Select an option"
    size="md"
  />
</div>

// Design Tokens Used:
// Trigger Bg: var(--input-background)
// Border: var(--border)
// Focus Ring: var(--ring)
// Selected Item Bg: var(--foreground)
// Selected Item Text: var(--background)`;

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
          <span style={{ color: 'var(--foreground)' }}>Dropdown</span>
        </nav>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 190, 26, 0.05) 0%, rgba(255, 190, 26, 0.02) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '24px' : isTablet ? '32px' : '40px', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h1 style={{ fontSize: isMobile ? 'var(--text-3xl)' : 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)', background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2, fontFamily: 'Inter Tight, sans-serif' }}>
                Dropdown
              </h1>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <Badge variant="outline" style={{ background: 'var(--background)', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontWeight: 'var(--font-weight-medium)', fontFamily: 'Inter Tight, sans-serif' }}>Figma Import</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontFamily: 'Inter Tight, sans-serif' }}>v1.0.0</Badge>
                <Badge variant="outline" style={{ background: 'var(--background)', fontSize: 'var(--text-xs)', padding: '4px 12px', fontFamily: 'Inter Tight, sans-serif' }}>Inputs</Badge>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted-foreground)', maxWidth: '800px', margin: 0, lineHeight: 1.6, fontFamily: 'Inter Tight, sans-serif' }}>
              A dropdown menu component for selecting options from a list. Includes keyboard navigation, focus management, and full accessibility support.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '16px' : '32px', padding: isMobile ? '16px' : '20px', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '4px', fontFamily: 'Inter Tight, sans-serif' }}>Variants</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Inter Tight, sans-serif' }}>3</div>
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
              
              <div style={{ padding: isMobile ? '32px 16px' : '64px', background: 'var(--muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
                     Select Option
                   </label>
                   <Dropdown 
                     options={sampleOptions}
                     value={selectedValue}
                     onChange={setSelectedValue}
                     placeholder="Choose an item..."
                   />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', fontFamily: 'Inter Tight, sans-serif' }}>
                  Current Value
                </h3>
                <div style={{ 
                  padding: '12px', 
                  background: 'var(--background)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  fontSize: 'var(--text-sm)',
                  color: selectedValue ? 'var(--foreground)' : 'var(--muted-foreground)'
                }}>
                  {selectedValue || 'null'}
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
                position: 'relative'
              }}>
                 {/* Trigger Button Mockup */}
                 <div style={{ marginBottom: '4px', position: 'relative' }}>
                   <div style={{ 
                     height: '40px', 
                     border: '1px solid var(--accent)', 
                     borderRadius: 'var(--radius-md)',
                     display: 'flex', 
                     alignItems: 'center', 
                     padding: '0 12px',
                     justifyContent: 'space-between',
                     background: 'var(--background)'
                   }}>
                     <span style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)' }}>Select option</span>
                     <div style={{ width: '16px', height: '16px', border: '1px dashed var(--accent)', borderRadius: '50%' }} />
                   </div>
                   
                   {/* Trigger Label */}
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
                     Trigger Button
                   </div>
                 </div>

                 {/* Menu Container Mockup */}
                 <div style={{ 
                   marginTop: '4px',
                   border: '1px dashed var(--accent)',
                   borderRadius: 'var(--radius-md)',
                   padding: '4px',
                   position: 'relative'
                 }}>
                    <div style={{ background: 'var(--popover)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <div style={{ padding: '8px 12px', fontSize: 'var(--text-base)', borderBottom: '1px solid var(--border)' }}>Option 1</div>
                      <div style={{ padding: '8px 12px', fontSize: 'var(--text-base)', borderBottom: '1px solid var(--border)' }}>Option 2</div>
                      <div style={{ padding: '8px 12px', fontSize: 'var(--text-base)' }}>Option 3</div>
                    </div>
                    
                    {/* Menu Label */}
                    <div style={{ 
                       position: 'absolute', 
                       top: '50%', 
                       right: '-110px', 
                       transform: 'translateY(-50%)',
                       fontSize: '10px', 
                       color: 'var(--accent)', 
                       display: 'flex',
                       alignItems: 'center',
                       gap: '8px',
                       fontFamily: 'monospace'
                     }}>
                       <div style={{ width: '20px', height: '1px', background: 'var(--accent)' }} />
                       Menu Container
                     </div>
                 </div>
              </div>

              {/* Anatomy Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px', fontFamily: 'Inter Tight, sans-serif' }}>Trigger Button</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
                    Interactive button that opens/closes the dropdown menu.
                  </p>
                  <code style={{ fontSize: 'var(--text-xs)', background: 'var(--muted)', padding: '2px 6px', borderRadius: '4px', marginTop: '8px', display: 'inline-block' }}>height: 40px (md)</code>
                </div>

                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px', fontFamily: 'Inter Tight, sans-serif' }}>Placeholder/Label</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
                    Text displayed when no option is selected.
                  </p>
                  <code style={{ fontSize: 'var(--text-xs)', background: 'var(--muted)', padding: '2px 6px', borderRadius: '4px', marginTop: '8px', display: 'inline-block' }}>var(--muted-foreground)</code>
                </div>

                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px', fontFamily: 'Inter Tight, sans-serif' }}>Border</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
                    2px border, changes color on focus and hover.
                  </p>
                  <code style={{ fontSize: 'var(--text-xs)', background: 'var(--muted)', padding: '2px 6px', borderRadius: '4px', marginTop: '8px', display: 'inline-block' }}>var(--border)</code>
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
                label="Trigger Background" 
                value="#1C1C1C" 
                token="--input-background"
                isHighlighted={highlightedToken === '--input-background'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Border Color" 
                value="#2B2B2B" 
                token="--border"
                isHighlighted={highlightedToken === '--border'}
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
                label="Selected Item Bg" 
                value="#FFFFFF" 
                token="--foreground"
                isHighlighted={highlightedToken === '--foreground'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Selected Item Text" 
                value="#000000" 
                token="--background"
                isHighlighted={highlightedToken === '--background'}
                onClick={handleTokenClick}
              />
              <TokenCard 
                label="Border Radius" 
                value="8px" 
                token="--radius-md"
                isHighlighted={highlightedToken === '--radius-md'}
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
                   <li>Use when users need to select one item from a list of 5-15 options</li>
                   <li>Use a descriptive label or placeholder</li>
                   <li>Group related options if the list is long</li>
                   <li>Set a default option if appropriate</li>
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
                   <li>Don't use for less than 3 options (use Radio Buttons)</li>
                   <li>Don't use for more than 15 options (use Autocomplete)</li>
                   <li>Don't nest dropdowns inside other dropdowns</li>
                   <li>Don't hide critical information inside a dropdown</li>
                 </ul>
               </CardContent>
             </Card>
          </div>
        </div>
      </CollapsibleCodeBlock>
    </div>
  );
}
