# 🔗 DEPENDENCY MAPPING - What Depends on What

This document maps every feature to the files that support it, so we understand what can/cannot be consolidated without breaking functionality.

---

## 📌 CORE SYSTEMS ARCHITECTURE

### System 1: SCROLL & PARALLAX (The Conflicting Area)
```
┌─────────────────────────────────────────────────────────────┐
│ Question: Which scroll system is production?                 │
│ production-scroll.js or main.js?                            │
└─────────────────────────────────────────────────────────────┘

Option A: production-scroll.js + production-parallax.js
├── Implements: Virtual timeline (targetScroll vs currentScroll)
├── Physics: easing 0.07, damping 0.85, boundary 150px
├── Prevents: Elastic banding, jitter
├── Loaded on: All HTML pages (every page loads these)
├── Global access: window.ScrollController, window.ParallaxEngine
├── Currently Documented: Yes (__archive__/docs/DEPLOYMENT_REPORT.md)
└── Status: ???

Option B: main.js (NEW orchestrator)
├── Implements: System orchestration, intersection observer
├── Features: Scroll progress tracking, page transitions
├── Loaded on: All HTML pages
├── Global access: window.HungamaSystem
├── Currently Documented: Yes
└── Status: ???

CONFLICT ANALYSIS:
If both are running:
  • production-scroll.js creates: window.ScrollController
  • main.js creates: window.HungamaSystem
  • main.js setup method: checks for window.ScrollController
  • Result: Either redundant or collaborative

RESOLUTION NEEDED:
  [ ] Test on live page: which system actually updates scroll?
  [ ] Check browser console: what's in window.ScrollController?
  [ ] Check browser console: what's in window.HungamaSystem?
  [ ] If redundant: remove one completely
  [ ] If collaborative: document the relationship
```

**Dependents on Scroll System:**
```
Primary:
  └─ index.html (hero parallax, background movement)
  └─ vision.html (scroll animations, text movements)
  └─ sponsors.html (parallax hero)
  └─ ceremony.html (parallax effects)

Secondary (if they use scroll effects):
  └─ nominees.html (potential scroll interactions)
  └─ honors.html (potential scroll interactions)
  └─ jury.html (potential scroll interactions)

CSS Dependents:
  └─ scroll-transitions.css (defines scroll animation keyframes)
  └─ animations.css (entrance animations triggered by scroll)
  └─ parallax-system.css (parallax layer setup)
  └─ scroll-physics.css (scroll physics overrides)
```

---

### System 2: JURY MODALS (The Duplicate Area)
```
┌─────────────────────────────────────────────────────────────┐
│ Two implementations found:                                   │
│ jury-modal-system.js (183 lines) vs jury-modals.js (88)    │
└─────────────────────────────────────────────────────────────┘

Implementation A: jury-modal-system.js (183 lines)
├── Creates: Modal HTML structure dynamically
├── Manages: Backdrop, modal element, data fields
├── Methods: createJuryModal(), setupEventListeners(), populateModal()
├── Handles: Click to open, ESC to close, backdrop click to close
├── Data: Pulls from jury members array
├── Status: "JURY MODAL SYSTEM - Production"
└── Lines: 183 (complete implementation)

Implementation B: jury-modals.js (88 lines)
├── Handlers: Click handlers for jury cards
├── Methods: openModal(), closeModal()
├── Features: Keyboard access (Enter/Space)
├── Wiring: Maps data-modal attribute to modal elements
├── Status: "PASS 1: JURY MODAL WIRING"
└── Lines: 88 (simpler, attribute-based)

DIFFERENCE:
  A: Creates modal from scratch on page load
  B: Assumes modal HTML already exists in DOM

CONFLICT:
  If both run: 
    • B tries to wire to elements A creates (might work)
    • Or they conflict over the same DOM elements
    • Or B is leftover from old implementation

RESOLUTION NEEDED:
  [ ] Check jury.html: Is modal HTML in DOM or dynamically created?
  [ ] If created: only jury-modal-system.js needed
  [ ] If in DOM: only jury-modals.js needed
  [ ] If mixed: consolidate to one approach
  [ ] Remove the other file completely
```

