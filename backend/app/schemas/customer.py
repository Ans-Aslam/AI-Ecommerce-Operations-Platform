from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class CustomerResponse(BaseModel):
    id: UUID
    shopify_customer_id: str
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    phone: str | None = None
    total_orders: int
    total_spend: Decimal
    average_order_value: Decimal
    last_purchase_at: datetime | None = None
    segment: str | None = None
    created_at: datetime
    updated_at: datetime


class CustomerListResponse(BaseModel):
    count: int
    customers: list[CustomerResponse]
