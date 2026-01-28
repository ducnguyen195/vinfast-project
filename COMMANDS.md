#!/bin/bash

# VinFast Project - Command Reference Guide

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    🚗 VinFast Project - Command Reference 🚗                ║
║                                                                              ║
║                    Quick access to common development commands               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝


📦 SETUP & INSTALLATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Quick Setup (Recommended)
  $ chmod +x QUICKSTART.sh && ./QUICKSTART.sh

  Manual Backend Setup
  $ cd backend
  $ python3 -m venv venv
  $ source venv/bin/activate              # Linux/Mac
  $ venv\Scripts\activate                 # Windows
  $ pip install -r requirements.txt
  $ cp ../.env.example .env
  $ python init_db.py
  $ python seed.py
  $ python main.py

  Manual Frontend Setup
  $ cd frontend
  $ npm install
  $ cp .env.example .env
  $ npm start

  Database Setup
  $ chmod +x setup_db.sh && ./setup_db.sh

  Docker Setup
  $ docker-compose up -d
  $ docker-compose exec backend python init_db.py
  $ docker-compose exec backend python seed.py


🚀 RUNNING PROJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Run Both (Frontend + Backend)
  $ chmod +x run.sh && ./run.sh

  Run Backend Only
  $ cd backend
  $ source venv/bin/activate
  $ python main.py
  # Runs at: http://localhost:8000

  Run Frontend Only
  $ cd frontend
  $ npm start
  # Runs at: http://localhost:3000

  Run with Docker
  $ docker-compose up -d
  $ docker-compose down              # Stop services
  $ docker-compose logs -f           # View logs

  Run Tests
  $ cd backend && pytest test_main.py -v
  $ cd frontend && npm test


📱 ACCESSING APPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Frontend
  http://localhost:3000

  Backend API
  http://localhost:8000

  API Documentation (Swagger)
  http://localhost:8000/docs

  API Documentation (ReDoc)
  http://localhost:8000/redoc

  Health Check
  http://localhost:8000/api/health


🗄️  DATABASE COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Initialize Database
  $ cd backend && python init_db.py

  Seed Sample Data
  $ cd backend && python seed.py

  Run Migrations
  $ cd backend && python migrate.py

  Connect to PostgreSQL
  $ psql -h localhost -U vinfast_user -d vinfast

  Check Database
  $ pg_isready -h localhost


📝 ENVIRONMENT CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Create Backend .env
  $ cd backend && cp ../.env.example .env

  Create Frontend .env
  $ cd frontend && cp .env.example .env

  Edit Backend Configuration
  $ nano backend/.env

  Edit Frontend Configuration
  $ nano frontend/.env


🔍 TROUBLESHOOTING & DEBUGGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Check Port Usage
  $ lsof -i :8000          # Backend
  $ lsof -i :3000          # Frontend
  $ lsof -i :5432          # PostgreSQL

  Kill Process on Port
  $ kill -9 <PID>

  Check PostgreSQL Status
  $ sudo systemctl status postgresql     # Linux
  $ brew services list postgresql       # macOS
  $ pg_isready -h localhost

  View Backend Logs
  $ tail -f logs/app.log

  View Docker Logs
  $ docker-compose logs backend
  $ docker-compose logs frontend

  Reset Everything
  $ docker-compose down -v
  $ rm -rf backend/venv
  $ rm -rf frontend/node_modules
  $ rm backend/.env


📦 PACKAGE MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Install Python Packages
  $ cd backend && pip install -r requirements.txt
  $ pip install <package-name>

  Install Node Packages
  $ cd frontend && npm install
  $ npm install <package-name>

  Update Node Packages
  $ npm update

  List Installed Packages
  $ pip list
  $ npm list


🚢 DEPLOYMENT & BUILD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build Frontend
  $ cd frontend && npm run build
  # Output: build/

  Create Backend Docker Image
  $ docker build -t vinfast-backend ./backend

  Create Frontend Docker Image
  $ docker build -t vinfast-frontend ./frontend

  Push to Docker Hub
  $ docker tag vinfast-backend username/vinfast-backend:latest
  $ docker push username/vinfast-backend:latest

  Deploy to Heroku
  $ heroku create vinfast-api
  $ heroku config:set DATABASE_URL=...
  $ git push heroku main


🧪 TESTING & QUALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Run Backend Tests
  $ cd backend && pytest test_main.py -v
  $ pytest test_main.py --cov=.
  $ pytest test_main.py -x              # Stop on first fail

  Run Frontend Tests
  $ cd frontend && npm test
  $ npm test -- --coverage

  Code Formatting
  $ cd backend && black .               # Python
  $ cd frontend && npm run format       # JavaScript

  Code Linting
  $ cd backend && flake8 .              # Python
  $ cd frontend && npm run lint         # JavaScript

  Type Checking
  $ cd backend && mypy .                # Python


📖 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Documentation Files
  $ cat INDEX.md                 # Navigation guide
  $ cat PROJECT_SUMMARY.md       # Project overview
  $ cat INSTALLATION.md          # Detailed setup
  $ cat API.md                   # API reference
  $ cat DEPLOYMENT.md            # Deployment guide
  $ cat README.md                # Main readme

  View API Documentation
  Browser → http://localhost:8000/docs


🛠️  USEFUL UTILITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Check Python Version
  $ python3 --version

  Check Node Version
  $ node --version

  Check npm Version
  $ npm --version

  Check PostgreSQL Version
  $ psql --version

  Virtual Environment Management
  $ python3 -m venv <name>
  $ source <name>/bin/activate
  $ deactivate

  Current Directory
  $ pwd

  List Files
  $ ls -la

  Change Directory
  $ cd <path>


🔌 API QUICK REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Get All Products
  $ curl http://localhost:8000/api/products

  Get Product by ID
  $ curl http://localhost:8000/api/products/1

  Create Customer Request
  $ curl -X POST http://localhost:8000/api/requests \\
    -H "Content-Type: application/json" \\
    -d '{
      "name": "John",
      "email": "john@example.com",
      "phone": "0123456789",
      "product": "VinFast VF 8",
      "message": "Interested"
    }'

  See API Docs
  Browser → http://localhost:8000/docs


📞 HELP & SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Need Help?
  1. Check documentation files (INDEX.md, INSTALLATION.md)
  2. Review API docs (http://localhost:8000/docs)
  3. Check logs (logs/app.log)
  4. Review error messages carefully
  5. Email: support@vinfast.com

  Report Issues
  - Check INSTALLATION.md → Troubleshooting
  - Describe error & steps to reproduce
  - Include error messages & logs


⏱️  COMMON WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Step 1: Start Project
  $ chmod +x run.sh && ./run.sh

  Step 2: Open in Browser
  Frontend: http://localhost:3000
  Backend:  http://localhost:8000

  Step 3: Test Form
  - Fill contact form
  - Submit request
  - Check Zalo message sent

  Step 4: Stop Project
  Ctrl+C in terminal


═══════════════════════════════════════════════════════════════════════════════

                           Quick Links
                    📖 Documentation: INDEX.md
                   🚀 Quick Start: QUICKSTART.sh
                   📱 Frontend: http://localhost:3000
                   🔌 Backend API: http://localhost:8000/docs

═══════════════════════════════════════════════════════════════════════════════

EOF

echo ""
echo "Version: 1.0.0"
echo "Last Updated: 28/01/2026"
echo "Project: VinFast Vietnam"
echo ""
