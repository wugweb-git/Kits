# ⚠️ Missing Components Report
## Components Needed to Complete Documentation

---

## 🚫 Critical Missing Components (No Figma Instance)

### 1. **Card Component**
**Status**: ❌ Not found in Figma  
**Referenced in**: Sidebar → Components → Surfaces → Card  
**Current doc page**: `/components/ds/pages/CardDoc.tsx` (uses placeholder)

**What we need**:
```
Card Component with:
- Variants: default, elevated, outlined, ghost
- Properties:
  • Optional image/media area (top)
  • Header section (title + optional subtitle)
  • Body/description content area
  • Optional footer (actions/buttons)
  • Optional icon/avatar
- States: default, hover, pressed
- Sizes: sm, md, lg (optional)
- Token bindings:
  • Background colors
  • Border colors and widths
  • Border radius (likely 8px, 12px, 16px)
  • Shadows/elevation levels
  • Spacing (padding, gaps)
  • Typography styles
```

---

### 2. **Alert Component**
**Status**: ❌ Not found in Figma  
**Referenced in**: Sidebar → Components → Feedback → Alert  
**Current doc page**: None

**What we need**:
```
Alert Component with:
- Variants: info, success, warning, error
- Properties:
  • Icon (left side, matches variant)
  • Title text (bold, 14-16px)
  • Description text (regular, 12-14px)
  • Optional close button (×)
- States: default, dismissible
- Layout: Horizontal (icon + content + close)
- Token bindings:
  • Background colors (light tints for each variant)
  • Border colors (matching variant)
  • Icon colors (info: blue, success: green, warning: amber, error: red)
  • Text colors
  • Border radius (6px or 8px)
  • Padding (12-16px)
```

---

### 3. **Badge Component**
**Status**: ❌ Not found in Figma  
**Referenced in**: Sidebar → Components → Feedback → Badge  
**Current doc page**: None

**What we need**:
```
Badge Component with:
- Variants: filled, outlined, dot (notification dot)
- Sizes: sm (16px height), md (20px height), lg (24px height)
- Colors: default, primary, success, warning, error, neutral
- Properties:
  • Label text or count (e.g., "3", "New", "Beta")
  • Optional dot-only variant (8px circle)
- Position variants (for notification badges):
  • top-right
  • top-left
  • bottom-right
  • bottom-left
- States: default, hover (if interactive)
- Token bindings:
  • Background colors (all color variants)
  • Text colors
  • Border colors (for outlined variant)
  • Border radius (full rounded, likely 100px)
  • Padding (4-8px horizontal, 2-4px vertical)
  • Font sizes (10-12px)
```

---

### 4. **Pagination Component**
**Status**: ❌ Not found in Figma  
**Referenced in**: Sidebar → Components → Navigation → Pagination  
**Current doc page**: None

**What we need**:
```
Pagination Component with:
- Variants:
  • Simple (just prev/next arrows)
  • Full (page numbers + prev/next)
  • Compact (current page + total + prev/next)
- Elements:
  • Previous button (arrow left icon)
  • Page number buttons (1, 2, 3... or just current)
  • Ellipsis (... for skipped pages)
  • Next button (arrow right icon)
  • Optional "Go to page" input
- States:
  • Page buttons: default, active, hover, disabled
  • Prev/Next: default, hover, disabled
- Token bindings:
  • Button backgrounds (default, active, hover)
  • Border colors
  • Text colors
  • Icon colors
  • Border radius (6px or 8px per button)
  • Spacing (4-8px gaps between buttons)
  • Button size (32px or 36px height)
```

---

### 5. **Icon Component Set**
**Status**: ⚠️ Scattered IconsNew instances, not organized  
**Referenced in**: Sidebar → Components → Media → Icon  
**Current doc page**: None

**What we need**:
```
Organized Icon Component Library with:
- Consistent sizes: 16px, 20px, 24px, 32px variants
- Consistent stroke widths: 1.5px, 2px
- Icon categories:
  • Essentials (home, search, menu, close, etc.)
  • Arrows & Navigation (chevron, arrow, caret)
  • Actions (edit, delete, add, remove, etc.)
  • Status (check, error, warning, info)
  • Media (image, video, file, etc.)
  • Social (see SocialButton for examples)
- States: default, hover (color change), disabled (opacity)
- Properties:
  • Color token binding (foreground, muted, accent)
  • Size variant (16, 20, 24, 32)
- Token bindings:
  • Fill or stroke colors
  • Opacity levels
  • Size tokens
```

---

## ⚠️ Components Needing More Variants

### 6. **Checkbox - Missing States**
**What exists**: Unchecked state only  
**Missing**:
- ✅ Checked state (with checkmark icon)
- ➖ Indeterminate state (horizontal line icon)
- 🚫 Disabled state (both unchecked and checked, with reduced opacity)
- ❌ Error state (red border, perhaps with error message)

---

