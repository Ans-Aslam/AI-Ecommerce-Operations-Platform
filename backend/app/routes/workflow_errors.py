from uuid import UUID

from fastapi import APIRouter, HTTPException
from app.database import get_database_connection

router = APIRouter(
    prefix="/api/v1/workflow-errors",
    tags=["Workflow Errors"],
)


@router.get("")
def get_workflow_errors():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    we.id,
                    we.workflow_run_id,
                    we.workflow_name,
                    we.error_type,
                    we.error_message,
                    we.node_name,
                    we.retry_count,
                    we.resolved,
                    we.error_data,
                    we.created_at,
                    we.resolved_at
                FROM workflow_errors we
                ORDER BY we.created_at DESC
            """)

            errors = cursor.fetchall()

    return {
        "count": len(errors),
        "workflow_errors": errors,
    }


@router.get("/{error_id}")
def get_workflow_error(error_id: str):

    # Validate UUID before querying PostgreSQL.
    try:
        UUID(error_id)
    except ValueError:
        raise HTTPException(
            status_code=404,
            detail="Workflow error not found",
        )

    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    we.id,
                    we.workflow_run_id,
                    we.workflow_name,
                    we.error_type,
                    we.error_message,
                    we.node_name,
                    we.retry_count,
                    we.resolved,
                    we.error_data,
                    we.created_at,
                    we.resolved_at
                FROM workflow_errors we
                WHERE we.id = %s
                LIMIT 1
            """, (error_id,))

            error = cursor.fetchone()

    if error is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow error not found",
        )

    return error
