from uuid import UUID

from fastapi import APIRouter, HTTPException
from app.database import get_database_connection
from app.schemas.customer_event import (
    CustomerEventResponse,
    CustomerEventListResponse,
)

router = APIRouter(
    prefix="/api/v1/customer-events",
    tags=["Customer Events"],
)


def fetch_event_by_uuid(event_id: str):
    try:
        UUID(event_id)
    except ValueError:
        return None

    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    ce.id,
                    ce.customer_id,
                    c.shopify_customer_id,
                    c.first_name,
                    c.last_name,
                    c.email,
                    ce.event_type,
                    ce.source,
                    ce.shopify_event_id,
                    ce.metadata,
                    ce.created_at
                FROM customer_events ce
                LEFT JOIN customers c
                    ON c.id = ce.customer_id
                WHERE ce.id = %s
                LIMIT 1
            """, (event_id,))

            return cursor.fetchone()


def fetch_event_by_shopify_id(event_id: str):
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    ce.id,
                    ce.customer_id,
                    c.shopify_customer_id,
                    c.first_name,
                    c.last_name,
                    c.email,
                    ce.event_type,
                    ce.source,
                    ce.shopify_event_id,
                    ce.metadata,
                    ce.created_at
                FROM customer_events ce
                LEFT JOIN customers c
                    ON c.id = ce.customer_id
                WHERE ce.shopify_event_id = %s
                LIMIT 1
            """, (event_id,))

            return cursor.fetchone()


@router.get("", response_model=CustomerEventListResponse)
def get_customer_events():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    ce.id,
                    ce.customer_id,
                    c.shopify_customer_id,
                    c.first_name,
                    c.last_name,
                    c.email,
                    ce.event_type,
                    ce.source,
                    ce.shopify_event_id,
                    ce.metadata,
                    ce.created_at
                FROM customer_events ce
                LEFT JOIN customers c
                    ON c.id = ce.customer_id
                ORDER BY ce.created_at DESC
            """)

            events = cursor.fetchall()

    return {
        "count": len(events),
        "events": events,
    }


@router.get("/{event_id}", response_model=CustomerEventResponse)
def get_customer_event(event_id: str):

    event = fetch_event_by_uuid(event_id)

    if event is None:
        event = fetch_event_by_shopify_id(event_id)

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Customer event not found",
        )

    return event
