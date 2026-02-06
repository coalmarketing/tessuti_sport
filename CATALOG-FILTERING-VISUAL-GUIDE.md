# Catalog Filtering: Quick Visual Guide

## 🎯 Two Behaviors in One Script

### Catalog Page (`/cs/katalog`) - SEARCH-LIKE MODE

**Switches to global results view**

```
┌─────────────────────────────────────┐
│  DEFAULT STATE                      │
│  ┌───────────┐ ┌───────────┐       │
│  │Cyklovložky│ │Dresoviny  │       │
│  └───────────┘ └───────────┘       │
│  ┌───────────┐ ┌───────────┐       │
│  │  Tkaniny  │ │  Úplety   │       │
│  └───────────┘ └───────────┘       │
│                                     │
│  [Filtry: 🔽]                       │
│  [Vše] #lehké #prodyšné #sportovní  │
└─────────────────────────────────────┘

        ↓ User clicks #prodyšné

┌─────────────────────────────────────┐
│  FILTER RESULTS VIEW                │
│  Filtry: #prodyšné                  │
│  ────────────────────────────       │
│  ┌─────────┐ ┌─────────┐           │
│  │Product 1│ │Product 2│           │
│  │Cayman   │ │Flow     │           │
│  └─────────┘ └─────────┘           │
│  ┌─────────┐ ┌─────────┐           │
│  │Product 3│ │Product 4│           │
│  │Ceylon   │ │Manta    │           │
│  └─────────┘ └─────────┘           │
│                                     │
│  Filtr zobrazuje 12 produktů        │
│                                     │
│  [Vše] [#prodyšné]                  │
└─────────────────────────────────────┘

        ↓ User clicks Vše

┌─────────────────────────────────────┐
│  BACK TO DEFAULT STATE              │
│  ┌───────────┐ ┌───────────┐       │
│  │Cyklovložky│ │Dresoviny  │       │
│  └───────────┘ └───────────┘       │
└─────────────────────────────────────┘
```

---

### Category Page (`/cs/katalog/tkaniny`) - IN-PLACE MODE

**Filters visible products**

```
┌─────────────────────────────────────┐
│  CATEGORY: TKANINY                  │
│  ────────────────────────────       │
│  ┌─────────┐ ┌─────────┐           │
│  │Product 1│ │Product 2│           │
│  │Flow     │ │Tkanina  │           │
│  └─────────┘ └─────────┘           │
│  ┌─────────┐ ┌─────────┐           │
│  │Product 3│ │Product 4│           │
│  │xxx      │ │yyy      │           │
│  └─────────┘ └─────────┘           │
│                                     │
│  [Filtry: 🔽]                       │
│  [Vše] #lehké #pružné               │
└─────────────────────────────────────┘

        ↓ User clicks #lehké

┌─────────────────────────────────────┐
│  CATEGORY: TKANINY (FILTERED)       │
│  ────────────────────────────       │
│  ┌─────────┐ ┌─────────┐           │
│  │Product 1│ │Product 4│           │
│  │Flow     │ │yyy      │           │
│  └─────────┘ └─────────┘           │
│                                     │
│  (Product 2 & 3 hidden)             │
│                                     │
│  Zobrazeno 2 z 4 položek            │
│                                     │
│  [Vše] [#lehké]                     │
└─────────────────────────────────────┘
```

---

## 🔄 Flow Diagram

```
┌─────────────┐
│ User visits │
│  /katalog   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Shows: Category  │◄─── DEFAULT STATE
│ Cards (6 cards)  │
└──────┬───────────┘
       │
       │ Click filter chip
       ▼
┌──────────────────┐
│ Hides: Category  │
│ Cards            │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Shows: Product   │◄─── FILTER STATE
│ Results Grid     │
└──────┬───────────┘
       │
       │ Click "Vše"
       ▼
┌──────────────────┐
│ Back to DEFAULT  │
│ STATE            │
└──────────────────┘
```

