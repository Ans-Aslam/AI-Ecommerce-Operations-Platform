-- ============================================================
-- AI E-COMMERCE OPERATIONS PLATFORM
-- Demo Seed Data
-- ============================================================
-- IMPORTANT:
-- This file contains synthetic/demo data only.
-- Do NOT put real customer information or credentials here.
-- ============================================================

BEGIN;

-- ============================================================
-- CUSTOMERS
-- ============================================================

INSERT INTO customers (
    shopify_customer_id,
    first_name,
    last_name,
    email,
    phone,
    total_orders,
    total_spend,
    average_order_value,
    last_purchase_at
)
VALUES
(
    'demo_customer_001',
    'Ahmed',
    'Khan',
    'ahmed.demo@example.com',
    '+923000000001',
    8,
    1240.00,
    155.00,
    NOW() - INTERVAL '5 days'
),
(
    'demo_customer_002',
    'Sara',
    'Malik',
    'sara.demo@example.com',
    '+923000000002',
    4,
    520.00,
    130.00,
    NOW() - INTERVAL '18 days'
),
(
    'demo_customer_003',
    'Usman',
    'Ali',
    'usman.demo@example.com',
    '+923000000003',
    1,
    75.00,
    75.00,
    NOW() - INTERVAL '45 days'
),
(
    'demo_customer_004',
    'Ayesha',
    'Raza',
    'ayesha.demo@example.com',
    '+923000000004',
    12,
    2480.00,
    206.67,
    NOW() - INTERVAL '2 days'
)
ON CONFLICT (shopify_customer_id) DO NOTHING;


-- ============================================================
-- PRODUCTS
-- ============================================================

INSERT INTO products (
    shopify_product_id,
    title,
    sku,
    price,
    inventory_quantity,
    inventory_status
)
VALUES
(
    'demo_product_001',
    'Wireless Headphones',
    'WH-001',
    150.00,
    5,
    'active'
),
(
    'demo_product_002',
    'Mechanical Keyboard',
    'MK-001',
    120.00,
    20,
    'active'
),
(
    'demo_product_003',
    'USB-C Hub',
    'UCH-001',
    65.00,
    3,
    'active'
),
(
    'demo_product_004',
    'Laptop Stand',
    'LS-001',
    85.00,
    38,
    'active'
)
ON CONFLICT (shopify_product_id) DO NOTHING;

-- ============================================================
-- INVENTORY
-- ============================================================

INSERT INTO inventory (
    product_id,
    inventory_quantity,
    reserved_quantity,
    available_quantity,
    inventory_status,
    reorder_recommended,
    reorder_quantity
)
SELECT
    p.id,
    v.inventory_quantity,
    v.reserved_quantity,
    v.available_quantity,
    CASE
        WHEN v.available_quantity <= v.reorder_threshold THEN 'low_stock'
        ELSE 'healthy'
    END,
    v.available_quantity <= v.reorder_threshold,
    v.reorder_quantity
FROM (
    VALUES
        ('demo_product_001', 5, 1, 4, 10, 25),
        ('demo_product_002', 20, 2, 18, 10, 20),
        ('demo_product_003', 3, 1, 2, 8, 30),
        ('demo_product_004', 38, 3, 35, 10, 20)
) AS v(
    shopify_product_id,
    inventory_quantity,
    reserved_quantity,
    available_quantity,
    reorder_threshold,
    reorder_quantity
)
JOIN products p
    ON p.shopify_product_id = v.shopify_product_id;

-- ============================================================
-- ============================================================
-- ORDERS
-- ============================================================

INSERT INTO orders (
    shopify_order_id,
    shopify_order_number,
    customer_id,
    total_price,
    currency,
    financial_status,
    fulfillment_status,
    created_at
)
SELECT
    v.shopify_order_id,
    v.shopify_order_number,
    c.id,
    v.total_price,
    'USD',
    v.financial_status,
    v.fulfillment_status,
    NOW() - v.order_age
FROM (
    VALUES
        (
            'demo_order_001',
            '1001',
            'demo_customer_001',
            300.00,
            'paid',
            'fulfilled',
            INTERVAL '5 days'
        ),
        (
            'demo_order_002',
            '1002',
            'demo_customer_002',
            120.00,
            'paid',
            'fulfilled',
            INTERVAL '18 days'
        ),
        (
            'demo_order_003',
            '1003',
            'demo_customer_003',
            240.00,
            'paid',
            'unfulfilled',
            INTERVAL '2 days'
        ),
        (
            'demo_order_004',
            '1004',
            'demo_customer_004',
            75.00,
            'pending',
            'unfulfilled',
            INTERVAL '1 day'
        )
) AS v(
    shopify_order_id,
    shopify_order_number,
    customer_key,
    total_price,
    financial_status,
    fulfillment_status,
    order_age
)
JOIN customers c
    ON c.shopify_customer_id = v.customer_key
ON CONFLICT (shopify_order_id) DO NOTHING;


-- ============================================================

-- ============================================================

INSERT INTO order_items (
    order_id,
    shopify_product_id,
    product_title,
    sku,
    quantity,
    unit_price,
    total_price
)
SELECT
    o.id,
    p.shopify_product_id,
    p.title,
    p.sku,
    v.quantity,
    v.unit_price,
    v.quantity * v.unit_price
