from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class OrderItemResponse(BaseModel):
    id: UUID
    shopify_product_id: str
    shopify_variant_id: str | None = None
    product_title: str
    variant_title: str | None = None
    sku: str | None = None
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    created_at: datetime


class OrderResponse(BaseModel):
    id: UUID
    shopify_order_id: str
    shopify_order_number: str
    customer_id: UUID | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    financial_status: str | None = None
    fulfillment_status: str | None = None
    currency: str
    subtotal_price: Decimal
    total_tax: Decimal
    total_shipping: Decimal
    total_price: Decimal
    cancelled_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class OrderListResponse(BaseModel):
    count: int
    orders: list[OrderResponse]


class OrderDetailResponse(BaseModel):
    order: OrderResponse
    items: list[OrderItemResponse]
    item_count: int