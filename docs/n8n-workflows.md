# n8n Production Workflows

The AI E-Commerce Operations Platform uses n8n as the workflow orchestration layer.

The production workflow set is based on the consolidated Project 10 architecture.

## Workflow Overview

| Workflow | Purpose |
|---|---|
| 10-A Order Automation | Handles Shopify order-related automation and downstream operations |
| 10-B Fulfillment Automation | Handles fulfillment and shipping-related automation |
| 10-C Inventory Monitoring | Monitors inventory levels and triggers reorder-related operations |
| 10-D Refund Automation | Handles refund-related automation and exception processing |
| 10-E Daily Reporting | Generates scheduled operational sales/reporting data |
| 10-F Error Handler | Centralizes workflow error handling and operational failure processing |

## Architecture

```text
Shopify
   |
   v
n8n Workflows
   |
   +-- Order Automation
   +-- Fulfillment Automation
   +-- Inventory Monitoring
   +-- Refund Automation
   +-- Daily Reporting
   +-- Error Handler
   |
   v
AI E-Commerce Operations Platform
   |
   +-- FastAPI
   +-- PostgreSQL
   +-- Operations Dashboard
   +-- Audit / Workflow Monitoring