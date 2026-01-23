# 🔍 TIER 2 & PARALLAX INVESTIGATION REPORT
## CSS Audit + Parallax Conflict Analysis
**Date:** January 24, 2026 | **Status:** FINDINGS COMPLETE

---

## TIER 2: CSS AUDIT FINDINGS

### Files Loaded Across All HTML Pages (12 files)
✅ **Always Present** - Core global CSS:
1. `output.css` - Tailwind compiled (generated)
2. `design-tokens.css` - Color/spacing variables
3. `typography-hierarchy.css` - Font system
4. `animations.css` - Keyframes
5. `premium-interactions.css` - Hover states
6. `scroll-transitions.css` - Scroll effects
7. `responsiveness.css` - Media queries
8. `global-hover-system.css` - Unified hovers
9. `micro-details.css` - Polish/micro-animations
10. `final-polish.css` - Visual refinements
11. `cta-system.css` - Button/CTA styling
12. `grain-disable.css` - Texture control

### Files Loaded Everywhere (Plus 7 more)
✅ **Almost Always** - System-level:
1. `path-fallback.css` - 9 lines only (safe fallback)
2. `polish.css` - 449 lines (general polish)
3. `parallax-system.css` - 157 lines ⚠️
4. `scroll-physics.css` - 127 lines ⚠️
5. `elastic-elimination.css` - 142 lines
6. `pass2-global-brightening.css` - Global brightness adjustment
7. Plus page-specific CSS files (jury.css, vision.css, etc.)

### Dead CSS File (DO NOT LOAD)
❌ **nominees-improvements.css** - 425 lines, 8KB
- Purpose: Attempted fixes for nominees page
- Status: **Not imported anywhere**
- Content: Hero fixes, sticky nav, category filters, deep linking
- Issue: These fixes appear to have been replaced or abandoned

✅ **Safe to Delete** - `nominees-improvements.css`

### Controversial CSS Files - Analysis

#### `parallax-system.css` (157 lines) ⚠️
**Content:**
```css
/* Global parallax fixes */
html { scroll-behavior: smooth; }
[data-parallax-layer] { backface-visibility: hidden; transform-style: preserve-3d; }
.hero-section { min-height: 100svh; }
/* Safe area fixes for address bar intrusion */
```

**Assessment:** 
- ✅ Loaded on **every page**
- ✅ Contains important viewport/safe-area fixes
- ✅ Safe to keep

#### `scroll-physics.css` (127 lines) ⚠️
**Content:**
```css
/* Scroll behavior fixes */
html, body { overscroll-behavior: none; overflow-x: hidden; }
[data-parallax-layer] { contain: layout style paint; will-change: transform; }
@media (prefers-reduced-motion: reduce) { ... }
```

**Assessment:**
- ✅ Loaded on **every page**
- ✅ Critical browser physics overrides
- ✅ Safe to keep

#### `mobile-menu.css` (131 lines) ⚠️
**Content:** Full-screen mobile nav styling
- Position: fixed
- Z-index: 9999
- Mobile nav overlay, panel, close button styles

**Assessment:**
- ❌ **NEVER loaded** - Mobile drawer uses JS inline styles
- ✅ Safe to delete

---

## TIER 2 CLEANUP RECOMMENDATION

### Delete (3 files):
- ❌ `nominees-improvements.css` (not loaded, 8KB)
- ❌ `mobile-menu.css` (not loaded, 4KB)
- ❌ Consider: `path-fallback.css` (only 9 lines, minimal value)

**Total savings:** ~12KB (minimal)

### Rename for Clarity (7 files):
Current → Suggested:
- `pass2-global-brightening.css` → `global-brightness.css`
- `pass2-ceremony-finish.css` → `ceremony-polish.css`
- `pass2-honors-finish.css` → `honors-polish.css`
- `pass2-jury-finish.css` → `jury-polish.css`
- `pass2-vision-finish.css` → `vision-polish.css`
- `pass2-winners-finish.css` → `winners-polish.css` (unused page)
- `elastic-elimination.css` → `scroll-boundary-damping.css` (clearer purpose)

**Benefit:** Eliminates cryptic "pass2-" naming

---

## 🔴 CRITICAL PARALLAX CONFLICT DISCOVERED

### The Problem
**Two parallax systems are loaded and fighting each other** on certain pages.

### Load Order Issue
On `jury.html`, `vision.html`, `ceremony.html`, `nominees.html`:

```
Line 276:  <script src="js/elastic-free-parallax.js"></script>
   ↓
   Creates: window.parallaxController = new ElasticFreeParallax()
   Binds: window.addEventListener('scroll', ...)
   Sets up: parallax layer transforms
   
Line 664:  <script src="js/production-parallax.js"></script>
   ↓
   DESTROYS previous: window.parallaxController.destroy()
   Creates: window.parallaxController = new ProductionParallaxController()
   Binds: NEW window.addEventListener('scroll', ...)
   Sets up: NEW parallax layer transforms
```

