#!/bin/bash
# Script chạy cả Frontend và Backend

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

# Khởi động Backend
echo "🔧 Khởi động Backend FastAPI..."
cd backend

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 không được cài đặt"
    exit 1
fi

if [ ! -d "venv" ]; then
    echo "📦 Tạo virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

if ! command -v pip &> /dev/null; then
    echo "❌ pip không được cài đặt"
    exit 1
fi

# Cài dependencies nếu cần
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt > /dev/null 2>&1
fi

# Chạy backend trong background
if check_port 8000; then
    echo "⚠️  Port 8000 đang được sử dụng"
else
    python main.py &
    BACKEND_PID=$!
    echo "✅ Backend chạy tại PID $BACKEND_PID (Port 8000)"
fi

cd ..

# Khởi động Frontend
echo "⚛️  Khởi động Frontend React..."
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

# Chạy frontend trong background
if check_port 3000; then
    echo "⚠️  Port 3000 đang được sử dụng"
else
    npm start &
    FRONTEND_PID=$!
    echo "✅ Frontend chạy tại PID $FRONTEND_PID (Port 3000)"
fi

cd ..

echo ""
echo "================================"
echo "🎉 VinFast Project đã khởi động!"
echo "================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Nhấn Ctrl+C để dừng"

wait
