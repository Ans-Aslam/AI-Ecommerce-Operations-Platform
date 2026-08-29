from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class InventoryResponse(BaseModel):
    id: UUID
    product_id: UUID
    shopify_product_id: str
    title: str
    sku: str
    inventory_quantity: int
    reserved_quantity: int
    available_quantity: int
    inventory_status: str | None = None
    reorder_recommended: bool
    reorder_quantity: int
    recorded_at: datetime


class InventoryListResponse(BaseModel):
    count: int
    inventory: list[InventoryResponse]