FROM (
    VALUES
        ('demo_order_001', 'demo_product_001', 2, 150.00),
        ('demo_order_002', 'demo_product_002', 1, 120.00),
        ('demo_order_003', 'demo_product_001', 1, 150.00),
        ('demo_order_003', 'demo_product_004', 1, 90.00),
        ('demo_order_004', 'demo_product_003', 1, 65.00)
) AS v(
    order_key,
    product_key,
    quantity,
    unit_price
)
JOIN orders o
    ON o.shopify_order_id = v.order_key
JOIN products p
    ON p.shopify_product_id = v.product_key;
-- ============================================================
-- CUSTOMER EVENTS
-- ============================================================

INSERT INTO customer_events (
    customer_id,
    event_type,
    source,
    shopify_event_id,
    metadata,
    created_at
)
SELECT
    c.id,
    v.event_type,
    'demo_seed',
    v.shopify_event_id,
    v.metadata::jsonb,
    NOW() - v.event_age
FROM (
    VALUES
        (
            'demo_customer_001',
            'order_completed',
            'demo_event_001',
            '{"order_number":"1001","value":300}',
            INTERVAL '5 days'
        ),
        (
            'demo_customer_002',
            'order_completed',
            'demo_event_002',
            '{"order_number":"1002","value":120}',
            INTERVAL '18 days'
        ),
        (
            'demo_customer_003',
            'checkout_abandoned',
            'demo_event_003',
            '{"checkout_id":"demo_checkout_001","value":85}',
            INTERVAL '2 days'
        ),
        (
            'demo_customer_004',
            'order_completed',
            'demo_event_004',
            '{"order_number":"1003","value":240}',
            INTERVAL '2 days'
        )
) AS v(
    customer_key,
    event_type,
    shopify_event_id,
    metadata,
    event_age
)
JOIN customers c
    ON c.shopify_customer_id = v.customer_key;

-- ============================================================
-- ABANDONED CHECKOUTS
-- ============================================================

INSERT INTO abandoned_checkouts (
    shopify_checkout_id,
    customer_id,
    email,
    total_price,
    recovery_status,
    created_at
)
SELECT
    'demo_checkout_001',
    c.id,
    'usman.demo@example.com',
    85.00,
    'pending',
    NOW() - INTERVAL '2 days'
FROM customers c
WHERE c.shopify_customer_id = 'demo_customer_003'
ON CONFLICT (shopify_checkout_id) DO NOTHING;

-- ============================================================
-- REFUND REQUEST
-- ============================================================

INSERT INTO refund_requests (
    shopify_order_id,
    order_id,
    refund_type,
    requested_amount,
    reason,
    status,
    requested_by,
    requested_at,
    metadata
)
SELECT
    'demo_order_002',
    o.id,
    'full',
    120.00,
    'Customer requested refund',
    'pending',
    'demo_customer',
    NOW() - INTERVAL '6 hours',
    '{"source":"demo_seed","approval_required":true}'::jsonb
FROM orders o
WHERE o.shopify_order_id = 'demo_order_002'
AND NOT EXISTS (
    SELECT 1
    FROM refund_requests r
    WHERE r.shopify_order_id = 'demo_order_002'
);

-- ============================================================
-- WORKFLOW RUNS
-- ============================================================

INSERT INTO workflow_runs (
    workflow_name,
    trigger_type,
    status,
    started_at,
    finished_at
)
VALUES
(
    'order_confirmation',
    'shopify_order',
    'success',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '3 seconds'
),
(
    'fulfillment_notification',
    'shopify_fulfillment',
    'success',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '4 seconds'
),
(
    'inventory_monitoring',
    'scheduled',
    'success',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '1 hour' + INTERVAL '8 seconds'
),
(
    'abandoned_checkout_recovery',
    'scheduled',
    'failed',
    NOW() - INTERVAL '30 minutes',
    NOW() - INTERVAL '29 minutes'
);


-- ============================================================
-- WORKFLOW ERROR
-- ============================================================

INSERT INTO workflow_errors (
    workflow_run_id,
    workflow_name,
    error_type,
    error_message,
    node_name,
    retry_count,
    resolved,
    error_data
)
SELECT
    wr.id,
    wr.workflow_name,
    'notification_failure',
    'Demo notification provider timeout',
    'Send WhatsApp Notification',
    2,
    FALSE,
    '{"source":"demo_seed","provider":"whatsapp","retryable":true}'::jsonb
FROM workflow_runs wr
WHERE wr.workflow_name = 'abandoned_checkout_recovery'
  AND wr.status = 'failed'
LIMIT 1;

-- ============================================================
-- AUTOMATION ACTIONS
-- ============================================================

INSERT INTO automation_actions (
    workflow_run_id,
    action_type,
    target_type,
    target_id,
    status,
    provider,
    request_data,
    response_data
)
SELECT
    wr.id,
    'send_notification',
    'customer',
    c.id::text,
    'success',
    'whatsapp',
    '{"channel":"whatsapp","demo":true}'::jsonb,
    '{"status":"sent","demo":true}'::jsonb
FROM workflow_runs wr
JOIN customers c
    ON c.shopify_customer_id = 'demo_customer_001'
WHERE wr.workflow_name = 'order_confirmation'
LIMIT 1;


-- ============================================================
-- AUDIT LOG-- ============================================================
-- AUDIT LOG
-- ============================================================

INSERT INTO audit_logs (
    action,
    entity_type,
    entity_id,
    actor_type,
    actor_id,
    metadata
)
SELECT
    'order_confirmation_sent',
    'order',
    o.id::text,
    'system',
    'demo-workflow',
    '{"channel":"whatsapp","result":"success","demo":true}'::jsonb
FROM orders o
WHERE o.shopify_order_id = 'demo_order_001'
LIMIT 1;


COMMIT;












