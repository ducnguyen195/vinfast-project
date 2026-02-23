from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: Optional[str] = None
    content: Optional[str] = None 


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
    telegram_sent: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Response(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class PostBase(BaseModel):
    title: str
    slug: str
    image_url: Optional[str] = None
    content: str
    


class PostCreate(PostBase):
    pass


class Post(PostBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
