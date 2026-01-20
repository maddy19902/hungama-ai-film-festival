# 🚀 SINGLE SOURCE OF TRUTH: LOCAL TESTING PROTOCOL

## AUTHORITATIVE TESTING ENVIRONMENT

**Server Port:** 8000 ONLY  
**Server Command:** `python3 -m http.server 8000`  
**Project Root:** `/Users/madhav/hungama-festival-site`  
**Status:** ✅ ACTIVE

## VALID TESTING URLS (ONLY THESE)

These are the ONLY valid endpoints for testing:

- http://localhost:8000/ (Homepage)
- http://localhost:8000/index.html
- http://localhost:8000/sponsors.html (REFERENCE NAVBAR)
- http://localhost:8000/jury.html
- http://localhost:8000/nominees.html
- http://localhost:8000/vision.html
- http://localhost:8000/honors.html
- http://localhost:8000/press.html
- http://localhost:8000/submit.html
- http://localhost:8000/contact.html (if available)
- http://localhost:8000/privacy.html (if available)
- http://localhost:8000/terms.html (if available)

## INVALID TESTING ENVIRONMENTS (COMPLETELY IGNORE THESE)

The following are **NOT** valid for testing and should **NEVER** be used:

- ❌ http://localhost:3000 (OBSOLETE - TERMINATED)
- ❌ http://localhost:5173 (OBSOLETE - TERMINATED)
- ❌ http://localhost:8080 (OBSOLETE - TERMINATED)
- ❌ Any Vite/NPM dev server
- ❌ Any server not explicitly started above

## VERIFICATION PROTOCOL

### Before Testing
1. Verify server is running: `lsof -i :8000`
2. Expected output: Python http.server process on port 8000

### During Testing
1. **Always test against http://localhost:8000/sponsors.html first** (REFERENCE)
2. Measure navbar dimensions and styling
3. Compare all other pages to reference page
4. Verify consistency across 1280px, 1024px, 768px, 375px breakpoints

### Verification Checklist
- [ ] Port 8000 is the only active server
- [ ] Ports 3000 and 5173 are completely clear
- [ ] All page loads return HTTP 200
- [ ] Navbar appears identical on all pages
- [ ] Responsive behavior matches reference

## QUICK TROUBLESHOOTING

### Port 8000 Already in Use
```bash
# Kill the process using port 8000
lsof -ti:8000 | xargs kill -9

# Restart server
python3 -m http.server 8000
```

### Port 3000 or 5173 Still Active (Should Not Happen)
```bash
# Emergency termination
pkill -9 -f "http.server"
pkill -9 -f "serve"
pkill -9 -f "vite"

# Verify all ports clear
lsof -i :3000,:5173,:8000
# Should return: lsof: no matching entries in /dev/lstat
```

### Server Not Responding
```bash
# Test connectivity
curl -I http://localhost:8000/index.html

# Check server logs
cat /tmp/server_8000.log

# Restart server
python3 -m http.server 8000
```

### Browser Cache Issues
- Hard refresh: **Cmd+Shift+R** (macOS) or **Ctrl+Shift+R** (Windows/Linux)
- Clear cache: DevTools → Application → Clear cache
- Disable cache: DevTools → Network → Disable cache (while DevTools open)

## QUICK START GUIDE

```bash
# 1. Navigate to project
cd /Users/madhav/hungama-festival-site

# 2. Verify no other servers running
lsof -i :3000,:5173,:8000

# 3. Start server
python3 -m http.server 8000

# 4. Open reference page
open http://localhost:8000/sponsors.html

# 5. Open each test page in adjacent tabs
# - index.html
# - jury.html
# - nominees.html
# - vision.html
# - honors.html
# - press.html
# - submit.html

# 6. Compare navbar consistency
# Use DevTools to measure pixel dimensions
```

## MANUAL VISUAL VERIFICATION STEPS

### Step 1: Open Reference
Open http://localhost:8000/sponsors.html in a new tab

### Step 2: Measure Baseline (Partners/Sponsors Page)
Open DevTools (F12) and inspect `.site-nav` element:
- **Navbar Height:** ______ px
- **Logo Position (left):** ______ px
- **Menu Item Gap:** ______ px
- **Submit Button Position (right):** ______ px

### Step 3: Compare Each Page

| Page | Navbar Height | Logo Align | Menu Spacing | Submit Position | Status |
|------|---|---|---|---|---|
| sponsors.html | ✓ | ✓ | ✓ | ✓ | REFERENCE |
| index.html | □ | □ | □ | □ | |
| jury.html | □ | □ | □ | □ | |
| nominees.html | □ | □ | □ | □ | |
| vision.html | □ | □ | □ | □ | |
| honors.html | □ | □ | □ | □ | |
| press.html | □ | □ | □ | □ | |
| submit.html | □ | □ | □ | □ | |

### Step 4: Responsive Testing
Test each page at these breakpoints using DevTools:
- **Desktop (1280px):** All elements aligned ✓ / ✗
- **Laptop (1024px):** All elements aligned ✓ / ✗
- **Tablet (768px):** Menu hidden, mobile button visible ✓ / ✗
- **Mobile (375px):** Mobile menu works correctly ✓ / ✗

### Step 5: Interaction Testing
For each page, verify:
- [ ] Hover effects on nav links work
- [ ] Submit button hover state correct
- [ ] Mobile menu toggle appears on small screens
- [ ] No layout shift on scroll
- [ ] All links are clickable

## EXPECTED OUTCOME

After completion of verification:
- ✅ All pages show **identical navbar** to reference
- ✅ All responsive breakpoints work correctly
- ✅ All interactive elements function as expected
- ✅ No CSS conflicts or styling variations
- ✅ No JavaScript errors in console

## FAILURE MODES & ESCALATION

### If Navbar Looks Different on One Page
1. Open DevTools on both pages
2. Inspect computed styles on reference vs. problem page
3. Check CSS load order in page source
4. Compare HTML markup (both should be identical)
5. Document exact CSS difference

### If Responsive Behavior Different
1. Test at exact breakpoints with DevTools
2. Check media queries in CSS files
3. Verify no page-specific CSS overrides
4. Check JavaScript event listeners

### If Port Conflicts Continue
1. Check for zombie processes: `ps aux | grep python`
2. Check for bound sockets: `netstat -tulpn | grep 8000`
3. Try different port: `python3 -m http.server 9000`

## ESCALATION CONTACTS

If ambiguity persists after following this protocol:
1. Document exact discrepancy (screenshot + console log)
2. Provide URL that fails
3. Verify server command used
4. Verify project root location
5. Check OS and Python version

## SIGN-OFF

Once all verification checks are complete:

**Date:** _____________  
**Verified By:** _____________  
**All Pages Pass:** ☐ YES ☐ NO  
**Issues Found:** _________________________________  
**Status:** ☐ READY FOR DEPLOYMENT ☐ NEEDS FIXES  

---

**This document is the authoritative source for all local testing. Do not deviate from this protocol.**
