// Design tokens parser for Wugweb Kits design system
export const designTokens = {
  "color": {
    "Neutral": {
      "neutral-10": { "value": "#000000", "type": "color" },
      "neutral-1": { "value": "#ffffff", "type": "color" },
      "neutral-5": { "value": "#a3a3a3", "type": "color" },
      "neutral-9": { "value": "#1a1a1a", "type": "color" },
      "neutral-2": { "value": "#f4f4f4", "type": "color" },
      "neutral-3": { "value": "#dfdfdf", "type": "color" },
      "neutral-8": { "value": "#2b2b2b", "type": "color" },
      "neutral-6": { "value": "#7d7d7d", "type": "color" },
      "neutral-4": { "value": "#bababa", "type": "color" },
      "neutral-7": { "value": "#444444", "type": "color" }
    },
    "Primary": {
      "ash-black": { "value": "#191919", "type": "color" },
      "yellow-primary": { "value": "#ffbe1a", "type": "color" },
      "logo-grey": { "value": "#c9c9c9", "type": "color" }
    },
    "Background": {
      "surface-muted": { "value": "#ebebeb", "type": "color" },
      "surface-base": { "value": "#050505", "type": "color" }
    },
    "Extras": {
      "blue-subtle": { "value": "#2368d7", "type": "color" },
      "aqua-subtle": { "value": "#09e2c0", "type": "color" },
      "green-subtle": { "value": "#3ed219", "type": "color" },
      "peach-subtle": { "value": "#e54f30", "type": "color" }
    },
    "Error": {
      "error-50": { "value": "#fef1f1", "type": "color" },
      "error-100": { "value": "#fee1e1", "type": "color" },
      "error-200": { "value": "#fec8c8", "type": "color" },
      "error-300": { "value": "#fca6a6", "type": "color" },
      "error-400": { "value": "#f87272", "type": "color" },
      "error-500": { "value": "#ef4343", "type": "color" },
      "error-600": { "value": "#dc2828", "type": "color" },
      "error-700": { "value": "#ba1c1c", "type": "color" },
      "error-800": { "value": "#981b1b", "type": "color" },
      "error-900": { "value": "#811d1d", "type": "color" }
    },
    "Warning": {
      "warning-50": { "value": "#fefce7", "type": "color" },
      "warning-100": { "value": "#fef9c3", "type": "color" },
      "warning-200": { "value": "#fef08b", "type": "color" },
      "warning-300": { "value": "#fddf49", "type": "color" },
      "warning-400": { "value": "#facc14", "type": "color" },
      "warning-500": { "value": "#e7b008", "type": "color" },
      "warning-600": { "value": "#c88a04", "type": "color" },
      "warning-700": { "value": "#a26107", "type": "color" },
      "warning-800": { "value": "#864e0e", "type": "color" },
      "warning-900": { "value": "#733f12", "type": "color" }
    },
    "Success": {
      "success-50": { "value": "#f2fdf5", "type": "color" },
      "success-100": { "value": "#defce9", "type": "color" },
      "success-200": { "value": "#bbf7d0", "type": "color" },
      "success-300": { "value": "#85efac", "type": "color" },
      "success-400": { "value": "#4ade80", "type": "color" },
      "success-500": { "value": "#21c45d", "type": "color" },
      "success-600": { "value": "#16a249", "type": "color" },
      "success-700": { "value": "#157f3c", "type": "color" },
      "success-800": { "value": "#166434", "type": "color" },
      "success-900": { "value": "#14522d", "type": "color" }
    },
    "Accent": {
      "main": { "value": "#ffbe1a", "type": "color" },
      "accent-200": { "value": "#cc9815", "type": "color" },
      "accent-300": { "value": "#b38512", "type": "color" },
      "accent-400": { "value": "#997210", "type": "color" },
      "accent-500": { "value": "#805f0d", "type": "color" },
      "accent-600": { "value": "#664c0a", "type": "color" },
      "accent-700": { "value": "#4d3908", "type": "color" },
      "accent-800": { "value": "#332605", "type": "color" },
      "accent-900": { "value": "#1a1303", "type": "color" },
      "accent-alpha": { "value": "#ffbe1a1a", "type": "color" }
    }
  },
  "fonts": {
    "family": {
      "Wugweb": { "value": "Inter Tight", "type": "text" }
    },
    "size": {
      "3xs": { "value": 10, "type": "number" },
      "2xs": { "value": 12, "type": "number" },
      "xs": { "value": 13, "type": "number" },
      "sm": { "value": 14, "type": "number" },
      "md": { "value": 16, "type": "number" },
      "lg": { "value": 18, "type": "number" },
      "xl": { "value": 20, "type": "number" },
      "2xl": { "value": 24, "type": "number" },
      "3xl": { "value": 28, "type": "number" },
      "4xl": { "value": 30, "type": "number" },
      "5xl": { "value": 34, "type": "number" },
      "6xl": { "value": 36, "type": "number" },
      "7xl": { "value": 40, "type": "number" },
      "8xl": { "value": 48, "type": "number" },
      "9xl": { "value": 58, "type": "number" },
      "10xl": { "value": 64, "type": "number" },
      "11xl": { "value": 80, "type": "number" }
    },
    "weight": {
      "thin": { "value": 100, "type": "number" },
      "extralight": { "value": 200, "type": "number" },
      "light": { "value": 300, "type": "number" },
      "normal": { "value": 400, "type": "number" },
      "medium": { "value": 500, "type": "number" },
      "semibold": { "value": 600, "type": "number" },
      "bold": { "value": 700, "type": "number" },
      "extrabold": { "value": 800, "type": "number" },
      "black": { "value": 900, "type": "number" }
    },
    "line-height": {
      "3xs": { "value": 15, "type": "number" },
      "2xs": { "value": 18, "type": "number" },
      "xs": { "value": 19, "type": "number" },
      "sm": { "value": 21, "type": "number" },
      "md": { "value": 24, "type": "number" },
      "lg": { "value": 28, "type": "number" },
      "xl": { "value": 30, "type": "number" },
      "2xl": { "value": 30, "type": "number" },
      "3xl": { "value": 35, "type": "number" },
      "4xl": { "value": 38, "type": "number" },
      "5xl": { "value": 42, "type": "number" },
      "6xl": { "value": 45, "type": "number" },
      "7xl": { "value": 50, "type": "number" },
      "8xl": { "value": 60, "type": "number" },
      "9xl": { "value": 72, "type": "number" },
      "10xl": { "value": 80, "type": "number" },
      "11xl": { "value": 100, "type": "number" }
    }
  },
  "radius": {
    "r-0": { "value": 0, "type": "number" },
    "r-1": { "value": 4, "type": "number" },
    "r-2": { "value": 8, "type": "number" },
    "r-3": { "value": 12, "type": "number" },
    "r-4": { "value": 16, "type": "number" },
    "r-5": { "value": 20, "type": "number" },
    "r-6": { "value": 24, "type": "number" },
    "r-8": { "value": 32, "type": "number" },
    "r-full": { "value": 9999, "type": "number" }
  },
  "spacing": {
    "s-0": { "value": "0", "type": "spacing" },
    "s-1": { "value": "4", "type": "spacing" },
    "s-2": { "value": "8", "type": "spacing" },
    "s-3": { "value": "12", "type": "spacing" },
    "s-4": { "value": "16", "type": "spacing" },
    "s-5": { "value": "20", "type": "spacing" },
    "s-6": { "value": "24", "type": "spacing" },
    "s-7": { "value": "28", "type": "spacing" },
    "s-8": { "value": "32", "type": "spacing" },
    "s-9": { "value": "36", "type": "spacing" },
    "s-10": { "value": "40", "type": "spacing" },
    "s-11": { "value": "44", "type": "spacing" },
    "s-12": { "value": "48", "type": "spacing" }
  },
  "padding": {
    "p-0": { "value": 0, "type": "number" },
    "p-1": { "value": 4, "type": "number" },
    "p-2": { "value": 8, "type": "number" },
    "p-3": { "value": 12, "type": "number" },
    "p-4": { "value": 16, "type": "number" },
    "p-5": { "value": 20, "type": "number" },
    "p-6": { "value": 24, "type": "number" },
    "p-7": { "value": 28, "type": "number" },
    "p-8": { "value": 32, "type": "number" },
    "p-9": { "value": 36, "type": "number" },
    "p-10": { "value": 40, "type": "number" },
    "p-11": { "value": 44, "type": "number" },
    "p-12": { "value": 48, "type": "number" }
  },
  "gap": {
    "gap-0": { "value": 0, "type": "number" },
    "gap-1": { "value": 4, "type": "number" },
    "gap-2": { "value": 8, "type": "number" },
    "gap-3": { "value": 12, "type": "number" },
    "gap-4": { "value": 16, "type": "number" },
    "gap-5": { "value": 20, "type": "number" },
    "gap-6": { "value": 24, "type": "number" },
    "gap-7": { "value": 28, "type": "number" },
    "gap-8": { "value": 32, "type": "number" },
    "gap-9": { "value": 36, "type": "number" },
    "gap-10": { "value": 40, "type": "number" },
    "gap-11": { "value": 44, "type": "number" },
    "gap-12": { "value": 48, "type": "number" }
  }
};

