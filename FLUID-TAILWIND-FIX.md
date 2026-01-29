# Fluid Tailwind Zoom Issue - Root Cause & Fix

## Problem Summary

Netlify production site appeared "zoomed in" or larger compared to localhost, with all text and elements appearing at inconsistent scales across environments.

## Root Cause

The issue was caused by **`fluid-tailwind` plugin** generating viewport-width-dependent `clamp()` functions for font sizing:

```css
.\~text-2xl\/4xl {
  font-size: clamp(1.5rem, 0.96rem + 1.34vw, 2.25rem);
}
.\~text-xl\/2xl {
  font-size: clamp(1.25rem, 1.07rem + 0.45vw, 1.5rem);
}
```

These responsive font sizes depend on:

1. **Viewport width calculations** (`vw` units)
2. **Browser default font-size** (usually 16px, but can vary)
3. **Viewport meta tag configuration**

Even small differences in how the viewport is calculated between localhost dev server and Netlify's CDN could cause perceived "zoom" differences.

## Solution Applied

### 1. Force Explicit Base Font Size with !important

**File: `src/assets/css/input.css`**

```css
@layer base {
  /* CRITICAL FIX: Normalize root font-size and prevent fluid-tailwind zoom differences */
  html {
    font-size: 16px !important; /* Force explicit base size */
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    font-size: 1rem !important; /* Ensure body uses rem based on 16px */
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height on mobile */
  }

  /* Ensure consistent viewport calculation for fluid-tailwind */
  @media (min-width: 320px) {
    html {
      font-size: 16px !important;
    }
  }
}
```

**Why `!important` is needed:**

- Tailwind's preflight styles and fluid-tailwind calculations could override the base font-size
- The `!important` ensures 16px is enforced across ALL environments and browsers
- This provides a consistent baseline for `clamp()` calculations

### 2. Enhanced Viewport Meta Tag

**File: `src/_includes/layouts/base.njk`**

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
/>
```

**Changes:**

- Added `minimum-scale=1` - prevents zoom-out issues
- Added `viewport-fit=cover` - ensures proper viewport calculation on notched devices
- Changed to exact `initial-scale=1` (not `1.0`) - more consistent parsing

### 3. Locked Build Environment

**File: `netlify.toml`**

```toml
[build.environment]
  NODE_VERSION = "20"
  NODE_ENV = "production"
```

Ensures identical Node.js version between local and Netlify builds.

## How to Verify the Fix

### 1. Check Built CSS

```bash
grep -o "html{font-size:16px!important" public/assets/css/main.css
```

Should output: `html{font-size:16px!important`

### 2. Check Viewport Meta

```bash
head -20 public/index.html | grep viewport
```

Should include: `minimum-scale=1` and `viewport-fit=cover`

### 3. Visual Comparison

1. **Localhost**: `npm run serve` → Open browser DevTools
2. **Netlify**: Open deployed site → Open browser DevTools
3. **Compare**:
   - Computed `font-size` on `<html>` (should be exactly 16px on both)
   - Computed `font-size` on `<body>` (should be exactly 16px on both)
   - Overall page zoom level (should be 100% on both)

## Technical Explanation

### Why Fluid Tailwind Causes Zoom Issues

Fluid Tailwind generates responsive font sizes using CSS `clamp()`:

```css
font-size: clamp(MIN, PREFERRED, MAX);
```

Where `PREFERRED` uses viewport width:

```css
font-size: clamp(1.5rem, 0.96rem + 1.34vw, 2.25rem);
```

The calculation `0.96rem + 1.34vw` depends on:

- **`rem` value**: Based on root font-size (varies if html font-size not explicit)
- **`vw` value**: Based on viewport width calculation

Even tiny differences in:

- Root font-size (15.8px vs 16px)
- Viewport width calculation (due to scrollbars, browser UI, etc.)

...can compound across the entire page, making everything appear "zoomed".

### Why This Fix Works

1. **`!important` on html font-size**: Forces **exact 16px** in ALL browsers, ALL environments
2. **Enhanced viewport meta**: Ensures **identical viewport calculation** between environments
3. **Locked Node version**: Ensures **identical build output** between local and Netlify
4. **`min-height: 100dvh`**: Uses **dynamic viewport height** for better mobile consistency

## Files Modified

1. ✅ `/src/assets/css/input.css` - Added !important font-size declarations
2. ✅ `/src/_includes/layouts/base.njk` - Enhanced viewport meta tag
3. ✅ `/netlify.toml` - Locked Node version (already done previously)
4. ✅ `/postcss.config.js` - Conditional cssnano (already done previously)

## Deployment Steps

1. **Build locally**:

   ```bash
   npm run build
   ```

2. **Verify build output**:

   ```bash
   grep -o "html{font-size:16px!important" public/assets/css/main.css
   head -20 public/index.html | grep viewport
   ```

3. **Test locally**:

   ```bash
   npm run serve
   ```

   - Open http://localhost:8080
   - Open DevTools → Elements → Computed
   - Check `<html>` element has `font-size: 16px`

4. **Deploy to Netlify**:

   ```bash
   git add .
   git commit -m "fix: force explicit 16px base font-size with !important to fix fluid-tailwind zoom issues"
   git push
   ```

5. **Verify on Netlify**:
   - Wait for deployment to complete
   - Open deployed site
   - Open DevTools → Elements → Computed
   - Check `<html>` element has `font-size: 16px` (should match localhost exactly)

## Expected Result

After deployment, the Netlify site should render **identically** to localhost:

- ✅ Same font sizes
- ✅ Same element spacing
- ✅ Same layout proportions
- ✅ No perceived "zoom" difference
- ✅ Consistent across all browsers (Chrome, Firefox, Safari, Edge)
- ✅ Consistent across all devices (desktop, tablet, mobile)

## Rollback Plan

If issues persist, disable fluid-tailwind temporarily:

**File: `tailwind.config.js`**

```javascript
// Comment out fluid-tailwind
// import fluid, { extract, fontSize, screens } from "fluid-tailwind";

module.exports = {
  // content: {
  //   files: ["./src/**/*.{html,njk,js}"],
  //   extract,
  // },
  content: ["./src/**/*.{html,njk,js}"],
  theme: {
    // fontSize: fontSize, // ← Comment this out
    // screens: screens,   // ← Comment this out
    extend: {
      // ...
    },
  },
  plugins: [
    // fluid, // ← Comment this out
    // ...
  ],
};
```

Then rebuild and redeploy.

## References

- [fluid-tailwind npm package](https://www.npmjs.com/package/fluid-tailwind)
- [CSS clamp() function](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [Viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [CSS text-size-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust)
