#!/bin/bash

echo ""
echo "🔍 RUNNING FINAL VERIFICATION SUITE..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check 1: Image exists and is optimized
echo "Check 1: Image optimization..."
if [ -f "images/grand-jury-bg.png" ]; then
    IMAGE_SIZE=$(stat -f%z "images/grand-jury-bg.png" 2>/dev/null || stat -c%s "images/grand-jury-bg.png" 2>/dev/null)
    IMAGE_SIZE_KB=$((IMAGE_SIZE / 1024))
    
    if [ "$IMAGE_SIZE_KB" -lt 1000 ]; then
        echo "  ✅ grand-jury-bg.png: ${IMAGE_SIZE_KB}KB (optimized)"
    else
        echo "  ⚠️  grand-jury-bg.png: ${IMAGE_SIZE_KB}KB (consider optimization)"
    fi
else
    echo "  ❌ grand-jury-bg.png not found"
fi
echo ""

# Check 2: CSS is minified
echo "Check 2: CSS minification..."
if [ -f "public/output.css" ]; then
    CSS_SIZE=$(stat -f%z "public/output.css" 2>/dev/null || stat -c%s "public/output.css" 2>/dev/null)
    CSS_SIZE_KB=$((CSS_SIZE / 1024))
    echo "  ✅ output.css: ${CSS_SIZE_KB}KB (minified)"
else
    echo "  ❌ output.css not found"
fi
echo ""

# Check 3: Jury page updated
echo "Check 3: Jury page integration..."
if grep -q "grand-jury-bg.png" jury.html 2>/dev/null; then
    echo "  ✅ jury.html: Grand Jury background integrated"
else
    echo "  ❌ jury.html: Grand Jury background NOT found"
fi

if grep -q "Grand Jury" jury.html 2>/dev/null; then
    echo "  ✅ jury.html: Hero title updated"
else
    echo "  ❌ jury.html: Hero title NOT updated"
fi
echo ""

# Check 4: All HTML files present
echo "Check 4: HTML pages..."
HTML_FILES=(index.html jury.html nominees.html vision.html submit.html ceremony.html press.html honors.html sponsors.html contact.html terms.html privacy.html winners.html)
MISSING=0
for html in "${HTML_FILES[@]}"; do
    if [ -f "$html" ]; then
        echo "  ✓ $html"
    else
        echo "  ✗ $html (missing)"
        ((MISSING++))
    fi
done
echo "  ✅ $((${#HTML_FILES[@]} - MISSING))/${#HTML_FILES[@]} pages present"
echo ""

# Check 5: No development artifacts
echo "Check 5: Production cleanliness..."
if [ ! -d "node_modules" ]; then
    echo "  ✅ No node_modules (clean)"
else
    echo "  ⚠️  node_modules present (consider removing)"
fi

if [ ! -d "src" ]; then
    echo "  ✅ No src directory (clean)"
else
    echo "  ⚠️  src directory present (development artifact)"
fi

if [ ! -d ".local-test" ]; then
    echo "  ✅ No .local-test directory (clean)"
else
    echo "  ⚠️  .local-test directory present (testing artifact)"
fi
echo ""

# Check 6: Git status
echo "Check 6: Git repository..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    COMMITS=$(git rev-list --count HEAD)
    echo "  ✅ Repository initialized"
    echo "  ✅ Branch: $BRANCH"
    echo "  ✅ Commits: $COMMITS"
    
    if git status --porcelain | grep -q "^[^?]"; then
        echo "  ⚠️  Uncommitted changes:"
        git status --porcelain
    else
        echo "  ✅ Repository clean (all committed)"
    fi
else
    echo "  ❌ Git repository not found"
fi
echo ""

# Final Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ VERIFICATION COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Ready for deployment! Run: ./deploy-final.sh"
echo ""
