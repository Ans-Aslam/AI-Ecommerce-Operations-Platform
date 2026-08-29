-- ============================================================
-- AI E-COMMERCE OPERATIONS PLATFORM
-- Initial PostgreSQL Schema
-- Migration: 001_initial_schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CUSTOMERS
-- ============================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    shopify_customer_id TEXT UNIQUE NOT NULL,

    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,

    total_orders INTEGER NOT NULL DEFAULT 0,
    total_spend NUMERIC(14,2) NOT NULL DEFAULT 0,
    average_order_value NUMERIC(14,2) NOT NULL DEFAULT 0,

    last_purchase_at TIMESTAMPTZ,

    segment TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email
    ON customers(email);

CREATE INDEX IF NOT EXISTS idx_customers_segment
    ON customers(segment);


-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    shopify_order_id TEXT UNIQUE NOT NULL,
    shopify_order_number TEXT,

    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

    financial_status TEXT,
    fulfillment_status TEXT,

    currency TEXT,

    subtotal_price NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_tax NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_shipping NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_price NUMERIC(14,2) NOT NULL DEFAULT 0,

    cancelled_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id
    ON orders(customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_created_at
    ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_financial_status
    ON orders(financial_status);

CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status
    ON orders(fulfillment_status);


-- ============================================================
-- ORDER ITEMS
-- ============================================================

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES orders(id)
        ON DELETE CASCADE,

    shopify_product_id TEXT,
    shopify_variant_id TEXT,

    product_title TEXT,
    variant_title TEXT,

    sku TEXT,

    quantity INTEGER NOT NULL DEFAULT 1,

    unit_price NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_price NUMERIC(14,2) NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_product_id
    ON order_items(shopify_product_id);


-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    shopify_product_id TEXT UNIQUE NOT NULL,
    shopify_variant_id TEXT UNIQUE,

    title TEXT NOT NULL,
    sku TEXT,

    price NUMERIC(14,2) NOT NULL DEFAULT 0,

    inventory_quantity INTEGER NOT NULL DEFAULT 0,

    reorder_threshold INTEGER NOT NULL DEFAULT 10,
    reorder_quantity INTEGER NOT NULL DEFAULT 50,

    inventory_status TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_inventory_status
    ON products(inventory_status);

CREATE INDEX IF NOT EXISTS idx_products_sku
    ON products(sku);


-- ============================================================
-- INVENTORY
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    product_id UUID NOT NULL
        REFERENCES products(id)
        ON DELETE CASCADE,

    inventory_quantity INTEGER NOT NULL DEFAULT 0,

    reserved_quantity INTEGER NOT NULL DEFAULT 0,

    available_quantity INTEGER NOT NULL DEFAULT 0,

    inventory_status TEXT,

    reorder_recommended BOOLEAN NOT NULL DEFAULT FALSE,

    reorder_quantity INTEGER,

    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id
    ON inventory(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_recorded_at
    ON inventory(recorded_at);


-- ============================================================
-- CUSTOMER EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS customer_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    customer_id UUID
        REFERENCES customers(id)
        ON DELETE SET NULL,

    event_type TEXT NOT NULL,

    source TEXT,

    shopify_event_id TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_events_customer_id
    ON customer_events(customer_id);

CREATE INDEX IF NOT EXISTS idx_customer_events_event_type
    ON customer_events(event_type);

CREATE INDEX IF NOT EXISTS idx_customer_events_created_at
    ON customer_events(created_at);


-- ============================================================
-- ABANDONED CHECKOUTS
-- ============================================================

CREATE TABLE IF NOT EXISTS abandoned_checkouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    shopify_checkout_id TEXT UNIQUE NOT NULL,

    customer_id UUID
        REFERENCES customers(id)
        ON DELETE SET NULL,

    email TEXT,
    phone TEXT,

    total_price NUMERIC(14,2) NOT NULL DEFAULT 0,

    recovery_status TEXT NOT NULL DEFAULT 'pending',

    recovery_attempts INTEGER NOT NULL DEFAULT 0,

    last_recovery_at TIMESTAMPTZ,

    recovered_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_status
    ON abandoned_checkouts(recovery_status);


-- ============================================================
-- WORKFLOW RUNS
-- ============================================================

CREATE TABLE IF NOT EXISTS workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_name TEXT NOT NULL,

    n8n_execution_id TEXT,

    trigger_type TEXT,

    status TEXT NOT NULL,

    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,

    duration_ms INTEGER,

    input_data JSONB,
    output_data JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow_name
    ON workflow_runs(workflow_name);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_status
    ON workflow_runs(status);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_started_at
    ON workflow_runs(started_at);


-- ============================================================
-- WORKFLOW ERRORS
-- ============================================================

CREATE TABLE IF NOT EXISTS workflow_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_run_id UUID
        REFERENCES workflow_runs(id)
        ON DELETE SET NULL,

    workflow_name TEXT NOT NULL,

    error_type TEXT,

    error_message TEXT NOT NULL,

    node_name TEXT,

    retry_count INTEGER NOT NULL DEFAULT 0,

    resolved BOOLEAN NOT NULL DEFAULT FALSE,

    error_data JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_workflow_errors_workflow_name
    ON workflow_errors(workflow_name);

CREATE INDEX IF NOT EXISTS idx_workflow_errors_resolved
    ON workflow_errors(resolved);


-- ============================================================
-- REFUND REQUESTS
-- ============================================================

CREATE TABLE IF NOT EXISTS refund_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    shopify_order_id TEXT NOT NULL,

    order_id UUID
        REFERENCES orders(id)
        ON DELETE SET NULL,

    refund_type TEXT,

    requested_amount NUMERIC(14,2),

    reason TEXT,

    status TEXT NOT NULL DEFAULT 'pending',

    requested_by TEXT,

    approved_by TEXT,

    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    approved_at TIMESTAMPTZ,

    processed_at TIMESTAMPTZ,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_refund_requests_status
    ON refund_requests(status);

CREATE INDEX IF NOT EXISTS idx_refund_requests_order_id
    ON refund_requests(order_id);


-- ============================================================
-- AUTOMATION ACTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS automation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workflow_run_id UUID
        REFERENCES workflow_runs(id)
        ON DELETE SET NULL,

    action_type TEXT NOT NULL,

    target_type TEXT,
    target_id TEXT,

    status TEXT NOT NULL,

    provider TEXT,

    request_data JSONB,
    response_data JSONB,

    error_message TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_automation_actions_workflow_run
    ON automation_actions(workflow_run_id);

CREATE INDEX IF NOT EXISTS idx_automation_actions_action_type
    ON automation_actions(action_type);

CREATE INDEX IF NOT EXISTS idx_automation_actions_status
    ON automation_actions(status);


-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    actor_type TEXT NOT NULL,

    actor_id TEXT,

    action TEXT NOT NULL,

    entity_type TEXT,

    entity_id TEXT,

    status TEXT,

    description TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
    ON audit_logs(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
    ON audit_logs(created_at);


-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS customers_updated_at
    ON customers;

CREATE TRIGGER customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS orders_updated_at
    ON orders;

CREATE TRIGGER orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS products_updated_at
    ON products;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS abandoned_checkouts_updated_at
    ON abandoned_checkouts;

CREATE TRIGGER abandoned_checkouts_updated_at
BEFORE UPDATE ON abandoned_checkouts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================