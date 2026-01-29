# Deployment Zoom/Scale Fix Documentation

## Problem

The deployed site on Netlify appeared "zoomed in" or larger compared to localhost. Typography and UI elements were scaled up as if the page had browser zoom applied.

## Root Causes Identified

### 1. **Missing Base Font-Size Declaration**

- **Issue**: No explicit `font-size: 16px` on the `html` element meant browsers could use different default sizes (typically 16px, but Safari/mobile can vary)
- **Impact**: `rem` units (used extensively in Tailwind) scale based on root font-size, causing inconsistent sizing

### 2. **Missing Text-Size-Adjust Properties**

- **Issue**: Mobile browsers (especially iOS Safari) automatically adjust font sizes for "readability"
- **Impact**: Text appears larger on mobile devices in production

### 3. **Inconsistent Build Environment**

- **Issue**: No Node version lock in `netlify.toml` meant Netlify could use different Node.js version
- **Impact**: Different Tailwind/PostCSS output, potentially different CSS processing

### 4. **PostCSS Configuration Mismatch**

- **Issue**: `cssnano` in package.json but not explicitly configured in postcss.config.js
- **Impact**: Unpredictable minification behavior between environments

### 5. **Viewport Meta Tag Could Be More Defensive**

- **Issue**: Basic viewport tag without `maximum-scale` constraint
- **Impact**: Browsers could apply unexpected scaling on certain devices

---

## Fixes Applied

### Fix 1: Explicit Base Font-Size & Text-Size-Adjust

**File**: `src/assets/css/input.css`

```css
@layer base {
  /* Normalize root font-size to prevent browser zoom differences */
  html {
    font-size: 16px; /* Explicit base size - prevents browser default variations */
    -webkit-text-size-adjust: 100%; /* Prevent iOS text size adjustment */
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    font-size: 1rem; /* Ensure body uses rem based on 16px */
  }
}
```

**Why this works**:

- Forces consistent 16px base across all browsers
- Prevents mobile Safari from auto-scaling text
- Ensures `1rem` = `16px` consistently

### Fix 2: Lock Node Version in Netlify

**File**: `netlify.toml`

```toml
[build]
  publish = "public/"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"
  NODE_ENV = "production"
```

**Why this works**:

- Guarantees same Node.js version locally and on Netlify
- Ensures identical Tailwind/PostCSS processing
- Sets `NODE_ENV=production` explicitly

### Fix 3: Consistent PostCSS Configuration

**File**: `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production"
      ? { cssnano: { preset: "default" } }
      : {}),
  },
};
```

**Why this works**:

- Only minifies CSS in production (matches Tailwind CLI `--minify` flag)
- Prevents double-minification
- Consistent with build scripts

### Fix 4: Enhanced Viewport Meta Tag

**File**: `src/_includes/layouts/base.njk`

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
/>
```

**Why this works**:

- `width=device-width` - Use device's native width
- `initial-scale=1.0` - No initial zoom
- `maximum-scale=5.0` - Prevent excessive zoom while allowing accessibility
- `user-scalable=yes` - Maintains accessibility

---

## Debugging Steps (For Future Issues)

### Step 1: Compare Computed Styles

**On Netlify (deployed site)**:

1. Open DevTools (F12)
2. Select `<html>` element
3. Check Computed tab:
   - `font-size` should be `16px`
   - Verify no `zoom` or `transform: scale()` applied
4. Select `<body>` element
5. Verify `font-size: 16px` (or `1rem`)

**On Localhost**:

1. Repeat above steps
2. Compare values - they should match exactly

### Step 2: Check CSS Loading

**In DevTools Network tab**:

1. Filter by CSS
2. Verify `/assets/css/main.css` loads successfully (200 status)
3. Check response size - should be ~300-500KB minified
4. Compare file hash/size between localhost and Netlify

### Step 3: Verify Font Loading

**In DevTools**:

1. Network tab → Filter by Font
2. Verify Google Fonts load (Gabarito, Red Hat Text)
3. Verify local fonts load from `/assets/fonts/`
4. No 404 errors

### Step 4: Check Viewport Settings

**In DevTools Console**:

```javascript
// Check viewport meta
document.querySelector('meta[name="viewport"]').content;

// Check computed width
window.innerWidth;

// Check device pixel ratio
window.devicePixelRatio;

// Check if zoom is applied
document.body.style.zoom;
```

All should return expected values with no surprises.

### Step 5: Test Production Build Locally

```bash
# Clean build
rm -rf public/

# Build exactly as Netlify does
NODE_ENV=production npm run build

# Serve the built files
npx http-server public/ -p 8080

# Open http://localhost:8080
```

Compare this local production build to Netlify - they should be identical.

---

## Build Commands Reference

### Local Development

```bash
npm run start
# Runs: watch:eleventy + watch:tailwind + watch:cms
# Output: src/assets/css/main.css (dev, not minified)
```

### Local Production Build

```bash
npm run build
# Runs: build:eleventy + build:tailwind
# Output: public/assets/css/main.css (minified)
```

### Netlify Production Build

```bash
# From netlify.toml:
npm run build
# Environment: NODE_VERSION=20, NODE_ENV=production
# Output: public/assets/css/main.css (minified)
```

**Key difference**: Development outputs CSS to `src/`, production to `public/`.

---

## Verification Checklist

After deploying to Netlify, verify:

- [ ] **Font sizes match localhost**

  - Compare heading sizes (h1, h2, h3)
  - Compare body text size
  - Check button text sizes

- [ ] **Spacing is identical**

  - Padding around sections
  - Margins between elements
  - Grid gaps

- [ ] **No text overflow or wrapping differences**

  - Navigation menu
  - Product cards
  - Form labels

- [ ] **Responsive breakpoints work the same**

  - Test mobile (375px)
  - Test tablet (768px)
  - Test desktop (1920px)

- [ ] **Fonts load correctly**

  - No fallback fonts visible
  - Google Fonts display properly
  - Custom Poppins fonts work

- [ ] **CSS is minified in production**

  - View page source
  - Check `/assets/css/main.css` - should be minified

- [ ] **DevTools shows correct computed styles**
  - `html { font-size: 16px }`
  - No browser zoom applied
  - No transform scale

---

## Testing on Multiple Browsers

Test on Netlify deployment:

### Desktop

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile

- [ ] iOS Safari (iPhone)
- [ ] Android Chrome
- [ ] Android Firefox

All should render identically to localhost.

---

## Rollback Plan

If issues persist, revert changes:

```bash
git checkout HEAD~1 netlify.toml
git checkout HEAD~1 postcss.config.js
git checkout HEAD~1 src/assets/css/input.css
git checkout HEAD~1 src/_includes/layouts/base.njk
npm run build
```

Then investigate further with browser DevTools comparison.

---

## Additional Resources

- [MDN: Viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [MDN: text-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust)
- [Tailwind CSS: Font Size](https://tailwindcss.com/docs/font-size)
- [PostCSS Plugins](https://github.com/postcss/postcss/blob/main/docs/plugins.md)

---

## Summary

The zoom issue was caused by:

1. **Inconsistent base font-size** across browsers/environments
2. **Mobile text auto-scaling** on iOS
3. **Build environment differences** (Node versions)

The fix ensures:

1. **Explicit 16px base** with text-size-adjust disabled
2. **Locked Node version** on Netlify
3. **Consistent CSS processing** between local and production
4. **Defensive viewport settings**

After deploying these changes, the site should render identically on localhost and Netlify across all browsers and devices.
