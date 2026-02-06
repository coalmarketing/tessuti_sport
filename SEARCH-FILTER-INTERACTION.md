# Search & Filter Interaction Fix

## Problem Statement

Previously, when a user:
1. Clicked a filter chip (e.g., `#reflex`) → Filter mode activated
2. Then performed a search → Search results were mixed with or constrained by the previous filter state

This caused confusion because:
- Active filter chips remained visually "active" during search
- The internal filter state wasn't cleared
- Results appeared to be "search within filtered results" instead of global search

## Solution

**Search now completely overrides and clears any active filters.**

When the user clicks "Vyhledat" or presses Enter:
1. ✅ All active filters are cleared
2. ✅ Filter chip UI states are reset (all chips become inactive, "Vše" becomes active)
3. ✅ Filter mode is exited (body class removed, filter headers hidden)
4. ✅ Search results show ONLY products matching the search query (from global dataset)
5. ✅ Clean search results mode is activated

## Implementation Details

### File Modified
**`src/assets/js/product-search.js`** - Function `showSearchResults(query)`

### Code Changes

Added filter-clearing logic at the beginning of `showSearchResults()`:

```javascript
function showSearchResults(query) {
  // CRITICAL: Clear any active filters first (search overrides filters)
  if (window.labelFilters && window.labelFilters.activeFilters) {
    // Reset filter state without triggering filter mode
    window.labelFilters.activeFilters = [];
    
    // Reset all filter button UI states
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach((tag) => {
      if (tag.id === 'clearFilters') {
        tag.classList.add('active', 'bg-[#00A44F]', 'text-white');
        tag.classList.remove('bg-white', 'text-[#00A44F]', 'border-2', 'border-[#00A44F]');
      } else {
        tag.classList.remove('active', 'bg-[#00A44F]', 'text-white');
        tag.classList.add('bg-white', 'text-[#00A44F]', 'border-2', 'border-[#00A44F]');
      }
    });
    
    // Exit filter mode if active
    if (document.body.classList.contains('is-filtering')) {
      document.body.classList.remove('is-filtering');
      const filterResultsHeader = document.getElementById('filter-results-header');
      const filterResultsSummary = document.getElementById('filter-results-summary');
      if (filterResultsHeader) filterResultsHeader.classList.add('hidden');
      if (filterResultsSummary) filterResultsSummary.classList.add('hidden');
    }
  }

  // ... rest of search logic (unchanged)
}
```

### How It Works

#### 1. **Filter State Reset**
```javascript
window.labelFilters.activeFilters = [];
```
- Directly clears the internal filter state array
- No filters are considered "active" anymore

#### 2. **UI State Reset**
```javascript
const filterTags = document.querySelectorAll('.filter-tag');
filterTags.forEach((tag) => {
  if (tag.id === 'clearFilters') {
    // Make "Vše" button active (green)
    tag.classList.add('active', 'bg-[#00A44F]', 'text-white');
    tag.classList.remove('bg-white', 'text-[#00A44F]', 'border-2', 'border-[#00A44F]');
  } else {
    // Make all other filter chips inactive (white with green border)
    tag.classList.remove('active', 'bg-[#00A44F]', 'text-white');
    tag.classList.add('bg-white', 'text-[#00A44F]', 'border-2', 'border-[#00A44F]');
  }
});
```
- Visually resets all filter chips to inactive state
- "Vše" (All) button becomes active (green background)
- All label chips become inactive (white background, green border)

#### 3. **Exit Filter Mode**
```javascript
if (document.body.classList.contains('is-filtering')) {
  document.body.classList.remove('is-filtering');
  const filterResultsHeader = document.getElementById('filter-results-header');
  const filterResultsSummary = document.getElementById('filter-results-summary');
  if (filterResultsHeader) filterResultsHeader.classList.add('hidden');
  if (filterResultsSummary) filterResultsSummary.classList.add('hidden');
}
```
- Removes `is-filtering` class from body
- Hides filter results header (breadcrumb navigation)
- Hides filter results summary (product count)
- Clean slate for search mode to take over

## User Flow Examples

### Scenario 1: Filter → Search
```
1. User clicks #reflex filter
   → Filter mode activated
   → Shows products with #reflex label
   → "Filtry: #reflex" breadcrumb visible

2. User types "softshell" and clicks Vyhledat
   → Filter state cleared ✅
   → #reflex chip becomes inactive ✅
   → "Vše" button becomes active ✅
   → Shows ALL products matching "softshell" (not just #reflex products)
   → "Vyhledávání: softshell" breadcrumb visible
```

### Scenario 2: Multiple Filters → Search
```
1. User clicks #prodyšné + #lehké
   → Filter mode activated
   → Shows products with #prodyšné OR #lehké
   → "Filtry: #prodyšné, #lehké" breadcrumb visible

2. User searches "cayman"
   → Both filters cleared ✅
   → Both chips become inactive ✅
   → Shows ALL products matching "cayman"
   → Clean search results view
```

### Scenario 3: Empty Search (Return to Catalog)
```
1. User in search mode
2. Clears search input and searches again (empty query)
   → Returns to default catalog view
   → Shows category cards
   → No filters active
```

## Behavior Guarantees

✅ **Search always overrides filters** - No mixed state possible  
✅ **Visual consistency** - Filter chips always reflect actual state  
✅ **Clean data** - Results based ONLY on search query, not filtered subset  
✅ **No side effects** - Filter behavior unchanged when search isn't used  
✅ **Reversible** - Clicking "Vše" or clearing search returns to catalog  

## Testing Checklist

- [ ] Click filter → Search → Verify filter cleared
- [ ] Multi-select filters → Search → Verify all cleared
- [ ] Search → Click filter → Verify works normally
- [ ] Filter → Search → Click "Vše" → Verify returns to catalog
- [ ] Empty search → Verify returns to catalog view
- [ ] Filter chips visually inactive after search
- [ ] Search results count correct (global, not filtered)
- [ ] No console errors during transitions

## Technical Notes

### Why Direct State Manipulation?
Instead of calling `window.labelFilters.clearAllFilters()`, we directly manipulate the state because:
1. **Avoids circular calls** - `clearAllFilters()` calls `applyFilters()` which could interfere
2. **Performance** - No unnecessary filter rendering during search
3. **Control** - Search function has full control over the transition

### Global Access Pattern
```javascript
if (window.labelFilters && window.labelFilters.activeFilters) {
  // Safe to access
}
```
- Checks for existence before accessing
- Works even if label filters aren't initialized
- Won't break on pages without filters

### Body Class States
- `is-searching` - Search mode active
- `is-filtering` - Filter mode active
- Never both at the same time (search clears filtering)

## Related Files

- `src/assets/js/product-search.js` - **Modified** (this fix)
- `src/assets/js/label-filters.js` - Referenced (state accessed)
- `src/_includes/layouts/katalog.njk` - HTML structure
- `CATALOG-FILTERING-SEARCH-MODE.md` - Original filter implementation

## Deployment

This is a JavaScript-only change:
1. ✅ No HTML changes needed
2. ✅ No CSS changes needed
3. ✅ No build configuration changes needed
4. ✅ File will be copied to `public/assets/js/` on build
5. ✅ Works immediately after deployment

---

**Status:** ✅ Implemented and Ready for Testing  
**Impact:** Search and filter now work independently without state conflicts  
**Priority:** High (UX improvement)