// Helper to format token names for display
export function formatTokenName(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Helper to get usage description
export function getTokenUsage(category: string, name: string): string {
  const usageMap: Record<string, Record<string, string>> = {
    'Neutral': {
      'neutral-1': 'White - Primary text on dark backgrounds',
      'neutral-2': 'Light grey - Subtle backgrounds',
      'neutral-3': 'Grey - Secondary backgrounds and borders',
      'neutral-4': 'Medium grey - Disabled states',
      'neutral-5': 'Grey - Muted text and placeholders',
      'neutral-6': 'Dark grey - Secondary text',
      'neutral-7': 'Darker grey - Borders and dividers',
      'neutral-8': 'Very dark grey - Primary buttons and surfaces',
      'neutral-9': 'Almost black - Headings and emphasis',
      'neutral-10': 'Black - Maximum contrast text'
    },
    'Accent': {
      'main': 'Primary accent color - Links, focus states, highlights',
      'accent-200': 'Darker accent variant',
      'accent-300': 'Darker accent variant',
      'accent-400': 'Darker accent variant',
      'accent-500': 'Darker accent variant',
      'accent-600': 'Darker accent variant',
      'accent-700': 'Darker accent variant',
      'accent-800': 'Darker accent variant',
      'accent-900': 'Darkest accent variant',
      'accent-alpha': 'Accent with alpha transparency - Subtle highlights'
    }
  };
  
  return usageMap[category]?.[name] || `${category} color for UI elements`;
}
