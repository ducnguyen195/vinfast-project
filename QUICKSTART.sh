#!/bin/bash

# VinFast Project Quick Start Guide

echo "
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║              🚗 VinFast Project - Quick Start 🚗               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check OS
OS='Unknown'
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS='Linux'
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS='Mac'
elif [[ "$OSTYPE" == "msys" ]]; then
    OS='Windows'
fi

echo -e "${GREEN}✓${NC} OS Detected: $OS"
echo ""

# Step 1: Check Dependencies
echo -e "${YELLOW}Step 1: Checking Dependencies...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "Install from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

# Step 2: Setup App
echo ""
echo -e "${YELLOW}Step 2: Setting up Next.js app...${NC}"

cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install > /dev/null 2>&1
fi

echo -e "${GREEN}✓ App setup complete${NC}"

cd ..

# Step 4: Summary
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next Steps:"
echo ""
echo "1. Update .env file:"
echo "   nano .env.example"
echo ""
echo "2. Start the project:"
echo "   ./run.sh"
echo ""
echo "Access:"
echo "   App + API: http://localhost:3000"
echo ""
echo "Documentation:"
echo "   - START_HERE.md        (Quick start)"
echo "   - INSTALLATION.md      (Detailed setup)"
echo "   - API.md               (API reference)"
echo "   - README.md            (Overview)"
echo ""