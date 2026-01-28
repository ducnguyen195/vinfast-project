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

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python3 not found${NC}"
    echo "Install from: https://www.python.org/downloads/"
    exit 1
fi
echo -e "${GREEN}✓ Python3 found: $(python3 --version)${NC}"

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

# Step 2: Setup Backend
echo ""
echo -e "${YELLOW}Step 2: Setting up Backend...${NC}"

cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

pip install -q -r requirements.txt

if [ ! -f ".env" ]; then
    cp ../.env.example .env
    echo -e "${YELLOW}⚠ .env file created - PLEASE CONFIGURE IT!${NC}"
fi

echo -e "${GREEN}✓ Backend setup complete${NC}"

# Step 3: Setup Frontend
echo ""
echo -e "${YELLOW}Step 3: Setting up Frontend...${NC}"

cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install > /dev/null 2>&1
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"

cd ..

# Step 4: Summary
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next Steps:"
echo ""
echo "1. Configure PostgreSQL:"
echo "   chmod +x setup_db.sh && ./setup_db.sh"
echo ""
echo "2. Update .env file:"
echo "   nano backend/.env"
echo ""
echo "3. Initialize database:"
echo "   cd backend && source venv/bin/activate && python init_db.py && python seed.py"
echo ""
echo "4. Start the project:"
echo "   ./run.sh"
echo ""
echo "Access:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "Documentation:"
echo "   - START_HERE.md        (Quick start)"
echo "   - INSTALLATION.md      (Detailed setup)"
echo "   - API.md               (API reference)"
echo "   - README.md            (Overview)"
echo ""