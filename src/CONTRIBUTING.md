# Contributing to Wugweb Kits

Thank you for your interest in contributing to Wugweb Kits! This document provides guidelines and instructions for contributing.

## 🎯 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Kits.git
   cd Kits
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🌿 Branch Naming

Use descriptive branch names:
- `feature/component-name` - For new components
- `fix/bug-description` - For bug fixes
- `docs/page-name` - For documentation updates
- `refactor/component-name` - For refactoring
- `style/component-name` - For styling updates

## 🎨 Design System Guidelines

### CSS Variables Only
All components **must** use CSS variables from `/styles/global.css`:

```tsx
// ✅ Correct
style={{ backgroundColor: 'var(--primary)' }}

// ❌ Wrong
className="bg-blue-500"
style={{ backgroundColor: '#3B82F6' }}
```

### Typography
All text must use **Inter Tight** font family:

```tsx
style={{
  fontFamily: 'Inter Tight, sans-serif',
  fontSize: '14px',
  fontWeight: 'var(--font-weight-medium)',
}}
```

### Spacing
Use spacing tokens:

```tsx
// ✅ Correct
style={{ padding: 'var(--spacing-4)', gap: 'var(--spacing-2)' }}

// ❌ Wrong
style={{ padding: '16px', gap: '8px' }}
```

### Border Radius
Use radius tokens:

```tsx
// ✅ Correct
style={{ borderRadius: 'var(--radius-3)' }}

// ❌ Wrong
style={{ borderRadius: '12px' }}
```

## 📝 Component Checklist

When creating a new component, ensure:

- [ ] Uses CSS variables for **all** colors
- [ ] Uses CSS variables for **all** spacing
- [ ] Uses CSS variables for **all** borders/radius
- [ ] Uses **Inter Tight** font family exclusively
- [ ] Explicit sizing via inline styles
- [ ] TypeScript types are properly defined
- [ ] Accessibility features (ARIA labels, keyboard navigation)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Documentation page created in `/components/ds/pages/`
- [ ] Interactive playground included
- [ ] Code examples provided
- [ ] Design tokens documented
- [ ] Usage guidelines (Do's and Don'ts)
- [ ] Added to `/components/wugweb/index.ts`

## 📄 Documentation Requirements

Each component needs a documentation page with:

1. **Header** - Component name, description, badges
2. **Interactive Playground** - Live component preview with controls
3. **Code Examples** - Auto-generated, copy-paste ready
4. **Design Tokens** - Visual showcase of used tokens
5. **Usage Guidelines** - Do's and Don'ts with examples
6. **Accessibility Info** - Keyboard shortcuts, ARIA usage

See existing docs like `/components/ds/pages/ButtonDoc.tsx` for reference.

## 🧪 Testing

Before submitting:

1. Test on multiple screen sizes (mobile, tablet, desktop)
2. Test keyboard navigation
3. Test with screen readers if possible
4. Verify all design tokens are used correctly
5. Check TypeScript types compile without errors

## 💬 Commit Messages

Use clear, descriptive commit messages:

```
feat: add new DatePicker component
fix: resolve focus ring issue in Input component
docs: update Button documentation with new variants
style: adjust spacing in Dialog component
refactor: optimize RadioGroup performance
```

## 🔄 Pull Request Process

1. **Update your fork** with the latest main branch:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a pull request** with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Screenshots/GIFs for UI changes
   - Link to related issues

3. **Checklist in PR description**:
   ```markdown
   - [ ] Design tokens used correctly
   - [ ] TypeScript types included
   - [ ] Documentation created/updated
   - [ ] Responsive design tested
   - [ ] Accessibility verified
   - [ ] No console errors
   ```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description** - Clear description of the issue
2. **Steps to Reproduce** - Detailed steps
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Screenshots** - If applicable
6. **Environment** - Browser, OS, screen size

## 💡 Suggesting Features

For feature requests:

1. Check if it already exists in issues
2. Provide clear use case
3. Explain why it would benefit the design system
4. Include mockups or examples if possible

## 📁 File Structure

Place files in the correct location:

```
/components/
  wugweb/              # Component implementations
    ComponentName.tsx
  ds/pages/            # Documentation pages
    ComponentNameDoc.tsx
  ui/                  # Base UI components (legacy)
/styles/
  globals.css          # Design tokens (DO NOT add hardcoded values)
  animations.css       # Animation utilities
```

## ✨ Code Style

- Use functional components with React hooks
- Use TypeScript for all new code
- Use descriptive variable names
- Keep components small and focused
- Extract reusable logic into hooks
- Add JSDoc comments for complex functions

```tsx
/**
 * Button component with multiple variants
 * @param variant - Visual style variant
 * @param size - Size variant
 * @param children - Button content
 */
export const Button = ({ variant, size, children }: ButtonProps) => {
  // Implementation
};
```

## 🎓 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inter Tight Font](https://fonts.google.com/specimen/Inter+Tight)

## 📧 Questions?

If you have questions:

- Open a [GitHub Discussion](https://github.com/wugweb-git/Kits/discussions)
- Email us at hello@wugweb.com
- Check existing documentation

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Wugweb Kits! 🎉
