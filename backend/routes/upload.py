from fastapi import APIRouter, UploadFile, File, HTTPException, Request
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/api", tags=["upload"])

# directory where TinyMCE images will be stored
UPLOAD_DIR = "uploads/tinymce"
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

@router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    try:
        filename = file.filename.replace(" ", "_")
        filepath = f"{UPLOAD_DIR}/{filename}"

        if os.path.exists(filepath):
            base, ext = os.path.splitext(filename)
            import time
            filename = f"{base}_{int(time.time())}{ext}"
            filepath = f"{UPLOAD_DIR}/{filename}"

        with open(filepath, "wb") as f:
            shutil.copyfileobj(file.file, f)

        base_url = str(request.base_url).rstrip("/")
        url = f"{base_url}/uploads/tinymce/{filename}"

        return {"location": url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
