# 📊 PHASE 2-3: DEPENDENCY MAPPING & CONSOLIDATION PLAN

## PHASE 2: DEPENDENCY ANALYSIS COMPLETE

### 🔍 JS File Classification

#### PRODUCTION CRITICAL (Referenced in HTML)
- ✅ main.js - Core initialization
- ✅ production-scroll.js - Scroll behavior
- ✅ production-parallax.js - Parallax effects
- ✅ mobile-menu.js - Mobile navigation
- ✅ data.js - Page data
- ✅ email-capture.js - Email form
- ✅ cta-wiring.js - CTA functionality
- ✅ emergency-override.js - Fallback system
- ✅ navbar-scroll.js - Navbar scroll behavior
- ✅ jury-modals.js - Modal system
- ✅ nominees-system.js - Nominees page
- ✅ press-kit-download.js - Press kit functionality
- ✅ vision-scroll-observer.js - Vision page scroll
- ✅ carousel.js - Image carousel
- ✅ cache-buster.js - Cache management
- ✅ elastic-free-parallax.js - Parallax engine

#### INDIRECT DEPENDENCIES (Imported by Other JS)
- ✅ cinematic.js - Imported by main.js
- ✅ premium-nav.js - Imported by navbar system
- ✅ view-transitions.js - Imported by main.js

#### ORPHANED (No references, no imports)
- 🗂️ navbar-controller.js - **ARCHIVE CANDIDATE**
- 🗂️ parallax-engine.js - **ARCHIVE CANDIDATE**
- 🗂️ parallax-validator.js - **ARCHIVE CANDIDATE**
- 🗂️ scroll-controller.js - **ARCHIVE CANDIDATE**
- 🗂️ split-layer-parallax.js - **ARCHIVE CANDIDATE**

---

## 📋 FILES IDENTIFIED FOR ARCHIVAL

### Temporary Test HTML Files (No Production Value)
- `__CRITICAL_FIXES_STATUS.html`
- `__test_grain.html`
- `__test_jury_hero.html`
- `TEST_DASHBOARD.html`

### Old CSS Backup Directory
- `css_backup_1768888398/` (entire directory - 19 CSS files)
  - Auto-timestamped, clearly obsolete
  - No references in current codebase
  - Created as safety backup, now replaced by production CSS

### Orphaned JavaScript
- `js/navbar-controller.js`
- `js/parallax-engine.js`
- `js/parallax-validator.js`
- `js/scroll-controller.js`
- `js/split-layer-parallax.js`

### One-Time Generator Scripts
- `inject_brightening.py` - Already executed, outputs in production
- `inject_navbar.py` - Already executed, outputs in production
- `inject_responsiveness.py` - Already executed, outputs in production
- `inject_responsiveness_remaining.py` - Already executed, outputs in production

### System Files
- `.DS_Store` - Macintosh system file, not part of codebase

---

## 📁 ARCHIVAL STRUCTURE (TARGET: `__archive__/`)

```
__archive__/
├── old_backups/
│   ├── css_backup_1768888398/  (19 files)
│   ├── MANIFEST.txt
│   └── README.md
├── generators/
│   ├── inject_brightening.py
│   ├── inject_navbar.py
│   ├── inject_responsiveness.py
│   ├── inject_responsiveness_remaining.py
│   ├── README.md
│   └── MANIFEST.txt
├── experimental_js/
│   ├── navbar-controller.js
│   ├── parallax-engine.js
│   ├── parallax-validator.js
│   ├── scroll-controller.js
│   ├── split-layer-parallax.js
│   ├── README.md
│   └── MANIFEST.txt
├── test_files/
│   ├── __CRITICAL_FIXES_STATUS.html
│   ├── __test_grain.html
│   ├── __test_jury_hero.html
│   ├── TEST_DASHBOARD.html
│   └── README.md
└── MANIFEST.md (master index)
```

---

