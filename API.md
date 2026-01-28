# API Reference - VinFast Backend

## 📋 Mục Lục

1. [Authentication](#authentication)
2. [Products](#products)
3. [Customer Requests](#customer-requests)
4. [Health & Info](#health--info)
5. [Error Handling](#error-handling)

---

## Authentication

Hiện tại API không yêu cầu authentication (tương lai sẽ có JWT).

---

## Products

### Get All Products

**Request**
```http
GET /api/products
```

**Response**
```json
{
  "success": true,
  "message": "Danh sách sản phẩm",
  "data": [
    {
      "id": 1,
      "name": "VinFast VF 8",
      "description": "SUV thông minh",
      "price": 800.0,
      "image_url": "🚗",
      "created_at": "2026-01-28T10:00:00"
    }
  ]
}
```

### Get Product by ID

**Request**
```http
GET /api/products/{id}
```

**Response**
```json
{
  "success": true,
  "message": "Chi tiết sản phẩm",
  "data": {
    "id": 1,
    "name": "VinFast VF 8",
    "description": "SUV thông minh",
    "price": 800.0,
    "image_url": "🚗",
    "created_at": "2026-01-28T10:00:00"
  }
}
```

### Create Product (Admin)

**Request**
```http
POST /api/products
Content-Type: application/json

{
  "name": "VinFast VF 8",
  "description": "SUV thông minh",
  "price": 800.0,
  "image_url": "🚗"
}
```

**Response**
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "id": 1,
    "name": "VinFast VF 8",
    "description": "SUV thông minh",
    "price": 800.0,
    "image_url": "🚗",
    "created_at": "2026-01-28T10:00:00"
  }
}
```

---

## Customer Requests

### Get All Requests (Admin)

**Request**
```http
GET /api/requests
```

**Response**
```json
{
  "success": true,
  "message": "Danh sách yêu cầu",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0123456789",
      "product": "VinFast VF 8",
      "message": "Interested",
      "status": "pending",
      "zalo_sent": "sent",
      "created_at": "2026-01-28T10:00:00",
      "updated_at": "2026-01-28T10:00:00"
    }
  ]
}
```

### Create Customer Request

**Request**
```http
POST /api/requests
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0123456789",
  "product": "VinFast VF 8",
  "message": "Interested in this car"
}
```

**Response**
```json
{
  "success": true,
  "message": "Yêu cầu của bạn đã được gửi thành công",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "product": "VinFast VF 8",
    "message": "Interested in this car",
    "status": "pending",
    "zalo_sent": "pending",
    "created_at": "2026-01-28T10:00:00",
    "updated_at": "2026-01-28T10:00:00"
  }
}
```

### Get Request by ID

**Request**
```http
GET /api/requests/{id}
```

**Response**
```json
{
  "success": true,
  "message": "Chi tiết yêu cầu",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "product": "VinFast VF 8",
    "message": "Interested",
    "status": "pending",
    "zalo_sent": "sent",
    "created_at": "2026-01-28T10:00:00",
    "updated_at": "2026-01-28T10:00:00"
  }
}
```

### Update Request Status (Admin)

**Request**
```http
PUT /api/requests/{id}?status=contacted
```

**Response**
```json
{
  "success": true,
  "message": "Cập nhật thành công",
  "data": {
    "id": 1,
    "status": "contacted",
    ...
  }
}
```

**Status Values**: `pending`, `contacted`, `completed`

---

## Health & Info

### API Info

**Request**
```http
GET /
```

**Response**
```json
{
  "message": "VinFast API",
  "version": "1.0.0",
  "status": "running"
}
```

### Health Check

**Request**
```http
GET /api/health
```

**Response**
```json
{
  "status": "ok",
  "debug": true
}
```

---

## Error Handling

### 400 Bad Request
```json
{
  "detail": "Validation error message"
}
```

### 404 Not Found
```json
{
  "detail": "Sản phẩm không tìm thấy"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Có lỗi xảy ra trên server"
}
```

---

## Rate Limiting

Hiện tại không có rate limiting. Sẽ được thêm vào phiên bản tiếp theo.

---

## CORS Headers

Tất cả các endpoints hỗ trợ CORS từ:
- `http://localhost:3000` (development)
- `http://localhost:5173` (Vite development)
- `*` (All origins - development only)

---

**API Version**: 1.0.0  
**Last Updated**: 28/01/2026
