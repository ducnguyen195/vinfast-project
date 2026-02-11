from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import Base, engine
from routes import products, requests as request_routes
from routes import admin
from config import DEBUG
import logging

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Tạo bảng database
Base.metadata.create_all(bind=engine)

# Tạo ứng dụng FastAPI
app = FastAPI(
    title="VinFast API",
    description="API cho trang web VinFast Vietnam",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(admin.router)
app.include_router(products.router)
app.include_router(request_routes.router)

@app.get("/")
async def root():
    return {
        "message": "VinFast API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "debug": DEBUG
    }

@app.exception_handler(Exception)
async def exception_handler(request, exc):
    logger.error(f"Lỗi: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Có lỗi xảy ra trên server"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=DEBUG)
