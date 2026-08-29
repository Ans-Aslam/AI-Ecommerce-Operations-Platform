# Architecture

## System Overview

The AI E-commerce Operations Platform is a production-style operations system that consolidates business automation capabilities originally developed across Shopify and n8n workflows.

The current platform is organized into four primary application layers:

```text
┌───────────────────────────────────────────────┐
│              Shopify / n8n Layer              │
│       APIs, Webhooks, Automation Workflows   │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│                 FastAPI API                   │
│                                               │
│ Customers │ Products │ Inventory │ Orders     │
│ Events    │ Refunds  │ Workflows │ Automation │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│                PostgreSQL                     │
│                                               │
│ Operational data, workflow data, audit data   │
│ and demo/seed data                             │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│             React Operations UI                │
│                                               │
│ Operational visibility and dashboard views    │
└───────────────────────────────────────────────┘