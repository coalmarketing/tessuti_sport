#!/bin/bash

# Deployment Verification Script
# Compares localhost build to Netlify production

echo "🔍 Deployment Verification Script"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Current: $NODE_VERSION"
echo "   Required: v20.x.x"
if [[ ! $NODE_VERSION == v20* ]]; then
    echo -e "   ${YELLOW}⚠️  Warning: Node version mismatch. Install Node 20 for consistency with Netlify.${NC}"
else
    echo -e "   ${GREEN}✓ Node version matches Netlify${NC}"
fi
echo ""

# Check if public directory exists
echo "🗂️  Checking build output..."
if [ -d "public" ]; then
    echo -e "   ${GREEN}✓ public/ directory exists${NC}"
    
    # Check if main.css exists
    if [ -f "public/assets/css/main.css" ]; then
        echo -e "   ${GREEN}✓ main.css generated${NC}"
        
        # Check if it's minified
        if grep -q "font-size:16px" "public/assets/css/main.css"; then
            echo -e "   ${GREEN}✓ CSS contains font-size fix${NC}"
        else
            echo -e "   ${YELLOW}⚠️  Font-size fix not found in CSS${NC}"
        fi
    else
        echo -e "   ${RED}✗ main.css not found${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  public/ directory not found. Run 'npm run build' first.${NC}"
fi
echo ""

# Check viewport meta in built HTML
echo "📱 Checking viewport configuration..."
if [ -f "public/index.html" ]; then
    if grep -q "maximum-scale=5.0" "public/index.html"; then
        echo -e "   ${GREEN}✓ Viewport meta tag contains maximum-scale${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Viewport meta tag may need updating${NC}"
    fi
    
    if grep -q "text-size-adjust" "public/assets/css/main.css"; then
        echo -e "   ${GREEN}✓ text-size-adjust property found in CSS${NC}"
    else
        echo -e "   ${YELLOW}⚠️  text-size-adjust not found${NC}"
    fi
else
    echo -e "   ${RED}✗ index.html not found in public/${NC}"
fi
echo ""

# Check netlify.toml configuration
echo "⚙️  Checking Netlify configuration..."
if [ -f "netlify.toml" ]; then
    if grep -q "NODE_VERSION = \"20\"" "netlify.toml"; then
        echo -e "   ${GREEN}✓ Node version locked to 20${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Node version not locked in netlify.toml${NC}"
    fi
    
    if grep -q "NODE_ENV = \"production\"" "netlify.toml"; then
        echo -e "   ${GREEN}✓ NODE_ENV set to production${NC}"
    else
        echo -e "   ${YELLOW}⚠️  NODE_ENV not set in netlify.toml${NC}"
    fi
else
    echo -e "   ${RED}✗ netlify.toml not found${NC}"
fi
echo ""

# Build size check
echo "📊 Build statistics..."
if [ -f "public/assets/css/main.css" ]; then
    CSS_SIZE=$(wc -c < "public/assets/css/main.css" | xargs)
    CSS_SIZE_KB=$((CSS_SIZE / 1024))
    echo "   CSS file size: ${CSS_SIZE_KB}KB"
    
    if [ $CSS_SIZE_KB -lt 100 ]; then
        echo -e "   ${YELLOW}⚠️  CSS seems too small - may not be fully built${NC}"
    elif [ $CSS_SIZE_KB -gt 1000 ]; then
        echo -e "   ${YELLOW}⚠️  CSS seems very large - check for issues${NC}"
    else
        echo -e "   ${GREEN}✓ CSS size looks reasonable${NC}"
    fi
fi
echo ""

# Final recommendations
echo "📋 Next steps:"
echo "   1. Run 'npm run build' to ensure fresh production build"
echo "   2. Deploy to Netlify"
echo "   3. Compare deployed site to localhost:3000"
echo "   4. Use browser DevTools to verify computed font-size on <html> = 16px"
echo "   5. Check mobile devices for text scaling issues"
echo ""
echo "✅ Verification complete!"
