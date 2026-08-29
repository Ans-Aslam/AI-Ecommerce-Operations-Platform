from fastapi import APIRouter, HTTPException

from app.database import get_database_connection


router = APIRouter(
    prefix="/api/v1/automation-actions",
    tags=["Automation Actions"],
)


@router.get("")
def get_automation_actions():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    id,
                    workflow_run_id,
                    action_type,
                    target_type,
                    target_id,
                    status,
                    provider,
                    request_data,
                    response_data,
                    error_message,
                    created_at,
                    completed_at
                FROM automation_actions
                ORDER BY created_at DESC
            """)

            actions = cursor.fetchall()

    return {
        "count": len(actions),
        "automation_actions": actions,
    }


@router.get("/{action_id}")
def get_automation_action(action_id: str):
    with get_database_connection() as connection:
        with connection.cursor() as cursor:

            try:
                cursor.execute("""
                    SELECT
                        id,
                        workflow_run_id,
                        action_type,
                        target_type,
                        target_id,
                        status,
                        provider,
                        request_data,
                        response_data,
                        error_message,
                        created_at,
                        completed_at
                    FROM automation_actions
                    WHERE id = %s::uuid
                    LIMIT 1
                """, (action_id,))

                action = cursor.fetchone()

            except Exception:
                action = None

    if action is None:
        raise HTTPException(
            status_code=404,
            detail="Automation action not found",
        )

    return action