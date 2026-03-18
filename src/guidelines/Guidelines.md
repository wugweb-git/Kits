# Wugweb Kits — Design Guidelines

> These guidelines define how to use the system correctly. They are enforced in code.

---

## 1. Token Usage

Every value in every component must come from a CSS variable token. No exceptions.

```css
/* ✅ Correct */
color: var(--foreground);
background: var(--card);
border-radius: var(--radius-md);
font-size: var(--ts-body-md-size);
padding: var(--spacing-4);

/* ❌ Wrong */
color: #fff;
background: #1c1c1c;
border-radius: 8px;
font-size: 16px;
padding: 16px;
```

---

## 2. Typography

**Only Inter Tight is permitted.** For code, pre, kbd: use `var(--core-font-family-mono)`.

```css
/* ✅ */
font-family: var(--core-font-family-base);
font-size: var(--ts-h1-size);
font-weight: var(--ts-h1-weight);
line-height: var(--ts-h1-line-height);

/* For fluid/viewport-scaled type */
font-size: var(--fluid-h1);        /* clamp() — scales with viewport */
/* Or use utility class */
class="type-h1"
```

### Type Hierarchy

| Role | Token | Size | Weight | Use |
|---|---|---|---|---|
| Display | `--fluid-display` | 40–80px | 700 | Hero headlines only |
| H1 | `--fluid-h1` | 32–48px | 700 | One per page |
| H2 | `--fluid-h2` | 24–36px | 600 | Section headings |
| H3 | `--fluid-h3` | 20–28px | 600 | Sub-sections |
| H4 | `--ts-h4-size` | 20px | 600 | Card titles, UI labels |
| Body LG | `--fluid-body-lg` | 16–20px | 400 | Lead copy, intro |
| Body MD | `--fluid-body-md` | 15–16px | 400 | Default body text |
| Body SM | `--fluid-body-sm` | 13–14px | 400 | Secondary copy |
| Label | `--fluid-label` | 12–14px | 500 | Form labels |
| Caption | `--fluid-caption` | 10–12px | 400 | Timestamps, meta |
| Code | `--ts-code-size` | 14px | 400 | `code`, `pre`, `kbd` |

---

## 3. Color System

```
RULE: Never use color.* (core) directly in components.
ALWAYS go through semantic layer.
```

| Token | Use |
|---|---|
| `--foreground` | Primary text |
| `--muted-foreground` | Secondary text, placeholders |
| `--background` | Page canvas |
| `--card` | Raised surfaces |
| `--muted` | Hover states, inputs |
| `--accent` | Brand color, CTAs, active states |
| `--border` | Dividers, strokes |
| `--destructive` | Error, delete |
| `--success` | Positive feedback |
| `--warning` | Caution states |
| `--info` | Informational |

---

## 4. Spacing

Use the 4px base grid. All spacing via `--spacing-*` tokens.

| Token | Value | Use |
|---|---|---|
| `--spacing-1` | 4px | Minimum gap (icon+label) |
| `--spacing-2` | 8px | Chip gap, button icon gap |
| `--spacing-3` | 12px | Input padding, tooltip |
| `--spacing-4` | 16px | Card gap, section sub-gap |
| `--spacing-5` | 20px | Button padding-x |
| `--spacing-6` | 24px | Card padding, dialog padding |
| `--spacing-8` | 32px | Section divider |
| `--spacing-12` | 48px | Page section spacing |

For responsive section/page spacing, use:
- `.section-spacing` — adapts xs→xl automatically
- `.page-gutter` — consistent page-edge padding

---

## 5. Breakpoints

| Name | Value | Grid | Sidebar |
|---|---|---|---|
| xs | 480px | 4 col | Hidden |
| sm | 640px | 4 col | Hidden |
| md | 768px | 8 col | Overlay drawer |
| lg | 1024px | 12 col | Always visible |
| xl | 1280px | 12 col | Always visible |
| 2xl | 1440px | 12 col | Max content width |

Breakpoints are **code-only**. Never use `--breakpoint-*` as inline style values.
Use `@media (min-width: 768px)` or the `useBreakpoint()` hook.

---

## 6. Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Code pills, tooltips, kbd |
| `--radius-md` | 8px | Buttons, inputs, menu items |
| `--radius-lg` | 12px | Cards, dialogs, panels |
| `--radius-full` | 9999px | Badges, chips, avatars, pills |

---

## 7. Elevation

Never use raw box-shadow values. Use elevation tokens:

| Class | Token | Use |
|---|---|---|
| `.elevation-1` | `--core-shadow-xs` | Card resting |
| `.elevation-2` | `--core-shadow-sm` | Card hover |
| `.elevation-3` | `--core-shadow-md` | Dropdown, popover |
| `.elevation-4` | `--core-shadow-lg` | Dialog, drawer |
| `.elevation-5` | `--core-shadow-xl` | Toast, tooltip |

---

## 8. Motion

| Token | Value | Use |
|---|---|---|
| `--motion-duration-fast` | 80ms | Button hover, icon swap |
| `--motion-duration-short` | 120ms | Focus, small state changes |
| `--motion-duration-slow` | 200ms | Dropdown, overlay fade |
| `--motion-duration-long` | 320ms | Modal enter, drawer slide |
| `--motion-easing-standard` | cubic-bezier(0.4,0,0.2,1) | General transitions |
| `--motion-easing-emphasized` | cubic-bezier(0.2,0,0,1) | Modal, drawer entry |

---

## 9. Accessibility (WCAG 2.1 AA)

- Minimum contrast: 4.5:1 for body text, 3:1 for large text (18px+)
- Minimum touch target: `var(--size-touch-min)` = 44×44px
- Focus ring: `var(--focus-ring-accent)` on all interactive elements
- Never disable user font scaling
- Keyboard navigation required on all interactive components
- Screen reader labels on icon-only buttons

---

## 10. Icons

Only use `lucide-react`. Size via `--size-icon-*` tokens:

| Token | Value | Use |
|---|---|---|
| `--size-icon-xs` | 16px | Caption icons, meta |
| `--size-icon-sm` | 20px | Button icons, input prefix |
| `--size-icon-md` | 24px | Default (nav, cards) |
| `--size-icon-lg` | 32px | Empty states, features |
| `--size-icon-xl` | 40px | Marketing, hero icons |

Or use `.icon-sm`, `.icon-md`, `.icon-lg` utility classes.
