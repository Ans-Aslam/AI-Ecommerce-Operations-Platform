from fastapi import APIRouter, HTTPException
from app.database import get_database_connection

router = APIRouter(
    prefix="/api/v1/refund-requests",
    tags=["Refund Requests"],
)


@router.get("")
def get_refund_requests():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    shopify_order_id,
                    order_id,
                    refund_type,
                    requested_amount,
                    reason,
                    status,
                    requested_by,
                    approved_by,
                    requested_at,
                    approved_at,
                    processed_at,
                    metadata
                FROM refund_requests
                ORDER BY requested_at DESC
            """)

            refunds = cursor.fetchall()

    return {
        "count": len(refunds),
        "refund_requests": refunds,
    }


@router.get("/{refund_id}")
def get_refund_request(refund_id: str):
    with get_database_connection() as connection:
        with connection.cursor() as cursor:

            # First try Shopify order ID.
            cursor.execute("""
                SELECT
                    id,
                    shopify_order_id,
                    order_id,
                    refund_type,
                    requested_amount,
                    reason,
                    status,
                    requested_by,
                    approved_by,
                    requested_at,
                    approved_at,
                    processed_at,
                    metadata
                FROM refund_requests
                WHERE shopify_order_id = %s
                LIMIT 1
            """, (refund_id,))

            refund = cursor.fetchone()

            # If not found, try internal UUID.
            if refund is None:
                try:
                    cursor.execute("""
                        SELECT
                            id,
                            shopify_order_id,
                            order_id,
                            refund_type,
                            requested_amount,
                            reason,
                            status,
                            requested_by,
                            approved_by,
                            requested_at,
                            approved_at,
                            processed_at,
                            metadata
                        FROM refund_requests
                        WHERE id = %s::uuid
                        LIMIT 1
                    """, (refund_id,))

                    refund = cursor.fetchone()

                except Exception:
                    refund = None

    if refund is None:
        raise HTTPException(
            status_code=404,
            detail="Refund request not found",
        )

    return refund
