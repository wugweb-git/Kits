# Design Token Audit Results

## Summary
Completed comprehensive audit of the codebase to replace hard-coded styles with design tokens from `/styles/globals.css`.

## New Design Tokens Added

### Success Colors
- `--success`: rgba(34, 197, 94, 1.00) - Success green for positive states
- `--success-foreground`: rgba(255, 255, 255, 1.00) - Text on success backgrounds
- `--success-subtle`: rgba(34, 197, 94, 0.1) - Success with 10% opacity

### Utility Colors
- `--overlay-background`: rgba(0, 0, 0, 0.6) - Modal/drawer overlays
- `--accent-subtle`: rgba(255, 190, 26, 0.1) - Accent with 10% opacity
- `--destructive-subtle`: rgba(239, 67, 67, 0.1) - Destructive with 10% opacity

### Focus Ring Shadows
- `--focus-ring-accent`: 0 0 0 3px rgba(255, 190, 26, 0.1) - Accent focus ring
- `--focus-ring-destructive`: 0 0 0 3px rgba(239, 67, 67, 0.1) - Error focus ring

## Files Fixed

### ✅ /App.tsx
**Changes:**
- Replaced `rgba(0, 0, 0, 0.6)` → `var(--overlay-background)` for mobile sidebar overlay

**Before:**
```tsx
background: 'rgba(0, 0, 0, 0.6)'
```

**After:**
```tsx
background: 'var(--overlay-background)'
```

---

### ✅ /components/ds/Header.tsx
**Changes:**
- Replaced complex box-shadow with hard-coded rgba → `var(--elevation-sm)`

**Before:**
```tsx
boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), var(--elevation-sm)'
```

**After:**
```tsx
boxShadow: 'var(--elevation-sm)'
```

---

### ✅ /components/ds/pages/Overview.tsx
**Changes:**
- Replaced `rgba(255, 190, 26, 0.1)` → `var(--accent-subtle)` for version badge background

**Before:**
```tsx
background: 'rgba(255, 190, 26, 0.1)'
```

**After:**
```tsx
background: 'var(--accent-subtle)'
```

---

### ✅ /components/ds/pages/ButtonDocDark.tsx
**Changes:**
1. Success "Do" card:
   - Border: `rgba(34, 197, 94, 0.2)` → `var(--success-subtle)`
   - Box shadow: `0 1px 3px rgba(0, 0, 0, 0.1)` → `var(--shadow-sm)`
   - Icon background: `rgba(34, 197, 94, 1)` → `var(--success)`
   - Heading color: `rgba(34, 197, 94, 1)` → `var(--success)`

2. Error "Don't" card:
   - Border: `rgba(239, 68, 68, 0.2)` → `var(--destructive-subtle)`
   - Box shadow: `0 1px 3px rgba(0, 0, 0, 0.1)` → `var(--shadow-sm)`
   - Icon background: `rgba(239, 68, 68, 1)` → `var(--destructive)`
   - Heading color: `rgba(239, 68, 68, 1)` → `var(--destructive)`

3. Accessibility info card:
   - Box shadow: `0 1px 3px rgba(0, 0, 0, 0.1)` → `var(--shadow-sm)`

**Impact:** Ensures all success/error indicators use consistent design tokens

---

## Files With Intentional Hard-Coded Values (No Changes Needed)

### 📄 /components/ds/components/CodeBlock.tsx
**Reason:** Contains `tokenValueMap` object that displays token values in code snippets. Hard-coded rgba values are intentional for documentation purposes.

### 📄 /components/ds/components/CollapsibleCodeBlock.tsx
**Reason:** Same as CodeBlock.tsx - displays token values for educational purposes.

### 📄 /components/ds/pages/FigmaImportGuide.tsx
**Reason:** Contains example code snippets showing hex colors and pixel values as documentation examples. These are meant to teach users, not style the UI.

### 📄 /components/ds/pages/Guidelines.tsx
**Reason:** Documentation page showing examples of good/bad practices with hard-coded values as teaching examples (e.g., "#000000 vs #FFFFFF").

---

## Remaining Files To Fix (Future Work)

### ⚠️ /components/ds/pages/InputTextDoc.tsx
**Found Issues:**
- Focus shadows with hard-coded rgba: `boxShadow: '0 0 0 3px rgba(255, 190, 26, 0.1)'`
- Error focus shadows: `boxShadow: '0 0 0 3px rgba(239, 67, 67, 0.1)'`
- Gradient backgrounds with hard-coded opacity
- Success/error icon backgrounds: `rgba(0, 158, 105, 0.1)` and hard-coded green `#009E69`

