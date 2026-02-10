import aiohttp
import logging
from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

logger = logging.getLogger(__name__)

class TelegramService:
    """Service gửi tin nhắn qua Telegram Bot"""

    BASE_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

    @staticmethod
    async def send_message_to_admin(request_data: dict) -> bool:
        """
        Gửi thông tin khách hàng đến Telegram của admin khi có đơn mới
        """
        try:
            message_content = f"""
🚗 *YÊU CẦU THÔNG TIN MỚI*

👤 *Họ và tên:* {request_data.get('name')}
📧 *Email:* {request_data.get('email')}
📱 *Điện thoại:* {request_data.get('phone')}
🚙 *Sản phẩm:* {request_data.get('product')}
💬 *Lời nhắn:* {request_data.get('message', 'Không có')}
⏰ *Thời gian:* {request_data.get('created_at', 'N/A')}

---
Vui lòng liên hệ với khách hàng sớm nhất!
            """.strip()

            async with aiohttp.ClientSession() as session:
                payload = {
                    "chat_id": TELEGRAM_CHAT_ID,
                    "text": message_content,
                    "parse_mode": "Markdown"
                }

                async with session.post(
                    f"{TelegramService.BASE_URL}/sendMessage",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    result = await response.json()

                    if response.status == 200 and result.get("ok"):
                        logger.info("✅ Đã gửi tin nhắn Telegram cho admin")
                        return True
                    else:
                        logger.error(f"❌ Lỗi gửi Telegram: {result}")
                        return False

        except Exception as e:
            logger.error(f"❌ Lỗi kết nối Telegram: {str(e)}")
            return False

    @staticmethod
    async def send_confirmation_to_customer(name: str) -> bool:
        """
        Gửi tin nhắn xác nhận nội bộ (nếu muốn dùng cho admin hoặc group)
        Telegram không gửi theo số điện thoại nên bỏ tham số phone
        """
        try:
            message_content = f"""
Xin chào,

Khách hàng *{name}* vừa gửi yêu cầu thông tin 🚗

Hệ thống đã ghi nhận thành công.
            """.strip()

            async with aiohttp.ClientSession() as session:
                payload = {
                    "chat_id": TELEGRAM_CHAT_ID,
                    "text": message_content,
                    "parse_mode": "Markdown"
                }

                async with session.post(
                    f"{TelegramService.BASE_URL}/sendMessage",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    result = await response.json()

                    if response.status == 200 and result.get("ok"):
                        logger.info("✅ Đã gửi xác nhận qua Telegram")
                        return True
                    else:
                        logger.error(f"❌ Lỗi gửi xác nhận Telegram: {result}")
                        return False

        except Exception as e:
            logger.error(f"❌ Lỗi gửi tin nhắn xác nhận: {str(e)}")
            return False
