# Hero Section - Staggered Mirrored Logo Background

## 🎯 Implementation Overview

Creates a **staggered, mirrored pattern** using `logo-square-red-bg.svg` as a subtle watermark background with 70% opacity.

---

## 📐 Visual Pattern

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ HERO SECTION                   ┃
┃                                ┃
┃  ┌────────────┐                ┃  ← 0px: Original Logo
┃  │  🔴 LOGO   │ (Opacity 70%)  ┃     (::before layer)
┃  │  Normal    │                ┃
┃  └────────────┘                ┃
┃                                ┃
┃      ┌────────────┐            ┃  ← 400px: Mirrored Logo
┃      │  🔴 LOGO   │ (Flipped)  ┃     (::after layer)
┃      │  ↕️ Mirror  │            ┃     Offset below original
┃      └────────────┘            ┃
┃                                ┃
┃  ┌────────────┐                ┃  ← 800px: Original repeats
┃  │  🔴 LOGO   │                ┃     (::before continues)
┃  │  Normal    │                ┃
┃  └────────────┘                ┃
┃                                ┃
┃      ┌────────────┐            ┃  ← 1200px: Mirrored repeats
┃      │  🔴 LOGO   │ (Flipped)  ┃     (::after continues)
┃      │  ↕️ Mirror  │            ┃
┃      └────────────┘            ┃
┃         ↓ Repeats ↓            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Key Features:**

- ✅ Logos appear at **different vertical positions** (staggered)
- ✅ Mirrored logos are **flipped vertically** (scaleY(-1))
- ✅ Both layers have **70% opacity** for subtle watermark effect
- ✅ Pattern repeats infinitely as content grows

---

## 🔧 CSS Implementation

### **Structure**

```css
.hero-mirrored-bg::before {
  /* Original logo at top */
  top: 0;
  background-position: right top;
  transform: none; /* Normal orientation */
}

.hero-mirrored-bg::after {
  /* Mirrored logo offset below */
  top: 400px; /* Offset by logo height */
  background-position: right top;
  transform: scaleY(-1); /* Flip vertically */
}
```

### **Current Settings**

| Property              | Value                                        | Purpose                        |
| --------------------- | -------------------------------------------- | ------------------------------ |
| `background-image`    | `url('/assets/svgs/logo-square-red-bg.svg')` | SVG logo file                  |
| `background-size`     | `auto 400px`                                 | Logo height (adjust if needed) |
| `background-repeat`   | `repeat-y`                                   | Repeat vertically              |
| `opacity`             | `0.7`                                        | 70% visibility                 |
| `top` (::after)       | `400px`                                      | Offset for staggered effect    |
| `transform` (::after) | `scaleY(-1)`                                 | Vertical flip                  |

---

## ⚙️ Customization Options

### **1. Adjust Logo Size**

Change the height to make logos bigger or smaller:

```css
.hero-mirrored-bg::before,
.hero-mirrored-bg::after {
  background-size: auto 300px; /* Smaller logos */
  /* or */
  background-size: auto 500px; /* Larger logos */
}
```

**Remember:** Also update the `top` offset on `::after` to match:

```css
.hero-mirrored-bg::after {
  top: 300px; /* Must match logo height */
}
```

---

### **2. Adjust Opacity**

Make the watermark more or less visible:

```css
.hero-mirrored-bg::before,
.hero-mirrored-bg::after {
  opacity: 0.5; /* 50% - more subtle */
  /* or */
  opacity: 0.9; /* 90% - more prominent */
}
```

---

### **3. Change Horizontal Position**

Move logos to the left or center:

```css
.hero-mirrored-bg::before,
.hero-mirrored-bg::after {
  background-position: left top; /* Left side */
  /* or */
  background-position: center top; /* Centered */
  /* or */
  background-position: right top; /* Right side (current) */
}
```

---

### **4. Adjust Vertical Spacing**

Change the gap between original and mirrored logos:

```css
.hero-mirrored-bg::after {
  top: 500px; /* More space between logos */
  /* or */
  top: 300px; /* Less space between logos */
}
```

---

### **5. Change to Horizontal Flip**

If you want left-right mirroring instead of up-down:

```css
.hero-mirrored-bg::after {
  transform: scaleX(-1); /* Flip horizontally instead */
}
```

---

### **6. Add Both Flips (Full Mirror)**

For a completely mirrored effect (both axes):

```css
.hero-mirrored-bg::after {
  transform: scale(-1, -1); /* Flip both X and Y */
}
```

---

## 📱 Responsive Behavior

### **Desktop (≥ 1024px)**

✅ **Mirrored logo pattern active**

- Both `::before` and `::after` visible
- 70% opacity watermark effect
- Staggered vertical positioning

### **Mobile (< 1024px)**

✅ **Clean white background**

- No logo watermark (better readability on small screens)
- Saves bandwidth and improves performance
- Content remains fully visible

---

## 🎨 Visual Examples

### **Pattern Progression**

