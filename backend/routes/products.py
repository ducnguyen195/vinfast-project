from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models import Product as ProductModel
from schemas import Product
from typing import List, Optional
import os
import shutil
from pathlib import Path

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads/products"
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/api/products", tags=["products"])
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")

@router.get("", response_model=dict)
async def get_products(db: Session = Depends(get_db)):
    """Lấy danh sách sản phẩm"""
    try:
        products = db.query(ProductModel).all()
        return {
            "success": True,
            "message": "Danh sách sản phẩm",
            "data": [Product.from_orm(p) for p in products]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}", response_model=dict)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết sản phẩm"""
    try:
        product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Sản phẩm không tìm thấy")
        
        return {
            "success": True,
            "message": "Chi tiết sản phẩm",
            "data": Product.from_orm(product)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    admin_token: str = Header(None),
    db: Session = Depends(get_db)
):
    """Tạo sản phẩm mới (Admin)"""
    if admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Không có quyền")
    try:
        image_url = None
        
        # Handle file upload if provided
        if file:
            filename = f"{name.replace(' ', '_')}_{file.filename}"
            filepath = f"{UPLOAD_DIR}/{filename}"
            with open(filepath, "wb") as f:
                shutil.copyfileobj(file.file, f)
            image_url = filepath
        
        db_product = ProductModel(
            name=name,
            description=description,
            price=price,
            content=content or "",
            image_url=image_url
        )
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        
        return {
            "success": True,
            "message": "Tạo sản phẩm thành công",
            "data": Product.from_orm(db_product)
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.put("/{product_id}")
async def update_product(
    product_id: int,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    admin_token: str = Header(None),
    db: Session = Depends(get_db)
):
    if admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Không có quyền")

    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")

    try:
        db_product.name = name
        db_product.description = description
        db_product.price = price
        db_product.content = content or ""
        
        # Handle file upload if provided
        if file:
            filename = f"{name.replace(' ', '_')}_{file.filename}"
            filepath = f"{UPLOAD_DIR}/{filename}"
            with open(filepath, "wb") as f:
                shutil.copyfileobj(file.file, f)
            db_product.image_url = filepath

        db.commit()
        db.refresh(db_product)

        return {
            "success": True,
            "message": "Cập nhật thành công",
            "data": Product.from_orm(db_product)
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

