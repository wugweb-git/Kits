# Component Library Usage Guide

## Overview
This guide shows how to properly use components from your design system library (`/components/ui/`) as website UI elements.

---

## Available UI Components

Your design system includes **50+ components** in `/components/ui/`:

### Navigation Components
- `button.tsx` - Primary interaction component
- `navigation-menu.tsx` - Complex navigation patterns
- `menubar.tsx` - Application menu bar
- `breadcrumb.tsx` - Breadcrumb navigation
- `sidebar.tsx` - **Comprehensive sidebar with provider pattern**
- `tabs.tsx` - Tab navigation

### Form Components
- `input.tsx` - Text input fields
- `textarea.tsx` - Multi-line text input
- `checkbox.tsx` - Checkbox input
- `radio-group.tsx` - Radio button groups
- `switch.tsx` - Toggle switch
- `select.tsx` - Dropdown select
- `slider.tsx` - Range slider
- `input-otp.tsx` - One-time password input
- `label.tsx` - Form labels

### Feedback Components
- `badge.tsx` - Status badges
- `alert.tsx` - Alert messages
- `alert-dialog.tsx` - Alert dialogs
- `toast` (via `sonner.tsx`) - Toast notifications
- `progress.tsx` - Progress bars
- `skeleton.tsx` - Loading skeletons

### Layout Components
- `card.tsx` - Card containers
- `separator.tsx` - Visual dividers
- `aspect-ratio.tsx` - Aspect ratio containers
- `scroll-area.tsx` - Custom scrollable areas
- `resizable.tsx` - Resizable panels

### Overlay Components
- `dialog.tsx` - Modal dialogs
- `sheet.tsx` - Slide-out panels
- `drawer.tsx` - Bottom drawer
- `popover.tsx` - Popover menus
- `dropdown-menu.tsx` - Dropdown menus
- `context-menu.tsx` - Right-click menus
- `hover-card.tsx` - Hover preview cards
- `tooltip.tsx` - Tooltips

### Data Display
- `table.tsx` - Data tables
- `chart.tsx` - Charts (with Recharts)
- `carousel.tsx` - Image carousels
- `avatar.tsx` - User avatars
- `pagination.tsx` - Pagination controls
- `command.tsx` - Command palette

---

## Current Site Structure

### ✅ Already Using Library Components

**Header (`/components/ds/Header.tsx`):**
```tsx
import { Button } from '../ui/button';

// ✅ Using library Button for theme toggle
<Button variant="ghost" size="sm" onClick={onToggleTheme}>
  {isDarkMode ? <Sun /> : <Moon />}
</Button>

// ✅ Using library Button for docs
<Button variant="ghost" size="sm">
  <BookOpen size={20} />
</Button>
```

**Overview Page (`/components/ds/pages/Overview.tsx`):**
```tsx
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';

// ✅ Using library components throughout
<Button onClick={() => onNavigate('components')}>
  Browse Components
</Button>

<Card className="hover-lift">
  <CardContent>{/* ... */}</CardContent>
</Card>
```

---

### ⚠️ Partially Using Library Components

**Sidebar (`/components/ds/Sidebar.tsx`):**
```tsx
// ❌ Using native <button> instead of library Button
<button onClick={toggleSection} className="smooth-transition">
  {/* ... */}
</button>

// ✅ SHOULD BE:
import { Button } from '../ui/button';

<Button 
  variant={isActive ? "default" : "ghost"} 
  onClick={toggleSection}
  className="w-full justify-between"
>
  {/* ... */}
</Button>
```

**Problems:**
1. Native buttons don't get automatic focus states, hover states, and accessibility features
2. Inconsistent styling compared to other buttons on the site
3. Missing design token integration that Button component provides

---

## Recommendations

### Priority 1: Refactor Sidebar Navigation

**Current Implementation:**
```tsx
// ❌ Custom button implementation
<button
  onClick={() => handleNavClick(item.id)}
  style={{
    padding: '10px var(--spacing-2)',
    borderRadius: 'var(--radius-md)',
    background: isActive ? 'var(--accent)' : 'transparent',
    // ... many more manual styles
  }}
>
  <Icon size={18} />
  <span>{item.label}</span>
</button>
```

**Recommended Implementation:**
```tsx
// ✅ Using library Button with variants
<Button
  variant={isActive ? "default" : "ghost"}
  size="sm"
  onClick={() => handleNavClick(item.id)}
  className="w-full justify-start gap-3"
>
  <Icon size={18} />
  <span>{item.label}</span>
  {hasSubItems && <ChevronDown size={16} className="ml-auto" />}
</Button>
```

**Benefits:**
- ✅ Automatic focus ring with `--focus-ring-accent`
- ✅ Proper hover states
- ✅ Built-in keyboard navigation
- ✅ Consistent with other buttons on the site
- ✅ Less custom styling code to maintain

---

### Priority 2: Use Shadcn Sidebar Component

Your library includes a comprehensive **Sidebar component** at `/components/ui/sidebar.tsx` with:
- Built-in provider pattern
- Mobile/desktop responsive behavior
- Collapsible state management
- Keyboard shortcuts
- Proper accessibility

**Example Migration:**
```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '../ui/sidebar';

export function DesignSystemSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      asChild
                      isActive={currentPage === item.id}
                    >
                      <a href={`#${item.id}`}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
```

---

### Priority 3: Use More Feedback Components

**Add Toast Notifications:**
```tsx
import { toast } from 'sonner@2.0.3';

