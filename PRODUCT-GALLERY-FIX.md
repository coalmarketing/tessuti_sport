# Product Gallery Fix

## Problem

Product gallery thumbnails were not rendering on product pages. The UI showed empty/broken image placeholders when images were added via Decap CMS.

## Root Cause

**Data structure mismatch** between Decap CMS configuration and template expectations:

### Decap CMS Config (config.yml)

```yaml
- label: "Galerie"
  name: "images"
  widget: "list"
  field:
    label: "Obrázek"
    name: "image"
    widget: "image"
```

### Actual Front Matter Output

```yaml
images:
  - /assets/images/cms/image1.png
  - /assets/images/cms/image2.png
```

This is an **array of strings**, not an array of objects.

### Template Expectation (Before Fix)

```nunjucks
{% for img in images %}
  <img src="{{ img.image }}" ...>  <!-- ❌ Wrong: img is a string, not {image: "..."} -->
{% endfor %}
```

## Solution

Made the template **backward-compatible** to handle both data structures:

### File: `src/_includes/layouts/product.njk`

**Before:**

```nunjucks
{% for img in images %}
  <div class="aspect-square overflow-hidden rounded border border-gray-300">
    <img src="{{ img.image }}" alt="{{ title }}" class="w-full h-full object-cover cursor-pointer hover:opacity-80" loading="lazy">
  </div>
{% endfor %}
```

**After:**

```nunjucks
{% for img in images %}
  {% set imgSrc = img.image if img.image else img %}
  {% if imgSrc %}
    <div class="aspect-square overflow-hidden rounded border border-gray-300">
      <img src="{{ imgSrc }}" alt="{{ title }}" class="w-full h-full object-cover cursor-pointer hover:opacity-80" loading="lazy">
    </div>
  {% endif %}
{% endfor %}
```

### Key Changes

1. **Smart path detection**: `{% set imgSrc = img.image if img.image else img %}`
   - If `img` is an object with `image` property → use `img.image`
   - If `img` is a string → use `img` directly
2. **Safety check**: `{% if imgSrc %}` prevents rendering if path is empty/undefined

3. **Backward compatible**: Supports both:
   - Array of strings: `["/path/image.png", ...]`
   - Array of objects: `[{image: "/path/image.png"}, ...]`

## Testing Checklist

### ✅ Verified

- [x] Product with multiple gallery images shows all thumbnails
- [x] Main product image renders correctly
- [x] Image paths resolve correctly (`/assets/images/cms/...`)
- [x] Build completes without errors
- [x] HTML output contains correct `<img>` tags with proper `src` attributes

### 🔄 Deploy & Test

- [ ] Deploy to Netlify production
- [ ] Test on live site with multiple products
- [ ] Verify gallery images load on production URLs
- [ ] Test uploading new images via Decap CMS
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive testing

## Files Modified

1. `/src/_includes/layouts/product.njk` - Gallery rendering logic

## No Breaking Changes

- ✅ Product-card component unchanged (only uses main `image` field)
- ✅ Catalog listings unchanged
- ✅ Search functionality unchanged
- ✅ Existing products with images still work
- ✅ Decap CMS upload flow unchanged

## Technical Notes

- Decap CMS `list` widget with single `field` (not `fields`) saves as array of primitives
- Template now handles both object and primitive array items
- Alt text uses product title for accessibility
- Lazy loading enabled for performance
- No visual layout changes - only fixes rendering

## Build Output

```bash
npm run build
✓ Wrote 48 files in 0.99 seconds
✓ CSS compiled successfully
```

---

**Fixed:** January 29, 2025
**Impact:** All product detail pages with gallery images
**Risk:** Low - backward compatible fix
