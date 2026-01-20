#!/bin/bash
# ========================================
# ROLLBACK SCRIPT - RESTORE LAST SNAPSHOT
# ========================================
# Use this if any production polish breaks visually

echo "⏪ ROLLING BACK TO LAST SAFE SNAPSHOT..."
echo "========================================"
echo ""

# Verify backups exist
if [[ ! -d "__rollback__" ]]; then
    echo "❌ ERROR: No snapshot found at __rollback__/"
    echo "Cannot rollback without snapshot."
    exit 1
fi

# Restore HTML
echo "Restoring HTML files..."
cp __rollback__/html/*.html . 2>/dev/null
if [[ $? -eq 0 ]]; then
    echo "  ✅ HTML restored"
else
    echo "  ⚠️  Warning: HTML restore had issues"
fi

# Restore CSS
echo "Restoring CSS files..."
cp __rollback__/css/*.css css/ 2>/dev/null
if [[ $? -eq 0 ]]; then
    echo "  ✅ CSS restored"
else
    echo "  ⚠️  Warning: CSS restore had issues"
fi

# Restore JS
echo "Restoring JavaScript files..."
cp __rollback__/js/*.js js/ 2>/dev/null
if [[ $? -eq 0 ]]; then
    echo "  ✅ JavaScript restored"
else
    echo "  ⚠️  Warning: JavaScript restore had issues"
fi

echo ""
echo "✅ ROLLBACK COMPLETE"
echo ""
echo "Next steps:"
echo "  1. Hard refresh browser (Cmd+Shift+R)"
echo "  2. Check for visual regressions"
echo "  3. Verify navbar and scroll behavior"
echo ""