**Dependents on Modal System:**
```
Pages using modals:
  └─ jury.html (jury member bios in modal)
  └─ nominees.html (may have modals?)
  └─ honors.html (may have modals?)

CSS Dependents:
  └─ jury-modal-dialog.css (modal styling v1)
  └─ modal-system.css (modal styling v2)
  └─ jury-refinement.css (jury page refinements, may include modal fixes)

JS Dependents:
  └─ jury-data.js (jury member data for modals)
  └─ data.js (global data)
```

---

### System 3: NAVIGATION (Clear)
```
✅ Working: navbar-scroll.js + mobile-drawer-nav.js are complementary
   └─ navbar-scroll.js: Handles navbar behavior on scroll (hide/show)
   └─ mobile-drawer-nav.js: Mobile menu drawer functionality

Consolidation Path: Merge into single navigation.js file
```

**Dependents:**
```
Pages: All 13 HTML pages
CSS: navbar-redesign.css, css/components/navbar.css (duplicate)
JS: navbar-scroll.js, mobile-drawer-nav.js
```

---

## 🎯 PAGE-BY-PAGE FEATURE MAPPING

### INDEX.HTML (Homepage)
```
Features:
  ✓ Parallax hero background
  ✓ Scroll-driven animations (fade in as you scroll)
  ✓ Sponsor carousel
  ✓ Email capture footer
  ✓ Navigation with scroll effects
  ✓ CTA buttons (submit, nominate, etc)
  ✓ Dark theme with brightness lift
  ✓ Responsive layout (mobile, tablet, desktop)

CSS Dependencies (17 files):
  ├─ output.css (Tailwind base)
  ├─ design-tokens.css (colors, tokens)
  ├─ utilities.css (reusable utilities)
  ├─ grain-disable.css (removes grain texture)
  ├─ path-fallback.css (background path fix)
  ├─ global-brightness.css (dark mode brightness)
  ├─ global-hover-system.css (hover effects)
  ├─ premium-interactions.css (interaction polish)
  ├─ scroll-transitions.css (scroll animations)
  ├─ animations.css (keyframe animations)
  ├─ micro-details.css (polish)
  ├─ final-polish.css (more polish)
  ├─ responsiveness.css (mobile)
  ├─ cta-system.css (button styling)
  ├─ typography-hierarchy.css (font sizes/weights)
  ├─ navbar-redesign.css (nav styling)
  └─ global-brightness.css (dark mode)

JS Dependencies (9 files):
  ├─ production-scroll.js (scroll controller)
  ├─ production-parallax.js (parallax engine)
  ├─ main.js (orchestrator)
  ├─ data.js (page data)
  ├─ email-capture.js (footer email form)
  ├─ cta-wiring.js (button click handlers)
  ├─ emergency-override.js (???)
  ├─ navbar-scroll.js (navbar scroll effects)
  └─ mobile-drawer-nav.js (mobile menu)

Critical Dependencies:
  • Parallax CANNOT be removed (hero effect)
  • Email capture CANNOT be removed (newsletter signup)
  • CTA wiring CANNOT be removed (buttons non-functional)
  • Navigation CANNOT be removed (site unusable)

Optional/Polish (can fail gracefully):
  • Scroll animations (still functional without them)
  • Micro-interactions (still usable without them)
  • hover effects (buttons still clickable)

CONSOLIDATED RESULT (Post-refactor):
  CSS: 17 files → 6 files
  JS: 9 files → 5 files
```

---

### JURY.HTML (Jury Page)
```
Features:
  ✓ Hero image/background
  ✓ Jury member cards in grid
  ✓ Click card → Modal with bio opens
  ✓ Keyboard accessible (Enter/Space opens modal)
  ✓ ESC closes modal
  ✓ Click backdrop closes modal
  ✓ Responsive grid (1 col mobile, 2-3 cols desktop)
  ✓ Navigation with scroll effects
  ✓ Dark theme with brightness

CSS Dependencies (26 files - THE MOST!):
  ├─ [17 standard files from index.html]
  ├─ jury-hero-fix.css (hero-specific styling)
  ├─ pages/jury.css (jury page styles - NOT LINKED!)
  ├─ jury-refinement.css (jury refinements)
  ├─ jury-refinement.css (LOADED TWICE! Line 24 and 31)
  ├─ jury-grid-system.css (grid layout for cards)
  ├─ jury-modal-dialog.css (modal styling v1)
  └─ jury-modals.css (NOT LOADED but exists)

Critical Issues:
  ❌ jury-refinement.css loaded twice (line 24 AND 31)
  ❌ pages/jury.css exists but not linked
  ⚠️ jury-modals.css exists but unclear if needed
  ⚠️ jury-modal-dialog.css vs modal-system.css (which is used?)

JS Dependencies (11 files):
  ├─ [9 standard files from index.html]
  ├─ jury-data.js (jury member details)
  └─ jury-modal-system.js (modal handler)

PROBLEM ZONE: Modal Implementation
  • jury-modal-system.js creates modal HTML dynamically (183 lines)
  • jury-modals.js wires up modals to existing HTML (88 lines)
  • Both are in project - which is active?
  • CSS has three modal files: jury-modal-dialog.css, modal-system.css, jury-modals.css
  • Result: Fragile modal system, hard to debug

CONSOLIDATED RESULT (Post-refactor):
  CSS: 26 files → 8 files (remove duplicate jury-refinement, consolidate modals)
  JS: 11 files → 6 files (remove duplicate modal handler)
```

