from fastapi import APIRouter, HTTPException
from app.database import get_database_connection
from app.schemas.order import (
    OrderResponse,
    OrderListResponse,
    OrderDetailResponse,
)

router = APIRouter(
    prefix="/api/v1/orders",
    tags=["Orders"],
)


@router.get("", response_model=OrderListResponse)
def get_orders():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    o.id,
                    o.shopify_order_id,
                    o.shopify_order_number,
                    o.customer_id,
                    c.first_name,
                    c.last_name,
                    c.email,
                    o.financial_status,
                    o.fulfillment_status,
                    o.currency,
                    o.subtotal_price,
                    o.total_tax,
                    o.total_shipping,
                    o.total_price,
                    o.cancelled_at,
                    o.created_at,
                    o.updated_at
                FROM orders o
                LEFT JOIN customers c
                    ON c.id = o.customer_id
                ORDER BY o.created_at DESC
            """)

            orders = cursor.fetchall()

    return {
        "count": len(orders),
        "orders": orders,
    }


@router.get("/{order_id}", response_model=OrderDetailResponse)
def get_order(order_id: str):
    with get_database_connection() as connection:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    o.id,
                    o.shopify_order_id,
                    o.shopify_order_number,
                    o.customer_id,
                    c.first_name,
                    c.last_name,
                    c.email,
                    o.financial_status,
                    o.fulfillment_status,
                    o.currency,
                    o.subtotal_price,
                    o.total_tax,
                    o.total_shipping,
                    o.total_price,
                    o.cancelled_at,
                    o.created_at,
                    o.updated_at
                FROM orders o
                LEFT JOIN customers c
                    ON c.id = o.customer_id
                WHERE o.shopify_order_id = %s
                LIMIT 1
            """, (order_id,))

            order = cursor.fetchone()

            if order is None:
                try:
                    cursor.execute("""
                        SELECT
                            o.id,
                            o.shopify_order_id,
                            o.shopify_order_number,
                            o.customer_id,
                            c.first_name,
                            c.last_name,
                            c.email,
                            o.financial_status,
                            o.fulfillment_status,
                            o.currency,
                            o.subtotal_price,
                            o.total_tax,
                            o.total_shipping,
                            o.total_price,
                            o.cancelled_at,
                            o.created_at,
                            o.updated_at
                        FROM orders o
                        LEFT JOIN customers c
                            ON c.id = o.customer_id
                        WHERE o.id = %s::uuid
                        LIMIT 1
                    """, (order_id,))

                    order = cursor.fetchone()

                except Exception:
                    order = None

            if order is None:
                raise HTTPException(
                    status_code=404,
                    detail="Order not found",
                )

            cursor.execute("""
                SELECT
                    id,
                    shopify_product_id,
                    shopify_variant_id,
                    product_title,
                    variant_title,
                    sku,
                    quantity,
                    unit_price,
                    total_price,
                    created_at
                FROM order_items
                WHERE order_id = %s
                ORDER BY created_at ASC
            """, (order["id"],))

            items = cursor.fetchall()

    return {
        "order": order,
        "items": items,
        "item_count": len(items),
    }