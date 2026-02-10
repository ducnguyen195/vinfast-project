import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://ducnguyen:ducnguyen@localhost:5432/vinfast-project-v1")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
DEBUG = os.getenv("DEBUG", "True") == "True"

# Telegram Configuration
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8497586776:AAHpX32QqsOsNJbw0h3BGzwPCX5W9tylB0M")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "6002201117")
