from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models import Post as PostModel
from schemas import Post, PostCreate
import os
import shutil
from pathlib import Path
from typing import Optional

router = APIRouter(prefix="/api/posts", tags=["posts"])
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads/posts"
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)


@router.get("", response_model=dict)
async def get_posts(db: Session = Depends(get_db)):
    try:
        posts = db.query(PostModel).order_by(PostModel.created_at.desc()).all()
        return {
            "success": True,
            "message": "Danh sách bài viết",
            "data": [Post.from_orm(p) for p in posts]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/slug/{slug}", response_model=dict)
async def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    try:
        post = db.query(PostModel).filter(PostModel.slug == slug).first()
        if not post:
            raise HTTPException(status_code=404, detail="Bài viết không tìm thấy")

        return {
            "success": True,
            "message": "Chi tiết bài viết",
            "data": Post.from_orm(post)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/posts")
async def create_post(
    title: str = Form(...),
    slug: str = Form(...),
    content: str = Form(...),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    admin_token: str = Header(None),
    db: Session = Depends(get_db)
):
    if admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Không có quyền")
    
    try:
        final_image_url = None
        
        # Handle file upload if provided
        if file:
            filename = f"{slug}_{file.filename}"
            filepath = f"{UPLOAD_DIR}/{filename}"
            with open(filepath, "wb") as f:
                shutil.copyfileobj(file.file, f)
            final_image_url = filepath
        elif image_url:
            final_image_url = image_url
        
        db_post = PostModel(
            title=title,
            slug=slug,
            content=content,
            image_url=final_image_url
        )
        db.add(db_post)
        db.commit()
        db.refresh(db_post)

        return {
            "success": True,
            "message": "Tạo bài viết thành công",
            "data": Post.from_orm(db_post)
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/posts/{post_id}")
async def update_post(
    post_id: int,
    title: str = Form(...),
    slug: str = Form(...),
    content: str = Form(...),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    admin_token: str = Header(None),
    db: Session = Depends(get_db)
):
    if admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Không có quyền")

    db_post = db.query(PostModel).filter(PostModel.id == post_id).first()

    if not db_post:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài viết")

    try:
        db_post.title = title
        db_post.slug = slug
        db_post.content = content
        
        # Handle file upload if provided
        if file:
            filename = f"{slug}_{file.filename}"
            filepath = f"{UPLOAD_DIR}/{filename}"
            with open(filepath, "wb") as f:
                shutil.copyfileobj(file.file, f)
            db_post.image_url = filepath
        elif image_url:
            db_post.image_url = image_url

        db.commit()
        db.refresh(db_post)

        return {
            "success": True,
            "message": "Cập nhật bài viết thành công",
            "data": Post.from_orm(db_post)
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
