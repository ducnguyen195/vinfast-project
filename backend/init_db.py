"""
Script để khởi tạo dữ liệu mẫu cho database
"""
from database import SessionLocal
from models import Product, CustomerRequest
from datetime import datetime

def init_db():
    db = SessionLocal()
    
    # Xóa dữ liệu cũ
    db.query(Product).delete()
    db.query(CustomerRequest).delete()
    
    # Thêm sản phẩm mẫu
    products = [
        Product(
            name="VinFast VF 8",
            description="SUV thông minh với công nghệ tiên tiến, thời lượng pin lên đến 500km",
            price=800000000.0,
            image_url="vinfast-vf8.png"
        ),
        Product(
            name="VinFast VF 9",
            description="SUV hạng sang cao cấp với công nghệ tự lái mới nhất",
            price=1200000000.0,
            image_url="vinfast-vf9.png"
        ),
        Product(
            name="VinFast VF 3",
            description="Sedan compact giá rẻ, hiệu suất cao, tiết kiệm năng lượng",
            price=400000000.0,
            image_url="vinfast-vf3.png"
        ),
    ]
    
    # ensure slug is set for seeded products
    for product in products:
        # simple slugify inline (same logic as routes)
        slug = product.name.lower()
        slug = ''.join(ch for ch in slug if ch.isalnum() or ch.isspace() or ch=='-')
        slug = '-'.join(slug.split())
        product.slug = slug
        db.add(product)
    
    db.commit()
    print("Khởi tạo database thành công!")
    db.close()

if __name__ == "__main__":
    init_db()
