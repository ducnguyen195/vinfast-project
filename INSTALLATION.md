# Hướng Dẫn Chi Tiết Setup VinFast Project

## 🎯 Tổng Quan

VinFast Project là một trang web e-commerce hoàn chỉnh cho VinFast Vietnam với:
- **Frontend**: React 18 + TailwindCSS (responsive, modern UI)
- **Backend**: FastAPI (high-performance Python API)
- **Database**: PostgreSQL (robust data storage)
- **Integration**: Zalo Official Account (customer communication)

---

## 📦 Yêu Cầu Hệ Thống

### Tối thiểu
- Python 3.8+
- Node.js 14+
- PostgreSQL 12+

### Khuyến nghị
- Python 3.11+
- Node.js 18 LTS+
- PostgreSQL 15+
- Docker & Docker Compose (optional, for containerization)

---

## 🚀 Cài Đặt Nhanh

### Cách 1: Cài Đặt Tự Động (Khuyến nghị)

```bash
# 1. Clone/Extract project
cd /path/to/vinfast-project

# 2. Chạy script cài đặt
chmod +x install.sh
./install.sh

# 3. Cấu hình PostgreSQL
chmod +x setup_db.sh
./setup_db.sh

# 4. Cập nhật .env file
nano backend/.env
# Cập nhật: DATABASE_URL, ZALO_ACCESS_TOKEN, etc.

# 5. Khởi tạo database
cd backend
source venv/bin/activate
python init_db.py
cd ..

# 6. Chạy project
chmod +x run.sh
./run.sh
```

### Cách 2: Cài Đặt Thủ Công

#### Backend Setup

```bash
cd backend

# Tạo virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate     # Windows

# Cài dependencies
pip install -r requirements.txt

# Tạo .env file
cp ../.env.example .env

# Edit .env
# DATABASE_URL=postgresql://user:pass@localhost:5432/vinfast
# ZALO_ACCESS_TOKEN=your_token
# ZALO_ADMIN_PHONE=0123456789

# Run migrations
python migrate.py

# Khởi tạo dữ liệu mẫu
python init_db.py

# Chạy server
python main.py
# Truy cập: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

#### Frontend Setup

```bash
cd frontend

# Cài dependencies
npm install

# Tạo .env file
cp .env.example .env

# Chạy development server
npm start
# Truy cập: http://localhost:3000
```

### Cách 3: Docker (Dễ Nhất)

```bash
# Build and run containers
docker-compose up -d

# Khởi tạo database
docker-compose exec backend python init_db.py

# Truy cập
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
```

---

## 📊 Cấu Hình PostgreSQL

### Linux/Mac

```bash
# Cài PostgreSQL
sudo apt-get install postgresql postgresql-contrib  # Ubuntu/Debian
brew install postgresql                              # macOS

# Khởi động service
sudo systemctl start postgresql  # Ubuntu/Debian
brew services start postgresql  # macOS

# Tạo database và user
sudo -u postgres createdb vinfast
sudo -u postgres createuser -P vinfast_user
# Enter password when prompted

