# Product Icons Feature - Documentation

## Overview

Product cards now support an optional row of Font Awesome icons displayed under the product title. Each icon can have a tooltip that appears on hover, explaining the feature it represents.

## Features

✅ **0-5 Icons per product** - Fully optional  
✅ **Font Awesome 6.5** - Access to thousands of icons  
✅ **Pure CSS tooltips** - No JavaScript needed  
✅ **Accessible** - Keyboard navigation support  
✅ **Responsive** - Adapts to mobile devices  
✅ **Theme-matched** - Green color (#00A44F) consistent with site

---

## CMS Usage

### Adding Icons to a Product

1. **Open Decap CMS** at `/admin`
2. **Select a product** from any category
3. **Scroll to "Ikony funkcí" field**
4. **Click "Add Ikony funkcí"** (max 5 items)
5. **For each icon:**
   - **Font Awesome třídy**: Enter icon classes (e.g., `fa-solid fa-palette`)
   - **Popisek (tooltip)**: Enter tooltip text (e.g., "Barevné varianty")

### Finding Icons

1. Visit **[fontawesome.com/icons](https://fontawesome.com/icons)**
2. Search for an icon (e.g., "water", "shield", "palette")
3. Click the icon you want
4. **Copy the class** (e.g., `fa-solid fa-droplet`)
5. **Paste into CMS** (without `<i>` tags)

### Validation Rules

- ✅ **iconClass format**: Must start with `fa-solid`, `fa-regular`, etc.
- ✅ **Tooltip length**: 1-50 characters
- ❌ **No HTML**: Don't paste `<i class="..."></i>`, only the classes
- ❌ **Max 5 icons**: CMS enforces this limit

---

## Example Product Frontmatter

```yaml
---
title: Cayman Softshell
slug: cayman-softshell
category: Materiály s membránou
excerpt: Pružný softshell materiál s membránou...
image: /assets/images/cms/cayman.jpg

# Icon row (0-5 icons)
icons:
  - iconClass: "fa-solid fa-palette"
    tooltip: "Barevné varianty"
  - iconClass: "fa-solid fa-droplet"
    tooltip: "Vodotěsný materiál"
  - iconClass: "fa-solid fa-wind"
    tooltip: "Prodyšný"
  - iconClass: "fa-solid fa-shield-halved"
    tooltip: "UV ochrana"

labels:
  - prodyšné
  - waterproof
---
```

---

## Popular Icon Examples

### Material Properties

```yaml
- iconClass: "fa-solid fa-droplet"
  tooltip: "Vodotěsný"

- iconClass: "fa-solid fa-wind"
  tooltip: "Prodyšný"

- iconClass: "fa-solid fa-fire"
  tooltip: "Tepelně izolační"

- iconClass: "fa-solid fa-snowflake"
  tooltip: "Chladivý"

- iconClass: "fa-solid fa-shield-halved"
  tooltip: "UV ochrana"
```

### Design Features

```yaml
- iconClass: "fa-solid fa-palette"
  tooltip: "Barevné varianty"

- iconClass: "fa-solid fa-sparkles"
  tooltip: "Reflexní prvky"

- iconClass: "fa-solid fa-maximize"
  tooltip: "Elastický"

- iconClass: "fa-solid fa-weight-hanging"
  tooltip: "Lehký materiál"
```

### Usage/Application

```yaml
- iconClass: "fa-solid fa-person-biking"
  tooltip: "Pro cyklistiku"

- iconClass: "fa-solid fa-person-running"
  tooltip: "Pro běh"

- iconClass: "fa-solid fa-person-hiking"
  tooltip: "Outdoor"

- iconClass: "fa-solid fa-shirt"
  tooltip: "Pro oděvy"
```

### Quality/Certifications

```yaml
- iconClass: "fa-solid fa-certificate"
  tooltip: "Certifikováno"

- iconClass: "fa-solid fa-star"
  tooltip: "Premium kvalita"

- iconClass: "fa-solid fa-leaf"
  tooltip: "Ekologický"

- iconClass: "fa-solid fa-recycle"
  tooltip: "Recyklovatelný"
```

---

## Technical Implementation

### Files Modified

1. **`src/_includes/layouts/base.njk`**

   - Added Font Awesome 6.5.1 CDN link

2. **`src/admin/config.yml`**

   - Added `icons` field to product schema (all categories)
   - Max 5 items with validation

3. **`src/_includes/components/product-card.njk`**

   - Added icon row rendering after title
   - Only renders if `icons` array exists and has items

4. **`src/assets/css/input.css`**
   - Added `.product-icons` styles
   - Pure CSS tooltip implementation
   - Responsive adjustments

### HTML Structure

```html
<h3>Product Title</h3>

<!-- Icon row (only if icons exist) -->
<div class="product-icons" role="list">
  <div class="product-icon-wrapper" role="listitem">
    <i
      class="fa-solid fa-palette"
      aria-label="Barevné varianty"
      data-tooltip="Barevné varianty"
    ></i>
  </div>
  <!-- More icons... -->
</div>

<p>Product excerpt...</p>
```

### CSS Tooltip Mechanism

```css
/* Tooltip appears on hover using ::before pseudo-element */
.product-icon-wrapper i::before {
  content: attr(data-tooltip); /* Uses data-tooltip attribute */
  position: absolute;
  bottom: 130%; /* Above icon */
  opacity: 0; /* Hidden by default */
}

.product-icon-wrapper i:hover::before {
  opacity: 1; /* Show on hover */
}
```

---

## Styling Customization

### Change Icon Color

```css
/* In src/assets/css/input.css */
.product-icon-wrapper i {
  color: #00a44f; /* Current: Green */
  /* Change to: */
  color: #e92429; /* Red */
  color: #0066cc; /* Blue */
}
```

### Change Icon Size

```css
.product-icon-wrapper i {
  font-size: 1.25rem; /* Current: 20px */
  /* Change to: */
  font-size: 1.5rem; /* 24px - larger */
  font-size: 1rem; /* 16px - smaller */
}
```

### Change Tooltip Background

```css
.product-icon-wrapper i::before {
  background-color: rgba(0, 0, 0, 0.9); /* Current: Dark */
  /* Change to: */
  background-color: #00a44f; /* Green background */
  background-color: rgba(233, 36, 41, 0.95); /* Red background */
}
```

---

## Accessibility

✅ **ARIA labels** - Each icon has `aria-label` with tooltip text  
✅ **Keyboard navigation** - Icons focusable with Tab key  
✅ **Focus indicators** - Visible outline on keyboard focus  
✅ **Semantic HTML** - Icons wrapped in `role="list"` container  
✅ **Screen readers** - Tooltips announced via aria-label

---

## Browser Compatibility

✅ Chrome/Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note:** Pure CSS tooltips work in all modern browsers. No JavaScript dependencies.

---

## Troubleshooting

### Icons not showing?

1. Check Font Awesome CDN is loaded (view page source)
2. Verify `iconClass` format: `fa-solid fa-icon-name`
3. Clear browser cache

### Tooltip cut off?

- CSS ensures `overflow: visible` on parent card
- Tooltips use `z-index: 100` to stay above elements
- If issues persist, check for custom CSS overriding `.product-card`

### Icon color wrong?

- Icons inherit theme green (#00A44F)
- Check `input.css` for `.product-icon-wrapper i` color definition

---

## Migration Guide

### Existing Products

Products without `icons` field will display normally (no icon row).

### Adding Icons Retroactively

1. Edit product in Decap CMS
2. Add 1-5 icons to "Ikony funkcí" field
3. Save and publish
4. Icons appear immediately on next build

---

## Performance

- **Font Awesome CDN**: Cached by browsers, fast loading
- **Pure CSS tooltips**: Zero JavaScript overhead
- **No image assets**: Icons are vector fonts (scalable, lightweight)

---

## Future Enhancements (Optional)

- [ ] Custom icon upload support
- [ ] Icon color per-icon (instead of global green)
- [ ] Animated icons on hover
- [ ] Icon library browser in CMS

---

**Status:** ✅ Fully Implemented and Production-Ready  
**Version:** 1.0  
**Date:** February 6, 2026
