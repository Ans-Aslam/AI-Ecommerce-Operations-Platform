from fastapi import APIRouter, HTTPException
from app.database import get_database_connection
from app.schemas.product import ProductResponse, ProductListResponse

router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products"],
)


@router.get("", response_model=ProductListResponse)
def get_products():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    shopify_product_id,
                    shopify_variant_id,
                    title,
                    sku,
                    price,
                    inventory_quantity,
                    reorder_threshold,
                    reorder_quantity,
                    inventory_status,
                    created_at,
                    updated_at
                FROM products
                ORDER BY created_at DESC
            """)

            products = cursor.fetchall()

    return {
        "count": len(products),
        "products": products,
    }


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str):
    with get_database_connection() as connection:
        with connection.cursor() as cursor:

            # First try the Shopify product ID.
            cursor.execute("""
                SELECT
                    id,
                    shopify_product_id,
                    shopify_variant_id,
                    title,
                    sku,
                    price,
                    inventory_quantity,
                    reorder_threshold,
                    reorder_quantity,
                    inventory_status,
                    created_at,
                    updated_at
                FROM products
                WHERE shopify_product_id = %s
                LIMIT 1
            """, (product_id,))

            product = cursor.fetchone()

            # If not found, try the internal UUID.
            if product is None:
                try:
                    cursor.execute("""
                        SELECT
                            id,
                            shopify_product_id,
                            shopify_variant_id,
                            title,
                            sku,
                            price,
                            inventory_quantity,
                            reorder_threshold,
                            reorder_quantity,
                            inventory_status,
                            created_at,
                            updated_at
                        FROM products
                        WHERE id = %s::uuid
                        LIMIT 1
                    """, (product_id,))

                    product = cursor.fetchone()

                except Exception:
                    product = None

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product