# Cấp quyền
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vinfast TO vinfast_user;"
```

### Windows

1. Tải từ https://www.postgresql.org/download/windows/
2. Chạy installer
3. Ghi nhớ password cho `postgres` user
4. Mở pgAdmin (đi kèm)
5. Tạo database `vinfast`
6. Tạo user `vinfast_user`

### macOS (Using Homebrew)

```bash
brew install postgresql
brew services start postgresql
createdb vinfast
createuser -P vinfast_user
```

---

## 🔗 Thiết Lập Zalo Integration

### Bước 1: Đăng Ký Official Account

1. Truy cập https://oa.zalo.me/
2. Đăng nhập bằng tài khoản Zalo
3. Nhấn "Tạo Official Account"
4. Điền thông tin cơ bản
5. Chờ phê duyệt (24-48 giờ)

### Bước 2: Lấy Access Token

1. Vào Settings → Integrations → API
2. Nhấn "Create Token"
3. Chọn permissions: `message:send`
4. Copy token

### Bước 3: Cấu Hình Backend

```bash
# Chỉnh sửa backend/.env
ZALO_ACCESS_TOKEN=<token_vừa_copy>
ZALO_OFFICIAL_ACCOUNT_ID=<account_id>
ZALO_ADMIN_PHONE=0123456789
```

### Bước 4: Test

```bash
# Backend sẽ tự động gửi tin nhắn khi có yêu cầu
# Kiểm tra logs để xác nhận:
# ✅ Đã gửi tin nhắn Zalo cho admin
```

---

## 📁 Cấu Trúc Thư Mục Chi Tiết

```
vinfast-project/
│
├── frontend/                      # React App
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js         # Axios config
│   │   │   └── services.js       # API calls
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation
│   │   │   ├── Footer.jsx        # Footer
│   │   │   ├── ProductCard.jsx   # Product display
│   │   │   ├── Modal.jsx         # Modal dialog
│   │   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   │   └── AlertBanner.jsx   # Alert messages
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Homepage
│   │   │   ├── Products.jsx      # Products listing
│   │   │   └── ContactForm.jsx   # Contact/Request form
│   │   ├── App.jsx               # Main component
│   │   ├── index.js              # Entry point
│   │   ├── index.css             # Global styles
│   │   └── globals.css           # Tailwind CSS
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── .env.example              # Environment template
│   ├── package.json              # Dependencies
│   ├── tailwind.config.js        # TailwindCSS config
│   ├── tsconfig.json             # TypeScript config
│   └── Dockerfile                # Docker config
│
├── backend/                       # FastAPI Server
│   ├── routes/
│   │   ├── products.py           # /api/products endpoints
│   │   └── requests.py           # /api/requests endpoints
│   ├── services/
│   │   └── zalo_service.py       # Zalo API integration
│   ├── models.py                 # SQLAlchemy models
│   ├── schemas.py                # Pydantic schemas
│   ├── database.py               # Database connection
│   ├── config.py                 # Configuration
│   ├── main.py                   # FastAPI app
│   ├── init_db.py                # Database initialization
│   ├── migrate.py                # Database migration
│   ├── test_main.py              # Unit tests
│   ├── conftest.py               # Pytest config
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment template
│   ├── package.json              # Metadata
│   └── Dockerfile                # Docker config
│
├── docker-compose.yml            # Docker services config
├── setup_db.sh                   # PostgreSQL setup script
├── install.sh                    # Setup script
├── run.sh                        # Run both frontend & backend
├── .env.example                  # Root env template
├── .gitignore                    # Git ignore rules
└── README.md                     # Main documentation
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run tests
pytest test_main.py -v

# With coverage
pytest test_main.py --cov=. --cov-report=html
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# With coverage
npm test -- --coverage
```

---

## 🌐 API Documentation

### Swagger UI
```
http://localhost:8000/docs
```

### ReDoc
```
http://localhost:8000/redoc
```

---

## 📱 Endpoints Tham Khảo

### Products
```bash
# Get all products
curl -X GET http://localhost:8000/api/products

# Get product by ID
curl -X GET http://localhost:8000/api/products/1

# Create product (Admin)
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VinFast VF 8",
    "description": "SUV thông minh",
    "price": 800.0,
    "image_url": "🚗"
  }'
```

### Customer Requests
```bash
# Create request
curl -X POST http://localhost:8000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "product": "VinFast VF 8",
    "message": "Interested in this car"
  }'

# Get all requests (Admin)
curl -X GET http://localhost:8000/api/requests

# Update request status
curl -X PUT http://localhost:8000/api/requests/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

---

## 🔧 Troubleshooting

### Issue: Port đã được sử dụng

```bash
# Tìm process sử dụng port
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>

# Hoặc chạy ở port khác
# Backend: python main.py --port 8001
# Frontend: PORT=3001 npm start
```

### Issue: CORS Error

Thêm URL frontend vào `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    ...
)
```

### Issue: Database Connection Failed

```bash
# Kiểm tra PostgreSQL
pg_isready -h localhost -p 5432

# Kiểm tra credentials
psql -h localhost -U vinfast_user -d vinfast

# Kiểm tra DATABASE_URL format
# postgresql://user:password@host:port/database
```

### Issue: Zalo API Error

```python
# Check Zalo token validity
# Logs: backend/main.py output

# Verify phone number format
# ZALO_ADMIN_PHONE=0123456789 (without +84 prefix initially)
```

---

## 🚢 Deployment

### Deploy to Heroku

```bash
# Backend
cd backend
heroku create vinfast-api
heroku config:set DATABASE_URL=<production_db_url>
git push heroku main

# Frontend
cd ../frontend
npm run build
# Deploy to Vercel/Netlify
```

### Deploy to AWS/GCP

1. Create EC2 instance
2. Install Python, Node.js, PostgreSQL
3. Clone repository
4. Configure environment variables
5. Use PM2 for process management
6. Setup Nginx reverse proxy
7. Configure SSL/TLS

### Deploy with Docker

```bash
# Build images
docker-compose build

# Push to Docker Hub
docker tag vinfast_backend username/vinfast_backend:latest
docker push username/vinfast_backend:latest

# Deploy
docker-compose up -d
```

---

## 📚 Tài Liệu Tham Khảo

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Zalo API Docs](https://developers.zalo.me/)

---

## 📞 Support

- 📧 Email: support@vinfast.com
- 💬 Zalo: @VinFast
- 🌐 Website: vinfast-vn.com

---

**Version**: 1.0.0  
**Last Updated**: 28/01/2026  
**Author**: VinFast Development Team
