from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class ProductResponse(BaseModel):
    id: UUID
    shopify_product_id: str
    shopify_variant_id: str | None = None
    title: str
    sku: str
    price: Decimal
    inventory_quantity: int
    reorder_threshold: int
    reorder_quantity: int
    inventory_status: str | None = None
    created_at: datetime
    updated_at: datetime


class ProductListResponse(BaseModel):
    count: int
    products: list[ProductResponse]