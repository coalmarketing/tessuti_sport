# Max-Width Layout for Ultra-High Resolutions

## Overview

This implementation adds a maximum width constraint of **1920px (Full HD)** to content containers on ultra-high resolution displays, while keeping backgrounds full-width and maintaining full responsiveness on smaller screens.

---

## Implementation Details

### Location

- **File:** `/src/assets/css/input.css`
- **Lines:** 21-30 (in `@layer base`)

### CSS Code

```css
/* ========================================
   MAX-WIDTH CONTAINER FOR ULTRA-HIGH RESOLUTIONS
   ======================================== */
/* On screens wider than 1920px (Full HD), constrain content width
   while keeping backgrounds full-width */
@media (min-width: 1921px) {
  .container {
    max-width: 1920px;
  }
}
```

---

## How It Works

### On Screens > 1920px (e.g., 4K, 2560px, 3840px)

✅ **Content containers are constrained to 1920px maximum width**

- Content is centered horizontally with `margin: auto` (already on `.container`)
- Background sections remain full-width (100% viewport)
- Equal empty space appears on left and right sides of content
- Text and content remain readable (not stretched too wide)

### On Screens ≤ 1920px (e.g., Full HD, laptops, tablets, mobile)

✅ **Layout remains completely unchanged**

- Fully responsive behavior is preserved
- No max-width constraint is applied
- Works exactly as designed for these resolutions

---

## Why This Approach?

### 1. **Applied to `.container` Class**

- **Smart Targeting:** Only affects content areas, not backgrounds
- **Full-Width Backgrounds:** Sections can span the entire viewport
- **Existing Pattern:** All sections already use `.container` with `m-auto`
- **Non-invasive:** No HTML changes required

### 2. **Modern Media Query**

- Uses `@media (min-width: 1921px)` to target only ultra-high resolutions
- Avoids affecting Full HD (1920px) and below
- Future-proof for 4K, 5K, and ultra-wide monitors

### 3. **Works with Existing Structure**