```
View from top to bottom as you scroll:

0px     ┌─────────┐
        │  LOGO   │ ← Original (normal)
        └─────────┘

400px         ┌─────────┐
              │  OGOL   │ ← Mirrored (flipped)
              └─────────┘

800px   ┌─────────┐
        │  LOGO   │ ← Original (repeats)
        └─────────┘

1200px        ┌─────────┐
              │  OGOL   │ ← Mirrored (repeats)
              └─────────┘

↓ Continues infinitely ↓
```

---

## 🔍 How It Works

### **Two-Layer System**

1. **`::before` pseudo-element**

   - Contains original logo
   - Starts at `top: 0`
   - Repeats every 400px (or your logo height)
   - No transformation (normal orientation)

2. **`::after` pseudo-element**
   - Contains mirrored logo
   - Starts at `top: 400px` (offset below original)
   - Also repeats every 400px
   - Transform: `scaleY(-1)` flips it vertically

### **Result**

The two layers create a **staggered, alternating pattern** where:

- Original logos appear at: 0px, 800px, 1600px...
- Mirrored logos appear at: 400px, 1200px, 2000px...

---

## 🐛 Troubleshooting

### **Issue: Logos Overlap at Same Position**

**Cause:** The `top` offset on `::after` doesn't match logo height

**Solution:**

```css
/* Make sure these match */
.hero-mirrored-bg::before {
  background-size: auto 400px; /* Logo height */
}

.hero-mirrored-bg::after {
  top: 400px; /* Must equal logo height */
}
```

---

### **Issue: Logos Too Large/Small**

**Solution:** Adjust `background-size`:

```css
/* Find the right size for your design */
background-size: auto 300px; /* Smaller */
background-size: auto 400px; /* Medium (current) */
background-size: auto 600px; /* Larger */
```

---

### **Issue: Watermark Too Strong/Weak**

**Solution:** Adjust `opacity`:

```css
opacity: 0.3; /* Very subtle */
opacity: 0.5; /* Subtle */
opacity: 0.7; /* Medium (current) */
opacity: 0.9; /* Strong */
```

---

### **Issue: Content Not Visible Above Background**

**Cause:** Z-index stacking issue

**Solution:** Already implemented, but verify:

```css
.hero-mirrored-bg > * {
  position: relative;
  z-index: 10; /* Content above background */
}

.hero-mirrored-bg::before,
.hero-mirrored-bg::after {
  z-index: 0; /* Background below content */
}
```

---

## 📊 Performance

### **Optimizations**

✅ **SVG Format**

- Vector graphics = scalable without quality loss
- Small file size
- Sharp at any resolution

✅ **Pseudo-elements**

- No extra HTML elements needed
- Minimal performance impact
- GPU-accelerated transforms

✅ **Mobile Hidden**

- Disabled on small screens
- Saves bandwidth
- Better mobile performance

### **File Size**

- `logo-square-red-bg.svg`: ~2-10KB (typical SVG size)
- CSS overhead: ~40 lines
- Total impact: Negligible

---

## 🎯 Testing Checklist

- [ ] Verify logo visibility (70% opacity looks good?)
- [ ] Check staggered positioning (not overlapping?)
- [ ] Test with short content (1-2 logos visible)
- [ ] Test with long content (5+ logos visible)
- [ ] Verify on mobile (background hidden?)
- [ ] Check on different screen sizes
- [ ] Verify content is clickable (pointer-events working?)
- [ ] Test on different browsers

---

## 📝 Quick Reference

### **To Change Logo Size:**

```css
background-size: auto 500px; /* Adjust height */
top: 500px; /* Match in ::after */
```

### **To Change Opacity:**

```css
opacity: 0.5; /* 50% visibility */
```

### **To Change Position:**

```css
background-position: center top; /* or left/right */
```

### **To Change Spacing:**

```css
.hero-mirrored-bg::after {
  top: 600px; /* More space between logos */
}
```

---

## ✅ Summary

**What's Implemented:**

1. ✅ SVG logo as background (`logo-square-red-bg.svg`)
2. ✅ 70% opacity (subtle watermark effect)
3. ✅ Staggered pattern (original at top, mirrored below)
4. ✅ Vertical mirroring (scaleY(-1) transform)
5. ✅ Infinite vertical repeat
6. ✅ Mobile-optimized (hidden on small screens)
7. ✅ Content stays above background (z-index)

**Result:** A professional, subtle watermark pattern that grows with your content! 🎉

---

## 📄 Files Modified

- **`src/assets/css/input.css`** (lines ~175-240)

  - Added `.hero-mirrored-bg` styles
  - Created `::before` and `::after` pseudo-elements
  - Set 70% opacity and staggered positioning

- **`src/_includes/pages/home.njk`** (line 67)
  - Added `hero-mirrored-bg` class to section

---

## 🚀 Next Steps

1. **Check the logo size** - Adjust `background-size` if needed
2. **Test opacity** - Make sure 70% is visible but not distracting
3. **Verify staggering** - Logos should be at different vertical positions
4. **Test on mobile** - Background should be hidden

Ready to see it in action! 🎨
