# Quick Start Guide: Catalog Label Filtering

## ✅ Implementation Complete

All catalog-wide label filtering functionality has been successfully implemented!

---

## What Was Implemented

### 1. **Catalog Page** (`/cs/katalog`)

- Shows ALL labels from ALL products across all categories
- Labels sorted alphabetically
- Collapsible filter panel with toggle button
- Click labels to filter product search results
- "Vše" (All) button to reset filters
- Results counter showing filtered/total counts

### 2. **Category Pages** (e.g., `/cs/katalog/tkaniny`)

- Shows only labels used in that specific category
- Same filtering UI and behavior
- Reuses the same JavaScript module

### 3. **Shared Filtering Logic**

- Created `src/assets/js/label-filters.js` (reusable ES6 class)
- Refactored `category.njk` to use shared script
- Both pages now use identical filtering code

---

## How to Use

### On the Catalog Page:

1. Visit `/cs/katalog`
2. Click the green filter icon button next to "Filtry:"
3. Filter panel expands showing all available labels
4. Click any `#label` chip to filter products
5. Click multiple labels to combine filters (OR logic)
6. Click "Vše" to show all products again

### On Category Pages:

1. Visit any category (e.g., `/cs/katalog/tkaniny`)
2. Same filter toggle button appears
3. Only labels from products in this category are shown
4. Filtering works identically

---

## Testing

### Quick Test Steps:

1. **Build the site:**

   ```bash
   npm run build
   ```

2. **Start dev server:**

   ```bash
   npm start
   ```

3. **Test catalog page:**

   - Go to `http://localhost:8080/cs/katalog/`
   - Click filter toggle button
   - Verify all labels appear (sorted alphabetically)
   - Click a label and verify product cards filter
   - Check results counter updates

4. **Test category page:**

   - Go to `http://localhost:8080/cs/katalog/tkaniny/`
   - Click filter toggle button
   - Verify only Tkaniny labels appear
   - Test filtering works

5. **Test interactions:**
   - Try multi-select (click multiple labels)
   - Try "Vše" button
   - Try ESC key to close panel
   - Try search + filter interaction

---

## Files Changed

### ✅ Created:

- `src/assets/js/label-filters.js` - Shared filtering logic (6.0 KB)
- `CATALOG-LABEL-FILTERING.md` - Full documentation

### ✅ Modified:

- `src/_includes/layouts/katalog.njk` - Added filter UI, product data attributes
- `src/_includes/layouts/category.njk` - Removed inline JS, uses shared script
- `src/config/processors/javascript.js` - Excluded label-filters.js from bundling

### ✅ Build Output:

- `public/assets/js/label-filters.js` - Copied to public folder
- All HTML pages regenerated with new filtering UI

---

## Key Features

### Filter Behavior:

- **No filters active** → All products shown
- **One filter active** → Products with that label shown
- **Multiple filters active** → Products with ANY of those labels shown (OR logic)
- **"Vše" clicked** → All filters cleared, all products shown

### UI States:

- **Inactive chip**: White background, green border, green text
- **Active chip**: Green background, white text
- **Hover**: Smooth color transition
- **Panel**: Smooth expand/collapse animation (300ms)

### Integration:

- **Search**: Using search automatically clears filters
- **View Toggle**: Switching grid/list view preserves filters
- **Keyboard**: Full keyboard navigation support
- **Mobile**: Touch-friendly, responsive design

---

## Example Data

### Product with Labels:

```yaml
---
title: "Cayman Softshell"
category: "Materiály s membránou"
labels:
  - prodyšné
  - voděodolné
  - lehké
  - sportovní
---
```

### Rendered Filter Chips:

```
[Vše] [#lehké] [#prodyšné] [#sportovní] [#voděodolné]
```

---

## API Reference

### JavaScript API:

```javascript
// Access the filter instance
window.labelFilters;

// Programmatically set filters
window.labelFilters.setActiveFilters(["prodyšné", "lehké"]);

// Get current filters
window.labelFilters.getActiveFilters(); // → ['prodyšné', 'lehké']

// Clear all filters
window.labelFilters.clearAllFilters();
```

---

## Troubleshooting

### No labels showing?

- Check that products have `labels:` in their front matter
- Verify build completed successfully
- Check browser console for errors

### Filtering not working?

- Open browser DevTools → Console
- Type `window.labelFilters` - should show LabelFilters object
- Check `.product-item` elements have `data-labels` attribute

### Panel not collapsing?

- Verify `filter-toggle.js` is loaded
- Check for CSS class `.filter-panel--expanded`
- Try clicking the toggle button again

---

## Next Steps

### Ready to Deploy:

```bash
# Build production version
npm run build

# Commit changes
git add .
git commit -m "Add catalog-wide label filtering"
git push

# Netlify will auto-deploy
```

### Optional Enhancements:

1. Add URL parameters to persist filters (`?labels=prodyšné,lehké`)
2. Show product count badges on chips (`#prodyšné (12)`)
3. Add label category groups (e.g., "Vlastnosti", "Použití")
4. Implement AND logic toggle
5. Add animations for filtering transitions

---

## Support

### Documentation:

- Full docs: `CATALOG-LABEL-FILTERING.md`
- Filter toggle: `FILTER-TOGGLE-IMPLEMENTATION.md`

### Code Locations:

- Filtering logic: `src/assets/js/label-filters.js`
- Catalog page: `src/_includes/layouts/katalog.njk`
- Category pages: `src/_includes/layouts/category.njk`

### Key Concepts:

- **Nunjucks loops** collect unique labels from products
- **Data attributes** (`data-labels="..."`) store product tags
- **JavaScript class** handles filtering logic
- **CSS classes** manage active/inactive states

---

## Success! 🎉

The catalog-wide label filtering system is now fully functional and ready to use. The implementation is:

✅ **Clean** - Shared code, no duplication  
✅ **Consistent** - Same UX on catalog + category pages  
✅ **Accessible** - Full keyboard + screen reader support  
✅ **Performant** - Instant filtering, no page reloads  
✅ **Maintainable** - Well-documented, easy to extend

Happy filtering! 🚀
