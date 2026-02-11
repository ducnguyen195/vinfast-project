"""
Seeding database với dữ liệu mẫu
"""
from database import SessionLocal
from models import Product, CustomerRequest
from datetime import datetime

def seed_products():
    """Thêm sản phẩm mẫu"""
    db = SessionLocal()
    
    products = [
        {
            "name": "VinFast VF 8",
            "description": "SUV thông minh với công nghệ tiên tiến, thời lượng pin lên đến 500km, trang bị hệ thống an toàn 5 sao, ghế da cao cấp",
            "price": 800000000,
            "image_url": "vinfast-vf8.png"
        },
        {
            "name": "VinFast VF 9",
            "description": "SUV hạng sang cao cấp với công nghệ tự lái cấp cao, nội thất sang trọng, hệ thống giải trí đỉnh cao",
            "price": 1499000000,
            "image_url": "vinfast-vf9.png"
        },
        {
            "name": "VinFast VF 7",
            "description": "Sedan compact giá rẻ, hiệu suất cao, tiết kiệm năng lượng, phù hợp với gia đình trẻ",
            "price": 799000000,
            "image_url": "vinfast-vf7.png"
        },
        {
            "name": "VinFast VF 6",
            "description": "Sedan thể thao với động cơ mạnh mẽ, phanh khí nén, thiết kế thể thao",
            "price": 694000000,
            "image_url": "vinfast-vf6.png"
        },
        {
            "name": "VinFast VF 3",
            "description": "MPV 7 chỗ lý tưởng cho gia đình, không gian rộng rãi, tiện nghi đầy đủ",
            "price": 299000000,
            "image_url": "vinfast-vf3.png"
        },
    ]
    
    for product_data in products:
        existing = db.query(Product).filter(Product.name == product_data["name"]).first()
        if not existing:
            product = Product(**product_data)
            db.add(product)
    
    db.commit()
    db.close()
    print("✅ Đã thêm dữ liệu sản phẩm")

if __name__ == "__main__":
    seed_products()
