#!/bin/bash

# HUNGAMA FESTIVAL - FINAL DEPLOYMENT SCRIPT
set -e

echo ""
echo "🚀 STARTING FINAL DEPLOYMENT SEQUENCE..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Stop test server
echo "Step 1: Stopping test server..."
pkill -f "python3.*http.server 3000" 2>/dev/null || true
sleep 1
echo "✅ Test server stopped"
echo ""

# 2. Remove test directory
echo "Step 2: Cleaning test environment..."
rm -rf ./.local-test 2>/dev/null || true
echo "✅ Test directory removed"
echo ""

# 3. Verify production structure
echo "Step 3: Verifying production structure..."
REQUIRED_FILES=(
    "index.html"
    "jury.html"
    "public/output.css"
    "images/grand-jury-bg.png"
    "_headers"
    "package.json"
    ".gitignore"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ] && [ ! -d "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
    echo "  ✓ $file"
done
echo "✅ All production files verified"
echo ""

# 4. Verify git status
echo "Step 4: Verifying Git repository..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "✅ Git repository initialized"
    echo "  Branch: $(git rev-parse --abbrev-ref HEAD)"
    echo "  Commits: $(git rev-list --count HEAD)"
else
    echo "❌ Git repository not found"
    exit 1
fi
echo ""

# 5. Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT PACKAGE READY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📋 NEXT STEPS:"
echo ""
echo "1️⃣  CREATE GITHUB REPOSITORY"
echo "    • Go to https://github.com/new"
echo "    • Repository name: hungama-festival-site"
echo "    • Choose: Public or Private"
echo "    • DO NOT initialize with README"
echo "    • Click 'Create repository'"
echo ""

echo "2️⃣  PUSH TO GITHUB"
echo "    Run these commands:"
echo ""
echo "    git remote add origin https://github.com/YOUR_USERNAME/hungama-festival-site.git"
echo "    git push -u origin main"
echo ""

echo "3️⃣  DEPLOY TO CLOUDFLARE PAGES"
echo "    • Go to https://dash.cloudflare.com"
echo "    • Click 'Pages' in left sidebar"
echo "    • Click 'Create a project'"
echo "    • Select 'Connect to Git'"
echo "    • Authorize GitHub and select repository"
echo "    • Build settings:"
echo "      - Framework preset: None"
echo "      - Build command: (leave blank)"
echo "      - Output directory: /"
echo "    • Click 'Save and Deploy'"
echo ""

echo "4️⃣  VERIFY DEPLOYMENT"
echo "    • Wait 2-3 minutes for build"
echo "    • Visit your Cloudflare Pages URL"
echo "    • Test:"
echo "      ✓ Homepage loads"
echo "      ✓ Jury page loads with parallax"
echo "      ✓ Grand jury background visible"
echo "      ✓ No console errors"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOYMENT SEQUENCE COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
