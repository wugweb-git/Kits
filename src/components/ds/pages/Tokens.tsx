import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { TokenCard } from '../TokenCard';
import { designTokens, getTokenUsage } from '../../../lib/design-tokens';
import { PageWrapper, PageHeader } from '../PageWrapper';

interface TokensProps {
  currentSubPage?: string;
}

export function Tokens({ currentSubPage }: TokensProps) {
  const [activeTab, setActiveTab] = React.useState(currentSubPage || 'colors');

  React.useEffect(() => {
    if (currentSubPage) {
      setActiveTab(currentSubPage);
    }
  }, [currentSubPage]);

  // Parse color tokens
  const colorSections = [
    { title: 'Neutral Colors', key: 'Neutral', description: 'Foundation colors for text, backgrounds, and UI elements' },
    { title: 'Primary Colors', key: 'Primary', description: 'Brand identity colors' },
    { title: 'Accent Colors', key: 'Accent', description: 'Highlight and interaction colors' },
    { title: 'Background Colors', key: 'Background', description: 'Page and section backgrounds' },
    { title: 'Error States', key: 'Error', description: 'Error messages and destructive actions' },
    { title: 'Warning States', key: 'Warning', description: 'Warning messages and caution states' },
    { title: 'Success States', key: 'Success', description: 'Success messages and positive feedback' },
    { title: 'Extras', key: 'Extras', description: 'Additional semantic colors' }
  ];

  // Parse typography tokens
  const fontSizes = Object.entries(designTokens.fonts.size).map(([name, data]) => ({
    name,
    value: `${data.value}px`,
    usage: `Font size ${name.toUpperCase()}`,
  }));

  const fontWeights = Object.entries(designTokens.fonts.weight).map(([name, data]) => ({
    name,
    value: data.value.toString(),
    usage: `Font weight ${name}`,
  }));

  const lineHeights = Object.entries(designTokens.fonts['line-height']).map(([name, data]) => ({
    name,
    value: `${data.value}px`,
    usage: `Line height for ${name.toUpperCase()} text`,
  }));

  // Parse spacing tokens
  const spacingTokens = Object.entries(designTokens.spacing).map(([name, data]) => ({
    name,
    value: `${data.value}px`,
    usage: `Spacing value ${name}`,
  }));

  const paddingTokens = Object.entries(designTokens.padding).map(([name, data]) => ({
    name,
    value: `${data.value}px`,
    usage: `Padding value ${name}`,
  }));

  const gapTokens = Object.entries(designTokens.gap).map(([name, data]) => ({
    name,
    value: `${data.value}px`,
    usage: `Gap value ${name}`,
  }));

  // Parse radius tokens
  const radiusTokens = Object.entries(designTokens.radius).map(([name, data]) => ({
    name,
    value: data.value === 9999 ? 'Full (9999px)' : `${data.value}px`,
    usage: data.value === 9999 ? 'Fully rounded elements' : data.value === 0 ? 'No border radius' : `${data.value}px border radius`,
    preview: (
      <div 
        className="w-16 h-16 bg-accent" 
        style={{ borderRadius: data.value === 9999 ? 'var(--radius-full)' : `var(--radius-${name})` }} 
      />
    )
  }));

  return (
    <PageWrapper>
      <PageHeader
        title="Design Tokens"
        description="Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. We use them in place of hard-coded values to ensure flexibility and unity across all products."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList 
          className="w-full justify-start border-b border-border bg-transparent h-auto p-0" 
          style={{ gap: 'var(--spacing-6)' }}
        >
          <TabsTrigger 
            value="colors" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none"
          >
            Colors
          </TabsTrigger>
          <TabsTrigger 
            value="typography"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none"
          >
            Typography
          </TabsTrigger>
          <TabsTrigger 
            value="spacing"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none"
          >
            Spacing
          </TabsTrigger>
          <TabsTrigger 
            value="radius"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none"
          >
            Radius
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" style={{ marginTop: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
          {colorSections.map(section => {
            const colorData = designTokens.color[section.key as keyof typeof designTokens.color];
            if (!colorData) return null;

            const colors = Object.entries(colorData).map(([name, data]) => ({
              name,
              value: data.value,
              usage: getTokenUsage(section.key, name),
              color: data.value
            }));

            return (
              <div key={section.key}>
                <h3 style={{ marginBottom: 'var(--spacing-2)' }}>{section.title}</h3>
                <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-6)' }}>
                  {section.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
                  {colors.map((token) => (
                    <TokenCard
                      key={token.name}
                      name={token.name}
                      value={token.value}
                      usage={token.usage}
                      copyValue={token.value}
                      preview={
                        <div 
                          className="w-full h-full border border-border"
                          style={{ 
                            backgroundColor: token.color,
                            borderRadius: 'var(--radius-md)'
                          }}
                        />
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="typography" style={{ marginTop: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
          <div>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Font Family</h3>
            <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-6)' }}>
              Our typography system uses Inter Tight font family for all text.
            </p>
            <div 
              className="bg-card border border-border"
              style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-8)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div>
                  <h2>Inter Tight</h2>
                  <p className="text-muted-foreground" style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--text-sm)' }}>
                    Primary font family for all text
                  </p>
                </div>
                <div style={{ marginTop: 'var(--spacing-4)' }}>
                  <p style={{ fontSize: 'var(--text-2xl)' }}>
                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
                  </p>
                  <p style={{ fontSize: 'var(--text-2xl)', marginTop: 'var(--spacing-2)' }}>
                    Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                  </p>
                  <p style={{ fontSize: 'var(--text-2xl)', marginTop: 'var(--spacing-2)' }}>
                    0 1 2 3 4 5 6 7 8 9
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Font Sizes</h3>
            <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-6)' }}>
              Modular scale for consistent typography hierarchy.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {fontSizes.map((token) => (
                <div 
                  key={token.name}
                  className="bg-card border border-border hover:border-accent transition-colors"
                  style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', flex: 1 }}>
                    <div style={{ minWidth: '120px' }}>
                      <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{token.name}</span>
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--spacing-1)' }}>
                        {token.value}
                      </p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: token.value }}>
                        The quick brown fox jumps
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Font Weights</h3>
            <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-6)' }}>
              Weight variations for emphasis and hierarchy.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
              {fontWeights.map((token) => (
                <div 
                  key={token.name}
                  className="bg-card border border-border"
                  style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}
                >
                  <p style={{ fontWeight: parseInt(token.value), fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-2)' }}>
                    {token.name}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    {token.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Line Heights</h3>
            <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-6)' }}>
              Line height values paired with font sizes.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--spacing-4)' }}>
              {lineHeights.map((token) => (
                <TokenCard
                  key={token.name}
                  name={token.name}
                  value={token.value}
                  usage={token.usage}
                  copyValue={token.value}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="spacing" style={{ marginTop: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
          <div>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Spacing Scale</h3>
            <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-6)' }}>
              Base spacing values for consistent layout and rhythm.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {spacingTokens.map((token) => (
                <div 
                  key={token.name}
                  className="bg-card border border-border"
                  style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}
                >
                  <div style={{ minWidth: '80px' }}>
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{token.name}</span>
                  </div>
                  <div 
                    className="bg-accent"
                    style={{ 
                      width: token.value,
                      height: 'var(--spacing-8)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  />
                  <span className="text-muted-foreground">{token.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Padding Scale</h3>
            <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-6)' }}>
              Padding values for component internal spacing.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--spacing-4)' }}>
              {paddingTokens.map((token) => (
                <div 
                  key={token.name}
                  className="bg-card border border-border"
                  style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', textAlign: 'center' }}
                >
                  <div 
                    className="bg-muted mx-auto mb-2"
                    style={{ 
                      width: '64px',
                      height: '64px',
                      padding: token.value,
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div className="bg-accent w-full h-full" style={{ borderRadius: 'var(--radius-sm)' }} />
                  </div>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-1)' }}>{token.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>{token.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Gap Scale</h3>
            <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-6)' }}>
              Gap values for flexbox and grid layouts.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
              {gapTokens.map((token) => (
                <TokenCard
                  key={token.name}
                  name={token.name}
                  value={token.value}
                  usage={token.usage}
                  copyValue={token.value}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="radius" style={{ marginTop: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
          <div>
            <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Border Radius</h3>
            <p className="text-muted-foreground" style={{ marginBottom: 'var(--spacing-6)' }}>
              Consistent border radius creates visual harmony across components.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-6)' }}>
              {radiusTokens.map((token) => (
                <TokenCard
                  key={token.name}
                  name={token.name}
                  value={token.value}
                  usage={token.usage}
                  copyValue={token.value}
                  preview={token.preview}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}