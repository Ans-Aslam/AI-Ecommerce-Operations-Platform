from app.schemas.customer import CustomerResponse, CustomerListResponse
from fastapi import APIRouter, HTTPException
from app.database import get_database_connection

router = APIRouter(
    prefix="/api/v1/customers",
    tags=["Customers"],
)


@router.get("", response_model=CustomerListResponse)
def get_customers():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    shopify_customer_id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    total_orders,
                    total_spend,
                    average_order_value,
                    last_purchase_at,
                    segment,
                    created_at,
                    updated_at
                FROM customers
                ORDER BY created_at DESC
            """)

            customers = cursor.fetchall()

    return {
        "count": len(customers),
        "customers": customers,
    }


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: str):
    with get_database_connection() as connection:
        with connection.cursor() as cursor:

            # First try the Shopify customer ID.
            cursor.execute("""
                SELECT
                    id,
                    shopify_customer_id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    total_orders,
                    total_spend,
                    average_order_value,
                    last_purchase_at,
                    segment,
                    created_at,
                    updated_at
                FROM customers
                WHERE shopify_customer_id = %s
                LIMIT 1
            """, (customer_id,))

            customer = cursor.fetchone()

            # If not found, try the internal UUID.
            if customer is None:
                try:
                    cursor.execute("""
                        SELECT
                            id,
                            shopify_customer_id,
                            first_name,
                            last_name,
                            email,
                            phone,
                            total_orders,
                            total_spend,
                            average_order_value,
                            last_purchase_at,
                            segment,
                            created_at,
                            updated_at
                        FROM customers
                        WHERE id = %s::uuid
                        LIMIT 1
                    """, (customer_id,))

                    customer = cursor.fetchone()

                except Exception:
                    customer = None

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return customer
