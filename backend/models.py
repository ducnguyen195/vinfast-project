from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(Text)
    price = Column(Float)
    image_url = Column(String(500))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class CustomerRequest(Base):
    __tablename__ = "customer_requests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), index=True)
    phone = Column(String(20), index=True)
    product = Column(String(255))
    message = Column(Text, nullable=True)
    status = Column(String(50), default="pending")  # pending, contacted, completed
    telegram_sent = Column(String(50), default="pending")  # pending, sent, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
