from uuid import UUID

from fastapi import APIRouter, HTTPException
from app.database import get_database_connection

router = APIRouter(
    prefix="/api/v1/abandoned-checkouts",
    tags=["Abandoned Checkouts"],
)


def fetch_checkout_by_uuid(checkout_id: str):
    try:
        UUID(checkout_id)
    except ValueError:
        return None

    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    ac.id,
                    ac.shopify_checkout_id,
                    ac.customer_id,
                    c.shopify_customer_id,
                    c.first_name,
                    c.last_name,
                    c.email AS customer_email,
                    ac.email,
                    ac.phone,
                    ac.total_price,
                    ac.recovery_status,
                    ac.recovery_attempts,
                    ac.last_recovery_at,
                    ac.recovered_at,
                    ac.created_at,
                    ac.updated_at
                FROM abandoned_checkouts ac
                LEFT JOIN customers c
                    ON c.id = ac.customer_id
                WHERE ac.id = %s
                LIMIT 1
            """, (checkout_id,))

            return cursor.fetchone()


def fetch_checkout_by_shopify_id(checkout_id: str):
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    ac.id,
                    ac.shopify_checkout_id,
                    ac.customer_id,
                    c.shopify_customer_id,
                    c.first_name,
                    c.last_name,
                    c.email AS customer_email,
                    ac.email,
                    ac.phone,
                    ac.total_price,
                    ac.recovery_status,
                    ac.recovery_attempts,
                    ac.last_recovery_at,
                    ac.recovered_at,
                    ac.created_at,
                    ac.updated_at
                FROM abandoned_checkouts ac
                LEFT JOIN customers c
                    ON c.id = ac.customer_id
                WHERE ac.shopify_checkout_id = %s
                LIMIT 1
            """, (checkout_id,))

            return cursor.fetchone()


@router.get("")
def get_abandoned_checkouts():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    ac.id,
                    ac.shopify_checkout_id,
                    ac.customer_id,
                    c.shopify_customer_id,
                    c.first_name,
                    c.last_name,
                    c.email AS customer_email,
                    ac.email,
                    ac.phone,
                    ac.total_price,
                    ac.recovery_status,
                    ac.recovery_attempts,
                    ac.last_recovery_at,
                    ac.recovered_at,
                    ac.created_at,
                    ac.updated_at
                FROM abandoned_checkouts ac
                LEFT JOIN customers c
                    ON c.id = ac.customer_id
                ORDER BY ac.created_at DESC
            """)

            checkouts = cursor.fetchall()

    return {
        "count": len(checkouts),
        "checkouts": checkouts,
    }


@router.get("/{checkout_id}")
def get_abandoned_checkout(checkout_id: str):

    checkout = fetch_checkout_by_uuid(checkout_id)

    if checkout is None:
        checkout = fetch_checkout_by_shopify_id(checkout_id)

    if checkout is None:
        raise HTTPException(
            status_code=404,
            detail="Abandoned checkout not found",
        )

    return checkout
