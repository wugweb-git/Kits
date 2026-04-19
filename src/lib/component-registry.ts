// Component Registry for Wugweb Kits Design System
// This will store metadata about all imported Figma components

export interface ComponentState {
  name: 'default' | 'hover' | 'focused' | 'pressed' | 'disabled' | 'active' | 'error' | 'loading';
  styles: {
    background?: string;
    color?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    fontWeight?: string;
    height?: string;
    width?: string;
    opacity?: string;
    [key: string]: string | undefined;
  };
  tokenMapping?: {
    background?: string;
    color?: string;
    borderColor?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    fontWeight?: string;
    [key: string]: string | undefined;
  };
}

export interface ComponentVariant {
  name: string;
  description?: string;
  states: ComponentState[];
}

export interface Component {
  id: string;
  name: string;
  category: 'Buttons' | 'Inputs' | 'Cards' | 'Modals' | 'Badges' | 'Icons' | 'Dropdowns' | 'Checkboxes' | 'Radio' | 'Toggles' | 'Other';
  description: string;
  variants: ComponentVariant[];
  thumbnail?: string;
  figmaLink?: string;
  usageNotes?: string;
  accessibility?: string[];
  codeSnippet?: string;
}

// Component registry - will be populated with imported components
export const componentRegistry: Component[] = [
  // Button Component - Imported from Figma
  {
    id: 'button',
    name: 'Button',
    category: 'Buttons',
    description: 'Primary interactive button component with multiple variants and states. Supports icons, loading states, and full customization.',
    variants: [
      {
        name: 'Primary (Dark)',
        description: 'Main call-to-action button with dark background - imported from Figma',
        states: [
          {
            name: 'default',
            styles: {
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: 'var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: '--secondary',
              color: '--foreground',
              borderColor: '--border-default',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          },
          {
            name: 'hover',
            styles: {
              background: 'var(--background)',
              color: 'var(--accent)',
              border: 'var(--border-accent)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: '--background',
              color: '--accent',
              borderColor: '--accent',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          },
          {
            name: 'pressed',
            styles: {
              background: 'var(--accent)',
              color: 'var(--accent-foreground)',
              border: 'var(--border-accent)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: '--accent',
              color: '--accent-foreground',
              borderColor: '--accent',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          },
          {
            name: 'focused',
            styles: {
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: 'var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: '--secondary',
              color: '--foreground',
              borderColor: '--border-default',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
              ring: '--focus-ring-accent',
            }
          },
          {
            name: 'disabled',
            styles: {
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: 'var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
              opacity: 'var(--opacity-low)',
            },
            tokenMapping: {
              background: '--secondary',
              color: '--foreground',
              borderColor: '--border-default',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
              opacity: 'var(--opacity-low)',
            }
          },
          {
            name: 'loading',
            styles: {
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: 'var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: '--secondary',
              color: '--foreground',
              borderColor: '--border-default',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          }
        ]
      },
      {
        name: 'Secondary',
        description: 'Secondary action button with muted styling',
        states: [
          {
            name: 'default',
            styles: {
              background: 'var(--muted)',
              color: 'var(--muted-foreground)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: '--muted',
              color: '--muted-foreground',
              borderColor: '--border-default',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          },
          {
            name: 'hover',
            styles: {
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: 'var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: '--secondary',
              color: '--foreground',
              borderColor: '--border-default',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          }
        ]
      },
      {
        name: 'Accent',
        description: 'High-emphasis accent button for important actions',
        states: [
          {
            name: 'default',
            styles: {
              background: 'var(--accent)',
              color: 'var(--accent-foreground)',
              border: 'var(--border-accent)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: '--accent',
              color: '--accent-foreground',
              borderColor: '--accent',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          },
          {
            name: 'hover',
            styles: {
              background: 'var(--accent-hover)',
              color: 'var(--accent-foreground)',
              border: 'var(--accent-border-hover)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: 'accent/90',
              color: '--accent-foreground',
              borderColor: 'accent/90',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          }
        ]
      },
      {
        name: 'Outline',
        description: 'Transparent button with border',
        states: [
          {
            name: 'default',
            styles: {
              background: 'transparent',
              color: 'var(--foreground)',
              border: 'var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: 'transparent',
              color: '--foreground',
              borderColor: '--border-default',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          },
          {
            name: 'hover',
            styles: {
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: 'var(--border-accent)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: '--secondary',
              color: '--foreground',
              borderColor: '--accent',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          }
        ]
      },
      {
        name: 'Destructive',
        description: 'Button for destructive actions like delete',
        states: [
          {
            name: 'default',
            styles: {
              background: 'var(--destructive)',
              color: 'var(--foreground)',
              border: 'var(--border-destructive)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-5)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              height: 'var(--btn-height-2xl)',
            },
            tokenMapping: {
              background: 'destructive (--destructive)',
              color: 'destructive-foreground (--destructive-foreground)',
              borderColor: 'destructive (--destructive)',
              borderRadius: '--radius-lg',
              padding: 'var(--spacing-5)',
              fontSize: '--text-lg',
              fontWeight: '--font-weight-semibold',
            }
          }
        ]
      }
    ],
    usageNotes: 'Use Primary variant for main call-to-action buttons like "Submit", "Save", "Continue". Use Secondary for less prominent actions. Use Accent for high-emphasis actions. Use Outline for tertiary actions. Use Destructive for delete or dangerous actions. Buttons support left/right icons and loading states.',
    accessibility: [
      'Keyboard accessible (Tab, Enter, Space)',
      'Focus visible with semantic accent ring indicator',
      'Disabled state communicated to screen readers (aria-disabled)',
      'Sufficient color contrast meets WCAG AA standards',
      'Loading state shows spinner with proper aria-busy attribute',
      'Button text should be descriptive of the action',
    ],
    codeSnippet: `import { Button } from './components/design-system/components';
import { ArrowRight, Trash2 } from 'lucide-react';

// Primary button with icons (from Figma)
<Button variant="primary" size="lg" leftIcon={<ArrowIcon />} rightIcon={<ArrowIcon />}>
  Button
</Button>

// Different variants
<Button variant="secondary" size="md">
  Secondary Action
</Button>

<Button variant="accent" size="lg">
  Important Action
</Button>

<Button variant="outline" size="md">
  Tertiary Action
</Button>

<Button variant="destructive" size="md" leftIcon={<Trash2 />}>
  Delete
</Button>

// With loading state
<Button variant="primary" loading>
  Processing...
</Button>

// Full width
<Button variant="primary" fullWidth>
  Full Width Button
</Button>`
  }
];

// Helper function to get all components by category
export function getComponentsByCategory(category: Component['category']): Component[] {
  return componentRegistry.filter(component => component.category === category);
}

// Helper function to get all categories with component counts
export function getCategoriesWithCounts(): Array<{ category: string; count: number }> {
  const categories = new Map<string, number>();
  
  componentRegistry.forEach(component => {
    const current = categories.get(component.category) || 0;
    categories.set(component.category, current + 1);
  });
  
  return Array.from(categories.entries()).map(([category, count]) => ({
    category,
    count
  }));
}

// Helper function to map hex color to design token
export function mapColorToToken(hexColor: string): string {
  const colorMap: Record<string, string> = {
    '#000000': 'Neutral 10',
    '#ffffff': 'Neutral 1',
    '#a3a3a3': 'Neutral 5',
    '#1a1a1a': 'Neutral 9',
    '#f4f4f4': 'Neutral 2',
    '#dfdfdf': 'Neutral 3',
    '#2b2b2b': 'Neutral 8',
    '#7d7d7d': 'Neutral 6',
    '#bababa': 'Neutral 4',
    '#444444': 'Neutral 7',
    '#ffbe1a': 'Accent main',
    '#191919': 'Ash Black',
    '#c9c9c9': 'logo Grey',
    '#ebebeb': 'Grey - BG',
    '#050505': 'Website - BG',
    '#ef4343': 'Error 500',
  };
  
  return colorMap[hexColor.toLowerCase()] || hexColor;
}

// Helper function to map pixel values to spacing tokens
export function mapSpacingToToken(pxValue: string): string {
  const spacingMap: Record<string, string> = {
    '0px': 's-0',
    '2px': 's-1',
    '4px': 's-2',
    '8px': 's-3',
    '12px': 's-4',
    '16px': 's-5',
    '20px': 's-6',
    '24px': 's-7',
    '28px': 's-8',
  };
  
  return spacingMap[pxValue] || pxValue;
}

// Helper function to map border radius to token
export function mapRadiusToToken(pxValue: string): string {
  const radiusMap: Record<string, string> = {
    '0px': 'r-0',
    '2px': 'r-1',
    '4px': 'r-2',
    '6px': 'r-3',
    '8px': 'r-4',
    '10px': 'r-5',
    '12px': 'r-6',
    '16px': 'r-7',
    '20px': 'r-8',
    '999px': 'r-9',
  };
  
  return radiusMap[pxValue] || pxValue;
}

// Helper function to map font size to token
export function mapFontSizeToToken(pxValue: string): string {
  const fontSizeMap: Record<string, string> = {
    '10px': '3xs',
    '12px': '2xs',
    '13px': 'xs',
    '14px': 'sm',
    '16px': 'md',
    '18px': 'lg',
    '20px': 'xl',
    '24px': '2xl',
    '28px': '3xl',
    '30px': '4xl',
    '34px': '5xl',
    '36px': '6xl',
    '40px': '7xl',
    '48px': '8xl',
  };
  
  return fontSizeMap[pxValue] || pxValue;
}