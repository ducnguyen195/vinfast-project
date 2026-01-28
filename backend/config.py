import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://ducnguyen:ducnguyen@localhost:5432/vinfast-project-v1")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
DEBUG = os.getenv("DEBUG", "True") == "True"

# Zalo Configuration
ZALO_ACCESS_TOKEN = os.getenv("ZALO_ACCESS_TOKEN", "")
ZALO_OFFICIAL_ACCOUNT_ID = os.getenv("ZALO_OFFICIAL_ACCOUNT_ID", "")
ZALO_ADMIN_PHONE = os.getenv("ZALO_ADMIN_PHONE", "")
ZALO_API_URL = "https://openapi.zalo.me/v2.0/oa"
