"""
Utilities for VinFast Backend
"""

from datetime import datetime
import json

def get_current_timestamp():
    """Get current timestamp"""
    return datetime.utcnow().isoformat()

def format_response(success: bool, message: str, data=None):
    """Format API response"""
    return {
        "success": success,
        "message": message,
        "data": data,
        "timestamp": get_current_timestamp()
    }

def log_request(method: str, path: str, ip: str):
    """Log incoming request"""
    return {
        "timestamp": get_current_timestamp(),
        "method": method,
        "path": path,
        "ip": ip
    }

class PaginationParams:
    """Pagination helper"""
    
    def __init__(self, skip: int = 0, limit: int = 10):
        self.skip = max(0, skip)
        self.limit = min(limit, 100)  # Max 100 items
    
    def get_offset(self):
        return self.skip
    
    def get_limit(self):
        return self.limit
