# AI E-Commerce Operations Platform

A production-style e-commerce operations platform that centralizes Shopify business operations, workflow automation, operational monitoring, and API-driven data access into a single system.

The platform combines **FastAPI, PostgreSQL, React, Nginx, Docker, Shopify, and n8n** to provide a structured operations layer for modern e-commerce businesses.

---

## Overview

E-commerce businesses often operate across multiple disconnected systems for orders, customers, inventory, fulfillment, refunds, automation, and operational monitoring.

This platform consolidates those operational capabilities into one backend and dashboard architecture.

It provides:

- Customer management
- Product management
- Inventory monitoring
- Order management
- Customer event tracking
- Abandoned checkout monitoring
- Refund request management
- Workflow execution monitoring
- Workflow error tracking
- Automation action tracking
- Audit logging
- Shopify/n8n automation integration
- API-key protected backend endpoints
- React operations dashboard
- Dockerized local/deployment environment
- Automated CI testing
- Docker image validation

---

## Architecture

```text
                         E-COMMERCE SOURCES
                                |
                                v
                    +------------------------+
                    | Shopify / Webhooks     |
                    +-----------+------------+
                                |
                                v
                    +------------------------+
                    |    n8n Automation      |
                    |------------------------|
                    | Order Automation        |
                    | Fulfillment Automation  |
                    | Inventory Monitoring    |
                    | Refund Automation       |
                    | Daily Reporting         |
                    | Error Handler           |
                    +-----------+------------+
                                |
                                v
                    +------------------------+
                    |      FastAPI API        |
                    |------------------------|
                    | REST Endpoints          |
                    | API Authentication      |
                    | Business Logic          |
                    | Validation              |
                    | Error Handling          |
                    +-----------+------------+
                                |
                                v
                    +------------------------+
                    |     PostgreSQL 16       |
                    |------------------------|
                    | Customers               |
                    | Products                |
                    | Inventory               |
                    | Orders                  |
                    | Customer Events         |
                    | Abandoned Checkouts     |
                    | Refund Requests         |
                    | Workflow Runs           |
                    | Workflow Errors         |
                    | Automation Actions      |
                    | Audit Logs              |
                    +------------------------+

                                ^
                                |
                    +-----------+------------+
                    |     Nginx / React      |
                    |   Operations Dashboard |
                    +------------------------+
                                ^
                                |
                             Browser