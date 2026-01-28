from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Product as ProductModel
from schemas import Product, ProductCreate
from typing import List

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("", response_model=dict)
async def get_products(db: Session = Depends(get_db)):
    """Lấy danh sách sản phẩm"""
    try:
        products = db.query(ProductModel).all()
        return {
            "success": True,
            "message": "Danh sách sản phẩm",
            "data": products
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
            "data": product
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=dict)
async def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Tạo sản phẩm mới (Admin)"""
    try:
        db_product = ProductModel(**product.dict())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        
        return {
            "success": True,
            "message": "Tạo sản phẩm thành công",
            "data": db_product
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
