from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import CustomerRequest as CustomerRequestModel
from schemas import CustomerRequestCreate
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/requests", tags=["requests"])

@router.get("", response_model=dict)
async def get_requests(db: Session = Depends(get_db)):
    """Lấy danh sách yêu cầu (Admin)"""
    try:
        requests = db.query(CustomerRequestModel).order_by(CustomerRequestModel.created_at.desc()).all()
        return {
            "success": True,
            "message": "Danh sách yêu cầu",
            "data": requests
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=dict)
async def create_request(
    request: CustomerRequestCreate,
    db: Session = Depends(get_db)
):
    """Tạo yêu cầu mới từ khách hàng"""
    try:
        # Tạo record trong database
        db_request = CustomerRequestModel(**request.dict())
        db.add(db_request)
        db.commit()
        db.refresh(db_request)

        return {
            "success": True,
            "message": "Yêu cầu của bạn đã được gửi thành công",
            "data": {
                "id": db_request.id,
                "name": db_request.name,
                "phone": db_request.phone
            }
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Lỗi tạo yêu cầu: {str(e)}")
        raise HTTPException(status_code=500, detail="Có lỗi xảy ra khi gửi yêu cầu")

@router.get("/{request_id}", response_model=dict)
async def get_request(request_id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết yêu cầu"""
    try:
        req = db.query(CustomerRequestModel).filter(CustomerRequestModel.id == request_id).first()
        if not req:
            raise HTTPException(status_code=404, detail="Yêu cầu không tìm thấy")
        
        return {
            "success": True,
            "message": "Chi tiết yêu cầu",
            "data": req
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{request_id}", response_model=dict)
async def update_request(request_id: int, status: str, db: Session = Depends(get_db)):
    """Cập nhật trạng thái yêu cầu (Admin)"""
    try:
        req = db.query(CustomerRequestModel).filter(CustomerRequestModel.id == request_id).first()
        if not req:
            raise HTTPException(status_code=404, detail="Yêu cầu không tìm thấy")
        
        req.status = status
        db.commit()
        db.refresh(req)
        
        return {
            "success": True,
            "message": "Cập nhật thành công",
            "data": req
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