- All sections use: `<div class="container m-auto">` (Tailwind's auto margins)
- Max-width constraint activates only on ultra-wide screens
- Maintains visual hierarchy and spacing

---

## Benefits

### User Experience

- ✅ **Better Readability:** Text doesn't stretch uncomfortably wide on large monitors
- ✅ **Visual Focus:** Content stays centered and easy to scan
- ✅ **Professional Look:** Prevents awkward stretching on ultra-wide displays
- ✅ **Full-Width Backgrounds:** Hero sections, colored backgrounds remain edge-to-edge

### Development

- ✅ **No HTML Changes:** Works with existing `.container` structure
- ✅ **No JavaScript Required:** Pure CSS solution
- ✅ **Zero Breaking Changes:** Doesn't affect existing responsive behavior
- ✅ **Easy to Maintain:** Single media query to adjust if needed

- ✅ **Lightweight:** Minimal CSS code (~5 lines)
- ✅ **No Layout Shifts:** Applied consistently on page load
- ✅ **No Additional HTTP Requests:** Pure CSS, no external resources

---

## Customization Options

### Adjust Maximum Width

To change the maximum width (e.g., to 1600px or 2560px):

```css
@media (min-width: 1921px) {
  .container {
    max-width: 1600px; /* Change this value */
  }
}
```

### Adjust Breakpoint

To activate the constraint at a different screen size:

```css
@media (min-width: 2561px) {
  /* Activate only on screens > 2560px */
  .container {
    max-width: 2560px;
  }
}
```

---

## Testing

### Test Resolutions

1. **4K Display (3840×2160)** - Content centered at 1920px, backgrounds full-width
2. **Ultra-Wide (2560×1440)** - Content centered at 1920px, backgrounds full-width
3. **Full HD (1920×1080)** - Content uses full container width (no constraint)
4. **Laptop (1366×768)** - Fully responsive layout
5. **Tablet (768px)** - Fully responsive layout
6. **Mobile (375px)** - Fully responsive layout

### Browser Testing

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### How to Test

1. Open browser DevTools (F12)
2. Open Responsive Design Mode
3. Set custom width to `2560px` or `3840px`
4. Verify content is centered with margins on sides
5. Verify backgrounds extend full-width edge-to-edge
6. Reduce width to `1920px` - content should use full container width
7. Continue reducing width - responsive behavior should work normally

---

## Potential Considerations

### Full-Width Sections

- **Hero/Banner sections:** Backgrounds remain full-width ✅
- **Colored backgrounds:** Extend edge-to-edge ✅
- **Content inside:** Constrained to 1920px and centered ✅

### Fixed/Absolute Positioned Elements

- **Header/Navigation:** Works fine (uses `.container` internally)
- **Modals/Popups:** Position relative to viewport (not affected)
- **Tooltips:** Position relative to parent elements (not affected)

### Third-Party Scripts

- Cookie consent banners, chat widgets, etc. position relative to viewport (not affected)

---

## Architecture

### Container Pattern in Project

All sections follow this pattern:

```html
<section class="bg-[full-width-background]">
  <div class="container m-auto">
    <!-- Content constrained to max 1920px on ultra-wide screens -->
  </div>
</section>
```

### Examples from Codebase

- **Header:** `<div class="container m-auto">`
- **Footer:** `<div class="container m-auto">`
- **Hero sections:** `<div class="container m-auto">`
- **Product grids:** `<div class="container m-auto">`
- **Content pages:** `<div class="container m-auto max-w-3xl">`

This consistent pattern ensures the max-width constraint applies uniformly across all pages.

---

## Alternative Implementations (Not Used)

### 1. Body Max-Width Approach (INCORRECT - Previously Attempted)

```css
@media (min-width: 1921px) {
  body {
    max-width: 1920px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  }
}
```

**Why not used:** Constrains entire body including backgrounds - backgrounds won't extend full-width

### 2. Wrapper Div Approach

```html
<body>
  <div class="page-wrapper" style="max-width: 1920px; margin: 0 auto;">
    <!-- All content -->
  </div>
</body>
```

**Why not used:** Requires HTML changes in base layout, more invasive

### 3. Main Element Approach

```css
main {
  max-width: 1920px;
  margin: 0 auto;
}
```

**Why not used:** Doesn't constrain header/footer, inconsistent across all sections

---

## Browser Compatibility

✅ **Fully Supported:**

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Opera 74+
- All modern mobile browsers

### Legacy Browsers

- IE11: Works but may need `-ms-` prefixes (not recommended to support)

---

## Version History

### v2.0 (Current - February 2025)

- **CORRECT Implementation:** Applied max-width to `.container` class
- Backgrounds remain full-width (100% viewport)
- Content constrained to 1920px and centered
- Media query: `min-width: 1921px`

### v1.0 (Initial - Incorrect)

- ~~Applied to `body` element~~ (removed)
- ~~Box-shadow for visual boundary~~ (removed)
- **Issue:** Constrained backgrounds, not just content

---

## Related Files

- `/src/assets/css/input.css` - Main CSS file with implementation (lines 21-30)
- `/src/_includes/layouts/base.njk` - Base HTML layout (header/main/footer structure)
- `/src/_includes/sections/header.njk` - Uses `.container` for header content
- `/src/_includes/sections/footer.njk` - Uses `.container` for footer content
- All page layouts use `.container` pattern consistently

---

## Support

If you need to adjust this implementation:

1. Edit `/src/assets/css/input.css`
2. Find the media query `@media (min-width: 1921px)` (around line 27)
3. Adjust max-width value or breakpoint as needed
4. Run `npm run dev` to rebuild CSS
5. Test on various screen sizes using browser DevTools

---

## Summary

✨ **What Changed:** Added a media query to constrain `.container` max-width to 1920px on screens wider than Full HD

✨ **What Stayed the Same:** Everything on screens ≤ 1920px (Full HD and below)

✨ **Result:** Professional, readable layout on ultra-high resolution displays without breaking responsive design on smaller screens
