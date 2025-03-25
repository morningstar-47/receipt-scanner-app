from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_brands():
    return {"message": "List of brands"}


