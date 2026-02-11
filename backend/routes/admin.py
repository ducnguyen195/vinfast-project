from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/admin/login")
def admin_login(data: LoginRequest):
    if data.username == "admin" and data.password == "Admin@1234":
        return {"success": True, "token": "vinfast_admin_quynhhoa_140894@#"}
    raise HTTPException(status_code=401, detail="Sai tài khoản")
