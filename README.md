VinFast web app theo kiến trúc Next.js fullstack.

- UI + API chạy chung bằng Next.js (`frontend/`)
- Database PostgreSQL qua Docker
- Chỉ public 1 cổng ứng dụng: `3000`

Chạy nhanh:

```bash
docker compose up -d --build
```

Truy cập: `http://localhost:3000`
