#!/bin/bash
# Script chạy Next.js app

echo "🚗 VinFast Project - Khởi động"
echo "================================"

# Kiểm tra ports
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Khởi động Next.js
echo "⚛️  Khởi động Next.js app..."
cd frontend

if ! command -v npm &> /dev/null; then
    echo "❌ npm không được cài đặt"
    exit 1
fi

# Cài dependencies nếu cần
if [ ! -d "node_modules" ]; then
    echo "📦 Cài npm dependencies..."
    npm install
fi

# Chạy app trong background
if check_port 3000; then
    echo "⚠️  Port 3000 đang được sử dụng"
else
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Next.js chạy tại PID $FRONTEND_PID (Port 3000)"
fi

cd ..

echo ""
echo "================================"
echo "🎉 VinFast Project đã khởi động!"
echo "================================"
echo ""
echo "App + API: http://localhost:3000"
echo ""
echo "Nhấn Ctrl+C để dừng"

wait