### 7. **Toggle - Missing States**
**What exists**: On state only (yellow background, circle on right)  
**Missing**:
- ⭕ Off state (gray background, circle on left)
- 🚫 Disabled state - On (reduced opacity, yellow)
- 🚫 Disabled state - Off (reduced opacity, gray)

---

### 8. **RadioButton - Missing States**
**What exists**: Checked/selected state only  
**Missing**:
- ⭕ Unchecked state (empty circle, just border)
- 🚫 Disabled state - Checked (reduced opacity)
- 🚫 Disabled state - Unchecked (reduced opacity)
- ❌ Error state (red border for validation)

---

### 9. **InputTextBox - Missing States**
**What exists**: Default state (with placeholder)  
**Missing**:
- 🎯 Focused state (blue/accent border, no placeholder or shifted label)
- ❌ Error state (red border + error message below)
- ✅ Success state (green border + success message)
- 🚫 Disabled state (gray background, reduced opacity)
- 📝 Filled state (with actual text entered)

---

### 10. **Button - Missing Sizes and States**
**What exists**: sm size, Primary & Secondary variants  
**Missing**:
- **Sizes**: md, lg, xl
- **States** (for all variants):
  • Hover (subtle background change)
  • Pressed/Active (darker background)
  • Disabled (reduced opacity)
  • Loading (with spinner icon)
- **Variants**:
  • Accent (yellow #FFBE1A background)
  • Outline (transparent bg, colored border)
  • Ghost (transparent bg, no border)
  • Destructive (red background for dangerous actions)

---

### 11. **Tags - Missing Variants**
**What exists**: Filled variant (black background, white text)  
**Missing**:
- **Variants**:
  • Outlined (transparent bg, black border)
  • Ghost (transparent bg, no border, colored text)
- **Properties**:
  • Removable state (with × close icon on right)
  • Icon on left (optional leading icon)
- **Sizes**: sm (smaller padding/text), md (current), lg (larger)
- **Colors**: Multiple color options (blue, green, red, amber tags)

---

### 12. **Slider - Missing States and Variants**
**What exists**: Active/default state  
**Missing**:
- 🚫 Disabled state (gray colors, non-interactive)
- 🎯 Focus state (thumb with focus ring)
- 📊 Range variant (two thumbs for min/max selection)
- ↕️ Vertical orientation
- 🏷️ Step markers (visible tick marks at intervals)
- 🔢 Value label variants (always visible, on hover, on drag)

---

### 13. **Accordion - Missing Collapsed State**
**What exists**: Expanded state only  
**Missing**:
- ➕ Collapsed state (header visible, content hidden, chevron rotated)
- 🎯 Focus state (keyboard navigation support)
- 🚫 Disabled state (cannot expand)

---

### 14. **MenuItem - Needs Complete State Set**
**What exists**: Multiple states partially visible  
**Missing clarity on**:
- Complete hover state (needs specific hover background color)
- Complete focus state (for keyboard navigation)
- Active/selected state (needs clear visual indicator, not just background)
- Pressed state
- With leading icon variants (all states)
- With trailing icon/badge variants

---

### 15. **SocialButton - Missing Variants**
**What exists**: Google sign-in button only  
**Missing**:
- **Platform variants**:
  • Apple (black, Apple logo)
  • Facebook (blue, Facebook logo)
  • GitHub (dark gray, GitHub logo)
  • Twitter/X (black, X logo)
  • Microsoft (white with blue accent, Microsoft logo)
- **States** (for all variants):
  • Hover (subtle background change)
  • Pressed (darker)
  • Disabled (reduced opacity)

---

## 📊 Summary

**Total components missing from Figma**: **5**
1. Card
2. Alert
3. Badge
4. Pagination
5. Icon Component Set (organized)

**Total components needing variant expansion**: **11**
1. Checkbox (need 3 more states)
2. Toggle (need 3 more states)
3. RadioButton (need 4 more states)
4. InputTextBox (need 4 more states)
5. Button (need 4 sizes + 5 states + 4 variants)
6. Tags (need 2 variants + sizes + colors)
7. Slider (need 5 variants/states)
8. Accordion (need 3 states)
9. MenuItem (need complete state clarity)
10. SocialButton (need 5 platforms + states)

---

## 🎯 Recommendation

**Option A**: Proceed with updating existing documentation pages that have real components available (even if incomplete), and create new docs for available components. Mark incomplete states in the documentation with notes.

**Option B**: Pause and request all missing components + variant sets from user first, then proceed with complete documentation build.

**Option C** ✅ **RECOMMENDED**: Hybrid approach:
1. **Update docs NOW** for components that exist (even with incomplete variants)
2. **Create new docs NOW** for available components (Slider, Dropdown, Header, Chip, Breadcrumb, MenuItem, Avatar, Logo, etc.)
3. **Document missing states** with placeholder notes: "Additional states coming soon"
4. **Request missing components** (Card, Alert, Badge, Pagination, Icon set) in parallel
5. **Update docs incrementally** as new variants are provided

This allows progress while waiting for additional component work.

---

**Your call**: Which option should we proceed with?
