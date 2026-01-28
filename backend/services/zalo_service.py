import aiohttp
import json
from config import ZALO_API_URL, ZALO_ACCESS_TOKEN, ZALO_OFFICIAL_ACCOUNT_ID, ZALO_ADMIN_PHONE
import logging

logger = logging.getLogger(__name__)

class ZaloService:
    """Service để gửi tin nhắn qua Zalo OA"""

    @staticmethod
    async def send_message_to_admin(request_data: dict) -> bool:
        """
        Gửi thông tin từ khách hàng đến Zalo OA của admin
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
                headers = {
                    'Authorization': f'Bearer {ZALO_ACCESS_TOKEN}',
                    'Content-Type': 'application/json'
                }

                payload = {
                    "recipient": {
                        "phone_number": ZALO_ADMIN_PHONE
                    },
                    "message": {
                        "text": message_content
                    }
                }

                async with session.post(
                    f"{ZALO_API_URL}/message/send",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    result = await response.json()
                    
                    if response.status == 200 and result.get('error') == 0:
                        logger.info(f"✅ Đã gửi tin nhắn Zalo cho admin")
                        return True
                    else:
                        logger.error(f"❌ Lỗi gửi Zalo: {result}")
                        return False

        except Exception as e:
            logger.error(f"❌ Lỗi kết nối Zalo: {str(e)}")
            return False

    @staticmethod
    async def send_confirmation_to_customer(phone: str, name: str) -> bool:
        """
        Gửi tin nhắn xác nhận đến khách hàng
        """
        try:
            message_content = f"""
Xin chào {name},

Cảm ơn bạn đã yêu cầu thông tin về sản phẩm VinFast! 🚗

Chúng tôi sẽ liên hệ bạn trong 24 giờ để cung cấp thông tin chi tiết.

Trân trọng,
Đội ngũ VinFast Vietnam
            """.strip()

            async with aiohttp.ClientSession() as session:
                headers = {
                    'Authorization': f'Bearer {ZALO_ACCESS_TOKEN}',
                    'Content-Type': 'application/json'
                }

                payload = {
                    "recipient": {
                        "phone_number": phone
                    },
                    "message": {
                        "text": message_content
                    }
                }

                async with session.post(
                    f"{ZALO_API_URL}/message/send",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    result = await response.json()
                    
                    if response.status == 200 and result.get('error') == 0:
                        logger.info(f"✅ Đã gửi xác nhận đến khách hàng")
                        return True
                    else:
                        logger.error(f"❌ Lỗi gửi xác nhận: {result}")
                        return False

        except Exception as e:
            logger.error(f"❌ Lỗi gửi tin nhắn xác nhận: {str(e)}")
            return False