// When user copies code
toast.success('Code copied to clipboard!');

// When navigation changes
toast.info('Navigated to Components');
```

**Add Tooltips to Icons:**
```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <BookOpen size={20} />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Documentation</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Add Loading States:**
```tsx
import { Skeleton } from '../ui/skeleton';

// While loading component previews
{isLoading ? (
  <Skeleton className="h-[200px] w-full" />
) : (
  <ComponentPreview />
)}
```

---

### Priority 4: Consistent Input Usage

**Search Bar in Header:**
```tsx
// ❌ Current: Custom div styled as search
<div className="bg-muted border border-border">
  <Search size={16} />
  <span>Search documentation...</span>
</div>

// ✅ Should use library Input
import { Input } from '../ui/input';

<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    type="search"
    placeholder="Search documentation..."
    className="pl-10"
  />
</div>
```

---

## Design Token Integration

### Your Button Component Already Uses Tokens

Looking at `/components/ui/button.tsx`:
```tsx
const buttonVariants = cva(
  // Base styles use design tokens via Tailwind classes
  "bg-primary text-primary-foreground hover:bg-primary/90",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-white",
        outline: "border bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      }
    }
  }
);
```

These Tailwind classes map to your CSS variables:
- `bg-primary` → `var(--primary)`
- `text-primary-foreground` → `var(--primary-foreground)`
- `bg-destructive` → `var(--destructive)`
- `border` → `var(--border)`
- `hover:bg-accent` → `var(--accent)`

**This means by using your library components, you automatically get design token coverage!**

---

## Action Plan

### Immediate Actions (High Impact)

1. **Refactor Sidebar buttons** to use `Button` component
   - Replace all `<button>` with `<Button variant="ghost">`
   - Keep existing functionality, just swap the component
   - Gain automatic accessibility and focus states

2. **Add Toast notifications** for user actions
   - Copy code snippets → toast.success()
   - Navigation changes → toast.info()
   - Errors → toast.error()

3. **Add Tooltips** to icon-only buttons
   - Theme toggle button
   - Documentation button
   - Menu button

4. **Replace search div** with library Input component

### Future Enhancements

5. **Migrate to Shadcn Sidebar component**
   - Full migration to `/components/ui/sidebar.tsx`
   - Better mobile experience
   - Built-in keyboard shortcuts

6. **Add Command Palette** for quick navigation
   - Use `/components/ui/command.tsx`
   - Ctrl/Cmd + K to open
   - Search all components and pages

7. **Add Breadcrumb navigation** to component pages
   - Use `/components/ui/breadcrumb.tsx`
   - Show: Home > Components > Button

8. **Use Skeleton loaders** for code previews
   - Show loading state while syntax highlighting

---

## Benefits Summary

### By Using Library Components:

✅ **Consistency** - All buttons, inputs, and UI elements look the same  
✅ **Accessibility** - Built-in ARIA attributes, keyboard navigation, focus management  
✅ **Design Tokens** - Automatic integration with your CSS variables  
✅ **Less Code** - No need to write custom styling for every button  
✅ **Maintainability** - Update one component file, affects entire site  
✅ **Best Practices** - Shadcn components follow React best practices  
✅ **Type Safety** - Full TypeScript support with proper types  

### Current Status:

- ✅ **Header**: 100% library component usage
- ✅ **Overview Page**: 100% library component usage
- ⚠️ **Sidebar**: 0% library component usage (manual buttons)
- ✅ **Documentation Pages**: 80% library component usage

**Goal**: Achieve 100% library component usage across all site UI elements

---

## Example: Before & After

### Before (Custom Implementation)
```tsx
<button
  onClick={onClick}
  className="smooth-transition button-press"
  style={{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '10px var(--spacing-2)',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
    background: isActive ? 'var(--accent)' : 'transparent',
    color: isActive ? 'var(--accent-foreground)' : 'var(--sidebar-foreground)'
  }}
  onMouseEnter={(e) => {
    if (!isActive) e.currentTarget.style.color = 'var(--accent)';
  }}
  onMouseLeave={(e) => {
    if (!isActive) e.currentTarget.style.color = 'var(--sidebar-foreground)';
  }}
>
  <Icon size={18} />
  <span>{label}</span>
</button>
```

**Lines of code:** 28 lines  
**Custom styling:** 12 properties  
**Event handlers:** 2 (hover states)  
**Accessibility:** Manual implementation needed

### After (Library Component)
```tsx
<Button
  variant={isActive ? "default" : "ghost"}
  size="sm"
  onClick={onClick}
  className="w-full justify-start gap-3"
>
  <Icon size={18} />
  <span>{label}</span>
</Button>
```

**Lines of code:** 7 lines (75% reduction)  
**Custom styling:** 0 properties (uses built-in variants)  
**Event handlers:** 0 (handled by component)  
**Accessibility:** Automatic (focus rings, keyboard nav, ARIA)

---

## Next Steps

1. ✅ Review this guide
2. ⚠️ Decide on sidebar refactoring approach:
   - **Option A**: Keep current structure, swap buttons to library Button
   - **Option B**: Full migration to Shadcn Sidebar component
3. 🔄 Implement chosen approach
4. ✅ Add toast notifications for user feedback
5. ✅ Add tooltips to icon buttons
6. ✅ Test keyboard navigation and accessibility

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-21  
**Maintained By:** Design System Team
