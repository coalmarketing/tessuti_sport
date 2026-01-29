# Homepage Width Reduction - 90% Container

**Date:** 29. ledna 2026  
**Feature:** Reduce homepage content width to 90% for more centered layout with whitespace

---

## Overview

Modified the homepage and header to use a narrower content width (~90% of current) to create a more refined, centered layout with more left/right whitespace. This applies ONLY to the homepage - all other pages (catalog, products, categories) remain unchanged.

---

## Changes Made

### 1. CSS Update (`src/assets/css/input.css`)

Added homepage-specific container width rules in the `@layer base` section:

```css
/* Homepage-only: Reduce container width to ~90% for more centered layout with whitespace */
body.home .container {
  max-width: 90%;
}

/* On mobile, keep reasonable padding to avoid content touching edges */
@media (max-width: 768px) {
  body.home .container {
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
```

**How it works:**

- The `body` element already has a `home` class when on the homepage (set in `base.njk`)
- All sections on the homepage use `.container` class
- This CSS targets `.container` ONLY when it's inside `body.home`
- Mobile devices (≤768px) maintain full width with padding for usability

---

## Technical Details

### Scope

- **Applies to:** Homepage only (`body.home`)
- **Does NOT apply to:** Catalog pages, product detail pages, category pages, or any other interior pages

### Responsive Behavior

| Breakpoint                | Container Width     | Effect                                |
| ------------------------- | ------------------- | ------------------------------------- |
| Mobile (≤768px)           | 100% + 1rem padding | Full width, reasonable padding        |
| Tablet & Desktop (>768px) | 90% of viewport     | Centered with 5% whitespace each side |

### Why This Approach

✅ **Clean & maintainable** - Single CSS rule, no template changes needed  
✅ **Homepage-only** - Uses existing `body.home` class for targeting  
✅ **No global impact** - Other pages remain unchanged  
✅ **Responsive-friendly** - Mobile keeps full width for readability  
✅ **Works with header** - Header container automatically adjusts

---

## Files Modified

### 1. `/Users/martinpopelar/Senoweb-Website-Template/src/assets/css/input.css`

- Added `body.home .container` rule for 90% max-width
- Added mobile override to maintain usability

### 2. `/Users/martinpopelar/Senoweb-Website-Template/public/assets/css/main.css` (Built)

- Compiled CSS includes the new rules
- Minified and optimized

---

## Visual Checklist

Before testing on localhost, verify:

### ✅ Homepage (body.home)

- [ ] Hero section centered with whitespace on sides
- [ ] CTA sections (red/green) centered with whitespace
- [ ] "O Nás" section centered
- [ ] Product showcase section centered
- [ ] Category cards section centered
- [ ] Contact form section centered
- [ ] Footer section centered
- [ ] **Header/nav aligns with homepage content width**

### ✅ Mobile (≤768px)

- [ ] Homepage content uses full width with padding
- [ ] No text touching screen edges
- [ ] Header readable and functional
- [ ] Touch targets remain adequate

### ✅ Other Pages (NOT affected)

- [ ] Catalog page (body.interior) - **unchanged**
- [ ] Product detail pages (body.interior) - **unchanged**
- [ ] Category pages (body.interior) - **unchanged**
- [ ] Contact page (body.interior) - **unchanged**

---

## Before vs After

### Before

```
|<----- 100% viewport width ----->|
|  CONTENT SPANS FULL WIDTH      |
|  Header aligned full width      |
|  Sections use full container    |
```

### After (Homepage Only)

```
|<----- 100% viewport width ----->|
| 5% | <- 90% content -> | 5%    |
|    |  Centered layout  |        |
|    |  More whitespace  |        |
|    |  Header aligned   |        |
```

---

## Implementation Method

**NOT USED:**

- ❌ Global zoom/transform hacks
- ❌ Wrapper div changes in templates
- ❌ JavaScript-based resizing
- ❌ Changing typography sizes

**USED:**

- ✅ CSS-only solution
- ✅ Leverages existing `body.home` class
- ✅ Targets existing `.container` elements
- ✅ Responsive media queries
- ✅ Proper design system approach

---

## Browser Compatibility

✅ **Modern browsers:**

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+ (macOS, iOS)

✅ **Features used:**

- CSS class selectors (universal support)
- Media queries (universal support)
- `max-width` percentage (universal support)

---

## Testing Commands

```bash
# Rebuild CSS with new styles
npm run build:tailwind

# Build entire site
npm run build

# Start dev server to preview
npm start
# or
npm run watch:eleventy
```

---

## Rollback Instructions

If you need to revert this change:

1. **Remove CSS rules from `input.css`:**

   ```css
   /* Delete these lines: */
   body.home .container {
     max-width: 90%;
   }

   @media (max-width: 768px) {
     body.home .container {
       max-width: 100%;
       padding-left: 1rem;
       padding-right: 1rem;
     }
   }
   ```

2. **Rebuild CSS:**

   ```bash
   npm run build:tailwind
   ```

3. **Deploy:**
   - Commit and push changes
   - Netlify will rebuild automatically

---

## Notes

- The header shares the same container, so it automatically aligns with homepage content
- On mobile, we use `max-width: 100%` + padding instead of 90% to avoid narrow content
- The 90% width is calculated from viewport width, providing consistent proportions across screen sizes
- Other pages (catalog, products) maintain their full-width layout as they use `body.interior` class

---

**Status:** ✅ Implemented  
**Build:** ✅ Successful  
**Next Step:** Visual verification on localhost
