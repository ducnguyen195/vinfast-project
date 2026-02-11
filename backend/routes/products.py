from fastapi import APIRouter, Depends, HTTPException,Header
from sqlalchemy.orm import Session
from database import get_db
from models import Product as ProductModel
from schemas import Product, ProductCreate
from typing import List
import os

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

@router.post("/products")
async def create_product(product: ProductCreate, admin_token: str = Header(None), db: Session = Depends(get_db)):
    """Tạo sản phẩm mới (Admin)"""
    if admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Không có quyền")
    try:
        db_product = ProductModel(**product.dict())
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
    product: ProductCreate,
    admin_token: str = Header(None),
    db: Session = Depends(get_db)
    ):
    if admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Không có quyền")

    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")

    data = product.dict()

    # tránh content = null
    data["content"] = data.get("content") or ""

    for key, value in data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)

    return {
        "success": True,
        "message": "Cập nhật thành công",
        "data": Product.from_orm(db_product)
    }