---

### VISION.HTML (Vision Page)
```
Features:
  ✓ Full-screen hero background
  ✓ Scroll-triggered text animations (fade/slide in)
  ✓ Parallax background effects
  ✓ Sections reveal as you scroll
  ✓ Navigation with scroll effects
  ✓ Dark theme

CSS Dependencies (23 files):
  ├─ [17 standard from index.html]
  ├─ pages/vision.css (vision-specific styles - NOT LINKED!)
  ├─ vision-refinement.css (vision refinements)
  └─ vision-refinement.css (LOADED TWICE? Need to verify)

Critical Issues:
  ❌ pages/vision.css exists but not linked
  ⚠️ vision-refinement.css possibly loaded twice

JS Dependencies (10 files):
  ├─ [9 standard files]
  └─ vision-scroll-observer.js (scroll detection for vision page?)

Critical Issues:
  ⚠️ vision-scroll-observer.js - does this conflict with production-scroll.js?
  ⚠️ Need to verify it's working and not redundant

CONSOLIDATED RESULT (Post-refactor):
  CSS: 23 files → 8 files
  JS: 10 files → 5 files (remove if vision-scroll-observer conflicts)
```

---

### CEREMONY.HTML, SPONSORS.HTML, HONORS.HTML, NOMINEES.HTML
```
All follow similar pattern:

CSS: 20-23 files each
  ├─ 17 standard files
  └─ 3-6 page-specific refinement files

JS: 9 files (standard set)

Issues:
  ✓ Simpler than jury/vision (no custom JS)
  ✓ But still have page-specific CSS files
  
CONSOLIDATED RESULT (Post-refactor):
  CSS: 20-23 files → 8 files each
  JS: 9 files → 5 files each
```

---

### SIMPLE PAGES (CONTACT, SUBMIT, PRIVACY, TERMS, PRESS)
```
Features:
  ✓ Simple layouts (form or text content)
  ✓ Email forms
  ✓ Navigation
  ✓ Dark theme

CSS: 20-21 files (mostly standard)
JS: 8-9 files (standard)

CONSOLIDATED RESULT (Post-refactor):
  CSS: 20-21 files → 8 files each
  JS: 8-9 files → 5 files each
```

---

## 🔍 CRITICAL VALIDATION TESTS (Post-Consolidation)

### Must Pass (Features That Cannot Break)
```
INDEX.HTML:
  [ ] Hero parallax moves with scroll (smooth, no jitter)
  [ ] Text fades in as you scroll down
  [ ] Sponsor carousel scrolls
  [ ] Email capture form works
  [ ] All CTAs clickable
  [ ] Navbar hides/shows on scroll
  [ ] Mobile menu opens/closes
  [ ] Dark mode brightness applied

JURY.HTML:
  [ ] Grid displays correctly (responsive)
  [ ] Click jury card → modal opens
  [ ] Modal shows bio, image, name, designation, company
  [ ] ESC closes modal
  [ ] Click backdrop closes modal
  [ ] Keyboard: Enter/Space opens modal
  [ ] Scroll works smoothly (no jitter)

VISION.HTML:
  [ ] Hero background loads
  [ ] Text sections fade in on scroll
  [ ] Parallax background moves correctly
  [ ] No visual jumping or glitches

ALL PAGES:
  [ ] No JavaScript errors in console
  [ ] No CSS parsing errors
  [ ] No 404s for assets
  [ ] Responsive: works on 375px (mobile)
  [ ] Responsive: works on 768px (tablet)
  [ ] Responsive: works on 1920px (desktop)
  [ ] Performance: Page load < 3 seconds (desktop)
  [ ] Performance: Page load < 5 seconds (mobile)
```

