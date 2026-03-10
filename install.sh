#!/bin/bash
# Script cài đặt Next.js project

set -e

echo "🚗 VinFast Project - Setup"
echo "=========================="
echo ""

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

# Cài App
echo "📦 Cài đặt Next.js app..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "  - Cài npm dependencies..."
    npm install > /dev/null 2>&1
fi

echo "✅ App setup hoàn tất"
echo ""

echo "=========================="
echo "✅ Setup hoàn tất!"
echo "=========================="
echo ""
echo "📝 Bước tiếp theo:"
echo "1. Cập nhật .env với cấu hình PostgreSQL"
echo "2. Chạy project: ./run.sh"
echo ""
