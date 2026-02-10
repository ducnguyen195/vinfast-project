"""
Data validation utilities
"""
import re
from typing import Optional

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Validate Vietnam phone number"""
    pattern = r'^(0|\+84)[0-9]{9,10}$'
    return re.match(pattern, phone) is not None

def sanitize_string(text: str) -> str:
    """Remove potentially harmful characters"""
    return text.strip()[:500]  # Max 500 chars

def validate_customer_request(data: dict) -> tuple[bool, Optional[str]]:
    """Validate customer request data"""
    
    # Check required fields
    if not data.get("name"):
        return False, "Tên không được trống"
    
    if not data.get("email"):
        return False, "Email không được trống"
    
    if not data.get("phone"):
        return False, "Số điện thoại không được trống"
    
    # Validate email
    if not validate_email(data.get("email")):
        return False, "Email không hợp lệ"
    
    # Validate phone
    if not validate_phone(data.get("phone")):
        return False, "Số điện thoại không hợp lệ (phải là số VN)"
    
    # Validate product
    valid_products = ["VinFast VF 8", "VinFast VF 9", "VinFast VF e34", "Other"]
    if data.get("product") not in valid_products:
        return False, "Sản phẩm không hợp lệ"
    
    return True, None
