"""
Database migration script for VinFast
"""
from database import Base, engine
from models import Product, CustomerRequest

def migrate():
    """Run migrations to create all tables"""
    print("📊 Running database migrations...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database migration completed!")

if __name__ == "__main__":
    migrate()
