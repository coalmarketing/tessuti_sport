# PDF Download Button Implementation

**Date:** 29. ledna 2026  
**Feature:** Downloadable PDF button on product detail pages

---

## Overview

Added the ability for admins to upload a PDF file for each product via Decap CMS, which displays as a prominent download button on the product detail page above the parameters table.

---

## Changes Made

### 1. Decap CMS Configuration (`src/admin/config.yml`)

Added new field to ALL product collections (6 categories):

- **Field Label:** "PDF ke stažení"
- **Field Name:** `download_pdf`
- **Widget Type:** `file`
- **Required:** No (optional)
- **Max File Size:** 10MB (10485760 bytes)
- **Hint:** "Nahrajte PDF soubor s detailními informacemi o produktu (technický list, certifikát, atd.)"

**Applied to categories:**

1. ✅ Cyklovložky
2. ✅ Dresoviny
3. ✅ Elastické úplety
4. ✅ Materiály s membránou
5. ✅ Pásky, gumy, reflexní materiály
6. ✅ Tkaniny

### 2. Product Template (`src/_includes/layouts/product.njk`)

**Location:** Inserted ABOVE the "Parameters Table" section

**Button Features:**

- Green color scheme (`#00A44F`) to match the site's design system
- Download icon (SVG document with arrow)
- Download attribute for direct file download
- Opens in new tab (`target="_blank"`)
- Security: `rel="noopener noreferrer"`
- Accessibility: `aria-label` with product title
- Responsive padding and text sizes
- Hover effects (darker background, larger shadow)
- Only displays if `download_pdf` field has a value

**Button Text:** "Stáhnout PDF"

---

## Media Configuration

The existing Decap CMS media configuration is already set up correctly:

```yaml
media_folder: "src/assets/images/cms"
public_folder: "/assets/images/cms"
```

**Uploaded PDFs will be stored at:**

- Source: `/src/assets/images/cms/filename.pdf`
- Public URL: `/assets/images/cms/filename.pdf`

**Note:** While the folder is called "images", Decap CMS will accept PDF files in this location.

---

## Testing Checklist

### Local Development Testing

- [ ] **Start dev server:** `npm run dev`
- [ ] **Access Decap CMS:** Navigate to `/admin/`
- [ ] **Test field visibility:**
  - [ ] Open any product for editing
  - [ ] Verify "PDF ke stažení" field appears
  - [ ] Verify hint text is visible
  - [ ] Verify field is optional (not required)

### Upload Test

- [ ] **Upload a test PDF:**
  - [ ] Select a small PDF file (< 10MB)
  - [ ] Upload via Decap CMS
  - [ ] Save the product
  - [ ] Verify file appears in `/src/assets/images/cms/`

### Product Page Display Test

- [ ] **Product WITH PDF:**

  - [ ] Navigate to product detail page
  - [ ] Verify green download button appears ABOVE parameters table
  - [ ] Verify button shows "Stáhnout PDF" text
  - [ ] Verify download icon is visible
  - [ ] Click button and verify PDF downloads
  - [ ] Verify PDF opens in new tab
  - [ ] Check button responsiveness (mobile, tablet, desktop)

- [ ] **Product WITHOUT PDF:**
  - [ ] Navigate to product without `download_pdf` field
  - [ ] Verify button does NOT appear
  - [ ] Verify no broken layout or spacing issues

### Accessibility Test

- [ ] **Keyboard navigation:**
  - [ ] Tab to download button
  - [ ] Verify focus indicator is visible
  - [ ] Press Enter/Space to download
- [ ] **Screen reader:**
  - [ ] Verify `aria-label` is announced correctly
  - [ ] Verify button purpose is clear

### Cross-Browser Test

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Safari (iOS)
- [ ] Mobile browsers

### Build & Deployment Test

- [ ] **Local build:**

  ```bash
  npm run build
  ```

  - [ ] Verify build completes without errors
  - [ ] Check PDF files are copied to `/public/assets/images/cms/`
  - [ ] Check button appears in built HTML

- [ ] **Netlify deployment:**
  - [ ] Push changes to repository
  - [ ] Wait for Netlify build to complete
  - [ ] Test on production URL
  - [ ] Verify PDF download works on production
  - [ ] Verify Decap CMS works on production

### Edge Cases

- [ ] Very long PDF filename
- [ ] PDF with special characters in name
- [ ] Large PDF (close to 10MB limit)
- [ ] Multiple products with same PDF
- [ ] Edit product and change PDF file
- [ ] Edit product and remove PDF file

---

## File Paths Reference

### Configuration Files

- Decap CMS config: `src/admin/config.yml`
- Product template: `src/_includes/layouts/product.njk`

### Product Categories (Markdown folders)

- `/src/products/cyklovlozky/`
- `/src/products/dresoviny/`
- `/src/products/elasticke-uplety/`
- `/src/products/materialy-s-membranou/`
- `/src/products/pasky-gumy-reflexni-materialy/`
- `/src/products/tkaniny/`

### Media Storage

- Source: `/src/assets/images/cms/`
- Public: `/public/assets/images/cms/`
- URL: `/assets/images/cms/filename.pdf`

---

## Example Product Front Matter

**Before:**

```yaml
---
title: Example Product
slug: example-product
price: 299
currency: CZK
category: Cyklovložky
tags:
  - product
  - cs
---
```

**After (with PDF):**

```yaml
---
title: Example Product
slug: example-product
price: 299
currency: CZK
category: Cyklovložky
download_pdf: /assets/images/cms/technical-sheet-example.pdf
tags:
  - product
  - cs
---
```

---

## Button Code Reference

```nunjucks
{% if download_pdf %}
  <div class="pt-2">
    <a href="{{ download_pdf }}"
       download
       target="_blank"
       rel="noopener noreferrer"
       class="inline-flex items-center gap-2 bg-[#00A44F] hover:bg-[#00A44F]/90 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base font-body shadow-md hover:shadow-lg"
       aria-label="Stáhnout PDF s detailními informacemi o produktu {{ title }}">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
        </path>
      </svg>
      Stáhnout PDF
    </a>
  </div>
{% endif %}
```

---

## Rollback Instructions

If you need to revert this feature:

1. **Remove from config.yml:**

   - Delete the `download_pdf` field from all 6 product collections
   - Located between "Tagy" and "Layout" fields

2. **Remove from product template:**

   - Delete the "PDF Download Button" section in `product.njk`
   - Located between "Description" and "Parameters Table"

3. **Clean up uploaded files (optional):**

   - Remove any PDF files from `/src/assets/images/cms/`

4. **Rebuild:**
   ```bash
   npm run build
   ```

---

## Future Enhancements (Optional)

- [ ] Add multiple PDF downloads (array of files)
- [ ] Categorize PDFs (technical sheet, certificate, manual, etc.)
- [ ] Show file size on button
- [ ] Add preview/view button alongside download
- [ ] Custom PDF icon instead of generic document icon
- [ ] Track download analytics

---

## Support Notes

- **File size limit:** 10MB (configurable in `media_library.config.max_file_size`)
- **Allowed formats:** Any file (consider adding `media_library.config.accept` for PDF-only)
- **Button color:** Matches existing green CTA (`#00A44F`)
- **Existing attachments:** Not affected (this is separate from OEKO-TEX/material sheets if they exist)

---

## Quick Test Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Access Decap CMS locally
# Navigate to: http://localhost:8080/admin/
```

---

**Status:** ✅ Implementation Complete  
**Next Step:** Testing & Verification