## 📖 DOCUMENTATION CONSOLIDATION PLAN

### ACTIVE DOCUMENTATION (Keep in Root)
- `START_HERE.md` - Quick start guide
- `PORT_LOCK.md` - Port governance
- `MOBILE_MENU_IMPLEMENTATION.md` - Recent feature
- `PRODUCTION_READY.md` - Current state

### CONSOLIDATE INTO `PROJECT_HISTORY.md`
Merge with chronological dates:
- `PHASE_1_COMPLETE.md`
- `PHASE_G_COMPLETION.md`
- `DEPLOYMENT_REPORT.md`
- `FINAL_SUMMARY.md`
- `CRITICAL_FIXES_REPORT.md`

### CONSOLIDATE INTO `DEPLOYMENT.md` & `ARCHITECTURE.md`
From:
- `PRODUCTION_DEPLOYMENT.md`
- `README_DEPLOYMENT.md`
- `SINGLE_SOURCE_TRUTH.md`
- `PROJECT_REFERENCE.md`

---

## ✅ PHASE 3: CONSOLIDATION ACTIONS

### Step 1: Create `__archive__/` Directory Structure
```bash
mkdir -p __archive__/{old_backups,generators,experimental_js,test_files}
```

### Step 2: Move Files to Archive
```bash
# Old backups
mv css_backup_1768888398/ __archive__/old_backups/

# Python generators
mv inject_*.py __archive__/generators/

# Orphaned JS
mv js/navbar-controller.js js/parallax-engine.js js/parallax-validator.js \
   js/scroll-controller.js js/split-layer-parallax.js __archive__/experimental_js/

# Test HTML
mv __CRITICAL_FIXES_STATUS.html __test_grain.html __test_jury_hero.html \
   TEST_DASHBOARD.html __archive__/test_files/
```

### Step 3: Delete System Files
```bash
rm -f .DS_Store
```

### Step 4: Consolidate Documentation
- Create `PROJECT_HISTORY.md` from phase/summary docs
- Update `DEPLOYMENT.md` with all deployment instructions
- Create `ARCHITECTURE.md` from technical docs
- Keep only active docs in root

---

## 🧪 VERIFICATION CHECKLIST (Phase 4)

Before final approval:
- [ ] Server on port 8000 starts without errors
- [ ] All HTML pages load with HTTP 200
- [ ] All CSS files load
- [ ] All referenced JS files load
- [ ] No console errors in Chrome DevTools
- [ ] No broken asset links
- [ ] Mobile menu works
- [ ] Navigation functional
- [ ] All images load
- [ ] Archive structure created successfully
- [ ] Restoration script functional

---

## 🔄 ROLLBACK PLAN (Phase 5)

Create `__archive__/RESTORATION.sh`:
```bash
#!/bin/bash
# Restore all archived files to original locations
mv __archive__/old_backups/css_backup_1768888398/ .
mv __archive__/generators/inject_*.py .
mv __archive__/experimental_js/*.js js/
mv __archive__/test_files/*.html .
git checkout .DS_Store 2>/dev/null || touch .DS_Store
```

---

## 📊 EXPECTED IMPACT

### Reduction
- **Test HTML files**: -4 files
- **CSS backups**: -19 files
- **Orphaned JS**: -5 files
- **Generator scripts**: -4 files
- **System files**: -1 file
- **Total files removed from root**: -33 files (~24% reduction)

### Benefits
- Cleaner repository structure
- Easier to understand production files
- Reduced cognitive load for maintainers
- Clear separation of experimental/test code
- Preserved ability to recover archived files

### Zero Impact
- Production serving (no files moved from js/, css/, images/)
- Asset loading (all referenced files remain)
- Build process (all config files remain)
- Deployment automation (all scripts remain)

---

## 🎯 NEXT STEP

Wait for user approval before proceeding to:
- Phase 4: Pre-deletion Safety Check (run smoke tests)
- Phase 5: Execute archival operations