---

## 🎨 UI States

### State 1: Default (Catalog)

```
Visible:
  ✅ Category cards (gridView/listView)
  ✅ Filter panel (collapsed)
  ✅ "Vše" chip (active/green)

Hidden:
  ❌ Product results grid
  ❌ Filter results header
  ❌ Filter results summary
```

### State 2: Filtering (Results)

```
Visible:
  ✅ Product results grid
  ✅ Filter results header
  ✅ Filter results summary
  ✅ Active filter chip(s) (green)

Hidden:
  ❌ Category cards (gridView/listView)
  ❌ "Vše" chip (inactive/white)
```

---

## 📊 Data Flow

```
┌─────────────────────┐
│ collections.products│  ← Eleventy collection
└──────────┬──────────┘
           │
           │ Nunjucks loop
           ▼
┌─────────────────────┐
│ Pre-rendered cards  │
│ in searchResultsGrid│
│                     │
│ <div data-labels=   │
│   "tag1,tag2,tag3"> │
└──────────┬──────────┘
           │
           │ JavaScript filters
           ▼
┌─────────────────────┐
│ Visible products    │
│ (display: '')       │
└─────────────────────┘

┌─────────────────────┐
│ Hidden products     │
│ (display: 'none')   │
└─────────────────────┘
```

---

## 🔧 JavaScript Logic

```javascript
// Pseudo-code for catalog mode

if (NO_FILTERS_ACTIVE) {
  show(categoryCards);
  hide(productResults);
} else {
  hide(categoryCards);
  show(productResults);

  for each product in productResults {
    if (product.labels.includes(activeFilter)) {
      show(product);
    } else {
      hide(product);
    }
  }

  updateCounter(visibleCount);
}
```

---

## 🎯 Key Points

### What Changed

✅ Catalog filtering now **switches views** (like search)  
✅ Shows **global product results** across all categories  
✅ **Reuses** existing `searchResultsGrid` infrastructure

### What Stayed the Same

✅ Category page filtering (filters in place)  
✅ Product card rendering  
✅ Search functionality  
✅ Filter panel UI (toggle button, chips)

### Why It's Better

✅ **Consistent UX** - same pattern as search  
✅ **Faster discovery** - see products immediately  
✅ **Cleaner code** - shared rendering logic  
✅ **Better mobile** - no nested navigation

---

## 🚀 Quick Test

1. **Build:**

   ```bash
   npm run build
   npm start
   ```

2. **Navigate:**

   - Go to `http://localhost:8080/cs/katalog/`

3. **Test Catalog Mode:**

   - Click filter toggle → panel expands
   - Click `#prodyšné` → should see product results
   - Click `#lehké` → more products shown (OR logic)
   - Click `Vše` → back to category cards

4. **Test Category Mode:**
   - Go to `/cs/katalog/tkaniny/`
   - Click filter chip → filters only Tkaniny products
   - No view switching (old behavior)

---

## 📝 Code Locations

| Feature       | File                                 | Lines   |
| ------------- | ------------------------------------ | ------- |
| Filter logic  | `src/assets/js/label-filters.js`     | 1-319   |
| Catalog UI    | `src/_includes/layouts/katalog.njk`  | 110-320 |
| Category UI   | `src/_includes/layouts/category.njk` | 140-200 |
| Filter toggle | `src/assets/js/filter-toggle.js`     | 1-81    |

---

## ✅ Checklist

- [x] JavaScript detects page type automatically
- [x] Catalog mode switches to results view
- [x] Category mode filters in place
- [x] "Vše" returns to catalog view
- [x] Multi-select works (OR logic)
- [x] View toggle clears filters
- [x] Search integration works
- [x] No errors in build
- [x] Documentation complete

---

## 🎉 Done!

Your catalog filtering now works **exactly like search** - users get instant access to products across all categories with a single click. The implementation is clean, performant, and production-ready!
