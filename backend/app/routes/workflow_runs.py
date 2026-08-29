from uuid import UUID

from fastapi import APIRouter, HTTPException
from app.database import get_database_connection

router = APIRouter(
    prefix="/api/v1/workflow-runs",
    tags=["Workflow Runs"],
)


@router.get("")
def get_workflow_runs():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    workflow_name,
                    trigger_type,
                    status,
                    started_at,
                    finished_at
                FROM workflow_runs
                ORDER BY started_at DESC
            """)

            workflow_runs = cursor.fetchall()

    return {
        "count": len(workflow_runs),
        "workflow_runs": workflow_runs,
    }


@router.get("/{workflow_run_id}")
def get_workflow_run(workflow_run_id: str):

    # Validate UUID before sending it to PostgreSQL.
    try:
        UUID(workflow_run_id)
    except ValueError:
        raise HTTPException(
            status_code=404,
            detail="Workflow run not found",
        )

    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    workflow_name,
                    trigger_type,
                    status,
                    started_at,
                    finished_at
                FROM workflow_runs
                WHERE id = %s
                LIMIT 1
            """, (workflow_run_id,))

            workflow_run = cursor.fetchone()

    if workflow_run is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow run not found",
        )

    return workflow_run
