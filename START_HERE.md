# 🎯 START HERE - Hướng Dẫn Bắt Đầu VinFast Project

## 🚀 Cách Nhanh Nhất (5 phút)

```bash
# 1. Mở Terminal ở folder project
cd /path/to/vinfast-project

# 2. Chạy script setup
chmod +x QUICKSTART.sh
./QUICKSTART.sh

# 3. Theo dõi hướng dẫn trong script

# 4. Cấu hình Database (nếu cần)
chmod +x setup_db.sh
./setup_db.sh

# 5. Cập nhật .env file
nano backend/.env

# 6. Khởi tạo dữ liệu
cd backend && source venv/bin/activate
python init_db.py
python seed.py

# 7. Chạy project
cd .. && chmod +x run.sh && ./run.sh
```

Truy cập:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000/docs

---

## 📚 Tài Liệu (Theo Thứ Tự Đọc)

1. **[INDEX.md](INDEX.md)** - �� Điều hướng tài liệu
2. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - 🎯 Tóm tắt dự án
3. **[INSTALLATION.md](INSTALLATION.md)** - 📝 Chi tiết cài đặt
4. **[API.md](API.md)** - 🔌 Tham khảo API
5. **[DEPLOYMENT.md](DEPLOYMENT.md)** - 🚢 Triển khai sản phẩm
6. **[COMMANDS.md](COMMANDS.md)** - 🛠️ Các lệnh thường dùng

---

## ✨ Tính Năng Chính

✅ **Frontend**: React 18 + TailwindCSS (Responsive, Modern)
✅ **Backend**: FastAPI (Python, High-performance)
✅ **Database**: PostgreSQL (Robust, Scalable)
✅ **Integration**: Zalo Official Account (Customer Communication)
✅ **Docker**: Full Docker support
✅ **Documentation**: Hoàn chỉnh & Chi tiết

---

## 🎨 Giao Diện

```
VinFast Website
├── Trang Chủ (Home)
│   ├── Hero Section
│   ├── Featured Products
│   └── Features Highlight
│
├── Danh Sách Sản Phẩm (Products)
│   └── Product Grid
│
└── Yêu Cầu Thông Tin (Contact)
    └── Contact Form + Zalo Integration
```

---

## 🗂️ Cấu Trúc Dự Án

```
vinfast-project/
├── frontend/          ← React App
├── backend/           ← FastAPI Server
├── docker-compose.yml ← Docker Config
├── START_HERE.md      ← Bạn đang đọc file này! 👈
├── INDEX.md           ← Điều hướng tài liệu
├── INSTALLATION.md    ← Hướng dẫn chi tiết
├── API.md             ← Tham khảo API
├── DEPLOYMENT.md      ← Triển khai
└── COMMANDS.md        ← Các lệnh
```

---

## 🚀 3 Cách Cài Đặt

### ⚡ Cách 1: Tự Động (Khuyến nghị)
```bash
chmod +x QUICKSTART.sh && ./QUICKSTART.sh
```
→ Tự động cài đặt tất cả

### 📖 Cách 2: Chi Tiết
Xem [INSTALLATION.md](INSTALLATION.md) để hướng dẫn step-by-step

### 🐳 Cách 3: Docker (Dễ Nhất)
```bash
docker-compose up -d
docker-compose exec backend python init_db.py
```

---

## ⚙️ Yêu Cầu Hệ Thống

- **Python**: 3.8+
- **Node.js**: 14+
- **PostgreSQL**: 12+
- **Docker** (optional): Latest

---

## 📊 Kiểm Tra Cài Đặt

```bash
# Python
python3 --version

# Node.js
node --version

# npm
npm --version

# PostgreSQL
psql --version
```

---

## 🔧 Troubleshooting

| Vấn Đề | Giải Pháp |
|--------|----------|
| Port đã được sử dụng | Kill process: `kill -9 <PID>` |
| Database error | Chạy: `./setup_db.sh` |
| npm error | Xóa `node_modules`: `rm -rf frontend/node_modules` |
| Python error | Tạo venv mới: `python3 -m venv venv` |

👉 Xem [INSTALLATION.md](INSTALLATION.md) → Troubleshooting

---

## 📱 Truy Cập Sau Setup

| URL | Mục Đích |
|-----|----------|
| http://localhost:3000 | Frontend (React App) |
| http://localhost:8000 | Backend (API Server) |
| http://localhost:8000/docs | API Documentation |
| http://localhost:8000/redoc | API ReDoc |

---

## 💡 Ví Dụ: Gửi Yêu Cầu

1. Truy cập http://localhost:3000
2. Nhấn "Liên Hệ" hoặc "Yêu Cầu Thông Tin"
3. Điền form:
   - Họ tên: "John Doe"
   - Email: "john@example.com"
   - Điện thoại: "0123456789"
   - Sản phẩm: "VinFast VF 8"
4. Nhấn "Gửi Yêu Cầu"
5. ✅ Thành công! Admin sẽ nhận tin nhắn Zalo

---

## 🎓 Học Hỏi Thêm

- **FastAPI**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com/)
- **React**: [react.dev](https://react.dev/)
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com/)
- **PostgreSQL**: [postgresql.org/docs](https://www.postgresql.org/docs/)
- **Docker**: [docker.com/resources](https://www.docker.com/resources)

---

## 🆘 Cần Giúp?

1. ✅ Kiểm tra [INSTALLATION.md](INSTALLATION.md)
2. ✅ Xem [COMMANDS.md](COMMANDS.md) để lệnh phổ biến
3. ✅ Đọc [API.md](API.md) để hiểu API
4. ✅ Kiểm tra logs: `docker-compose logs -f`
5. 📧 Email: support@vinfast.com

---

## 🎯 Tiếp Theo

1. **Setup**: Chạy `./QUICKSTART.sh` ✓
2. **Hiểu**: Đọc [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
3. **Thử**: Truy cập http://localhost:3000
4. **Phát triển**: Đọc [INSTALLATION.md](INSTALLATION.md)
5. **Deploy**: Xem [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🎊 Bạn Sẵn Sàng!

Tất cả các file được tạo & cấu hình hoàn chỉnh.

**Bắt đầu ngay:**
```bash
chmod +x QUICKSTART.sh
./QUICKSTART.sh
```

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: 28/01/2026

**Happy Coding! 🚀**
