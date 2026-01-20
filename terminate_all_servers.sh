#!/bin/bash
# ========================================
# Emergency Server Termination Script
# ========================================
# This script terminates ALL development servers
# and clears all known testing ports
# ========================================

echo "🧹 EMERGENCY SERVER TERMINATION PROTOCOL"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track termination status
TERMINATION_SUCCESS=true

# Step 1: Kill processes by name
echo "Step 1️⃣  Terminating known server processes..."
PROCESS_TARGETS=("serve" "http.server" "vite" "npm" "node" "next" "webpack" "tailwindcss")

for process in "${PROCESS_TARGETS[@]}"; do
    if pkill -9 -f "$process" 2>/dev/null; then
        echo "  ✅ Terminated: $process"
    fi
done

# Step 2: Clear all known ports
echo ""
echo "Step 2️⃣  Clearing all known development ports..."
PORTS=(3000 3001 5173 5713 8000 8080 5000 5500 4200 1234 4321 9000 7000)

for port in "${PORTS[@]}"; do
    if lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null; then
        echo "  ✅ Cleared port: $port"
    fi
done

# Step 3: Clear build caches
echo ""
echo "Step 3️⃣  Clearing build caches..."
rm -rf .vite-cache .parcel-cache .next .nuxt 2>/dev/null
echo "  ✅ Build caches cleared"

# Step 4: Verify termination
echo ""
echo "Step 4️⃣  Verifying termination success..."
ACTIVE_PORTS=""
for port in 3000 5173 8000; do
    if lsof -i :$port > /dev/null 2>&1; then
        ACTIVE_PORTS="$ACTIVE_PORTS:$port"
        TERMINATION_SUCCESS=false
    fi
done

if [[ "$TERMINATION_SUCCESS" == "true" ]]; then
    echo -e "${GREEN}✅ SUCCESS: All servers terminated${NC}"
    echo "   Port 3000: CLEAR"
    echo "   Port 5173: CLEAR"
    echo "   Port 8000: CLEAR"
else
    echo -e "${RED}❌ WARNING: Some ports still active:${NC}"
    echo "$ACTIVE_PORTS" | tr ':' '\n' | grep -v '^$'
    echo ""
    echo "Attempting secondary termination..."
    fuser -k -9 3000/tcp 5173/tcp 8000/tcp 2>/dev/null || true
    sleep 1
    
    # Final verification
    STILL_ACTIVE=false
    for port in 3000 5173 8000; do
        if lsof -i :$port > /dev/null 2>&1; then
            STILL_ACTIVE=true
            echo -e "${RED}❌ Port $port still active${NC}"
        else
            echo -e "${GREEN}✅ Port $port cleared${NC}"
        fi
    done
    
    if [[ "$STILL_ACTIVE" == "true" ]]; then
        echo ""
        echo -e "${RED}🚨 CRITICAL: Manual intervention required${NC}"
        echo "Remaining active ports:"
        lsof -i :3000,:5173,:8000
        exit 1
    fi
fi

echo ""
echo "========================================"
echo "🎯 READY FOR FRESH SERVER START"
echo "========================================"
echo ""
echo "⚠️  PORT GOVERNANCE RULE (ENFORCED):"
echo "   Canonical port for this project: 8000"
echo "   Forbidden ports: 3000, 5173, 5713, 8080"
echo "   Reference: PORT_LOCK.md"
echo ""
echo "To start the testing server:"
echo "  cd /Users/madhav/hungama-festival-site"
echo "  python3 -m http.server 8000"
echo ""
echo "Then open: http://localhost:8000/index.html"
echo ""
