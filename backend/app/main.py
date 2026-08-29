from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.customers import router as customers_router
from app.routes.products import router as products_router
from app.routes.inventory import router as inventory_router
from app.routes.orders import router as orders_router
from app.routes.customer_events import router as customer_events_router
from app.routes.abandoned_checkouts import router as abandoned_checkouts_router
from app.routes.refund_requests import router as refund_requests_router
from app.routes.workflow_runs import router as workflow_runs_router
from app.routes.workflow_errors import router as workflow_errors_router
from app.routes.automation_actions import router as automation_actions_router


app = FastAPI(
    title="AI E-Commerce Operations Platform API",
    version="1.0.0",
    description="Backend API for the AI E-Commerce Operations Platform.",
)


# Allow the React frontend to communicate with the FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health_router)
app.include_router(customers_router)
app.include_router(products_router)
app.include_router(inventory_router)
app.include_router(orders_router)
app.include_router(customer_events_router)
app.include_router(abandoned_checkouts_router)
app.include_router(refund_requests_router)
app.include_router(workflow_runs_router)
app.include_router(workflow_errors_router)
app.include_router(automation_actions_router)


@app.get("/")
def root():
    return {
        "service": "AI E-Commerce Operations Platform API",
        "status": "running",
        "version": "1.0.0",
    }