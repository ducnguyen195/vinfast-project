from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CustomerRequestBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    product: str
    message: Optional[str] = None

class CustomerRequestCreate(CustomerRequestBase):
    pass

class CustomerRequest(CustomerRequestBase):
    id: int
    status: str
    zalo_sent: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Response(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
