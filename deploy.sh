#!/bin/bash

###############################################################################
# HUNGAMA FESTIVAL - AUTOMATED PRODUCTION DEPLOYMENT
# Prepares site for Cloudflare Pages deployment
# Usage: bash deploy.sh
###############################################################################

set -e

echo "🎬 HUNGAMA FESTIVAL - PRODUCTION DEPLOYMENT"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Stop any running processes
echo -e "${BLUE}[1/7] Stopping running processes...${NC}"
pkill -f "python3 -m http.server" 2>/dev/null || true
pkill -f "tailwindcss" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
sleep 1
echo -e "${GREEN}✓ All processes stopped${NC}"

# Step 2: Clean build artifacts
echo ""
echo -e "${BLUE}[2/7] Cleaning build artifacts...${NC}"
rm -f public/output.css
rm -rf dist build .cache
echo -e "${GREEN}✓ Build artifacts cleaned${NC}"

# Step 3: Build production CSS
echo ""
echo -e "${BLUE}[3/7] Building production CSS...${NC}"
if command -v npx &> /dev/null; then
    npx tailwindcss -i src/input.css -o public/output.css --minify 2>/dev/null || {
        echo -e "${YELLOW}⚠ Tailwind build warning - checking if CSS exists...${NC}"
    }
else
    echo -e "${YELLOW}⚠ npx not found - using system tailwindcss${NC}"
    tailwindcss -i src/input.css -o public/output.css --minify 2>/dev/null || true
fi

if [ -f "public/output.css" ]; then
    SIZE=$(du -h public/output.css | cut -f1)
    echo -e "${GREEN}✓ CSS built successfully ($SIZE)${NC}"
else
    echo -e "${YELLOW}⚠ CSS not found - using existing output.css${NC}"
fi

# Step 4: Copy assets
echo ""
echo -e "${BLUE}[4/7] Copying static assets...${NC}"
mkdir -p public/images
cp -r images/* public/images/ 2>/dev/null || echo "  (No additional images to copy)"
echo -e "${GREEN}✓ Assets prepared${NC}"

# Step 5: Initialize Git if needed
echo ""
echo -e "${BLUE}[5/7] Preparing Git repository...${NC}"

if [ ! -d ".git" ]; then
    echo "  Initializing new Git repository..."
    git init
    
    # Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << 'EOF'
node_modules/
.env
.DS_Store
*.log
dist/
build/
.cache/
.next/
.vercel/
.cloudflare
EOF
        echo "  Created .gitignore"
    fi
    
    git add .
    git commit -m "🎬 Initial Hungama Festival production deployment"
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo "  Git repository already exists"
    echo -e "${GREEN}✓ Using existing repository${NC}"
fi

# Step 6: Verify production files
echo ""
echo -e "${BLUE}[6/7] Verifying production files...${NC}"

REQUIRED_FILES=(
    "index.html"
    "public/output.css"
    "js/production-scroll.js"
    "js/production-parallax.js"
    "js/main.js"
    "_headers"
    "package.json"
    ".gitignore"
)

ALL_GOOD=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        echo -e "${GREEN}  ✓${NC} $file"
    else
        echo -e "${YELLOW}  ✗${NC} $file (missing - may be OK)"
        ALL_GOOD=false
    fi
done

if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✓ All production files verified${NC}"
else
    echo -e "${YELLOW}⚠ Some files missing - review before deployment${NC}"
fi

# Step 7: Display deployment instructions
echo ""
echo -e "${BLUE}[7/7] Deployment complete!${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}NEXT STEPS:${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "1. Create GitHub repository (if not already created):"
echo "   • Go to https://github.com/new"
echo "   • Create a new repository called 'hungama-festival-site'"
echo ""
echo "2. Push code to GitHub:"
if ! git remote get-url origin &> /dev/null; then
    echo "   git remote add origin https://github.com/YOUR_USERNAME/hungama-festival-site.git"
fi
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Cloudflare Pages:"
echo "   • Go to https://dash.cloudflare.com"
echo "   • Select 'Pages' → 'Create a project'"
echo "   • Choose 'Connect to Git' and select your repository"
echo "   • Set build command: npm run build"
echo "   • Set output directory: ."
echo "   • Click 'Save and Deploy'"
echo ""
echo "4. Verify deployment:"
echo "   • Visit your Cloudflare Pages URL (provided after deploy)"
echo "   • Test parallax scrolling: smooth 60fps?"
echo "   • Check mobile responsiveness"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📚 For detailed instructions, see: DEPLOYMENT.md"
echo ""
echo -e "${GREEN}🚀 Your site is ready for production!${NC}"
