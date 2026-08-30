import os

from fastapi import Header, HTTPException, status


def require_api_key(x_api_key: str | None = Header(default=None)):
    expected_api_key = os.getenv("API_SECRET_KEY")

    if not expected_api_key or expected_api_key == "change_me":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API authentication is not configured",
        )

    if x_api_key != expected_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )

    return True
