from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/admin/login")
def admin_login(data: LoginRequest):
    admin_user = os.getenv("ADMIN_USERNAME")
    admin_pass = os.getenv("ADMIN_PASSWORD")
    admin_token = os.getenv("ADMIN_TOKEN")

    if not admin_user or not admin_pass or not admin_token:
        raise HTTPException(status_code=500, detail="Missing admin environment configuration")

    if data.username == admin_user and data.password == admin_pass:
        return {"success": True, "token": admin_token}
    raise HTTPException(status_code=401, detail="Sai tài khoản")
