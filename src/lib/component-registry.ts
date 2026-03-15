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
              background: '#2b2b2b',
              color: '#ffffff',
              border: '1px solid #444444',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'secondary (--secondary)',
              color: 'foreground (--foreground)',
              borderColor: 'border (--border)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
            }
          },
          {
            name: 'hover',
            styles: {
              background: '#121212',
              color: '#ffbe1a',
              border: '1px solid #ffbe1a',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'background (--background)',
              color: 'accent (--accent)',
              borderColor: 'accent (--accent)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
            }
          },
          {
            name: 'pressed',
            styles: {
              background: '#ffbe1a',
              color: '#121212',
              border: '1px solid #ffbe1a',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'accent (--accent)',
              color: 'accent-foreground (--accent-foreground)',
              borderColor: 'accent (--accent)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
            }
          },
          {
            name: 'focused',
            styles: {
              background: '#2b2b2b',
              color: '#ffffff',
              border: '1px solid #444444',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'secondary (--secondary)',
              color: 'foreground (--foreground)',
              borderColor: 'border (--border)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
              ring: 'ring (--ring) - 2px accent outline',
            }
          },
          {
            name: 'disabled',
            styles: {
              background: '#2b2b2b',
              color: '#ffffff',
              border: '1px solid #444444',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
              opacity: '0.5',
            },
            tokenMapping: {
              background: 'secondary (--secondary)',
              color: 'foreground (--foreground)',
              borderColor: 'border (--border)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
              opacity: '0.5',
            }
          },
          {
            name: 'loading',
            styles: {
              background: '#2b2b2b',
              color: '#ffffff',
              border: '1px solid #444444',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'secondary (--secondary)',
              color: 'foreground (--foreground)',
              borderColor: 'border (--border)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
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
              background: '#262626',
              color: '#a1a1a1',
              border: '1px solid #2b2b2b',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'muted (--muted)',
              color: 'muted-foreground (--muted-foreground)',
              borderColor: 'border (--border)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
            }
          },
          {
            name: 'hover',
            styles: {
              background: '#2b2b2b',
              color: '#ffffff',
              border: '1px solid #444444',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'secondary (--secondary)',
              color: 'foreground (--foreground)',
              borderColor: 'border (--border)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
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
              background: '#ffbe1a',
              color: '#121212',
              border: '1px solid #ffbe1a',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'accent (--accent)',
              color: 'accent-foreground (--accent-foreground)',
              borderColor: 'accent (--accent)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
            }
          },
          {
            name: 'hover',
            styles: {
              background: '#e6aa17',
              color: '#121212',
              border: '1px solid #e6aa17',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'accent/90',
              color: 'accent-foreground (--accent-foreground)',
              borderColor: 'accent/90',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
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
              color: '#ffffff',
              border: '1px solid #444444',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'transparent',
              color: 'foreground (--foreground)',
              borderColor: 'border (--border)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
            }
          },
          {
            name: 'hover',
            styles: {
              background: '#2b2b2b',
              color: '#ffffff',
              border: '1px solid #ffbe1a',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'secondary (--secondary)',
              color: 'foreground (--foreground)',
              borderColor: 'accent (--accent)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
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
              background: '#ef4343',
              color: '#ffffff',
              border: '1px solid #ef4343',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '20px',
              fontWeight: '600',
              height: '64px',
            },
            tokenMapping: {
              background: 'destructive (--destructive)',
              color: 'destructive-foreground (--destructive-foreground)',
              borderColor: 'destructive (--destructive)',
              borderRadius: 'radius-lg (12px)',
              padding: '20px',
              fontSize: 'text-xl (20px)',
              fontWeight: 'font-semibold (600)',
            }
          }
        ]
      }
    ],
    usageNotes: 'Use Primary variant for main call-to-action buttons like "Submit", "Save", "Continue". Use Secondary for less prominent actions. Use Accent for high-emphasis actions. Use Outline for tertiary actions. Use Destructive for delete or dangerous actions. Buttons support left/right icons and loading states.',
    accessibility: [
      'Keyboard accessible (Tab, Enter, Space)',
      'Focus visible with 2px accent ring indicator',
      'Disabled state communicated to screen readers (aria-disabled)',
      'Sufficient color contrast meets WCAG AA standards',
      'Loading state shows spinner with proper aria-busy attribute',
      'Button text should be descriptive of the action',
    ],
    codeSnippet: `import { Button } from './components/wugweb/Button';
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