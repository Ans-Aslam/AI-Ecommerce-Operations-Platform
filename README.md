# AI E-commerce Operations Platform

Production-style e-commerce operations automation platform built around Shopify, n8n, FastAPI, PostgreSQL, and a lightweight operations dashboard.

## Overview

This project consolidates and productionizes business capabilities originally developed across multiple Shopify automation projects.

The platform is designed to automate:

- Order operations
- Customer communications
- Fulfillment notifications
- Inventory monitoring
- Low-stock alerts
- Reorder recommendations
- Customer segmentation
- Abandoned checkout recovery
- Refund and cancellation exception management
- Daily sales reporting
- Workflow monitoring
- Error handling
- Audit logging

## Architecture

The platform uses:

- Shopify APIs and webhooks
- n8n for workflow orchestration
- FastAPI for custom backend services
- PostgreSQL for persistent application data
- Docker for local production-style deployment
- A lightweight web dashboard for operations visibility

## Project Status

Currently in development.

The original Shopify automation workflows are preserved under:

`source-workflows/`

These workflows are used as functional references during the migration and refactoring process.

## Repository Structure

```text
backend/          FastAPI backend
database/         Database schema and migrations
docs/             Architecture and technical documentation
frontend/         Operations dashboard
n8n/              Production n8n workflows
scripts/          Development and utility scripts
tests/            Automated tests
audit/            Workflow audit tools and reports
source-workflows/ Original Projects 1–10