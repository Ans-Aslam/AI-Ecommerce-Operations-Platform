from fastapi import APIRouter, HTTPException
from app.database import get_database_connection
from app.schemas.inventory import InventoryResponse, InventoryListResponse

router = APIRouter(
    prefix="/api/v1/inventory",
    tags=["Inventory"],
)


@router.get("", response_model=InventoryListResponse)
def get_inventory():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    i.id,
                    i.product_id,
                    p.shopify_product_id,
                    p.title,
                    p.sku,
                    i.inventory_quantity,
                    i.reserved_quantity,
                    i.available_quantity,
                    i.inventory_status,
                    i.reorder_recommended,
                    i.reorder_quantity,
                    i.recorded_at
                FROM inventory i
                JOIN products p
                    ON p.id = i.product_id
                ORDER BY i.recorded_at DESC
            """)

            inventory = cursor.fetchall()

    return {
        "count": len(inventory),
        "inventory": inventory,
    }


@router.get("/{product_id}", response_model=InventoryResponse)
def get_inventory_by_product(product_id: str):
    with get_database_connection() as connection:
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    i.id,
                    i.product_id,
                    p.shopify_product_id,
                    p.title,
                    p.sku,
                    i.inventory_quantity,
                    i.reserved_quantity,
                    i.available_quantity,
                    i.inventory_status,
                    i.reorder_recommended,
                    i.reorder_quantity,
                    i.recorded_at
                FROM inventory i
                JOIN products p
                    ON p.id = i.product_id
                WHERE p.shopify_product_id = %s
                ORDER BY i.recorded_at DESC
                LIMIT 1
            """, (product_id,))

            inventory = cursor.fetchone()

            if inventory is None:
                try:
                    cursor.execute("""
                        SELECT
                            i.id,
                            i.product_id,
                            p.shopify_product_id,
                            p.title,
                            p.sku,
                            i.inventory_quantity,
                            i.reserved_quantity,
                            i.available_quantity,
                            i.inventory_status,
                            i.reorder_recommended,
                            i.reorder_quantity,
                            i.recorded_at
                        FROM inventory i
                        JOIN products p
                            ON p.id = i.product_id
                        WHERE p.id = %s::uuid
                        ORDER BY i.recorded_at DESC
                        LIMIT 1
                    """, (product_id,))

                    inventory = cursor.fetchone()

                except Exception:
                    inventory = None

    if inventory is None:
        raise HTTPException(
            status_code=404,
            detail="Inventory record not found",
        )

    return inventory
