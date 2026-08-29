from datetime import datetime
from uuid import UUID
from typing import Any

from pydantic import BaseModel


class CustomerEventResponse(BaseModel):
    id: UUID
    customer_id: UUID | None = None
    shopify_customer_id: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    event_type: str
    source: str
    shopify_event_id: str | None = None
    metadata: Any | None = None
    created_at: datetime


class CustomerEventListResponse(BaseModel):
    count: int
    events: list[CustomerEventResponse]