### Result: 🔴 Chaos
1. **ElasticFreeParallax** initializes first
   - Collects all `[data-parallax-layer]` elements
   - Binds to scroll event
   - Sets up transform handlers

2. **ProductionParallaxController** initializes second
   - Destroys ElasticFreeParallax instance
   - Collects all `[data-parallax-layer]` elements again
   - Adds **another** scroll event listener
   - Sets up **new** transform handlers
   - Overwrites `window.parallaxController`

3. **What Breaks:**
   - ElasticFreeParallax scroll listeners are removed, but...
   - Both systems tried to transform the same DOM elements
   - Both systems call `collectLayers()` on the same elements
   - Performance: Two RAF loops instead of one
   - Visual: Potential jitter/conflicts if both tried to update

### Why This Exists
Looking at the code structure:
- **ElasticFreeParallax:** "Production-grade virtual timeline system"
- **ProductionParallaxController:** "Production-grade parallax controller"

Both are trying to do the same job with slightly different physics parameters:
- ElasticFreeParallax: `easing: 0.07`, `damping: 0.15`
- ProductionParallaxController: `easing: 0.08`, `damping: 0.92`

**Hypothesis:** Likely developed in different phases, never properly consolidated.

---

## PARALLAX SYSTEMS COMPARISON

### ElasticFreeParallax (396 lines)
- Virtual timeline: ✅
- Boundary damping: ✅ (aggressive `damping: 0.15`)
- Layer groups: ✅ (background, midground, foreground, text)
- Animation loop: ✅ 
- Lifecycle cleanup: ✅ (`destroy()` method)

### ProductionParallaxController (349 lines)
- Virtual timeline: ✅
- Boundary damping: ✅ (softer `damping: 0.92`, higher `easing: 0.08`)
- Layer organization: ✅ (but separated: backgroundLayers, midgroundLayers, etc.)
- Animation loop: ✅
- Lifecycle cleanup: ✅ (`destroy()` method)
- **Bonus:** Sends custom events (`parallaxReady` event)

### Which One to Keep?
**ProductionParallaxController** appears slightly more sophisticated:
1. Sends `parallaxReady` event for coordination
2. Uses velocity-based physics (more realistic)
3. Friction parameter (smoother deceleration)
4. More modular layer organization

**But:** Both are unnecessarily complex for this site's actual parallax effects (mostly subtle background shifts).

---

## RECOMMENDED FIXES

### Option A: Remove Duplicate (Aggressive)
1. Delete `elastic-free-parallax.js` entirely
2. Keep only `production-parallax.js`
3. Risk: If elastic version has subtle effects we don't see, page might change

### Option B: Consolidate Smarter (Recommended)
1. Keep only `ProductionParallaxController`
2. Remove all loads of `elastic-free-parallax.js`
3. Test thoroughly on jury, vision, ceremony, nominees pages
4. Verify parallax effects still work correctly

### Option C: Understand Why Both Exist
1. Check git history to understand when/why ElasticFreeParallax was added
2. Determine if it provides features ProductionParallax lacks
3. Make informed consolidation decision

---

## ACTION PLAN

### Tier 2 CSS Cleanup (Safe - Low Risk)
1. **Delete:** nominees-improvements.css
2. **Delete:** mobile-menu.css  
3. **Optional Delete:** path-fallback.css (only 9 lines)
4. **Rename:** pass2-* files to clearer names (ceremony-polish, jury-polish, etc.)

### Parallax Consolidation (Medium Risk - Needs Testing)
1. **Phase 1:** Remove elastic-free-parallax.js loads from HTML files
2. **Phase 2:** Test all pages with only production-parallax.js
3. **Phase 3:** Verify visual effects (parallax on hero, scrolling, etc.)
4. **Phase 4:** Delete orphaned elastic-free-parallax.js file

---

## SUMMARY

**Tier 2 Status:**
- ✅ Found 1 unused CSS file (nominees-improvements.css)
- ✅ Found 1 unused CSS file (mobile-menu.css)
- ⚠️ 7 pass2-* files need renaming for clarity
- ✅ Core CSS files are all necessary and loaded

**Parallax Status:**
- 🔴 CRITICAL: Two parallax systems loading on same pages
- 🔴 Second system (ProductionParallaxController) overwrites first
- ✅ FIXABLE: Remove elastic-free-parallax.js loads, keep ProductionParallaxController
- ⚠️ Requires testing to ensure no visual regression

**Next Steps:** Ready to proceed with:
1. CSS deletions/renames (safe)
2. Parallax consolidation (requires testing)

Which would you like to tackle first?

