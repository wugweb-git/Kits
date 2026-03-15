import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { componentRegistry, type Component, type ComponentState } from '../../../lib/component-registry';
import { Copy, CheckCircle2, ExternalLink, AlertCircle, Code } from 'lucide-react';

interface ComponentDocProps {
  componentId: string;
}

export function ComponentDoc({ componentId }: ComponentDocProps) {
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [activeVariant, setActiveVariant] = React.useState(0);
  const [activeState, setActiveState] = React.useState<string>('default');

  const component = componentRegistry.find(c => c.id === componentId);

  if (!component) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <Alert>
          <AlertCircle size={20} />
          <AlertTitle>Component Not Found</AlertTitle>
          <AlertDescription>
            The requested component could not be found in the registry.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentVariant = component.variants[activeVariant];
  const currentState = currentVariant?.states.find(s => s.name === activeState) || currentVariant?.states[0];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <h1>{component.name}</h1>
          <Badge>{component.category}</Badge>
        </div>
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-lg)' }}>
          {component.description}
        </p>
        {component.figmaLink && (
          <Button variant="link" style={{ paddingLeft: 0, marginTop: '8px' }}>
            <ExternalLink size={16} style={{ marginRight: '4px' }} />
            View in Figma
          </Button>
        )}
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Interactive Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Preview</CardTitle>
              <CardDescription>Interact with the component to see different states</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-muted"
                style={{ 
                  borderRadius: 'var(--radius-lg)',
                  padding: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px'
                }}
              >
                <ComponentPreview component={component} variant={currentVariant} state={currentState} />
              </div>

              {/* Variant Selector */}
              {component.variants.length > 1 && (
                <div style={{ marginTop: '24px' }}>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '8px' }}>Variant</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {component.variants.map((variant, index) => (
                      <Button
                        key={index}
                        variant={activeVariant === index ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setActiveVariant(index);
                          setActiveState('default');
                        }}
                      >
                        {variant.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* State Selector */}
              {currentVariant && currentVariant.states.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '8px' }}>State</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {currentVariant.states.map(state => (
                      <Button
                        key={state.name}
                        variant={activeState === state.name ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveState(state.name)}
                      >
                        {state.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All States Preview */}
          <Card>
            <CardHeader>
              <CardTitle>All States</CardTitle>
              <CardDescription>Visual comparison of all component states</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                {currentVariant?.states.map(state => (
                  <div key={state.name}>
                    <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '12px', textTransform: 'capitalize' }}>
                      {state.name}
                    </p>
                    <div 
                      className="bg-muted"
                      style={{ 
                        borderRadius: 'var(--radius-md)',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100px'
                      }}
                    >
                      <ComponentPreview component={component} variant={currentVariant} state={state} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <CardTitle>Component Code</CardTitle>
                  <CardDescription>Copy and paste this code to use the component</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCode(component.codeSnippet || '')}
                >
                  {copiedCode ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copiedCode ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre 
                className="bg-muted"
                style={{ 
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontSize: 'var(--text-sm)',
                  overflowX: 'auto'
                }}
              >
                <code>{component.codeSnippet || `<${component.name.replace(/\s/g, '')} />`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <pre 
                className="bg-muted"
                style={{ 
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontSize: 'var(--text-sm)',
                  overflowX: 'auto'
                }}
              >
                <code>{`import { ${component.name.replace(/\s/g, '')} } from './components/${component.category.toLowerCase()}/${component.id}';`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tokens Tab */}
        <TabsContent value="tokens" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Design Token Mapping</CardTitle>
              <CardDescription>
                This component uses the following design tokens from your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentState?.tokenMapping ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.entries(currentState.tokenMapping).map(([property, token]) => (
                    <div 
                      key={property}
                      className="bg-muted"
                      style={{ 
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontWeight: 'var(--font-weight-medium)', textTransform: 'capitalize' }}>
                        {property.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Badge variant="secondary">{token}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No token mapping available for this state.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CSS Variables</CardTitle>
              <CardDescription>Use these CSS variables in your custom styles</CardDescription>
            </CardHeader>
            <CardContent>
              <pre 
                className="bg-muted"
                style={{ 
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontSize: 'var(--text-sm)',
                  overflowX: 'auto'
                }}
              >
                <code>{currentState?.styles ? Object.entries(currentState.styles)
                  .map(([key, value]) => `${key}: ${value};`)
                  .join('\n') : 'No styles available'}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" style={{ marginTop: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
              <CardDescription>
                Built-in accessibility features and best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {component.accessibility && component.accessibility.length > 0 ? (
                <ul className="list-disc list-inside" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {component.accessibility.map((feature, index) => (
                    <li key={index} className="text-foreground">{feature}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No accessibility information available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>When to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {component.usageNotes || 'Usage guidelines are being developed.'}
              </p>
            </CardContent>
          </Card>

          {currentVariant?.description && (
            <Card>
              <CardHeader>
                <CardTitle>Variant Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{currentVariant.description}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component preview renderer
function ComponentPreview({ component, variant, state }: { component: Component; variant: any; state: ComponentState }) {
  if (!state) return null;

  const styles = state.styles;
  
  // Render based on component category
  if (component.category === 'Buttons') {
    return (
      <button
        style={{
          background: styles.background,
          color: styles.color,
          border: styles.border,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          height: styles.height,
          cursor: state.name === 'disabled' ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter Tight, sans-serif',
          opacity: styles.opacity || '1',
          pointerEvents: state.name === 'disabled' ? 'none' : 'auto'
        }}
        disabled={state.name === 'disabled'}
      >
        {component.name}
      </button>
    );
  }

  if (component.category === 'Inputs') {
    return (
      <input
        type="text"
        placeholder="Input field"
        disabled={state.name === 'disabled'}
        style={{
          background: styles.background,
          color: styles.color,
          border: styles.border,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          height: styles.height,
          fontFamily: 'Inter Tight, sans-serif',
          width: '100%',
          maxWidth: '300px',
          opacity: styles.opacity || '1'
        }}
      />
    );
  }

  // Default preview
  return (
    <div
      style={{
        background: styles.background,
        color: styles.color,
        border: styles.border,
        borderRadius: styles.borderRadius,
        padding: styles.padding || '16px',
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        fontFamily: 'Inter Tight, sans-serif',
        minWidth: '150px',
        textAlign: 'center',
        opacity: styles.opacity || '1'
      }}
    >
      {component.name}
    </div>
  );
}
