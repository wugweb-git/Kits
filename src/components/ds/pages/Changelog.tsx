import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Plus, Wrench, AlertTriangle, Sparkles } from 'lucide-react';

export function Changelog() {
  const releases = [
    {
      version: '0.1.0',
      date: 'November 6, 2024',
      type: 'initial',
      changes: [
        {
          type: 'added',
          items: [
            'Initial design system documentation site',
            'Complete token system (colors, typography, spacing, radius, shadows)',
            'Core component library with 40+ components',
            'Comprehensive accessibility guidelines and WCAG 2.1 AA compliance',
            'Design principles and usage guidelines',
            'Interactive playground for token experimentation',
            'Common UI patterns and templates',
            'Contribution guidelines and processes',
          ],
        },
        {
          type: 'improved',
          items: [
            'Responsive layout for all documentation pages',
            '8-point grid system for consistent spacing',
            'Dark mode preparation (tokens ready)',
          ],
        },
      ],
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus size={16} />;
      case 'improved':
        return <Sparkles size={16} />;
      case 'fixed':
        return <Wrench size={16} />;
      case 'breaking':
        return <AlertTriangle size={16} />;
      default:
        return null;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'added':
        return 'default';
      case 'improved':
        return 'secondary';
      case 'fixed':
        return 'outline';
      case 'breaking':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'added':
        return 'Added';
      case 'improved':
        return 'Improved';
      case 'fixed':
        return 'Fixed';
      case 'breaking':
        return 'Breaking Changes';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-16">
      <div>
        <h1>Changelog</h1>
        <p className="text-muted-foreground mt-4" style={{ fontSize: 'var(--text-lg)' }}>
          Track updates, new features, and improvements to the Wugweb Kits design system.
        </p>
      </div>

      {/* Versioning Info */}
      <section className="space-y-6">
        <div>
          <h2>Semantic Versioning</h2>
          <p className="text-muted-foreground mt-2">
            We follow semantic versioning (MAJOR.MINOR.PATCH) for releases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Badge className="w-fit mb-2">MAJOR</Badge>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Breaking Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Incompatible API changes that may require updates to your code
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">MINOR</Badge>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>New Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                New functionality added in a backwards-compatible manner
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">PATCH</Badge>
              <CardTitle style={{ fontSize: 'var(--text-lg)' }}>Bug Fixes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                Backwards-compatible bug fixes and minor improvements
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Release History */}
      <section className="space-y-6">
        <div>
          <h2>Release History</h2>
        </div>

        <div className="space-y-8">
          {releases.map((release) => (
            <Card key={release.version}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge 
                      className={`px-4 py-1 ${
                        release.type === 'initial' 
                          ? 'bg-accent text-accent-foreground' 
                          : ''
                      }`}
                      style={{ borderRadius: 'var(--radius-full)' }}
                    >
                      v{release.version}
                    </Badge>
                    {release.type === 'initial' && (
                      <Badge variant="outline">Initial Release</Badge>
                    )}
                  </div>
                  <span 
                    className="text-muted-foreground"
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    {release.date}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {release.changes.map((changeGroup, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-4">
                      <div 
                        className="p-2 bg-accent/10 text-accent"
                        style={{ borderRadius: 'var(--radius-md)' }}
                      >
                        {getIcon(changeGroup.type)}
                      </div>
                      <h4>{getTypeLabel(changeGroup.type)}</h4>
                    </div>
                    <ul className="space-y-2 ml-10">
                      {changeGroup.items.map((item, itemIndex) => (
                        <li 
                          key={itemIndex}
                          className="text-muted-foreground flex items-start gap-3"
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"
                            style={{ borderRadius: 'var(--radius-full)' }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="space-y-6">
        <div>
          <h2>Roadmap</h2>
          <p className="text-muted-foreground mt-2">
            Features and improvements planned for upcoming releases.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Badge variant="outline">Planned for v0.2.0</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                'Dark mode implementation with theme toggle',
                'Advanced component variants and compositions',
                'Animation and motion guidelines with examples',
                'Data visualization patterns and chart templates',
                'Mobile-specific patterns and responsive components',
                'Advanced form patterns with validation',
                'Expanded accessibility testing documentation',
                'Component composition examples and recipes',
              ].map((item, index) => (
                <li 
                  key={index}
                  className="text-muted-foreground flex items-start gap-3"
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0"
                    style={{ borderRadius: 'var(--radius-full)' }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Stay Updated */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Stay Updated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Want to be notified about new releases and updates?
            </p>
            <div className="flex gap-4">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent/10 transition-colors">
                Watch on GitHub
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent/10 transition-colors">
                Subscribe to Newsletter
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent/10 transition-colors">
                Follow Updates
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
