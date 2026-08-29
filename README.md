# AI E-commerce Operations Platform

Production-style e-commerce operations platform that consolidates and modernizes business automation capabilities originally developed across multiple Shopify and n8n projects.

The platform provides a centralized operations layer using **FastAPI, PostgreSQL, React, Docker, Shopify, and n8n-compatible workflow architecture**.

## Overview

The platform is designed to support common e-commerce operations including:

- Order operations
- Customer management
- Customer event tracking
- Fulfillment monitoring
- Inventory monitoring
- Low-stock detection
- Reorder recommendations
- Customer segmentation
- Abandoned checkout recovery
- Refund request management
- Cancellation exception management
- Workflow execution monitoring
- Workflow error tracking
- Automation action tracking
- Audit logging
- Operations dashboard visibility

## Architecture

```text
                    E-commerce / Automation Sources
                               │
                               ▼
                    Shopify APIs / Webhooks
                               │
                               ▼
                         n8n Workflows
                               │
                               ▼
                    ┌─────────────────────┐
                    │     FastAPI API     │
                    │                     │
                    │ Business endpoints  │
                    │ Validation          │
                    │ Error handling      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │                     │
                    │ Customers           │
                    │ Products            │
                    │ Inventory           │
                    │ Orders              │
                    │ Events              │
                    │ Workflow data       │
                    │ Automation data     │
                    └──────────┬──────────┘
                               │
                               ▼
                    React Operations Dashboard
                               │
                               ▼
                         Docker Compose