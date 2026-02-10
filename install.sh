#!/bin/bash
# Script cài đặt toàn bộ project

set -e

echo "🚗 VinFast Project - Setup"
echo "=========================="
echo ""

# Kiểm tra Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 không được cài đặt"
    exit 1
fi

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js không được cài đặt"
    exit 1
fi

# Kiểm tra PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client không được cài đặt"
fi

echo "✅ Các công cụ cần thiết đã tồn tại"
echo ""

# Cài Backend
echo "📦 Cài đặt Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "  - Tạo virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "  - Cài dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

if [ ! -f ".env" ]; then
    echo "  - Tạo .env file..."
    cp ../.env.example .env
    echo "  ⚠️  Vui lòng cập nhật .env với cấu hình của bạn"
fi

deactivate
cd ..

echo "✅ Backend setup hoàn tất"
echo ""

# Cài Frontend
echo "📦 Cài đặt Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "  - Cài npm dependencies..."
    npm install > /dev/null 2>&1
fi

cd ..

echo "✅ Frontend setup hoàn tất"
echo ""

echo "=========================="
echo "✅ Setup hoàn tất!"
echo "=========================="
echo ""
echo "📝 Bước tiếp theo:"
echo "1. Cập nhật .env với cấu hình PostgreSQL"
echo "2. Tạo database: ./setup_db.sh"
echo "3. Khởi tạo dữ liệu: cd backend && source venv/bin/activate && python init_db.py"
echo "4. Chạy project: ./run.sh"
echo ""
