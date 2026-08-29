import os
import psycopg
from psycopg.rows import dict_row


def get_database_connection():
    return psycopg.connect(
        host=os.getenv("POSTGRES_HOST", "postgres"),
        port=int(os.getenv("POSTGRES_PORT", "5432")),
        dbname=os.getenv("POSTGRES_DB", "ecommerce_platform"),
        user=os.getenv("POSTGRES_USER", "ecommerce_app"),
        password=os.getenv("POSTGRES_PASSWORD", "change_me"),
        row_factory=dict_row,
    )


def check_database_connection():
    with get_database_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 AS ok")
            result = cursor.fetchone()

    return result["ok"] == 1
