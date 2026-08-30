import os

from fastapi.testclient import TestClient

os.environ["API_SECRET_KEY"] = "test-api-key"

from app.main import app


client = TestClient(app)
API_HEADERS = {"X-API-Key": "test-api-key"}


def test_root():
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["service"] == "AI E-Commerce Operations Platform API"
    assert data["status"] == "running"
    assert data["version"] == "1.0.0"


def test_health():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["service"] == "ecommerce-api"
    assert data["database"] == "connected"

def test_api_key_authentication():
    valid_response = client.get(
        "/api/v1/customers",
        headers=API_HEADERS,
    )
    assert valid_response.status_code == 200

    missing_key_response = client.get("/api/v1/customers")
    assert missing_key_response.status_code == 401

    invalid_key_response = client.get(
        "/api/v1/customers",
        headers={"X-API-Key": "wrong-key"},
    )
    assert invalid_key_response.status_code == 401


def test_customers_endpoint():
    response = client.get("/api/v1/customers", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_products_endpoint():
    response = client.get("/api/v1/products", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_inventory_endpoint():
    response = client.get("/api/v1/inventory", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_orders_endpoint():
    response = client.get("/api/v1/orders", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_customer_events_endpoint():
    response = client.get("/api/v1/customer-events", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_abandoned_checkouts_endpoint():
    response = client.get("/api/v1/abandoned-checkouts", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_refund_requests_endpoint():
    response = client.get("/api/v1/refund-requests", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_workflow_runs_endpoint():
    response = client.get("/api/v1/workflow-runs", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_workflow_errors_endpoint():
    response = client.get("/api/v1/workflow-errors", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_automation_actions_endpoint():
    response = client.get("/api/v1/automation-actions", headers=API_HEADERS)

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_protected_endpoint_without_api_key():
    response = client.get("/api/v1/customers")

    assert response.status_code == 401


def test_protected_endpoint_with_invalid_api_key():
    response = client.get(
        "/api/v1/customers",
        headers={"X-API-Key": "wrong-key"},
    )

    assert response.status_code == 401