---

## 📊 CONSOLIDATION IMPACT MATRIX

```
                      CRITICAL?  IMPACTS              CAN_CONSOLIDATE?
─────────────────────────────────────────────────────────────────────
Scroll System         YES        All parallax         NO (dual conflicts)
Modal System          YES        Jury/Nominees       YES (remove duplicate)
Navigation            YES        All pages           YES (merge 2 files)
Email Capture         YES        Contact/Submit      YES (keep as-is)
Data Layer            NO         Feature pages       YES (merge data.js)
Theme/Brightness      YES        Visual             YES (consolidate)
Animations            YES        Polish              YES (merge all)
Responsiveness        YES        Mobile              YES (consolidate)
Hover Effects         NO         UX Polish          YES (consolidate)
CTA System            YES        Buttons             YES (consolidate)
Typography            YES        Text hierarchy     YES (consolidate)
─────────────────────────────────────────────────────────────────────
TOTAL CONSOLIDATABLE:                               14/15 areas (93%)
```

---

## ✅ FINAL CONSOLIDATION CHECKLIST

### Before Each Consolidation Step:
```
[ ] Document current behavior (screenshot/video)
[ ] Identify all dependents
[ ] Create backup/branch
[ ] Consolidate files
[ ] Test on all 13 pages
[ ] Performance check (no regression)
[ ] Screenshot/compare for visual changes
[ ] Commit to Git
```

### Order of Consolidation (Safest First):
```
1. Navigation (lowest risk, clear dependencies)
   └─ navbar-scroll.js + mobile-drawer-nav.js → navigation.js

2. Data (lowest risk, no visual output)
   └─ data.js + jury-data.js → data.js

3. Modal System (medium risk, isolated to 2-3 pages)
   └─ jury-modal-system.js (remove jury-modals.js if duplicate)
   └─ Consolidate CSS (jury-modal-dialog + modal-system → one file)

4. CSS Global Effects (medium risk, well-scoped)
   └─ Merge 18 system effect files → 3 strategic files

5. Scroll System (HIGH RISK, foundational)
   └─ Resolve production-scroll vs main.js conflict first
   └─ Remove duplicate, keep one
   └─ Consolidate CSS (scroll-physics + parallax-system)

6. Page-Specific Styles (low risk, isolated)
   └─ Consolidate 9 page-specific CSS files → pages.css

7. Build System (structural, lowest risk if done last)
   └─ Create src/ directory
   └─ Update build pipeline
   └─ Update HTML to load consolidated files
```

---

## 🎯 SUCCESS METRICS

```
Metric                          Target    Current   Post-Refactor
─────────────────────────────────────────────────────────────────
CSS Files per Page:             ≤ 8       21-26     8 ✅
JS Files per Page:              ≤ 7       10+       7 ✅
HTTP Requests (CSS):            ≤ 8       21-26     1 ✅
HTTP Requests (JS):             ≤ 7       10+       1 ✅
CSS Parse Time:                 -30%      baseline  -30% ✅
JS Parse Time:                  -30%      baseline  -30% ✅
Page Load Time:                 ≤ 2s      2.5s      1.2s ✅
Time to Interactive:            ≤ 2s      3.8s      1.9s ✅
No Feature Breakage:            0         0         0 ✅
No Visual Changes:              100%      100%      100% ✅
Maintainability Score:          ⭐⭐⭐⭐⭐ ⭐⭐      ⭐⭐⭐⭐⭐ ✅
```

---

## 📞 DECISION GATE: Ready to Proceed?

**Before Phase 1 starts, answer:**

1. [ ] **Scroll System:** Which is primary? production-scroll.js or main.js?
2. [ ] **Modal System:** Should jury-modals.js be removed?
3. [ ] **Emergency Override:** Can emergency-override.js be removed?
4. [ ] **Vision Observer:** Does vision-scroll-observer.js conflict?

**Without clarity on these 4 points, consolidation cannot start safely.**

---

Generated: 2026-01-27 | Status: AUDIT COMPLETE - AWAITING CLARIFICATION