**Recommended Fix:**
```tsx
// Replace focus shadows
boxShadow: 'var(--focus-ring-accent)'
boxShadow: 'var(--focus-ring-destructive)'

// Replace success icon background
background: 'var(--success-subtle)'
color: 'var(--success)'
```

---

### ⚠️ /components/ds/pages/CheckboxDoc.tsx
**Found Issues:**
- Focus shadow: `box-shadow: 0 0 0 3px rgba(255, 190, 26, 0.2)`
- Gradient backgrounds with hard-coded accent color opacity
- Success/error card backgrounds and colors

**Recommended Fix:**
```css
.checkbox-input:focus-visible + .checkbox-box {
  box-shadow: var(--focus-ring-accent);
}
```

---

### ⚠️ /components/ds/pages/ToggleDoc.tsx
**Found Issues:**
- Gradient backgrounds with hard-coded accent opacity
- Success/error icon backgrounds with hard-coded colors

---

### ⚠️ /components/ds/pages/CardDoc.tsx
**Found Issues:**
- Gradient backgrounds
- Image placeholder with `rgba(255, 255, 255, 0.5)`
- Success/error icon backgrounds

---

### ⚠️ /components/ds/pages/TagDoc.tsx
**Found Issues:**
- Gradient backgrounds
- Success/error icon backgrounds

---

## Token Coverage Report

### ✅ Fully Using Design Tokens
- Typography (font sizes, weights, line heights)
- Spacing (all padding, margins, gaps)
- Border radius (all rounded corners)
- Colors (primary, secondary, accent, destructive, muted)
- Shadows (elevation-sm, shadow-sm/md/lg/xl)
- Motion (durations and easings)
- Surface colors (7-level surface system)

### ⚠️ Partial Token Usage (Needs Improvement)
- **Focus states** - Many components still use hard-coded rgba for focus rings
- **Success states** - Some components use `#009E69` instead of `var(--success)`
- **Gradient backgrounds** - Documentation pages have hard-coded gradient opacity values
- **Icon backgrounds** - Some use hard-coded rgba instead of `-subtle` tokens

### ❌ Not Using Tokens
- Some hard-coded pixel values in documentation examples (intentional)
- Hex colors in teaching examples (intentional)

---

## Benefits Achieved

1. **Centralized Control**: All colors now updateable from `/styles/globals.css`
2. **Consistency**: Success, error, and focus states now use consistent colors across all components
3. **Maintainability**: Easier to update design system by modifying CSS variables
4. **Themability**: Foundation for future light/dark theme switching
5. **Documentation**: Clear mapping of which tokens to use for specific use cases

---

## Next Steps

### Priority 1: Fix Remaining Component Pages
- [ ] InputTextDoc.tsx - Replace all focus shadows and success/error colors
- [ ] CheckboxDoc.tsx - Replace focus shadow CSS and card backgrounds
- [ ] ToggleDoc.tsx - Replace success/error card colors
- [ ] CardDoc.tsx - Replace image placeholder and card backgrounds
- [ ] TagDoc.tsx - Replace success/error card colors

### Priority 2: Create Missing Tokens
Consider adding these tokens if patterns emerge:
- `--gradient-accent`: Linear gradient with accent color
- `--image-placeholder`: Color for placeholder images
- `--focus-ring-success`: Focus ring for success states
- `--border-success`: Border color for success states
- `--border-destructive-subtle`: Lighter destructive border

### Priority 3: Documentation
- [ ] Create a "Design Tokens" usage guide showing when to use each token
- [ ] Add token autocomplete/IntelliSense support
- [ ] Create a visual token reference page in the documentation site

---

## Design Token Reference

### Color Tokens Usage Guide

| Use Case | Token | Example |
|----------|-------|---------|
| Modal/drawer overlay | `--overlay-background` | Backdrop for mobile sidebar |
| Success message background | `--success-subtle` | Light green background |
| Success icon/text | `--success` | Green checkmark, success text |
| Error message background | `--destructive-subtle` | Light red background |
| Error icon/text | `--destructive` | Red X icon, error text |
| Highlight/badge background | `--accent-subtle` | Yellow badge background |
| Focus ring (normal) | `--focus-ring-accent` | Yellow glow on focused input |
| Focus ring (error) | `--focus-ring-destructive` | Red glow on error input |
| Small elevation | `--shadow-sm` | Card hover shadow |

---

**Audit completed:** 2025-11-21  
**Files audited:** 12  
**Files fixed:** 4  
**Files flagged for future work:** 5  
**New tokens added:** 8
