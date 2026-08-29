from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


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


def test_customers_endpoint():
    response = client.get("/api/v1/customers")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["customers"], list)
    assert data["count"] == len(data["customers"])


def test_products_endpoint():
    response = client.get("/api/v1/products")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["products"], list)
    assert data["count"] == len(data["products"])


def test_inventory_endpoint():
    response = client.get("/api/v1/inventory")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["inventory"], list)
    assert data["count"] == len(data["inventory"])


def test_orders_endpoint():
    response = client.get("/api/v1/orders")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["orders"], list)
    assert data["count"] == len(data["orders"])


def test_customer_events_endpoint():
    response = client.get("/api/v1/customer-events")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["events"], list)
    assert data["count"] == len(data["events"])


def test_abandoned_checkouts_endpoint():
    response = client.get("/api/v1/abandoned-checkouts")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["checkouts"], list)
    assert data["count"] == len(data["checkouts"])


def test_refund_requests_endpoint():
    response = client.get("/api/v1/refund-requests")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["refund_requests"], list)
    assert data["count"] == len(data["refund_requests"])


def test_workflow_runs_endpoint():
    response = client.get("/api/v1/workflow-runs")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["workflow_runs"], list)
    assert data["count"] == len(data["workflow_runs"])


def test_workflow_errors_endpoint():
    response = client.get("/api/v1/workflow-errors")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["workflow_errors"], list)
    assert data["count"] == len(data["workflow_errors"])


def test_automation_actions_endpoint():
    response = client.get("/api/v1/automation-actions")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)
    assert isinstance(data["automation_actions"], list)
    assert data["count"] == len(data["automation_actions"])
