import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { componentRegistry, getCategoriesWithCounts, type Component } from '../../../lib/component-registry';
import { Search, ExternalLink, Code, Eye } from 'lucide-react';

interface ComponentGalleryProps {
  onViewComponent?: (componentId: string) => void;
}

export function ComponentGallery({ onViewComponent }: ComponentGalleryProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  
  const categories = getCategoriesWithCounts();
  const allCategories = [{ category: 'all', count: componentRegistry.length }, ...categories];

  // Filter components based on search and category
  const filteredComponents = componentRegistry.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1>Component Gallery</h1>
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-lg)', marginTop: '16px' }}>
          Browse all imported Figma components with design token bindings and interactive previews.
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ position: 'relative' }}>
              <Search 
                size={20} 
                className="text-muted-foreground" 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <Input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {allCategories.map(({ category, count }) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Grid */}
      {filteredComponents.length === 0 ? (
        <Card>
          <CardContent style={{ padding: '48px', textAlign: 'center' }}>
            <p className="text-muted-foreground">
              {componentRegistry.length === 0 
                ? 'No components imported yet. Follow the Figma Import Guide to get started.'
                : 'No components match your search criteria.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredComponents.map(component => (
            <ComponentCard 
              key={component.id} 
              component={component}
              onViewComponent={onViewComponent}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Component Library Stats</CardTitle>
          <CardDescription>Overview of your design system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
                {componentRegistry.length}
              </div>
              <p className="text-muted-foreground" style={{ marginTop: '4px' }}>Total Components</p>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
                {categories.length}
              </div>
              <p className="text-muted-foreground" style={{ marginTop: '4px' }}>Categories</p>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
                {componentRegistry.reduce((sum, c) => sum + c.variants.length, 0)}
              </div>
              <p className="text-muted-foreground" style={{ marginTop: '4px' }}>Total Variants</p>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
                {componentRegistry.reduce((sum, c) => 
                  sum + c.variants.reduce((vSum, v) => vSum + v.states.length, 0), 0
                )}
              </div>
              <p className="text-muted-foreground" style={{ marginTop: '4px' }}>Total States</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ComponentCardProps {
  component: Component;
  onViewComponent?: (componentId: string) => void;
}

function ComponentCard({ component, onViewComponent }: ComponentCardProps) {
  const [hoveredState, setHoveredState] = React.useState<string>('default');
  
  const defaultVariant = component.variants[0];
  const currentState = defaultVariant?.states.find(s => s.name === hoveredState) || defaultVariant?.states[0];

  return (
    <Card className="overflow-hidden hover:border-accent transition-colors">
      {/* Component Preview */}
      <div 
        className="bg-muted border-b border-border"
        style={{ 
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        }}
      >
        {component.thumbnail ? (
          <img src={component.thumbnail} alt={component.name} style={{ maxWidth: '100%', height: 'auto' }} />
        ) : (
          <ComponentPreview component={component} state={currentState} />
        )}
      </div>

      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <CardTitle>{component.name}</CardTitle>
            <CardDescription style={{ marginTop: '4px' }}>{component.description}</CardDescription>
          </div>
          <Badge variant="secondary">{component.category}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* State Preview Buttons */}
          {defaultVariant && (
            <div>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '8px' }}>
                States
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {defaultVariant.states.map(state => (
                  <Button
                    key={state.name}
                    variant={hoveredState === state.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setHoveredState(state.name)}
                  >
                    {state.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Variants Count */}
          <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--text-sm)' }} className="text-muted-foreground">
            <span>{component.variants.length} variant{component.variants.length !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>
              {component.variants.reduce((sum, v) => sum + v.states.length, 0)} states
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              variant="outline" 
              size="sm"
              style={{ flex: 1 }}
              onClick={() => onViewComponent?.(component.id)}
            >
              <Eye size={16} style={{ marginRight: '4px' }} />
              View Docs
            </Button>
            {component.figmaLink && (
              <Button variant="ghost" size="sm">
                <ExternalLink size={16} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simple component preview renderer
function ComponentPreview({ component, state }: { component: Component; state: any }) {
  if (!state) return null;

  const styles = state.styles;
  
  // Render a simple preview based on component category
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
          cursor: 'pointer',
          fontFamily: 'Inter Tight, sans-serif',
          opacity: styles.opacity || '1'
        }}
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
          maxWidth: '300px'
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
        textAlign: 'center'
      }}
    >
      {component.name}
    </div>
  );
}
