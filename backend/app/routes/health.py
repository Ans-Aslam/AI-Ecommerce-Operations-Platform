from fastapi import APIRouter
from app.database import check_database_connection

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
def health_check():
    database_status = check_database_connection()

    return {
        "status": "healthy",
        "service": "ecommerce-api",
        "database": "connected" if database_status else "disconnected",
    }
