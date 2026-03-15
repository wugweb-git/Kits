# Wugweb Kits - Design System

<div align="center">
  
  ![Wugweb Kits](https://img.shields.io/badge/Wugweb-Design_System-FFBE1A?style=for-the-badge&logo=react&logoColor=white)
  [![GitHub](https://img.shields.io/badge/GitHub-wugweb--git-181717?style=for-the-badge&logo=github)](https://github.com/wugweb-git/Kits)
  [![TypeScript](https://img.shields.io/badge/TypeScript-93.2%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  **A comprehensive, production-ready design system with professional UI components and design tokens for building consistent web applications.**

  [View Demo](https://wugweb.com) · [Documentation](https://wugweb.com) · [Report Bug](https://github.com/wugweb-git/Kits/issues) · [Request Feature](https://github.com/wugweb-git/Kits/issues)

</div>

---

## ✨ Features

- 🎨 **100% Design Token Coverage** - All components use CSS variables for complete customization
- 🎯 **50+ Production Components** - Comprehensive component library ready for production
- ♿ **Accessibility First** - Built on Radix UI primitives with WCAG 2.1 compliance
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- 🌗 **Dark Mode Ready** - Complete dark theme support out of the box
- ⚡ **TypeScript Native** - Full type safety and IntelliSense
- 🎭 **Inter Tight Typography** - Consistent, modern typography system
- 🔧 **Easy Customization** - Update the entire theme by editing CSS variables
- 📦 **Tree Shakeable** - Import only what you need
- 🚀 **Production Ready** - Battle-tested components used in real applications

---

## 📦 Component Library

### Core Components
- **Button** - Primary, Secondary, Outline, Ghost variants
- **Social Button** - Icon-first authentication buttons
- **CTA Banner** - Responsive call-to-action banners

### Form Controls
- **Input** - Text, email, password, number inputs with validation
- **Textarea** - Multi-line text input
- **Checkbox** - Selection checkboxes
- **Radio Group** - Radio button groups
- **Switch** - Toggle switches
- **Select** - Dropdown selects with grouping
- **Label** - Form labels

### Overlays & Feedback
- **Dialog** - Modal dialogs with animations
- **Toast** - Toast notifications (Sonner integration)
- **Alert** - Alert messages
- **Alert Dialog** - Confirmation dialogs
- **Drawer** - Slide-out drawers
- **Popover** - Contextual popovers

### Navigation
- **Breadcrumb** - Navigation breadcrumbs
- **Tabs** - Tabbed interfaces
- **Pagination** - Page navigation
- **Navigation Menu** - Complex navigation menus
- **Sidebar** - Application sidebars

### Data Display
- **Card** - Content cards
- **Table** - Data tables
- **Avatar** - User avatars
- **Badge** - Status badges
- **Chip** - Tag chips
- **Skeleton** - Loading skeletons

### Utilities
- **Divider** - Section dividers
- **Tooltip** - Helpful tooltips
- **Accordion** - Collapsible content
- **Collapsible** - Expandable sections
- **Progress** - Progress indicators
- **Slider** - Range sliders

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/wugweb-git/Kits.git

# Navigate to the project
cd Kits

# Install dependencies
npm install

# Start development server
npm run dev
```

### Basic Usage

```tsx
import { Button, Input, Label } from '@/components/wugweb';

function LoginForm() {
  return (
    <form>
      <Label htmlFor="email">Email</Label>
      <Input 
        id="email" 
        type="email" 
        placeholder="you@example.com" 
      />
      
      <Button variant="primary">Sign In</Button>
    </form>
  );
}
```

---

## 🎨 Design Tokens

All components strictly use CSS variables from `/styles/global.css`:

### Colors
```css
--primary: Primary actions and selections
--secondary: Secondary actions
--accent: Highlights and focus states (#FFBE1A)
--destructive: Errors and warnings
--success: Success states
--muted: Muted backgrounds
--foreground: Primary text
--background: Page background
--card: Card backgrounds
--border: Borders
--ring: Focus rings
```

### Typography
```css
Font Family: Inter Tight, sans-serif
Font Weights:
  --font-weight-regular: 400
  --font-weight-medium: 500
  --font-weight-semibold: 600
  --font-weight-bold: 700
```

### Spacing
```css
--spacing-1 through --spacing-12
--layout-padding-mobile
--layout-padding-tablet
--layout-padding-desktop-right
```

### Border Radius
```css
--radius-1: 4px
--radius-2: 8px
--radius-3: 12px
--radius-4: 16px
--radius-5: 20px
--radius-full: 9999px
```

---

## 📖 Documentation

Comprehensive documentation is available in the app, featuring:

- **Interactive Playgrounds** - Test components in real-time
- **Live Code Generation** - Copy-paste ready code
- **Design Token Showcases** - Visual design token reference
- **Usage Guidelines** - Best practices and do's/don'ts
- **Accessibility Info** - WCAG compliance details

---

## 🎯 Customization

Update the entire design system by editing CSS variables:

```css
/* /styles/global.css */

:root {
  /* Change accent color */
  --accent: rgba(255, 100, 100, 1.00);
  
  /* Update spacing scale */
  --spacing-4: 20px;
  
  /* Modify border radius */
  --radius-3: 16px;
}
```

All components will automatically reflect your changes!

---

## 🏗️ Project Structure

```
Kits/
├── components/
│   ├── wugweb/          # Design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Dialog.tsx
│   │   └── ...
│   ├── ui/              # Base UI components
│   └── ds/              # Documentation components
├── styles/
│   ├── globals.css      # Design tokens & global styles
│   └── animations.css   # Animation utilities
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── lib/                 # Library code
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Component Checklist
- [ ] Uses CSS variables for all colors
- [ ] Uses CSS variables for spacing
- [ ] Uses Inter Tight font family
- [ ] Explicit sizing via inline styles
- [ ] Accessibility features implemented
- [ ] Documentation page created
- [ ] TypeScript types included
- [ ] Responsive design support

---

## 📊 Statistics

- **Total Components**: 50+
- **Design Token Coverage**: 100%
- **TypeScript Coverage**: 93.2%
- **CSS Coverage**: 6.8%
- **Accessibility**: WCAG 2.1 AA Compliant
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- UI primitives from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide Icons](https://lucide.dev/)
- Font: [Inter Tight](https://fonts.google.com/specimen/Inter+Tight)
- Toast notifications: [Sonner](https://sonner.emilkowal.ski/)
- Inspired by [shadcn/ui](https://ui.shadcn.com/)

---

## 📧 Contact

- **Email**: hello@wugweb.com
- **GitHub**: [@wugweb-git](https://github.com/wugweb-git)
- **Website**: [wugweb.com](https://wugweb.com)

---

## 🔖 Badges

Show your support by using our badges:

### Designed by Wugweb
```html
<a href="https://wugweb.com?utm_source=badge&utm_medium=referral&utm_campaign=designed-by" target="_blank" rel="noopener noreferrer">
  <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="40" rx="8" fill="#121212"/>
    <rect x="0.5" y="0.5" width="179" height="39" rx="7.5" stroke="#2B2B2B"/>
    <path d="M12 20L14.5 14L17 20L14.5 26L12 20Z" fill="#FFBE1A"/>
    <path d="M17 20L19.5 14L22 20L19.5 26L17 20Z" fill="#FFBE1A" opacity="0.6"/>
    <text x="30" y="16" font-family="Inter Tight, sans-serif" font-size="10" font-weight="500" fill="#A1A1A1">DESIGNED BY</text>
    <text x="30" y="28" font-family="Inter Tight, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF">Wugweb</text>
  </svg>
</a>
```

---

<div align="center">

**[⬆ Back to Top](#wugweb-kits---design-system)**

Made with ❤️ by the Wugweb team

</div>